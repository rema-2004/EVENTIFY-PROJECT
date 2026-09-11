(function () {
    const $ = (sel, root) => (root || document).querySelector(sel);
    const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

    const STATUS_LABEL = { live: 'Live', upcoming: 'Upcoming', pending: 'Pending Approval', ended: 'Ended', cancelled: 'Cancelled' };
    const STATUS_BADGE = { live: 'badge--active', upcoming: 'badge--upcoming', pending: 'badge--pending', ended: 'badge--completed', cancelled: 'badge--cancelled' };
    const APP_BADGE = { approved: 'badge--approved', pending: 'badge--pending', rejected: 'badge--rejected' };

    let charts = {};
    let currentRange = '30d';
    let state = null;

    function isDark() { return document.documentElement.classList.contains('dark'); }
    function ink(opacity) { return isDark() ? `rgba(245,244,241,${opacity})` : `rgba(14,17,22,${opacity})`; }

    function getTooltipOptions() {
        const dark = isDark();
        return {
            backgroundColor: dark ? '#1c1f24' : '#ffffff',
            titleColor: dark ? '#f5f4f1' : '#0e1116',
            bodyColor: dark ? '#a8a49c' : '#4a5058',
            borderColor: dark ? 'rgba(255,255,255,0.12)' : 'rgba(14,17,22,0.12)',
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
            boxPadding: 4,
            usePointStyle: true,
            titleFont: { family: 'Inter', size: 12, weight: '600' },
            bodyFont: { family: 'Inter', size: 12, weight: '500' }
        };
    }

    function statCard(k) {
        const up = k.trend >= 0;
        const value = k.suffix ? `${k.trend > 0 ? '+' : ''}${k.trend}` : `${up ? '+' : ''}${k.trend}%`;
        return `
        <article class="stat-card">
            <div class="stat-card__top">
                <span class="stat-card__label">${k.label}</span>
                <span class="stat-card__icon"><span class="material-symbols-outlined" aria-hidden="true">${k.icon}</span></span>
            </div>
            <p class="stat-card__value">${k.value}</p>
            <div class="stat-card__top">
                <span class="stat-card__hint">${k.trendLabel}</span>
                <span class="trend ${up ? 'trend--up' : 'trend--down'}">
                    <span class="material-symbols-outlined" aria-hidden="true">${up ? 'trending_up' : 'trending_down'}</span>${value}
                </span>
            </div>
        </article>`;
    }

    function renderStats(kpis) {
        const grid = $('#org-stat-grid');
        if (grid) grid.innerHTML = kpis.map(statCard).join('');
    }

    function renderMyEvents(events) {
        const body = $('#org-events-body');
        if (!body) return;
        body.innerHTML = events.map((e) => `
            <tr>
                <td>
                    <div class="flex items-center gap-3">
                        <img src="${e.image || '../assets/images/event1.jpeg'}" alt="" class="w-10 h-10 rounded-xl object-cover border border-outline-variant/40 flex-shrink-0" onerror="this.style.display='none'">
                        <p class="font-medium text-on-surface truncate max-w-[200px] md:max-w-[280px]">${e.name}</p>
                    </div>
                </td>
                <td><span class="badge ${STATUS_BADGE[e.status]}">${STATUS_LABEL[e.status]}</span></td>
                <td class="mono whitespace-nowrap">${e.date}</td>
                <td class="whitespace-nowrap"><span class="mono">${e.applicants}</span> applicants</td>
                <td class="whitespace-nowrap">${e.approved === null ? '—' : '<span class="mono">' + e.approved + '</span> approved'}</td>
                <td class="whitespace-nowrap"><span class="mono">${e.pending}</span> pending</td>
                <td class="whitespace-nowrap">${e.rating ? '★ ' + e.rating.toFixed(1) : '—'}</td>
                <td>
                    <div class="org-row-actions">
                        <a href="org-opportunities.html" aria-label="Manage ${e.name}">Manage</a>
                        <a href="org-applicants.html?event=${e.id}" aria-label="Applicants for ${e.name}">Applicants</a>
                    </div>
                </td>
            </tr>`).join('');
    }

    function renderUpcoming(events) {
        const target = $('#org-upcoming');
        if (!target) return;
        target.innerHTML = events.map((e) => {
            const d = new Date(e.date);
            const hasDate = !isNaN(d);
            return `
            <div class="event-row">
                <div class="event-row__date">
                    <span class="event-row__day">${hasDate ? d.getDate() : '—'}</span>
                    <span class="event-row__month">${hasDate ? d.toLocaleDateString('en-GB', { month: 'short' }) : ''}</span>
                </div>
                <div style="flex:1;min-width:0">
                    <p class="rank-row__name truncate">${e.name}</p>
                    <p class="rank-row__meta">${e.time} &middot; ${e.location} &middot; <span class="mono">${e.applicants}</span> applicants</p>
                </div>
                <span class="badge ${STATUS_BADGE[e.status]}">${STATUS_LABEL[e.status]}</span>
            </div>`;
        }).join('');
    }

    function renderTopEvents(events) {
        const target = $('#org-top-events');
        if (!target) return;
        const max = Math.max(...events.map((e) => e.score));
        target.innerHTML = events.map((e) => `
            <div class="rank-row">
                <span class="rank-row__index">${String(e.rank).padStart(2, '0')}</span>
                <div style="min-width:0">
                    <p class="rank-row__name truncate">${e.name}</p>
                    <p class="rank-row__meta">&#9733; ${e.rating ?? '—'} rating</p>
                    <div class="meter"><span style="width:${Math.round((e.score / max) * 100)}%"></span></div>
                </div>
                <div>
                    <p class="rank-row__value">${e.applicants}</p>
                    <p class="rank-row__meta" style="text-align:right">applicants</p>
                </div>
            </div>`).join('');
    }

    function renderRecentApplicants(list) {
        const body = $('#org-applicants-body');
        if (!body) return;
        body.innerHTML = list.map((a) => `
            <tr>
                <td class="font-medium text-on-surface whitespace-nowrap">${a.name}</td>
                <td class="truncate max-w-[180px] md:max-w-[260px]">${a.event}</td>
                <td class="mono whitespace-nowrap">${a.applied}</td>
                <td><span class="badge ${APP_BADGE[a.status]}">${a.status[0].toUpperCase() + a.status.slice(1)}</span></td>
                <td>
                    <div class="org-row-actions">
                        <a href="org-applicant-details.html" aria-label="View profile of ${a.name}">View profile</a>
                        <a href="org-applicants.html" class="org-action--primary" aria-label="Review application from ${a.name}">Review</a>
                    </div>
                </td>
            </tr>`).join('');
    }

    function renderActivity(items) {
        const target = $('#org-activity');
        if (!target) return;
        target.innerHTML = items.map((a) => `
            <div class="timeline__item">
                <p class="timeline__text">${a.text}</p>
                <p class="timeline__time">${a.time}</p>
            </div>`).join('');
    }

    /* ---------- charts ---------- */

    function destroy(id) { if (charts[id]) { charts[id].destroy(); delete charts[id]; } }

    function renderApplicantsChart(series) {
        destroy('applicants');
        const ctx = $('#org-chart-applicants');
        if (!ctx || !window.Chart) return;
        const grid = ink(0.06);
        charts.applicants = new Chart(ctx, {
            type: 'line',
            data: {
                labels: series.labels,
                datasets: [
                    { label: 'Total', data: series.total, borderColor: '#FF4D2E', backgroundColor: 'rgba(255,77,46,.10)', fill: true, tension: .35, pointRadius: 0, pointHoverRadius: 4, pointHoverBackgroundColor: '#FF4D2E' },
                    { label: 'Approved', data: series.approved, borderColor: '#1E7A4F', backgroundColor: 'transparent', tension: .35, pointRadius: 0, pointHoverRadius: 4, pointHoverBackgroundColor: '#1E7A4F' },
                    { label: 'Pending', data: series.pending, borderColor: '#8A5A00', backgroundColor: 'transparent', borderDash: [4, 4], tension: .35, pointRadius: 0, pointHoverRadius: 4, pointHoverBackgroundColor: '#8A5A00' }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { boxWidth: 10, boxHeight: 10, borderRadius: 2, useBorderRadius: true, font: { family: 'Inter', size: 11 }, color: ink(0.7) }
                    },
                    tooltip: getTooltipOptions()
                },
                scales: {
                    x: { grid: { display: false }, ticks: { color: ink(0.55), font: { family: 'Inter', size: 11 } } },
                    y: { grid: { color: grid }, ticks: { color: ink(0.55), font: { family: 'Inter', size: 11 } }, beginAtZero: true }
                }
            }
        });
    }

    function renderEventPerformanceChart(events) {
        destroy('performance');
        const ctx = $('#org-chart-performance');
        if (!ctx || !window.Chart) return;
        charts.performance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: events.map((e) => e.name),
                datasets: [
                    { label: 'Approved', data: events.map((e) => e.approved), backgroundColor: '#1E7A4F', borderRadius: 4 },
                    { label: 'Pending', data: events.map((e) => e.pending), backgroundColor: '#FFC876', borderRadius: 4 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { boxWidth: 10, boxHeight: 10, borderRadius: 2, useBorderRadius: true, font: { family: 'Inter', size: 11 }, color: ink(0.7) }
                    },
                    tooltip: getTooltipOptions()
                },
                scales: {
                    x: {
                        stacked: true,
                        grid: { display: false },
                        ticks: {
                            color: ink(0.55),
                            font: { family: 'Inter', size: 10 },
                            autoSkip: false,
                            maxRotation: 18,
                            minRotation: 0,
                            callback: function (val, index) {
                                const label = this.getLabelForValue(val);
                                return label.length > 18 ? label.substring(0, 16) + '…' : label;
                            }
                        }
                    },
                    y: { stacked: true, grid: { color: ink(0.06) }, ticks: { color: ink(0.55), font: { family: 'Inter', size: 11 } }, beginAtZero: true }
                }
            }
        });
    }

    function centerTextPlugin(text, sub) {
        return {
            id: 'centerText',
            afterDraw(chart) {
                const { ctx, chartArea } = chart;
                if (!chartArea) return;
                const x = (chartArea.left + chartArea.right) / 2;
                const y = (chartArea.top + chartArea.bottom) / 2;
                ctx.save();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = ink(0.9);
                ctx.font = "700 24px 'JetBrains Mono', monospace";
                ctx.fillText(text, x, y - 8);
                ctx.fillStyle = ink(0.55);
                ctx.font = "600 11px 'Inter', sans-serif";
                ctx.fillText(sub, x, y + 14);
                ctx.restore();
            }
        };
    }

    function renderStatusChart(status) {
        destroy('status');
        const ctx = $('#org-chart-status');
        if (!ctx || !window.Chart) return;
        const total = status.approved + status.pending + status.rejected;
        const totalLabel = $('#org-status-total');
        if (totalLabel) totalLabel.textContent = `${total} applications total`;
        charts.status = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Approved', 'Pending Review', 'Rejected'],
                datasets: [{
                    data: [status.approved, status.pending, status.rejected],
                    backgroundColor: ['#1E7A4F', '#FFC876', '#B3261E'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '72%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { boxWidth: 10, boxHeight: 10, borderRadius: 2, useBorderRadius: true, font: { family: 'Inter', size: 11 }, color: ink(0.7) }
                    },
                    tooltip: getTooltipOptions()
                }
            },
            plugins: [centerTextPlugin(String(total), 'applications')]
        });
    }

    function renderCategoriesChart(categories) {
        destroy('categories');
        const ctx = $('#org-chart-categories');
        if (!ctx || !window.Chart) return;
        const total = categories.reduce((s, c) => s + c.count, 0);
        const totalLabel = $('#org-categories-total');
        if (totalLabel) totalLabel.textContent = `${total} events across ${categories.length} categories`;
        const palette = ['#FF4D2E', '#1E7A4F', '#2A4FBE', '#8A5A00', '#B3261E', '#4A5058', '#0E1116'];
        charts.categories = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categories.map((c) => c.name),
                datasets: [{
                    data: categories.map((c) => c.count),
                    backgroundColor: palette,
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '64%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { boxWidth: 10, boxHeight: 10, borderRadius: 2, useBorderRadius: true, font: { family: 'Inter', size: 10 }, color: ink(0.7) }
                    },
                    tooltip: getTooltipOptions()
                }
            }
        });
    }

    function renderTrendChart(trend) {
        destroy('trend');
        const ctx = $('#org-chart-trend');
        if (!ctx || !window.Chart) return;
        charts.trend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: trend.labels,
                datasets: [
                    { label: 'Daily registrations', data: trend.daily, borderColor: '#FF4D2E', backgroundColor: 'rgba(255,77,46,.10)', fill: true, tension: .3, pointRadius: 0, pointHoverRadius: 4, pointHoverBackgroundColor: '#FF4D2E' },
                    { label: 'Approved', data: trend.approved, borderColor: '#1E7A4F', backgroundColor: 'transparent', tension: .3, pointRadius: 0, pointHoverRadius: 4, pointHoverBackgroundColor: '#1E7A4F' },
                    { label: 'Pending', data: trend.pending, borderColor: '#8A5A00', backgroundColor: 'transparent', borderDash: [4, 4], tension: .3, pointRadius: 0, pointHoverRadius: 4, pointHoverBackgroundColor: '#8A5A00' }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { boxWidth: 10, boxHeight: 10, borderRadius: 2, useBorderRadius: true, font: { family: 'Inter', size: 11 }, color: ink(0.7) }
                    },
                    tooltip: getTooltipOptions()
                },
                scales: {
                    x: { grid: { display: false }, ticks: { color: ink(0.55), font: { family: 'Inter', size: 10 }, maxTicksLimit: 8 } },
                    y: { grid: { color: ink(0.06) }, ticks: { color: ink(0.55), font: { family: 'Inter', size: 11 } }, beginAtZero: true }
                }
            }
        });
    }

    /* ---------- load & wire up ---------- */

    async function load(range) {
        currentRange = range;
        state = await window.OrgDashboardAPI.getOverview(range);
        renderStats(state.kpis);
        renderApplicantsChart(state.applicantsSeries);
        renderEventPerformanceChart(state.eventPerformance);
        renderStatusChart(state.applicationStatus);
        renderCategoriesChart(state.categories);
        renderTrendChart(state.registrationTrend);
        renderMyEvents(state.myEvents);
        renderUpcoming(state.upcomingEvents);
        renderTopEvents(state.topEvents);
        renderRecentApplicants(state.recentApplicants);
        renderActivity(state.recentActivity);
    }

    function wireRangeFilter() {
        const group = $('#org-applicants-range');
        if (!group) return;
        group.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-range]');
            if (!btn) return;
            $$('button', group).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
            currentRange = btn.dataset.range;
            window.OrgDashboardAPI.getOverview(currentRange).then((s) => {
                state = s;
                renderApplicantsChart(s.applicantsSeries);
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
                $$('.org-dropdown__panel').forEach((p) => {
                    p.setAttribute('hidden', '');
                    const t = document.getElementById(p.id.replace('-panel', '-toggle'));
                    if (t) t.setAttribute('aria-expanded', 'false');
                });
            }
        });
    }

    function wireThemeRerender() {
        const observer = new MutationObserver(() => {
            if (!state) return;
            renderApplicantsChart(state.applicantsSeries);
            renderEventPerformanceChart(state.eventPerformance);
            renderStatusChart(state.applicationStatus);
            renderCategoriesChart(state.categories);
            renderTrendChart(state.registrationTrend);
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    }

    document.addEventListener('DOMContentLoaded', () => {
        wireRangeFilter();
        wireMobileNav();
        wireThemeRerender();
        load('30d');
    });
})();
