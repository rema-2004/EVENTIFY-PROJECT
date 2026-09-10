// EVENTIFY motion layer: staggered scroll entry, cursor-lit cards, empty states.
// Everything degrades to plain HTML if this file never loads.

(function () {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- Scroll entry ------------------------------------------------- */
    function markRevealTargets() {
        // Grids of cards animate as a stagger; standalone sections animate as one.
        document.querySelectorAll('main section, main > div > section, .card, .empty-state').forEach(el => {
            if (el.closest('[data-reveal], [data-reveal-children]')) return;
            if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', '');
        });
    }

    function observeReveals() {
        const targets = document.querySelectorAll('[data-reveal], [data-reveal-children]');
        if (!targets.length) return;

        if (reduced) {
            targets.forEach(el => el.classList.add('in'));
            return;
        }

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('in');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

        targets.forEach(el => observer.observe(el));
    }

    /* ---- Cursor-lit borders ------------------------------------------- */
    function wireSpotlights() {
        if (reduced || window.matchMedia('(hover: none)').matches) return;
        document.addEventListener('pointermove', event => {
            const card = event.target.closest('.spotlight');
            if (!card) return;
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
            card.style.setProperty('--my', `${event.clientY - rect.top}px`);
        }, { passive: true });
    }

    /* ---- Empty states -------------------------------------------------- */
    // A list that renders zero rows should say so rather than show a void.
    function renderEmptyStates() {
        document.querySelectorAll('[data-empty-when-empty]').forEach(list => {
            const hasRows = [...list.children].some(child => !child.hasAttribute('data-empty-state'));
            if (hasRows) return;

            const title = list.dataset.emptyTitle || 'Nothing here yet';
            const body = list.dataset.emptyBody || 'Once there is something to show, it will appear here.';
            const icon = list.dataset.emptyIcon || 'inbox';
            const action = list.dataset.emptyAction;
            const href = list.dataset.emptyHref;

            const empty = document.createElement('div');
            empty.className = 'empty-state';
            empty.setAttribute('data-empty-state', '');
            empty.innerHTML = `
                <span class="empty-state__icon"><span class="material-symbols-outlined" aria-hidden="true">${icon}</span></span>
                <h3>${title}</h3>
                <p>${body}</p>
                ${action && href ? `<a class="btn-primary" href="${href}">${action}</a>` : ''}`;
            list.appendChild(empty);
        });
    }

    /* ---- Magnetic Buttons --------------------------------------------- */
    function wireMagneticButtons() {
        if (reduced || window.matchMedia('(hover: none)').matches) return;
        document.querySelectorAll('.btn-primary').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    /* ---- Premium Tooltips --------------------------------------------- */
    function wirePremiumTooltips() {
        if (window.matchMedia('(hover: none)').matches) return;
        const tooltip = document.createElement('div');
        tooltip.className = 'premium-tooltip';
        document.body.appendChild(tooltip);

        document.querySelectorAll('[title]').forEach(el => {
            const titleText = el.getAttribute('title');
            if(!titleText) return;
            el.setAttribute('data-tooltip', titleText);
            el.removeAttribute('title');

            el.addEventListener('mouseenter', (e) => {
                tooltip.textContent = titleText;
                tooltip.classList.add('visible');
                positionTooltip(e, tooltip);
            });
            el.addEventListener('mousemove', (e) => positionTooltip(e, tooltip));
            el.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));
        });

        function positionTooltip(e, tip) {
            tip.style.left = e.pageX + 10 + 'px';
            tip.style.top = e.pageY + 15 + 'px';
        }
    }

    /* ---- Image Skeletons ---------------------------------------------- */
    function wireImageSkeletons() {
        document.querySelectorAll('img').forEach(img => {
            if(img.complete) return;
            img.classList.add('loading-skeleton');
            img.addEventListener('load', () => img.classList.remove('loading-skeleton'));
            img.addEventListener('error', () => img.classList.remove('loading-skeleton'));
        });
    }

    function init() {
        markRevealTargets();
        observeReveals();
        wireSpotlights();
        renderEmptyStates();
        wireMagneticButtons();
        wirePremiumTooltips();
        wireImageSkeletons();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
