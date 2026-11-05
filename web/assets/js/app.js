/**
 * ตุ่นมุดท่อ (Toon Mud Tho) - Conversion Optimization Interactive Script V1.0
 * Domain: https://toonmudtho.com/
 * LINE OA: @tunnmudto (https://line.me/R/ti/p/@tunnmudto)
 * Tel: 062-701-0222
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Drawer
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');
  const drawerLinks = document.querySelectorAll('.mobile-drawer-links a');

  if (mobileToggleBtn && mobileDrawer) {
    const openDrawer = () => {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (mobileDrawerClose) mobileDrawerClose.focus();
    };

    const closeDrawer = () => {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
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
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeDrawer();
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

  // 4. Lightbox Modal for Gallery Images
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxText = document.getElementById('lightboxText');
  const lightboxClose = document.getElementById('lightboxClose');
  let lastFocusedElement = null;

  if (lightboxModal) {
    const openLightbox = (item) => {
      lastFocusedElement = document.activeElement;
      const imgSrc = item.getAttribute('data-full-img') || item.querySelector('img').getAttribute('src');
      const titleEl = item.querySelector('.gallery-item-title');
      const captionEl = item.querySelector('.gallery-item-caption');
      const title = titleEl ? titleEl.innerText : 'ภาพหน้างานจริง';
      const caption = captionEl ? captionEl.innerText : '';

      lightboxImg.setAttribute('src', imgSrc);
      lightboxImg.setAttribute('alt', title);
      if (lightboxTitle) lightboxTitle.innerText = title;
      if (lightboxText) lightboxText.innerText = caption;

      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (lightboxClose) {
        setTimeout(() => lightboxClose.focus(), 50);
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

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
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
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // 5. Accessible FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      // Init ARIA
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

  // 6. Contact Form - Lead Routing directly to LINE OA
  const quoteForm = document.getElementById('quickQuoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('quoteName').value.trim();
      const phone = document.getElementById('quotePhone').value.trim();
      const location = document.getElementById('quoteLocation').value.trim();
      const jobType = document.getElementById('quoteJobType').value;
      const note = document.getElementById('quoteNote').value.trim();

      const lineUrl = `https://line.me/R/ti/p/@tunnmudto`;
      
      const confirmMsg = `ข้อมูลที่คุณระบุ:\n- ชื่อ: ${name}\n- เบอร์โทร: ${phone}\n- พื้นที่: ${location}\n- ประเภทงาน: ${jobType}\n\nระบบจะนำท่านไปยัง LINE @tunnmudto เพื่อส่งรูปหน้างานและให้ทีมประเมินเบื้องต้น`;
      
      if (confirm(confirmMsg)) {
        window.open(lineUrl, '_blank', 'noopener,noreferrer');
      }
    });
  }
});
