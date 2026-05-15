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

  const updateMouseEffects = () => {
    // MAGNETIC ELEMENTS
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
      cursor.style.display = 'block';
      let targetX = mouseX;
      let targetY = mouseY;
      let targetWidth = 8;
      let targetHeight = 8;
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
          targetWidth = rect.width + 12;
          targetHeight = rect.height + 12;
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

// ─── AI COMMAND CENTER ───
const aiTrigger = document.getElementById('ai-trigger');
const aiModal = document.getElementById('ai-modal');
const aiClose = document.getElementById('ai-close');
const aiInput = document.getElementById('ai-input');
const aiHistory = document.getElementById('ai-chat-history');
const aiSend = document.getElementById('ai-send');

const AI_DATABASE = {
  // TECHNICAL SKILLS & TOOLS (1-20)
  'tech stack': 'Aryan is a Full Stack expert. His core stack includes PHP (Backend), React.js (Frontend), and MySQL (Database), complemented by advanced AI Prompt Engineering and WordPress mastery.',
  'react': 'Aryan is proficient in React.js, building dynamic and responsive user interfaces with modern hooks.',
  'php': 'He has extensive experience in backend development using PHP for multiple real-world client projects.',
  'javascript': 'JavaScript is his core language, used for everything from UI logic to custom cursor engines.',
  'mysql': 'Aryan is an expert in relational databases and SQL optimization for secure data storage.',
  'css': 'He masters Vanilla CSS, Glassmorphism, and responsive design systems.',
  'html': 'Strong foundation in Semantic HTML5 for SEO and accessibility.',
  'java': 'Solid understanding of Java for core programming and system logic.',
  'prompt engineering': 'Specializes in Prompt Engineering to build smart AI tools and automate workflows.',
  'wordpress': 'Experience in building and maintaining high-performance WordPress sites.',
  'full stack': 'Capable of handling both pixel-perfect frontends and robust backends.',
  'vscode': 'VS Code is his primary editor, customized for maximum engineering efficiency.',
  'git': 'Proficient in Git version control for collaborative development.',
  'github': 'Check his repositories at github.com/codewitharyan-01.',
  'figma': 'Uses Figma for UI/UX prototyping before moving to code.',
  'api': 'Experienced in building and consuming RESTful APIs.',
  'node': 'Has working knowledge of Node.js for server-side environments.',
  'python': 'Familiar with Python for automation and basic AI scripts.',
  'tailwind': 'He can use Tailwind CSS but prefers Vanilla CSS for maximum flexibility.',
  'mongodb': 'Knowledge of NoSQL databases like MongoDB for flexible data structures.',

  // PROJECTS & STARTUPS (21-40)
  'wispa': 'Wispa AI is a high-tech startup project focusing on AI devices, applied for SSIP funding.',
  'smart city': 'The Smart City Portal is a civic-tech platform that improved city management by 30%.',
  'fitness': 'Life Fitness is a gym management platform that automates memberships and billing.',
  'billing': 'Engineered a custom billing system for dynamic invoice generation.',
  'portfolio': 'This 10x Portfolio features gravity-sensing themes and an AI command center.',
  'startup': 'Founder of Wispa AI, an innovative startup in the early growth phase.',
  'freelance': 'Delivered 15+ real-world web projects to diverse global clients.',
  'citizen portal': 'The Smart City portal is one of his most impactful civic-tech projects.',
  'prototype': 'Built the Phase One prototype for the Wispa AI hardware/software device.',
  'web apps': 'Developed multiple large-scale web applications independently.',
  'inventory': 'Built a robust inventory management system for retail clients.',
  'ecommerce': 'Experienced in building custom E-commerce solutions with secure payments.',
  'real estate': 'Developed a property listing portal for real estate agencies.',
  'education tech': 'Built student management portals for educational institutions.',
  'ui/ux': 'Focuses on creating premium, high-fidelity user experiences.',
  'responsive': 'All his projects are 100% mobile-first and fully responsive.',
  'seo': 'Implements technical SEO best practices in every web project.',
  'performance': 'Optimizes every site for ultra-fast loading speeds (100 Lighthouse scores).',
  'wispa phase': 'Wispa is currently in Phase 1, focusing on core AI integration.',
  'wispa goal': 'The goal of Wispa is to make AI accessible via physical hardware.',

  // EXPERIENCE & INTERNSHIPS (41-60)
  'internship': 'Completed 5 internships: Ascendant, Ping Digital, Webito, Iclerisy, and Talrop.',
  'webito': 'Frontend Intern and Network Engineer at Webito Infotech.',
  'iclerisy': 'Junior PHP Developer at Iclerisy, delivering client-side applications.',
  'talrop': 'PR and R&D intern at Talrop, including 16 days of on-site training in Kerala.',
  'ascendant': 'Completed 178 hours of IT Support internship at Ascendant Technologies.',
  'ping digital': 'Google Student Ambassador and intern at Ping Digital Broadcast.',
  'it support': '178+ hours of experience in technical troubleshooting and support.',
  'network': 'Experienced in Network Engineering and backup recovery strategies.',
  'google': 'Represented Google as a Student Ambassador on campus.',
  'support': 'Strong background in IT Support helps him solve complex technical issues.',
  'teamwork': 'Experienced in working with cross-functional development teams.',
  'remote': 'Highly productive in remote work environments with clear communication.',
  'hybrid': 'Comfortable with both on-site and remote work setups.',
  'professional': 'Maintains high standards of professional ethics and code quality.',
  'collaboration': 'Uses tools like Trello and Slack for seamless team collaboration.',
  'agile': 'Familiar with Agile and Scrum methodologies for project management.',
  'scrum': 'Has participated in daily scrums during his professional internships.',
  'mentor': 'Enjoys mentoring junior developers and sharing tech knowledge.',
  'leadership': 'Has led project teams of 3-5 developers in various hackathons.',
  'management': 'Certified in Project Management with a focus on technical delivery.',

  // EDUCATION & ACHIEVEMENTS (61-80)
  'education': 'Pursuing B.E. at SVBIT and holds a Diploma from Atul Polytechnic.',
  'rank 1': 'Achieved University Rank 1 during his Diploma studies.',
  'cgpa': 'Maintained a 9.02 CGPA during his Diploma studies.',
  'university': 'SVBIT Gandhinagar (B.E.) and Alumnus of Atul Polytechnic (Diploma).',
  'svbit': 'Top-tier student at SVBIT, currently in 6th semester Computer Engineering.',
  'diploma': 'Completed Diploma with high honors and University Rank 1.',
  'polytechnic': 'Excelled academically at Atul Polytechnic, Khadat.',
  'engineering': 'Focuses on AI, scalable systems, and modern software architecture.',
  'degree': 'Bachelor of Engineering (B.E.) candidate in Computer Engineering.',
  'scholar': 'Consistently a top performer, ranking in the University Top 10.',
  'gandhinagar': 'Studies in Gandhinagar, the educational hub of Gujarat.',
  'gujarat': 'Based in Gujarat, India, a growing hub for tech innovation.',
  'certification': 'Certified in Google IT Support, Project Management, and Cyber Hygiene.',
  'training': 'Completed 16 days of intensive on-site training in Kerala with Talrop.',
  'workshop': 'Attended multiple workshops on AI, Cloud, and Web Security.',
  'awards': 'Winner: TOI Ideathon (₹30K) and 1st Place at Technovations.',
  'ideathon': '2nd Runner-up at Times of India Ideathon for Travel & Tourism.',
  'technovations': '1st Place for Smart City Presentation at SVBIT Technovations.',
  'hackathon': 'Participated in Google Gen AI Exchange Hackathon 2026.',
  'prize': 'Has won multiple cash prizes and academic honors.',

  // PERSONAL & CAREER (81-100+)
  'contact': 'Email: happier.aryan@gmail.com | Phone: +91 90236 68571.',
  'location': 'Based in Ahmedabad, Gujarat, India.',
  'email': 'happier.aryan@gmail.com',
  'phone': '+91 90236 68571',
  'whatsapp': '+91 90236 68571',
  'linkedin': 'Connect with him on LinkedIn: Aryan Patel.',
  'instagram': '@1.aryaan',
  'resume': 'Download his CV using the "Download CV" buttons.',
  'cv': 'Download his CV using the "Download CV" buttons.',
  'hire': 'Actively looking for internship and fresher opportunities!',
  'availability': 'Available for immediate hire or upcoming internships.',
  'salary': 'Open to competitive offers based on the role and impact.',
  'relocate': 'Open to relocation for the right opportunity.',
  'timezone': 'Operates in IST (UTC+5:30) but can adjust for global teams.',
  'hobbies': 'Enjoys cricket, tech blogging, and exploring new AI tools.',
  'cricket': 'A big fan of cricket and enjoys playing in his free time.',
  'travel': 'Enjoys traveling and exploring new cultures.',
  'reading': 'Reads tech blogs and documentation to stay updated.',
  'motivation': 'Driven by the goal of building products that solve real human problems.',
  'values': 'Integrity, continuous learning, and pixel-perfection.',
  'goals': 'To become a Lead AI Engineer and build his own tech ecosystem.',
  'help': 'I can answer 100+ questions about his career. Try "wispa" or "rank".',
  'who': 'I am Aryan\'s digital twin, powered by his professional data.',
  'bot': 'I am an AI assistant built to save you time and provide facts.',
  'services': 'He offers Full Stack Development, IT Consulting, and AI Prompting.',
  'rates': 'Contact him directly for project-based or hourly rates.',
  'socials': 'Find him on LinkedIn, GitHub, and Instagram.',
  
  // NEW 50+ KEYWORDS (101-150+)
  'impact': 'Aryan focuses on building high-impact projects. His Smart City portal alone improved local issue resolution by 30%.',
  'vision': 'His vision is to integrate AI into physical hardware to solve real-world problems, starting with Wispa AI.',
  'scalable': 'Aryan specializes in building scalable web architectures that can handle thousands of concurrent users.',
  'clean code': 'He is a firm believer in Clean Code and SOLID principles for maintainable software development.',
  'optimization': 'Every project is optimized for ultra-fast performance, targeting sub-second load times.',
  'security': 'He prioritizes security, implementing sanitization and encryption in all his backend (PHP/MySQL) work.',
  'automation': 'Aryan loves automating repetitive tasks, from dev environment setups to data processing scripts.',
  'testing': 'He understands the importance of testing and is exploring automated testing frameworks.',
  'debugging': 'Debugging is one of his strongest skills, especially in complex JavaScript and PHP environments.',
  'cloud': 'Familiar with Google Cloud services and hosting deployments for scalable apps.',
  'deployment': 'He uses Vercel, Netlify, and custom server setups for deploying his production projects.',
  'hosting': 'Experienced in managing shared, VPS, and cloud-based hosting environments.',
  'domain': 'Knowledge of DNS management, SSL configuration, and domain routing.',
  'branding': 'Aryan understands digital branding, as seen in his cohesive Prestige design system.',
  'ui kit': 'He often builds his own custom UI kits to ensure consistent aesthetics across his projects.',
  'ux principles': 'His designs follow core UX principles: accessibility, hierarchy, and user-centric flows.',
  'color theory': 'Expert in modern color theory, using dark modes and balanced accent colors (Blue/Emerald).',
  'typography': 'Uses high-end Google Fonts (Outfit, Inter) to ensure maximum readability and style.',
  'motion': 'He uses framer-motion and CSS animations to create a "living" UI experience.',
  'haptic': 'Implemented touch-based haptic feedback for a physical feel on mobile devices.',
  'parallax': 'Uses gyroscope-driven parallax effects for a deep 3D feel on mobile.',
  'gestures': 'Knowledge of touch gestures and swipe interactions for modern mobile apps.',
  'batch': 'Aryan belongs to the 2021-2027 Engineering batch (Diploma + Degree).',
  'semester': 'He is currently excelling in his 6th Semester of Computer Engineering.',
  'subjects': 'His favorite subjects include Web Technology, Database Systems, and AI.',
  'coding hours': 'Aryan is a dedicated developer, often coding for 10+ hours a day on personal and client projects.',
  'learning': 'Currently learning advanced Gen AI and large language model (LLM) integration.',
  'motivation': 'His motivation comes from seeing his code solve actual problems for real people.',
  'problem solving': 'An expert problem solver who approaches every bug as a learning opportunity.',
  'critical thinking': 'Strong critical thinker capable of analyzing project requirements from multiple angles.',
  'communication': 'Excellent communication skills, honed through his PR internship at Talrop.',
  'marketing': 'Understanding of digital marketing and SEO to help businesses grow online.',
  'sales': 'Experienced in client communication and presenting technical value to non-tech users.',
  'team lead': 'Has successfully led project teams of 3-5 students in multiple hackathons.',
  'project lead': 'Led the development of the Wispa AI prototype and the Smart City portal.',
  'research': 'Experienced in R&D, specifically researching AI hardware components for Wispa.',
  'innovation lab': 'Active in the innovation cell at SVBIT, exploring new tech ideas.',
  'entrepreneur': 'An aspiring tech entrepreneur building his own AI-driven ecosystem.',
  'startup life': 'Thrives in fast-paced startup environments like the one he is building at Wisra.',
  'government': 'His projects (Wispa) are aimed at aligning with Government innovation policies like SSIP.',
  'india': 'A proud Indian developer contributing to the local tech ecosystem.',
  'gandhinagar tech': 'Connected with the growing tech community in Gandhinagar and Ahmedabad.',
  'career goal': 'To become a CTO of a high-impact AI startup.',
  'role model': 'Inspired by tech leaders who build products that change the world.',
  'philosophy': 'Build fast, iterate often, and always prioritize the user.',
  'night owl': 'He is most productive at night, often working on complex logic when the world is quiet.',
  'coffee': 'Powered by good coffee and great music while coding.',
  'coding style': 'His coding style is minimalist, efficient, and well-documented.',
  'api integration': 'Experienced in integrating diverse APIs, from payment gateways to AI models.',
  'logic': 'Strong logical reasoning skills, especially in algorithm development.',
  'algorithms': 'Knowledge of core data structures and algorithms (DSA) for efficient problem solving.',
  'flexbox': 'Expert in CSS Flexbox for creating complex, fluid layouts.',
  'grid': 'Proficient in CSS Grid for high-precision, two-dimensional web designs.',
  'es6': 'Deep understanding of modern ES6+ JavaScript features like destructuring and arrow functions.',
  'async': 'Experienced in handling asynchronous operations using Promises and Async/Await in JavaScript.',
  'fetch': 'Uses the Fetch API for seamless communication between the frontend and backend services.',
  'localstorage': 'Utilizes LocalStorage for persistent client-side data, like your theme preferences!',
  'devtools': 'Expert in Chrome DevTools for debugging, profiling, and performance auditing.',
  'lighthouse': 'Targets 100/100 Lighthouse scores for Performance, SEO, and Accessibility.',
  'npm': 'Experienced in managing dependencies and build scripts using npm and Node.js.',
  'composer': 'Uses Composer for managing PHP dependencies and backend libraries.',
  'solid': 'Adheres to SOLID principles for scalable and maintainable software architecture.',
  'dry': 'Practices DRY (Don\'t Repeat Yourself) principles to keep codebases clean and efficient.',
  'pixel perfect': 'Dedicated to pixel-perfect implementation, ensuring designs look exactly as intended.',
  'mobile first': 'Every project is built with a mobile-first approach for the best user experience.',
  'seo audit': 'Performs technical SEO audits to ensure high search engine visibility for all projects.',
  'ux audit': 'Conducts user experience audits to identify and fix friction points in the UI.',
  'wireframe': 'Experienced in creating low-fidelity wireframes before high-fidelity prototyping.',
  'rest': 'Expert in building and consuming RESTful APIs for modern web applications.',
  'json': 'Deeply familiar with JSON for data exchange between systems.',
  'gitflow': 'Follows GitFlow best practices for version control and team collaboration.',
  'scrum master': 'Has experience acting as a Scrum Master for student project teams.',
  'innovation': 'Always looking for the most innovative way to solve a technical challenge.',
  'efficiency': 'Focuses on writing code that is not just functional, but highly efficient.',
  'database design': 'Strong background in database normalization and architecture.',
  'sql injection': 'Implements strict security measures to prevent SQL injection and other vulnerabilities.',
  'xss': 'Knowledge of preventing Cross-Site Scripting (XSS) in modern web apps.',
  'encryption': 'Uses modern encryption standards for sensitive user data.',
  'sanitization': 'Ensures all user input is sanitized before processing on the server.',
  'vps': 'Experienced in configuring and managing Virtual Private Servers for hosting.',
  'linux': 'Comfortable with Linux command line for server management and deployment.',
  'ssh': 'Uses SSH for secure remote server access and file management.',
  'cms': 'Experienced in building custom Content Management Systems from scratch.',
  'blogging': 'Enjoys writing technical blogs to share knowledge with the community.',
  'mentoring': 'Has mentored over 10+ students in basic web development.',
  'public speaking': 'Confident in presenting technical concepts to large audiences, as seen at SVBIT.',
  'research paper': 'Has explored researching AI integration for academic submissions.',
  'future of ai': 'Believes that AI will become the core operating layer of every digital product.',
  'career': 'Aryan is on a path to becoming a Senior AI Engineer and Tech Entrepreneur.',
  'goal': 'To build a technology ecosystem that empowers millions of users.',
  'dream': 'His dream is to lead a global tech startup based out of India.',
  'leadership style': 'His leadership style is collaborative, data-driven, and result-oriented.',
  'problem solving style': 'Approaches problems with a "First Principles" thinking mindset.',
  'coding hours': 'Usually found coding between 10 PM and 4 AM for maximum focus.',
  'ahmedabad': 'Proudly based in Ahmedabad, a city of heritage and innovation.',
  'gujarat tech': 'Active participant in the Gujarat tech community and meetups.',
  'startup india': 'Supporter of the Startup India initiative, building Wispa AI under its principles.',
};

function addMessage(text, isBot = true) {
  const msg = document.createElement('div');
  msg.className = `ai-msg ${isBot ? 'bot' : 'user'}`;
  msg.innerHTML = text; // Allow for HTML (links/formatting)
  aiHistory.appendChild(msg);
  aiHistory.scrollTop = aiHistory.scrollHeight;
}

function handleAICommand(command) {
  const cmd = command.toLowerCase().trim();
  if (!cmd) return;
  addMessage(command, false);

  setTimeout(() => {
    let response = "I'm not sure about that. Type 'help' for available topics!";
    
    // Advanced keyword matching
    const keys = Object.keys(AI_DATABASE);
    const match = keys.find(key => cmd.includes(key));
    
    if (match) {
      response = AI_DATABASE[match];
    }

    // Special commands
    if (cmd.includes('resume') || cmd.includes('cv')) {
      window.open('resume.pdf', '_blank');
      response = "Opening Aryan's CV in a new tab...";
    }
    
    if (cmd.includes('hello') || cmd.includes('hi')) {
      response = "Hi! I'm Aryan's digital twin. You can ask me about his 15+ projects or University Rank 1!";
    }

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
  aiSend.addEventListener('click', () => {
    const val = aiInput.value;
    handleAICommand(val);
    aiInput.value = '';
  });
  aiInput.addEventListener('keypress', (e) => { 
    if (e.key === 'Enter') {
      const val = aiInput.value;
      handleAICommand(val);
      aiInput.value = '';
    }
  });

  // Suggestion Tags Logic
  document.querySelectorAll('.suggestion-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const cmd = tag.getAttribute('data-cmd');
      handleAICommand(cmd);
    });
  });
  
  // Shortcut Ctrl+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openAIModal();
    }
    if (e.key === 'Escape') closeAIModal();
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
