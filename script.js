const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('temazcal-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

root.setAttribute('data-theme', initialTheme);

themeToggle?.addEventListener('click', () => {
  const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', nextTheme);
  localStorage.setItem('temazcal-theme', nextTheme);
});

const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

const toggleMobileMenu = () => {
  if (!menuToggle || !mobileMenu) return;
  const isOpen = menuToggle.classList.toggle('is-open');
  mobileMenu.classList.toggle('is-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
};

menuToggle?.addEventListener('click', toggleMobileMenu);
mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

const slides = document.querySelectorAll('.hero-slide');
let activeSlide = 0;

if (slides.length > 1) {
  setInterval(() => {
    slides[activeSlide].classList.remove('is-active');
    activeSlide = (activeSlide + 1) % slides.length;
    slides[activeSlide].classList.add('is-active');
  }, 6000);
}

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    } else if (entry.boundingClientRect.top > 0) {
      entry.target.classList.remove('is-visible');
    }
  });
}, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

revealItems.forEach((item) => revealObserver.observe(item));

const galleryTrack = document.getElementById('galleryTrack');
const gallerySlider = document.getElementById('gallerySlider');

const setupGallerySlider = () => {
  if (!galleryTrack || !gallerySlider) return;

  const baseSlides = Array.from(galleryTrack.children);
  if (baseSlides.length < 2) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cloneCount = Math.min(3, baseSlides.length);

  for (let i = 0; i < cloneCount; i += 1) {
    const firstClone = baseSlides[i].cloneNode(true);
    const lastClone = baseSlides[baseSlides.length - 1 - i].cloneNode(true);
    firstClone.classList.add('is-clone');
    lastClone.classList.add('is-clone');
    galleryTrack.appendChild(firstClone);
    galleryTrack.prepend(lastClone);
  }

  let index = cloneCount;
  let timer;

  const getSlideSize = () => {
    const sampleSlide = galleryTrack.querySelector('.gallery-slide');
    if (!sampleSlide) return 0;
    const gap = parseFloat(window.getComputedStyle(galleryTrack).gap || '0');
    return sampleSlide.getBoundingClientRect().width + gap;
  };

  const goTo = (nextIndex, withTransition = true) => {
    const slideSize = getSlideSize();
    if (!slideSize) return;
    galleryTrack.style.transition = withTransition ? 'transform 700ms cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none';
    galleryTrack.style.transform = `translateX(${-nextIndex * slideSize}px)`;
  };

  const startAuto = () => {
    if (reducedMotion) return;
    stopAuto();
    timer = window.setInterval(() => {
      index += 1;
      goTo(index, true);
    }, 2400);
  };

  const stopAuto = () => {
    if (timer) {
      window.clearInterval(timer);
    }
  };

  goTo(index, false);

  galleryTrack.addEventListener('transitionend', () => {
    const firstReal = cloneCount;
    const lastReal = cloneCount + baseSlides.length - 1;

    if (index > lastReal) {
      index = firstReal;
      goTo(index, false);
    } else if (index < firstReal) {
      index = lastReal;
      goTo(index, false);
    }
  });

  gallerySlider.addEventListener('mouseenter', stopAuto);
  gallerySlider.addEventListener('mouseleave', startAuto);
  gallerySlider.addEventListener('focusin', stopAuto);
  gallerySlider.addEventListener('focusout', startAuto);

  window.addEventListener('resize', () => {
    goTo(index, false);
  });

  startAuto();
};

setupGallerySlider();

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const mediaCards = document.querySelectorAll('.gallery-slide');

const openLightbox = (src, caption) => {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;
  lightboxImage.src = src;
  lightboxImage.alt = caption;
  lightboxCaption.textContent = caption;
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.src = '';
  lightboxCaption.textContent = '';
  document.body.style.overflow = '';
};

mediaCards.forEach((card) => {
  card.addEventListener('click', () => {
    openLightbox(card.dataset.full, card.dataset.caption || 'Galería La Casita del Amor');
  });
});

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (lightbox?.classList.contains('is-open')) {
      closeLightbox();
    }

    if (menuToggle?.classList.contains('is-open')) {
      toggleMobileMenu();
    }
  }
});

const currentYear = document.getElementById('currentYear');
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}
