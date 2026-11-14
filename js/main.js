/**
 * LENA MOREAU — PORTFOLIO CONTROLLER
 * High-performance, accessible, vanilla JavaScript micro-interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initTimezones();
  initNavigation();
  initModals();
  initPortfolioFilters();
  initCaseStudyModal();
  initForms();
  initEmailCopy();
  initDemoPresets();
  initCustomizer();
});

/* ==============================================================
   1. CUSTOM LUXURY CURSOR
   ============================================================== */
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  // Only activate on devices with fine pointer (mouse)
  if (!window.matchMedia('(pointer: fine)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  // Smooth lerp for outer ring
  function renderCursorRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursorRing);
  }
  renderCursorRing();

  // Hover states on interactive elements
  const interactives = document.querySelectorAll('a, button, input, textarea, label, [role="tab"]');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ==============================================================
   2. LIVE DUAL TIMEZONE CLOCKS (Dubai GST & Paris CET)
   ============================================================== */
function initTimezones() {
  const dubaiClock = document.getElementById('dubaiClock');
  const parisClock = document.getElementById('parisClock');

  function updateClocks() {
    const now = new Date();

    if (dubaiClock) {
      const dubaiTime = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Dubai',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(now);
      dubaiClock.textContent = `${dubaiTime} GST`;
    }

    if (parisClock) {
      const parisTime = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Paris',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(now);
      parisClock.textContent = `${parisTime} CET`;
    }
  }

  updateClocks();
  setInterval(updateClocks, 1000);
}

/* ==============================================================
   3. NAVIGATION & FLOATING BAR
   ============================================================== */
function initNavigation() {
  const floatingNav = document.getElementById('floatingNav');
  const heroSection = document.getElementById('hero');
  const navLinks = document.querySelectorAll('.float-link');
  const sections = document.querySelectorAll('section[id]');

  // Show/hide floating nav after scrolling past hero
  window.addEventListener('scroll', () => {
    const heroHeight = heroSection ? heroSection.offsetHeight : 600;
    if (window.scrollY > heroHeight * 0.4) {
      floatingNav.classList.add('visible');
    } else {
      floatingNav.classList.remove('visible');
    }

    // Active link highlighting
    let currentId = 'hero';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 200;
      if (window.scrollY >= sectionTop) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('data-nav') === currentId);
    });
  }, { passive: true });

  // Smooth scroll click handler for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ==============================================================
   4. MODAL DIALOGS (Connect & Consultation)
   ============================================================== */
function initModals() {
  const connectModal = document.getElementById('connectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const openButtons = document.querySelectorAll('.open-connect-btn');
  const modalScrollLink = document.getElementById('modalScrollToFullForm');

  function openConnectModal() {
    if (!connectModal) return;
    connectModal.classList.add('active');
    connectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const firstInput = connectModal.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  }

  function closeConnectModal() {
    if (!connectModal) return;
    connectModal.classList.remove('active');
    connectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openConnectModal();
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeConnectModal);
  }

  if (connectModal) {
    connectModal.addEventListener('click', (e) => {
      if (e.target === connectModal) closeConnectModal();
    });
  }

  if (modalScrollLink) {
    modalScrollLink.addEventListener('click', (e) => {
      e.preventDefault();
      closeConnectModal();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        setTimeout(() => {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    });
  }

  // Escape key closes modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeConnectModal();
      closeCaseModal();
    }
  });
}

/* ==============================================================
   5. PORTFOLIO FILTERING
   ============================================================== */
function initPortfolioFilters() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const caseCards = document.querySelectorAll('.case-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-filter');
      caseCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==============================================================
   6. CASE STUDY DETAILS MODAL & RICH DATA
   ============================================================== */
const caseStudiesData = {
  museum: {
    client: 'MUSEUM OF THE FUTURE',
    year: '2025',
    discipline: 'Spatial Experience & Holographic Wayfinding',
    title: 'Architecting an Ambient Spatial Journey for 4.2M Annual Explorers',
    image: 'assets/case-museum-future.jpg',
    brief: 'Commissioned by Dubai Future Foundation to conceive a fluid, non-intrusive spatial wayfinding and digital orientation ecosystem within one of the world’s most complex architectural toroidal structures.',
    approach: [
      'Developed kinetic ambient typography that dynamically synchronizes with building curvature and daylight angles.',
      'Designed responsive biometric stations allowing travelers to curate personalized thematic paths.',
      'Eliminated traditional static signage in favor of illuminated waypoints and intuitive spatial gestures.'
    ],
    metrics: [
      { label: 'Annual Visitors Routed', val: '4.2M+' },
      { label: 'Wayfinding Clarity Index', val: '99.4%' },
      { label: 'Honor', val: 'Red Dot: Best of the Best' }
    ]
  },
  gucci: {
    client: 'GUCCI MENA',
    year: '2024',
    discipline: 'Luxury Digital Flagship & VIP Concierge',
    title: 'The Digital Private Salon: Redefining High-Fashion Digital Intimacy',
    image: 'assets/case-gucci.jpg',
    brief: 'Created an invitation-only digital shopping sanctuary for high-net-worth clientele across Milan and the GCC, pairing tactile haute couture aesthetics with real-time personal stylist concierge access.',
    approach: [
      'Implemented silk-drapery micro-interactions and tactile sound design echoing flagship private suites.',
      'Architected end-to-end bespoke order customization for one-of-a-kind bespoke creations.',
      'Integrated private encrypted communications directly connecting clients to their Milan salon director.'
    ],
    metrics: [
      { label: 'Private Order Lift', val: '+140%' },
      { label: 'VIP Client Retention', val: '96.8%' },
      { label: 'Recognition', val: 'Cannes Lions Silver' }
    ]
  },
  emirates: {
    client: 'EMIRATES NBD',
    year: '2024',
    discipline: 'Institutional Wealth Management Platform',
    title: 'Simplifying Multi-Billion AUM Command into a Monolithic Gesture UI',
    image: 'assets/case-emirates-nbd.jpg',
    brief: 'Completely overhauled the wealth management portal and mobile executive cockpit for private banking clients managing complex international portfolios across real estate, equity, and sovereign debt.',
    approach: [
      'Replaced dense, archaic financial tables with a minimalist multi-layered wealth horizon dashboard.',
      'Engineered sub-50ms reactive data streaming with zero cognitive clutter.',
      'Incorporated institutional multi-signature authorization with biometric authentication.'
    ],
    metrics: [
      { label: 'Assets Architected', val: '$2.4B+' },
      { label: 'Task Completion Speed', val: '3.4x Faster' },
      { label: 'Honor', val: 'D&AD Yellow Pencil' }
    ]
  },
  mgmotors: {
    client: 'MG MOTORS GLOBAL',
    year: '2023',
    discipline: 'Automotive HMI & Cockpit Interface',
    title: 'Connected Vehicle Cockpit: Next-Gen In-Cabin Ergonomics & Telematics',
    image: 'assets/case-mg-motors.jpg',
    brief: 'Directed the next-generation digital instrument cluster and center-stack HMI for the flagship electric vehicle lineup, harmonizing high-speed highway legibility with relaxed ambient luxury.',
    approach: [
      'Engineered an ultra-low latency dark mode HUD prioritizing essential glanceable vectors.',
      'Designed kinetic transitions between autonomous cruise modes and manual dynamic driving.',
      'Achieved strict international driver safety compliance while elevating tactile aesthetic delight.'
    ],
    metrics: [
      { label: 'Active Fleets Running', val: '120,000+' },
      { label: 'Glance Time Reduction', val: '38%' },
      { label: 'Safety Score', val: '5-Star Euro NCAP' }
    ]
  }
};

const caseModal = document.getElementById('caseModal');
const caseModalBody = document.getElementById('caseModalBody');
const caseModalCloseBtn = document.getElementById('caseModalCloseBtn');

function openCaseModal(projectKey) {
  const data = caseStudiesData[projectKey];
  if (!data || !caseModal || !caseModalBody) return;

  caseModalBody.innerHTML = `
    <div style="font-size: 11px; font-weight: 600; letter-spacing: 0.2em; color: var(--text-dim); margin-bottom: 8px;">
      [ CASE STUDY // ${data.client} &mdash; ${data.year} ]
    </div>
    <h2 style="font-family: var(--font-serif); font-size: clamp(1.8rem, 3vw, 2.6rem); font-weight: 500; line-height: 1.2; color: #ffffff; margin-bottom: 20px;">
      ${data.title}
    </h2>
    
    <div style="width: 100%; aspect-ratio: 16/9; border-radius: 14px; overflow: hidden; margin-bottom: 28px; border: 1px solid var(--border-delicate);">
      <img src="${data.image}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover;">
    </div>

    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; padding: 20px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-delicate); border-radius: 12px;">
      ${data.metrics.map(m => `
        <div>
          <div style="font-family: var(--font-serif); font-size: 1.8rem; font-weight: 700; color: #ffffff;">${m.val}</div>
          <div style="font-size: 11px; font-weight: 500; color: var(--text-muted); letter-spacing: 0.05em; text-transform: uppercase;">${m.label}</div>
        </div>
      `).join('')}
    </div>

    <div style="margin-bottom: 24px;">
      <h4 style="font-size: 11px; font-weight: 600; letter-spacing: 0.18em; color: var(--text-dim); margin-bottom: 10px; text-transform: uppercase;">THE STRATEGIC CHALLENGE</h4>
      <p style="font-size: 14px; line-height: 1.7; color: var(--text-lead);">${data.brief}</p>
    </div>

    <div style="margin-bottom: 32px;">
      <h4 style="font-size: 11px; font-weight: 600; letter-spacing: 0.18em; color: var(--text-dim); margin-bottom: 12px; text-transform: uppercase;">DESIGN EXECUTION & ARCHITECTURE</h4>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px;">
        ${data.approach.map(step => `
          <li style="display: flex; gap: 12px; font-size: 13.5px; line-height: 1.6; color: var(--text-muted);">
            <span style="color: #ffffff; font-weight: bold;">&bull;</span>
            <span>${step}</span>
          </li>
        `).join('')}
      </ul>
    </div>

    <div style="display: flex; justify-content: flex-end; padding-top: 20px; border-top: 1px solid var(--border-delicate);">
      <button class="open-connect-btn" type="button" style="padding: 10px 24px; border-radius: 9999px; background: #ffffff; color: #07080a; font-size: 11px; font-weight: 600; letter-spacing: 0.14em;">
        REQUEST FULL ARCHIVE BRIEF &rarr;
      </button>
    </div>
  `;

  // Attach event listener to newly injected CTA
  const newCta = caseModalBody.querySelector('.open-connect-btn');
  if (newCta) {
    newCta.addEventListener('click', () => {
      closeCaseModal();
      const connectModal = document.getElementById('connectModal');
      if (connectModal) connectModal.classList.add('active');
    });
  }

  caseModal.classList.add('active');
  caseModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeCaseModal() {
  if (!caseModal) return;
  caseModal.classList.remove('active');
  caseModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function initCaseStudyModal() {
  document.querySelectorAll('.view-case-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const project = btn.getAttribute('data-project');
      openCaseModal(project);
    });
  });

  if (caseModalCloseBtn) {
    caseModalCloseBtn.addEventListener('click', closeCaseModal);
  }

  if (caseModal) {
    caseModal.addEventListener('click', (e) => {
      if (e.target === caseModal) closeCaseModal();
    });
  }
}

/* ==============================================================
   7. INTERACTIVE FORM SUBMISSIONS & VALIDATION
   ============================================================== */
function initForms() {
  // Main Consultation Form
  const consultForm = document.getElementById('consultationForm');
  const formFeedback = document.getElementById('formFeedback');

  if (consultForm) {
    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = consultForm.querySelector('.submit-inquiry-btn');
      const originalText = btn.innerHTML;

      btn.disabled = true;
      btn.innerHTML = `<span>ENCRYPTING & TRANSMITTING...</span>`;

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalText;
        consultForm.reset();
        if (formFeedback) {
          formFeedback.className = 'form-feedback-message success';
          formFeedback.innerHTML = `&check; Thank you. Your inquiry has been securely delivered to Claire Sterling's executive desk. A personal response will follow within 24 hours.`;
          formFeedback.style.display = 'block';
          showToast('Inquiry successfully transmitted.');
        }
      }, 900);
    });
  }

  // Quick Modal Form
  const modalForm = document.getElementById('modalForm');
  const modalFeedback = document.getElementById('modalFeedback');

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = modalForm.querySelector('.modal-submit-btn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>TRANSMITTING...</span>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>SUBMIT INQUIRY</span>`;
        modalForm.reset();
        if (modalFeedback) {
          modalFeedback.innerHTML = `<span style="color: #ffffff; font-size: 12px; display: block; margin-top: 10px;">&check; Consultation request received. Claire Sterling will be in touch directly.</span>`;
        }
        showToast('Consultation request dispatched.');
        setTimeout(() => {
          const connectModal = document.getElementById('connectModal');
          if (connectModal) connectModal.classList.remove('active');
          if (modalFeedback) modalFeedback.innerHTML = '';
          document.body.style.overflow = '';
        }, 2200);
      }, 800);
    });
  }
}

/* ==============================================================
   8. COPY EMAIL WITH LUXURY TOAST
   ============================================================== */
function initEmailCopy() {
  const copyBtn = document.getElementById('copyEmailBtn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const email = 'claire@sterling-creative.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast('Copied claire@sterling-creative.com to clipboard');
      copyBtn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        <span>COPIED</span>
      `;
      setTimeout(() => {
        copyBtn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          <span>COPY</span>
        `;
      }, 2500);
    }).catch(() => {
      showToast('claire@sterling-creative.com');
    });
  });
}

function showToast(message) {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==============================================================
   9. DEMO PRESETS & PERSONA SWITCHER
   ============================================================== */
const demoPresets = {
  sculpture: {
    name1: 'ATELIER',
    name2: 'NOIR',
    brand: 'STUDIO ATELIER',
    floatBrand: 'ATELIER NOIR',
    roleTitle: 'DESIGNER / CREATIVE<br>DIRECTOR',
    roleSubtitle: 'WITH',
    bg: 'url("assets/demo-sculpture.jpg")',
    bio: 'An independent multidisciplinary practice operating at the intersection of high luxury, spatial systems, and digital architecture. Collaborating with pioneering global institutions to raise the bar of aesthetic integrity and user experience.'
  },
  architecture: {
    name1: 'SPATIAL',
    name2: 'STUDIO',
    brand: 'MONOLITH SPATIAL',
    floatBrand: 'SPATIAL STUDIO',
    roleTitle: 'SPATIAL / ARCHITECTURAL<br>DIRECTOR',
    roleSubtitle: 'WITH',
    bg: 'url("assets/demo-monolith.jpg")',
    bio: 'Designing monumental spatial environments, kinetic pavilion interfaces, and reactive public installations for cultural landmarks across the Middle East, Europe, and Asia.'
  },
  executive: {
    name1: 'ALEX',
    name2: 'VANCE',
    brand: 'VANCE SYSTEMS',
    floatBrand: 'ALEX VANCE',
    roleTitle: 'PRINCIPAL / PRODUCT<br>ARCHITECT',
    roleSubtitle: 'WITH',
    bg: 'url("assets/demo-silhouette.jpg")',
    bio: 'Over 14 years architecting mission-critical financial platforms, high-throughput wealth portals, and low-latency automotive cockpits for Fortune 100 enterprise leadership.'
  }
};

function applyPreset(key) {
  const p = demoPresets[key];
  if (!p) return;

  const n1 = document.getElementById('heroNameLine1');
  const n2 = document.getElementById('heroNameLine2');
  const brand = document.getElementById('heroBrandName');
  const fBrand = document.getElementById('floatBrandText');
  const roleT = document.getElementById('heroRoleTitle');
  const roleS = document.getElementById('heroRoleSubtitle');
  const bio = document.getElementById('heroBioText');
  const backdrop = document.getElementById('heroBackdrop');

  if (n1) n1.textContent = p.name1;
  if (n2) n2.textContent = p.name2;
  if (brand) brand.textContent = p.brand;
  if (fBrand) fBrand.textContent = p.floatBrand;
  if (roleT) roleT.innerHTML = p.roleTitle;
  if (roleS) roleS.textContent = p.roleSubtitle;
  if (bio) bio.textContent = p.bio;
  if (backdrop) backdrop.style.backgroundImage = p.bg;
}

function initDemoPresets() {
  const presetBtns = document.querySelectorAll('.demo-preset-inner .preset-btn:not(.custom-trigger-btn)');
  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      presetBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.getAttribute('data-preset');
      applyPreset(key);
      showToast(`Activated ${btn.textContent.trim()} preset`);
    });
  });
}

/* ==============================================================
   10. LIVE DEMO CUSTOMIZER MODAL
   ============================================================== */
function initCustomizer() {
  const openBtn = document.getElementById('openCustomizerBtn');
  const customizerModal = document.getElementById('customizerModal');
  const closeBtn = document.getElementById('customizerCloseBtn');
  const form = document.getElementById('customizerForm');
  const resetBtn = document.getElementById('resetCustomizerBtn');

  if (openBtn && customizerModal) {
    openBtn.addEventListener('click', () => {
      customizerModal.classList.add('active');
      customizerModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeCustomizer() {
    if (!customizerModal) return;
    customizerModal.classList.remove('active');
    customizerModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeCustomizer);

  if (customizerModal) {
    customizerModal.addEventListener('click', (e) => {
      if (e.target === customizerModal) closeCustomizer();
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const n1Val = document.getElementById('custName1').value.trim() || 'ATELIER';
      const n2Val = document.getElementById('custName2').value.trim() || 'NOIR';
      const brandVal = document.getElementById('custBrand').value.trim() || 'STUDIO ATELIER';
      const roleVal = document.getElementById('custRole').value.trim() || 'DESIGNER / CREATIVE DIRECTOR';
      const bioVal = document.getElementById('custBio').value.trim();
      const imgUrl = document.getElementById('custImageUrl').value.trim();

      const selectedRadio = form.querySelector('input[name="visualTheme"]:checked');
      const themeVal = selectedRadio ? selectedRadio.value : 'assets/demo-sculpture.jpg';

      const n1 = document.getElementById('heroNameLine1');
      const n2 = document.getElementById('heroNameLine2');
      const brand = document.getElementById('heroBrandName');
      const fBrand = document.getElementById('floatBrandText');
      const roleT = document.getElementById('heroRoleTitle');
      const bio = document.getElementById('heroBioText');
      const backdrop = document.getElementById('heroBackdrop');

      if (n1) n1.textContent = n1Val;
      if (n2) n2.textContent = n2Val;
      if (brand) brand.textContent = brandVal;
      if (fBrand) fBrand.textContent = `${n1Val} ${n2Val}`;
      if (roleT) roleT.innerHTML = roleVal.replace('/', '/<br>');
      if (bio && bioVal) bio.textContent = bioVal;

      if (backdrop) {
        if (imgUrl) {
          backdrop.style.backgroundImage = `url("${imgUrl}")`;
        } else {
          backdrop.style.backgroundImage = `url("${themeVal}")`;
        }
      }

      closeCustomizer();
      showToast('Live demo successfully personalized!');
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      applyPreset('sculpture');
      const presetBtns = document.querySelectorAll('.demo-preset-inner .preset-btn:not(.custom-trigger-btn)');
      presetBtns.forEach((b) => b.classList.remove('active'));
      if (presetBtns[0]) presetBtns[0].classList.add('active');
      closeCustomizer();
      showToast('Reset to default Atelier Noir');
    });
  }
}
