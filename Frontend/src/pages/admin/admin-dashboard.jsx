import { useEffect } from 'react'
import './dashboard.js'

export default function AdminDashboard() {
    useEffect(() => window.initAdminDashboard(), [])

    return (
        <>
            <meta charSet="utf-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <title>Overview | EVENTIFY</title>
            <meta
                name="description"
                content="Admin Dashboard on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
            />
            <meta property="og:title" content="Admin Dashboard | EVENTIFY" />
            <meta
                property="og:description"
                content="Admin Dashboard on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
            />
            <meta property="og:type" content="website" />
            <meta property="og:image" content="../assets/images/event1.jpeg" />
            <link rel="icon" href="../assets/images/favicon.svg" type="image/svg+xml" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link
                href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"
                rel="stylesheet"
            />
            <link rel="stylesheet" href="../assets/css/theme.css" />
            <style
                dangerouslySetInnerHTML={{
                    __html:
                        "\n    @font-face {\n        font-family: 'Material Symbols Outlined';\n        font-style: normal;\n        font-weight: 100 700;\n        font-display: block;\n        src: url('../assets/fonts/material-symbols-outlined.woff2') format('woff2');\n    }\n    .material-symbols-outlined {\n        font-family: 'Material Symbols Outlined';\n        font-weight: normal;\n        font-style: normal;\n        font-size: 24px;\n        line-height: 1;\n        letter-spacing: normal;\n        text-transform: none;\n        display: inline-block;\n        white-space: nowrap;\n        overflow: hidden;\n        word-wrap: normal;\n        direction: ltr;\n        -webkit-font-feature-settings: 'liga';\n        -webkit-font-smoothing: antialiased;\n    }\n    "
                }}
            />
            <style
                dangerouslySetInnerHTML={{
                    __html:
                        "\n        .glass-sidebar { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border-right: 1px solid #E2E8F0; }\n        .glass-header { background: rgba(250, 248, 255, 0.8); backdrop-filter: blur(12px); }\n        .card-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }\n        .card-lift:hover { transform: translateY(-4px); box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.08); }\n        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; vertical-align: middle; }\n        body { min-height: max(884px, 100dvh); }\n\n        /* Entrance animations */\n        @keyframes adm-fade-up {\n            from { opacity: 0; transform: translateY(14px); }\n            to   { opacity: 1; transform: translateY(0); }\n        }\n        @keyframes adm-fade-in {\n            from { opacity: 0; }\n            to   { opacity: 1; }\n        }\n        @media (prefers-reduced-motion: no-preference) {\n            .adm-enter { animation: adm-fade-up 0.42s cubic-bezier(0.22, 1, 0.36, 1) both; }\n            .adm-enter-fast { animation: adm-fade-up 0.28s cubic-bezier(0.22, 1, 0.36, 1) both; }\n            .adm-fade { animation: adm-fade-in 0.36s ease both; }\n        }\n        /* Staggered stat cards */\n        .stat-grid .stat-card:nth-child(1) { animation-delay: 0.05s; }\n        .stat-grid .stat-card:nth-child(2) { animation-delay: 0.10s; }\n        .stat-grid .stat-card:nth-child(3) { animation-delay: 0.15s; }\n        .stat-grid .stat-card:nth-child(4) { animation-delay: 0.20s; }\n        .stat-grid .stat-card:nth-child(5) { animation-delay: 0.25s; }\n        .stat-grid .stat-card:nth-child(6) { animation-delay: 0.30s; }\n        /* Pending action cards stagger */\n        #pending-actions > * { animation: adm-fade-up 0.38s cubic-bezier(0.22, 1, 0.36, 1) both; }\n        #pending-actions > *:nth-child(1) { animation-delay: 0.08s; }\n        #pending-actions > *:nth-child(2) { animation-delay: 0.14s; }\n        #pending-actions > *:nth-child(3) { animation-delay: 0.20s; }\n        #pending-actions > *:nth-child(4) { animation-delay: 0.26s; }\n        /* Sections stagger */\n        .dash-section { animation: adm-fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }\n        .dash-section:nth-of-type(1) { animation-delay: 0.35s; }\n        .dash-section:nth-of-type(2) { animation-delay: 0.42s; }\n        .dash-section:nth-of-type(3) { animation-delay: 0.48s; }\n        .dash-section:nth-of-type(n+4) { animation-delay: 0.54s; }\n        @media (prefers-reduced-motion: reduce) {\n            .adm-enter, .adm-enter-fast, .adm-fade, #pending-actions > *, .dash-section { animation: none !important; }\n        }\n        /* Pending Actions banner style */\n        .pending-banner {\n            background: color-mix(in srgb, var(--accent) 6%, var(--surface));\n            border: 1px solid color-mix(in srgb, var(--accent) 18%, transparent);\n            border-radius: var(--radius-lg, 20px);\n            padding: 16px 20px;\n            margin-bottom: 8px;\n            display: flex;\n            align-items: center;\n            gap: 10px;\n            font-size: 13px;\n            font-weight: 600;\n            color: var(--accent);\n        }\n        .pending-banner .material-symbols-outlined { font-size: 20px; color: var(--accent); }\n    "
                }}
            />
            <header className="lg:hidden glass-header w-full sticky top-0 z-40 flex justify-between items-center px-4 h-16 shadow-sm">
                <a className="flex items-center gap-2" href="/">
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
                </a>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                    <a className="flex items-center gap-3 mb-2" href="/">
                        <span
                            className="material-symbols-outlined text-primary text-3xl"
                            style={{ fontVariationSettings: '"FILL" 1' }}
                        >
                            hub
                        </span>
                        <h1 className="font-bold text-headline-md text-primary">EVENTIFY</h1>
                    </a>
                    <span className="admin-badge mb-8 w-fit">Admin console</span>
                    <nav className="flex flex-1 flex-col gap-1" aria-label="Admin sections">
                        <div className="nav-group">
                            <a
                                className="nav-link"
                                href="/admin/dashboard"
                                aria-current="page"
                            >
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    dashboard
                                </span>
                                Overview
                            </a>
                            <a className="nav-link" href="/admin/events">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    trophy
                                </span>
                                Competitions &amp; Events
                            </a>
                            <a className="nav-link" href="/admin/users">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    group
                                </span>
                                Participants
                            </a>
                            <a className="nav-link" href="/admin/verify-organizations">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    verified
                                </span>
                                Organizations
                            </a>
                            <a className="nav-link" href="/admin/categories">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    category
                                </span>
                                Categories
                            </a>
                            <a className="nav-link" href="/admin/reports">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    flag
                                </span>
                                Reports
                            </a>
                            <a className="nav-link" href="/admin/audit-log">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    history
                                </span>
                                Audit log
                            </a>
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
                                        <a
                                            className="org-dropdown__item"
                                            href="/admin/verify-organizations"
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
                                        </a>
                                        <a className="org-dropdown__item" href="/admin/reports">
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
                                        </a>
                                        <a className="org-dropdown__item" href="/admin/audit-log">
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
                                        </a>
                                    </div>
                                    <div className="pt-2 mt-1 border-t border-outline-variant/40">
                                        <a
                                            href="/admin/audit-log"
                                            className="block text-center text-xs font-semibold text-primary hover:underline py-1"
                                        >
                                            View all activity →
                                        </a>
                                    </div>
                                </div>
                            </div>
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
                                    <a
                                        className="org-dropdown__item text-error hover:bg-error/10"
                                        href="/auth/login"
                                    >
                                        <span
                                            className="material-symbols-outlined text-[18px] text-error"
                                            aria-hidden="true"
                                        >
                                            logout
                                        </span>
                                        <span className="text-error font-medium">Sign out</span>
                                    </a>
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
                                <option value="custom">Custom range…</option>
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
                    <div
                        id="custom-range"
                        className="custom-range"
                        hidden=""
                        style={{ margin: "12px 0" }}
                    >
                        <input
                            className="input-primary"
                            type="date"
                            id="custom-from"
                            aria-label="From date"
                        />
                        <span style={{ color: "var(--text-muted)" }}>to</span>
                        <input
                            className="input-primary"
                            type="date"
                            id="custom-to"
                            aria-label="To date"
                        />
                        <button className="btn-primary" type="button" id="custom-apply">
                            Apply
                        </button>
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
                                    <a
                                        className="btn-secondary"
                                        style={{ padding: ".4rem .8rem" }}
                                        href="/admin/events"
                                    >
                                        All events
                                    </a>
                                </div>
                                <div id="upcoming-events" />
                            </article>
                            <article className="panel">
                                <div className="panel__head">
                                    <div>
                                        <h3>Top competitions</h3>
                                    </div>
                                    <a
                                        className="btn-secondary"
                                        style={{ padding: ".4rem .8rem" }}
                                        href="/admin/events"
                                    >
                                        All competitions
                                    </a>
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
                                    <a
                                        className="btn-secondary"
                                        style={{ padding: ".4rem .8rem" }}
                                        href="/admin/verify-organizations"
                                    >
                                        All organizations
                                    </a>
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
                            <a
                                className="btn-secondary"
                                style={{ padding: ".5rem 1rem" }}
                                href="/admin/users"
                            >
                                Open all
                            </a>
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
                                    <a
                                        className="btn-secondary"
                                        style={{ padding: ".4rem .8rem" }}
                                        href="/admin/audit-log"
                                    >
                                        View full audit log
                                    </a>
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
                                    <a className="quick-action" href="/admin/events">
                                        <span className="material-symbols-outlined">add_circle</span>
                                        Create competition
                                    </a>
                                    <a className="quick-action" href="/admin/events">
                                        <span className="material-symbols-outlined">edit_calendar</span>
                                        Create event
                                    </a>
                                    <a className="quick-action" href="/admin/users">
                                        <span className="material-symbols-outlined">how_to_reg</span>
                                        Registrations
                                    </a>
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
                <a
                    className="flex items-center gap-3 mb-1"
                    href="/"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 4
                    }}
                >
                    <span
                        className="material-symbols-outlined text-primary"
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
                </a>
                <span className="admin-badge">Admin console</span>
                <div className="nav-group" style={{ marginTop: 16 }}>
                    <a className="nav-link" href="/admin/dashboard" aria-current="page">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            dashboard
                        </span>
                        Overview
                    </a>
                    <a className="nav-link" href="/admin/events">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            trophy
                        </span>
                        Competitions &amp; Events
                    </a>
                    <a className="nav-link" href="/admin/users">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            group
                        </span>
                        Participants
                    </a>
                    <a className="nav-link" href="/admin/verify-organizations">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            verified
                        </span>
                        Organizations
                    </a>
                    <a className="nav-link" href="/admin/categories">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            category
                        </span>
                        Categories
                    </a>
                    <a className="nav-link" href="/admin/reports">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            flag
                        </span>
                        Reports
                    </a>
                    <a className="nav-link" href="/admin/audit-log">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            history
                        </span>
                        Audit log
                    </a>
                </div>
            </nav>
        </>
    )
}
