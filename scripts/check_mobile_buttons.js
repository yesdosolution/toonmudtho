async function check() {
  const list = await (await fetch('http://localhost:9222/json/list')).json();
  const page = list.find(t => t.type === 'page') || list[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  function send(m, p = {}) {
    return new Promise(r => {
      const id = Math.floor(Math.random() * 1000);
      const h = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === id) {
          ws.removeEventListener('message', h);
          r(msg.result);
        }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id, method: m, params: p }));
    });
  }

  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await send('Page.navigate', { url: 'http://localhost:8080/' });
  await new Promise(r => setTimeout(r, 600));

  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('.mobile-bar-btn, .btn-primary-line, .btn-secondary-phone, .audience-cta-btn, .form-submit-btn'));
      return btns.map(b => ({
        cls: b.className,
        text: b.innerText.trim().replace(/\\s+/g, ' '),
        h: b.offsetHeight,
        w: b.offsetWidth,
        visible: window.getComputedStyle(b).display !== 'none'
      }));
    })()`,
    returnByValue: true
  });

  console.log(JSON.stringify(res.result.value, null, 2));
  ws.close();
}

check().catch(console.error);
