/* ============================================
   PAPER PORTFOLIO — main.js
   Interactive behaviors & animations
   ============================================ */

'use strict';

// ─── NAVIGATION ───────────────────────────────
const nav = document.getElementById('main-nav');
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');

// Scroll-dependent nav shadow
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Hamburger toggle
hamburgerBtn.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburgerBtn.classList.toggle('open', isOpen);
  hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburgerBtn.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  });
});

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.remove('open');
    hamburgerBtn.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }
});

// ─── ACTIVE NAV LINK (Intersection Observer) ───
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === `#${id}`;
          link.style.color = isActive ? 'var(--gold)' : '';
        });
      }
    });
  },
  { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
);

sections.forEach(section => sectionObserver.observe(section));

// ─── SCROLL ANIMATIONS ─────────────────────────
const animatedEls = document.querySelectorAll(
  '.skill-card, .project-card, .timeline__item, .edu-card, .blog-card, .testimonial-card, .about__text, .about__visual, .contact__info, .contact__form'
);

// Assign fade-in classes dynamically
animatedEls.forEach((el, i) => {
  // Determine animation direction based on element type
  if (el.classList.contains('about__visual') || el.classList.contains('contact__info')) {
    el.classList.add('fade-in-left');
  } else {
    el.classList.add('fade-in');
  }

  // Stagger within same grid parent
  const siblings = Array.from(el.parentElement?.children || []);
  const staggerIndex = Math.min(siblings.indexOf(el) + 1, 6);
  if (staggerIndex > 0) {
    el.classList.add(`stagger-${staggerIndex}`);
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
);

animatedEls.forEach(el => revealObserver.observe(el));

// ─── PROJECT FILTER ────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    filterBtns.forEach(b => {
      b.classList.remove('filter-btn--active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('filter-btn--active');
    btn.setAttribute('aria-selected', 'true');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const category = card.dataset.category;
      const isMatch = filter === 'all' || category === filter;

      if (isMatch) {
        card.classList.remove('hidden');
        // Re-trigger animation
        card.classList.remove('visible');
        requestAnimationFrame(() => {
          card.classList.add('visible');
        });
      } else {
        card.classList.add('hidden');
      }
    });

    // Fix featured card layout when not all shown
    const featuredCard = document.querySelector('.project-card--featured');
    if (featuredCard) {
      const isHidden = featuredCard.classList.contains('hidden');
      featuredCard.style.gridColumn = (!isHidden && filter === 'all') ? '1 / -1' : '';
      featuredCard.style.display = isHidden ? 'none' : '';
    }
  });
});

// ─── CONTACT FORM ──────────────────────────────
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const submitBtn = document.getElementById('contact-submit');
  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email-input').value.trim();
  const message = document.getElementById('contact-message').value.trim();

  // Simple validation
  if (!name || !email || !message) {
    showFormFeedback('Please fill in all required fields.', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showFormFeedback('Please enter a valid email address.', 'error');
    return;
  }

  // Simulate submission
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  setTimeout(() => {
    showFormFeedback(`Thank you, ${name}! Your message has been sent. I'll be in touch soon. ✦`, 'success');
    contactForm.reset();
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Send Message <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
  }, 1500);
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormFeedback(message, type) {
  // Remove existing feedback
  const existing = document.getElementById('form-feedback');
  if (existing) existing.remove();

  const feedback = document.createElement('p');
  feedback.id = 'form-feedback';
  feedback.textContent = message;
  feedback.style.cssText = `
    font-family: var(--font-hand);
    font-size: 1.05rem;
    padding: 12px 16px;
    border-radius: 2px;
    border: 1px solid ${type === 'success' ? '#6ee7b7' : '#fca5a5'};
    background: ${type === 'success' ? 'rgba(110,231,183,0.15)' : 'rgba(252,165,165,0.15)'};
    color: ${type === 'success' ? '#065f46' : '#991b1b'};
    animation: fadeInUp 0.4s ease both;
  `;

  contactForm.insertBefore(feedback, contactForm.firstChild);

  // Auto-remove after 6 seconds
  setTimeout(() => feedback.remove(), 6000);
}

// ─── SMOOTH HERO PARALLAX (light) ─────────────
const heroImg = document.querySelector('.hero__img-frame');
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking && heroImg) {
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroImg.style.transform = `rotate(1.5deg) translateY(${scrollY * 0.08}px)`;
      }
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// ─── SKILL BAR ANIMATION TRIGGER ─────────────
const skillBars = document.querySelectorAll('.skill-bar');
const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        barObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

skillBars.forEach(bar => {
  bar.style.animationPlayState = 'paused';
  barObserver.observe(bar);
});

// ─── CURSOR CUSTOM EFFECT (subtle paper stamp) ─
const cursor = document.createElement('div');
cursor.style.cssText = `
  position: fixed;
  width: 20px;
  height: 20px;
  border: 1.5px solid var(--gold);
  border-radius: 50%;
  pointer-events: none;
  z-index: 99999;
  transform: translate(-50%, -50%);
  transition: transform 0.15s ease, opacity 0.3s ease, width 0.3s ease, height 0.3s ease;
  mix-blend-mode: multiply;
  opacity: 0;
`;
document.body.appendChild(cursor);

let cursorVisible = false;

document.addEventListener('mousemove', (e) => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
  if (!cursorVisible) {
    cursor.style.opacity = '0.6';
    cursorVisible = true;
  }
}, { passive: true });

document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
  cursorVisible = false;
});

// Expand cursor on hoverable elements
document.querySelectorAll('a, button, .project-card, .skill-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '36px';
    cursor.style.height = '36px';
    cursor.style.opacity = '0.4';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.opacity = '0.6';
  });
});

// ─── TYPED EFFECT ON HERO EYEBROW ─────────────
const heroTag = document.querySelector('.hero__tag');
if (heroTag) {
  const phrases = [
    'BS Information Systems Student — DMMMSU NLUC',
    'Specializing in Service Management Program (SMP)',
    'Entry-Level IT Risk & Business Continuity Specialist',
    'Dean\'s Lister (AY 2024–2025) & Cisco Certified',
    'Aiming for High Quality in Japan\'s IT Industry',
  ];
  let currentPhrase = 0;
  let charIndex = phrases[0].length; // Already shown first phrase
  let deleting = false;
  let typingDelay = 80;
  let pauseDelay = 2500;

  function typeEffect() {
    const phrase = phrases[currentPhrase];
    if (!deleting && charIndex < phrase.length) {
      heroTag.textContent = phrase.substring(0, charIndex + 1);
      charIndex++;
      setTimeout(typeEffect, typingDelay);
    } else if (!deleting && charIndex === phrase.length) {
      deleting = true;
      setTimeout(typeEffect, pauseDelay);
    } else if (deleting && charIndex > 0) {
      heroTag.textContent = phrase.substring(0, charIndex - 1);
      charIndex--;
      setTimeout(typeEffect, typingDelay / 2);
    } else if (deleting && charIndex === 0) {
      deleting = false;
      currentPhrase = (currentPhrase + 1) % phrases.length;
      setTimeout(typeEffect, 400);
    }
  }

  // Start cycling after initial delay
  setTimeout(typeEffect, pauseDelay);
}

// ─── PAGE LOAD ENTRANCE ANIMATION ─────────────
window.addEventListener('load', () => {
  document.body.classList.add('loaded');

  // Animate hero elements in sequence
  const heroContent = document.querySelector('.hero__content');
  const heroVisual = document.querySelector('.hero__visual');

  if (heroContent) {
    heroContent.style.cssText = 'opacity:0; transform:translateY(30px);';
    requestAnimationFrame(() => {
      heroContent.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    });
  }

  if (heroVisual) {
    heroVisual.style.cssText = 'opacity:0; transform:translateY(30px) rotate(1.5deg);';
    setTimeout(() => {
      heroVisual.style.transition = 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s';
      heroVisual.style.opacity = '1';
      heroVisual.style.transform = 'translateY(0) rotate(1.5deg)';
    }, 100);
  }
});

// ─── THEME TOGGLE (DARK MODE) ─────────────────
const themeToggle = document.getElementById('theme-toggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');

const savedTheme = localStorage.getItem('portfolio-theme');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  document.body.classList.add('dark-mode');
  if (themeMeta) themeMeta.setAttribute('content', '#151310');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
    if (themeMeta) {
      themeMeta.setAttribute('content', isDark ? '#151310' : '#f5f0e8');
    }
  });
}

// ─── SCROLL TO TOP ────────────────────────────
const scrollTopBtn = document.getElementById('scroll-top');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─── PROJECT CASE STUDY MODAL ─────────────────
const projectModal = document.getElementById('project-modal');
const modalCloseBtn = document.getElementById('modal-close');
const modalBody = document.getElementById('modal-body');

const projectData = {
  'project-attendance': {
    category: 'Database Management & Web Interface',
    title: 'Student Attendance Management System',
    client: 'DMMMSU NLUC Academic Administration / Faculty',
    year: '2024 — Present',
    timeline: 'Featured Academic Project',
    desc: 'A database-driven application designed to record, store, and manage student attendance efficiently. Instead of using paper attendance sheets, teachers can record attendance digitally, while administrators can easily access reports and monitor student attendance in real time.',
    deliverables: [
      'Normalized Relational SQL Schema for Student, Section & Attendance Records',
      'Digital Attendance Taking Interface with One-Click Roster Logging',
      'Automated Attendance Reports & Absenteeism Trend Dashboards',
      'Administrative Role Permissions & Exportable Attendance Data'
    ],
    quote: '"Eliminates paper-based attendance logging, reduces clerical error, and provides instant attendance transparency for teachers and administrators."',
    colors: ['#1e3a5f', '#8B6914', '#2d6a4f', '#faf7f0']
  },
  'project-cybersecurity': {
    category: 'Cybersecurity & Security Controls',
    title: 'Cybersecurity Defense & Threat Controls',
    client: 'Cisco Networking Academy',
    year: '2024',
    timeline: 'Certified Milestone',
    desc: 'Formal training and certification in cybersecurity fundamentals, defensive security controls, user confidentiality protocols, and vulnerability mitigation according to Cisco Networking Academy standards.',
    deliverables: [
      'Security Control Identification & Threat Defense Strategies',
      'User Authentication & Password Integrity Enforcement',
      'Network Confidentiality & Data Breach Prevention Measures',
      'Disaster Mitigation & Incident Response Protocols'
    ],
    quote: '"Certified in Introduction to Cybersecurity by Cisco Networking Academy, embedding security controls into everyday system operations."',
    colors: ['#0284c7', '#1e293b', '#8B6914', '#10b981']
  },
  'project-risk-bcp': {
    category: 'IT Risk & Business Continuity',
    title: 'IT Risk Assessment & Disaster Recovery Plan',
    client: 'Enterprise IT & Service Management Operations',
    year: '2024 — Present',
    timeline: 'Strategic Framework',
    desc: 'Comprehensive framework identifying single points of failure, assessing operational risk, and structuring disaster recovery plans (DRP) and business continuity plans (BCP) to help organizations sustain uninterrupted service delivery.',
    deliverables: [
      'Business Impact Analysis (BIA) & Risk Likelihood Matrix',
      'Disaster Recovery Objective Blueprints (RPO & RTO Timelines)',
      'Backup Redundancy & Cold/Warm Site Recovery Plans',
      'Service Continuity Protocols Aligned with Japan IT Quality Standards'
    ],
    quote: '"Proactive disaster recovery planning ensures enterprise systems weather disruptions with minimal downtime and maximum operational resilience."',
    colors: ['#8B6914', '#1e3a5f', '#2c2318', '#ffffff']
  },
  'project-excel-reporting': {
    category: 'Process Documentation & Data Reporting',
    title: 'Process Documentation & Data Reporting System',
    client: 'Academic & Organizational Operations',
    year: '2024',
    timeline: 'Operational Analytics',
    desc: 'Standardized operational process documentation, workflow diagramming, and automated spreadsheet reporting models using Microsoft Excel for data analysis and administrative visibility.',
    deliverables: [
      'Automated Formula & Lookup Workbooks for Data Summarization',
      'Standard Operating Procedure (SOP) Technical Manuals',
      'Executive KPI Visualizations & Reporting Dashboards',
      'Plain-Language Technical Presentations for Non-Technical Stakeholders'
    ],
    quote: '"Translating complex datasets and administrative workflows into intuitive, documented Excel reports and clear presentations."',
    colors: ['#107c41', '#8B6914', '#2d6a4f', '#fcf8f2']
  },
  'project-sibol': {
    category: 'Startup Incubation & Service Design',
    title: 'DMMMSU-CHED SIBOL: Startup Incubation System',
    client: 'DMMMSU-CHED SIBOL Incubation Program for Start-up Development',
    year: '2026',
    timeline: '2026 Incubation Program',
    image: 'assets/sibol_logo.png',
    desc: 'Active participation in the DMMMSU-CHED SIBOL Project, a student-based incubation program designed to nurture startup ventures. Focuses on systems requirement elicitation, service journey mapping, and technical feasibility studies.',
    deliverables: [
      'Digital Service Blueprint & Value Proposition Design',
      'Technical Feasibility Assessment & System Requirements (SRS)',
      'Prototype Wireframes & Customer Journey Workflows',
      'Incubator Milestone Pitch Presentations'
    ],
    quote: '"Cultivating entrepreneurial agility and turning innovative ideas into viable, well-structured digital systems through DMMMSU-CHED SIBOL."',
    colors: ['#2d6a4f', '#8B6914', '#e9c46a', '#faf7f0']
  },
  'project-ai-smartcoding': {
    category: 'AI Tools & Web Development',
    title: 'Smart Coding & AI-Assisted Web Solutions',
    client: 'Armada Logics & Smart Coding Workshop',
    year: '2024',
    timeline: 'Hands-on Workshops',
    desc: 'Hands-on exploration of artificial intelligence tools and modern software technologies from Armada Logics\' School Caravan and the Smart Coding Seminar-Workshop. Focuses on AI-assisted coding, rapid prototyping, and web development best practices.',
    deliverables: [
      'AI-Powered Code Generation & Research Tooling Integration',
      'Rapid Semantic Web Interface Development (HTML/CSS/JS)',
      'Automated Documentation & Test Case Generation',
      'Programming Best Practices & Modern Development Workflows'
    ],
    quote: '"Harnessing artificial intelligence tools to accelerate software engineering, research, and responsive web prototyping."',
    colors: ['#b5541c', '#8B6914', '#4a6b52', '#faf4e6']
  }
};

function openProjectModal(projectId) {
  const data = projectData[projectId];
  if (!data || !modalBody || !projectModal) return;

  const colorHtml = data.colors.map(c => 
    `<span style="background:${c}; width:24px; height:24px; border-radius:50%; display:inline-block; border:1px solid rgba(0,0,0,0.1); box-shadow:0 2px 4px rgba(0,0,0,0.1);" title="${c}"></span>`
  ).join(' ');

  const deliverablesHtml = data.deliverables.map(d => `<li>${d}</li>`).join('');

  const imageHtml = data.image ? `
    <div style="background: #ffffff; border: 1px solid var(--paper-shadow); border-radius: 4px; padding: 1.5rem; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; box-shadow: var(--shadow-sm);">
      <img src="${data.image}" alt="${data.title}" style="max-height: 150px; max-width: 100%; object-fit: contain;" />
    </div>
  ` : '';

  modalBody.innerHTML = `
    ${imageHtml}
    <span class="project-modal__tag">${data.category}</span>
    <h2 class="project-modal__title" id="modal-title">${data.title}</h2>
    
    <div class="project-modal__meta-grid">
      <div class="project-modal__meta-item">
        <h5>Organization / Context</h5>
        <p>${data.client}</p>
      </div>
      <div class="project-modal__meta-item">
        <h5>Year / Milestone</h5>
        <p>${data.year}</p>
      </div>
      <div class="project-modal__meta-item">
        <h5>Scope</h5>
        <p>${data.timeline}</p>
      </div>
    </div>

    <p class="project-modal__desc">${data.desc}</p>

    <div class="project-modal__highlights">
      <h4>Deliverables &amp; Core Highlights</h4>
      <ul>${deliverablesHtml}</ul>
    </div>

    <div style="margin-bottom: 1.5rem;">
      <h5 style="font-family: var(--font-heading, serif); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted, #777); margin-bottom: 0.5rem;">System Palette</h5>
      <div style="display: flex; gap: 8px; align-items: center;">
        ${colorHtml}
      </div>
    </div>

    <blockquote style="font-family: var(--font-body, serif); font-style: italic; font-size: 0.95rem; color: var(--gold, #8B6914); border-left: 2px solid var(--gold, #8B6914); padding-left: 1rem; margin: 1.5rem 0;">
      ${data.quote}
    </blockquote>

    <div style="text-align: right; margin-top: 1.5rem;">
      <a href="#contact" class="btn btn--primary" id="modal-inquire-btn" style="padding: 10px 24px; font-size: 0.9rem;">
        Inquire / Discuss Opportunity
      </a>
    </div>
  `;

  // Attach click handler for modal inquiry button to close modal and scroll to contact
  const modalInquire = document.getElementById('modal-inquire-btn');
  if (modalInquire) {
    modalInquire.addEventListener('click', () => {
      closeProjectModal();
    });
  }

  projectModal.classList.add('active');
  projectModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  if (!projectModal) return;
  projectModal.classList.remove('active');
  projectModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeProjectModal);
}

if (projectModal) {
  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) {
      closeProjectModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('active')) {
      closeProjectModal();
    }
  });
}

// Attach open handlers to all project cards
document.querySelectorAll('.project-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', (e) => {
    // Don't trigger if clicking an external link inside
    if (e.target.tagName === 'A' && e.target.getAttribute('href') !== '#') return;
    openProjectModal(card.id);
  });
});

// ─── RESUME DOWNLOAD FEEDBACK ──────────────────
const resumeLinks = document.querySelectorAll('a[download]');
resumeLinks.forEach(link => {
  link.addEventListener('click', () => {
    showFormFeedback('Downloading Navalta Femar M. Official Resume (PDF)... ✦', 'success');
  });
});
