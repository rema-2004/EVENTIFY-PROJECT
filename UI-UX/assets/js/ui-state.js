// EVENTIFY shared UI state: toasts + persistent button states.
// Buttons opt in with data-ui-action="save|accept|reject|suspend|verify|generic".
// Common labels (EN/AR) are auto-wired so existing pages need no markup changes.

(function () {
    const STORAGE_KEY = 'eventify:ui-state';
    const PAGE = location.pathname.split('/').slice(-2).join('/');

    const ACTIONS = {
        save: { state: 'done', label: 'Saved', icon: 'bookmark_added', toast: 'Saved for later', tone: 'success' },
        accept: { state: 'done', label: 'Accepted', icon: 'check_circle', toast: 'Application accepted', tone: 'success' },
        reject: { state: 'rejected', label: 'Rejected', icon: 'cancel', toast: 'Application rejected', tone: 'error' },
        suspend: { state: 'rejected', label: 'Suspended', icon: 'block', toast: 'User suspended', tone: 'error' },
        verify: { state: 'done', label: 'Verified', icon: 'verified', toast: 'Organization verified', tone: 'success' },
        approve: { state: 'done', label: 'Approved', icon: 'check_circle', toast: 'Approved', tone: 'success' },
        generic: { state: 'done', label: null, icon: null, toast: 'Done', tone: 'success' }
    };

    const LABEL_PATTERNS = [
        [/save for later|احفظ لوقت لاحق|حفظ لوقت لاحق|احفظ|حفظ$/i, 'save'],
        [/^accept|قبول/i, 'accept'],
        [/^reject|رفض/i, 'reject'],
        [/suspend|تعليق|إيقاف/i, 'suspend'],
        [/verify|توثيق|تحقق/i, 'verify'],
        [/^approve|موافقة|اعتماد/i, 'approve']
    ];

    function readStore() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        } catch {
            return {};
        }
    }

    function writeStore(store) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        } catch { /* storage unavailable — state stays in-page only */ }
    }

    function keyFor(el) {
        const id = el.dataset.uiKey || el.id || el.textContent.trim().slice(0, 40);
        return `${PAGE}|${el.dataset.uiAction}|${id}`;
    }

    function toast(message, tone) {
        let stack = document.getElementById('toast-stack');
        if (!stack) {
            stack = document.createElement('div');
            stack.id = 'toast-stack';
            stack.setAttribute('role', 'status');
            stack.setAttribute('aria-live', 'polite');
            document.body.appendChild(stack);
        }

        const el = document.createElement('div');
        el.className = `toast toast-${tone || 'success'}`;
        el.textContent = message;
        stack.appendChild(el);

        requestAnimationFrame(() => el.classList.add('is-visible'));
        setTimeout(() => {
            el.classList.remove('is-visible');
            setTimeout(() => el.remove(), 300);
        }, 2600);
    }

    function applyState(el, actionName, persistedLabel) {
        const config = ACTIONS[actionName] || ACTIONS.generic;
        el.dataset.state = config.state;
        el.setAttribute('aria-pressed', 'true');

        const label = persistedLabel || config.label;
        if (label) {
            const textNode = [...el.childNodes].reverse().find(n => n.nodeType === 3 && n.textContent.trim());
            if (textNode) textNode.textContent = ` ${label}`;
            else if (!el.querySelector('.material-symbols-outlined')) el.textContent = label;
        }

        const icon = el.querySelector('.material-symbols-outlined');
        if (icon && config.icon) icon.textContent = config.icon;
    }

    function detectAction(el) {
        if (el.dataset.uiAction) return el.dataset.uiAction;
        // Filter/tab controls aren't state-changing actions — leave their labels alone.
        if (el.dataset.filter !== undefined) return null;
        // Icon-only controls carry their meaning in aria-label, not in text.
        const label = el.getAttribute('aria-label') || el.getAttribute('title') || '';
        const text = label || (el.textContent || '').trim();
        if (!text || text.length > 40) return null;
        const match = LABEL_PATTERNS.find(([pattern]) => pattern.test(text));
        return match ? match[1] : null;
    }

    function restore() {
        const store = readStore();
        document.querySelectorAll('[data-ui-action]').forEach(el => {
            const saved = store[keyFor(el)];
            if (saved) applyState(el, el.dataset.uiAction, saved.label);
        });
    }

    function wire() {
        document.querySelectorAll('button, a[role="button"]').forEach(el => {
            if (el.dataset.uiAction) return;
            const action = detectAction(el);
            if (action) el.dataset.uiAction = action;
        });
        restore();
    }

    document.addEventListener('click', event => {
        const el = event.target.closest('[data-ui-action]');
        if (!el) return;

        const actionName = el.dataset.uiAction;
        
        // If it's already done and it's a save action, toggle it off
        if (el.dataset.state === 'done' && actionName === 'save') {
            delete el.dataset.state;
            el.setAttribute('aria-pressed', 'false');
            const icon = el.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.textContent = 'bookmark';
                icon.style.fontVariationSettings = "'FILL' 0";
            }
            el.classList.remove('text-primary');
            el.classList.add('text-on-surface-variant');
            
            const store = readStore();
            delete store[keyFor(el)];
            writeStore(store);
            
            toast('Removed from saved', 'success');
            return;
        }
        
        if (el.dataset.state) return;

        const config = ACTIONS[actionName] || ACTIONS.generic;

        applyState(el, actionName);
        
        // Add visual feedback for save buttons
        if (actionName === 'save') {
            el.classList.add('text-primary');
            el.classList.remove('text-on-surface-variant');
            const icon = el.querySelector('.material-symbols-outlined');
            if(icon) icon.style.fontVariationSettings = "'FILL' 1";
        }

        const store = readStore();
        store[keyFor(el)] = { state: config.state, label: config.label };
        writeStore(store);

        toast(el.dataset.uiToast || config.toast, config.tone);
    }, { capture: true });

    window.EventifyUI = { toast, reset: () => { localStorage.removeItem(STORAGE_KEY); location.reload(); } };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
    else wire();
})();

/* ===== VISITOR NAVBAR ACTIVE STATE ===== */
(function() {
  function updateActiveNav() {
    const navLinks = document.querySelectorAll('#navLinks a');
    if (!navLinks.length) return;

    let currentPath = window.location.pathname.split('/').pop();
    if (!currentPath || currentPath === '') currentPath = 'landing.html';

    const sections = [];
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      
      let targetId = null;
      if (href.startsWith('#')) {
        targetId = href.substring(1);
      } else if (href.includes('#')) {
        const parts = href.split('#');
        if (parts[0] === currentPath) {
          targetId = parts[1];
        }
      }
      
      if (targetId) {
        const sec = document.getElementById(targetId);
        if (sec) {
          sections.push({ top: sec.offsetTop, link: link });
        }
      }
    });

    sections.sort((a, b) => a.top - b.top);

    let activeHashLink = null;
    const scrollPos = window.scrollY + 150;

    for (let i = sections.length - 1; i >= 0; i--) {
      if (scrollPos >= sections[i].top) {
        activeHashLink = sections[i].link;
        break;
      }
    }

    navLinks.forEach(link => link.classList.remove('active'));

    if (activeHashLink) {
      activeHashLink.classList.add('active');
    } else {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
          link.classList.add('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateActiveNav);
  } else {
    updateActiveNav();
  }
})();


/* ===== MOBILE NAVBAR TOGGLE ===== */
(function() {
  function initMobileNav() {
    const mobileMenuBtn = document.getElementById('mobileMenu');
    const navbar = document.getElementById('navbar');
    if (!mobileMenuBtn || !navbar) return;

    const icon = mobileMenuBtn.querySelector('i');
    
    function toggleMenu(forceClose = false) {
      const isOpening = forceClose ? false : !navbar.classList.contains('mobile-open');
      
      if (isOpening) {
        navbar.classList.add('mobile-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        if (icon) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        }
        document.body.style.overflow = 'hidden'; // Prevent scroll
      } else {
        navbar.classList.remove('mobile-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
        document.body.style.overflow = '';
      }
    }

    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navbar.classList.contains('mobile-open')) {
        toggleMenu(true);
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (navbar.classList.contains('mobile-open') && !navbar.contains(e.target)) {
        toggleMenu(true);
      }
    });

    // Close on link click
    const navLinks = navbar.querySelectorAll('.nav-links a, .nav-buttons a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(true);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    initMobileNav();
  }
})();
