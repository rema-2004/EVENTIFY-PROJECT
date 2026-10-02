import { Link } from 'react-router-dom'
import AppPageHead from '../../components/app/AppPageHead'
import { useAdminPageControls } from './useAdminPageControls.js'
import LangToggleBtn from '../../components/org/LangToggleBtn'
import '../../styles/admin/admin.css'

export default function AdminEvents() {
    useAdminPageControls()
    return (
        <>
            <AppPageHead title="Review Events | EVENTIFY" />
            <header className="lg:hidden glass-header w-full sticky top-0 z-50 flex justify-between items-center px-4 h-16 shadow-sm">
                <Link className="flex items-center gap-2" to="/">
                    <span
                        className="material-symbols-outlined text-primary"
                        style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                        hub
                    </span>
                    <h1 className="font-bold text-headline-lg-mobile text-primary">
                        EVENTIFY
                    </h1>
                </Link>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <LangToggleBtn small />
                    <span className="admin-badge">Admin</span>
                    <button
                        className="mobile-hamburger"
                        id="admin-hamburger"
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
                <aside className="admin-accent-sidebar hidden lg:flex flex-col w-[280px] h-screen sticky top-0 glass-sidebar z-50 p-6">
                    <Link className="flex items-center gap-3 mb-2" to="/">
                        <span
                            className="material-symbols-outlined text-primary text-3xl"
                            style={{ fontVariationSettings: '"FILL" 1' }}
                        >
                            hub
                        </span>
                        <h1 className="font-bold text-headline-md text-primary">EVENTIFY</h1>
                    </Link>
                    <span className="admin-badge mb-8 w-fit">Admin console</span>
                    <nav className="flex flex-1 flex-col gap-1" aria-label="Admin sections">
                        <div className="nav-group">
                            <Link className="nav-link" to="/admin/dashboard">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    dashboard
                                </span>
                                Overview
                            </Link>
                            <Link className="nav-link" to="/admin/events" aria-current="page">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    trophy
                                </span>
                                Competitions &amp; Events
                            </Link>
                            <Link className="nav-link" to="/admin/users">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    group
                                </span>
                                Participants
                            </Link>
                            <Link className="nav-link" to="/admin/verify-organizations">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    verified
                                </span>
                                Organizations
                            </Link>
                            <Link className="nav-link" to="/admin/categories">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    category
                                </span>
                                Categories
                            </Link>
                            <Link className="nav-link" to="/admin/reports">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    flag
                                </span>
                                Reports
                            </Link>
                            <Link className="nav-link" to="/admin/audit-log">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    history
                                </span>
                                Audit log
                            </Link>
                        </div>
                    </nav>
                    <div className="mt-auto rounded-2xl bg-surface-container p-4">
                        <p className="mb-2 text-label-sm font-label-sm text-on-surface-variant">
                            SIGNED IN AS
                        </p>
                        <p className="mb-1 font-label-md text-label-md text-on-surface">
                            Platform Admin
                        </p>
                        <p
                            className="text-label-sm font-label-sm"
                            style={{ color: "var(--accent)", fontWeight: 600 }}
                        >
                            Full access
                        </p>
                    </div>
                </aside>
                <main className="flex-1 w-full px-4 md:px-10 pt-6 pb-24 lg:pb-8">
                    {/* Global Top Header: page title (left) + global controls (right) */}
                    <div className="admin-topbar">
                        <h1 className="admin-topbar__title">Review Events</h1>
                        <div className="admin-topbar__right">
                            <div className="org-dropdown">
                                <button
                                    className="icon-btn"
                                    id="admin-notif-toggle"
                                    type="button"
                                    aria-label="Notifications (3 unread)"
                                    aria-expanded="false"
                                >
                                    <span className="material-symbols-outlined">notifications</span>
                                    <span className="icon-btn__dot" />
                                </button>
                                <div
                                    className="org-dropdown__panel org-dropdown__panel--notif"
                                    id="admin-notif-panel"
                                    hidden=""
                                    role="menu"
                                    aria-label="Notifications"
                                >
                                    <div className="flex items-center justify-between px-3 py-2 border-b border-outline-variant/40 mb-1">
                                        <span className="font-semibold text-xs text-on-surface">
                                            Notifications
                                        </span>
                                        <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                            3 unread
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <Link
                                            className="org-dropdown__item"
                                            to="/admin/verify-organizations"
                                        >
                                            <span
                                                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                                style={{
                                                    background: "var(--surface-2)",
                                                    color: "var(--accent)"
                                                }}
                                            >
                                                <span
                                                    className="material-symbols-outlined text-[18px]"
                                                    aria-hidden="true"
                                                >
                                                    verified
                                                </span>
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="block font-medium text-xs leading-snug">
                                                    DesignHub Amman is awaiting verification
                                                </span>
                                                <span className="org-dropdown__meta">1 hour ago</span>
                                            </span>
                                        </Link>
                                        <Link className="org-dropdown__item" to="/admin/reports">
                                            <span
                                                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                                style={{
                                                    background: "var(--surface-2)",
                                                    color: "var(--accent)"
                                                }}
                                            >
                                                <span
                                                    className="material-symbols-outlined text-[18px]"
                                                    aria-hidden="true"
                                                >
                                                    flag
                                                </span>
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="block font-medium text-xs leading-snug">
                                                    New report filed on "Cloud Native Bootcamp"
                                                </span>
                                                <span className="org-dropdown__meta">3 hours ago</span>
                                            </span>
                                        </Link>
                                        <Link className="org-dropdown__item" to="/admin/audit-log">
                                            <span
                                                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                                style={{
                                                    background: "var(--surface-2)",
                                                    color: "var(--accent)"
                                                }}
                                            >
                                                <span
                                                    className="material-symbols-outlined text-[18px]"
                                                    aria-hidden="true"
                                                >
                                                    gpp_maybe
                                                </span>
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="block font-medium text-xs leading-snug">
                                                    Sensitive operation: account suspended by Sara Al-Khatib
                                                </span>
                                                <span className="org-dropdown__meta">Yesterday</span>
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="pt-2 mt-1 border-t border-outline-variant/40">
                                        <Link
                                            to="/admin/audit-log"
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
                                    id="admin-profile-toggle"
                                    type="button"
                                    aria-label="Admin menu"
                                    aria-expanded="false"
                                    style={{ cursor: "pointer" }}
                                >
                                    <span className="dash-profile__avatar">PA</span>
                                    <span style={{ fontSize: 13, fontWeight: 600 }}>
                                        Platform Admin
                                    </span>
                                    <span
                                        className="material-symbols-outlined"
                                        style={{ fontSize: 18, color: "var(--text-muted)" }}
                                    >
                                        expand_more
                                    </span>
                                </button>
                                <div
                                    className="org-dropdown__panel org-dropdown__panel--profile"
                                    id="admin-profile-panel"
                                    hidden=""
                                    role="menu"
                                    aria-label="Admin menu"
                                >
                                    <div className="px-3 py-2 border-b border-outline-variant/40 mb-1">
                                        <p className="font-semibold text-xs text-on-surface">
                                            Platform Admin
                                        </p>
                                        <p className="text-[11px] text-on-surface-variant truncate">
                                            Full access
                                        </p>
                                    </div>
                                    <Link
                                        className="org-dropdown__item text-error hover:bg-error/10"
                                        to="/auth/login"
                                    >
                                        <span
                                            className="material-symbols-outlined text-[18px] text-error"
                                            aria-hidden="true"
                                        >
                                            logout
                                        </span>
                                        <span className="text-error font-medium">Sign out</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <p className="text-on-surface-variant font-body-md mt-1">
                                Approve or reject events submitted by organizers before they go
                                live.
                            </p>
                        </div>
                    </div>
                    <div
                        className="flex flex-wrap gap-2 mb-6"
                        id="events-tab-group"
                        role="tablist"
                        aria-label="Filter events by status"
                    >
                        <button
                            type="button"
                            className="px-5 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md"
                            data-filter="pending"
                            aria-pressed="true"
                        >
                            Pending <span data-filter-count="">(3)</span>
                        </button>
                        <button
                            type="button"
                            className="px-5 py-2 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors font-label-md text-label-md"
                            data-filter="approved"
                            aria-pressed="false"
                        >
                            Approved <span data-filter-count="">(0)</span>
                        </button>
                        <button
                            type="button"
                            className="px-5 py-2 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors font-label-md text-label-md"
                            data-filter="rejected"
                            aria-pressed="false"
                        >
                            Rejected <span data-filter-count="">(0)</span>
                        </button>
                    </div>
                    <div className="section-card mb-4" id="events-category-banner" hidden="">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-on-surface-variant">
                                Showing events in category:{" "}
                                <strong
                                    className="text-on-surface"
                                    id="events-category-banner-name"
                                />
                            </p>
                            <Link className="btn-secondary" to="/admin/events">
                                Clear filter
                            </Link>
                        </div>
                    </div>
                    <div className="space-y-4" id="events-list">
                        <div
                            className="section-card"
                            data-status="pending"
                            data-category="Course"
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div>
                                    <span className="text-[10px] uppercase tracking-wider text-secondary font-bold">
                                        Course
                                    </span>
                                    <h3 className="font-title-lg text-title-lg text-on-surface mt-1">
                                        DevOps Masterclass
                                    </h3>
                                    <p className="font-label-md text-label-md text-on-surface-variant mt-1">
                                        By TechGenius Labs · Submitted 2 hours ago
                                    </p>
                                    <p className="font-body-md text-body-md text-on-surface-variant mt-3 max-w-2xl">
                                        A hands-on cloud lab covering CI/CD, Kubernetes, and
                                        infrastructure as code over 6 weeks.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Link
                                        to="/admin/event-review-details"
                                        className="btn-secondary"
                                    >
                                        View Details
                                    </Link>
                                    <button
                                        type="button"
                                        className="btn-success"
                                        data-ui-action="approve"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-danger-outline"
                                        data-ui-action="reject"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div
                            className="section-card"
                            data-status="pending"
                            data-category="Workshop"
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div>
                                    <span className="text-[10px] uppercase tracking-wider text-secondary font-bold">
                                        Workshop
                                    </span>
                                    <h3 className="font-title-lg text-title-lg text-on-surface mt-1">
                                        Quantum Computing Bootcamp
                                    </h3>
                                    <p className="font-label-md text-label-md text-on-surface-variant mt-1">
                                        By University of Technology · Submitted yesterday
                                    </p>
                                    <p className="font-body-md text-body-md text-on-surface-variant mt-3 max-w-2xl">
                                        An intensive 3-day introduction to quantum algorithms for
                                        advanced undergraduate students.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Link
                                        to="/admin/event-review-details"
                                        className="btn-secondary"
                                    >
                                        View Details
                                    </Link>
                                    <button
                                        type="button"
                                        className="btn-success"
                                        data-ui-action="approve"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-danger-outline"
                                        data-ui-action="reject"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div
                            className="section-card"
                            data-status="pending"
                            data-category="Competition"
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div>
                                    <span className="text-[10px] uppercase tracking-wider text-secondary font-bold">
                                        Competition
                                    </span>
                                    <h3 className="font-title-lg text-title-lg text-on-surface mt-1">
                                        Product Design Sprint
                                    </h3>
                                    <p className="font-label-md text-label-md text-on-surface-variant mt-1">
                                        By DesignHub Amman · Submitted 3 days ago
                                    </p>
                                    <p className="font-body-md text-body-md text-on-surface-variant mt-3 max-w-2xl">
                                        Teams of 2-4 compete to redesign a real fintech product in 48
                                        hours, judged by industry mentors.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Link
                                        to="/admin/event-review-details"
                                        className="btn-secondary"
                                    >
                                        View Details
                                    </Link>
                                    <button
                                        type="button"
                                        className="btn-success"
                                        data-ui-action="approve"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-danger-outline"
                                        data-ui-action="reject"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div
                            className="section-card"
                            data-status="pending"
                            data-category="Conference"
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div>
                                    <span className="text-[10px] uppercase tracking-wider text-secondary font-bold">
                                        Conference
                                    </span>
                                    <h3 className="font-title-lg text-title-lg text-on-surface mt-1">
                                        Future of AI Summit
                                    </h3>
                                    <p className="font-label-md text-label-md text-on-surface-variant mt-1">
                                        By TechGenius Labs · Submitted 5 hours ago
                                    </p>
                                    <p className="font-body-md text-body-md text-on-surface-variant mt-3 max-w-2xl">
                                        A one-day conference with keynote talks and panels on applied
                                        AI, open to students and industry professionals.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Link
                                        to="/admin/event-review-details"
                                        className="btn-secondary"
                                    >
                                        View Details
                                    </Link>
                                    <button
                                        type="button"
                                        className="btn-success"
                                        data-ui-action="approve"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-danger-outline"
                                        data-ui-action="reject"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="empty-state" id="events-empty" hidden="">
                            <span className="empty-state__icon">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    event_busy
                                </span>
                            </span>
                            <h3>No events in this status</h3>
                            <p>No events match this filter right now.</p>
                        </div>
                    </div>
                </main>
            </div>
            <div className="mobile-nav-overlay" id="admin-mobile-overlay" />
            <nav
                className="mobile-nav-drawer"
                id="admin-mobile-drawer"
                aria-label="Admin navigation"
            >
                <button
                    className="mobile-nav-close"
                    id="admin-nav-close"
                    aria-label="Close navigation"
                >
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                        close
                    </span>
                </button>
                <Link
                    to="/"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 4
                    }}
                >
                    <span
                        className="material-symbols-outlined"
                        style={{
                            fontSize: 28,
                            fontVariationSettings: '"FILL" 1',
                            color: "var(--accent)"
                        }}
                    >
                        hub
                    </span>
                    <span
                        style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            fontSize: 20,
                            color: "var(--accent)"
                        }}
                    >
                        EVENTIFY
                    </span>
                </Link>
                <span className="admin-badge">Admin console</span>
                <div className="nav-group" style={{ marginTop: 16 }}>
                    <Link className="nav-link" to="/admin/dashboard">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            dashboard
                        </span>
                        Overview
                    </Link>
                    <Link className="nav-link" to="/admin/events">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            trophy
                        </span>
                        Competitions &amp; Events
                    </Link>
                    <Link className="nav-link" to="/admin/users">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            group
                        </span>
                        Participants
                    </Link>
                    <Link className="nav-link" to="/admin/verify-organizations">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            verified
                        </span>
                        Organizations
                    </Link>
                    <Link className="nav-link" to="/admin/categories">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            category
                        </span>
                        Categories
                    </Link>
                    <Link className="nav-link" to="/admin/reports">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            flag
                        </span>
                        Reports
                    </Link>
                    <Link className="nav-link" to="/admin/audit-log">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            history
                        </span>
                        Audit log
                    </Link>
                </div>
            </nav>
        </>
    )
}
