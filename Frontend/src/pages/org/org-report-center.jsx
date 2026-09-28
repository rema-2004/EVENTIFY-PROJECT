export default function OrgReportCenter() {
    return (
        <>
            <meta charSet="utf-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <title>Reports | EVENTIFY</title>
            <meta
                name="description"
                content="Organizer Reports on EVENTIFY — create, preview, and download reports for your own events and organization."
            />
            <meta property="og:title" content="Reports | EVENTIFY" />
            <meta
                property="og:description"
                content="Organizer Reports on EVENTIFY — create, preview, and download reports for your own events and organization."
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
            <style
                dangerouslySetInnerHTML={{
                    __html:
                        "\n        @font-face {\n            font-family: 'Material Symbols Outlined';\n            font-style: normal;\n            font-weight: 100 700;\n            font-display: block;\n            src: url('../assets/fonts/material-symbols-outlined.woff2') format('woff2');\n        }\n        .material-symbols-outlined {\n            font-family: 'Material Symbols Outlined';\n            font-weight: normal;\n            font-style: normal;\n            font-size: 24px;\n            line-height: 1;\n            letter-spacing: normal;\n            text-transform: none;\n            display: inline-block;\n            white-space: nowrap;\n            overflow: hidden;\n            word-wrap: normal;\n            direction: ltr;\n            -webkit-font-feature-settings: 'liga';\n            -webkit-font-smoothing: antialiased;\n        }\n    "
                }}
            />
            <style
                dangerouslySetInnerHTML={{
                    __html:
                        "\n        .card-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }\n        .card-lift:hover { transform: translateY(-4px); box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.08); }\n        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; vertical-align: middle; }\n        body { min-height: max(884px, 100dvh); }\n    "
                }}
            />
            <header className="lg:hidden w-full sticky top-0 z-40 flex justify-between items-center px-4 h-16 bg-surface border-b border-border shadow-sm">
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
                <div className="flex items-center gap-2">
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
                    <a className="flex items-center gap-3 mb-2" href="/">
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
                    </a>
                    <span className="admin-badge mb-8 w-fit">Organizer console</span>
                    <nav
                        className="flex flex-1 flex-col gap-1"
                        aria-label="Organizer sections"
                    >
                        <div className="nav-group">
                            <a className="nav-link" href="/org/dashboard">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    dashboard
                                </span>
                                Dashboard
                            </a>
                            <a className="nav-link" href="/org/posts">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    campaign
                                </span>
                                Posts
                            </a>
                            <a className="nav-link" href="/org/profile">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    apartment
                                </span>
                                Organization Profile
                            </a>
                            <a className="nav-link" href="/org/opportunities">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    event_note
                                </span>
                                My Opportunities
                            </a>
                            <a className="nav-link" href="/org/create-event">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    add_circle
                                </span>
                                Create Event
                            </a>
                            <a className="nav-link" href="/org/applicants">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    group
                                </span>
                                Applicants
                            </a>
                            <a
                                className="nav-link"
                                href="/org/report-center"
                                aria-current="page"
                            >
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    bar_chart
                                </span>
                                Reports
                            </a>
                            <a className="nav-link" href="/org/settings">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    settings
                                </span>
                                Settings
                            </a>
                        </div>
                    </nav>
                    <div className="mt-auto rounded-2xl bg-surface-container p-4">
                        <p className="mb-2 text-label-sm font-label-sm text-on-surface-variant">
                            ORGANIZATION
                        </p>
                        <p className="mb-1 font-label-md text-label-md text-on-surface font-semibold">
                            TechGenius Labs
                        </p>
                        <p className="text-label-sm font-label-sm text-success">
                            Verified organizer since 2024
                        </p>
                    </div>
                </aside>
                <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-8">
                    {/* Global Top Header: page title (left) + global controls (right) */}
                    <div className="org-topbar">
                        <h1 className="org-topbar__title">Reports</h1>
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
                                        <a className="org-dropdown__item" href="/org/applicants">
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
                                                    person_add
                                                </span>
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="block font-medium text-xs leading-snug">
                                                    Ahmed Ali applied to Global AI Innovation Challenge
                                                </span>
                                                <span className="org-dropdown__meta">2 hours ago</span>
                                            </span>
                                        </a>
                                        <a className="org-dropdown__item" href="/org/opportunities">
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
                                                    hourglass_top
                                                </span>
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="block font-medium text-xs leading-snug">
                                                    DevOps Masterclass is awaiting approval
                                                </span>
                                                <span className="org-dropdown__meta">Yesterday</span>
                                            </span>
                                        </a>
                                        <a className="org-dropdown__item" href="/org/applicants">
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
                                                    star
                                                </span>
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="block font-medium text-xs leading-snug">
                                                    Frontend Wizards received a new 5-star rating
                                                </span>
                                                <span className="org-dropdown__meta">2 days ago</span>
                                            </span>
                                        </a>
                                    </div>
                                    <div className="pt-2 mt-1 border-t border-outline-variant/40">
                                        <a
                                            href="/org/applicants"
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
                                    id="org-profile-toggle"
                                    type="button"
                                    aria-label="Organization menu"
                                    aria-expanded="false"
                                >
                                    <span className="dash-profile__avatar">TG</span>
                                    <span style={{ fontSize: 13, fontWeight: 600 }}>
                                        TechGenius Labs
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
                                    id="org-profile-panel"
                                    hidden=""
                                    role="menu"
                                    aria-label="Organization menu"
                                >
                                    <div className="px-3 py-2 border-b border-outline-variant/40 mb-1">
                                        <p className="font-semibold text-xs text-on-surface">
                                            TechGenius Labs
                                        </p>
                                        <p className="text-[11px] text-on-surface-variant truncate">
                                            Verified organizer since 2024
                                        </p>
                                    </div>
                                    <a className="org-dropdown__item" href="/org/profile">
                                        <span
                                            className="material-symbols-outlined text-[18px] text-on-surface-variant"
                                            aria-hidden="true"
                                        >
                                            apartment
                                        </span>
                                        <span>Organization Profile</span>
                                    </a>
                                    <a className="org-dropdown__item" href="/org/settings">
                                        <span
                                            className="material-symbols-outlined text-[18px] text-on-surface-variant"
                                            aria-hidden="true"
                                        >
                                            settings
                                        </span>
                                        <span>Settings</span>
                                    </a>
                                    <div className="my-1 border-t border-outline-variant/40" />
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
                    {/* Page Header: breadcrumb, title, description, page-specific actions */}
                    <div className="org-page-header">
                        <div className="flex items-center gap-2 text-sm mb-2">
                            <a
                                className="text-on-surface-variant hover:text-primary transition-colors"
                                href="/org/dashboard"
                            >
                                Dashboard
                            </a>
                            <span className="text-outline">/</span>
                            <span className="font-semibold text-on-surface">Reports</span>
                        </div>
                        <p className="profile-page-desc">
                            Create, preview, and download reports for your own events and
                            organization.
                        </p>
                        <div className="org-page-header__actions">
                            <button
                                type="button"
                                id="btn-refresh-org-reports"
                                className="btn-secondary"
                            >
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: 18, verticalAlign: "middle" }}
                                >
                                    refresh
                                </span>{" "}
                                Refresh
                            </button>
                            <button
                                type="button"
                                id="btn-create-org-report"
                                className="btn-primary"
                            >
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: 18, verticalAlign: "middle" }}
                                >
                                    add
                                </span>{" "}
                                Create Report
                            </button>
                        </div>
                    </div>
                    {/* Stat cards */}
                    <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                        <div className="reports-kpi-card">
                            <p
                                id="org-stat-total"
                                className="text-3xl font-extrabold text-on-surface"
                            >
                                0
                            </p>
                            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                                Total Reports
                            </p>
                        </div>
                        <div className="reports-kpi-card">
                            <p
                                id="org-stat-month"
                                className="text-3xl font-extrabold text-on-surface"
                            >
                                0
                            </p>
                            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                                This Month
                            </p>
                        </div>
                        <div className="reports-kpi-card">
                            <p
                                id="org-stat-completed"
                                className="text-3xl font-extrabold text-on-surface"
                            >
                                0
                            </p>
                            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                                Completed
                            </p>
                        </div>
                        <div className="reports-kpi-card">
                            <p
                                id="org-stat-scheduled"
                                className="text-3xl font-extrabold text-on-surface"
                            >
                                0
                            </p>
                            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                                Scheduled
                            </p>
                        </div>
                    </div>
                    {/* Quick create */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-title-lg font-semibold">Quick Create</h2>
                        <div
                            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
                            id="org-quick-create-grid"
                        />
                    </section>
                    {/* Recent Reports */}
                    <section>
                        <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">
                            Your Reports
                        </h2>
                        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <input
                                type="text"
                                id="org-report-search"
                                className="input-primary"
                                style={{ minWidth: 220 }}
                                placeholder="Search for a report..."
                            />
                            <div className="flex flex-wrap items-center gap-2">
                                <select
                                    id="org-report-filter-type"
                                    className="reports-filter-select"
                                >
                                    <option value="all">All — Report Type</option>
                                    <option value="Event Performance">Event Performance</option>
                                    <option value="Registration Report">Registration</option>
                                    <option value="Participant Report">Participants</option>
                                    <option value="Engagement Report">Engagement</option>
                                    <option value="Overall Organization Report">Organization</option>
                                </select>
                                <select
                                    id="org-report-filter-event"
                                    className="reports-filter-select"
                                >
                                    <option value="all">All Events</option>
                                    <option value="evt-1">Global AI Innovation Challenge</option>
                                    <option value="evt-2">Frontend Wizards</option>
                                    <option value="evt-3">Startup Challenge</option>
                                    <option value="evt-4">DevOps Masterclass</option>
                                    <option value="evt-5">Cloud Native Bootcamp</option>
                                </select>
                                <select
                                    id="org-report-filter-status"
                                    className="reports-filter-select"
                                >
                                    <option value="all">All — Status</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Failed">Failed</option>
                                    <option value="Scheduled">Scheduled</option>
                                </select>
                            </div>
                        </div>
                        <div id="org-reports-skeleton" className="reports-panel" hidden="">
                            <p className="mb-4 text-on-surface-variant">Refreshing reports...</p>
                            <div className="skeleton skeleton-line" />
                            <div className="skeleton skeleton-line" />
                            <div className="skeleton skeleton-line" />
                        </div>
                        <div id="org-reports-empty" className="empty-state" hidden="">
                            <span className="empty-state__icon">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    inbox
                                </span>
                            </span>
                            <h3>No reports yet</h3>
                            <p>
                                Create your first report to track how your events are performing.
                            </p>
                            <button
                                type="button"
                                id="org-empty-create-btn"
                                className="btn-primary"
                            >
                                Create Report
                            </button>
                        </div>
                        <div
                            className="reports-panel rounded-2xl"
                            id="org-reports-table-wrap"
                            style={{ padding: 0, overflow: "hidden" }}
                        >
                            <div className="reports-table-wrap">
                                <table className="reports-table">
                                    <caption className="sr-only">Your reports</caption>
                                    <thead>
                                        <tr>
                                            <th data-sort="name">
                                                Report <span className="sort-arrow" />
                                            </th>
                                            <th data-sort="type">
                                                Type <span className="sort-arrow" />
                                            </th>
                                            <th>Event</th>
                                            <th>Period</th>
                                            <th data-sort="date" data-dir="desc">
                                                Created <span className="sort-arrow" />
                                            </th>
                                            <th>Format</th>
                                            <th data-sort="status">
                                                Status <span className="sort-arrow" />
                                            </th>
                                            <th style={{ textAlign: "right" }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="org-reports-tbody" />
                                </table>
                            </div>
                        </div>
                        <div className="reports-pagination" id="org-reports-pagination" />
                    </section>
                </main>
            </div>
            {/* Mobile Navigation Drawer */}
            <div className="mobile-nav-overlay" id="org-mobile-overlay" />
            <nav
                className="mobile-nav-drawer"
                id="org-mobile-drawer"
                aria-label="Organizer navigation"
            >
                <button
                    className="mobile-nav-close"
                    id="org-nav-close"
                    aria-label="Close navigation"
                >
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                        close
                    </span>
                </button>
                <a className="flex items-center gap-3 mb-2" href="/">
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
                </a>
                <span className="admin-badge mb-6 w-fit">Organizer console</span>
                <div className="nav-group flex flex-1 flex-col gap-1">
                    <a className="nav-link" href="/org/dashboard">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            dashboard
                        </span>
                        Dashboard
                    </a>
                    <a className="nav-link" href="/org/posts">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            campaign
                        </span>
                        Posts
                    </a>
                    <a className="nav-link" href="/org/profile">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            apartment
                        </span>
                        Organization Profile
                    </a>
                    <a className="nav-link" href="/org/opportunities">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            event_note
                        </span>
                        My Opportunities
                    </a>
                    <a className="nav-link" href="/org/create-event">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            add_circle
                        </span>
                        Create Event
                    </a>
                    <a className="nav-link" href="/org/applicants">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            group
                        </span>
                        Applicants
                    </a>
                    <a className="nav-link" href="/org/report-center" aria-current="page">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            bar_chart
                        </span>
                        Reports
                    </a>
                    <a className="nav-link" href="/org/settings">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            settings
                        </span>
                        Settings
                    </a>
                </div>
                <div className="mt-auto rounded-2xl bg-surface-container p-4">
                    <p className="mb-2 text-label-sm font-label-sm text-on-surface-variant">
                        ORGANIZATION
                    </p>
                    <p className="mb-1 font-label-md text-label-md text-on-surface font-semibold">
                        TechGenius Labs
                    </p>
                    <p className="text-label-sm font-label-sm text-success">
                        Verified organizer since 2024
                    </p>
                </div>
            </nav>
            {/* Create Report */}
            <dialog
                className="confirm-dialog confirm-dialog--wide"
                id="create-org-report-dialog"
            >
                <h3>Create Report</h3>
                <form id="create-org-report-form">
                    <div style={{ marginBottom: 14 }}>
                        <label>
                            Report Name
                            <input
                                type="text"
                                id="org-new-report-name"
                                className="input-primary"
                                placeholder="e.g. Monthly Event Performance"
                                required=""
                            />
                        </label>
                    </div>
                    <div className="form-row">
                        <label>
                            Report Type
                            <select id="org-new-report-type" className="input-primary">
                                <option value="Event Performance">Event Performance</option>
                                <option value="Registration Report">Registration Report</option>
                                <option value="Participant Report">Participant Report</option>
                                <option value="Engagement Report">Engagement Report</option>
                                <option value="Overall Organization Report">
                                    Overall Organization Report
                                </option>
                            </select>
                        </label>
                        <label>
                            Event
                            <select id="org-new-report-event" className="input-primary">
                                <option value="All Events">All Events</option>
                                <option value="Global AI Innovation Challenge">
                                    Global AI Innovation Challenge
                                </option>
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
                            <select id="org-new-report-period" className="input-primary" defaultValue="This Month">
                                <option value="This Week">This Week</option>
                                <option value="This Month">
                                    This Month
                                </option>
                                <option value="Last 3 Months">Last 3 Months</option>
                                <option value="This Year">This Year</option>
                                <option value="Custom">Custom</option>
                            </select>
                        </label>
                        <div>
                            <p
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "var(--text-muted)",
                                    marginBottom: 8
                                }}
                            >
                                Format
                            </p>
                            <div className="format-options">
                                <label>
                                    <input
                                        type="radio"
                                        name="org-format"
                                        defaultValue="PDF"
                                        defaultChecked=""
                                    />{" "}
                                    PDF
                                </label>
                                <label>
                                    <input type="radio" name="org-format" defaultValue="Excel" />{" "}
                                    Excel
                                </label>
                                <label>
                                    <input type="radio" name="org-format" defaultValue="CSV" /> CSV
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="confirm-dialog__actions">
                        <button
                            type="button"
                            className="btn-secondary"
                            id="btn-create-org-report-cancel"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            Generate Report
                        </button>
                    </div>
                </form>
            </dialog>
            {/* Delete confirm */}
            <dialog className="confirm-dialog" id="delete-org-report-dialog">
                <h3>Are you sure you want to delete this report?</h3>
                <p id="delete-org-report-name" />
                <div className="confirm-dialog__actions">
                    <button
                        type="button"
                        className="btn-secondary"
                        id="btn-delete-org-report-cancel"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn-primary"
                        id="btn-delete-org-report-confirm"
                        style={{ background: "var(--error, #B3261E)" }}
                    >
                        Delete Report
                    </button>
                </div>
            </dialog>
            {/* Report preview */}
            <dialog
                className="confirm-dialog confirm-dialog--wide"
                id="org-report-preview-dialog"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p
                            style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: "var(--accent)",
                                textTransform: "uppercase"
                            }}
                        >
                            TechGenius Labs
                        </p>
                        <h3 id="org-preview-name">Report</h3>
                        <p
                            id="org-preview-meta"
                            style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 2 }}
                        />
                    </div>
                    <button
                        type="button"
                        id="btn-org-preview-close"
                        className="rounded-full p-2"
                        aria-label="Close preview"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div
                    className="grid grid-cols-2 md:grid-cols-4 gap-3"
                    id="org-preview-summary"
                    style={{ marginTop: 18 }}
                />
                <div className="reports-chart-shell" style={{ marginTop: 18 }}>
                    <canvas id="org-preview-chart" role="img" aria-label="Report chart" />
                </div>
                <div className="reports-table-wrap" style={{ marginTop: 18 }}>
                    <table className="reports-table">
                        <thead id="org-preview-table-head" />
                        <tbody id="org-preview-table-body" />
                    </table>
                </div>
                <div className="confirm-dialog__actions" style={{ marginTop: 18 }}>
                    <button type="button" className="btn-secondary" id="btn-org-download-pdf">
                        Download PDF
                    </button>
                    <button
                        type="button"
                        className="btn-secondary"
                        id="btn-org-download-excel"
                    >
                        Download Excel
                    </button>
                    <button type="button" className="btn-primary" id="btn-org-download-csv">
                        Download CSV
                    </button>
                </div>
            </dialog>
        </>
    )
}
