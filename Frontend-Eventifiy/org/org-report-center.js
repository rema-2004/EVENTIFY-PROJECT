/* EVENTIFY — Organizer Reports (dedicated page)
   Create / search / filter / sort / paginate / preview / delete reports for
   this organization's own events. Mirrors admin/admin-reports.js's pattern,
   rescoped to org-only report types via window.OrgReportsData. */
(function () {
    const $ = (sel, root) => (root || document).querySelector(sel);
    const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
    const store = window.OrgReportsData;
    if (!store) return;

    let charts = {};

    function isDark() { return document.documentElement.classList.contains('dark'); }
    function ink(opacity) { return isDark() ? `rgba(245, 244, 241, ${opacity})` : `rgba(14, 17, 22, ${opacity})`; }

    function showToast(message, tone = 'success') {
        if (window.EventifyUI) window.EventifyUI.toast(message, tone);
    }

    function triggerDownload(filename, content, mimeType = 'text/plain') {
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

    /* --- state --------------------------------------------------------- */
    const PAGE_SIZE = 6;
    let orgReports = (store.organizationReports || []).slice();
    const state = { query: '', type: 'all', event: 'all', status: 'all', sortKey: 'date', sortDir: 'desc', page: 1 };
    const STATUS_BADGE = { Completed: 'reports-badge--live', Processing: 'reports-badge--pending', Failed: 'reports-badge--ended', Scheduled: 'reports-badge--upcoming' };

    const QUICK_CREATE = [
        { type: 'Event Performance', icon: 'trophy', title: 'Event Performance', desc: 'A detailed report on a single event or all of them.' },
        { type: 'Registration Report', icon: 'how_to_reg', title: 'Registration Report', desc: 'Analyze registrations and participation.' },
        { type: 'Participant Report', icon: 'group', title: 'Participant Report', desc: 'See who your audience is.' },
        { type: 'Engagement Report', icon: 'bolt', title: 'Engagement Report', desc: 'Views, saves, shares vs. registrations.' },
        { type: 'Overall Organization Report', icon: 'apartment', title: 'Organization Report', desc: 'A full summary across all your events.' }
    ];

    /* --- stat cards + quick create -------------------------------------- */
    function renderStatCards() {
        const total = orgReports.length;
        const thisMonth = orgReports.filter(r => r.date.startsWith('2026-09')).length;
        const completed = orgReports.filter(r => r.status === 'Completed').length;
        const scheduled = orgReports.filter(r => r.status === 'Scheduled').length;
        $('#org-stat-total').textContent = total;
        $('#org-stat-month').textContent = thisMonth;
        $('#org-stat-completed').textContent = completed;
        $('#org-stat-scheduled').textContent = scheduled;
    }

    function renderQuickCreate() {
        const grid = $('#org-quick-create-grid');
        if (!grid) return;
        grid.innerHTML = QUICK_CREATE.map(q => `
            <div class="reports-kpi-card" style="min-height:auto">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                    <span class="material-symbols-outlined text-[20px]">${q.icon}</span>
                </div>
                <h4 class="font-semibold text-sm text-on-surface mb-1">${q.title}</h4>
                <p class="text-xs text-on-surface-variant mb-3">${q.desc}</p>
                <button type="button" class="btn-quick-create btn-secondary w-full" data-type="${q.type}">Create</button>
            </div>`).join('');

        $$('.btn-quick-create', grid).forEach(btn => {
            btn.addEventListener('click', () => openCreateModal(btn.dataset.type));
        });
    }

    /* --- table rendering --------------------------------------------------- */
    function visibleReports() {
        let list = orgReports.filter(r => {
            const matchesQuery = !state.query || r.name.toLowerCase().includes(state.query) || r.type.toLowerCase().includes(state.query);
            const matchesType = state.type === 'all' || r.type === state.type;
            const matchesEvent = state.event === 'all' || r.event === state.event;
            const matchesStatus = state.status === 'all' || r.status === state.status;
            return matchesQuery && matchesType && matchesEvent && matchesStatus;
        });
        list.sort((a, b) => {
            const dir = state.sortDir === 'asc' ? 1 : -1;
            if (a[state.sortKey] < b[state.sortKey]) return -1 * dir;
            if (a[state.sortKey] > b[state.sortKey]) return 1 * dir;
            return 0;
        });
        return list;
    }

    function renderReports() {
        const tbody = $('#org-reports-tbody');
        const emptyState = $('#org-reports-empty');
        const tableWrap = $('#org-reports-table-wrap');
        const pagination = $('#org-reports-pagination');

        const list = visibleReports();
        const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
        state.page = Math.min(state.page, totalPages);
        const start = (state.page - 1) * PAGE_SIZE;
        const pageItems = list.slice(start, start + PAGE_SIZE);

        emptyState.hidden = list.length !== 0;
        tableWrap.hidden = list.length === 0;

        tbody.innerHTML = pageItems.map(r => `
            <tr data-id="${r.id}">
                <td class="font-medium text-on-surface">${r.name}</td>
                <td>${r.type}</td>
                <td>${r.event}</td>
                <td>${r.period}</td>
                <td class="mono">${r.date}</td>
                <td>${r.format}</td>
                <td><span class="reports-badge ${STATUS_BADGE[r.status] || ''}">${r.status}</span></td>
                <td style="text-align:right">
                    <div class="flex justify-end gap-1">
                        <button type="button" data-action="view" title="View" aria-label="View ${r.name}" style="padding:6px;border-radius:8px"><span class="material-symbols-outlined text-[18px]">visibility</span></button>
                        <button type="button" data-action="download" title="Download" aria-label="Download ${r.name}" style="padding:6px;border-radius:8px"><span class="material-symbols-outlined text-[18px]">download</span></button>
                        <button type="button" data-action="delete" title="Delete" aria-label="Delete ${r.name}" style="padding:6px;border-radius:8px"><span class="material-symbols-outlined text-[18px]">delete</span></button>
                    </div>
                </td>
            </tr>`).join('');

        renderPagination(totalPages, pagination);
        renderStatCards();
    }

    function renderPagination(totalPages, pagination) {
        if (!pagination) return;
        if (totalPages <= 1) { pagination.innerHTML = ''; return; }
        let html = `<button type="button" data-page="${state.page - 1}" ${state.page === 1 ? 'disabled' : ''}>Prev</button>`;
        for (let p = 1; p <= totalPages; p++) html += `<button type="button" data-page="${p}" aria-current="${p === state.page}">${p}</button>`;
        html += `<button type="button" data-page="${state.page + 1}" ${state.page === totalPages ? 'disabled' : ''}>Next</button>`;
        pagination.innerHTML = html;
    }

    function findReport(id) { return orgReports.find(r => r.id === id); }
    function nextId() {
        const nums = orgReports.map(r => parseInt(r.id.replace('ORPT-', ''), 10) || 0);
        return 'ORPT-' + String(Math.max(0, ...nums) + 1).padStart(3, '0');
    }

    function resetFilters() {
        state.query = ''; state.type = 'all'; state.event = 'all'; state.status = 'all'; state.page = 1;
        $('#org-report-search').value = '';
        $('#org-report-filter-type').value = 'all';
        $('#org-report-filter-event').value = 'all';
        $('#org-report-filter-status').value = 'all';
    }

    function createReport(formData) {
        const report = {
            id: nextId(),
            name: formData.name,
            type: formData.type,
            event: formData.event,
            period: formData.period,
            date: new Date().toISOString().slice(0, 10),
            format: formData.format,
            status: 'Completed'
        };
        orgReports.unshift(report);
        resetFilters();
        renderReports();
        showToast('Report created successfully');
        return report;
    }

    function deleteReport(id) {
        orgReports = orgReports.filter(r => r.id !== id);
        renderReports();
        showToast('Report deleted');
    }

    function reportCsv(report) {
        const content = store.buildOrgReportPreview(report.type, report.event);
        const rows = [content.table.headers, ...content.table.rows];
        return rows.map(r => r.join(',')).join('\n');
    }

    /* --- create modal --- */
    const createDialog = $('#create-org-report-dialog');
    function openCreateModal(prefillType) {
        $('#create-org-report-form').reset();
        if (prefillType) $('#org-new-report-type').value = prefillType;
        createDialog.showModal();
        $('#org-new-report-name').focus();
    }

    /* --- delete modal --- */
    const deleteDialog = $('#delete-org-report-dialog');
    let pendingDeleteId = null;
    function confirmDelete(id) {
        pendingDeleteId = id;
        const report = findReport(id);
        $('#delete-org-report-name').textContent = report ? report.name : '';
        deleteDialog.showModal();
    }

    /* --- preview modal --- */
    const previewDialog = $('#org-report-preview-dialog');
    let activePreviewReport = null;

    function openPreview(report) {
        activePreviewReport = report;
        const content = store.buildOrgReportPreview(report.type, report.event);

        $('#org-preview-name').textContent = report.name;
        $('#org-preview-meta').textContent = `${report.type} · ${report.event} · ${report.period} · Created ${report.date}`;
        $('#org-preview-summary').innerHTML = content.summary.map(s => `
            <div class="reports-kpi-card" style="min-height:auto;padding:14px 16px">
                <p class="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">${s.label}</p>
                <p class="text-xl font-extrabold text-on-surface mt-1">${s.value}</p>
            </div>`).join('');
        $('#org-preview-table-head').innerHTML = `<tr>${content.table.headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
        $('#org-preview-table-body').innerHTML = content.table.rows.map(row => `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');

        renderPreviewChart(content.chart);
        previewDialog.showModal();
    }

    function renderPreviewChart(chart) {
        if (charts.preview) charts.preview.destroy();
        const ctx = $('#org-preview-chart');
        if (!ctx || !window.Chart) return;
        const isDoughnut = chart.type === 'doughnut';
        charts.preview = new Chart(ctx, {
            type: chart.type,
            data: {
                labels: chart.labels,
                datasets: chart.datasets.map(d => Object.assign({
                    borderColor: '#FF4D2E',
                    backgroundColor: isDoughnut ? ['#FF4D2E', '#2A4FBE', '#1E7A4F', '#8A5A00'] : 'rgba(255,77,46,0.15)',
                    fill: !isDoughnut,
                    tension: 0.35,
                    borderRadius: chart.type === 'bar' ? 6 : 0
                }, d))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: isDoughnut, labels: { color: ink(0.7) } } },
                scales: isDoughnut ? {} : {
                    x: { ticks: { color: ink(0.55) }, grid: { display: false } },
                    y: { ticks: { color: ink(0.55) }, grid: { color: ink(0.06) }, beginAtZero: true }
                }
            }
        });
    }

    /* --- wiring --------------------------------------------------------- */
    function wire() {
        $('#org-report-search').addEventListener('input', (e) => { state.query = e.target.value.trim().toLowerCase(); state.page = 1; renderReports(); });
        $('#org-report-filter-type').addEventListener('change', (e) => { state.type = e.target.value; state.page = 1; renderReports(); });
        $('#org-report-filter-event').addEventListener('change', (e) => {
            const text = e.target.options[e.target.selectedIndex].text;
            state.event = text === 'All Events' ? 'all' : text;
            state.page = 1;
            renderReports();
        });
        $('#org-report-filter-status').addEventListener('change', (e) => { state.status = e.target.value; state.page = 1; renderReports(); });

        $$('.reports-table th[data-sort]').forEach(th => {
            th.addEventListener('click', () => {
                const key = th.dataset.sort;
                if (state.sortKey === key) state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
                else { state.sortKey = key; state.sortDir = 'asc'; }
                $$('.reports-table th[data-sort]').forEach(h => { if (h === th) h.dataset.dir = state.sortDir; else h.removeAttribute('data-dir'); });
                renderReports();
            });
        });

        $('#org-reports-pagination').addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-page]');
            if (!btn || btn.disabled) return;
            state.page = Number(btn.dataset.page);
            renderReports();
        });

        $('#org-reports-tbody').addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const id = btn.closest('tr[data-id]').dataset.id;
            const report = findReport(id);
            const action = btn.dataset.action;
            if (action === 'view') openPreview(report);
            else if (action === 'download') { triggerDownload(report.name.replace(/\s+/g, '_') + '.csv', reportCsv(report), 'text/csv'); showToast('Report ready for download'); }
            else if (action === 'delete') confirmDelete(id);
        });

        $('#btn-create-org-report').addEventListener('click', () => openCreateModal());
        $('#org-empty-create-btn').addEventListener('click', () => openCreateModal());
        $('#btn-create-org-report-cancel').addEventListener('click', () => createDialog.close());
        createDialog.addEventListener('click', (e) => { if (e.target === createDialog) createDialog.close(); });

        $('#create-org-report-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = $('#org-new-report-name').value.trim() || 'Untitled Report';
            const type = $('#org-new-report-type').value;
            const event = $('#org-new-report-event').value;
            const period = $('#org-new-report-period').value;
            const format = $('input[name="org-format"]:checked').value;
            const report = createReport({ name, type, event, period, format });
            createDialog.close();
            openPreview(report);
        });

        $('#btn-delete-org-report-cancel').addEventListener('click', () => deleteDialog.close());
        deleteDialog.addEventListener('click', (e) => { if (e.target === deleteDialog) deleteDialog.close(); });
        $('#btn-delete-org-report-confirm').addEventListener('click', () => { if (pendingDeleteId) deleteReport(pendingDeleteId); deleteDialog.close(); });

        $('#btn-org-preview-close').addEventListener('click', () => previewDialog.close());
        previewDialog.addEventListener('click', (e) => { if (e.target === previewDialog) previewDialog.close(); });

        $('#btn-org-download-csv').addEventListener('click', () => {
            if (!activePreviewReport) return;
            triggerDownload(activePreviewReport.name.replace(/\s+/g, '_') + '.csv', reportCsv(activePreviewReport), 'text/csv');
            showToast('Report file is ready');
        });
        ['#btn-org-download-pdf', '#btn-org-download-excel'].forEach(sel => {
            $(sel).addEventListener('click', () => showToast('Report file is ready'));
        });

        $('#btn-refresh-org-reports').addEventListener('click', () => {
            $('#org-reports-table-wrap').hidden = true;
            $('#org-reports-empty').hidden = true;
            $('#org-reports-skeleton').hidden = false;
            setTimeout(() => {
                $('#org-reports-skeleton').hidden = true;
                renderReports();
                showToast('Reports refreshed');
            }, 600);
        });

        new MutationObserver(() => { if (previewDialog.open) renderPreviewChart(store.buildOrgReportPreview(activePreviewReport.type, activePreviewReport.event)); })
            .observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    }

    document.addEventListener('DOMContentLoaded', () => {
        wire();
        renderQuickCreate();
        renderReports();
    });
})();
