import AppPageHead from '../../components/app/AppPageHead'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import LangToggleBtn from '../../components/org/LangToggleBtn'
import '../../styles/org/sidebar.css'
import '../../styles/admin/admin.css'
import '../../styles/org/org-dashboard.css'
import '../../styles/org/org-applicants.css'
import { useOrgPageControls } from './useOrgPageControls.js'

const EVENTS = {
    'evt-1': { name: 'Global AI Innovation Challenge', all: 12, pending: 5, accepted: 6, rejected: 1 },
    'evt-2': { name: 'Frontend Wizards', all: 150, pending: 0, accepted: 140, rejected: 10 },
    'evt-3': { name: 'Startup Challenge', all: 84, pending: 23, accepted: 61, rejected: 0 },
    'evt-4': { name: 'DevOps Masterclass', all: 72, pending: 17, accepted: 55, rejected: 0 },
    'evt-5': { name: 'Cloud Native Bootcamp', all: 42, pending: 0, accepted: 38, rejected: 4 },
}

const APPLICANTS = [
    { id: 'app-1',  name: 'Alex Rivera',      headline: '3 yrs experience · Computer Vision', avatar: 'A', match: 94, matchTier: 'strong',   skills: ['Python', 'PyTorch', 'React'] },
    { id: 'app-2',  name: 'Nadia Farouk',     headline: 'Final-year CS student',               avatar: 'N', match: 88, matchTier: 'strong',   skills: ['Python', 'ML'] },
    { id: 'app-3',  name: 'Marcus Lee',        headline: 'Product Designer',                    avatar: 'M', match: 76, matchTier: 'moderate', skills: ['UI/UX', 'Three.js'] },
    { id: 'app-4',  name: 'Elena Rodriguez',   headline: 'Data Analyst',                        avatar: 'E', match: 81, matchTier: 'strong',   skills: ['Python', 'Data Viz'] },
    { id: 'app-5',  name: 'Kevin Park',        headline: 'Mobile Developer',                    avatar: 'K', match: 55, matchTier: 'neutral',  skills: ['Flutter'] },
    { id: 'app-6',  name: 'Sara Ahmed',        headline: 'Backend Engineer · 5 yrs',            avatar: 'S', match: 91, matchTier: 'strong',   skills: ['Node.js', 'PostgreSQL'] },
    { id: 'app-7',  name: 'Liam Chen',         headline: 'Full-stack Developer',                avatar: 'L', match: 79, matchTier: 'moderate', skills: ['React', 'Django'] },
    { id: 'app-8',  name: 'Mia Torres',        headline: 'DevOps Engineer',                     avatar: 'M', match: 84, matchTier: 'strong',   skills: ['Docker', 'Kubernetes'] },
    { id: 'app-9',  name: 'Omar Hassan',       headline: 'AI/ML Researcher',                    avatar: 'O', match: 97, matchTier: 'strong',   skills: ['TensorFlow', 'Python'] },
    { id: 'app-10', name: 'Priya Nair',        headline: 'UX Researcher',                       avatar: 'P', match: 68, matchTier: 'moderate', skills: ['Figma', 'User Research'] },
    { id: 'app-11', name: 'James Okafor',      headline: 'Cloud Architect',                     avatar: 'J', match: 86, matchTier: 'strong',   skills: ['AWS', 'Terraform'] },
    { id: 'app-12', name: 'Yuna Kim',          headline: 'Frontend Developer · 2 yrs',          avatar: 'Y', match: 73, matchTier: 'moderate', skills: ['Vue.js', 'TypeScript'] },
]

const INITIAL_STATUSES = {
    'app-1': 'pending',  'app-2': 'pending',  'app-3': 'accepted', 'app-4': 'accepted',
    'app-5': 'rejected', 'app-6': 'accepted', 'app-7': 'pending',  'app-8': 'accepted',
    'app-9': 'pending',  'app-10': 'rejected','app-11': 'accepted','app-12': 'pending',
}

const BADGE_STYLES = {
    pending:  { color: '#b45309', background: 'rgba(217,119,6,0.1)',   border: '1px solid rgba(217,119,6,0.2)' },
    accepted: { color: '#1e7a4f', background: 'rgba(30,122,79,0.1)',   border: '1px solid rgba(30,122,79,0.2)' },
    rejected: { color: '#b3261e', background: 'rgba(179,38,30,0.08)',  border: '1px solid rgba(179,38,30,0.18)' },
}

function StatusBadge({ status }) {
    const s = BADGE_STYLES[status] || BADGE_STYLES.pending
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', borderRadius: 999,
            fontSize: 11, fontWeight: 700, letterSpacing: '0.03em',
            textTransform: 'capitalize', whiteSpace: 'nowrap',
            ...s
        }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', flexShrink: 0, display: 'inline-block' }} />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    )
}

function DecisionCell({ applicant, status, onDecision }) {
    const [exiting, setExiting] = useState(null)

    function decide(decision) {
        setExiting(decision)
        setTimeout(() => {
            onDecision(applicant.id, decision)
            setExiting(null)
        }, 220)
    }

    if (status === 'pending') {
        return (
            <div className="decision-actions">
                <button
                    type="button"
                    className={`btn-accept${exiting === 'accepted' ? ' btn--exiting' : ''}`}
                    aria-label={`Accept ${applicant.name}`}
                    onClick={() => decide('accepted')}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check</span> Accept
                </button>
                <button
                    type="button"
                    className={`btn-reject${exiting === 'rejected' ? ' btn--exiting' : ''}`}
                    aria-label={`Reject ${applicant.name}`}
                    onClick={() => decide('rejected')}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span> Reject
                </button>
            </div>
        )
    }

    return (
        <span className="decision-state">
            <span className="material-symbols-outlined">{status === 'accepted' ? 'check_circle' : 'cancel'}</span>
            {status === 'accepted' ? 'Accepted' : 'Rejected'}
        </span>
    )
}

export default function OrgApplicants() {
    useOrgPageControls({ mobileNavigation: true })

    const [currentEventId, setCurrentEventId] = useState('evt-1')
    const [activeFilter, setActiveFilter] = useState('all')
    const [statuses, setStatuses] = useState(INITIAL_STATUSES)
    const [eventPanelOpen, setEventPanelOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const loadingTimer = useRef(null)
    const ITEMS_PER_PAGE = 5

    useEffect(() => {
        if (!eventPanelOpen) return
        const handler = (e) => {
            const toggle = document.getElementById('org-event-toggle')
            const panel = document.getElementById('org-event-panel')
            if (!panel?.contains(e.target) && e.target !== toggle) {
                setEventPanelOpen(false)
            }
        }
        const onKey = (e) => { if (e.key === 'Escape') setEventPanelOpen(false) }
        document.addEventListener('click', handler)
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('click', handler)
            document.removeEventListener('keydown', onKey)
        }
    }, [eventPanelOpen])

    function handleEventChange(eventId) {
        if (eventId === currentEventId) { setEventPanelOpen(false); return }
        setEventPanelOpen(false)
        setIsLoading(true)
        clearTimeout(loadingTimer.current)
        loadingTimer.current = setTimeout(() => {
            setCurrentEventId(eventId)
            setActiveFilter('all')
            setCurrentPage(1)
            setIsLoading(false)
        }, 600)
    }

    function handleDecision(id, decision) {
        if (statuses[id] === decision) return
        setStatuses(s => ({ ...s, [id]: decision }))
    }

    const currentEvent = EVENTS[currentEventId]
    const visibleApplicants = APPLICANTS.filter(a =>
        activeFilter === 'all' || statuses[a.id] === activeFilter
    )
    const counts = {
        all:      APPLICANTS.length,
        pending:  APPLICANTS.filter(a => statuses[a.id] === 'pending').length,
        accepted: APPLICANTS.filter(a => statuses[a.id] === 'accepted').length,
        rejected: APPLICANTS.filter(a => statuses[a.id] === 'rejected').length,
    }
    const totalPages = Math.max(1, Math.ceil(visibleApplicants.length / ITEMS_PER_PAGE))
    const safePage = Math.min(currentPage, totalPages)
    const paginatedApplicants = visibleApplicants.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE)

    function handleFilterChange(f) {
        setActiveFilter(f)
        setCurrentPage(1)
    }

    function getPageNumbers(current, total) {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
        const range = []
        for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) range.push(i)
        const pages = [1]
        if (range[0] > 2) pages.push('...')
        pages.push(...range)
        if (range[range.length - 1] < total - 1) pages.push('...')
        pages.push(total)
        return pages
    }

    return (
        <>
            <AppPageHead title="Applicants | EVENTIFY" />
            <header className="lg:hidden w-full sticky top-0 z-40 flex justify-between items-center px-4 h-16 bg-surface border-b border-border shadow-sm">
                <Link className="flex items-center gap-2" to="/">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>hub</span>
                    <span className="font-bold text-headline-lg-mobile text-primary" style={{ fontFamily: "var(--font-display)" }}>EVENTIFY</span>
                </Link>
                <div className="flex items-center gap-2">
                    <LangToggleBtn small />
                    <button className="theme-toggle icon-btn" type="button" title="Switch theme" aria-label="Switch theme" style={{ width: 36, height: 36 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>dark_mode</span>
                    </button>
                    <span className="admin-badge">Organizer</span>
                    <button className="mobile-hamburger" id="org-hamburger" aria-label="Open navigation" aria-expanded="false">
                        <span className="material-symbols-outlined" style={{ fontSize: 22 }}>menu</span>
                    </button>
                </div>
            </header>
            <div className="flex min-h-screen">
                <aside className="admin-accent-sidebar hidden lg:flex flex-col w-[280px] h-screen sticky top-0 bg-surface border-r border-border z-50 p-6">
                    <Link className="flex items-center gap-3 mb-2" to="/">
                        <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>hub</span>
                        <span className="font-bold text-headline-md text-primary" style={{ fontFamily: "var(--font-display)" }}>EVENTIFY</span>
                    </Link>
                    <span className="admin-badge mb-8 w-fit">Organizer console</span>
                    <nav className="flex flex-1 flex-col gap-1" aria-label="Organizer sections">
                        <div className="nav-group">
                            <Link className="nav-link" to="/org/dashboard"><span className="material-symbols-outlined" aria-hidden="true">dashboard</span>Dashboard</Link>
                            <Link className="nav-link" to="/org/posts"><span className="material-symbols-outlined" aria-hidden="true">campaign</span>Posts</Link>
                            <Link className="nav-link" to="/org/profile"><span className="material-symbols-outlined" aria-hidden="true">apartment</span>Organization Profile</Link>
                            <Link className="nav-link" to="/org/opportunities"><span className="material-symbols-outlined" aria-hidden="true">event_note</span>My Opportunities</Link>
                            <Link className="nav-link" to="/org/create-event"><span className="material-symbols-outlined" aria-hidden="true">add_circle</span>Create Event</Link>
                            <Link className="nav-link" to="/org/applicants" aria-current="page"><span className="material-symbols-outlined" aria-hidden="true">group</span>Applicants</Link>
                            <Link className="nav-link" to="/org/report-center"><span className="material-symbols-outlined" aria-hidden="true">bar_chart</span>Reports</Link>
                            <Link className="nav-link" to="/org/settings"><span className="material-symbols-outlined" aria-hidden="true">settings</span>Settings</Link>
                        </div>
                    </nav>
                    <div className="mt-auto rounded-2xl bg-surface-container p-4">
                        <p className="mb-2 text-label-sm font-label-sm text-on-surface-variant">ORGANIZATION</p>
                        <p className="mb-1 font-label-md text-label-md text-on-surface font-semibold">TechGenius Labs</p>
                        <p className="text-label-sm font-label-sm text-success">Verified organizer since 2024</p>
                    </div>
                </aside>
                <main className="flex-1 w-full px-4 md:px-10 pt-6 pb-24 lg:pb-8">
                    {/* Global Top Header */}
                    <div className="org-topbar">
                        <h1 className="org-topbar__title">Applicants · {currentEvent.name}</h1>
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
                    {/* Page Header */}
                    <div className="org-page-header">
                        <nav className="breadcrumb-nav" aria-label="Breadcrumb">
                            <Link to="/org/dashboard">Dashboard</Link>
                            <span className="breadcrumb-sep">/</span>
                            <span className="breadcrumb-current">Applicants</span>
                        </nav>
                        <div className="org-page-header__actions">
                            <div className="org-event-dropdown">
                                <button
                                    className="org-event-btn"
                                    id="org-event-toggle"
                                    type="button"
                                    aria-haspopup="listbox"
                                    aria-expanded={eventPanelOpen}
                                    aria-label="Switch selected opportunity"
                                    onClick={(e) => { e.stopPropagation(); setEventPanelOpen(o => !o) }}
                                >
                                    <span className="event-icon"><span className="material-symbols-outlined" aria-hidden="true">event_note</span></span>
                                    <span className="org-event-btn__name">{currentEvent.name}</span>
                                    <span className="material-symbols-outlined chevron-icon" aria-hidden="true">expand_more</span>
                                </button>
                                <div className="org-event-panel" id="org-event-panel" hidden={!eventPanelOpen} role="listbox" aria-label="Select opportunity">
                                    {Object.entries(EVENTS).map(([id, ev]) => (
                                        <button
                                            key={id}
                                            type="button"
                                            className={`org-event-item${id === currentEventId ? ' active' : ''}`}
                                            data-event-id={id}
                                            role="option"
                                            aria-selected={id === currentEventId}
                                            onClick={(e) => { e.stopPropagation(); handleEventChange(id) }}
                                        >
                                            <span className="item-name">{ev.name}</span>
                                            <span className="item-meta">{ev.all} applicants</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <span className="badge badge--pending" style={{ fontSize: 12 }}>Review applicants</span>
                        </div>
                    </div>
                    {/* Status Filter Tabs */}
                    <div className="applicants-filters" role="group" aria-label="Filter applicants by review status">
                        {['all', 'pending', 'accepted', 'rejected'].map(f => (
                            <button
                                key={f}
                                className={`filter-btn${activeFilter === f ? ' active' : ''}`}
                                data-filter={f}
                                type="button"
                                aria-pressed={activeFilter === f}
                                onClick={() => handleFilterChange(f)}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}{' '}
                                <span className="filter-count">{counts[f] ?? 0}</span>
                            </button>
                        ))}
                    </div>
                    {/* Applicants Table Panel */}
                    <section className="applicants-panel">
                        {isLoading ? (
                            <div className="table-skeleton" aria-label="Loading applicants" aria-busy="true">
                                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                                    <div key={i} className="skeleton-row" style={{ animationDelay: `${i * 60}ms` }}>
                                        <div className="skeleton-avatar" />
                                        <div className="skeleton-lines">
                                            <div className="skeleton-line skeleton-line--name" />
                                            <div className="skeleton-line skeleton-line--sub" />
                                        </div>
                                        <div className="skeleton-pill" />
                                        <div className="skeleton-chips">
                                            <div className="skeleton-chip" />
                                            <div className="skeleton-chip" />
                                        </div>
                                        <div className="skeleton-badge" />
                                    </div>
                                ))}
                            </div>
                        ) : visibleApplicants.length > 0 ? (
                            <div className="table-scroll">
                                <table className="applicants-table" id="applicants-table">
                                    <caption className="sr-only">Applicants for selected opportunity</caption>
                                    <thead>
                                        <tr>
                                            <th>Applicant</th>
                                            <th>AI Match</th>
                                            <th>Skills</th>
                                            <th>Status</th>
                                            <th style={{ textAlign: "right" }}>Decision</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedApplicants.map(a => (
                                            <tr key={a.id} className="applicant-row" data-status={statuses[a.id]} data-id={a.id}>
                                                <td>
                                                    <div className="applicant-entity">
                                                        <div className="applicant-avatar">{a.avatar}</div>
                                                        <div>
                                                            <Link className="applicant-name" to="/org/applicants">{a.name}</Link>
                                                            <p className="applicant-headline">{a.headline}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`match-score match-score--${a.matchTier}`} title={`AI Match Score: ${a.match}%`}>
                                                        {a.match}% match
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="skills-list">
                                                        {a.skills.map(s => <span key={s} className="skill-chip">{s}</span>)}
                                                    </div>
                                                </td>
                                                <td className="status-cell">
                                                    <StatusBadge status={statuses[a.id]} />
                                                </td>
                                                <td className="decision-cell" style={{ textAlign: "right" }}>
                                                    <DecisionCell applicant={a} status={statuses[a.id]} onDecision={handleDecision} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="applicants-empty">
                                <div className="applicants-empty__icon">
                                    <span className="material-symbols-outlined" style={{ fontSize: 26 }} aria-hidden="true">group_off</span>
                                </div>
                                <h3 className="applicants-empty__title">No applicants in this category</h3>
                                <p className="applicants-empty__desc">There are no applicants matching the selected status filter.</p>
                                <button type="button" className="btn-secondary mt-2" onClick={() => handleFilterChange('all')}>Show all applicants</button>
                            </div>
                        )}
                        {!isLoading && visibleApplicants.length > 0 && totalPages > 1 && (
                            <div className="pagination-bar">
                                <button
                                    type="button"
                                    className="page-btn page-btn--nav"
                                    disabled={safePage === 1}
                                    onClick={() => setCurrentPage(p => p - 1)}
                                >
                                    Prev
                                </button>
                                {getPageNumbers(safePage, totalPages).map((n, i) =>
                                    n === '...'
                                        ? <span key={`ellipsis-${i}`} className="page-ellipsis">…</span>
                                        : <button
                                            key={n}
                                            type="button"
                                            className={`page-btn${n === safePage ? ' page-btn--active' : ''}`}
                                            aria-current={n === safePage ? 'page' : undefined}
                                            onClick={() => setCurrentPage(n)}
                                          >
                                            {n}
                                          </button>
                                )}
                                <button
                                    type="button"
                                    className="page-btn page-btn--nav"
                                    disabled={safePage === totalPages}
                                    onClick={() => setCurrentPage(p => p + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </section>
                </main>
            </div>
            {/* Mobile Navigation Drawer */}
            <div className="mobile-nav-overlay" id="org-mobile-overlay" />
            <nav className="mobile-nav-drawer" id="org-mobile-drawer" aria-label="Organizer navigation">
                <button className="mobile-nav-close" id="org-nav-close" aria-label="Close navigation">
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
                </button>
                <Link className="flex items-center gap-3 mb-2" to="/">
                    <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>hub</span>
                    <span className="font-bold text-headline-md text-primary" style={{ fontFamily: "var(--font-display)" }}>EVENTIFY</span>
                </Link>
                <span className="admin-badge mb-6 w-fit">Organizer console</span>
                <div className="nav-group flex flex-1 flex-col gap-1">
                    <Link className="nav-link" to="/org/dashboard"><span className="material-symbols-outlined" aria-hidden="true">dashboard</span>Dashboard</Link>
                    <Link className="nav-link" to="/org/posts"><span className="material-symbols-outlined" aria-hidden="true">campaign</span>Posts</Link>
                    <Link className="nav-link" to="/org/profile"><span className="material-symbols-outlined" aria-hidden="true">apartment</span>Organization Profile</Link>
                    <Link className="nav-link" to="/org/opportunities"><span className="material-symbols-outlined" aria-hidden="true">event_note</span>My Opportunities</Link>
                    <Link className="nav-link" to="/org/create-event"><span className="material-symbols-outlined" aria-hidden="true">add_circle</span>Create Event</Link>
                    <Link className="nav-link" to="/org/applicants" aria-current="page"><span className="material-symbols-outlined" aria-hidden="true">group</span>Applicants</Link>
                    <Link className="nav-link" to="/org/report-center"><span className="material-symbols-outlined" aria-hidden="true">bar_chart</span>Reports</Link>
                    <Link className="nav-link" to="/org/settings"><span className="material-symbols-outlined" aria-hidden="true">settings</span>Settings</Link>
                </div>
                <div className="mt-auto rounded-2xl bg-surface-container p-4">
                    <p className="mb-2 text-label-sm font-label-sm text-on-surface-variant">ORGANIZATION</p>
                    <p className="mb-1 font-label-md text-label-md text-on-surface font-semibold">TechGenius Labs</p>
                    <p className="text-label-sm font-label-sm text-success">Verified organizer since 2024</p>
                </div>
            </nav>
        </>
    )
}
