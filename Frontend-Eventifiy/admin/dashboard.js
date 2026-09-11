/* EVENTIFY admin dashboard — rendering, charts and interactions.
   Data comes only from window.EventifyAdminAPI, so swapping the mock layer for
   real endpoints changes nothing in this file. */

(function () {
    const api = window.EventifyAdminAPI;
    const $ = sel => document.querySelector(sel);

    const charts = {};
    let state = { range: 'month', from: null, to: null, data: null, growthPeriod: '30d' };

    /* ---- helpers -------------------------------------------------------- */
    const num = n => n.toLocaleString('en-US');
    const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const icon = name => `<span class="material-symbols-outlined" aria-hidden="true">${name}</span>`;
    const toast = (msg, tone) => (window.EventifyUI ? window.EventifyUI.toast(msg, tone) : null);

    function relativeTime(iso) {
        const diff = (Date.now() - new Date(iso)) / 1000;
        if (diff < 60) return 'just now';
        if (diff < 3600) return `${Math.round(diff / 60)} min ago`;
        if (diff < 86400) return `${Math.round(diff / 3600)} h ago`;
        const days = Math.round(diff / 86400);
        return days === 1 ? 'yesterday' : `${days} days ago`;
    }

    function themeColors() {
        const dark = document.documentElement.classList.contains('dark');
        return {
            accent: '#FF4D2E',
            ink: dark ? '#F5F4F1' : '#0E1116',
            muted: dark ? '#A8A49C' : '#4A5058',
            grid: dark ? 'rgba(255,255,255,.08)' : 'rgba(14,17,22,.08)',
            surface: dark ? '#16181C' : '#FFFFFF',
            series: dark
                ? ['#FF4D2E', '#F5F4F1', '#7CA6FF', '#6DDBA4', '#F0B45F', '#C9A6FF', '#8C8880', '#FF9C92']
                : ['#FF4D2E', '#0E1116', '#1D4ED8', '#1E7A4F', '#D97706', '#7C3AED', '#8C8880', '#B3261E']
        };
    }

    /* ---- skeletons ------------------------------------------------------ */
    function showLoading() {
        $('#stat-blocks').innerHTML = `<div class="stat-grid stat-grid--4">${Array.from({ length: 4 }, () => `
            <div class="stat-card stat-card--primary">
                <div class="skeleton skeleton-line" style="width:45%"></div>
                <div class="skeleton" style="height:36px;width:60%"></div>
                <div class="skeleton skeleton-line"></div>
            </div>`).join('')}</div>`;

        ['#top-competitions', '#upcoming-events', '#recent-activity', '#status-overview',
            '#pending-actions', '#events-overview', '#registration-overview', '#funnel',
            '#users-overview', '#users-breakdown', '#ai-matching', '#insights'].forEach(sel => {
            const el = $(sel);
            if (el) el.innerHTML = Array.from({ length: 4 }, () =>
                '<div class="skeleton skeleton-line" style="height:38px;margin-bottom:12px"></div>').join('');
        });
        ['#registrations-body', '#top-organizations', '#performance-summary'].forEach(sel => {
            const el = $(sel);
            if (el) el.innerHTML = Array.from({ length: 5 }, () =>
                `<tr><td colspan="5"><div class="skeleton skeleton-line" style="height:20px"></div></td></tr>`).join('');
        });
    }

    function showError(message) {
        $('#dash-error').hidden = false;
        $('#dash-error-message').textContent = message;
    }

    /* ---- stat cards ----------------------------------------------------- */
    function statCard(item, isPrimary = false) {
        const up = item.change >= 0;
        return `
            <article class="stat-card ${isPrimary ? 'stat-card--primary' : ''}">
                <div class="stat-card__top">
                    <span class="stat-card__label">${esc(item.label)}</span>
                    <span class="stat-card__icon">${icon(item.icon)}</span>
                </div>
                <p class="stat-card__value">${num(item.value)}</p>
                <div class="stat-card__top">
                    <span class="stat-card__hint">${esc(item.hint)}</span>
                    <span class="trend trend--${up ? 'up' : 'down'}" title="Compared with the previous period">
                        ${icon(up ? 'trending_up' : 'trending_down')}${up ? '+' : ''}${item.change}%
                    </span>
                </div>
            </article>`;
    }

    function renderStats(kpis) {
        // The core four primary platform KPIs.
        const picks = [
            kpis.users[0], kpis.organizations[0],
            kpis.events[0], kpis.registrations[0]
        ];
        $('#stat-blocks').innerHTML = `<div class="stat-grid stat-grid--4">${picks.map((item, i) => {
            const card = statCard(item, true); // All top level KPIs are primary
            return card.replace('<article class="stat-card', `<article class="stat-card adm-enter" style="animation-delay:${0.1 + (i * 0.05)}s"`);
        }).join('')}</div>`;
    }

    /* ---- charts --------------------------------------------------------- */
    function baseOptions(colors, extra = {}) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: colors.muted, boxWidth: 10, boxHeight: 10, usePointStyle: true, pointStyle: 'circle', font: { size: 12, family: 'Inter' }, padding: 20 }
                },
                tooltip: {
                    backgroundColor: colors.surface,
                    titleColor: colors.ink,
                    bodyColor: colors.muted,
                    borderColor: colors.grid,
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: true,
                    boxPadding: 4,
                    usePointStyle: true,
                    titleFont: { family: 'Inter', size: 13, weight: 'bold' },
                    bodyFont: { family: 'JetBrains Mono', size: 12 },
                    caretSize: 6,
                    bodySpacing: 6,
                    titleSpacing: 8
                }
            },
            scales: {
                x: { grid: { display: false }, ticks: { color: colors.muted, font: { size: 11, family: 'Inter' }, maxRotation: 0, autoSkipPadding: 16 }, border: { display: false } },
                y: {
                    beginAtZero: true, grid: { color: colors.grid, tickLength: 0, borderDash: [4, 4] },
                    ticks: {
                        color: colors.muted, font: { size: 11, family: 'JetBrains Mono' }, precision: 0, padding: 10,
                        callback: value => value >= 1000 ? `${(value / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 })}k` : value
                    },
                    border: { display: false }
                }
            },
            ...extra
        };
    }

    function draw(key, canvasId, config) {
        if (charts[key]) charts[key].destroy();
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        charts[key] = new Chart(canvas, config);
    }

    function fill(ctx, hex) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 280);
        gradient.addColorStop(0, `${hex}44`);
        gradient.addColorStop(1, `${hex}00`);
        return gradient;
    }

    function renderCharts(data) {
        const c = themeColors();

        /* competitions over time */
        const compCanvas = document.getElementById('chart-competitions');
        const compCtx = compCanvas.getContext('2d');
        draw('competitions', 'chart-competitions', {
            type: 'line',
            data: {
                labels: data.competitions.labels,
                datasets: [
                    { label: 'Created', data: data.competitions.created, borderColor: c.series[0], backgroundColor: fill(compCtx, c.series[0]), fill: true, tension: 0.4, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 6, pointBackgroundColor: c.surface, pointBorderWidth: 2 },
                    { label: 'Active', data: data.competitions.active, borderColor: c.series[1], backgroundColor: 'transparent', tension: 0.4, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 6, pointBackgroundColor: c.surface, pointBorderWidth: 2 },
                    { label: 'Completed', data: data.competitions.completed, borderColor: c.series[2], backgroundColor: 'transparent', borderDash: [5, 4], tension: 0.4, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 6, pointBackgroundColor: c.surface, pointBorderWidth: 2 }
                ]
            },
            options: baseOptions(c)
        });

        /* categories */
        const totalCats = data.categories.reduce((sum, item) => sum + item.value, 0);
        draw('categories', 'chart-categories', {
            type: 'doughnut',
            data: {
                labels: data.categories.map(item => item.label),
                datasets: [{
                    data: data.categories.map(item => item.value),
                    backgroundColor: c.series,
                    borderColor: c.surface,
                    borderWidth: 2,
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '62%',
                plugins: {
                    legend: { position: 'right', labels: { color: c.muted, boxWidth: 10, boxHeight: 10, usePointStyle: true, pointStyle: 'circle', font: { size: 12, family: 'Inter' } } },
                    tooltip: {
                        backgroundColor: c.ink, titleColor: c.surface, bodyColor: c.surface, padding: 12, cornerRadius: 8,
                        callbacks: {
                            label: ctx => {
                                const pct = ((ctx.parsed / totalCats) * 100).toFixed(1);
                                return ` ${ctx.label}: ${num(ctx.parsed)} competitions (${pct}%)`;
                            }
                        }
                    }
                }
            },
            plugins: [{
                // the total belongs in the hole, where the eye already is
                id: 'doughnutTotal',
                afterDraw(chart) {
                    const { ctx, chartArea } = chart;
                    const x = (chartArea.left + chartArea.right) / 2;
                    const y = (chartArea.top + chartArea.bottom) / 2;
                    ctx.save();
                    ctx.textAlign = 'center';
                    ctx.fillStyle = c.ink;
                    ctx.font = '700 24px "JetBrains Mono", monospace';
                    ctx.fillText(num(totalCats), x, y + 2);
                    ctx.fillStyle = c.muted;
                    ctx.font = '600 11px Inter, sans-serif';
                    ctx.fillText('COMPETITIONS', x, y + 20);
                    ctx.restore();
                }
            }]
        });
        $('#categories-total').textContent = `${num(totalCats)} competitions across ${data.categories.length} categories`;

    }

    function renderPlatformGrowth(growth) {
        const c = themeColors();
        const canvas = document.getElementById('chart-platform-growth');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        draw('platformGrowth', 'chart-platform-growth', {
            type: 'line',
            data: {
                labels: growth.labels,
                datasets: [
                    { label: 'Users', data: growth.users, borderColor: c.series[0], backgroundColor: fill(ctx, c.series[0]), fill: true, tension: 0.4, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 6, pointBackgroundColor: c.surface, pointBorderWidth: 2 },
                    { label: 'Registrations', data: growth.registrations, borderColor: c.series[1], backgroundColor: 'transparent', tension: 0.4, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 6, pointBackgroundColor: c.surface, pointBorderWidth: 2 },
                    { label: 'Organizations', data: growth.organizations, borderColor: c.series[2], backgroundColor: 'transparent', borderDash: [5, 4], tension: 0.4, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 6, pointBackgroundColor: c.surface, pointBorderWidth: 2 },
                    { label: 'Events', data: growth.events, borderColor: c.series[3], backgroundColor: 'transparent', borderDash: [2, 3], tension: 0.4, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 6, pointBackgroundColor: c.surface, pointBorderWidth: 2 }
                ]
            },
            options: baseOptions(c)
        });
    }

    function renderEventsOverview(events) {
        const rows = [
            { label: 'Approved', value: events.approved, tone: 'active' },
            { label: 'Pending', value: events.pending, tone: 'pending' },
            { label: 'Rejected', value: events.rejected, tone: 'cancelled' },
            { label: 'Active', value: events.active, tone: 'active' },
            { label: 'Completed', value: events.completed, tone: 'completed' }
        ];
        renderStatusOverviewInto('#events-overview', rows);

        const c = themeColors();
        draw('eventsOverview', 'chart-events-overview', {
            type: 'doughnut',
            data: {
                labels: rows.map(r => r.label),
                datasets: [{ data: rows.map(r => r.value), backgroundColor: c.series, borderColor: c.surface, borderWidth: 2, hoverOffset: 6 }]
            },
            options: {
                responsive: true, maintainAspectRatio: false, cutout: '62%',
                plugins: { legend: { position: 'right', labels: { color: c.muted, boxWidth: 10, boxHeight: 10, usePointStyle: true, pointStyle: 'circle', font: { size: 11, family: 'Inter' } } } }
            }
        });
    }

    function renderRegistrationOverview(overview, trend) {
        const rows = [
            { label: 'Accepted', value: overview.accepted, tone: 'active' },
            { label: 'Pending', value: overview.pending, tone: 'pending' },
            { label: 'Rejected', value: overview.rejected, tone: 'cancelled' },
            { label: 'Cancelled', value: overview.cancelled, tone: 'cancelled' }
        ];
        renderStatusOverviewInto('#registration-overview', rows);

        const c = themeColors();
        const canvas = document.getElementById('chart-registration-overview');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        draw('registrationOverview', 'chart-registration-overview', {
            type: 'line',
            data: {
                labels: trend.labels,
                datasets: [
                    { label: 'Approved', data: trend.approved, borderColor: c.series[1], backgroundColor: fill(ctx, c.series[1]), fill: true, tension: 0.4, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 6, pointBackgroundColor: c.surface, pointBorderWidth: 2 },
                    { label: 'Pending', data: trend.pending, borderColor: c.series[4], backgroundColor: 'transparent', tension: 0.4, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 6, pointBackgroundColor: c.surface, pointBorderWidth: 2 },
                    { label: 'Rejected', data: trend.rejected, borderColor: c.series[7] || c.series[3], backgroundColor: 'transparent', tension: 0.4, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 6, pointBackgroundColor: c.surface, pointBorderWidth: 2 }
                ]
            },
            options: baseOptions(c)
        });
    }

    function renderFunnel(stages) {
        const max = stages[0].value;
        const el = $('#funnel');
        if (!el) return;
        el.innerHTML = `<div class="funnel-pipeline">` + stages.map((s, i) => {
            const pct = Math.round((s.value / max) * 100);
            const conv = i === 0 ? 100 : Math.round((s.value / stages[i - 1].value) * 100);
            return `
            <div class="funnel-step">
                <div class="funnel-step__info">
                    <p class="funnel-step__name"><span class="funnel-step__index">${String(i + 1).padStart(2, '0')}</span> ${esc(s.stage)}</p>
                    <p class="funnel-step__value">${num(s.value)}</p>
                </div>
                <div class="funnel-step__bar">
                    <div class="meter meter--lg"><span style="width:${pct}%"></span></div>
                </div>
                ${i > 0 ? `<p class="funnel-step__conv">${icon('subdirectory_arrow_right')} ${conv}% of previous</p>` : `<p class="funnel-step__conv" style="opacity:0; user-select:none;">-</p>`}
            </div>`;
        }).join('') + `</div>`;
    }

    function renderUsersOverview(kpisUsers, participants, roles) {
        const rows = [
            { label: 'Total Users', value: kpisUsers[0].value, tone: 'active' },
            { label: 'New Users', value: kpisUsers[1].value, tone: 'upcoming' },
            { label: 'Active Users', value: kpisUsers[2].value, tone: 'completed' }
        ];
        renderStatusOverviewInto('#users-overview', rows);

        const c = themeColors();
        const canvas = document.getElementById('chart-users-growth');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            draw('usersGrowth', 'chart-users-growth', {
                type: 'line',
                data: {
                    labels: participants.labels,
                    datasets: [
                        { label: 'Total participants', data: participants.totalParticipants, borderColor: c.series[0], backgroundColor: fill(ctx, c.series[0]), fill: true, tension: 0.4, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 6, pointBackgroundColor: c.surface, pointBorderWidth: 2 },
                        { label: 'New participants', data: participants.newParticipants, borderColor: c.series[2], backgroundColor: 'transparent', tension: 0.4, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 6, pointBackgroundColor: c.surface, pointBorderWidth: 2 }
                    ]
                },
                options: baseOptions(c)
            });
        }
        renderStatusOverviewInto('#users-breakdown', roles);
    }

    function renderOrganizations(rows) {
        const body = $('#top-organizations');
        if (!body) return;
        body.innerHTML = rows.map(row => `
            <tr>
                <td style="font-weight:600">${esc(row.name)}</td>
                <td class="mono">${num(row.events)}</td>
                <td class="mono">${num(row.registrations)}</td>
                <td class="mono">${num(row.participants)}</td>
                <td><span class="badge badge--${row.status}">${row.status}</span></td>
            </tr>`).join('');
    }

    function renderAIMatching(ai) {
        const el = $('#ai-matching');
        if (!el) return;
        el.innerHTML = `
            <div style="display:flex; flex-direction:column; gap: 16px; height: 100%;">
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="stat-card" style="padding: 16px; gap: 6px;">
                        <p class="stat-card__label">Matching Requests</p>
                        <p class="stat-card__value" style="font-size: 24px;">${num(ai.requests)}</p>
                    </div>
                    <div class="stat-card" style="padding: 16px; gap: 6px; border-color: var(--accent); background: color-mix(in srgb, var(--accent) 4%, var(--surface));">
                        <p class="stat-card__label" style="color: var(--accent-dark);">Successful Matches</p>
                        <p class="stat-card__value" style="font-size: 24px; color: var(--accent);">${num(ai.successfulMatches)}</p>
                    </div>
                </div>
                <div class="stat-card" style="padding: 16px; gap: 12px;">
                    <div style="display:flex; justify-content: space-between; align-items: center;">
                        <p class="stat-card__label">Match Rate</p>
                        <p class="stat-card__value" style="font-size: 20px;">${ai.matchRate}%</p>
                    </div>
                    <div class="meter meter--lg"><span style="width:${ai.matchRate}%"></span></div>
                </div>
                <div class="status-row" style="margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border);">
                    <span class="status-row__left" style="display:flex; align-items:center; gap:6px;">${icon('category')} Most Matched Category</span>
                    <span class="status-row__value">${esc(ai.topCategory)}</span>
                </div>
            </div>`;
    }

    function renderInsights(list) {
        const el = $('#insights');
        if (!el) return;
        const icons = ['trending_up', 'category', 'pending_actions', 'apartment', 'bolt'];
        el.innerHTML = list.map((text, i) => `
            <div class="insight-item">
                <span class="insight-item__icon">${icon(icons[i % icons.length])}</span>
                <p class="insight-item__text">${esc(text)}</p>
            </div>`).join('');
    }

    function renderPendingActions(rows) {
        const el = $('#pending-actions');
        if (!el) return;
        el.innerHTML = rows.map(row => {
            const displayCount = row.count < 10 ? '0' + row.count : num(row.count);
            return `
            <article class="pending-action-card">
                <div class="pending-action-card__top">
                    <span class="pending-action-card__icon">${icon(row.icon)}</span>
                    <p class="pending-action-card__count">${displayCount}</p>
                </div>
                <div class="pending-action-card__body">
                    <p class="pending-action-card__label">${esc(row.label)}</p>
                    <p class="pending-action-card__desc">${esc(row.description)}</p>
                </div>
                <div class="pending-action-card__foot">
                    <a class="pending-action-card__link" href="${row.href}">Review ${icon('arrow_forward')}</a>
                </div>
            </article>`;
        }).join('');
    }

    function renderPerformanceSummary(kpis) {
        const body = $('#performance-summary');
        if (!body) return;
        const metrics = [kpis.users[0], kpis.organizations[0], kpis.events[0], kpis.registrations[0]];
        body.innerHTML = metrics.map(m => {
            const up = m.change >= 0;
            const previous = Math.round(m.value / (1 + m.change / 100));
            return `
            <tr>
                <td style="font-weight:600">${esc(m.label)}</td>
                <td class="mono">${num(m.value)}</td>
                <td class="mono">${num(previous)}</td>
                <td class="trend trend--${up ? 'up' : 'down'}">${up ? '+' : ''}${m.change}%</td>
                <td>${icon(up ? 'trending_up' : 'trending_down')}</td>
            </tr>`;
        }).join('');
    }

    /* ---- lists ---------------------------------------------------------- */
    function renderStatusOverviewInto(sel, rows) {
        const el = $(sel);
        if (!el) return;
        el.innerHTML = rows.map(row => `
            <div class="status-row">
                <span class="status-row__left"><span class="status-row__dot dot--${row.tone}"></span>${esc(row.label)}</span>
                <span class="status-row__value">${num(row.value)}</span>
            </div>`).join('');
    }

    function renderStatusOverview(rows) {
        $('#status-overview').innerHTML = rows.map(row => `
            <div class="status-row">
                <span class="status-row__left"><span class="status-row__dot dot--${row.tone}"></span>${esc(row.label)}</span>
                <span class="status-row__value">${num(row.value)}</span>
            </div>`).join('');
    }

    function renderTopCompetitions(rows) {
        $('#top-competitions').innerHTML = rows.map((row, i) => {
            const pct = Math.round((row.participants / row.capacity) * 100);
            return `
            <div class="rank-row">
                <span class="rank-row__index">${String(i + 1).padStart(2, '0')}</span>
                <div>
                    <p class="rank-row__name">${esc(row.name)}</p>
                    <p class="rank-row__meta">${esc(row.category)} &middot; <span class="badge badge--${row.status}">${row.status}</span></p>
                    <div class="meter"><span style="width:${pct}%"></span></div>
                </div>
                <div>
                    <p class="rank-row__value">${num(row.participants)}</p>
                    <p class="rank-row__meta" style="text-align:right">${pct}% filled</p>
                </div>
            </div>`;
        }).join('');
    }

    function renderUpcomingEvents(rows) {
        $('#upcoming-events').innerHTML = rows.map(row => {
            const d = new Date(row.date);
            return `
            <div class="event-row">
                <div class="event-row__date">
                    <span class="event-row__day">${d.getDate()}</span>
                    <span class="event-row__month">${d.toLocaleDateString('en-GB', { month: 'short' })}</span>
                </div>
                <div style="flex:1;min-width:0">
                    <p class="rank-row__name">${esc(row.name)}</p>
                    <p class="rank-row__meta">${row.time} &middot; ${esc(row.location)} &middot; ${num(row.registered)}/${num(row.capacity)} registered</p>
                </div>
                <span class="badge badge--${row.status}">${row.status}</span>
                <a class="btn-secondary" style="padding:.45rem .9rem" href="admin-event-review-details.html">View</a>
            </div>`;
        }).join('');
    }

    function renderActivity(rows) {
        $('#recent-activity').innerHTML = `<div class="timeline">${rows.map(row => `
            <div class="timeline__item">
                <p class="timeline__text"><strong>${esc(row.actor)}</strong> ${esc(row.action)} <strong>${esc(row.target)}</strong></p>
                <p class="timeline__time">${relativeTime(row.at)}</p>
            </div>`).join('')}</div>`;
    }

    function renderRegistrations(rows) {
        const body = $('#registrations-body');
        if (!rows.length) {
            body.innerHTML = `<tr><td colspan="5">
                <div class="empty-state" style="border:none;background:none">
                    <span class="empty-state__icon">${icon('how_to_reg')}</span>
                    <h3>No registrations in this period</h3>
                    <p>Change the date filter, or wait for the next registration to come in.</p>
                </div></td></tr>`;
            return;
        }

        body.innerHTML = rows.map(row => `
            <tr data-id="${row.id}">
                <td>
                    <p style="font-weight:600">${esc(row.participant)}</p>
                    <p class="rank-row__meta">${esc(row.email)}</p>
                </td>
                <td>
                    <p>${esc(row.target)}</p>
                    <p class="rank-row__meta">${esc(row.type)}</p>
                </td>
                <td class="mono">${new Date(row.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} ${new Date(row.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</td>
                <td><span class="badge badge--${row.status}" data-status>${row.status}</span></td>
                <td>
                    <div class="row-actions">
                        <button type="button" data-act="view" title="View registration" aria-label="View registration ${row.id}">${icon('visibility')}</button>
                        <button type="button" data-act="approve" title="Approve" aria-label="Approve registration ${row.id}" ${row.status === 'approved' ? 'disabled' : ''}>${icon('check')}</button>
                        <button type="button" data-act="reject" title="Reject" aria-label="Reject registration ${row.id}" ${row.status === 'rejected' ? 'disabled' : ''}>${icon('close')}</button>
                        <button type="button" data-act="delete" title="Delete" aria-label="Delete registration ${row.id}">${icon('delete')}</button>
                    </div>
                </td>
            </tr>`).join('');
    }

    /* ---- table actions -------------------------------------------------- */
    function confirmAction({ title, body, confirmLabel }) {
        return new Promise(resolve => {
            const dialog = $('#confirm-dialog');
            dialog.querySelector('h3').textContent = title;
            dialog.querySelector('p').textContent = body;
            dialog.querySelector('[data-confirm]').textContent = confirmLabel;

            const close = value => {
                dialog.close();
                dialog.removeEventListener('close', onClose);
                resolve(value);
            };
            const onClose = () => resolve(false);

            dialog.querySelector('[data-confirm]').onclick = () => close(true);
            dialog.querySelector('[data-cancel]').onclick = () => close(false);
            dialog.addEventListener('close', onClose, { once: true });
            dialog.showModal();
        });
    }

    async function handleRowAction(button) {
        const row = button.closest('tr');
        const id = row.dataset.id;
        const act = button.dataset.act;
        const badge = row.querySelector('[data-status]');

        if (act === 'view') {
            toast(`Opening ${id}`, 'success');
            return;
        }

        if (act === 'delete') {
            const ok = await confirmAction({
                title: 'Delete this registration?',
                body: `${id} will be removed for the participant and the organizer. This cannot be undone.`,
                confirmLabel: 'Delete registration'
            });
            if (!ok) return;
            row.style.opacity = '.4';
            try {
                await api.deleteRegistration(id);
                row.remove();
                toast(`${id} deleted`, 'error');
                if (!$('#registrations-body').children.length) renderRegistrations([]);
            } catch {
                row.style.opacity = '';
                toast('Could not delete the registration', 'error');
            }
            return;
        }

        const status = act === 'approve' ? 'approved' : 'rejected';
        if (act === 'reject') {
            const ok = await confirmAction({
                title: 'Reject this registration?',
                body: `The participant is notified that ${id} was not accepted.`,
                confirmLabel: 'Reject registration'
            });
            if (!ok) return;
        }

        try {
            await api.updateRegistration(id, status);
            badge.className = `badge badge--${status}`;
            badge.textContent = status;
            row.querySelector('[data-act="approve"]').disabled = status === 'approved';
            row.querySelector('[data-act="reject"]').disabled = status === 'rejected';
            toast(`${id} ${status}`, status === 'approved' ? 'success' : 'error');
        } catch {
            toast('Could not update the registration', 'error');
        }
    }

    /* ---- load ----------------------------------------------------------- */
    async function load() {
        $('#dash-error').hidden = true;
        showLoading();
        try {
            const data = await api.getOverview(state.range, state.from, state.to);
            state.data = data;
            renderStats(data.kpis);
            renderCharts(data);
            renderStatusOverview(data.statusOverview);
            renderTopCompetitions(data.topCompetitions);
            renderUpcomingEvents(data.upcomingEvents);
            renderActivity(data.recentActivity);
            renderRegistrations(data.recentRegistrations);
            renderPendingActions(data.pendingActions);
            renderEventsOverview(data.events);
            renderRegistrationOverview(data.registrationOverview, data.registrationsChart);
            renderFunnel(data.funnel);
            renderUsersOverview(data.kpis.users, data.participants, data.roleDistribution);
            renderOrganizations(data.topOrganizations);
            renderAIMatching(data.aiMatching);
            renderInsights(data.insights);
            renderPerformanceSummary(data.kpis);
            await loadPlatformGrowth(state.growthPeriod);
            $('#dash-updated').textContent = `Updated ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
        } catch (error) {
            showError(error.message || 'The dashboard data could not be loaded.');
        }
    }

    async function loadPlatformGrowth(period) {
        const growth = await api.getPlatformGrowth(period);
        renderPlatformGrowth(growth);
    }

    /* ---- wiring --------------------------------------------------------- */
    function wire() {
        // global range filter
        $('#range-select').addEventListener('change', event => {
            state.range = event.target.value;
            $('#custom-range').hidden = state.range !== 'custom';
            if (state.range !== 'custom') load();
        });

        $('#custom-apply').addEventListener('click', () => {
            state.from = $('#custom-from').value;
            state.to = $('#custom-to').value;
            if (!state.from || !state.to) { toast('Pick both dates first', 'error'); return; }
            if (state.from > state.to) { toast('The start date is after the end date', 'error'); return; }
            load();
        });

        $('#registrations-body').addEventListener('click', event => {
            const button = event.target.closest('button[data-act]');
            if (button) handleRowAction(button);
        });

        $('#dash-retry').addEventListener('click', load);
        $('#btn-dash-refresh').addEventListener('click', load);
        $('#btn-dash-export').addEventListener('click', () => toast('Dashboard export prepared for download', 'success'));

        const growthGroup = $('#platform-growth-range');
        if (growthGroup) {
            growthGroup.addEventListener('click', event => {
                const button = event.target.closest('button[data-range]');
                if (!button) return;
                Array.from(growthGroup.querySelectorAll('button')).forEach(b => b.setAttribute('aria-pressed', String(b === button)));
                state.growthPeriod = button.dataset.range;
                loadPlatformGrowth(state.growthPeriod);
            });
        }

        // charts follow the theme
        new MutationObserver(() => {
            if (!state.data) return;
            renderCharts(state.data);
            renderEventsOverview(state.data.events);
            renderRegistrationOverview(state.data.registrationOverview, state.data.registrationsChart);
            renderUsersOverview(state.data.kpis.users, state.data.participants, state.data.roleDistribution);
            loadPlatformGrowth(state.growthPeriod);
        }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { wire(); load(); });
    } else {
        wire();
        load();
    }
})();
