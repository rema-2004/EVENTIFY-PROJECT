import AppPageHead from '../../components/app/AppPageHead'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import LangToggleBtn from '../../components/org/LangToggleBtn'
import '../../styles/org/sidebar.css'
import '../../styles/admin/admin.css'
import '../../styles/org/org-dashboard.css'
import './org-dashboard-data.js'
import './org-dashboard.js'
import { useOrgPageControls } from './useOrgPageControls.js'

export default function OrgDashboard() {
    useOrgPageControls({ mobileNavigation: false })
    useEffect(() => window.initOrgDashboard(), [])

    return (
        <>
            <AppPageHead title="Organizer Dashboard | EVENTIFY" />
            <header className="lg:hidden w-full sticky top-0 z-40 flex justify-between items-center px-4 h-16 bg-surface border-b border-border shadow-sm">
                <Link className="flex items-center gap-2" to="/">
                    <span
                        className="material-symbols-outlined text-primary"
                        style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                        hub
                    </span>
                    <span
                        className="font-bold text-headline-lg-mobile text-primary"
                        style={{ fontFamily: "var(--font-display)" }}
                    >
                        EVENTIFY
                    </span>
                </Link>
                <div className="flex items-center gap-2">
                    <LangToggleBtn small />
                    <button
                        className="theme-toggle icon-btn"
                        type="button"
                        title="Switch theme"
                        aria-label="Switch theme"
                        style={{ width: 36, height: 36 }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                            dark_mode
                        </span>
                    </button>
                    <span className="admin-badge">Organizer</span>
                    <button
                        className="mobile-hamburger"
                        id="org-hamburger"
                        aria-label="Open navigation"
                        aria-expanded="false"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
                            menu
                        </span>
                    </button>
                </div>
            </header>
            <div className="flex min-h-screen">
                <aside className="admin-accent-sidebar hidden lg:flex flex-col w-[280px] h-screen sticky top-0 bg-surface border-r border-border z-50 p-6">
                    <Link className="flex items-center gap-3 mb-2" to="/">
                        <span
                            className="material-symbols-outlined text-primary text-3xl"
                            style={{ fontVariationSettings: '"FILL" 1' }}
                        >
                            hub
                        </span>
                        <span
                            className="font-bold text-headline-md text-primary"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            EVENTIFY
                        </span>
                    </Link>
                    <span className="admin-badge mb-8 w-fit">Organizer console</span>
                    <nav
                        className="flex flex-1 flex-col gap-1"
                        aria-label="Organizer sections"
                    >
                        <div className="nav-group">
                            <Link className="nav-link" to="/org/dashboard" aria-current="page">
                                <span className="material-symbols-outlined" aria-hidden="true">dashboard</span>
                                Dashboard
                            </Link>
                            <Link className="nav-link" to="/org/posts">
                                <span className="material-symbols-outlined" aria-hidden="true">campaign</span>
                                Posts
                            </Link>
                            <Link className="nav-link" to="/org/profile">
                                <span className="material-symbols-outlined" aria-hidden="true">apartment</span>
                                Organization Profile
                            </Link>
                            <Link className="nav-link" to="/org/opportunities">
                                <span className="material-symbols-outlined" aria-hidden="true">event_note</span>
                                My Opportunities
                            </Link>
                            <Link className="nav-link" to="/org/create-event">
                                <span className="material-symbols-outlined" aria-hidden="true">add_circle</span>
                                Create Event
                            </Link>
                            <Link className="nav-link" to="/org/applicants">
                                <span className="material-symbols-outlined" aria-hidden="true">group</span>
                                Applicants
                            </Link>
                            <Link className="nav-link" to="/org/report-center">
                                <span className="material-symbols-outlined" aria-hidden="true">bar_chart</span>
                                Reports
                            </Link>
                            <Link className="nav-link" to="/org/settings">
                                <span className="material-symbols-outlined" aria-hidden="true">settings</span>
                                Settings
                            </Link>
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
                        <h1 className="org-topbar__title">Dashboard</h1>
                        <div className="org-topbar__right">
                            <div className="org-dropdown">
                                <button
                                    className="icon-btn"
                                    id="org-notif-toggle"
                                    type="button"
                                    aria-label="Notifications (3 unread)"
                                    aria-expanded="false"
                                >
                                    <span className="material-symbols-outlined">notifications</span>
                                    <span className="icon-btn__dot" />
                                </button>
                                <div
                                    className="org-dropdown__panel org-dropdown__panel--notif"
                                    id="org-notif-panel"
                                    hidden
                                    role="menu"
                                    aria-label="Notifications"
                                >
                                    <div className="flex items-center justify-between px-3 py-2 border-b border-outline-variant/40 mb-1">
                                        <span className="font-semibold text-xs text-on-surface">Notifications</span>
                                        <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                            3 unread
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <Link className="org-dropdown__item" to="/org/applicants">
                                            <span
                                                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                                style={{ background: "var(--surface-2)", color: "var(--accent)" }}
                                            >
                                                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">person_add</span>
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="block font-medium text-xs leading-snug">Ahmed Ali applied to Global AI Innovation Challenge</span>
                                                <span className="org-dropdown__meta">2 hours ago</span>
                                            </span>
                                        </Link>
                                        <Link className="org-dropdown__item" to="/org/opportunities">
                                            <span
                                                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                                style={{ background: "var(--surface-2)", color: "var(--accent)" }}
                                            >
                                                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">hourglass_top</span>
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="block font-medium text-xs leading-snug">DevOps Masterclass is awaiting approval</span>
                                                <span className="org-dropdown__meta">Yesterday</span>
                                            </span>
                                        </Link>
                                        <Link className="org-dropdown__item" to="/org/applicants">
                                            <span
                                                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                                style={{ background: "var(--surface-2)", color: "var(--accent)" }}
                                            >
                                                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">star</span>
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="block font-medium text-xs leading-snug">Frontend Wizards received a new 5-star rating</span>
                                                <span className="org-dropdown__meta">2 days ago</span>
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="pt-2 mt-1 border-t border-outline-variant/40">
                                        <Link
                                            to="/org/applicants"
                                            className="block text-center text-xs font-semibold text-primary hover:underline py-1"
                                        >
                                            View all activity →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <LangToggleBtn />
                            <button
                                className="theme-toggle icon-btn"
                                type="button"
                                title="Switch theme"
                                aria-label="Switch theme"
                            >
                                <span className="material-symbols-outlined">dark_mode</span>
                            </button>
                            <div className="org-dropdown">
                                <button
                                    className="dash-profile"
                                    id="org-profile-toggle"
                                    type="button"
                                    aria-label="Organization menu"
                                    aria-expanded="false"
                                    style={{ cursor: "pointer" }}
                                >
                                    <span className="dash-profile__avatar">TG</span>
                                    <span style={{ fontSize: 13, fontWeight: 600 }}>TechGenius Labs</span>
                                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: "var(--text-muted)" }}>expand_more</span>
                                </button>
                                <div
                                    className="org-dropdown__panel org-dropdown__panel--profile"
                                    id="org-profile-panel"
                                    hidden
                                    role="menu"
                                    aria-label="Organization menu"
                                >
                                    <div className="px-3 py-2 border-b border-outline-variant/40 mb-1">
                                        <p className="font-semibold text-xs text-on-surface">TechGenius Labs</p>
                                        <p className="text-[11px] text-on-surface-variant truncate">Verified organizer since 2024</p>
                                    </div>
                                    <Link className="org-dropdown__item" to="/org/profile">
                                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant" aria-hidden="true">apartment</span>
                                        <span>Organization Profile</span>
                                    </Link>
                                    <Link className="org-dropdown__item" to="/org/settings">
                                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant" aria-hidden="true">settings</span>
                                        <span>Settings</span>
                                    </Link>
                                    <div className="my-1 border-t border-outline-variant/40" />
                                    <Link
                                        className="org-dropdown__item text-error hover:bg-error/10"
                                        to="/auth/login"
                                    >
                                        <span className="material-symbols-outlined text-[18px] text-error" aria-hidden="true">logout</span>
                                        <span className="text-error font-medium">Sign out</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Page Header */}
                    <div className="org-page-header">
                        <p className="profile-page-desc">Here's how your events are performing.</p>
                        <div className="org-page-header__actions">
                            <Link className="btn-primary" to="/org/create-event">
                                <span className="material-symbols-outlined" style={{ fontSize: 18, verticalAlign: "middle" }}>add</span>{" "}
                                Create New Event
                            </Link>
                        </div>
                    </div>
                    {/* 1. KPI Cards */}
                    <section id="org-stat-grid" className="stat-grid" aria-live="polite" />
                    {/* 2. Applicants Overview & Application Status */}
                    <section className="dash-section">
                        <div className="chart-grid chart-grid--split">
                            <article className="panel">
                                <div className="panel__head">
                                    <div>
                                        <h3>Applicants Overview</h3>
                                        <p>Track applicant growth across your events</p>
                                    </div>
                                    <div className="seg" id="org-applicants-range" role="group" aria-label="Applicants chart range">
                                        <button type="button" data-range="7d" aria-pressed="false">7 Days</button>
                                        <button type="button" data-range="30d" aria-pressed="true">30 Days</button>
                                        <button type="button" data-range="3m" aria-pressed="false">3 Months</button>
                                        <button type="button" data-range="6m" aria-pressed="false">6 Months</button>
                                        <button type="button" data-range="1y" aria-pressed="false">1 Year</button>
                                    </div>
                                </div>
                                <div className="chart-shell">
                                    <canvas id="org-chart-applicants" role="img" aria-label="Applicants over time" />
                                </div>
                            </article>
                            <article className="panel">
                                <div className="panel__head">
                                    <div>
                                        <h3>Application Status</h3>
                                        <p id="org-status-total" />
                                    </div>
                                </div>
                                <div className="chart-shell">
                                    <canvas id="org-chart-status" role="img" aria-label="Application status breakdown" />
                                </div>
                            </article>
                        </div>
                    </section>
                    {/* 3. Event Performance & Events by Category */}
                    <section className="dash-section">
                        <div className="chart-grid chart-grid--split">
                            <article className="panel">
                                <div className="panel__head">
                                    <div>
                                        <h3>Event Performance</h3>
                                        <p>Compare applicants across your events</p>
                                    </div>
                                </div>
                                <div className="chart-shell">
                                    <canvas id="org-chart-performance" role="img" aria-label="Event performance comparison" />
                                </div>
                            </article>
                            <article className="panel">
                                <div className="panel__head">
                                    <div>
                                        <h3>Events by Category</h3>
                                        <p id="org-categories-total" />
                                    </div>
                                </div>
                                <div className="chart-shell">
                                    <canvas id="org-chart-categories" role="img" aria-label="Events by category" />
                                </div>
                            </article>
                        </div>
                    </section>
                    {/* 4. Registration Trend */}
                    <section className="dash-section">
                        <article className="panel">
                            <div className="panel__head">
                                <div>
                                    <h3>Registration Trend</h3>
                                    <p>Daily registrations over the last 30 days</p>
                                </div>
                            </div>
                            <div className="chart-shell chart-shell--sm">
                                <canvas id="org-chart-trend" role="img" aria-label="Registration trend over the last 30 days" />
                            </div>
                        </article>
                    </section>
                    {/* 5. My Events */}
                    <section className="dash-section">
                        <div className="dash-section__head">
                            <div>
                                <h2>My Events</h2>
                                <p>Every event your organization has created, live or past.</p>
                            </div>
                            <Link className="text-primary font-label-md text-label-md hover:underline" to="/org/opportunities">
                                View all events →
                            </Link>
                        </div>
                        <article className="panel panel--flush">
                            <div className="table-scroll">
                                <table className="dash-table">
                                    <caption className="sr-only">My events</caption>
                                    <thead>
                                        <tr>
                                            <th>Event</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th>Applicants</th>
                                            <th>Approved</th>
                                            <th>Pending</th>
                                            <th>Rating</th>
                                            <th style={{ textAlign: "right" }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="org-events-body" />
                                </table>
                            </div>
                        </article>
                    </section>
                    {/* 6. Upcoming Events & Top Performing Events */}
                    <section className="dash-section">
                        <div className="chart-grid chart-grid--half">
                            <article className="panel">
                                <div className="panel__head">
                                    <div><h3>Upcoming Events</h3></div>
                                    <Link className="text-primary font-label-sm text-label-sm hover:underline" to="/org/opportunities">
                                        View all events
                                    </Link>
                                </div>
                                <div id="org-upcoming" />
                            </article>
                            <article className="panel">
                                <div className="panel__head">
                                    <div>
                                        <h3>Top Performing Events</h3>
                                        <p>Ranked by applicants, engagement and rating</p>
                                    </div>
                                </div>
                                <div id="org-top-events" />
                            </article>
                        </div>
                    </section>
                    {/* 7. Recent Applicants */}
                    <section className="dash-section">
                        <div className="dash-section__head">
                            <div>
                                <h2>Recent Applicants</h2>
                                <p>The latest people who applied to your events.</p>
                            </div>
                            <Link className="text-primary font-label-md text-label-md hover:underline" to="/org/applicants">
                                Open applicants →
                            </Link>
                        </div>
                        <article className="panel panel--flush">
                            <div className="table-scroll">
                                <table className="dash-table">
                                    <caption className="sr-only">Recent applicants</caption>
                                    <thead>
                                        <tr>
                                            <th>Applicant</th>
                                            <th>Event</th>
                                            <th>Applied at</th>
                                            <th>Status</th>
                                            <th style={{ textAlign: "right" }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="org-applicants-body" />
                                </table>
                            </div>
                        </article>
                    </section>
                    {/* 8. Recent Activity & Quick Actions */}
                    <section className="dash-section">
                        <div className="chart-grid chart-grid--half">
                            <article className="panel">
                                <div className="panel__head">
                                    <div><h3>Recent Activity</h3></div>
                                </div>
                                <div className="timeline" id="org-activity" />
                            </article>
                            <article className="panel">
                                <div className="panel__head">
                                    <div><h3>Quick Actions</h3></div>
                                </div>
                                <div className="quick-grid">
                                    <Link className="quick-action" to="/org/create-event">
                                        <span className="material-symbols-outlined">add_circle</span>
                                        Create Event
                                    </Link>
                                    <Link className="quick-action" to="/org/opportunities">
                                        <span className="material-symbols-outlined">event_note</span>
                                        Manage Events
                                    </Link>
                                    <Link className="quick-action" to="/org/applicants">
                                        <span className="material-symbols-outlined">group</span>
                                        View Applicants
                                    </Link>
                                    <Link className="quick-action" to="/org/applicants">
                                        <span className="material-symbols-outlined">fact_check</span>
                                        Review Applications
                                    </Link>
                                    <Link className="quick-action" to="/org/report-center">
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 0' }}>bar_chart</span>
                                        View Reports
                                    </Link>
                                    <Link className="quick-action" to="/org/report-center">
                                        <span className="material-symbols-outlined">download</span>
                                        Download Reports
                                    </Link>
                                </div>
                            </article>
                        </div>
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
                    <span
                        className="material-symbols-outlined text-primary text-3xl"
                        style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                        hub
                    </span>
                    <span className="font-bold text-headline-md text-primary" style={{ fontFamily: "var(--font-display)" }}>
                        EVENTIFY
                    </span>
                </Link>
                <span className="admin-badge mb-6 w-fit">Organizer console</span>
                <div className="nav-group flex flex-1 flex-col gap-1">
                    <Link className="nav-link" to="/org/dashboard" aria-current="page">
                        <span className="material-symbols-outlined" aria-hidden="true">dashboard</span>
                        Dashboard
                    </Link>
                    <Link className="nav-link" to="/org/posts">
                        <span className="material-symbols-outlined" aria-hidden="true">campaign</span>
                        Posts
                    </Link>
                    <Link className="nav-link" to="/org/profile">
                        <span className="material-symbols-outlined" aria-hidden="true">apartment</span>
                        Organization Profile
                    </Link>
                    <Link className="nav-link" to="/org/opportunities">
                        <span className="material-symbols-outlined" aria-hidden="true">event_note</span>
                        My Opportunities
                    </Link>
                    <Link className="nav-link" to="/org/create-event">
                        <span className="material-symbols-outlined" aria-hidden="true">add_circle</span>
                        Create Event
                    </Link>
                    <Link className="nav-link" to="/org/applicants">
                        <span className="material-symbols-outlined" aria-hidden="true">group</span>
                        Applicants
                    </Link>
                    <Link className="nav-link" to="/org/report-center">
                        <span className="material-symbols-outlined" aria-hidden="true">bar_chart</span>
                        Reports
                    </Link>
                    <Link className="nav-link" to="/org/settings">
                        <span className="material-symbols-outlined" aria-hidden="true">settings</span>
                        Settings
                    </Link>
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
