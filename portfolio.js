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

      // Active section logic
      let current = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 200) {
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
    { text: '> Initializing biometric handshake...', type: 'cmd' },
    { text: '[OK] Establishing encrypted tunnel...', type: 'info' },
    { text: '[OK] Scanning retinal patterns...', type: 'info' },
    { text: '> Checking database for ID: 0x4A7...', type: 'cmd' },
    { text: '[OK] Identity confirmed: Aryan Patel', type: 'success' },
    { text: '[OK] Decrypting portfolio assets...', type: 'info' },
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
      
      setTimeout(addLog, Math.random() * 400 + 200);
    } else {
      // Done - Fade out
      setTimeout(() => {
        if (preloader) preloader.classList.add('fade-out');
        document.documentElement.classList.remove('loading');
        document.body.classList.remove('loading');
        setTimeout(() => { if (preloader) preloader.style.display = 'none'; }, 800);
      }, 1200);
    }
  }

  document.documentElement.classList.add('loading');
  document.body.classList.add('loading');
  setTimeout(addLog, 800);
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
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 1;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      // Bounce off walls
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      
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

      // Max velocity
      const maxSpeed = 1.5;
      const speed = Math.hypot(this.vx, this.vy);
      if (speed > maxSpeed) {
        this.vx = (this.vx / speed) * maxSpeed;
        this.vy = (this.vy / speed) * maxSpeed;
      }
    }
    
    draw() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      ctx.fillStyle = currentTheme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const color = currentTheme === 'light' ? '0, 0, 0' : '255, 255, 255';
    
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        
        if (dist < connectionDistance) {
          let opacity = 1 - (dist / connectionDistance);
          
          // Brighter near mouse
          if (mouse.x !== null) {
            const mDist1 = Math.hypot(particles[i].x - mouse.x, particles[i].y - mouse.y);
            const mDist2 = Math.hypot(particles[j].x - mouse.x, particles[j].y - mouse.y);
            if (mDist1 < mouseThreshold || mDist2 < mouseThreshold) {
              opacity *= 1.5;
            }
          }
          
          ctx.strokeStyle = `rgba(${color}, ${opacity * 0.12})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  
  init();
  animate();
})();
