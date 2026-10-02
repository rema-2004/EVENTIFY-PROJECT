(function () {
    const $ = (sel, root) => (root || document).querySelector(sel);
    const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

    let activeFilter = 'all';
    let searchQuery = '';

    function updateCounts() {
        const rows = $$('#opp-tbody tr[data-status]');
        const counts = { all: rows.length, live: 0, pending: 0, upcoming: 0, ended: 0 };

        rows.forEach(r => {
            const s = r.dataset.status;
            if (counts[s] !== undefined) counts[s]++;
        });

        // Update KPI stat card values
        const liveVal = $('#kpi-live-val');
        const pendingVal = $('#kpi-pending-val');
        const upcomingVal = $('#kpi-upcoming-val');
        const endedVal = $('#kpi-ended-val');

        if (liveVal) liveVal.textContent = counts.live;
        if (pendingVal) pendingVal.textContent = counts.pending;
        if (upcomingVal) upcomingVal.textContent = counts.upcoming;
        if (endedVal) endedVal.textContent = counts.ended;

        // Update Filter pill badge counts
        $$('.opp-filter-btn').forEach(btn => {
            const f = btn.dataset.filter;
            const badge = btn.querySelector('.filter-count');
            if (badge && counts[f] !== undefined) {
                badge.textContent = counts[f];
            }
        });
    }

    function applyFilterAndSearch() {
        const rows = $$('#opp-tbody tr[data-status]');
        const emptyState = $('#opp-empty-state');
        const table = $('#opp-table');
        const query = searchQuery.trim().toLowerCase();

        let visibleCount = 0;

        rows.forEach(row => {
            const status = row.dataset.status;
            const title = (row.querySelector('.opp-entity__name')?.textContent || '').toLowerCase();
            const meta = (row.querySelector('.opp-entity__meta')?.textContent || '').toLowerCase();

            const matchesFilter = activeFilter === 'all' || status === activeFilter;
            const matchesSearch = !query || title.includes(query) || meta.includes(query);

            if (matchesFilter && matchesSearch) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        if (visibleCount === 0) {
            if (table) table.style.display = 'none';
            if (emptyState) emptyState.removeAttribute('hidden');
        } else {
            if (table) table.style.display = '';
            if (emptyState) emptyState.setAttribute('hidden', '');
        }
    }

    function wireFilters() {
        const tabs = $$('.opp-filter-btn');
        tabs.forEach(btn => {
            btn.addEventListener('click', () => {
                tabs.forEach(b => b.setAttribute('aria-pressed', 'false'));
                btn.setAttribute('aria-pressed', 'true');
                activeFilter = btn.dataset.filter || 'all';
                applyFilterAndSearch();
            });
        });

        // Stat cards also trigger filtering on click
        const kpiCards = $$('.opp-stat-grid .stat-card[data-kpi-filter]');
        kpiCards.forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                const f = card.dataset.kpiFilter;
                const targetBtn = $(`.opp-filter-btn[data-filter="${f}"]`);
                if (targetBtn) {
                    targetBtn.click();
                }
            });
        });
    }

    function wireSearch() {
        const searchInput = $('#opp-search-input');
        const clearBtn = $('#opp-search-clear');
        const emptyResetBtn = $('#opp-empty-reset');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                if (clearBtn) {
                    if (searchQuery.length > 0) {
                        clearBtn.removeAttribute('hidden');
                    } else {
                        clearBtn.setAttribute('hidden', '');
                    }
                }
                applyFilterAndSearch();
            });
        }

        function resetAll() {
            if (searchInput) {
                searchInput.value = '';
                searchQuery = '';
            }
            if (clearBtn) clearBtn.setAttribute('hidden', '');
            const allBtn = $('.opp-filter-btn[data-filter="all"]');
            if (allBtn) allBtn.click();
            else {
                activeFilter = 'all';
                applyFilterAndSearch();
            }
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (searchInput) {
                    searchInput.value = '';
                    searchQuery = '';
                    searchInput.focus();
                }
                clearBtn.setAttribute('hidden', '');
                applyFilterAndSearch();
            });
        }

        if (emptyResetBtn) {
            emptyResetBtn.addEventListener('click', resetAll);
        }
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
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        updateCounts();
        wireFilters();
        wireSearch();
        wireMobileNav();
    });
})();
