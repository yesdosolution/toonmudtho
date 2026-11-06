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

  // 6. Contact Form - LINE Message Preparation Tool (P0 Real Lead Flow)
  const quoteForm = document.getElementById('quickQuoteForm');
  const preparedBox = document.getElementById('preparedMessageBox');
  const preparedPreview = document.getElementById('preparedMsgPreview');
  const fallbackArea = document.getElementById('fallbackCopyArea');
  const btnCopy = document.getElementById('btnCopyPrepared');
  const copyBtnLabel = document.getElementById('copyBtnLabel');

  if (quoteForm && preparedBox && preparedPreview && btnCopy) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('quoteName').value.trim();
      const phone = document.getElementById('quotePhone').value.trim();
      const location = document.getElementById('quoteLocation').value.trim();
      const jobType = document.getElementById('quoteJobType').value;
      const note = document.getElementById('quoteNote').value.trim();

      // Format plain text for LINE
      const plainMessage = [
        'สวัสดีครับ สนใจประเมินราคาลอกบ่อพัก/ท่อระบายน้ำ',
        `- ผู้ติดต่อ/หน่วยงาน: ${name}`,
        `- เบอร์โทรศัพท์: ${phone}`,
        `- พื้นที่/ทำเล: ${location}`,
        `- ประเภทหน้างาน: ${jobType}`,
        `- รายละเอียดเพิ่มเติม: ${note || 'ไม่มีข้อมูลเพิ่มเติม'}`,
        '(แนบรูปถ่ายหน้างานในแชทนี้)'
      ].join('\n');

      // Formatted HTML display
      preparedPreview.innerHTML = `
        <div class="msg-line head"><strong>สวัสดีครับ สนใจประเมินราคาลอกบ่อพัก/ท่อระบายน้ำ</strong></div>
        <div class="msg-line"><strong>ผู้ติดต่อ:</strong> ${escapeHTML(name)}</div>
        <div class="msg-line"><strong>เบอร์โทรศัพท์:</strong> ${escapeHTML(phone)}</div>
        <div class="msg-line"><strong>พื้นที่/ทำเล:</strong> ${escapeHTML(location)}</div>
        <div class="msg-line"><strong>ประเภทหน้างาน:</strong> ${escapeHTML(jobType)}</div>
        <div class="msg-line"><strong>รายละเอียด/จำนวนบ่อ:</strong> ${escapeHTML(note || '-')}</div>
        <div class="msg-line foot"><em>(แนบรูปถ่ายหน้างานเพิ่มเติมในแชทนี้)</em></div>
      `;

      if (fallbackArea) {
        fallbackArea.value = plainMessage;
      }

      preparedBox.style.display = 'block';
      preparedBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Reset copy button state
      copyBtnLabel.textContent = 'คัดลอกข้อความ';
      btnCopy.classList.remove('copied', 'copy-error');
    });

    btnCopy.addEventListener('click', async () => {
      const textToCopy = fallbackArea ? fallbackArea.value : preparedPreview.innerText;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(textToCopy);
          handleCopySuccess();
        } else {
          fallbackCopy();
        }
      } catch (err) {
        fallbackCopy();
      }
    });

    function handleCopySuccess() {
      btnCopy.classList.add('copied');
      btnCopy.classList.remove('copy-error');
      copyBtnLabel.textContent = 'คัดลอกข้อความเรียบร้อยแล้ว ✓';
      const notice = document.getElementById('fallbackCopyNotice');
      if (notice) notice.style.display = 'none';
      if (fallbackArea) fallbackArea.style.display = 'none';
      setTimeout(() => {
        copyBtnLabel.textContent = 'คัดลอกข้อความ';
        btnCopy.classList.remove('copied');
      }, 4000);
    }

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
