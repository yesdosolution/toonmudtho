const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'web', 'qa_screenshots');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function sendCDP(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000);
    const handler = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      } catch (e) {
        // ignore
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const versionRes = await fetch('http://localhost:9222/json/version');
  const versionData = await versionRes.json();
  console.log('Browser:', versionData.Browser);

  const listRes = await fetch('http://localhost:9222/json/list');
  const listData = await listRes.json();
  const pageTarget = listData.find(t => t.type === 'page') || listData[0];
  console.log('Target Page:', pageTarget.url);

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));
  console.log('Connected to CDP WebSocket');

  await sendCDP(ws, 'Page.enable');
  await sendCDP(ws, 'DOM.enable');
  await sendCDP(ws, 'Runtime.enable');

  const report = {
    viewports: {},
    screenshots: {},
    functional: {},
    accessibility: {}
  };

  const VIEWPORTS = [
    { name: '320px Mobile Small', width: 320, height: 600, mobile: true },
    { name: '360px Mobile', width: 360, height: 740, mobile: true },
    { name: '375px Mobile', width: 375, height: 667, mobile: true },
    { name: '390px Mobile', width: 390, height: 844, mobile: true },
    { name: '414px Mobile', width: 414, height: 896, mobile: true },
    { name: '768px Tablet', width: 768, height: 1024, mobile: false },
    { name: '1024px Small Desktop', width: 1024, height: 768, mobile: false },
    { name: '1280px Desktop', width: 1280, height: 800, mobile: false },
    { name: '1440px Desktop', width: 1440, height: 900, mobile: false }
  ];

  console.log('\n--- 1. RESPONSIVE TEST MATRIX ---');
  for (const vp of VIEWPORTS) {
    await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.mobile
    });
    await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:8080/' });
    await sleep(600);

    const evalRes = await sendCDP(ws, 'Runtime.evaluate', {
      expression: `
        (() => {
          const w = window.innerWidth;
          const docW = document.documentElement.scrollWidth;
          const overflowingElements = [];

          const all = document.querySelectorAll('body *');
          for (const el of all) {
            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;
            if (style.position === 'fixed') continue;

            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              if (rect.right > w + 1.5) {
                overflowingElements.push({
                  tag: el.tagName.toLowerCase(),
                  id: el.id,
                  className: el.className,
                  right: rect.right,
                  width: rect.width,
                  excess: Math.round(rect.right - w)
                });
              }
            }
          }

          const heroTitle = document.querySelector('.hero-title');
          const heroTitleRect = heroTitle ? heroTitle.getBoundingClientRect() : null;

          return {
            windowWidth: w,
            docScrollWidth: docW,
            hasDocOverflow: docW > w,
            overflowCount: overflowingElements.length,
            overflowingElements: overflowingElements.slice(0, 5),
            heroTitleWidth: heroTitleRect ? heroTitleRect.width : 0
          };
        })()
      `,
      returnByValue: true
    });

    const res = evalRes.result.value;
    const passed = !res.hasDocOverflow && res.overflowCount === 0;
    report.viewports[vp.name] = {
      status: passed ? 'PASS' : 'FAIL',
      windowWidth: res.windowWidth,
      docScrollWidth: res.docScrollWidth,
      overflowCount: res.overflowCount,
      overflowingElements: res.overflowingElements
    };
    console.log(`[${passed ? 'PASS' : 'FAIL'}] ${vp.name}: width=${res.windowWidth}, scrollWidth=${res.docScrollWidth}, overflows=${res.overflowCount}`);
  }

  // --- 2. CAPTURING REQUIRED SCREENSHOTS ---
  console.log('\n--- 2. CAPTURING REQUIRED SCREENSHOTS ---');

  async function captureAndSave(filename, clip = null, captureBeyondViewport = false) {
    const params = { format: 'png' };
    if (clip) params.clip = clip;
    if (captureBeyondViewport) params.captureBeyondViewport = true;

    const shot = await sendCDP(ws, 'Page.captureScreenshot', params);
    const buf = Buffer.from(shot.data, 'base64');
    const fullPath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(fullPath, buf);
    const size = fs.statSync(fullPath).size;
    report.screenshots[filename] = { path: fullPath, size, valid: size > 10000 };
    console.log(`Saved ${filename} (${(size / 1024).toFixed(1)} KB)`);
    return fullPath;
  }

  // 1. Desktop Hero 1440px
  await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:8080/' });
  await sleep(700);
  await captureAndSave('01_desktop_hero_1440.png');

  // 2. Desktop Full Page 1440px
  await captureAndSave('02_desktop_fullpage_1440.png', null, true);

  // 3. Mobile Hero 390px
  await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:8080/' });
  await sleep(700);
  await captureAndSave('03_mobile_hero_390.png');

  // 4. Mobile Full Page 390px
  await captureAndSave('04_mobile_fullpage_390.png', null, true);

  // 5. Mobile 375px
  await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', { width: 375, height: 667, deviceScaleFactor: 1, mobile: true });
  await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:8080/' });
  await sleep(600);
  await captureAndSave('05_mobile_375.png');

  // 6. Mobile Sticky CTA (on 390px)
  await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:8080/' });
  await sleep(600);
  await captureAndSave('06_mobile_sticky_cta.png', { x: 0, y: 760, width: 390, height: 84, scale: 1 });

  // 7. Proof Section Desktop
  await sendCDP(ws, 'Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await sendCDP(ws, 'Page.navigate', { url: 'http://localhost:8080/' });
  await sleep(600);
  await sendCDP(ws, 'Runtime.evaluate', { expression: `window.scrollTo(0, document.getElementById('proof-highlight').offsetTop - 76);` });
  await sleep(700);
  await captureAndSave('07_proof_section.png');

  // 8. Services Section Desktop
  await sendCDP(ws, 'Runtime.evaluate', { expression: `window.scrollTo(0, document.getElementById('services').offsetTop - 76);` });
  await sleep(700);
  await captureAndSave('08_services_section.png');

  // 9. FAQ Section Desktop (Open FAQ 1 first)
  await sendCDP(ws, 'Runtime.evaluate', { expression: `
    window.scrollTo(0, document.getElementById('faq').offsetTop - 76);
    const q1 = document.querySelector('.faq-question');
    if (q1) q1.click();
  `});
  await sleep(700);
  await captureAndSave('09_faq_section.png');

  // 10. Contact Form Section Desktop
  await sendCDP(ws, 'Runtime.evaluate', { expression: `window.scrollTo(0, document.getElementById('contact').offsetTop - 60);` });
  await sleep(700);
  await captureAndSave('10_contact_form_section.png');

  // 11. Footer Section Desktop
  await sendCDP(ws, 'Runtime.evaluate', { expression: `window.scrollTo(0, document.querySelector('footer').offsetTop);` });
  await sleep(700);
  await captureAndSave('11_footer_section.png');

  // --- 3. FUNCTIONAL QA CHECKS ---
  console.log('\n--- 3. FUNCTIONAL QA CHECKS ---');
  const funcRes = await sendCDP(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        // 1. Phone Links
        const phoneLinks = Array.from(document.querySelectorAll('a[href^="tel:"]'));
        const allPhoneMatch = phoneLinks.length > 0 && phoneLinks.every(a => a.getAttribute('href') === 'tel:0627010222');

        // 2. LINE Links
        const lineLinks = Array.from(document.querySelectorAll('a[href*="line.me"]'));
        const allLineMatch = lineLinks.length > 0 && lineLinks.every(a => a.getAttribute('href') === 'https://line.me/R/ti/p/@tunnmudto');

        // 3. FAQ Items
        const faqItems = document.querySelectorAll('.faq-item');
        const faqCount = faqItems.length;

        // 4. Form inputs check
        const nameInput = document.getElementById('quoteName');
        const phoneInput = document.getElementById('quotePhone');
        const locInput = document.getElementById('quoteLocation');
        const formSubmit = document.querySelector('.form-submit-btn');

        // 5. Typography computed sizes
        const h1 = document.querySelector('.hero-title');
        const h1Size = h1 ? window.getComputedStyle(h1).fontSize : '';
        const bodySize = window.getComputedStyle(document.body).fontSize;
        const pDesc = document.querySelector('.hero-desc');
        const descSize = pDesc ? window.getComputedStyle(pDesc).fontSize : '';
        const btnLine = document.querySelector('.btn-primary-line');
        const btnLineSize = btnLine ? window.getComputedStyle(btnLine).fontSize : '';
        const btnLineHeight = btnLine ? btnLine.offsetHeight : 0;

        // 6. Gallery Accessibility
        const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
        const allGalleryHaveRole = galleryItems.every(el => el.getAttribute('role') === 'button' && el.getAttribute('tabindex') === '0');

        return {
          phoneCount: phoneLinks.length,
          allPhoneMatch,
          lineCount: lineLinks.length,
          allLineMatch,
          faqCount,
          formComplete: !!(nameInput && phoneInput && locInput && formSubmit),
          allGalleryHaveRole,
          computed: {
            h1Size,
            bodySize,
            descSize,
            btnLineSize,
            btnLineHeight
          }
        };
      })()
    `,
    returnByValue: true
  });
  report.functional = funcRes.result.value;
  console.log('Functional QA Results:', JSON.stringify(report.functional, null, 2));

  // --- 4. ACCESSIBILITY & ZOOM SUPPORT ---
  console.log('\n--- 4. ACCESSIBILITY & ZOOM AUDIT ---');
  const a11yRes = await sendCDP(ws, 'Runtime.evaluate', {
    expression: `
      (() => {
        // Check touch target heights on mobile
        const buttons = Array.from(document.querySelectorAll('.btn-primary-line, .btn-secondary-phone, .mobile-bar-btn, .audience-cta-btn, .form-submit-btn'));
        const allMeetTargetSize = buttons.every(b => b.offsetHeight >= 48);

        // Check focus styles
        const activeOutline = window.getComputedStyle(document.body).getPropertyValue('--accent-orange');

        return {
          allMeetTargetSize,
          minButtonHeightObserved: Math.min(...buttons.map(b => b.offsetHeight)),
          buttonsCheckedCount: buttons.length,
          fontFamily: window.getComputedStyle(document.body).fontFamily
        };
      })()
    `,
    returnByValue: true
  });
  report.accessibility = a11yRes.result.value;
  console.log('Accessibility Audit:', JSON.stringify(report.accessibility, null, 2));

  fs.writeFileSync(path.join(OUTPUT_DIR, 'qa_report.json'), JSON.stringify(report, null, 2));
  console.log('\nQA Suite successfully finished! Results saved.');

  ws.close();
}

main().catch(err => {
  console.error('QA Suite Error:', err);
  process.exit(1);
});
