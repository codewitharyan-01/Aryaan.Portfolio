// ─── HIGH-PERFORMANCE CIRCULAR RIPPLE THEME TOGGLE ───
const themeToggle = document.getElementById('theme-toggle');
const mobileThemeToggle = document.getElementById('mobile-theme-toggle');

let isThemeTransitionActive = false;

function triggerThemeRipple(targetTheme, originX, originY) {
  if (isThemeTransitionActive) return;
  isThemeTransitionActive = true;
  
  // Create ripple overlay element
  const ripple = document.createElement('div');
  ripple.className = 'theme-ripple-overlay';
  ripple.setAttribute('data-target-theme', targetTheme);
  
  // Set clip-path coordinates
  ripple.style.setProperty('--ripple-x', `${originX}px`);
  ripple.style.setProperty('--ripple-y', `${originY}px`);
  
  document.body.appendChild(ripple);
  
  // Force browser layout repaint
  ripple.offsetHeight;
  
  // Trigger circle expand animation
  ripple.classList.add('active');
  document.body.classList.add('theme-transitioning');
  
  // Wait for clip-path CSS animation (850ms)
  setTimeout(() => {
    // Actually apply the theme change to the DOM
    document.documentElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);
    
    // Clean up ripple element
    ripple.remove();
    document.body.classList.remove('theme-transitioning');
    isThemeTransitionActive = false;
  }, 850);
}

function setTheme(theme) {
  // Direct setter for initial load/no transition
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

[themeToggle, mobileThemeToggle].forEach(btn => {
  if (btn) {
    btn.addEventListener('click', (e) => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const targetTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      // Get click coordinates, or fall back to center of button
      const originX = e.clientX || btn.getBoundingClientRect().left + (btn.offsetWidth / 2);
      const originY = e.clientY || btn.getBoundingClientRect().top + (btn.offsetHeight / 2);
      
      triggerThemeRipple(targetTheme, originX, originY);
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

  document.querySelectorAll('a, button, .logo').forEach(el => {
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

// Cache section offsets to eliminate layout thrashing on scroll
let cachedSections = [];
function cacheSectionOffsets() {
  cachedSections = [];
  sections.forEach((section) => {
    cachedSections.push({
      id: section.getAttribute("id"),
      offsetTop: section.offsetTop
    });
  });
}
// Listen to window load and resize to re-calculate offsets
window.addEventListener('resize', cacheSectionOffsets);
window.addEventListener('load', cacheSectionOffsets);
// Execute initial cache
setTimeout(cacheSectionOffsets, 500); // Small timeout to ensure fully rendered layout offsets

let lastActiveSection = '';
let isScrolling = false;

window.addEventListener('scroll', () => {
  if (!isScrolling) {
    requestAnimationFrame(() => {
      // Progress bar logic (GPU accelerated)
      const winScroll = window.scrollY || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = height > 0 ? Math.min(1, Math.max(0, winScroll / height)) : 0;
      if (progressBar) progressBar.style.transform = `scaleX(${progress})`;

      // Active section logic using cached offsets
      let current = "";
      cachedSections.forEach((sec) => {
        if (winScroll >= sec.offsetTop - 200) {
          current = sec.id;
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

      isScrolling = false;
    });
    isScrolling = true;
  }
}, { passive: true });

// ─── COPY TEXT ───
function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast("Copied: " + text);
  });
}

// ─── SCROLL DISCOVER BUTTON ───
const scrollDiscoverBtn = document.getElementById('scroll-discover-btn');
if (scrollDiscoverBtn) {
  scrollDiscoverBtn.addEventListener('click', () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
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
    if (now - lastToggleTime > 1200 && !isThemeTransitionActive) {
      const tilt = event.beta;
      if (tilt !== null) {
        if (tilt > (TILT_THRESHOLD + BUFFER) && lastOrientationTheme !== 'light') {
          triggerThemeRipple('light', window.innerWidth / 2, window.innerHeight);
          lastOrientationTheme = 'light';
          lastToggleTime = now;
        } else if (tilt < (TILT_THRESHOLD - BUFFER) && lastOrientationTheme !== 'dark') {
          triggerThemeRipple('dark', window.innerWidth / 2, window.innerHeight);
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
  document.querySelectorAll('.btn-prestige, .btn-secondary').forEach(el => {
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

// ─── PRELOADER (BIOMETRIC DASHBOARD) ───
(function() {
  const terminal = document.getElementById('terminal-body');
  const preloader = document.getElementById('preloader');
  const bar = document.getElementById('preloader-bar');
  const authStatus = document.getElementById('auth-status');
  
  if (!terminal) return;

  const logs = [
    { text: '> Checking database for ID: 0x4A7...', type: 'cmd' },
    { text: '[OK] Identity confirmed: Aryan Patel', type: 'success' },
    { text: '> npm run start --prestige-mode', type: 'cmd' },
    { text: 'SYSTEM READY. AUTHORIZATION GRANTED.', type: 'success' }
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

      // Update Auth Status at the end
      if (logIndex === logs.length && authStatus) {
        authStatus.textContent = 'AUTHORIZATION: GRANTED';
        authStatus.style.color = '#4ade80';
        authStatus.style.textShadow = '0 0 15px rgba(74, 222, 128, 0.5)';
      }
      
      setTimeout(addLog, Math.random() * 300 + 150);
    } else {
      // Wait for the airplane to complete its flight smoothly to the end of the bar
      setTimeout(() => {
        if (preloader) preloader.classList.add('fade-out');
        document.documentElement.classList.remove('loading');
        document.body.classList.remove('loading');
        setTimeout(() => { if (preloader) preloader.style.display = 'none'; }, 1200);
      }, 1650);
    }
  }

  document.documentElement.classList.add('loading');
  document.body.classList.add('loading');
  setTimeout(addLog, 800);
})();

// ─── WATERTIGHT SECURITY & PRIVACY SHIELD ───
const securityShield = document.getElementById('security-shield');

function enableSecurityBlur() {
  document.body.classList.add('screen-secured');
}

function disableSecurityBlur() {
  document.body.classList.remove('screen-secured');
}

// Blur screen when window loses focus (Anti-screenshot/recording/sharing shield)
window.addEventListener('blur', enableSecurityBlur);
window.addEventListener('focus', disableSecurityBlur);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    enableSecurityBlur();
  } else {
    disableSecurityBlur();
  }
});

// Protect Clipboard on Copy/Cut attempt
document.addEventListener('copy', (e) => {
  e.preventDefault();
  if (navigator.clipboard) {
    navigator.clipboard.writeText("⚠️ SECURITY ACTIVE: Content copying is disabled for security reasons.");
  }
  showToast("Copying content is disabled 🛡️");
});

document.addEventListener('cut', (e) => {
  e.preventDefault();
  showToast("Cutting content is disabled 🛡️");
});

// Prevent Drag & Drop of page elements/images
document.addEventListener('dragstart', (e) => {
  e.preventDefault();
});
document.addEventListener('drop', (e) => {
  e.preventDefault();
});

// Intercept PrintScreen key & clear clipboard
window.addEventListener('keyup', (e) => {
  if (e.key === 'PrintScreen') {
    if (navigator.clipboard) {
      navigator.clipboard.writeText("⚠️ SECURITY ACTIVE: Screenshot captured text or file transfer blocked.");
    }
    showToast("Screenshot protection active 🛡️");
  }
});

// DevTools Protection Hotkeys
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if (
    e.key === 'F12' || 
    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || 
    (e.ctrlKey && e.key === 'U')
  ) {
    e.preventDefault();
    document.body.innerHTML = '<div style="background:#000;color:#fff;height:100vh;display:flex;align-items:center;justify-content:center;font-family:monospace;text-align:center;padding:2rem;">SECURITY BREACH DETECTED. SYSTEM TERMINATED.<br/><br/>Please close this tab.</div>';
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
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const hoursStr = String(hours).padStart(2, '0');
    
    clockEl.textContent = `${hoursStr}:${minutes}:${seconds} ${ampm}`;
  }
}
setInterval(updateClock, 1000);
updateClock(); // Initial call

// ─── INTERACTIVE NEURAL NETWORK BACKGROUND ───
(function() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let particles = [];
  const particleCount = isTouchDevice ? 40 : 100;
  const connectionDistance = 150;
  const mouseThreshold = 200;
  
  let mouse = { x: null, y: null };
  
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('resize', init);
  
  class Particle {
    constructor() {
      this.init();
    }
    
    init() {
      this.x = Math.random() * window.innerWidth;
      this.y = Math.random() * window.innerHeight;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 1;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      // Bounce off boundaries in CSS coordinates
      if (this.x < 0 || this.x > window.innerWidth) this.vx *= -1;
      if (this.y < 0 || this.y > window.innerHeight) this.vy *= -1;
      
      // Mouse interaction
      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist < mouseThreshold) {
          const force = (mouseThreshold - dist) / mouseThreshold;
          this.vx += (dx / dist) * force * 0.02;
          this.vy += (dy / dist) * force * 0.02;
        }
      }

      // Max velocity constraint
      const maxSpeed = 1.5;
      const speed = Math.hypot(this.vx, this.vy);
      if (speed > maxSpeed) {
        this.vx = (this.vx / speed) * maxSpeed;
        this.vy = (this.vy / speed) * maxSpeed;
      }
    }
    
    draw() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      ctx.fillStyle = currentTheme === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  function init() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2.0 to balance performance and sharpness
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    
    // Style boundaries remain css pixels
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    
    ctx.resetTransform();
    ctx.scale(dpr, dpr);
    
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }
  
  function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const color = currentTheme === 'light' ? '0, 0, 0' : '255, 255, 255';
    
    // 1. Update and Draw Particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    
    // 2. Bin connection lines by opacity to minimize stroke calls (Binning optimization)
    const lowOpacityLines = [];    // Opacity: ~0.04
    const medOpacityLines = [];    // Opacity: ~0.08
    const highOpacityLines = [];   // Opacity: ~0.12
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        
        if (dist < connectionDistance) {
          let opacity = 1 - (dist / connectionDistance);
          
          // Boost opacity near mouse
          if (mouse.x !== null) {
            const mDist1 = Math.hypot(particles[i].x - mouse.x, particles[i].y - mouse.y);
            const mDist2 = Math.hypot(particles[j].x - mouse.x, particles[j].y - mouse.y);
            if (mDist1 < mouseThreshold || mDist2 < mouseThreshold) {
              opacity *= 1.5;
            }
          }
          
          const line = { x1: particles[i].x, y1: particles[i].y, x2: particles[j].x, y2: particles[j].y };
          
          // Assign to opacity bin
          if (opacity < 0.4) {
            lowOpacityLines.push(line);
          } else if (opacity < 0.7) {
            medOpacityLines.push(line);
          } else {
            highOpacityLines.push(line);
          }
        }
      }
    }
    
    // 3. Draw binned lines in single stroke calls
    ctx.lineWidth = 0.8;
    
    // Low Opacity Bin
    if (lowOpacityLines.length > 0) {
      ctx.strokeStyle = `rgba(${color}, 0.04)`;
      ctx.beginPath();
      for (let k = 0; k < lowOpacityLines.length; k++) {
        ctx.moveTo(lowOpacityLines[k].x1, lowOpacityLines[k].y1);
        ctx.lineTo(lowOpacityLines[k].x2, lowOpacityLines[k].y2);
      }
      ctx.stroke();
    }
    
    // Medium Opacity Bin
    if (medOpacityLines.length > 0) {
      ctx.strokeStyle = `rgba(${color}, 0.08)`;
      ctx.beginPath();
      for (let k = 0; k < medOpacityLines.length; k++) {
        ctx.moveTo(medOpacityLines[k].x1, medOpacityLines[k].y1);
        ctx.lineTo(medOpacityLines[k].x2, medOpacityLines[k].y2);
      }
      ctx.stroke();
    }
    
    // High Opacity Bin
    if (highOpacityLines.length > 0) {
      ctx.strokeStyle = `rgba(${color}, 0.12)`;
      ctx.beginPath();
      for (let k = 0; k < highOpacityLines.length; k++) {
        ctx.moveTo(highOpacityLines[k].x1, highOpacityLines[k].y1);
        ctx.lineTo(highOpacityLines[k].x2, highOpacityLines[k].y2);
      }
      ctx.stroke();
    }
    
    requestAnimationFrame(animate);
  }
  
  init();
  animate();
})();

// ─── HERO STAT COUNTER ANIMATION ───
(function () {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  // Easing: ease-out cubic
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    const target    = parseFloat(el.dataset.target);
    const suffix    = el.dataset.suffix  || '';
    const decimals  = parseInt(el.dataset.decimals, 10) || 0;
    const duration  = 1800; // ms
    const startTime = performance.now();

    el.classList.add('counting');

    function tick(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutCubic(progress);
      const current  = eased * target;

      el.textContent = current.toFixed(decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toFixed(decimals) + suffix;
        el.classList.remove('counting');
        el.classList.add('done');
        // Remove done class after pop animation completes
        setTimeout(() => el.classList.remove('done'), 500);
      }
    }

    requestAnimationFrame(tick);
  }

  // Trigger when the stats row enters the viewport
  const heroStats = document.querySelector('.hero-stats');
  if (!heroStats) return;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger each counter slightly
        counters.forEach((el, i) => {
          setTimeout(() => animateCounter(el), i * 200);
        });
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.6 });

  // Wait for preloader to finish before observing
  setTimeout(() => {
    statsObserver.observe(heroStats);
  }, 8000);
})();
