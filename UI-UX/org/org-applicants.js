(function () {
    const $ = (sel, root) => (root || document).querySelector(sel);
    const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

    const EVENTS = {
        'evt-1': { name: 'Global AI Innovation Challenge', all: 98, pending: 17, accepted: 72, rejected: 9 },
        'evt-2': { name: 'Frontend Wizards', all: 150, pending: 0, accepted: 140, rejected: 10 },
        'evt-3': { name: 'Startup Challenge', all: 84, pending: 23, accepted: 61, rejected: 0 },
        'evt-4': { name: 'DevOps Masterclass', all: 72, pending: 17, accepted: 55, rejected: 0 },
        'evt-5': { name: 'Cloud Native Bootcamp', all: 42, pending: 0, accepted: 38, rejected: 4 }
    };

    let currentEventId = 'evt-1';
    let currentFilter = 'all';

    const eventSelect = document.getElementById('applicants-event-select');
    const eventToggle = document.getElementById('org-event-toggle');
    const eventPanel = document.getElementById('org-event-panel');
    const selectedNameEl = document.getElementById('org-event-selected-name');
    const titleEl = document.getElementById('applicants-title');
    const countEls = document.querySelectorAll('[data-count]');

    function applyEvent(eventId) {
        if (!EVENTS[eventId]) eventId = 'evt-1';
        currentEventId = eventId;
        const event = EVENTS[eventId];

        // Update hidden select if present
        if (eventSelect && eventSelect.value !== eventId) {
            eventSelect.value = eventId;
        }

        // Update Custom Dropdown Button label
        if (selectedNameEl) {
            selectedNameEl.textContent = event.name;
        }

        // Update Custom Dropdown items active state
        $$('.org-event-item', eventPanel).forEach(item => {
            const isActive = item.dataset.eventId === eventId;
            item.classList.toggle('active', isActive);
            item.setAttribute('aria-selected', String(isActive));
        });

        // Update Page Title
        if (titleEl) {
            titleEl.textContent = `Applicants · ${event.name}`;
        }

        // Update Counts
        countEls.forEach((el) => {
            const key = el.dataset.count;
            if (event[key] !== undefined) {
                el.textContent = event[key];
            }
        });
    }

    function wireEventSelector() {
        if (!eventToggle || !eventPanel) return;

        // Toggle dropdown open/close
        eventToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = eventPanel.hasAttribute('hidden');
            if (isHidden) {
                eventPanel.removeAttribute('hidden');
                eventToggle.setAttribute('aria-expanded', 'true');
            } else {
                eventPanel.setAttribute('hidden', '');
                eventToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Click item in dropdown
        $$('.org-event-item', eventPanel).forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const evId = item.dataset.eventId;
                if (evId) {
                    applyEvent(evId);
                }
                eventPanel.setAttribute('hidden', '');
                eventToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Native select change event listener for backward compatibility
        if (eventSelect) {
            eventSelect.addEventListener('change', () => {
                applyEvent(eventSelect.value);
            });
        }

        // Outside click closes panel
        document.addEventListener('click', (e) => {
            if (!eventPanel.contains(e.target) && e.target !== eventToggle) {
                eventPanel.setAttribute('hidden', '');
                eventToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    function wireFilterButtons() {
        const filterButtons = $$('.filter-btn');
        const rows = $$('.applicant-row');
        const emptyState = $('#applicants-empty-state');
        const table = $('#applicants-table');

        function updateFilterView() {
            let visibleCount = 0;
            rows.forEach((row) => {
                const rowStatus = row.dataset.status || 'all';
                const shouldShow = currentFilter === 'all' || rowStatus === currentFilter;
                row.style.display = shouldShow ? '' : 'none';
                if (shouldShow) visibleCount++;
            });

            if (visibleCount === 0) {
                if (table) table.style.display = 'none';
                if (emptyState) emptyState.removeAttribute('hidden');
            } else {
                if (table) table.style.display = '';
                if (emptyState) emptyState.setAttribute('hidden', '');
            }
        }

        filterButtons.forEach((button) => {
            button.addEventListener('click', () => {
                currentFilter = button.dataset.filter || 'all';

                filterButtons.forEach((btn) => {
                    const isActive = btn === button;
                    btn.setAttribute('aria-pressed', String(isActive));
                    btn.classList.toggle('active', isActive);
                });

                updateFilterView();
            });
        });

        // "Clear filters" in empty state
        const emptyReset = $('#applicants-empty-reset');
        if (emptyReset) {
            emptyReset.addEventListener('click', () => {
                const allBtn = $('.filter-btn[data-filter="all"]');
                if (allBtn) allBtn.click();
            });
        }
    }

    function wireDecisions() {
        const rows = $$('.applicant-row');

        rows.forEach((row) => {
            const decisionCell = row.querySelector('.decision-cell');
            const acceptBtn = row.querySelector('.btn-accept');
            const rejectBtn = row.querySelector('.btn-reject');

            if (!decisionCell || !acceptBtn || !rejectBtn) return;

            function resolve(newStatus) {
                const event = EVENTS[currentEventId];
                if (row.dataset.status === 'pending') {
                    event.pending = Math.max(0, event.pending - 1);
                }
                event[newStatus] = (event[newStatus] || 0) + 1;
                row.dataset.status = newStatus;

                // Update status badge
                const statusBadgeCell = row.querySelector('.status-cell');
                if (statusBadgeCell) {
                    if (newStatus === 'accepted') {
                        statusBadgeCell.innerHTML = '<span class="badge badge--approved">Accepted</span>';
                    } else {
                        statusBadgeCell.innerHTML = '<span class="badge badge--rejected">Rejected</span>';
                    }
                }

                // Update decision cell
                if (newStatus === 'accepted') {
                    decisionCell.innerHTML = '<span class="decision-state"><span class="material-symbols-outlined">check_circle</span>Reviewed</span>';
                } else {
                    decisionCell.innerHTML = '<span class="decision-state"><span class="material-symbols-outlined">mail</span>Notified</span>';
                }

                // Update counter elements
                countEls.forEach((el) => {
                    const key = el.dataset.count;
                    if (event[key] !== undefined) {
                        el.textContent = event[key];
                    }
                });

                // Check active filter visibility
                if (currentFilter !== 'all' && currentFilter !== newStatus) {
                    row.style.display = 'none';
                }

                // Check empty state
                const visibleCount = $$('.applicant-row').filter(r => r.style.display !== 'none').length;
                const emptyState = $('#applicants-empty-state');
                const table = $('#applicants-table');
                if (visibleCount === 0) {
                    if (table) table.style.display = 'none';
                    if (emptyState) emptyState.removeAttribute('hidden');
                } else {
                    if (table) table.style.display = '';
                    if (emptyState) emptyState.setAttribute('hidden', '');
                }
            }

            acceptBtn.addEventListener('click', (e) => {
                e.preventDefault();
                resolve('accepted');
            });

            rejectBtn.addEventListener('click', (e) => {
                e.preventDefault();
                resolve('rejected');
            });
        });
    }

    function wireMobileNav() {
        const hamburger = document.getElementById('org-hamburger');
        const overlay = document.getElementById('org-mobile-overlay');
        const drawer = document.getElementById('org-mobile-drawer');
        const closeBtn = document.getElementById('org-nav-close');

        function openDrawer() {
            if (!drawer || !overlay) return;
            drawer.classList.add('open');
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
        }

        function closeDrawer() {
            if (!drawer || !overlay) return;
            drawer.classList.remove('open');
            overlay.classList.remove('open');
            document.body.style.overflow = '';
            if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
        }

        if (hamburger) hamburger.addEventListener('click', openDrawer);
        if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
        if (overlay) overlay.addEventListener('click', closeDrawer);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeDrawer();
                if (eventPanel) {
                    eventPanel.setAttribute('hidden', '');
                    if (eventToggle) eventToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        // Initial URL parameter resolution
        const initialEventId = new URLSearchParams(location.search).get('event');
        if (initialEventId && EVENTS[initialEventId]) {
            currentEventId = initialEventId;
        }

        wireEventSelector();
        applyEvent(currentEventId);
        wireFilterButtons();
        wireDecisions();
        wireMobileNav();
    });
})();
