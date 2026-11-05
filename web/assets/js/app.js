/**
 * ตุ่นมุดท่อ (Tunn Mud To) - Single Page Interactive Script
 * Domain: https://toonmudtho.com/
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Drawer
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');
  const drawerLinks = document.querySelectorAll('.mobile-drawer-links a');

  if (mobileToggleBtn && mobileDrawer) {
    mobileToggleBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    const closeDrawer = () => {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    };

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
  }

  // 2. Active Navigation Highlighting on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    const scrollY = window.pageYOffset + 120;
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
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
          item.style.transform = 'scale(0.95)';
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

  if (lightboxModal) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.getAttribute('data-full-img') || item.querySelector('img').getAttribute('src');
        const title = item.querySelector('.gallery-item-title').innerText;
        const caption = item.querySelector('.gallery-item-caption').innerText;

        lightboxImg.setAttribute('src', imgSrc);
        lightboxImg.setAttribute('alt', title);
        lightboxTitle.innerText = title;
        lightboxText.innerText = caption;

        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
      lightboxImg.setAttribute('src', '');
    };

    lightboxClose.addEventListener('click', closeLightbox);
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

  // 5. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      }
    });
  });

  // 6. Quick Lead / Quote Form Handler
  const quoteForm = document.getElementById('quickQuoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('quoteName').value.trim();
      const phone = document.getElementById('quotePhone').value.trim();
      const location = document.getElementById('quoteLocation').value.trim();
      const jobType = document.getElementById('quoteJobType').value;
      const note = document.getElementById('quoteNote').value.trim();

      // Compose Thai text for LINE or quick message
      const msg = `สวัสดีครับ สนใจประเมินราคาลอกท่อ:\n- ผู้ติดต่อ: ${name}\n- เบอร์โทร: ${phone}\n- โครงการ/สถานที่: ${location}\n- ประเภทงาน: ${jobType}\n- รายละเอียด: ${note}`;
      
      const lineUrl = `https://line.me/R/ti/p/@tunnmudto`;
      
      // Show confirmation dialog to user
      const proceed = confirm(`ข้อมูลติดต่อของคุณ:\nชื่อ: ${name}\nเบอร์: ${phone}\nสถานที่: ${location}\n\nต้องการเปิด LINE @tunnmudto เพื่อส่งรูปและสอบถามทีมงานทันทีหรือไม่?`);
      if (proceed) {
        window.open(lineUrl, '_blank');
      }
    });
  }
});
