// ─── THEME TOGGLE ───
const themeToggle = document.getElementById('theme-toggle');
const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const mobileThemeIcon = document.getElementById('mobile-theme-icon');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  const label = theme === 'light' ? 'LIGHT' : 'DARK';
  if (themeIcon) themeIcon.textContent = label;
  if (mobileThemeIcon) mobileThemeIcon.textContent = label;
}

[themeToggle, mobileThemeToggle].forEach(btn => {
  if (btn) {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      setTheme(currentTheme === 'light' ? 'dark' : 'light');
    });
  }
});

const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

// ─── TOUCH DEVICE CHECK ───
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// ─── HEADER SCROLL EFFECT ───
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('header-scrolled', window.scrollY > 20);
}, { passive: true });

// ─── MOBILE NAV ───
const hamburger = document.getElementById('hamburger');
const overlay   = document.getElementById('mobile-overlay');
const closeBtn  = document.getElementById('overlay-close');

function toggleMobileNav(active) {
  overlay.classList.toggle('active', active);
  hamburger.classList.toggle('active', active);
}

hamburger.addEventListener('click', () => toggleMobileNav(true));
closeBtn.addEventListener('click', () => toggleMobileNav(false));
overlay.querySelectorAll('a').forEach(link => link.addEventListener('click', () => toggleMobileNav(false)));

// ─── SCROLL REVEAL (STORYTELLING) ───
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Add revealed class with a slight staggered delay
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('revealed');
      }, delay);
      
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-up, .animate-left, .animate-right').forEach((el, index) => {
  // Auto-stagger children if they don't have a specific delay
  if (!el.dataset.delay) {
    const section = el.closest('section');
    if (section) {
      const items = section.querySelectorAll('.animate-up, .animate-left, .animate-right');
      const itemIndex = Array.from(items).indexOf(el);
      el.dataset.delay = itemIndex * 150; 
    }
  }
  observer.observe(el);
});

// ─── MOUSE-ONLY EFFECTS ───
if (!isTouchDevice) {
  // MAGNETIC ELEMENTS
  document.querySelectorAll('.btn-prestige, .btn-secondary, .theme-toggle, .logo, .social-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.35;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
  });

  // HERO PARALLAX
  const heroTitle = document.getElementById('hero-title');
  if (heroTitle) {
    const spans = heroTitle.querySelectorAll('span');
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 25;
      const y = (e.clientY / window.innerHeight - 0.5) * 25;
      spans.forEach((span, i) => {
        span.style.transform = `translate3d(${x * (i * 0.04)}px, ${y * (i * 0.04)}px, 0)`;
      });
    });
  }

  // 3D CARD EFFECT
  document.querySelectorAll('.prestige-panel').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${y * -8}deg) translateY(-10px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ─── CUSTOM CURSOR ───
const cursor = document.getElementById('custom-cursor');
if (cursor) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate3d(${e.clientX - 10}px, ${e.clientY - 10}px, 0)`;
  });

  document.querySelectorAll('a, button, .info-card, .logo').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
  });
}

// ─── SCROLL PROGRESS & ACTIVE NAV ───
const progressBar = document.getElementById('scroll-progress-bar');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.desktop-nav a');

window.addEventListener('scroll', () => {
  // Progress bar logic
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  if (progressBar) progressBar.style.width = scrolled + "%";

  // Active section logic
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 150) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") && link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
}, { passive: true });

// ─── COPY TEXT ───
function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast("Copied: " + text);
  });
}

// ─── TOAST ───
const toast = document.getElementById('toast');
function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ─── DEVELOPER TYPEWRITER ANIMATION ───
(function () {
  const twEl = document.getElementById('typewriter-el');
  if (!twEl) return;

  const FULL_TEXT    = 'Aryan Patel';
  const CHAR_DELAY   = 95;   // ms between each character
  const GLITCH_CHARS = '01{}[]<>/\\|=+*#@!;';

  let index = 0;

  function randomGlitch() {
    return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
  }

  function typeNext() {
    if (index < FULL_TEXT.length) {
      // Show a quick glitch flash then settle on the real character
      const realChar = FULL_TEXT[index];
      let flashes = 0;
      const maxFlashes = 2;

      const glitchInterval = setInterval(() => {
        if (flashes < maxFlashes) {
          // Show scrambled version
          twEl.textContent = FULL_TEXT.slice(0, index) + randomGlitch();
          flashes++;
        } else {
          clearInterval(glitchInterval);
          index++;
          twEl.textContent = FULL_TEXT.slice(0, index);
          setTimeout(typeNext, CHAR_DELAY);
        }
      }, 35);

    } else {
      // Done typing — kill the blinking cursor and stay on screen
      twEl.classList.add('done');
      // Gently settle the cursor color to signal completion
      twEl.style.transition = 'opacity 0.4s';
    }
  }

  // Start the typewriter after a short page-load delay
  setTimeout(typeNext, 600);
})();

// ─── CONTACT EMAIL CLICK ───
const contactEmailBtn = document.getElementById('contact-email');
if (contactEmailBtn) {
  contactEmailBtn.addEventListener('click', (e) => {
    e.preventDefault();
    navigator.clipboard.writeText('happier.aryan@gmail.com').then(() => showToast('Email copied! 📋'));
  });
}
