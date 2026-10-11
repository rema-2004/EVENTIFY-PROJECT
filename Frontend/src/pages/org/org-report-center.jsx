import { useState, useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import { Link } from 'react-router-dom'
import AppPageHead from '../../components/app/AppPageHead'
import { toast } from '../../utils/toast.js'
import { downloadReport } from '../../utils/reportDownload.js'
import { useOrgPageControls } from './useOrgPageControls.js'
import { useMotion } from '../../hooks/useMotion'
import LangToggleBtn from '../../components/org/LangToggleBtn'
import '../../styles/org/sidebar.css'
import OrgSidebar, { OrgMobileHeader } from '../../components/org/OrgSidebar'
import '../../styles/admin/admin.css'
import '../../styles/org/org-dashboard.css'
import '../../styles/org/org-reports.css'

const PAGE_SIZE = 6

const SEED_REPORTS = [
    { id: 'ORPT-001', name: 'Global AI Challenge — Performance', type: 'Event Performance', event: 'Global AI Innovation Challenge', period: 'Sep 2026', date: '2026-09-04', format: 'PDF', status: 'Completed' },
    { id: 'ORPT-002', name: 'Monthly Registration Summary', type: 'Registration Report', event: 'All Events', period: 'Sep 2026', date: '2026-09-04', format: 'CSV', status: 'Completed' },
    { id: 'ORPT-003', name: 'Applicant Demographics — Q3', type: 'Participant Report', event: 'All Events', period: '3 Months', date: '2026-09-03', format: 'PDF', status: 'Completed' },
    { id: 'ORPT-004', name: 'Frontend Wizards — Engagement', type: 'Engagement Report', event: 'Frontend Wizards', period: 'Aug 2026', date: '2026-09-02', format: 'Excel', status: 'Completed' },
    { id: 'ORPT-005', name: 'Overall Organization Report — August', type: 'Overall Organization Report', event: 'All Events', period: 'Aug 2026', date: '2026-09-01', format: 'PDF', status: 'Completed' },
    { id: 'ORPT-006', name: 'Startup Challenge — Performance', type: 'Event Performance', event: 'Startup Challenge', period: 'Sep 2026', date: '2026-08-30', format: 'PDF', status: 'Scheduled' },
    { id: 'ORPT-007', name: 'DevOps Masterclass — Registrations', type: 'Registration Report', event: 'DevOps Masterclass', period: 'Sep 2026', date: '2026-08-29', format: 'CSV', status: 'Processing' },
    { id: 'ORPT-008', name: 'Cloud Native Bootcamp — Performance', type: 'Event Performance', event: 'Cloud Native Bootcamp', period: 'Aug 2026', date: '2026-08-27', format: 'PDF', status: 'Completed' },
    { id: 'ORPT-009', name: 'Participant Skills Report', type: 'Participant Report', event: 'All Events', period: 'This Year', date: '2026-08-24', format: 'Excel', status: 'Completed' },
    { id: 'ORPT-010', name: 'Global AI Challenge — Engagement', type: 'Engagement Report', event: 'Global AI Innovation Challenge', period: 'Sep 2026', date: '2026-08-22', format: 'CSV', status: 'Completed' },
    { id: 'ORPT-011', name: 'Weekly Registration Pulse', type: 'Registration Report', event: 'All Events', period: 'This Week', date: '2026-08-20', format: 'CSV', status: 'Failed' },
    { id: 'ORPT-012', name: 'Frontend Wizards — Performance', type: 'Event Performance', event: 'Frontend Wizards', period: 'Aug 2026', date: '2026-08-18', format: 'PDF', status: 'Completed' },
    { id: 'ORPT-013', name: 'Overall Organization Report — July', type: 'Overall Organization Report', event: 'All Events', period: 'Jul 2026', date: '2026-08-01', format: 'PDF', status: 'Completed' },
    { id: 'ORPT-014', name: 'Startup Challenge — Engagement', type: 'Engagement Report', event: 'Startup Challenge', period: 'Aug 2026', date: '2026-07-28', format: 'Excel', status: 'Completed' },
    { id: 'ORPT-015', name: 'Applicant Location Breakdown', type: 'Participant Report', event: 'All Events', period: 'This Year', date: '2026-07-20', format: 'CSV', status: 'Completed' },
]

const QUICK_CREATE = [
    { type: 'Event Performance', icon: 'trophy', title: 'Event Performance', desc: 'A detailed report on a single event or all of them.' },
    { type: 'Registration Report', icon: 'how_to_reg', title: 'Registration Report', desc: 'Analyze registrations and participation.' },
    { type: 'Participant Report', icon: 'group', title: 'Participant Report', desc: 'See who your audience is.' },
    { type: 'Engagement Report', icon: 'bolt', title: 'Engagement Report', desc: 'Views, saves, shares vs. registrations.' },
    { type: 'Overall Organization Report', icon: 'apartment', title: 'Organization Report', desc: 'A full summary across all your events.' },
]

const STATUS_BADGE = {
    Completed: 'reports-badge--live',
    Processing: 'reports-badge--pending',
    Failed: 'reports-badge--ended',
    Scheduled: 'reports-badge--upcoming',
}

const DETAILED_EVENTS = [
    { name: 'Global AI Innovation Challenge', views: 6420, applicants: 98, approved: 82, pending: 16, acceptanceRate: '83.6%', rating: 4.9 },
    { name: 'Frontend Wizards', views: 5890, applicants: 150, approved: 140, pending: 0, acceptanceRate: '93.3%', rating: 4.7 },
    { name: 'Startup Challenge', views: 3100, applicants: 84, approved: 61, pending: 23, acceptanceRate: '72.6%', rating: 4.8 },
    { name: 'DevOps Masterclass', views: 2450, applicants: 72, approved: 55, pending: 17, acceptanceRate: '76.4%', rating: 4.6 },
    { name: 'Cloud Native Bootcamp', views: 1980, applicants: 42, approved: 38, pending: 0, acceptanceRate: '90.5%', rating: 4.8 },
]
const DOMAINS = [{ label: 'Technology', count: 152 }, { label: 'Engineering', count: 98 }, { label: 'Data Science', count: 88 }, { label: 'Business', count: 61 }, { label: 'Design', count: 47 }]
const LOCATIONS = [{ label: 'Amman', count: 210 }, { label: 'Irbid', count: 96 }, { label: 'Zarqa', count: 68 }, { label: 'Aqaba', count: 42 }, { label: 'Karak', count: 30 }]

function buildPreview(type, eventName) {
    const scoped = eventName && eventName !== 'All Events' ? DETAILED_EVENTS.filter(e => e.name === eventName) : DETAILED_EVENTS
    const totalViews = scoped.reduce((s, e) => s + e.views, 0)
    const totalApplicants = scoped.reduce((s, e) => s + e.applicants, 0)
    const totalApproved = scoped.reduce((s, e) => s + e.approved, 0)
    const avgAcceptance = scoped.length ? Math.round(scoped.reduce((s, e) => s + parseFloat(e.acceptanceRate), 0) / scoped.length) : 0
    const isSingle = scoped.length === 1
    switch (type) {
        case 'Registration Report': {
            const accepted = scoped.reduce((s, e) => s + e.approved, 0)
            const pending = scoped.reduce((s, e) => s + e.pending, 0)
            const rejected = totalApplicants - accepted - pending
            return {
                summary: [{ label: 'Total Registrations', value: totalApplicants.toLocaleString() }, { label: 'Accepted', value: accepted.toLocaleString() }, { label: 'Pending', value: pending.toLocaleString() }, { label: 'Rejected', value: Math.max(0, rejected).toLocaleString() }],
                chart: { type: 'doughnut', labels: ['Accepted', 'Pending', 'Rejected'], datasets: [{ data: [accepted, pending, Math.max(0, rejected)] }] },
                table: { headers: ['Event', 'Registrations', 'Approved', 'Pending'], rows: scoped.map(e => [e.name, e.applicants, e.approved, e.pending]) },
            }
        }
        case 'Participant Report':
            return {
                summary: [{ label: 'Total Participants', value: totalApplicants.toLocaleString() }, { label: 'Top Domain', value: DOMAINS[0].label }, { label: 'Top Location', value: LOCATIONS[0].label }, { label: 'University Students', value: '44%' }],
                chart: { type: 'doughnut', labels: DOMAINS.map(d => d.label), datasets: [{ data: DOMAINS.map(d => d.count) }] },
                table: { headers: ['Location', 'Participants'], rows: LOCATIONS.map(l => [l.label, l.count]) },
            }
        case 'Engagement Report': {
            const eViews = scoped.reduce((s, e) => s + e.views, 0)
            const eRegs = scoped.reduce((s, e) => s + e.applicants, 0)
            const eSaves = Math.round(eViews * 0.175)
            const eShares = Math.round(eViews * 0.04)
            return {
                summary: [{ label: 'Views', value: eViews.toLocaleString() }, { label: 'Saves', value: eSaves.toLocaleString() }, { label: 'Shares', value: eShares.toLocaleString() }, { label: 'Registrations', value: eRegs.toLocaleString() }],
                chart: { type: 'bar', labels: ['Views', 'Saves', 'Shares', 'Registrations'], datasets: [{ label: 'Engagement', data: [eViews, eSaves, eShares, eRegs] }] },
                table: { headers: ['Event', 'Views', 'Saves', 'Registrations'], rows: scoped.map(e => [e.name, e.views, Math.round(e.views * 0.175), e.applicants]) },
            }
        }
        case 'Overall Organization Report':
            return {
                summary: [{ label: 'Total Events', value: DETAILED_EVENTS.length }, { label: 'Total Views', value: totalViews.toLocaleString() }, { label: 'Total Registrations', value: totalApplicants.toLocaleString() }, { label: 'Avg Acceptance Rate', value: avgAcceptance + '%' }],
                chart: { type: 'line', labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], datasets: [{ label: 'Applications', data: [68, 89, 94, 95] }] },
                table: { headers: ['Event', 'Views', 'Applicants', 'Acceptance'], rows: DETAILED_EVENTS.map(e => [e.name, e.views, e.applicants, e.acceptanceRate]) },
            }
        default:
            if (isSingle) {
                const e = scoped[0]
                return {
                    summary: [{ label: 'Views', value: e.views.toLocaleString() }, { label: 'Registrations', value: e.applicants.toLocaleString() }, { label: 'Accepted', value: e.approved.toLocaleString() }, { label: 'Acceptance Rate', value: e.acceptanceRate }],
                    chart: { type: 'bar', labels: ['Views', 'Registrations', 'Accepted'], datasets: [{ label: e.name, data: [e.views, e.applicants, e.approved] }] },
                    table: { headers: ['Event', 'Views', 'Registrations', 'Accepted', 'Rating'], rows: [[e.name, e.views, e.applicants, e.approved, e.rating]] },
                }
            }
            return {
                summary: [{ label: 'Views', value: totalViews.toLocaleString() }, { label: 'Registrations', value: totalApplicants.toLocaleString() }, { label: 'Accepted', value: totalApproved.toLocaleString() }, { label: 'Acceptance Rate', value: avgAcceptance + '%' }],
                chart: { type: 'bar', labels: scoped.map(e => e.name), datasets: [{ label: 'Registrations', data: scoped.map(e => e.applicants) }] },
                table: { headers: ['Event', 'Views', 'Registrations', 'Accepted', 'Rating'], rows: scoped.map(e => [e.name, e.views, e.applicants, e.approved, e.rating]) },
            }
    }
}

function nextId(reports) {
    const nums = reports.map(r => parseInt(r.id.replace('ORPT-', ''), 10) || 0)
    return 'ORPT-' + String(Math.max(0, ...nums) + 1).padStart(3, '0')
}

// Downloads the report in its own format (PDF / CSV / Excel), or `formatOverride`.
function exportReport(report, formatOverride) {
    const content = buildPreview(report.type, report.event)
    downloadReport({
        name: report.name,
        format: formatOverride || report.format,
        meta: [report.type, report.event, report.period, `Created ${report.date}`].join(' - '),
        summary: content.summary,
        headers: content.table.headers,
        rows: content.table.rows,
    })
}

function SortArrow({ dir }) {
    return <span className="sort-arrow" data-dir={dir} />
}

export default function OrgReportCenter() {
    useOrgPageControls({ mobileNavigation: false })
    useMotion([])

    const [reports, setReports] = useState(SEED_REPORTS)
    const [search, setSearch] = useState('')
    const [filterType, setFilterType] = useState('all')
    const [filterEvent, setFilterEvent] = useState('all')
    const [filterStatus, setFilterStatus] = useState('all')
    const [sortKey, setSortKey] = useState('date')
    const [sortDir, setSortDir] = useState('desc')
    const [page, setPage] = useState(1)
    const [refreshing, setRefreshing] = useState(false)

    const [createModal, setCreateModal] = useState({ open: false })
    const [createForm, setCreateForm] = useState({ name: '', type: 'Event Performance', event: 'All Events', period: 'This Month', format: 'PDF' })
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' })
    const [previewModal, setPreviewModal] = useState({ open: false, report: null })

    const chartRef = useRef(null)
    const chartInstance = useRef(null)

    const kpi = {
        total: reports.length,
        thisMonth: reports.filter(r => r.date.startsWith('2026-09')).length,
        completed: reports.filter(r => r.status === 'Completed').length,
        scheduled: reports.filter(r => r.status === 'Scheduled').length,
    }

    const q = search.toLowerCase()
    const filtered = reports.filter(r => {
        if (q && !r.name.toLowerCase().includes(q) && !r.type.toLowerCase().includes(q)) return false
        if (filterType !== 'all' && r.type !== filterType) return false
        if (filterEvent !== 'all' && r.event !== filterEvent) return false
        if (filterStatus !== 'all' && r.status !== filterStatus) return false
        return true
    }).sort((a, b) => {
        const dir = sortDir === 'asc' ? 1 : -1
        if (a[sortKey] < b[sortKey]) return -1 * dir
        if (a[sortKey] > b[sortKey]) return 1 * dir
        return 0
    })

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const currentPage = Math.min(page, totalPages)
    const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

    function handleSort(key) {
        if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        else { setSortKey(key); setSortDir('asc') }
        setPage(1)
    }

    function handleRefresh() {
        setRefreshing(true)
        setTimeout(() => { setRefreshing(false); toast('Reports refreshed') }, 600)
    }

    function openCreateModal(prefillType) {
        setCreateForm({ name: '', type: prefillType || 'Event Performance', event: 'All Events', period: 'This Month', format: 'PDF' })
        setCreateModal({ open: true })
    }

    function handleCreate(e) {
        e.preventDefault()
        const { name, type, event, period, format, customStart, customEnd } = createForm
        let periodLabel = period
        if (period === 'Custom') {
            if (customStart && customEnd) periodLabel = `${customStart} - ${customEnd}`
            else if (customStart) periodLabel = `From ${customStart}`
            else if (customEnd) periodLabel = `Until ${customEnd}`
        }
        const newReport = {
            id: nextId(reports),
            name: name.trim() || 'Untitled Report',
            type, event, period: periodLabel,
            date: new Date().toISOString().slice(0, 10),
            format,
            status: 'Completed',
        }
        setReports(prev => [newReport, ...prev])
        setSearch(''); setFilterType('all'); setFilterEvent('all'); setFilterStatus('all'); setPage(1)
        setCreateModal({ open: false })
        toast('Report created successfully')
        setPreviewModal({ open: true, report: newReport })
    }

    function handleRename(id) {
        const src = reports.find(r => r.id === id)
        if (!src) return
        const name = window.prompt('Rename report', src.name)
        if (name === null || !name.trim()) return
        setReports(prev => prev.map(r => (r.id === id ? { ...r, name: name.trim() } : r)))
        toast('Report renamed')
    }

    function handleDelete() {
        setReports(prev => prev.filter(r => r.id !== deleteModal.id))
        setDeleteModal({ open: false, id: null, name: '' })
        toast('Report deleted')
    }

    useEffect(() => {
        if (!previewModal.open || !previewModal.report || !chartRef.current) return
        if (chartInstance.current) { chartInstance.current.destroy(); chartInstance.current = null }
        const content = buildPreview(previewModal.report.type, previewModal.report.event)
        const chart = content.chart
        const isDoughnut = chart.type === 'doughnut'
        const isDark = document.documentElement.classList.contains('dark')
        const ink = o => isDark ? `rgba(245,244,241,${o})` : `rgba(14,17,22,${o})`
        chartInstance.current = new Chart(chartRef.current, {
            type: chart.type,
            data: {
                labels: chart.labels,
                datasets: chart.datasets.map(d => ({
                    borderColor: '#FF4D2E',
                    backgroundColor: isDoughnut ? ['#FF4D2E', '#2A4FBE', '#1E7A4F', '#8A5A00'] : 'rgba(255,77,46,0.15)',
                    fill: !isDoughnut,
                    tension: 0.35,
                    borderRadius: chart.type === 'bar' ? 6 : 0,
                    ...d,
                })),
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: isDoughnut, labels: { color: ink(0.7) } } },
                scales: isDoughnut ? {} : {
                    x: { ticks: { color: ink(0.55) }, grid: { display: false } },
                    y: { ticks: { color: ink(0.55) }, grid: { color: ink(0.06) }, beginAtZero: true },
                },
            },
        })
        return () => { if (chartInstance.current) { chartInstance.current.destroy(); chartInstance.current = null } }
    }, [previewModal.open, previewModal.report])

    const previewContent = previewModal.report ? buildPreview(previewModal.report.type, previewModal.report.event) : null

    return (
        <>
            <AppPageHead title="Reports | EVENTIFY" />
            <OrgMobileHeader />
            <div className="flex min-h-screen">
                <OrgSidebar />
                <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-8">
                    <div className="org-topbar">
                        <h1 className="org-topbar__title">Reports</h1>
                        <div className="org-topbar__right">
                            <div className="org-dropdown">
                                <button className="icon-btn" id="org-notif-toggle" type="button" aria-label="Notifications (3 unread)" aria-expanded="false">
                                    <span className="material-symbols-outlined">notifications</span>
                                    <span className="icon-btn__dot" />
                                </button>
                                <div className="org-dropdown__panel org-dropdown__panel--notif" id="org-notif-panel" hidden role="menu" aria-label="Notifications">
                                    <div className="flex items-center justify-between px-3 py-2 border-b border-outline-variant/40 mb-1">
                                        <span className="font-semibold text-xs text-on-surface">Notifications</span>
                                        <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">3 unread</span>
                                    </div>
                                    <div className="space-y-1">
                                        <Link className="org-dropdown__item" to="/org/applicants">
                                            <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--surface-2)", color: "var(--accent)" }}>
                                                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">person_add</span>
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="block font-medium text-xs leading-snug">Ahmed Ali applied to Global AI Innovation Challenge</span>
                                                <span className="org-dropdown__meta">2 hours ago</span>
                                            </span>
                                        </Link>
                                        <Link className="org-dropdown__item" to="/org/opportunities">
                                            <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--surface-2)", color: "var(--accent)" }}>
                                                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">hourglass_top</span>
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="block font-medium text-xs leading-snug">DevOps Masterclass is awaiting approval</span>
                                                <span className="org-dropdown__meta">Yesterday</span>
                                            </span>
                                        </Link>
                                        <Link className="org-dropdown__item" to="/org/applicants">
                                            <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--surface-2)", color: "var(--accent)" }}>
                                                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">star</span>
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="block font-medium text-xs leading-snug">Frontend Wizards received a new 5-star rating</span>
                                                <span className="org-dropdown__meta">2 days ago</span>
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="pt-2 mt-1 border-t border-outline-variant/40">
                                        <Link to="/org/applicants" className="block text-center text-xs font-semibold text-primary hover:underline py-1">View all activity →</Link>
                                    </div>
                                </div>
                            </div>
                            <LangToggleBtn />
                            <button className="theme-toggle icon-btn" type="button" title="Switch theme" aria-label="Switch theme">
                                <span className="material-symbols-outlined">dark_mode</span>
                            </button>
                            <div className="org-dropdown">
                                <button className="dash-profile" id="org-profile-toggle" type="button" aria-label="Organization menu" aria-expanded="false">
                                    <span className="dash-profile__avatar">TG</span>
                                    <span style={{ fontSize: 13, fontWeight: 600 }}>TechGenius Labs</span>
                                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: "var(--text-muted)" }}>expand_more</span>
                                </button>
                                <div className="org-dropdown__panel org-dropdown__panel--profile" id="org-profile-panel" hidden role="menu" aria-label="Organization menu">
                                    <div className="px-3 py-2 border-b border-outline-variant/40 mb-1">
                                        <p className="font-semibold text-xs text-on-surface">TechGenius Labs</p>
                                        <p className="text-[11px] text-on-surface-variant truncate">Verified organizer since 2024</p>
                                    </div>
                                    <Link className="org-dropdown__item" to="/org/profile"><span className="material-symbols-outlined text-[18px] text-on-surface-variant" aria-hidden="true">apartment</span><span>Organization Profile</span></Link>
                                    <Link className="org-dropdown__item" to="/org/settings"><span className="material-symbols-outlined text-[18px] text-on-surface-variant" aria-hidden="true">settings</span><span>Settings</span></Link>
                                    <div className="my-1 border-t border-outline-variant/40" />
                                    <Link className="org-dropdown__item text-error hover:bg-error/10" to="/auth/login">
                                        <span className="material-symbols-outlined text-[18px] text-error" aria-hidden="true">logout</span>
                                        <span className="text-error font-medium">Sign out</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="org-report-toolbar">
                        <p className="org-report-toolbar__description">
                            Create, preview, and download reports for your events and organization.
                        </p>
                        <div className="org-report-toolbar__actions">
                            <button type="button" className="btn-secondary" onClick={handleRefresh}>
                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>refresh</span> Refresh
                            </button>
                            <button type="button" className="btn-primary" onClick={() => openCreateModal()}>
                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span> Create Report
                            </button>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div data-reveal-children className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                        <div className="reports-kpi-card">
                            <p className="text-3xl font-extrabold text-on-surface">{kpi.total}</p>
                            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Total Reports</p>
                        </div>
                        <div className="reports-kpi-card">
                            <p className="text-3xl font-extrabold text-on-surface">{kpi.thisMonth}</p>
                            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">This Month</p>
                        </div>
                        <div className="reports-kpi-card">
                            <p className="text-3xl font-extrabold text-on-surface">{kpi.completed}</p>
                            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Completed</p>
                        </div>
                        <div className="reports-kpi-card">
                            <p className="text-3xl font-extrabold text-on-surface">{kpi.scheduled}</p>
                            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Scheduled</p>
                        </div>
                    </div>

                    {/* Quick Create */}
                    <section className="mb-8" data-no-reveal>
                        <div className="org-report-section-heading">
                            <h2 className="text-title-lg font-semibold">Quick Create</h2>
                        </div>
                        <div data-reveal-children className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                            {QUICK_CREATE.map(q => (
                                <div key={q.type} className="reports-kpi-card" style={{ minHeight: 'auto' }}>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                                        <span className="material-symbols-outlined text-[20px]">{q.icon}</span>
                                    </div>
                                    <h4 className="font-semibold text-sm text-on-surface mb-1">{q.title}</h4>
                                    <p className="text-xs text-on-surface-variant mb-3">{q.desc}</p>
                                    <button type="button" className="btn-secondary w-full" onClick={() => openCreateModal(q.type)}>Create</button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Reports Table */}
                    <section>
                        <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">Your Reports</h2>
                        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <input
                                type="text"
                                className="input-primary"
                                style={{ minWidth: 220 }}
                                placeholder="Search for a report..."
                                value={search}
                                onChange={e => { setSearch(e.target.value); setPage(1) }}
                            />
                            <div className="flex flex-wrap items-center gap-2">
                                <select className="reports-filter-select" aria-label="Report type" value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1) }}>
                                    <option value="all">All — Report Type</option>
                                    <option value="Event Performance">Event Performance</option>
                                    <option value="Registration Report">Registration</option>
                                    <option value="Participant Report">Participants</option>
                                    <option value="Engagement Report">Engagement</option>
                                    <option value="Overall Organization Report">Organization</option>
                                </select>
                                <select className="reports-filter-select" aria-label="Event" value={filterEvent} onChange={e => { setFilterEvent(e.target.value); setPage(1) }}>
                                    <option value="all">All Events</option>
                                    <option value="Global AI Innovation Challenge">Global AI Innovation Challenge</option>
                                    <option value="Frontend Wizards">Frontend Wizards</option>
                                    <option value="Startup Challenge">Startup Challenge</option>
                                    <option value="DevOps Masterclass">DevOps Masterclass</option>
                                    <option value="Cloud Native Bootcamp">Cloud Native Bootcamp</option>
                                </select>
                                <select className="reports-filter-select" aria-label="Status" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1) }}>
                                    <option value="all">All — Status</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Failed">Failed</option>
                                    <option value="Scheduled">Scheduled</option>
                                </select>
                            </div>
                        </div>

                        {refreshing && (
                            <div className="reports-panel">
                                <p className="mb-4 text-on-surface-variant">Refreshing reports...</p>
                                <div className="skeleton skeleton-line" />
                                <div className="skeleton skeleton-line" />
                                <div className="skeleton skeleton-line" />
                            </div>
                        )}

                        {!refreshing && filtered.length === 0 && (
                            <div className="empty-state">
                                <span className="empty-state__icon"><span className="material-symbols-outlined" aria-hidden="true">inbox</span></span>
                                <h3>No reports yet</h3>
                                <p>Create your first report to track how your events are performing.</p>
                                <button type="button" className="btn-primary" onClick={() => openCreateModal()}>Create Report</button>
                            </div>
                        )}

                        {!refreshing && filtered.length > 0 && (
                            <div className="reports-panel rounded-2xl" style={{ padding: 0, overflow: 'hidden' }}>
                                <div className="reports-table-wrap">
                                    <table className="reports-table">
                                        <caption className="sr-only">Your reports</caption>
                                        <thead>
                                            <tr>
                                                <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Report <SortArrow dir={sortKey === 'name' ? sortDir : undefined} /></th>
                                                <th onClick={() => handleSort('type')} style={{ cursor: 'pointer' }}>Type <SortArrow dir={sortKey === 'type' ? sortDir : undefined} /></th>
                                                <th>Event</th>
                                                <th>Period</th>
                                                <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>Created <SortArrow dir={sortKey === 'date' ? sortDir : undefined} /></th>
                                                <th>Format</th>
                                                <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>Status <SortArrow dir={sortKey === 'status' ? sortDir : undefined} /></th>
                                                <th style={{ textAlign: 'right' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pageItems.map(r => (
                                                <tr key={r.id}>
                                                    <td className="font-medium text-on-surface">{r.name}</td>
                                                    <td>{r.type}</td>
                                                    <td>{r.event}</td>
                                                    <td>{r.period}</td>
                                                    <td className="mono">{r.date}</td>
                                                    <td>{r.format}</td>
                                                    <td><span className={`reports-badge ${STATUS_BADGE[r.status] || ''}`}>{r.status}</span></td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        <div className="row-actions">
                                                            <button type="button" title="View" aria-label={`View ${r.name}`} onClick={() => setPreviewModal({ open: true, report: r })}>
                                                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                                                            </button>
                                                            <button type="button" title="Download" aria-label={`Download ${r.name}`} onClick={() => { exportReport(r); toast('Report ready for download') }}>
                                                                <span className="material-symbols-outlined text-[18px]">download</span>
                                                            </button>
                                                            <button type="button" title="Delete" aria-label={`Delete ${r.name}`} onClick={() => setDeleteModal({ open: true, id: r.id, name: r.name })}>
                                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                                            </button>
                                                            <button type="button" title="Rename" aria-label={`Rename ${r.name}`} onClick={() => handleRename(r.id)}>
                                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="reports-pagination">
                                <button type="button" disabled={currentPage === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <button key={p} type="button" aria-current={p === currentPage ? 'true' : undefined} onClick={() => setPage(p)}>{p}</button>
                                ))}
                                <button type="button" disabled={currentPage === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
                            </div>
                        )}
                    </section>
                </main>
            </div>

            {/* Mobile Navigation Drawer */}
            {/* Create Report Modal */}
            {createModal.open && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 org-report-backdrop"
                    onClick={e => { if (e.target === e.currentTarget) setCreateModal({ open: false }) }}>
                    <div className="confirm-dialog confirm-dialog--wide" style={{ position: 'static', margin: 0 }}>
                        <h3>Create Report</h3>
                        <form onSubmit={handleCreate}>
                            <div style={{ marginBottom: 14 }}>
                                <label>
                                    Report Name
                                    <input
                                        type="text"
                                        className="input-primary"
                                        placeholder="e.g. Monthly Event Performance"
                                        required
                                        autoFocus
                                        value={createForm.name}
                                        onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))}
                                    />
                                </label>
                            </div>
                            <div className="form-row">
                                <label>
                                    Report Type
                                    <select className="input-primary" value={createForm.type} onChange={e => setCreateForm(f => ({ ...f, type: e.target.value }))}>
                                        <option value="Event Performance">Event Performance</option>
                                        <option value="Registration Report">Registration Report</option>
                                        <option value="Participant Report">Participant Report</option>
                                        <option value="Engagement Report">Engagement Report</option>
                                        <option value="Overall Organization Report">Overall Organization Report</option>
                                    </select>
                                </label>
                                <label>
                                    Event
                                    <select className="input-primary" value={createForm.event} onChange={e => setCreateForm(f => ({ ...f, event: e.target.value }))}>
                                        <option value="All Events">All Events</option>
                                        <option value="Global AI Innovation Challenge">Global AI Innovation Challenge</option>
                                        <option value="Frontend Wizards">Frontend Wizards</option>
                                        <option value="Startup Challenge">Startup Challenge</option>
                                        <option value="DevOps Masterclass">DevOps Masterclass</option>
                                        <option value="Cloud Native Bootcamp">Cloud Native Bootcamp</option>
                                    </select>
                                </label>
                            </div>
                            <div className="form-row">
                                <label>
                                    Date Range
                                    <select className="input-primary" value={createForm.period} onChange={e => setCreateForm(f => ({ ...f, period: e.target.value }))}>
                                        <option value="This Week">This Week</option>
                                        <option value="This Month">This Month</option>
                                        <option value="Last 3 Months">Last 3 Months</option>
                                        <option value="This Year">This Year</option>
                                        <option value="Custom">Custom</option>
                                    </select>
                                </label>
                                <div>
                                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Format</p>
                                    <div className="format-options">
                                        {['PDF', 'Excel', 'CSV'].map(fmt => (
                                            <label key={fmt}>
                                                <input type="radio" name="org-format" value={fmt} checked={createForm.format === fmt} onChange={() => setCreateForm(f => ({ ...f, format: fmt }))}/> {fmt}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {createForm.period === 'Custom' && (
                                <div className="form-row">
                                    <label>
                                        Start Date
                                        <input
                                            type="date"
                                            className="input-primary"
                                            value={createForm.customStart || ''}
                                            onChange={e => setCreateForm(f => ({ ...f, customStart: e.target.value }))}
                                            required
                                        />
                                    </label>
                                    <label>
                                        End Date
                                        <input
                                            type="date"
                                            className="input-primary"
                                            value={createForm.customEnd || ''}
                                            onChange={e => setCreateForm(f => ({ ...f, customEnd: e.target.value }))}
                                            required
                                        />
                                    </label>
                                </div>
                            )}
                            <div className="confirm-dialog__actions">
                                <button type="button" className="btn-secondary" onClick={() => setCreateModal({ open: false })}>Cancel</button>
                                <button type="submit" className="btn-primary">Generate Report</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {deleteModal.open && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 org-report-backdrop"
                    onClick={e => { if (e.target === e.currentTarget) setDeleteModal({ open: false, id: null, name: '' }) }}>
                    <div className="confirm-dialog" style={{ position: 'static', margin: 0 }}>
                        <h3>Are you sure you want to delete this report?</h3>
                        <p>{deleteModal.name}</p>
                        <div className="confirm-dialog__actions">
                            <button type="button" className="btn-secondary" onClick={() => setDeleteModal({ open: false, id: null, name: '' })}>Cancel</button>
                            <button type="button" className="btn-primary" style={{ background: 'var(--error, #B3261E)' }} onClick={handleDelete}>Delete Report</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {previewModal.open && previewModal.report && previewContent && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 org-report-backdrop"
                    onClick={e => { if (e.target === e.currentTarget) setPreviewModal({ open: false, report: null }) }}>
                    <div className="confirm-dialog confirm-dialog--wide" style={{ position: 'static', margin: 0, maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' }}>TechGenius Labs</p>
                                <h3>{previewModal.report.name}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
                                    {previewModal.report.type} · {previewModal.report.event} · {previewModal.report.period} · Created {previewModal.report.date}
                                </p>
                            </div>
                            <button type="button" className="rounded-full p-2" aria-label="Close preview" onClick={() => setPreviewModal({ open: false, report: null })}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3" style={{ marginTop: 18 }}>
                            {previewContent.summary.map(s => (
                                <div key={s.label} className="reports-kpi-card" style={{ minHeight: 'auto', padding: '14px 16px' }}>
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">{s.label}</p>
                                    <p className="text-xl font-extrabold text-on-surface mt-1">{s.value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="reports-chart-shell" style={{ marginTop: 18 }}>
                            <canvas ref={chartRef} role="img" aria-label="Report chart" />
                        </div>
                        <div className="reports-table-wrap" style={{ marginTop: 18 }}>
                            <table className="reports-table">
                                <thead>
                                    <tr>{previewContent.table.headers.map(h => <th key={h}>{h}</th>)}</tr>
                                </thead>
                                <tbody>
                                    {previewContent.table.rows.map((row, i) => (
                                        <tr key={i}>{row.map((c, j) => <td key={j}>{c}</td>)}</tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="confirm-dialog__actions" style={{ marginTop: 18 }}>
                            <button type="button" className="btn-secondary" onClick={() => { exportReport(previewModal.report, 'PDF'); toast('Report file is ready') }}>Download PDF</button>
                            <button type="button" className="btn-secondary" onClick={() => { exportReport(previewModal.report, 'Excel'); toast('Report file is ready') }}>Download Excel</button>
                            <button type="button" className="btn-primary" onClick={() => { exportReport(previewModal.report, 'CSV'); toast('Report file is ready') }}>Download CSV</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
