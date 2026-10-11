import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import AppPageHead from '../../components/app/AppPageHead'
import './dashboard.js'
import { useAdminPageControls } from './useAdminPageControls.js'
import AdminSidebar, { AdminMobileHeader } from '../../components/admin/AdminSidebar'
import LangToggleBtn from '../../components/org/LangToggleBtn'
import '../../styles/admin/admin.css'

export default function AdminDashboard() {
    useAdminPageControls({ mobileNavigation: false })
    useEffect(() => window.initAdminDashboard(), [])

    return (
        <>
            <AppPageHead title="Overview | EVENTIFY" />
            <AdminMobileHeader />
            <div className="flex min-h-screen">
                <AdminSidebar />
                <main className="flex-1 w-full px-4 md:px-10 py-6 pb-24 lg:pb-10">
                    {/* Global Top Header: page title (left) + global controls (right) */}
                    <div className="admin-topbar">
                        <h1 className="admin-topbar__title">Overview</h1>
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
                    {/* Page content: description + page-specific actions (unchanged data/behavior) */}
                    <div
                        className="flex flex-wrap items-center justify-between gap-4"
                        style={{ marginBottom: 24 }}
                    >
                        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                            Users, organizations, competitions, events and registrations at a
                            glance. <span id="dash-updated" className="mono" />
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <label className="sr-only" htmlFor="range-select">
                                Date range
                            </label>
                            <select
                                className="input-primary"
                                id="range-select"
                                defaultValue="month"
                                style={{ width: "auto" }}
                            >
                                <option value="today">Today</option>
                                <option value="week">This week</option>
                                <option value="month">
                                    This month
                                </option>
                                <option value="quarter">Last 3 months</option>
                                <option value="year">This year</option>
                            </select>
                            <button className="btn-secondary" type="button" id="btn-dash-refresh">
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: 18 }}
                                >
                                    refresh
                                </span>{" "}
                                Refresh
                            </button>
                            <button className="btn-primary" type="button" id="btn-dash-export">
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: 18 }}
                                >
                                    download
                                </span>{" "}
                                Export
                            </button>
                        </div>
                    </div>
                    <div className="state-error" id="dash-error" hidden="">
                        <span
                            className="material-symbols-outlined"
                            style={{ fontSize: 32, color: "#B3261E" }}
                            aria-hidden="true"
                        >
                            cloud_off
                        </span>
                        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                            The dashboard could not load
                        </h3>
                        <p
                            id="dash-error-message"
                            style={{ color: "var(--text-muted)", fontSize: 14 }}
                        />
                        <button className="btn-primary" type="button" id="dash-retry">
                            Try again
                        </button>
                    </div>
                    {/* 0. PENDING ACTIONS */}
                    <section
                        className="dash-section adm-enter"
                        style={{ marginTop: 24, animationDelay: "0.1s" }}
                        aria-label="Pending actions"
                    >
                        <div className="dash-section__head" style={{ marginBottom: 12 }}>
                            <div>
                                <h2>Pending Actions</h2>
                                <p>Items waiting on admin review right now.</p>
                            </div>
                        </div>
                        <div
                            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                            id="pending-actions"
                        />
                    </section>
                    {/* 1. PRIMARY KPIs */}
                    <section id="stat-blocks" aria-live="polite" style={{ marginTop: 8 }} />
                    {/* 2. PLATFORM GROWTH */}
                    <section className="dash-section">
                        <article className="panel">
                            <div className="panel__head">
                                <div>
                                    <h3>Platform Growth</h3>
                                    <p>Users, organizations, events and registrations over time</p>
                                </div>
                                <div
                                    className="seg"
                                    id="platform-growth-range"
                                    role="group"
                                    aria-label="Platform growth range"
                                >
                                    <button type="button" data-range="7d" aria-pressed="false">
                                        7D
                                    </button>
                                    <button type="button" data-range="30d" aria-pressed="true">
                                        30D
                                    </button>
                                    <button type="button" data-range="3m" aria-pressed="false">
                                        3M
                                    </button>
                                    <button type="button" data-range="1y" aria-pressed="false">
                                        1Y
                                    </button>
                                </div>
                            </div>
                            <div className="chart-shell">
                                <canvas
                                    id="chart-platform-growth"
                                    role="img"
                                    aria-label="Platform growth"
                                />
                            </div>
                        </article>
                    </section>
                    {/* 3. CORE ANALYTICS */}
                    <section className="dash-section">
                        <div className="chart-grid chart-grid--split">
                            <article className="panel">
                                <div className="panel__head">
                                    <div>
                                        <h3>Competitions over time</h3>
                                        <p>Created, active and completed</p>
                                    </div>
                                </div>
                                <div className="chart-shell">
                                    <canvas
                                        id="chart-competitions"
                                        role="img"
                                        aria-label="Competitions over time"
                                    />
                                </div>
                            </article>
                            <article className="panel">
                                <div className="panel__head">
                                    <div>
                                        <h3>By category</h3>
                                        <p id="categories-total" className="mono" />
                                    </div>
                                </div>
                                <div className="chart-shell chart-shell--doughnut">
                                    <canvas
                                        id="chart-categories"
                                        role="img"
                                        aria-label="Competitions by category"
                                    />
                                </div>
                            </article>
                        </div>
                    </section>
                    <section className="dash-section">
                        <div className="chart-grid chart-grid--split">
                            <article className="panel">
                                <div className="panel__head">
                                    <div>
                                        <h3>Events Overview</h3>
                                        <p>Approved, pending, rejected, active and completed</p>
                                    </div>
                                </div>
                                <div id="events-overview" style={{ marginBottom: 14 }} />
                                <div className="chart-shell chart-shell--sm">
                                    <canvas
                                        id="chart-events-overview"
                                        role="img"
                                        aria-label="Events by status"
                                    />
                                </div>
                            </article>
                            <article className="panel">
                                <div className="panel__head">
                                    <div>
                                        <h3>Registration Overview</h3>
                                        <p>Is registration volume trending up or down?</p>
                                    </div>
                                </div>
                                <div id="registration-overview" style={{ marginBottom: 14 }} />
                                <div className="chart-shell chart-shell--sm">
                                    <canvas
                                        id="chart-registration-overview"
                                        role="img"
                                        aria-label="Registration trend"
                                    />
                                </div>
                            </article>
                        </div>
                    </section>
                    {/* 4. PARTICIPATION / AI INSIGHTS */}
                    <section className="dash-section">
                        <div className="chart-grid chart-grid--half">
                            <article className="panel">
                                <div className="panel__head">
                                    <div>
                                        <h3>Participation Funnel</h3>
                                        <p>From event views to actual participation</p>
                                    </div>
                                </div>
                                <div id="funnel" />
                            </article>
                            <article className="panel">
                                <div className="panel__head">
                                    <div>
                                        <h3>AI Matching Overview</h3>
                                        <p>
                                            How well AI matching is connecting participants to
                                            opportunities
                                        </p>
                                    </div>
                                </div>
                                <div id="ai-matching" />
                            </article>
                        </div>
                    </section>
                    {/* 5. OPERATIONAL INFORMATION */}
                    <section className="dash-section">
                        <div className="chart-grid chart-grid--half">
                            <article className="panel">
                                <div className="panel__head">
                                    <div>
                                        <h3>Upcoming events</h3>
                                    </div>
                                    <Link
                                        className="btn-secondary"
                                        style={{ padding: ".4rem .8rem" }}
                                        to="/admin/events"
                                    >
                                        All events
                                    </Link>
                                </div>
                                <div id="upcoming-events" />
                            </article>
                            <article className="panel">
                                <div className="panel__head">
                                    <div>
                                        <h3>Top competitions</h3>
                                    </div>
                                    <Link
                                        className="btn-secondary"
                                        style={{ padding: ".4rem .8rem" }}
                                        to="/admin/events"
                                    >
                                        All competitions
                                    </Link>
                                </div>
                                <div id="top-competitions" />
                            </article>
                        </div>
                    </section>
                    <section className="dash-section">
                        <div className="chart-grid chart-grid--half">
                            <article className="panel">
                                <div className="panel__head">
                                    <div>
                                        <h3>Users Overview</h3>
                                        <p>Growth and role distribution</p>
                                    </div>
                                </div>
                                <div id="users-overview" style={{ marginBottom: 14 }} />
                                <div className="chart-shell chart-shell--sm">
                                    <canvas
                                        id="chart-users-growth"
                                        role="img"
                                        aria-label="User growth"
                                    />
                                </div>
                                <div id="users-breakdown" style={{ marginTop: 14 }} />
                            </article>
                            <article className="panel panel--flush">
                                <div className="panel__head" style={{ padding: "20px 20px 0" }}>
                                    <div>
                                        <h3>Organization Performance</h3>
                                        <p>Top organizations by activity</p>
                                    </div>
                                    <Link
                                        className="btn-secondary"
                                        style={{ padding: ".4rem .8rem" }}
                                        to="/admin/verify-organizations"
                                    >
                                        All organizations
                                    </Link>
                                </div>
                                <div className="table-scroll">
                                    <table className="dash-table">
                                        <caption className="sr-only">Top organizations</caption>
                                        <thead>
                                            <tr>
                                                <th scope="col">Organization</th>
                                                <th scope="col">Events</th>
                                                <th scope="col">Registrations</th>
                                                <th scope="col">Participants</th>
                                                <th scope="col">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody id="top-organizations" />
                                    </table>
                                </div>
                            </article>
                        </div>
                    </section>
                    <section className="dash-section">
                        <div className="dash-section__head">
                            <div>
                                <h2>Registrations to review</h2>
                                <p>Approve or reject the latest participant registrations.</p>
                            </div>
                            <Link
                                className="btn-secondary"
                                style={{ padding: ".5rem 1rem" }}
                                to="/admin/users"
                            >
                                Open all
                            </Link>
                        </div>
                        <article className="panel panel--flush">
                            <div className="table-scroll">
                                <table className="dash-table">
                                    <caption className="sr-only">
                                        Latest participant registrations
                                    </caption>
                                    <thead>
                                        <tr>
                                            <th scope="col">Participant</th>
                                            <th scope="col">Competition / Event</th>
                                            <th scope="col">Registered</th>
                                            <th scope="col">Status</th>
                                            <th scope="col" style={{ textAlign: "right" }}>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody id="registrations-body" />
                                </table>
                            </div>
                        </article>
                    </section>
                    {/* 6. INSIGHTS & PERFORMANCE */}
                    <section className="dash-section">
                        <div className="chart-grid chart-grid--half">
                            <article className="panel">
                                <div className="panel__head">
                                    <div>
                                        <h3>Platform Insights</h3>
                                        <p>What the numbers are saying this period</p>
                                    </div>
                                </div>
                                <div id="insights" />
                            </article>
                            <article className="panel panel--flush">
                                <div className="panel__head" style={{ padding: "20px 20px 0" }}>
                                    <div>
                                        <h3>Platform Performance</h3>
                                        <p>Headline metrics vs. the previous period</p>
                                    </div>
                                </div>
                                <div className="table-scroll">
                                    <table className="dash-table">
                                        <caption className="sr-only">
                                            Platform performance summary
                                        </caption>
                                        <thead>
                                            <tr>
                                                <th scope="col">Metric</th>
                                                <th scope="col">Current</th>
                                                <th scope="col">Previous</th>
                                                <th scope="col">Change</th>
                                                <th scope="col">Trend</th>
                                            </tr>
                                        </thead>
                                        <tbody id="performance-summary" />
                                    </table>
                                </div>
                            </article>
                        </div>
                    </section>
                    {/* 7. RECENT ACTIVITY & QUICK ACTIONS */}
                    <section className="dash-section">
                        <div className="chart-grid chart-grid--half">
                            <article className="panel">
                                <div className="panel__head">
                                    <div>
                                        <h3>Recent activity</h3>
                                    </div>
                                    <Link
                                        className="btn-secondary"
                                        style={{ padding: ".4rem .8rem" }}
                                        to="/admin/audit-log"
                                    >
                                        View full audit log
                                    </Link>
                                </div>
                                <div id="recent-activity" />
                            </article>
                            <article className="panel">
                                <div className="panel__head">
                                    <div>
                                        <h3>Quick actions</h3>
                                    </div>
                                </div>
                                <div
                                    className="quick-grid"
                                    style={{ gridTemplateColumns: "repeat(2,minmax(0,1fr))" }}
                                >
                                    <Link className="quick-action" to="/admin/events">
                                        <span className="material-symbols-outlined">add_circle</span>
                                        Create competition
                                    </Link>
                                    <Link className="quick-action" to="/admin/events">
                                        <span className="material-symbols-outlined">edit_calendar</span>
                                        Create event
                                    </Link>
                                    <Link className="quick-action" to="/admin/users">
                                        <span className="material-symbols-outlined">how_to_reg</span>
                                        Registrations
                                    </Link>
                                </div>
                                <div id="status-overview" style={{ marginTop: 20 }} />
                            </article>
                        </div>
                    </section>
                    <dialog
                        className="confirm-dialog"
                        id="confirm-dialog"
                        aria-labelledby="confirm-title"
                    >
                        <h3 id="confirm-title">Are you sure?</h3>
                        <p />
                        <div className="confirm-dialog__actions">
                            <button className="btn-secondary" type="button" data-cancel="">
                                Cancel
                            </button>
                            <button className="btn-primary" type="button" data-confirm="">
                                Confirm
                            </button>
                        </div>
                    </dialog>
                </main>
            </div>
        </>
    )
}

