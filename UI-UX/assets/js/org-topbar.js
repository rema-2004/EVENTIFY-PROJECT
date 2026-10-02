// EVENTIFY Organizer — global top bar dropdowns (notifications, org identity)
// Generic wiring for any ".org-dropdown" wrapper: a toggle <button> followed by
// a ".org-dropdown__panel". Works unmodified on every org-*.html page.

(function () {
    function closeAllPanels() {
        document.querySelectorAll('.org-dropdown__panel').forEach((panel) => {
            panel.setAttribute('hidden', '');
            const toggle = panel.closest('.org-dropdown')?.querySelector(':scope > button');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
    }

    function wireDropdowns() {
        const wrappers = document.querySelectorAll('.org-dropdown');
        if (!wrappers.length) return;

        wrappers.forEach((wrapper) => {
            const toggle = wrapper.querySelector(':scope > button');
            const panel = wrapper.querySelector(':scope > .org-dropdown__panel');
            if (!toggle || !panel) return;

            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isHidden = panel.hasAttribute('hidden');
                closeAllPanels();
                if (isHidden) {
                    panel.removeAttribute('hidden');
                    toggle.setAttribute('aria-expanded', 'true');
                }
            });
        });

        document.addEventListener('click', (e) => {
            wrappers.forEach((wrapper) => {
                if (!wrapper.contains(e.target)) {
                    const panel = wrapper.querySelector(':scope > .org-dropdown__panel');
                    const toggle = wrapper.querySelector(':scope > button');
                    if (panel && !panel.hasAttribute('hidden')) {
                        panel.setAttribute('hidden', '');
                        if (toggle) toggle.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeAllPanels();
        });
    }

    document.addEventListener('DOMContentLoaded', wireDropdowns);
})();
