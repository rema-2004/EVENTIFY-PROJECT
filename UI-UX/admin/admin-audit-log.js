/* Admin Audit Log page — rendering, filtering, sorting, pagination, export (mock only). */
(function () {
    const store = window.AdminAuditLogData;
    if (!store) return;

    const logs = store.logs;
    const state = {
        query: '', user: 'all', type: 'all', role: 'all', status: 'all', location: 'all',
        range: 'all', customStart: '', customEnd: '',
        adv: { ip: '', device: '', browser: '', os: '', sessionId: '' },
        sortKey: 'timestamp', sortDir: 'desc', page: 1, pageSize: 20
    };

    const $ = (sel, root) => (root || document).querySelector(sel);
    const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

    const tbody = $('#audit-tbody');
    const emptyState = $('#audit-empty');
    const tableWrap = $('#audit-table-wrap');
    const skeleton = $('#audit-skeleton');
    const pagination = $('#audit-pagination');
    const securityList = $('#audit-security-list');

    const STATUS_BADGE = { Success: 'badge--approved', Failed: 'badge--rejected', Warning: 'badge--pending' };

    /* --- utilities --------------------------------------------------------- */
    function showToast(message, tone) {
        if (window.EventifyUI) window.EventifyUI.toast(message, tone || 'success');
    }

    function triggerDownload(filename, content, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function initials(name) {
        return name.split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
    }

    function parseTs(ts) { return new Date(ts.replace(' ', 'T')); }

    function formatDateTime(ts) {
        const d = parseTs(ts);
        const day = String(d.getDate()).padStart(2, '0');
        const month = d.toLocaleString('en-US', { month: 'short' });
        const year = d.getFullYear();
        let hours = d.getHours();
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${day} ${month} ${year} — ${hours}:${minutes} ${ampm}`;
    }

    function sameDay(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }

    function formatDateTimeWithSeconds(ts) {
        const d = parseTs(ts);
        const day = String(d.getDate()).padStart(2, '0');
        const month = d.toLocaleString('en-US', { month: 'short' });
        const year = d.getFullYear();
        let hours = d.getHours();
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${day} ${month} ${year} — ${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
    }

    const NOW = parseTs(logs[0].timestamp);

    /* --- filter dropdown population ----------------------------------------- */
    function populateFilters() {
        const userSelect = $('#audit-filter-user');
        const userNames = Array.from(new Set(logs.map(l => l.user))).sort();
        userSelect.innerHTML = '<option value="all">All Users</option>' + userNames.map(u => `<option value="${u}">${u}</option>`).join('');

        $('#audit-filter-type').innerHTML = '<option value="all">All — Activity Type</option>' + store.TYPES.map(t => `<option value="${t}">${t}</option>`).join('');
        $('#audit-filter-role').innerHTML = '<option value="all">All — Role</option>' + store.ROLES.map(r => `<option value="${r}">${r}</option>`).join('');
        $('#audit-filter-status').innerHTML = '<option value="all">All — Status</option>' + store.STATUSES.map(s => `<option value="${s}">${s}</option>`).join('');
        $('#audit-filter-location').innerHTML = '<option value="all">All — Location</option>' + store.LOCATIONS.map(l => `<option value="${l}">${l}</option>`).join('');
    }

    /* --- statistics ---------------------------------------------------------- */
    function updateStatistics() {
        $('#audit-stat-total').textContent = logs.length;
        $('#audit-stat-today').textContent = logs.filter(l => sameDay(parseTs(l.timestamp), NOW)).length;
        $('#audit-stat-sensitive').textContent = logs.filter(l => l.sensitive).length;
        $('#audit-stat-failed').textContent = logs.filter(l => l.status === 'Failed').length;
    }

    /* --- search / filter / sort -------------------------------------------- */
    function searchAuditLogs(list) {
        if (!state.query) return list;
        const q = state.query;
        return list.filter(l =>
            l.user.toLowerCase().includes(q) ||
            l.action.toLowerCase().includes(q) ||
            l.type.toLowerCase().includes(q) ||
            l.target.toLowerCase().includes(q) ||
            l.location.toLowerCase().includes(q)
        );
    }

    function inDateRange(l) {
        const ts = parseTs(l.timestamp);
        if (state.range === 'all') return true;
        if (state.range === 'today') return sameDay(ts, NOW);
        if (state.range === 'yesterday') {
            const y = new Date(NOW); y.setDate(y.getDate() - 1);
            return sameDay(ts, y);
        }
        if (state.range === '7d') return ts >= new Date(NOW.getTime() - 7 * 24 * 3600 * 1000);
        if (state.range === '30d') return ts >= new Date(NOW.getTime() - 30 * 24 * 3600 * 1000);
        if (state.range === 'custom') {
            if (state.customStart && ts < new Date(state.customStart + 'T00:00:00')) return false;
            if (state.customEnd && ts > new Date(state.customEnd + 'T23:59:59')) return false;
            return true;
        }
        return true;
    }

    function filterAuditLogs(list) {
        return list.filter(l => {
            if (state.user !== 'all' && l.user !== state.user) return false;
            if (state.type !== 'all' && l.type !== state.type) return false;
            if (state.role !== 'all' && l.role !== state.role) return false;
            if (state.status !== 'all' && l.status !== state.status) return false;
            if (state.location !== 'all' && l.location !== state.location) return false;
            if (!inDateRange(l)) return false;
            const a = state.adv;
            if (a.ip && l.ip.toLowerCase().indexOf(a.ip.toLowerCase()) === -1) return false;
            if (a.device && l.device.toLowerCase().indexOf(a.device.toLowerCase()) === -1) return false;
            if (a.browser && l.browser.toLowerCase().indexOf(a.browser.toLowerCase()) === -1) return false;
            if (a.os && l.os.toLowerCase().indexOf(a.os.toLowerCase()) === -1) return false;
            if (a.sessionId && l.sessionId.toLowerCase().indexOf(a.sessionId.toLowerCase()) === -1) return false;
            return true;
        });
    }

    function sortAuditLogs(list) {
        const dir = state.sortDir === 'asc' ? 1 : -1;
        const key = state.sortKey;
        return list.slice().sort((a, b) => {
            const av = a[key], bv = b[key];
            if (av < bv) return -1 * dir;
            if (av > bv) return 1 * dir;
            return 0;
        });
    }

    function visibleLogs() {
        let list = logs.slice();
        list = searchAuditLogs(list);
        list = filterAuditLogs(list);
        list = sortAuditLogs(list);
        return list;
    }

    /* --- render -------------------------------------------------------------- */
    function renderAuditLogs() {
        const list = visibleLogs();
        const totalPages = Math.max(1, Math.ceil(list.length / state.pageSize));
        state.page = Math.min(state.page, totalPages);
        const start = (state.page - 1) * state.pageSize;
        const pageItems = list.slice(start, start + state.pageSize);

        emptyState.hidden = list.length !== 0;
        tableWrap.hidden = list.length === 0;

        tbody.innerHTML = pageItems.map(l => `
            <tr data-id="${l.id}">
                <td class="mono audit-cell-nowrap">${formatDateTime(l.timestamp)}</td>
                <td>
                    <div class="audit-user-cell">
                        <span class="audit-avatar">${initials(l.user)}</span>
                        <div class="audit-cell-truncate">
                            <p class="font-medium text-on-surface audit-cell-truncate">${l.user}</p>
                            <p class="text-label-sm text-on-surface-variant">${l.role}</p>
                        </div>
                    </div>
                </td>
                <td class="audit-cell-truncate" title="${l.action}">${l.action}</td>
                <td class="audit-cell-nowrap">${l.type}</td>
                <td class="audit-cell-truncate" title="${l.target}">${l.target}</td>
                <td class="audit-cell-nowrap">${l.location}</td>
                <td>
                    <div class="audit-status-cell">
                        <span class="badge ${STATUS_BADGE[l.status] || ''}">${l.status}</span>
                        ${l.sensitive ? '<span class="sensitive-chip"><span class="material-symbols-outlined">gpp_maybe</span>Sensitive</span>' : ''}
                    </div>
                </td>
                <td style="text-align:right">
                    <button type="button" class="btn-secondary" data-action="view" style="padding:6px 12px">View</button>
                </td>
            </tr>`).join('');

        renderPagination(totalPages, list.length);
        updateStatistics();
    }

    function renderPagination(totalPages, totalItems) {
        if (totalPages <= 1) { pagination.innerHTML = ''; return; }
        let html = `<button type="button" data-page="${state.page - 1}" ${state.page === 1 ? 'disabled' : ''}>Prev</button>`;
        for (let p = 1; p <= totalPages; p++) {
            html += `<button type="button" data-page="${p}" aria-current="${p === state.page}">${p}</button>`;
        }
        html += `<button type="button" data-page="${state.page + 1}" ${state.page === totalPages ? 'disabled' : ''}>Next</button>`;
        pagination.innerHTML = html;
    }

    function renderSecurityActivity() {
        const items = store.buildSecurityActivity(logs);
        if (!items.length) {
            securityList.innerHTML = '<p class="text-on-surface-variant" style="padding:12px 0">No recent security activity.</p>';
            return;
        }
        securityList.innerHTML = items.map(it => `
            <div class="security-item">
                <span class="security-item__icon"><span class="material-symbols-outlined">${it.icon}</span></span>
                <div class="security-item__body">
                    <p class="security-item__label">${it.label}</p>
                    <p class="security-item__meta">${it.user} · ${formatDateTime(it.time)}</p>
                </div>
                <span class="badge ${STATUS_BADGE[it.status] || ''}">${it.status}</span>
            </div>`).join('');
    }

    /* --- details modal --------------------------------------------------------- */
    const detailsDialog = $('#audit-details-dialog');

    function findLog(id) { return logs.find(l => l.id === id); }

    function openActivityDetails(id) {
        const l = findLog(id);
        if (!l) return;

        $('#audit-detail-id').textContent = l.id;
        $('#audit-detail-time').textContent = formatDateTimeWithSeconds(l.timestamp);
        $('#audit-detail-user').innerHTML = `<span class="audit-avatar">${initials(l.user)}</span><div><p class="font-medium text-on-surface">${l.user}</p><p class="text-label-sm text-on-surface-variant">${l.role}</p></div>`;
        $('#audit-detail-action').textContent = l.action;
        $('#audit-detail-target').textContent = l.target;
        $('#audit-detail-location').textContent = l.location;
        $('#audit-detail-status').innerHTML = `<span class="badge ${STATUS_BADGE[l.status] || ''}">${l.status}</span>` + (l.sensitive ? ' <span class="sensitive-chip" style="margin-left:6px"><span class="material-symbols-outlined">gpp_maybe</span>Sensitive</span>' : '');
        $('#audit-detail-ip').textContent = l.ip;
        $('#audit-detail-device').textContent = `${l.device} · ${l.browser} · ${l.os}`;
        $('#audit-detail-notes').textContent = l.details;

        const timeline = store.buildTimeline(l);
        $('#audit-detail-timeline').innerHTML = timeline.map(step => `
            <div class="timeline-step">
                <p class="timeline-step__time">${step.time}</p>
                <p class="timeline-step__text">${step.text}</p>
            </div>`).join('');

        detailsDialog.showModal();
    }

    function closeActivityDetails() { detailsDialog.close(); }

    $('#btn-details-close').addEventListener('click', closeActivityDetails);
    detailsDialog.addEventListener('click', (e) => { if (e.target === detailsDialog) closeActivityDetails(); });

    tbody.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action="view"]');
        if (!btn) return;
        const row = btn.closest('tr[data-id]');
        openActivityDetails(row.dataset.id);
    });

    /* --- export -------------------------------------------------------------- */
    function exportAuditLogs(format) {
        const list = visibleLogs();
        if (format === 'csv') {
            const headers = ['Date & Time', 'User', 'Role', 'Activity', 'Type', 'Target', 'Location', 'Status'];
            const rows = list.map(l => [l.timestamp, l.user, l.role, l.action, l.type, l.target, l.location, l.status]);
            const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
            triggerDownload('audit_log.csv', csv, 'text/csv');
            showToast('Audit log file has been prepared for download');
        } else {
            showToast('Audit log file has been prepared for download');
        }
    }

    /* --- reset / loading ------------------------------------------------------- */
    function resetFilters() {
        state.query = ''; state.user = 'all'; state.type = 'all'; state.role = 'all';
        state.status = 'all'; state.location = 'all'; state.range = 'all';
        state.customStart = ''; state.customEnd = '';
        state.adv = { ip: '', device: '', browser: '', os: '', sessionId: '' };
        state.page = 1;

        $('#audit-search').value = '';
        $('#audit-filter-user').value = 'all';
        $('#audit-filter-type').value = 'all';
        $('#audit-filter-role').value = 'all';
        $('#audit-filter-status').value = 'all';
        $('#audit-filter-location').value = 'all';
        $('#audit-filter-range').value = 'all';
        $('#audit-custom-range').hidden = true;
        ['#audit-adv-ip', '#audit-adv-device', '#audit-adv-browser', '#audit-adv-os', '#audit-adv-session'].forEach(sel => { $(sel).value = ''; });

        renderAuditLogs();
        showToast('Filters have been reset');
    }

    function showLoading() {
        tableWrap.hidden = true;
        emptyState.hidden = true;
        skeleton.hidden = false;
        setTimeout(() => {
            skeleton.hidden = true;
            renderAuditLogs();
            showToast('Audit log refreshed');
        }, 600);
    }

    /* --- wiring ---------------------------------------------------------------- */
    $('#audit-search').addEventListener('input', (e) => { state.query = e.target.value.trim().toLowerCase(); state.page = 1; renderAuditLogs(); });
    $('#audit-filter-user').addEventListener('change', (e) => { state.user = e.target.value; state.page = 1; renderAuditLogs(); });
    $('#audit-filter-type').addEventListener('change', (e) => { state.type = e.target.value; state.page = 1; renderAuditLogs(); });
    $('#audit-filter-role').addEventListener('change', (e) => { state.role = e.target.value; state.page = 1; renderAuditLogs(); });
    $('#audit-filter-status').addEventListener('change', (e) => { state.status = e.target.value; state.page = 1; renderAuditLogs(); });
    $('#audit-filter-location').addEventListener('change', (e) => { state.location = e.target.value; state.page = 1; renderAuditLogs(); });
    $('#audit-filter-range').addEventListener('change', (e) => {
        state.range = e.target.value;
        $('#audit-custom-range').hidden = state.range !== 'custom';
        state.page = 1;
        renderAuditLogs();
    });
    $('#audit-range-start').addEventListener('change', (e) => { state.customStart = e.target.value; state.page = 1; renderAuditLogs(); });
    $('#audit-range-end').addEventListener('change', (e) => { state.customEnd = e.target.value; state.page = 1; renderAuditLogs(); });

    $('#btn-advanced-toggle').addEventListener('click', () => {
        const panel = $('#audit-advanced-panel');
        panel.hidden = !panel.hidden;
    });
    [['#audit-adv-ip', 'ip'], ['#audit-adv-device', 'device'], ['#audit-adv-browser', 'browser'], ['#audit-adv-os', 'os'], ['#audit-adv-session', 'sessionId']]
        .forEach(([sel, key]) => $(sel).addEventListener('input', (e) => { state.adv[key] = e.target.value.trim(); state.page = 1; renderAuditLogs(); }));

    $$('.dash-table th[data-sort]').forEach(th => th.addEventListener('click', () => {
        const column = th.dataset.sort;
        if (state.sortKey === column) state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
        else { state.sortKey = column; state.sortDir = 'asc'; }
        $$('.dash-table th[data-sort]').forEach(t => {
            if (t.dataset.sort === column) t.dataset.dir = state.sortDir;
            else t.removeAttribute('data-dir');
        });
        renderAuditLogs();
    }));

    pagination.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-page]');
        if (!btn || btn.disabled) return;
        state.page = Number(btn.dataset.page);
        renderAuditLogs();
    });

    $('#audit-rows-per-page').addEventListener('change', (e) => { state.pageSize = Number(e.target.value); state.page = 1; renderAuditLogs(); });

    $('#btn-reset-filters').addEventListener('click', resetFilters);
    $('#empty-reset-btn').addEventListener('click', resetFilters);
    $('#btn-refresh').addEventListener('click', showLoading);

    const exportMenu = $('#export-menu');
    $('#btn-export').addEventListener('click', (e) => { e.stopPropagation(); exportMenu.hidden = !exportMenu.hidden; });
    exportMenu.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-format]');
        if (!btn) return;
        exportAuditLogs(btn.dataset.format);
        exportMenu.hidden = true;
    });
    document.addEventListener('click', (e) => { if (!e.target.closest('.row-menu')) exportMenu.hidden = true; });

    /* --- init ------------------------------------------------------------ */
    populateFilters();
    renderAuditLogs();
    renderSecurityActivity();
})();
