import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppPageHead from '../../components/app/AppPageHead'
import { useOrgPageControls } from './useOrgPageControls.js'
import LangToggleBtn from '../../components/org/LangToggleBtn'
import '../../styles/org/sidebar.css'
import '../../styles/admin/admin.css'
import '../../styles/org/org-dashboard.css'
import '../../styles/org/org-opportunities.css'

const OPPORTUNITIES = [
    { id: 'evt-1', name: 'Global AI Innovation Challenge', meta: 'Hackathon · Remote · Teams of 2-4', status: 'live',     deadline: 'Oct 20, 2026', applicants: 98,  primaryAction: 'applicants' },
    { id: 'evt-4', name: 'DevOps Masterclass',             meta: 'Workshop · Online · Cloud Engineering',  status: 'pending',  deadline: 'Nov 3, 2026',  applicants: 72,  primaryAction: 'applicants' },
    { id: 'evt-3', name: 'Startup Challenge',              meta: 'Competition · Entrepreneurship',         status: 'upcoming', deadline: 'Nov 25, 2026', applicants: 84,  primaryAction: 'applicants' },
    { id: 'evt-2', name: 'Frontend Wizards',               meta: 'Hackathon · Web Development',            status: 'ended',    deadline: 'Closed',       applicants: 150, primaryAction: 'report' },
    { id: 'evt-5', name: 'Cloud Native Bootcamp',          meta: 'Course · Infrastructure',                status: 'ended',    deadline: 'Closed',       applicants: 42,  primaryAction: 'report' },
]

const STATUS_BADGE = {
    live:     { cls: 'badge badge--active',    label: 'Live' },
    pending:  { cls: 'badge badge--pending',   label: 'Pending Approval' },
    upcoming: { cls: 'badge badge--upcoming',  label: 'Upcoming' },
    ended:    { cls: 'badge badge--completed', label: 'Ended' },
}

const KPI_FILTERS = [
    { key: 'live',     label: 'Live',     icon: 'play_circle' },
    { key: 'pending',  label: 'Pending',  icon: 'hourglass_top' },
    { key: 'upcoming', label: 'Upcoming', icon: 'event_upcoming' },
    { key: 'ended',    label: 'Ended',    icon: 'task_alt' },
]

export default function OrgOpportunities() {
    useOrgPageControls()

    const [activeFilter, setActiveFilter] = useState('all')
    const [search, setSearch] = useState('')

    const counts = {
        all:      OPPORTUNITIES.length,
        live:     OPPORTUNITIES.filter(o => o.status === 'live').length,
        pending:  OPPORTUNITIES.filter(o => o.status === 'pending').length,
        upcoming: OPPORTUNITIES.filter(o => o.status === 'upcoming').length,
        ended:    OPPORTUNITIES.filter(o => o.status === 'ended').length,
    }

    const visible = OPPORTUNITIES.filter(o => {
        if (activeFilter !== 'all' && o.status !== activeFilter) return false
        if (search) {
            const q = search.toLowerCase()
            return o.name.toLowerCase().includes(q) || o.meta.toLowerCase().includes(q)
        }
        return true
    })

    function handleKpiClick(key) {
        setActiveFilter(f => f === key ? 'all' : key)
    }

    return (
        <>
            <AppPageHead title="My Opportunities | EVENTIFY" />
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
                            <Link className="nav-link" to="/org/opportunities" aria-current="page"><span className="material-symbols-outlined" aria-hidden="true">event_note</span>My Opportunities</Link>
                            <Link className="nav-link" to="/org/create-event"><span className="material-symbols-outlined" aria-hidden="true">add_circle</span>Create Event</Link>
                            <Link className="nav-link" to="/org/applicants"><span className="material-symbols-outlined" aria-hidden="true">group</span>Applicants</Link>
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
                    <div className="org-topbar">
                        <h1 className="org-topbar__title">My Opportunities</h1>
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

                    <div className="org-page-header">
                        <div className="flex items-center gap-2 text-sm mb-2">
                            <Link className="text-on-surface-variant hover:text-primary transition-colors" to="/org/dashboard">Dashboard</Link>
                            <span className="text-outline">/</span>
                            <span className="font-semibold text-on-surface">My Opportunities</span>
                        </div>
                        <p className="profile-page-desc">Track every draft, submission, approval, and ended opportunity.</p>
                        <div className="org-page-header__actions">
                            <Link className="btn-primary" to="/org/create-event">
                                <span className="material-symbols-outlined" style={{ fontSize: 18, verticalAlign: "middle" }}>add</span>
                                Create opportunity
                            </Link>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="opp-stat-grid" aria-label="Opportunities status summary">
                        {KPI_FILTERS.map(({ key, label, icon }) => (
                            <button
                                key={key}
                                type="button"
                                className={`stat-card${activeFilter === key ? ' stat-card--active' : ''}`}
                                title={`Filter by ${label} opportunities`}
                                onClick={() => handleKpiClick(key)}
                            >
                                <div className="stat-card__top">
                                    <span className="stat-card__label">{label}</span>
                                    <span className="stat-card__icon">
                                        <span className="material-symbols-outlined" aria-hidden="true">{icon}</span>
                                    </span>
                                </div>
                                <p className="stat-card__value">{counts[key]}</p>
                            </button>
                        ))}
                    </div>

                    {/* Filter + Search */}
                    <div className="opp-controls">
                        <div className="opp-filter-tabs" role="group" aria-label="Filter opportunities by status">
                            {['all', 'live', 'pending', 'upcoming', 'ended'].map(f => (
                                <button
                                    key={f}
                                    type="button"
                                    className="opp-filter-btn"
                                    aria-pressed={activeFilter === f}
                                    onClick={() => setActiveFilter(f)}
                                >
                                    {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}{' '}
                                    <span className="filter-count">{counts[f] ?? counts.all}</span>
                                </button>
                            ))}
                        </div>
                        <div className="opp-search">
                            <span className="material-symbols-outlined" aria-hidden="true">search</span>
                            <input
                                type="search"
                                placeholder="Search opportunities..."
                                aria-label="Search opportunities by name or category"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            {search && (
                                <button type="button" className="opp-search-clear" aria-label="Clear search" onClick={() => setSearch('')}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Table */}
                    <section className="opp-panel">
                        {visible.length > 0 ? (
                            <div className="table-scroll">
                                <table className="opp-table">
                                    <caption className="sr-only">List of your organization's opportunities</caption>
                                    <thead>
                                        <tr>
                                            <th>Opportunity</th>
                                            <th>Status</th>
                                            <th>Deadline</th>
                                            <th>Applicants</th>
                                            <th style={{ textAlign: "right" }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {visible.map(opp => {
                                            const badge = STATUS_BADGE[opp.status]
                                            const isEnded = opp.status === 'ended'
                                            return (
                                                <tr key={opp.id} data-status={opp.status}>
                                                    <td>
                                                        <div className="opp-entity">
                                                            <div>
                                                                <p className="opp-entity__name">{opp.name}</p>
                                                                <p className="opp-entity__meta">{opp.meta}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td><span className={badge.cls}>{badge.label}</span></td>
                                                    <td className="mono whitespace-nowrap">{opp.deadline}</td>
                                                    <td className="whitespace-nowrap"><span className="mono">{opp.applicants}</span> applicants</td>
                                                    <td>
                                                        <div className="org-row-actions">
                                                            {isEnded ? (
                                                                <>
                                                                    <Link to={`/org/applicants?event=${opp.id}`} aria-label={`View applicants for ${opp.name}`}>Applicants</Link>
                                                                    <Link to="/org/report-center" className="org-action--primary" aria-label={`View report for ${opp.name}`}>View report</Link>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Link to={`/org/applicants?event=${opp.id}`} className="org-action--primary" aria-label={`View applicants for ${opp.name}`}>Applicants</Link>
                                                                    <Link to="/org/create-event" aria-label={`Edit ${opp.name}`}>Edit</Link>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="opp-empty">
                                <div className="opp-empty__icon">
                                    <span className="material-symbols-outlined" style={{ fontSize: 26 }} aria-hidden="true">search_off</span>
                                </div>
                                <h3 className="opp-empty__title">No opportunities found</h3>
                                <p className="opp-empty__desc">No opportunities match your current filter or search criteria.</p>
                                <button type="button" className="btn-secondary mt-2" onClick={() => { setActiveFilter('all'); setSearch('') }}>
                                    Clear filters
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
                    <Link className="nav-link" to="/org/opportunities" aria-current="page"><span className="material-symbols-outlined" aria-hidden="true">event_note</span>My Opportunities</Link>
                    <Link className="nav-link" to="/org/create-event"><span className="material-symbols-outlined" aria-hidden="true">add_circle</span>Create Event</Link>
                    <Link className="nav-link" to="/org/applicants"><span className="material-symbols-outlined" aria-hidden="true">group</span>Applicants</Link>
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
