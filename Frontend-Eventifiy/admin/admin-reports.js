/* Admin Reports page — rendering, filtering, sorting, pagination, CRUD (mock only). */
(function () {
    const PAGE_SIZE = 8;
    const store = window.AdminReportsPage;
    if (!store) return;

    let reports = store.reports.slice();
    let charts = {};
    const state = { query: '', type: 'all', status: 'all', sortKey: 'date', sortDir: 'desc', page: 1 };

    const $ = (sel, root) => (root || document).querySelector(sel);
    const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

    const tbody = $('#reports-tbody');
    const emptyState = $('#reports-empty');
    const tableWrap = $('#reports-table-wrap');
    const skeleton = $('#reports-skeleton');
    const pagination = $('#pagination');

    /* --- utilities --------------------------------------------------------- */
    function showToast(message, tone) {
        if (window.EventifyUI) window.EventifyUI.toast(message, tone || 'success');
    }

    function isDark() { return document.documentElement.classList.contains('dark'); }
    function ink(opacity) { return isDark() ? `rgba(245,244,241,${opacity})` : `rgba(14,17,22,${opacity})`; }

    const STATUS_BADGE = { Completed: 'badge--active', 'In Progress': 'badge--pending', Failed: 'badge--rejected', Scheduled: 'badge--upcoming' };

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

    /* --- statistics ---------------------------------------------------------- */
    function updateStatistics() {
        const total = reports.length;
        const thisMonth = reports.filter(r => r.date.startsWith('2026-09')).length;
        const completed = reports.filter(r => r.status === 'Completed').length;
        const scheduled = reports.filter(r => r.status === 'Scheduled').length;
        $('#stat-total').textContent = total;
        $('#stat-month').textContent = thisMonth;
        $('#stat-completed').textContent = completed;
        $('#stat-scheduled').textContent = scheduled;
    }

    /* --- derive visible list: search + filter + sort ------------------------ */
    function visibleReports() {
        let list = reports.filter(r => {
            const matchesQuery = !state.query || r.name.toLowerCase().includes(state.query) || r.type.toLowerCase().includes(state.query);
            const matchesType = state.type === 'all' || r.type === state.type;
            const matchesStatus = state.status === 'all' || r.status === state.status;
            return matchesQuery && matchesType && matchesStatus;
        });

        list.sort((a, b) => {
            const dir = state.sortDir === 'asc' ? 1 : -1;
            const av = a[state.sortKey];
            const bv = b[state.sortKey];
            if (av < bv) return -1 * dir;
            if (av > bv) return 1 * dir;
            return 0;
        });

        return list;
    }

    /* --- render ---------------------------------------------------------- */
    function renderReports() {
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
                <td>${r.period}</td>
                <td>${r.createdBy}</td>
                <td class="mono">${r.date}</td>
                <td>${r.format}</td>
                <td><span class="badge ${STATUS_BADGE[r.status] || ''}">${r.status}</span></td>
                <td>
                    <div class="row-actions" style="position:relative">
                        <button type="button" data-action="view" aria-label="View ${r.name}"><span class="material-symbols-outlined" style="font-size:18px">visibility</span></button>
                        <button type="button" data-action="download" aria-label="Download ${r.name}"><span class="material-symbols-outlined" style="font-size:18px">download</span></button>
                        <button type="button" data-action="delete" aria-label="Delete ${r.name}"><span class="material-symbols-outlined" style="font-size:18px">delete</span></button>
                        <div class="row-menu">
                            <button type="button" data-action="more" aria-label="More actions for ${r.name}"><span class="material-symbols-outlined" style="font-size:18px">more_vert</span></button>
                            <div class="row-menu__panel" hidden>
                                <button type="button" data-action="duplicate">Duplicate</button>
                                <button type="button" data-action="rename">Rename</button>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>`).join('');

        renderPagination(totalPages);
        updateStatistics();
    }

    function renderPagination(totalPages) {
        if (totalPages <= 1) { pagination.innerHTML = ''; return; }
        let html = `<button type="button" data-page="${state.page - 1}" ${state.page === 1 ? 'disabled' : ''}>Prev</button>`;
        for (let p = 1; p <= totalPages; p++) {
            html += `<button type="button" data-page="${p}" aria-current="${p === state.page}">${p}</button>`;
        }
        html += `<button type="button" data-page="${state.page + 1}" ${state.page === totalPages ? 'disabled' : ''}>Next</button>`;
        pagination.innerHTML = html;
    }

    /* --- search / filter / sort / paginate -------------------------------- */
    function searchReports(query) {
        state.query = query.trim().toLowerCase();
        state.page = 1;
        renderReports();
    }

    function filterReports() {
        state.type = $('#filter-type').value;
        state.status = $('#filter-status').value;
        state.page = 1;
        renderReports();
    }

    function sortReports(column) {
        if (state.sortKey === column) {
            state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
            state.sortKey = column;
            state.sortDir = 'asc';
        }
        $$('.dash-table th[data-sort]').forEach(th => {
            if (th.dataset.sort === column) th.dataset.dir = state.sortDir;
            else th.removeAttribute('data-dir');
        });
        renderReports();
    }

    function paginateReports(page) {
        state.page = page;
        renderReports();
    }

    /* --- CRUD -------------------------------------------------------------- */
    function findReport(id) { return reports.find(r => r.id === id); }

    function nextId() {
        const nums = reports.map(r => parseInt(r.id.replace('RPT-', ''), 10));
        return 'RPT-' + String(Math.max(...nums) + 1).padStart(3, '0');
    }

    function createReport(formData) {
        const report = {
            id: nextId(),
            name: formData.name,
            type: formData.type,
            period: formData.periodLabel,
            createdBy: 'Platform Admin',
            date: new Date().toISOString().slice(0, 10),
            format: formData.format,
            status: 'Completed'
        };
        reports.unshift(report);
        resetFiltersForNewReport();
        renderReports();
        showToast('Report created successfully');
        return report;
    }

    function resetFiltersForNewReport() {
        state.query = '';
        state.type = 'all';
        state.status = 'all';
        state.page = 1;
        $('#report-search').value = '';
        $('#filter-type').value = 'all';
        $('#filter-status').value = 'all';
    }

    function deleteReport(id) {
        reports = reports.filter(r => r.id !== id);
        renderReports();
        showToast('Report deleted');
    }

    function duplicateReport(id) {
        const source = findReport(id);
        if (!source) return;
        const copy = Object.assign({}, source, { id: nextId(), name: source.name + ' (Copy)', date: new Date().toISOString().slice(0, 10) });
        reports.unshift(copy);
        renderReports();
        showToast('Report duplicated');
    }

    function renameReport(id, newName) {
        const report = findReport(id);
        if (!report || !newName.trim()) return;
        report.name = newName.trim();
        renderReports();
        showToast('Report renamed');
    }

    /* --- create report modal ------------------------------------------------ */
    const createDialog = $('#create-report-dialog');
    const nameInput = $('#new-report-name');
    const typeSelect = $('#new-report-type');
    const customRange = $('#custom-date-range');

    function openCreateReportModal(prefillType) {
        $('#create-report-form').reset();
        customRange.hidden = true;
        if (prefillType) {
            typeSelect.value = prefillType;
            nameInput.value = prefillType + ' Report';
        }
        createDialog.showModal();
        nameInput.focus();
    }

    $('#period-select').addEventListener('change', (e) => {
        customRange.hidden = e.target.value !== 'custom';
    });

    $('#btn-create-cancel').addEventListener('click', () => createDialog.close());
    createDialog.addEventListener('click', (e) => { if (e.target === createDialog) createDialog.close(); });

    $('#create-report-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const periodSelect = $('#period-select');
        const periodLabel = periodSelect.options[periodSelect.selectedIndex].text;
        const format = $('input[name="format"]:checked').value;
        const name = nameInput.value.trim() || (typeSelect.value + ' Report');

        const report = createReport({ name, type: typeSelect.value, periodLabel, format });
        createDialog.close();
        openReportPreview(report);
    });

    /* --- delete confirm modal ------------------------------------------------ */
    const deleteDialog = $('#delete-report-dialog');
    let pendingDeleteId = null;

    function confirmDelete(id) {
        pendingDeleteId = id;
        const report = findReport(id);
        $('#delete-report-name').textContent = report ? report.name : '';
        deleteDialog.showModal();
    }

    $('#btn-delete-cancel').addEventListener('click', () => deleteDialog.close());
    deleteDialog.addEventListener('click', (e) => { if (e.target === deleteDialog) deleteDialog.close(); });
    $('#btn-delete-confirm').addEventListener('click', () => {
        if (pendingDeleteId) deleteReport(pendingDeleteId);
        deleteDialog.close();
    });

    /* --- preview modal ------------------------------------------------------- */
    const previewDialog = $('#report-preview-dialog');
    let activePreviewReport = null;

    function openReportPreview(report) {
        activePreviewReport = report;
        const content = store.buildPreview(report.type, report.period);

        $('#preview-name').textContent = report.name;
        $('#preview-meta').textContent = `${report.type} · ${report.period} · Created ${report.date}`;

        $('#preview-summary').innerHTML = content.summary.map(s => `
            <div class="stat-card">
                <p class="stat-card__label">${s.label}</p>
                <p class="stat-card__value">${s.value}</p>
            </div>`).join('');

        const theadRow = content.table.headers.map(h => `<th>${h}</th>`).join('');
        $('#preview-table-head').innerHTML = `<tr>${theadRow}</tr>`;
        $('#preview-table-body').innerHTML = content.table.rows.map(row => `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');

        renderPreviewChart(content.chart);
        previewDialog.showModal();
    }

    function renderPreviewChart(chart) {
        if (charts.preview) { charts.preview.destroy(); }
        const ctx = $('#preview-chart');
        if (!ctx || !window.Chart) return;
        const isDoughnut = chart.type === 'doughnut';
        charts.preview = new Chart(ctx, {
            type: chart.type,
            data: {
                labels: chart.labels,
                datasets: chart.datasets.map((d, i) => Object.assign({
                    borderColor: '#FF4D2E',
                    backgroundColor: isDoughnut ? ['#FF4D2E', '#2A4FBE', '#1E7A4F', '#8A5A00'] : 'rgba(255,77,46,0.15)',
                    fill: !isDoughnut,
                    tension: 0.35
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

    $('#btn-preview-close').addEventListener('click', () => previewDialog.close());
    previewDialog.addEventListener('click', (e) => { if (e.target === previewDialog) previewDialog.close(); });

    $('#btn-download-csv').addEventListener('click', () => {
        if (!activePreviewReport) return;
        const content = store.buildPreview(activePreviewReport.type, activePreviewReport.period);
        const rows = [content.table.headers, ...content.table.rows];
        const csv = rows.map(r => r.join(',')).join('\n');
        triggerDownload(activePreviewReport.name.replace(/\s+/g, '_') + '.csv', csv, 'text/csv');
        showToast('Report file is ready');
    });

    ['#btn-download-pdf', '#btn-download-excel'].forEach(sel => {
        $(sel).addEventListener('click', () => showToast('Report file is ready'));
    });

    /* --- table row actions (event delegation) -------------------------------- */
    tbody.addEventListener('click', (e) => {
        const menuBtn = e.target.closest('[data-action="more"]');
        if (menuBtn) {
            const panel = menuBtn.parentElement.querySelector('.row-menu__panel');
            $$('.row-menu__panel').forEach(p => { if (p !== panel) p.hidden = true; });
            panel.hidden = !panel.hidden;
            return;
        }

        const actionBtn = e.target.closest('[data-action]');
        if (!actionBtn) return;
        const row = actionBtn.closest('tr[data-id]');
        const id = row.dataset.id;
        const report = findReport(id);
        const action = actionBtn.dataset.action;

        if (action === 'view') openReportPreview(report);
        else if (action === 'download') {
            const content = store.buildPreview(report.type, report.period);
            const rows = [content.table.headers, ...content.table.rows];
            triggerDownload(report.name.replace(/\s+/g, '_') + '.csv', rows.map(r => r.join(',')).join('\n'), 'text/csv');
            showToast('Report ready for download');
        }
        else if (action === 'delete') confirmDelete(id);
        else if (action === 'duplicate') duplicateReport(id);
        else if (action === 'rename') {
            const name = window.prompt('New report name:', report.name);
            if (name !== null) renameReport(id, name);
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.row-menu')) $$('.row-menu__panel').forEach(p => p.hidden = true);
    });

    /* --- header wiring ------------------------------------------------------- */
    $('#report-search').addEventListener('input', (e) => searchReports(e.target.value));
    $('#btn-apply-filters').addEventListener('click', filterReports);
    $('#btn-create-report').addEventListener('click', () => openCreateReportModal());
    $$('.btn-quick-create').forEach(btn => btn.addEventListener('click', () => openCreateReportModal(btn.dataset.type)));

    $$('.dash-table th[data-sort]').forEach(th => th.addEventListener('click', () => sortReports(th.dataset.sort)));

    pagination.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-page]');
        if (!btn || btn.disabled) return;
        paginateReports(Number(btn.dataset.page));
    });

    $('#btn-refresh').addEventListener('click', () => {
        tableWrap.hidden = true;
        emptyState.hidden = true;
        skeleton.hidden = false;
        setTimeout(() => {
            skeleton.hidden = true;
            renderReports();
            showToast('Reports refreshed');
        }, 600);
    });

    $('#empty-create-btn').addEventListener('click', () => openCreateReportModal());

    /* --- init ------------------------------------------------------------ */
    renderReports();
})();
