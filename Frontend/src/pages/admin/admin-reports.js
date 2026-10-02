/* Admin Reports page — rendering, filtering, sorting, pagination, CRUD (mock only). */
import Chart from 'chart.js/auto'
import { downloadReport } from '../../utils/reportDownload'

export function initAdminReports() {
    const eventController = new AbortController();
    const listen = (target, type, handler) => target?.addEventListener(type, handler, { signal: eventController.signal });
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

    function exportReport(report, format) {
        const content = store.buildPreview(report.type, report.period);
        downloadReport({
            name: report.name,
            format: format || report.format,
            meta: [report.type, report.period, 'Created ' + report.date].join(' - '),
            summary: content.summary,
            headers: content.table.headers,
            rows: content.table.rows
        });
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
                        <button type="button" data-action="rename" title="Rename" aria-label="Rename ${r.name}"><span class="material-symbols-outlined" style="font-size:18px">edit</span></button>
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
        if (customRange) {
            customRange.hidden = true;
            customRange.style.display = 'none';
        }
        if (prefillType) {
            typeSelect.value = prefillType;
            nameInput.value = prefillType + ' Report';
        }
        createDialog.showModal();
        nameInput.focus();
    }

    listen($('#period-select'), 'change', (e) => {
        const isCustom = e.target.value === 'custom';
        if (customRange) {
            customRange.hidden = !isCustom;
            customRange.style.display = isCustom ? 'grid' : 'none';
        }
    });

    listen($('#btn-create-cancel'), 'click', () => createDialog.close());
    listen(createDialog, 'click', (e) => { if (e.target === createDialog) createDialog.close(); });

    listen($('#create-report-form'), 'submit', (e) => {
        e.preventDefault();
        const periodSelect = $('#period-select');
        let periodLabel = periodSelect.options[periodSelect.selectedIndex].text;
        if (periodSelect.value === 'custom') {
            const start = $('#custom-start')?.value;
            const end = $('#custom-end')?.value;
            if (start && end) {
                periodLabel = `${start} - ${end}`;
            } else if (start) {
                periodLabel = `From ${start}`;
            } else if (end) {
                periodLabel = `Until ${end}`;
            }
        }
        const format = $('input[name="format"]:checked')?.value || 'PDF';
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

    listen($('#btn-delete-cancel'), 'click', () => deleteDialog.close());
    listen(deleteDialog, 'click', (e) => { if (e.target === deleteDialog) deleteDialog.close(); });
    listen($('#btn-delete-confirm'), 'click', () => {
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
        if (!ctx) return;
        const isDoughnut = chart.type === 'doughnut';
        charts.preview = new Chart(ctx, {
            type: chart.type,
            data: {
                labels: chart.labels,
                datasets: chart.datasets.map((d) => Object.assign({
                    borderColor: '#FF4D2E',
                    backgroundColor: isDoughnut ? ['#FF4D2E', '#0E1116', '#1D4ED8', '#1E7A4F'] : 'rgba(255,77,46,0.15)',
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

    listen($('#btn-preview-close'), 'click', () => previewDialog.close());
    listen(previewDialog, 'click', (e) => { if (e.target === previewDialog) previewDialog.close(); });

    [['#btn-download-csv', 'CSV'], ['#btn-download-excel', 'Excel'], ['#btn-download-pdf', 'PDF']].forEach(([selector, format]) => {
        listen($(selector), 'click', () => {
            if (!activePreviewReport) return;
            exportReport(activePreviewReport, format);
            showToast('Report file is ready');
        });
    });

    /* --- table row actions (event delegation) -------------------------------- */
    listen(tbody, 'click', (e) => {
        const actionBtn = e.target.closest('[data-action]');
        if (!actionBtn) return;
        const row = actionBtn.closest('tr[data-id]');
        const id = row.dataset.id;
        const report = findReport(id);
        const action = actionBtn.dataset.action;

        if (action === 'view') openReportPreview(report);
        else if (action === 'download') {
            exportReport(report);
            showToast('Report ready for download');
        }
        else if (action === 'delete') confirmDelete(id);
        else if (action === 'rename') {
            const name = window.prompt('New report name:', report.name);
            if (name !== null) renameReport(id, name);
        }
    });

    /* --- header wiring ------------------------------------------------------- */
    listen($('#report-search'), 'input', (e) => searchReports(e.target.value));
    listen($('#btn-apply-filters'), 'click', filterReports);
    listen($('#btn-create-report'), 'click', () => openCreateReportModal());
    $$('.btn-quick-create').forEach(btn => listen(btn, 'click', () => openCreateReportModal(btn.dataset.type)));

    $$('.dash-table th[data-sort]').forEach(th => listen(th, 'click', () => sortReports(th.dataset.sort)));

    listen(document, 'click', (e) => {
        const btn = e.target.closest('#pagination button[data-page]');
        if (!btn || btn.disabled) return;
        paginateReports(Number(btn.dataset.page));
    });

    listen($('#btn-refresh'), 'click', () => {
        tableWrap.hidden = true;
        emptyState.hidden = true;
        skeleton.hidden = false;
        setTimeout(() => {
            skeleton.hidden = true;
            renderReports();
            showToast('Reports refreshed');
        }, 600);
    });

    listen($('#empty-create-btn'), 'click', () => openCreateReportModal());

    /* --- init ------------------------------------------------------------ */
    renderReports();
    return () => {
        eventController.abort();
        Object.values(charts).forEach(chart => chart.destroy());
    };
}