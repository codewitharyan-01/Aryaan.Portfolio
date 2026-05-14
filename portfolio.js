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
  let mouseFrame;
  let mouseX = 0;
  let mouseY = 0;

  const updateMouseEffects = () => {
    // MAGNETIC ELEMENTS
    document.querySelectorAll('.btn-prestige, .btn-secondary, .theme-toggle, .logo, .social-btn').forEach(btn => {
      const rect = btn.getBoundingClientRect();
      const distThreshold = 100;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = Math.hypot(mouseX - centerX, mouseY - centerY);

      if (dist < distThreshold) {
        const x = (mouseX - centerX) * 0.35;
        const y = (mouseY - centerY) * 0.35;
        btn.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      } else {
        btn.style.transform = '';
      }
    });

    // HERO PARALLAX
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
      const spans = heroTitle.querySelectorAll('span');
      const px = (mouseX / window.innerWidth - 0.5) * 25;
      const py = (mouseY / window.innerHeight - 0.5) * 25;
      spans.forEach((span, i) => {
        span.style.transform = `translate3d(${px * (i * 0.04)}px, ${py * (i * 0.04)}px, 0)`;
      });
    }

    // 3D CARD EFFECT
    document.querySelectorAll('.prestige-panel').forEach(card => {
      const rect = card.getBoundingClientRect();
      const inBounds = mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom;
      
      if (inBounds) {
        const x = (mouseX - rect.left) / rect.width - 0.5;
        const y = (mouseY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${y * -8}deg) translateY(-10px)`;
      } else {
        card.style.transform = '';
      }
    });

    // CUSTOM CURSOR
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
      cursor.style.transform = `translate3d(${mouseX - 10}px, ${mouseY - 10}px, 0)`;
    }

    mouseFrame = null;
  };

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!mouseFrame) {
      mouseFrame = requestAnimationFrame(updateMouseEffects);
    }
  });

  document.querySelectorAll('a, button, .info-card, .logo').forEach(el => {
    el.addEventListener('mouseenter', () => {
      const cursor = document.getElementById('custom-cursor');
      if (cursor) cursor.classList.add('expand');
    });
    el.addEventListener('mouseleave', () => {
      const cursor = document.getElementById('custom-cursor');
      if (cursor) cursor.classList.remove('expand');
    });
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
    const email = 'happier.aryan@gmail.com';
    navigator.clipboard.writeText(email).then(() => showToast('Email copied! 📋'));
  });
}

// ─── TILT-BASED THEME TOGGLE (GRAVITY SENSING) ───
if (window.DeviceOrientationEvent) {
  let lastOrientationTheme = savedTheme;
  let lastToggleTime = 0;
  const TILT_THRESHOLD = 40;
  const BUFFER = 10; // Avoid flickering

  window.addEventListener('deviceorientation', (event) => {
    const now = Date.now();
    if (now - lastToggleTime < 500) return; // Sensitivity control: Wait 500ms between changes

    const tilt = event.beta; // Front-to-back tilt (-180 to 180)
    if (tilt === null) return;

    // Logic: If tilted significantly (e.g., > 40 degrees towards user), go Light
    // If returned to flatter position (< 30 degrees), go Dark
    if (tilt > (TILT_THRESHOLD + BUFFER) && lastOrientationTheme !== 'light') {
      setTheme('light');
      lastOrientationTheme = 'light';
      lastToggleTime = now;
    } else if (tilt < (TILT_THRESHOLD - BUFFER) && lastOrientationTheme !== 'dark') {
      setTheme('dark');
      lastOrientationTheme = 'dark';
      lastToggleTime = now;
    }
  }, true);

  // iOS Permission Handling (Required for modern Safari)
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    document.addEventListener('click', () => {
      DeviceOrientationEvent.requestPermission()
        .then(response => {
          if (response === 'granted') console.log('Gravity sensing enabled.');
        })
        .catch(console.error);
    }, { once: true });
  }
}
