// ─── THEME TOGGLE ───
const themeToggle = document.getElementById('theme-toggle');
const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const mobileThemeIcon = document.getElementById('mobile-theme-icon');

function setTheme(theme) {
  document.body.classList.add('theme-transitioning');
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  setTimeout(() => {
    document.body.classList.remove('theme-transitioning');
  }, 800);
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
  let mouseX = 0, mouseY = 0;
  let lastTrailX = 0, lastTrailY = 0;
  let mouseFrame = null;

  let cursorX = 0, cursorY = 0;
  const updateMouseEffects = () => {
    // MAGNETIC ELEMENTS DISABLED (Removed rubber effect)
    /*
    document.querySelectorAll('.btn-prestige, .btn-secondary, .logo, .social-btn').forEach(btn => {
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
    */

    // HERO PARALLAX DISABLED (Removed rubber effect)
    /*
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
      const spans = heroTitle.querySelectorAll('span');
      const px = (mouseX / window.innerWidth - 0.5) * 25;
      const py = (mouseY / window.innerHeight - 0.5) * 25;
      spans.forEach((span, i) => {
        span.style.transform = `translate3d(${px * (i * 0.04)}px, ${py * (i * 0.04)}px, 0)`;
      });
    }
    */

    // 3D CARD EFFECT DISABLED (Removed rubber effect)
    /*
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
    */

    // CUSTOM CURSOR (Fixed position, removed rubber/lerp lag)
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
      cursor.style.display = 'block';
      
      // Removed snapping expansion logic that causes rubbery jumps
      cursor.classList.remove('snapping');
      cursor.style.width = '';
      cursor.style.height = '';
      cursor.style.background = '';
      cursor.style.opacity = '';

      // Direct position follow (1:1 with mouse, no lerp)
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

  document.querySelectorAll('a, button, .info-card, .logo, .prestige-panel').forEach(el => {
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
const mobileIndicator = document.getElementById('mobile-section-indicator');
const indicatorText = mobileIndicator?.querySelector('.indicator-text');

const sectionNames = {
  'hero': 'Home',
  'about': 'About Me',
  'skills': 'Tech Arsenal',
  'experience': 'Journey',
  'projects': 'Creations',
  'achievements': 'Awards',
  'certifications': 'Credentials',
  'contact': 'Let\'s Talk'
};

let lastActiveSection = '';

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
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") && link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });

  // Mobile Indicator Logic
  if (mobileIndicator && isTouchDevice) {
    if (winScroll > 150) {
      mobileIndicator.classList.add('active');
      
      if (current && current !== lastActiveSection) {
        lastActiveSection = current;
        const name = sectionNames[current] || current;
        
        // Text change animation
        indicatorText.classList.add('changing');
        setTimeout(() => {
          indicatorText.textContent = name;
          indicatorText.classList.remove('changing');
        }, 300);
      }
    } else {
      mobileIndicator.classList.remove('active');
    }
  }
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

// ─── DEVELOPER TYPEWRITER ANIMATION (DECODE STYLE) ───
(function () {
  const twEl = document.getElementById('typewriter-el');
  if (!twEl) return;

  const FINAL_TEXT = 'Aryan Patel';
  const CHARS = '* - / # _ + { } [ ] < > 0 1';
  const pool = CHARS.split(' ');
  
  let frame = 0;
  const scrambleDuration = 30; // frames per character
  const totalDuration = FINAL_TEXT.length * 10;
  
  let iterations = 0;
  const maxIterations = FINAL_TEXT.length;

  function scramble() {
    let output = '';
    let complete = true;

    for (let i = 0; i < FINAL_TEXT.length; i++) {
      if (i < iterations) {
        output += FINAL_TEXT[i];
      } else {
        output += pool[Math.floor(Math.random() * pool.length)];
        complete = false;
      }
    }

    twEl.textContent = output;

    if (iterations < FINAL_TEXT.length) {
      if (frame % 3 === 0) iterations += 0.35; // Speed of resolving
      frame++;
      requestAnimationFrame(scramble);
    } else {
      twEl.textContent = FINAL_TEXT;
      twEl.classList.add('done');
    }
  }

  // Start after preloader and initial transition
  setTimeout(() => {
    requestAnimationFrame(scramble);
  }, 6000); 
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
  const BUFFER = 10;

  window.addEventListener('deviceorientation', (event) => {
    const now = Date.now();
    
    // 1. THEME TOGGLE LOGIC
    if (now - lastToggleTime > 500) {
      const tilt = event.beta;
      if (tilt !== null) {
        if (tilt > (TILT_THRESHOLD + BUFFER) && lastOrientationTheme !== 'light') {
          setTheme('light');
          lastOrientationTheme = 'light';
          lastToggleTime = now;
        } else if (tilt < (TILT_THRESHOLD - BUFFER) && lastOrientationTheme !== 'dark') {
          setTheme('dark');
          lastOrientationTheme = 'dark';
          lastToggleTime = now;
        }
      }
    }

    // 2. MOBILE PARALLAX (CREATIVITY FOR TOUCH)
    if (isTouchDevice) {
      const gamma = event.gamma; // Left-to-right (-90 to 90)
      const beta = event.beta;   // Front-to-back (-180 to 180)
      
      const xOffset = (gamma / 45) * 15; // Max 15px shift
      const yOffset = ((beta - 30) / 45) * 15; // Centered around 30deg holding angle

      // Move background blobs subtly
      const blobs = document.querySelector('.bg-blobs');
      if (blobs) {
        blobs.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0) scale(1.1)`;
      }

      // Tilt the Hero Title
      const heroTitle = document.getElementById('hero-title');
      if (heroTitle) {
        heroTitle.style.transform = `perspective(1000px) rotateY(${gamma / 5}deg) rotateX(${(beta - 30) / -5}deg)`;
      }
    }
  }, true);

  // iOS Permission Handling
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    document.addEventListener('click', () => {
      DeviceOrientationEvent.requestPermission().catch(console.error);
    }, { once: true });
  }
}

// ─── MOBILE TOUCH FEEDBACK ───
if (isTouchDevice) {
  document.querySelectorAll('.btn-prestige, .btn-secondary, .prestige-panel').forEach(el => {
    el.addEventListener('touchstart', () => {
      el.style.transform = 'scale(0.96)';
      el.style.filter = 'brightness(1.2)';
    }, { passive: true });
    el.addEventListener('touchend', () => {
      el.style.transform = '';
      el.style.filter = '';
    }, { passive: true });
  });
}

// ─── PRELOADER (CODING STYLE) ───
(function() {
  const terminal = document.getElementById('terminal-body');
  const preloader = document.getElementById('preloader');
  const bar = document.getElementById('preloader-bar');
  
  if (!terminal) return;

  const logs = [
    { text: '> sudo init --identity "Aryan Patel"', type: 'cmd' },
    { text: '[OK] Fetching project_data.json...', type: 'info' },
    { text: '[OK] Initializing 15+ active repositories...', type: 'info' },
    { text: '[OK] Injecting AI Prompt Engineering modules...', type: 'info' },
    { text: '[OK] Loading SSIP Phase 1 (Wispa AI)...', type: 'info' },
    { text: '[OK] Compiling University Rank 1 algorithms...', type: 'success' },
    { text: '> npm run start --prestige-mode', type: 'cmd' },
    { text: 'BUILD SUCCESSFUL. REVEALING PORTFOLIO...', type: 'success' }
  ];

  let logIndex = 0;
  function addLog() {
    if (logIndex < logs.length) {
      const line = document.createElement('div');
      line.className = `terminal-line ${logs[logIndex].type}`;
      line.textContent = logs[logIndex].text;
      terminal.appendChild(line);
      
      logIndex++;
      const progress = (logIndex / logs.length) * 100;
      if (bar) bar.style.width = `${progress}%`;
      
      setTimeout(addLog, Math.random() * 300 + 150);
    } else {
      // Done - Fade out
      setTimeout(() => {
        if (preloader) preloader.classList.add('fade-out');
        document.documentElement.classList.remove('loading');
        document.body.classList.remove('loading');
        setTimeout(() => { if (preloader) preloader.style.display = 'none'; }, 800);
      }, 600);
    }
  }

  document.documentElement.classList.add('loading');
  document.body.classList.add('loading');
  setTimeout(addLog, 500);
})();

// ─── SECURITY & PERFORMANCE ───
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if (
    e.key === 'F12' || 
    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || 
    (e.ctrlKey && e.key === 'U')
  ) {
    e.preventDefault();
    document.body.innerHTML = '<div style="background:#000;color:#fff;height:100vh;display:flex;align-items:center;justify-content:center;font-family:monospace;">SECURITY BREACH DETECTED. SYSTEM TERMINATED.</div>';
    setTimeout(() => { window.close(); }, 500);
    return false;
  }
});
document.addEventListener('wheel', () => {}, { passive: true });

// ─── LERP UTILITY ───
const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

// ─── LERP-BASED SMOOTH SCROLL DISABLED (Removed rubbery feel)
/*
(function() {
  if (isTouchDevice) return; // Standard touch scroll is already smooth

  let targetScrollY = window.scrollY;
  let currentScrollY = window.scrollY;
  let isScrolling = false;

  window.addEventListener('wheel', (e) => {
    // Only intercept if no modal is active
    if (document.body.classList.contains('modal-active') || document.body.classList.contains('loading')) {
      e.preventDefault();
      return;
    }
    
    e.preventDefault();
    targetScrollY += e.deltaY * 0.8; // Sensitivity
    targetScrollY = Math.max(0, Math.min(targetScrollY, document.documentElement.scrollHeight - window.innerHeight));
    
    if (!isScrolling) {
      isScrolling = true;
      requestAnimationFrame(updateScroll);
    }
  }, { passive: false });

  function updateScroll() {
    const diff = targetScrollY - currentScrollY;
    if (Math.abs(diff) > 0.1) {
      currentScrollY = lerp(currentScrollY, targetScrollY, 0.08);
      window.scrollTo(0, currentScrollY);
      requestAnimationFrame(updateScroll);
    } else {
      isScrolling = false;
    }
  }

  // Handle anchor links smoothly with the lerp system
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        targetScrollY = target.offsetTop - 80; // Account for header
        if (!isScrolling) {
          isScrolling = true;
          requestAnimationFrame(updateScroll);
        }
      }
    });
  });
})();
*/

// Standard anchor smooth scroll (Native)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// ─── MINIMAL LIVE CLOCK ───
function updateClock() {
  const clockEl = document.getElementById('minimal-clock');
  if (clockEl) {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${h}:${m}:${s}`;
  }
}
setInterval(updateClock, 1000);
updateClock(); // Initial call

// ─── FULL BOX DETAIL SYSTEM ───
const detailModal = document.getElementById('detail-modal');
const detailClose = document.getElementById('detail-close');
const detailContent = document.getElementById('detail-modal-content');
const detailOverlay = document.querySelector('.detail-modal-overlay');

function openDetail(panel) {
  if (!detailModal || !detailContent) return;

  const detailHero = document.getElementById('detail-hero-content');

  // Extract content from panel
  let title = panel.querySelector('h3')?.textContent || 'Detail View';
  let subtitle = '';
  
  // Try to find the most relevant subtitle/meta info
  const subSelectors = ['.exp-company', '.project-desc', '.ach-card-sub', '.cert-org', '.edu-school', '.about-sub'];
  for (let selector of subSelectors) {
    const el = panel.querySelector(selector);
    if (el) {
      subtitle = el.textContent;
      break;
    }
  }

  let bodyHTML = '';

  // Handle different types of panels with specific extraction logic
  if (panel.classList.contains('about-bio')) {
    const clone = panel.cloneNode(true);
    const cta = clone.querySelector('.about-cta-row');
    if (cta) cta.remove();
    bodyHTML = clone.innerHTML;
  } else if (panel.querySelector('.exp-list')) {
    bodyHTML = `<ul class="expanded-list">${panel.querySelector('.exp-list').innerHTML}</ul>`;
  } else if (panel.querySelector('.project-stack')) {
    bodyHTML = `<p class="expanded-body">${panel.querySelector('.project-desc').textContent}</p>`;
    bodyHTML += `<div class="expanded-tags">${panel.querySelector('.project-stack').innerHTML}</div>`;
  } else if (panel.classList.contains('skill-group')) {
    bodyHTML = `<div class="expanded-tags">${panel.querySelector('.skill-tags').innerHTML}</div>`;
  } else {
    const p = panel.querySelector('p');
    if (p) bodyHTML += `<p class="expanded-body">${p.textContent}</p>`;
    const tags = panel.querySelector('.skill-tags, .exp-tags, .project-stack');
    if (tags) bodyHTML += `<div class="expanded-tags">${tags.innerHTML}</div>`;
  }

  // Construct final modal HTML
  if (detailHero) {
    detailHero.innerHTML = `
      <h2 class="expanded-title">${title}</h2>
      ${subtitle ? `<p class="expanded-subtitle">${subtitle}</p>` : ''}
    `;
  }
  detailContent.innerHTML = bodyHTML;

  // Open modal with animation class
  detailModal.classList.add('active');
  document.body.classList.add('modal-active');
  
  // Custom event for AI assistant to notice
  window.dispatchEvent(new CustomEvent('detailOpened', { detail: { title } }));
}

function closeDetail() {
  if (detailModal) {
    detailModal.classList.remove('active');
    document.body.classList.remove('modal-active');
  }
}

// Add click listeners to all prestige panels
document.querySelectorAll('.prestige-panel').forEach(panel => {
  panel.addEventListener('click', (e) => {
    // Don't trigger if a link inside was clicked
    if (e.target.closest('a')) return;
    
    // Set radial expansion origin via CSS variables
    if (detailModal) {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      detailModal.style.setProperty('--mx', `${x}%`);
      detailModal.style.setProperty('--my', `${y}%`);
    }
    
    openDetail(panel);
  });
});

if (detailClose) detailClose.addEventListener('click', closeDetail);
if (detailOverlay) detailOverlay.addEventListener('click', closeDetail);

// Close on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDetail();
  }
});
