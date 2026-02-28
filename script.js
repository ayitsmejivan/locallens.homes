/* LocalLens.Homes – Interactive JavaScript */

document.addEventListener('DOMContentLoaded', function () {
  initHamburgerMenu();
  initSmoothScroll();
  initFadeInAnimations();
  initLazyLoading();
  initContactForm();
  initFormValidation();
  setActiveNavLink();
  initDarkMode();
  initTestimonialsCarousel();
  initTourFilters();
});

// ===========================================
// Contact Form Setup
// ===========================================

function initContactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;

  // Set form action via JavaScript to avoid exposing email in static HTML
  form.action = 'https://formspree.io/f/jivaneklo@gmail.com';

  // Set travel date minimum to today
  var dateInput = document.getElementById('travel-date');
  if (dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];
  }
}

// ===========================================
// Hamburger Menu
// ===========================================

function initHamburgerMenu() {
  var hamburger = document.querySelector('.hamburger');
  var navLinks = document.querySelector('.nav-links');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu on nav link click
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

// ===========================================
// Smooth Scroll for anchor links
// ===========================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ===========================================
// Fade-in Animations on Scroll
// ===========================================

function initFadeInAnimations() {
  var elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    // Fallback: show all immediately for older browsers
    elements.forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(function (el) { observer.observe(el); });
}

// ===========================================
// Lazy Loading Images
// ===========================================

function initLazyLoading() {
  var images = document.querySelectorAll('img[data-src]');
  if (!images.length) return;

  if (!('IntersectionObserver' in window)) {
    images.forEach(function (img) {
      img.src = img.getAttribute('data-src');
      img.removeAttribute('data-src');
    });
    return;
  }

  var imageObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var img = entry.target;
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(function (img) { imageObserver.observe(img); });
}

// ===========================================
// Form Validation
// ===========================================

function initFormValidation() {
  var forms = document.querySelectorAll('form[data-validate]');

  forms.forEach(function (form) {
    form.addEventListener('submit', handleFormSubmit);

    form.querySelectorAll('input, textarea').forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
      field.addEventListener('input', function () {
        if (field.classList.contains('error')) {
          validateField(field);
        }
      });
    });
  });
}

function validateField(field) {
  var errorEl = field.parentElement.querySelector('.field-error');
  var valid = true;
  var message = '';

  if (field.required && !field.value.trim()) {
    valid = false;
    message = 'This field is required.';
  } else if (field.type === 'email' && field.value.trim()) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(field.value)) {
      valid = false;
      message = 'Please enter a valid email address.';
    }
  }

  field.classList.toggle('error', !valid);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.toggle('visible', !valid);
  }

  return valid;
}

function handleFormSubmit(e) {
  e.preventDefault();

  var form = e.target;
  var submitBtn = form.querySelector('[type="submit"]');
  var successMsg = form.querySelector('.form-success');
  var errorMsg = form.querySelector('.form-error-msg');

  // Validate all required fields
  var fields = form.querySelectorAll('input[required], textarea[required]');
  var allValid = true;

  fields.forEach(function (field) {
    if (!validateField(field)) allValid = false;
  });

  if (!allValid) return;

  // Show loading state
  var originalText = submitBtn ? submitBtn.textContent : '';
  if (submitBtn) {
    submitBtn.textContent = 'Sending…';
    submitBtn.classList.add('btn-loading');
  }

  var formData = new FormData(form);

  fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: { 'Accept': 'application/json' }
  }).then(function (response) {
    if (response.ok) {
      form.reset();
      if (successMsg) {
        successMsg.classList.add('visible');
        setTimeout(function () { successMsg.classList.remove('visible'); }, 6000);
      }
    } else {
      throw new Error('Server error');
    }
  }).catch(function () {
    if (errorMsg) {
      errorMsg.classList.add('visible');
      setTimeout(function () { errorMsg.classList.remove('visible'); }, 6000);
    }
  }).finally(function () {
    if (submitBtn) {
      submitBtn.textContent = originalText;
      submitBtn.classList.remove('btn-loading');
    }
  });
}

// ===========================================
// Active Navigation Link
// ===========================================

function setActiveNavLink() {
  var pathPart = window.location.pathname.split('/').pop();
  var currentPage = (pathPart === '' || !pathPart) ? 'index.html' : pathPart;
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });
}

// ===========================================
// Dark Mode Toggle
// ===========================================

function initDarkMode() {
  var toggle = document.getElementById('dark-mode-toggle');
  if (!toggle) return;

  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  toggle.textContent = isDark ? '☀️' : '🌙';
  toggle.setAttribute('aria-pressed', String(isDark));

  toggle.addEventListener('click', function () {
    var currentlyDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (currentlyDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.removeItem('darkMode');
      toggle.textContent = '🌙';
      toggle.setAttribute('aria-pressed', 'false');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('darkMode', 'enabled');
      toggle.textContent = '☀️';
      toggle.setAttribute('aria-pressed', 'true');
    }
  });
}

// ===========================================
// Testimonials Carousel
// ===========================================

function initTestimonialsCarousel() {
  var slides = document.querySelectorAll('.testimonial-slide');
  var dots = document.querySelectorAll('.testimonial-dot');
  if (!slides.length || !dots.length) return;

  var current = 0;
  var autoplay;

  function showSlide(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAutoplay() {
    autoplay = setInterval(function () { showSlide(current + 1); }, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplay);
    startAutoplay();
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      showSlide(parseInt(dot.getAttribute('data-index'), 10));
      resetAutoplay();
    });
  });

  startAutoplay();
}

// ===========================================
// Tour Filters
// ===========================================

function initTourFilters() {
  var filterBtns = document.querySelectorAll('.filter-btn');
  var tourCards = document.querySelectorAll('.tour-card');
  if (!filterBtns.length || !tourCards.length) return;

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');

      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      tourCards.forEach(function (card) {
        if (filter === 'all') {
          card.classList.remove('hidden');
        } else if (filter === 'easy') {
          card.classList.toggle('hidden', card.getAttribute('data-difficulty') !== 'easy');
        } else if (filter === 'moderate') {
          card.classList.toggle('hidden', card.getAttribute('data-difficulty') !== 'moderate');
        } else if (filter === 'short') {
          card.classList.toggle('hidden', card.getAttribute('data-duration') !== 'short');
        } else if (filter === 'long') {
          card.classList.toggle('hidden', card.getAttribute('data-duration') !== 'long');
        }
      });
    });
  });
}
