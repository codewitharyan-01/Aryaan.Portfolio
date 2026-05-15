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
      let targetX = mouseX;
      let targetY = mouseY;
      let targetWidth = 20;
      let targetHeight = 20;
      let targetOpacity = 1;
      let isSnapping = false;

      // Check for magnetic snapping
      document.querySelectorAll('a, button, .skill-tag, .logo').forEach(el => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(mouseX - centerX, mouseY - centerY);
        const snapThreshold = 60;

        if (dist < snapThreshold) {
          targetX = centerX;
          targetY = centerY;
          targetWidth = rect.width + 10;
          targetHeight = rect.height + 10;
          targetOpacity = 0.15;
          isSnapping = true;
          cursor.classList.add('snapping');
        }
      });

      if (!isSnapping) {
        cursor.classList.remove('snapping');
        cursor.style.width = '';
        cursor.style.height = '';
        cursor.style.background = '';
        cursor.style.opacity = '';
      } else {
        cursor.style.width = `${targetWidth}px`;
        cursor.style.height = `${targetHeight}px`;
        cursor.style.background = 'var(--text)';
        cursor.style.opacity = targetOpacity;
      }

      cursor.style.transform = `translate3d(${targetX - (isSnapping ? targetWidth/2 : 10)}px, ${targetY - (isSnapping ? targetHeight/2 : 10)}px, 0)`;
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

// ─── AI COMMAND CENTER ───
const aiTrigger = document.getElementById('ai-trigger');
const aiModal = document.getElementById('ai-modal');
const aiClose = document.getElementById('ai-close');
const aiInput = document.getElementById('ai-input');
const aiHistory = document.getElementById('ai-chat-history');
const aiSend = document.getElementById('ai-send');

const AI_DATABASE = {
  // PROJECTS
  'projects': 'Aryan has 15+ projects. Highlights include Wispa AI (Startup), Smart City Portal, and Life Fitness System.',
  'wispa': 'Wispa AI is a startup project developing an AI device. It\'s funded by Govt. of India (SSIP Phase 1).',
  'smart city': 'The Smart City Portal is a PHP/MySQL app for civic issue tracking. It reduced resolution time by 30%.',
  'fitness': 'The Life Fitness System manages gym memberships, trainer assignments, and automated billing using PHP.',
  'billing': 'Aryan built a custom billing system for dynamic invoice generation and inventory tracking.',
  'freelance': 'He has delivered 15+ real-world web projects to diverse clients independently.',
  
  // SKILLS & TECH
  'stack': 'His primary stack is PHP, React.js, MySQL, and AI Prompt Engineering.',
  'languages': 'He codes in JavaScript, PHP, Java, HTML5, and CSS3.',
  'frameworks': 'Proficient in React.js and WordPress.',
  'ai': 'Aryan is an AI Builder & Prompt Engineer. He uses ChatGPT, Google Gen AI, and building his own AI startup.',
  'database': 'He has strong expertise in MySQL and database optimization.',
  'it support': 'He has 178 hours of experience in IT Support and technical troubleshooting.',
  'networking': 'Experienced in backup recovery strategies and network engineering.',

  // EDUCATION & AWARDS
  'education': 'B.E. in Computer Engineering (SVBIT) and Diploma (Atul Polytechnic). Rank 1 in University!',
  'cgpa': 'He maintained a 9.02 CGPA in his Diploma and is in the Top 10 for his B.E.',
  'rank': 'Aryan achieved University Rank 1 in his Diploma and is currently Rank 10 in his Engineering batch.',
  'awards': 'He won 2nd Runner-up at the Times of India Ideathon (₹30,000 prize) and 1st in Smart City Presentation.',
  'hackathon': 'Participated in Google Gen AI Exchange Hackathon 2026.',
  'university': 'Studying at SVBIT Gandhinagar (B.E.) and Alumnus of Atul Polytechnic (Diploma).',

  // EXPERIENCE
  'internship': 'Aryan has completed 5 internships: IT Support (Ascendant), Google Student Ambassador (Ping Digital), Webito, Iclerisy, and Talrop.',
  'google': 'He was a Google Student Ambassador and intern at Ping Digital Broadcast.',
  'webito': 'He worked as a Frontend Intern & Network Engineer at Webito Infotech.',
  'iclerisy': 'Junior PHP Developer at Iclerisy, where he delivered client projects independently.',
  'talrop': 'PR and R&D intern at Talrop, Kerala, including 16 days of on-site training.',

  // CONTACT & PERSONAL
  'contact': 'Email: happier.aryan@gmail.com | Phone: +91 90236 68571.',
  'location': 'Aryan is based in Ahmedabad, Gujarat, India.',
  'resume': 'You can download his CV/Resume using the "Download CV" buttons or typing "resume".',
  'startup': 'He is the founder of Wispa AI, a startup focusing on AI-driven innovation.',
  'help': 'Ask about: projects, skills, education, wispa, awards, internships, or contact info.'
};

function addMessage(text, isBot = true) {
  const msg = document.createElement('div');
  msg.className = `ai-msg ${isBot ? 'bot' : 'user'}`;
  msg.innerHTML = text; // Allow for links
  aiHistory.appendChild(msg);
  aiHistory.scrollTop = aiHistory.scrollHeight;
}

function handleAICommand() {
  const cmd = aiInput.value.toLowerCase().trim();
  if (!cmd) return;
  addMessage(cmd, false);
  aiInput.value = '';

  setTimeout(() => {
    let response = "I'm not sure about that. Type 'help' for available topics!";
    
    // Improved Fuzzy Matching
    const keys = Object.keys(AI_DATABASE);
    const match = keys.find(key => cmd.includes(key));
    
    if (match) {
      response = AI_DATABASE[match];
    }

    if (cmd.includes('theme')) setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    if (cmd.includes('resume')) window.open('resume.pdf', '_blank');
    if (cmd.includes('hello') || cmd.includes('hi')) response = "Hi there! I'm Aryan's digital twin. Ask me about his 15+ projects!";
    
    addMessage(response);
  }, 400);
}

function openAIModal() {
  if (aiModal) {
    aiModal.classList.add('active');
    document.body.classList.add('modal-active');
    setTimeout(() => aiInput.focus(), 300);
  }
}

function closeAIModal() {
  if (aiModal) {
    aiModal.classList.remove('active');
    document.body.classList.remove('modal-active');
  }
}

// Auto-open after 10 seconds
window.addEventListener('load', () => {
  setTimeout(openAIModal, 10000);
});

if (aiModal) {
  aiClose.addEventListener('click', closeAIModal);
  aiSend.addEventListener('click', handleAICommand);
  aiInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleAICommand(); });
  
  // Shortcut Ctrl+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openAIModal();
    }
    if (e.key === 'Escape') closeAIModal();
  });
}

// ─── INERTIAL GRAVITY PHYSICS (10X CREATIVITY) ───
const { Engine, Render, World, Bodies, Body, Composite, Runner } = Matter;

const engine = Engine.create();
engine.world.gravity.y = 0; // Default zero gravity

const decorElements = document.querySelectorAll('.decor-item, .decor-text, .decor-snippet, .decor-binary, .decor-tag, .decor-arch');
const physicsBodies = [];

// Create physics bodies for each decoration
decorElements.forEach((el) => {
  const rect = el.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  
  // Make them circular for smoother sliding
  const body = Bodies.circle(x, y, Math.max(rect.width, rect.height) / 2, {
    friction: 0.05,
    restitution: 0.6,
    density: 0.001
  });
  
  physicsBodies.push({ body, element: el });
  World.add(engine.world, body);
});

// Add invisible boundaries
const width = window.innerWidth;
const height = window.innerHeight;
const ground = Bodies.rectangle(width/2, height + 50, width, 100, { isStatic: true });
const ceiling = Bodies.rectangle(width/2, -50, width, 100, { isStatic: true });
const leftWall = Bodies.rectangle(-50, height/2, 100, height, { isStatic: true });
const rightWall = Bodies.rectangle(width + 50, height/2, 100, height, { isStatic: true });
World.add(engine.world, [ground, ceiling, leftWall, rightWall]);

// Sync physics to DOM
Runner.run(engine);
(function update() {
  physicsBodies.forEach(({ body, element }) => {
    // Keep within viewport (teleport if they escape somehow)
    if (body.position.x < -100) Body.setPosition(body, { x: width + 50, y: body.position.y });
    if (body.position.x > width + 100) Body.setPosition(body, { x: -50, y: body.position.y });
    if (body.position.y < -100) Body.setPosition(body, { x: body.position.x, y: height + 50 });
    if (body.position.y > height + 100) Body.setPosition(body, { x: body.position.x, y: -50 });

    element.style.transform = `translate3d(${body.position.x - (body.bounds.max.x - body.bounds.min.x)/2 - element.offsetLeft}px, ${body.position.y - (body.bounds.max.y - body.bounds.min.y)/2 - element.offsetTop}px, 0) rotate(${body.angle}rad)`;
  });
  requestAnimationFrame(update);
})();

// ─── SENSOR & INTERACTION SYNC ───
if (window.DeviceOrientationEvent) {
  let lastOrientationTheme = savedTheme;
  let lastToggleTime = 0;
  const TILT_THRESHOLD = 40;
  const BUFFER = 10;

  window.addEventListener('deviceorientation', (event) => {
    const now = Date.now();
    const beta = event.beta;  
    const gamma = event.gamma;

    // 1. THEME TOGGLE LOGIC
    if (now - lastToggleTime > 500) {
      if (beta !== null) {
        if (beta > (TILT_THRESHOLD + BUFFER) && lastOrientationTheme !== 'light') {
          setTheme('light');
          lastOrientationTheme = 'light';
          lastToggleTime = now;
        } else if (beta < (TILT_THRESHOLD - BUFFER) && lastOrientationTheme !== 'dark') {
          setTheme('dark');
          lastOrientationTheme = 'dark';
          lastToggleTime = now;
        }
      }
    }

    // 2. GRAVITY PHYSICS
    if (beta !== null && gamma !== null) {
      engine.world.gravity.x = gamma / 45;
      engine.world.gravity.y = (beta - 30) / 45; 
    }
  }, true);

  // iOS Permission Handling
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    document.addEventListener('click', () => {
      DeviceOrientationEvent.requestPermission().catch(console.error);
    }, { once: true });
  }
}

// Cursor Push Force (Desktop)
if (!isTouchDevice) {
  document.addEventListener('mousemove', (e) => {
    physicsBodies.forEach(({ body }) => {
      const dist = Math.hypot(e.clientX - body.position.x, e.clientY - body.position.y);
      if (dist < 150) {
        const force = 0.005;
        const angle = Math.atan2(body.position.y - e.clientY, body.position.x - e.clientX);
        Body.applyForce(body, body.position, {
          x: Math.cos(angle) * force,
          y: Math.sin(angle) * force
        });
      }
    });
  });
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
