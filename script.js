/* LocalLens.Homes – Interactive JavaScript */

document.addEventListener('DOMContentLoaded', function () {
  initHamburgerMenu();
  initSmoothScroll();
  initFadeInAnimations();
  initLazyLoading();
  initFormValidation();
  setActiveNavLink();
});

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
  var originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending…';
  submitBtn.classList.add('btn-loading');

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
    submitBtn.textContent = originalText;
    submitBtn.classList.remove('btn-loading');
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
