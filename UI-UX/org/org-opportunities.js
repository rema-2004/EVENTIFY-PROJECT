(function () {
    const $ = (sel, root) => (root || document).querySelector(sel);
    const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

    let activeFilter = 'all';
    let searchQuery = '';

    function animateCount(el, target, duration = 500) {
        if (!el) return;
        const start = parseInt(el.textContent, 10) || 0;
        if (start === target) return;
        const startTime = performance.now();
        function update(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(start + (target - start) * ease);
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    function updateCounts(animate = true) {
        const rows = $$('#opp-tbody tr[data-status]');
        const counts = { all: rows.length, live: 0, pending: 0, upcoming: 0, ended: 0 };

        rows.forEach(r => {
            const s = r.dataset.status;
            if (counts[s] !== undefined) counts[s]++;
        });

        // Update KPI stat card values with smooth animation
        const updater = animate ? animateCount : (el, val) => { if (el) el.textContent = val; };
        updater($('#kpi-live-val'), counts.live);
        updater($('#kpi-pending-val'), counts.pending);
        updater($('#kpi-upcoming-val'), counts.upcoming);
        updater($('#kpi-ended-val'), counts.ended);

        // Update Filter pill badge counts
        $$('.opp-filter-btn').forEach(btn => {
            const f = btn.dataset.filter;
            const badge = btn.querySelector('.filter-count');
            if (badge && counts[f] !== undefined) {
                updater(badge, counts[f], 350);
            }
        });
    }

    function applyFilterAndSearch() {
        const rows = $$('#opp-tbody tr[data-status]');
        const emptyState = $('#opp-empty-state');
        const table = $('#opp-table');
        const query = searchQuery.trim().toLowerCase();

        let visibleCount = 0;
        let staggerIdx = 0;

        rows.forEach(row => {
            const status = row.dataset.status;
            const title = (row.querySelector('.opp-entity__name')?.textContent || '').toLowerCase();
            const meta = (row.querySelector('.opp-entity__meta')?.textContent || '').toLowerCase();

            const matchesFilter = activeFilter === 'all' || status === activeFilter;
            const matchesSearch = !query || title.includes(query) || meta.includes(query);

            if (matchesFilter && matchesSearch) {
                row.style.display = '';
                row.style.setProperty('--stagger-idx', staggerIdx);
                row.classList.remove('row-animated');
                void row.offsetWidth; // trigger reflow
                row.classList.add('row-animated');
                staggerIdx++;
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

    function wireResubmitActions() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-resubmit-opp');
            if (!btn || btn.classList.contains('loading')) return;
            const row = btn.closest('tr[data-status]');
            if (!row) return;

            // Immediate tactile feedback: spin icon & disable duplicate clicks
            btn.classList.add('loading');
            const icon = btn.querySelector('svg');
            if (icon) icon.classList.add('icon-spin-fast');

            setTimeout(() => {
                // Change state from rejected to pending
                row.dataset.status = 'pending';
                row.classList.add('row-resubmitted-pulse');

                // Remove rejection reason box with fade
                const rejectionBox = row.querySelector('.opp-rejection-box');
                if (rejectionBox) {
                    rejectionBox.style.transition = 'all 0.25s ease';
                    rejectionBox.style.opacity = '0';
                    rejectionBox.style.maxHeight = '0';
                    setTimeout(() => rejectionBox.remove(), 250);
                }

                // Update badge to pending
                const badge = row.querySelector('.badge');
                if (badge) {
                    badge.className = 'badge badge--pending';
                    badge.textContent = 'Pending Approval';
                }

                // Update actions to pending actions (only Edit, no Applicants)
                const actionsWrap = row.querySelector('.org-row-actions');
                if (actionsWrap) {
                    actionsWrap.innerHTML = `
                        <a href="org-create-event.html" class="org-action--primary" aria-label="Edit opportunity">Edit</a>
                    `;
                }

                // Update counts across stat cards & filter pills (with smooth countup)
                updateCounts(true);

                // Re-apply filter & search so if user is on a specific filter it moves appropriately
                applyFilterAndSearch();

                // Clean up pulse animation after completion
                setTimeout(() => {
                    row.classList.remove('row-resubmitted-pulse');
                }, 1600);
            }, 300);
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        updateCounts();
        wireFilters();
        wireSearch();
        wireMobileNav();
        wireResubmitActions();
    });
})();
