export default function AdminReports() {
    return (
        <>
            <meta charSet="utf-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <title>Reports | EVENTIFY</title>
            <meta
                name="description"
                content="Reports on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
            />
            <meta property="og:title" content="Reports | EVENTIFY" />
            <meta
                property="og:description"
                content="Reports on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
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
            <link rel="stylesheet" href="admin-reports.css" />
            <style
                dangerouslySetInnerHTML={{
                    __html:
                        "\n        @font-face {\n            font-family: 'Material Symbols Outlined';\n            font-style: normal;\n            font-weight: 100 700;\n            font-display: block;\n            src: url('../assets/fonts/material-symbols-outlined.woff2') format('woff2');\n        }\n        .material-symbols-outlined {\n            font-family: 'Material Symbols Outlined';\n            font-weight: normal;\n            font-style: normal;\n            font-size: 24px;\n            line-height: 1;\n            letter-spacing: normal;\n            text-transform: none;\n            display: inline-block;\n            white-space: nowrap;\n            overflow: hidden;\n            word-wrap: normal;\n            direction: ltr;\n            -webkit-font-feature-settings: 'liga';\n            -webkit-font-smoothing: antialiased;\n            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n            vertical-align: middle;\n        }\n    "
                }}
            />
            <header className="lg:hidden glass-header sticky top-0 z-50 flex h-16 w-full items-center justify-between px-4 shadow-sm">
                <a className="flex items-center gap-2" href="/">
                    <span
                        className="material-symbols-outlined text-primary"
                        style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                        hub
                    </span>
                    <h1 className="text-headline-lg-mobile font-bold text-primary">
                        EVENTIFY
                    </h1>
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
                <aside className="admin-accent-sidebar glass-sidebar sticky top-0 z-50 hidden h-screen w-[280px] flex-col p-6 lg:flex">
                    <a className="mb-2 flex items-center gap-3" href="/">
                        <span
                            className="material-symbols-outlined text-3xl text-primary"
                            style={{ fontVariationSettings: '"FILL" 1' }}
                        >
                            hub
                        </span>
                        <h1 className="text-headline-md font-bold text-primary">EVENTIFY</h1>
                    </a>
                    <span className="admin-badge mb-8 w-fit">Admin console</span>
                    <nav className="flex flex-1 flex-col gap-1" aria-label="Admin sections">
                        <div className="nav-group">
                            <a className="nav-link" href="/admin/dashboard">
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
                            <a className="nav-link" href="/admin/reports" aria-current="page">
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
                <main className="w-full flex-1 px-4 pt-6 pb-24 md:px-10 lg:pb-8">
                    {/* Global Top Header: page title (left) + global controls (right) */}
                    <div className="admin-topbar">
                        <h1 className="admin-topbar__title">Reports</h1>
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
                    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <p className="mt-1 text-on-surface-variant">
                                Manage, create, and review EVENTIFY platform reports
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button type="button" id="btn-refresh" className="btn-secondary">
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: 18 }}
                                >
                                    refresh
                                </span>{" "}
                                Refresh
                            </button>
                            <button type="button" id="btn-create-report" className="btn-primary">
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: 18 }}
                                >
                                    add
                                </span>{" "}
                                Create Report
                            </button>
                        </div>
                    </div>
                    <div className="stat-grid mb-8">
                        <div className="stat-card">
                            <div className="stat-card__top">
                                <span className="stat-card__icon">
                                    <span className="material-symbols-outlined">summarize</span>
                                </span>
                            </div>
                            <p className="stat-card__value" id="stat-total">
                                0
                            </p>
                            <p className="stat-card__label">Total Reports</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card__top">
                                <span className="stat-card__icon">
                                    <span className="material-symbols-outlined">calendar_month</span>
                                </span>
                            </div>
                            <p className="stat-card__value" id="stat-month">
                                0
                            </p>
                            <p className="stat-card__label">Reports This Month</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card__top">
                                <span className="stat-card__icon">
                                    <span className="material-symbols-outlined">task_alt</span>
                                </span>
                            </div>
                            <p className="stat-card__value" id="stat-completed">
                                0
                            </p>
                            <p className="stat-card__label">Completed Reports</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card__top">
                                <span className="stat-card__icon">
                                    <span className="material-symbols-outlined">schedule</span>
                                </span>
                            </div>
                            <p className="stat-card__value" id="stat-scheduled">
                                0
                            </p>
                            <p className="stat-card__label">Scheduled Reports</p>
                        </div>
                    </div>
                    <section className="mb-8">
                        <h2 className="mb-4 text-title-lg font-semibold">
                            Quick Create Report
                        </h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                            <div className="quick-report-card">
                                <div className="quick-report-card__icon">
                                    <span className="material-symbols-outlined">group</span>
                                </div>
                                <div>
                                    <h4>Users Report</h4>
                                    <p>View and analyze user data</p>
                                </div>
                                <button
                                    type="button"
                                    className="btn-quick-create btn-secondary"
                                    data-type="Users"
                                >
                                    Create
                                </button>
                            </div>
                            <div className="quick-report-card">
                                <div className="quick-report-card__icon">
                                    <span className="material-symbols-outlined">trophy</span>
                                </div>
                                <div>
                                    <h4>Events Report</h4>
                                    <p>Comprehensive report on events and competitions</p>
                                </div>
                                <button
                                    type="button"
                                    className="btn-quick-create btn-secondary"
                                    data-type="Events"
                                >
                                    Create
                                </button>
                            </div>
                            <div className="quick-report-card">
                                <div className="quick-report-card__icon">
                                    <span className="material-symbols-outlined">how_to_reg</span>
                                </div>
                                <div>
                                    <h4>Registrations Report</h4>
                                    <p>Analyze registrations and participation</p>
                                </div>
                                <button
                                    type="button"
                                    className="btn-quick-create btn-secondary"
                                    data-type="Registration"
                                >
                                    Create
                                </button>
                            </div>
                            <div className="quick-report-card">
                                <div className="quick-report-card__icon">
                                    <span className="material-symbols-outlined">apartment</span>
                                </div>
                                <div>
                                    <h4>Organizations Report</h4>
                                    <p>Analyze organization performance and activity</p>
                                </div>
                                <button
                                    type="button"
                                    className="btn-quick-create btn-secondary"
                                    data-type="Organizations"
                                >
                                    Create
                                </button>
                            </div>
                            <div className="quick-report-card">
                                <div className="quick-report-card__icon">
                                    <span className="material-symbols-outlined">bolt</span>
                                </div>
                                <div>
                                    <h4>AI Matching Report</h4>
                                    <p>Analyze AI matching system usage</p>
                                </div>
                                <button
                                    type="button"
                                    className="btn-quick-create btn-secondary"
                                    data-type="AI Matching"
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </section>
                    <section>
                        <h2 className="mb-4 text-title-lg font-semibold">Recent Reports</h2>
                        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <input
                                type="text"
                                id="report-search"
                                className="input-primary md:max-w-xs"
                                placeholder="Search for a report..."
                            />
                            <div className="flex flex-wrap items-center gap-2">
                                <select
                                    id="filter-type"
                                    className="reports-filter-select"
                                    aria-label="Report type"
                                >
                                    <option value="all">All — Report Type</option>
                                    <option value="Users">Users</option>
                                    <option value="Events">Events</option>
                                    <option value="Registration">Registrations</option>
                                    <option value="Organizations">Organizations</option>
                                    <option value="AI Matching">AI Matching</option>
                                    <option value="Platform Performance">Platform Performance</option>
                                </select>
                                <select
                                    id="filter-status"
                                    className="reports-filter-select"
                                    aria-label="Status"
                                >
                                    <option value="all">All — Status</option>
                                    <option value="Completed">Completed</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Failed">Failed</option>
                                    <option value="Scheduled">Scheduled</option>
                                </select>
                                <button
                                    type="button"
                                    id="btn-apply-filters"
                                    className="btn-secondary"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                        <div id="reports-skeleton" className="panel" hidden="">
                            <p className="mb-4 text-on-surface-variant">Refreshing reports...</p>
                            <div className="skeleton skeleton-line" />
                            <div className="skeleton skeleton-line" />
                            <div className="skeleton skeleton-line" />
                        </div>
                        <div id="reports-empty" className="empty-state" hidden="">
                            <span className="empty-state__icon">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    inbox
                                </span>
                            </span>
                            <h3>No reports found</h3>
                            <p>No reports match your current search or filters.</p>
                            <button type="button" id="empty-create-btn" className="btn-primary">
                                Create New Report
                            </button>
                        </div>
                        <article className="panel panel--flush" id="reports-table-wrap">
                            <div className="table-scroll">
                                <table className="dash-table">
                                    <caption className="sr-only">Recent Reports</caption>
                                    <thead>
                                        <tr>
                                            <th data-sort="name">
                                                Report <span className="sort-arrow" />
                                            </th>
                                            <th data-sort="type">
                                                Type <span className="sort-arrow" />
                                            </th>
                                            <th>Period</th>
                                            <th>Created By</th>
                                            <th data-sort="date" data-dir="desc">
                                                Date <span className="sort-arrow" />
                                            </th>
                                            <th>Format</th>
                                            <th data-sort="status">
                                                Status <span className="sort-arrow" />
                                            </th>
                                            <th style={{ textAlign: "right" }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="reports-tbody" />
                                </table>
                            </div>
                        </article>
                        <div className="pagination" id="pagination" />
                    </section>
                </main>
            </div>
            {/* Create Report */}
            <dialog
                className="confirm-dialog confirm-dialog--wide"
                id="create-report-dialog"
            >
                <h3>Create Report</h3>
                <form id="create-report-form">
                    <div style={{ marginBottom: 14 }}>
                        <label
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 6,
                                fontSize: 13,
                                fontWeight: 600,
                                color: "var(--text-muted)"
                            }}
                        >
                            Report Name
                            <input
                                type="text"
                                id="new-report-name"
                                className="input-primary"
                                placeholder="e.g. Monthly Events Report"
                                required=""
                            />
                        </label>
                    </div>
                    <div className="form-row">
                        <label>
                            Report Type
                            <select id="new-report-type" className="input-primary">
                                <option value="Users">User Report</option>
                                <option value="Events">Events Report</option>
                                <option value="Registration">Registration Report</option>
                                <option value="Organizations">Organizations Report</option>
                                <option value="AI Matching">AI Matching Report</option>
                                <option value="Platform Performance">Platform Performance</option>
                            </select>
                        </label>
                        <label>
                            Time Period
                            <select id="period-select" className="input-primary" defaultValue="month">
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">
                                    This Month
                                </option>
                                <option value="3m">Last 3 Months</option>
                                <option value="year">This Year</option>
                                <option value="custom">Custom Range</option>
                            </select>
                        </label>
                    </div>
                    <div className="form-row" id="custom-date-range" hidden="">
                        <label>
                            Start Date{" "}
                            <input type="date" className="input-primary" id="custom-start" />
                        </label>
                        <label>
                            End Date{" "}
                            <input type="date" className="input-primary" id="custom-end" />
                        </label>
                    </div>
                    <div style={{ marginBottom: 18 }}>
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
                                    name="format"
                                    defaultValue="PDF"
                                    defaultChecked=""
                                />{" "}
                                PDF
                            </label>
                            <label>
                                <input type="radio" name="format" defaultValue="Excel" /> Excel
                            </label>
                            <label>
                                <input type="radio" name="format" defaultValue="CSV" /> CSV
                            </label>
                        </div>
                    </div>
                    <div className="confirm-dialog__actions">
                        <button type="button" className="btn-secondary" id="btn-create-cancel">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            Create Report
                        </button>
                    </div>
                </form>
            </dialog>
            {/* Delete confirm */}
            <dialog className="confirm-dialog" id="delete-report-dialog">
                <h3>Are you sure you want to delete this report?</h3>
                <p id="delete-report-name" />
                <div className="confirm-dialog__actions">
                    <button type="button" className="btn-secondary" id="btn-delete-cancel">
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn-primary"
                        id="btn-delete-confirm"
                        style={{ background: "var(--error, #B3261E)" }}
                    >
                        Delete
                    </button>
                </div>
            </dialog>
            {/* Report preview */}
            <dialog
                className="confirm-dialog confirm-dialog--wide"
                id="report-preview-dialog"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 id="preview-name">Report</h3>
                        <p
                            id="preview-meta"
                            style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 2 }}
                        />
                    </div>
                    <button
                        type="button"
                        id="btn-preview-close"
                        className="rounded-full p-2"
                        aria-label="Close preview"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="stat-grid" id="preview-summary" style={{ marginTop: 18 }} />
                <div className="chart-shell" style={{ marginTop: 18 }}>
                    <canvas id="preview-chart" role="img" aria-label="Report chart" />
                </div>
                <div className="table-scroll" style={{ marginTop: 18 }}>
                    <table className="dash-table">
                        <thead id="preview-table-head" />
                        <tbody id="preview-table-body" />
                    </table>
                </div>
                <div className="confirm-dialog__actions" style={{ marginTop: 18 }}>
                    <button type="button" className="btn-secondary" id="btn-download-pdf">
                        Download PDF
                    </button>
                    <button type="button" className="btn-secondary" id="btn-download-excel">
                        Download Excel
                    </button>
                    <button type="button" className="btn-primary" id="btn-download-csv">
                        Download CSV
                    </button>
                </div>
            </dialog>
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
                    href="/"
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
                </a>
                <span className="admin-badge">Admin console</span>
                <div className="nav-group" style={{ marginTop: 16 }}>
                    <a className="nav-link" href="/admin/dashboard">
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
