/**
 * ตุ่นมุดท่อ (Toon Mud Tho) - Interactive Script V1.2
 * Domain: https://toonmudtho.com/
 * LINE OA: https://lin.ee/WYiZBnO
 * Tel: 062-701-0222
 */

document.addEventListener('DOMContentLoaded', () => {
  // Helper for keyboard focus trapping within modal/dialog
  const trapFocus = (container, event) => {
    if (event.key !== 'Tab') return;
    const focusable = container.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex="0"]');
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        event.preventDefault();
      }
    }
  };

  // 1. Mobile Navigation Drawer (with Focus Trap & Restoration)
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');
  const drawerLinks = document.querySelectorAll('.mobile-drawer-links a');
  let lastFocusedNavTrigger = null;

  if (mobileToggleBtn && mobileDrawer) {
    const openDrawer = () => {
      lastFocusedNavTrigger = document.activeElement;
      mobileDrawer.classList.add('open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (mobileDrawerClose) {
        setTimeout(() => mobileDrawerClose.focus(), 60);
      }
    };

    const closeDrawer = () => {
      mobileDrawer.classList.remove('open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocusedNavTrigger && typeof lastFocusedNavTrigger.focus === 'function') {
        lastFocusedNavTrigger.focus();
      }
    };

    mobileToggleBtn.addEventListener('click', openDrawer);

    if (mobileDrawerClose) {
      mobileDrawerClose.addEventListener('click', closeDrawer);
    }

    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) {
        closeDrawer();
      }
    });

    drawerLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', (e) => {
      if (mobileDrawer.classList.contains('open')) {
        if (e.key === 'Escape') {
          closeDrawer();
        } else {
          trapFocus(mobileDrawer, e);
        }
      }
    });
  }

  // 2. Active Navigation Highlighting on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    const scrollY = window.pageYOffset + 140;
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav);

  // 3. Gallery Filtering
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.96)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // 4. Lightbox Modal for Gallery & Portfolio Images (with Focus Trap & Restoration)
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxText = document.getElementById('lightboxText');
  const lightboxClose = document.getElementById('lightboxClose');
  let lastFocusedElement = null;

  if (lightboxModal) {
    const openLightbox = (item) => {
      lastFocusedElement = item;
      const imgSrc = item.getAttribute('data-full-img') || item.getAttribute('data-src') || (item.querySelector('img') ? item.querySelector('img').getAttribute('src') : '');
      const titleEl = item.querySelector('.gallery-item-title');
      const captionEl = item.querySelector('.gallery-item-caption');
      const dataTitle = item.getAttribute('data-title');
      const title = dataTitle || (titleEl ? titleEl.innerText : 'ภาพหน้างานจริง');

      let caption = captionEl ? captionEl.innerText : '';
      if (!caption && item.classList.contains('portfolio-img-box')) {
        const card = item.closest('.portfolio-card');
        if (card) {
          const loc = card.querySelector('.portfolio-loc-text') ? card.querySelector('.portfolio-loc-text').textContent.trim() : '';
          const desc = card.querySelector('.portfolio-work-desc') ? card.querySelector('.portfolio-work-desc').textContent.trim() : '';
          caption = [loc, desc].filter(Boolean).join(' • ');
        }
      }

      lightboxImg.setAttribute('src', imgSrc);
      lightboxImg.setAttribute('alt', title);
      if (lightboxTitle) lightboxTitle.innerText = title;
      if (lightboxText) lightboxText.innerText = caption;

      lightboxModal.classList.add('active');
      lightboxModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (lightboxClose) {
        setTimeout(() => lightboxClose.focus(), 60);
      }
    };

    galleryItems.forEach(item => {
      item.addEventListener('click', () => openLightbox(item));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(item);
        }
      });
    });

    const portfolioImgBoxes = document.querySelectorAll('.portfolio-img-box');
    portfolioImgBoxes.forEach(box => {
      box.addEventListener('click', () => openLightbox(box));
      box.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(box);
        }
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      lightboxImg.setAttribute('src', '');
      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }
    
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (lightboxModal.classList.contains('active')) {
        if (e.key === 'Escape') {
          closeLightbox();
        } else {
          trapFocus(lightboxModal, e);
        }
      }
    });
  }

  // 4.1 Portfolio Toggle: Expand / Collapse All 17 Projects
  const btnTogglePortfolio = document.getElementById('btnTogglePortfolio');
  const portfolioGrid = document.getElementById('portfolioGrid');
  const portfolioToggleText = document.getElementById('portfolioToggleText');

  if (btnTogglePortfolio && portfolioGrid) {
    btnTogglePortfolio.addEventListener('click', () => {
      const isExpanded = portfolioGrid.classList.toggle('show-all');
      btnTogglePortfolio.classList.toggle('expanded', isExpanded);
      btnTogglePortfolio.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      if (portfolioToggleText) {
        portfolioToggleText.textContent = isExpanded 
          ? 'ย่อแสดงผลงาน' 
          : 'ดูโครงการอื่นๆของเรา';
      }
      if (!isExpanded) {
        const portfolioSec = document.getElementById('portfolio');
        if (portfolioSec) {
          const navOffset = 90;
          const targetY = portfolioSec.getBoundingClientRect().top + window.pageYOffset - navOffset;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      }
    });
  }

  // 5. Accessible FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.setAttribute('aria-expanded', 'false');

      const toggleItem = () => {
        const isActive = item.classList.contains('active');

        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherBtn = otherItem.querySelector('.faq-question');
            const otherAns = otherItem.querySelector('.faq-answer');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            if (otherAns) otherAns.style.maxHeight = null;
          }
        });

        if (!isActive) {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          item.classList.remove('active');
          questionBtn.setAttribute('aria-expanded', 'false');
          answer.style.maxHeight = null;
        }
      };

      questionBtn.addEventListener('click', toggleItem);
    }
  });

    // 6. Contact Form with Photo Upload, Client-side Compression & Netlify Lead Flow
  const quoteForm = document.getElementById('quickQuoteForm');
  const preparedBox = document.getElementById('preparedMessageBox');
  const preparedPreview = document.getElementById('preparedMsgPreview');
  const fallbackArea = document.getElementById('fallbackCopyArea');
  const btnCopy = document.getElementById('btnCopyPrepared');
  const copyBtnLabel = document.getElementById('copyBtnLabel');
  const fileInput = document.getElementById('quotePhotos');
  const previewGrid = document.getElementById('filePreviewGrid');
  const submitBtn = document.getElementById('generateMsgBtn');
  const submitBtnText = document.getElementById('submitBtnText');

  // Client-side image compression using Canvas (Max 1600px, JPEG 0.82)
  async function compressImageFile(file, maxWidth = 1600, maxHeight = 1600, quality = 0.82) {
    if (!file.type.startsWith('image/')) {
      return { file, originalSize: file.size, compressedSize: file.size, previewUrl: '' };
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob && blob.size < file.size) {
              const safeName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
              const compressed = new File([blob], safeName, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve({
                file: compressed,
                originalSize: file.size,
                compressedSize: blob.size,
                previewUrl: canvas.toDataURL('image/jpeg', 0.6)
              });
            } else {
              resolve({
                file,
                originalSize: file.size,
                compressedSize: file.size,
                previewUrl: e.target.result
              });
            }
          }, 'image/jpeg', quality);
        };
        img.onerror = () => resolve({ file, originalSize: file.size, compressedSize: file.size, previewUrl: '' });
        img.src = e.target.result;
      };
      reader.onerror = () => resolve({ file, originalSize: file.size, compressedSize: file.size, previewUrl: '' });
      reader.readAsDataURL(file);
    });
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  let compressedFilesList = [];

  if (fileInput && previewGrid) {
    fileInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      for (const file of files) {
        const result = await compressImageFile(file);
        compressedFilesList.push(result);
      }

      renderPreviews();
      fileInput.value = '';
    });
  }

  function renderPreviews() {
    if (!previewGrid) return;
    previewGrid.innerHTML = '';

    compressedFilesList.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'preview-card';
      const origStr = formatFileSize(item.originalSize);
      const compStr = formatFileSize(item.compressedSize);
      const reducedPct = Math.round((1 - (item.compressedSize / item.originalSize)) * 100);

      card.innerHTML = `
        <img class="preview-thumb" src="${item.previewUrl || ''}" alt="รูปถ่ายหน้างาน ${index + 1}">
        <button type="button" class="preview-remove-btn" data-index="${index}" title="ลบรูปนี้">×</button>
        <div class="preview-info">
          <div>${escapeHTML(item.file.name)}</div>
          ${reducedPct > 5 ? `<span class="compressed-badge">ย่อแล้ว: ${compStr} (ลด ${reducedPct}%)</span>` : `<span>ขนาด: ${compStr}</span>`}
        </div>
      `;
      previewGrid.appendChild(card);
    });

    previewGrid.querySelectorAll('.preview-remove-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        compressedFilesList.splice(idx, 1);
        renderPreviews();
      });
    });
  }

  if (quoteForm && preparedBox && preparedPreview && btnCopy) {
    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('quoteName').value.trim();
      const phone = document.getElementById('quotePhone').value.trim();
      const location = document.getElementById('quoteLocation').value.trim();
      const jobType = document.getElementById('quoteJobType').value;
      const note = document.getElementById('quoteNote').value.trim();

      if (submitBtn) submitBtn.disabled = true;
      if (submitBtnText) submitBtnText.textContent = 'กำลังบันทึกและส่งข้อมูล...';

      // 1. Send Lead & Uploaded Photos directly to Formspree (nanakornsuesat@gmail.com)
      const formData = new FormData();
      formData.append('ผู้ติดต่อ_หน่วยงาน', name);
      formData.append('เบอร์โทรศัพท์', phone);
      formData.append('พื้นที่_ทำเล', location);
      formData.append('ประเภทหน้างาน', jobType);
      formData.append('รายละเอียดเพิ่มเติม', note || 'ไม่มีข้อมูลเพิ่มเติม');

      if (compressedFilesList.length > 0) {
        if (submitBtnText) submitBtnText.textContent = 'กำลังอัปโหลดรูปภาพ...';
        for (let i = 0; i < compressedFilesList.length; i++) {
          try {
            const upForm = new FormData();
            upForm.append('file', compressedFilesList[i].file);
            const upRes = await fetch('https://tmpfiles.org/api/v1/upload', {
              method: 'POST',
              body: upForm
            });
            const upData = await upRes.json();
            if (upData && upData.data && upData.data.url) {
              const directLink = upData.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
              formData.append(`ลิงก์รูปถ่าย_${i + 1}`, directLink);
            }
          } catch (upErr) {
            console.warn('Image upload fallback:', upErr);
          }
        }
        formData.append('จำนวนรูปถ่าย', `${compressedFilesList.length} รูป`);
      } else {
        formData.append('รูปถ่ายหน้างาน', 'ไม่ได้แนบรูปถ่าย');
      }

      if (submitBtnText) submitBtnText.textContent = 'กำลังส่งข้อมูลเข้าอีเมล...';

      try {
        await fetch('https://formspree.io/f/mwlljeno', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
      } catch (err) {
        console.warn('Formspree submission note:', err);
      }

      // 2. Prepare LINE Message
      const photoNote = compressedFilesList.length > 0 
        ? `(แนบรูปถ่ายหน้างาน ${compressedFilesList.length} รูปผ่านหน้าเว็บเรียบร้อย)` 
        : '(แนบรูปถ่ายหน้างานในแชทนี้)';

      const plainMessage = [
        'สวัสดีครับ สนใจประเมินราคาลอกบ่อพัก/ท่อระบายน้ำ',
        `- ผู้ติดต่อ/หน่วยงาน: ${name}`,
        `- เบอร์โทรศัพท์: ${phone}`,
        `- พื้นที่/ทำเล: ${location}`,
        `- ประเภทหน้างาน: ${jobType}`,
        `- รายละเอียดเพิ่มเติม: ${note || 'ไม่มีข้อมูลเพิ่มเติม'}`,
        photoNote
      ].join('\n');

      preparedPreview.innerHTML = `
        <div class="msg-line head"><strong>สวัสดีครับ สนใจประเมินราคาลอกบ่อพัก/ท่อระบายน้ำ</strong></div>
        <div class="msg-line"><strong>ผู้ติดต่อ:</strong> ${escapeHTML(name)}</div>
        <div class="msg-line"><strong>เบอร์โทรศัพท์:</strong> ${escapeHTML(phone)}</div>
        <div class="msg-line"><strong>พื้นที่/ทำเล:</strong> ${escapeHTML(location)}</div>
        <div class="msg-line"><strong>ประเภทหน้างาน:</strong> ${escapeHTML(jobType)}</div>
        <div class="msg-line"><strong>รายละเอียด/จำนวนบ่อ:</strong> ${escapeHTML(note || '-')}</div>
        <div class="msg-line foot"><em>${photoNote}</em></div>
      `;

      if (fallbackArea) {
        fallbackArea.value = plainMessage;
      }

      preparedBox.style.display = 'block';
      preparedBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      if (submitBtn) submitBtn.disabled = false;
      if (submitBtnText) submitBtnText.textContent = 'ส่งข้อมูลประเมินราคา & รับข้อความทัก LINE';

      copyBtnLabel.textContent = 'คัดลอกข้อความ';
      btnCopy.classList.remove('copied', 'copy-error');
    });


    function fallbackCopy() {
      if (fallbackArea) {
        fallbackArea.style.display = 'block';
        fallbackArea.select();
        fallbackArea.setSelectionRange(0, 99999);
        try {
          const success = document.execCommand('copy');
          if (success) {
            handleCopySuccess();
          } else {
            handleCopyFail();
          }
        } catch (e) {
          handleCopyFail();
        }
      } else {
        handleCopyFail();
      }
    }
    function handleCopyFail() {
      btnCopy.classList.add('copy-error');
      btnCopy.classList.remove('copied');
      copyBtnLabel.textContent = 'แตะที่กล่องข้อความเพื่อคัดลอก';
      const notice = document.getElementById('fallbackCopyNotice');
      if (notice) notice.style.display = 'block';
      if (fallbackArea) {
        fallbackArea.style.display = 'block';
        fallbackArea.focus();
        fallbackArea.select();
      }
    }

    if (fallbackArea) {
      fallbackArea.addEventListener('click', () => { fallbackArea.select(); });
      fallbackArea.addEventListener('focus', () => { fallbackArea.select(); });
    }
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
});
