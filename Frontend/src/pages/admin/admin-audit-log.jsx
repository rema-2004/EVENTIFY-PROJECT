import { useEffect } from 'react'
import './admin-audit-log.js'

export default function AdminAuditLog() {
    useEffect(() => window.initAdminAuditLog(), [])

    return (
        <>
            <meta charSet="utf-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <title>Audit Log | EVENTIFY</title>
            <link rel="stylesheet" href="admin.css" />
            <meta
                name="description"
                content="Audit Log on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
            />
            <meta property="og:title" content="Audit Log | EVENTIFY" />
            <meta
                property="og:description"
                content="Audit Log on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
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
            <link rel="stylesheet" href="admin-audit-log.css" />
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
                            <a className="nav-link" href="/admin/reports">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    flag
                                </span>
                                Reports
                            </a>
                            <a
                                className="nav-link"
                                href="/admin/audit-log"
                                aria-current="page"
                            >
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
                        <h1 className="admin-topbar__title">Audit Log</h1>
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
                    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end relative z-50">
                        <div>
                            <p className="mt-1 text-on-surface-variant">
                                Monitor and audit every important activity and operation happening
                                on the platform.
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
                            <div className="row-menu">
                                <button type="button" id="btn-export" className="btn-primary">
                                    <span
                                        className="material-symbols-outlined"
                                        style={{ fontSize: 18 }}
                                    >
                                        download
                                    </span>{" "}
                                    Export Log
                                </button>
                                <div className="row-menu__panel" id="export-menu" hidden="">
                                    <button type="button" data-format="csv">
                                        <span
                                            className="material-symbols-outlined"
                                            style={{ fontSize: 16 }}
                                        >
                                            description
                                        </span>{" "}
                                        CSV
                                    </button>
                                    <button type="button" data-format="excel">
                                        <span
                                            className="material-symbols-outlined"
                                            style={{ fontSize: 16 }}
                                        >
                                            grid_on
                                        </span>{" "}
                                        Excel
                                    </button>
                                    <button type="button" data-format="pdf">
                                        <span
                                            className="material-symbols-outlined"
                                            style={{ fontSize: 16 }}
                                        >
                                            picture_as_pdf
                                        </span>{" "}
                                        PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="stat-grid mb-8">
                        <div className="stat-card">
                            <div className="stat-card__top">
                                <span className="stat-card__icon">
                                    <span className="material-symbols-outlined">list_alt</span>
                                </span>
                            </div>
                            <p className="stat-card__value" id="audit-stat-total">
                                0
                            </p>
                            <p className="stat-card__label">Total Activities</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card__top">
                                <span className="stat-card__icon">
                                    <span className="material-symbols-outlined">today</span>
                                </span>
                            </div>
                            <p className="stat-card__value" id="audit-stat-today">
                                0
                            </p>
                            <p className="stat-card__label">Today's Activities</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card__top">
                                <span className="stat-card__icon">
                                    <span className="material-symbols-outlined">gpp_maybe</span>
                                </span>
                            </div>
                            <p className="stat-card__value" id="audit-stat-sensitive">
                                0
                            </p>
                            <p className="stat-card__label">Sensitive Operations</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card__top">
                                <span className="stat-card__icon">
                                    <span className="material-symbols-outlined">error</span>
                                </span>
                            </div>
                            <p className="stat-card__value" id="audit-stat-failed">
                                0
                            </p>
                            <p className="stat-card__label">Failed Activities</p>
                        </div>
                    </div>
                    <section className="mb-8" data-no-reveal="">
                        <div className="mb-4 flex flex-col gap-3">
                            <div className="audit-filter-grid">
                                <input
                                    type="text"
                                    id="audit-search"
                                    className="input-primary"
                                    placeholder="Search the audit log..."
                                />
                                <select
                                    id="audit-filter-user"
                                    className="input-primary"
                                    aria-label="User"
                                />
                                <select
                                    id="audit-filter-type"
                                    className="input-primary"
                                    aria-label="Activity type"
                                >
                                    <option value="all">All — Activity Type</option>
                                </select>
                                <select
                                    id="audit-filter-role"
                                    className="input-primary"
                                    aria-label="Role"
                                >
                                    <option value="all">All — Role</option>
                                </select>
                                <select
                                    id="audit-filter-status"
                                    className="input-primary"
                                    aria-label="Status"
                                >
                                    <option value="all">All — Status</option>
                                </select>
                                <select
                                    id="audit-filter-location"
                                    className="input-primary"
                                    aria-label="Location"
                                >
                                    <option value="all">All — Location</option>
                                </select>
                            </div>
                            <div className="audit-filter-row">
                                <select
                                    id="audit-filter-range"
                                    className="input-primary"
                                    style={{ maxWidth: 180 }}
                                    aria-label="Time period"
                                >
                                    <option value="all">All Time</option>
                                    <option value="today">Today</option>
                                    <option value="yesterday">Yesterday</option>
                                    <option value="7d">Last 7 Days</option>
                                    <option value="30d">Last 30 Days</option>
                                    <option value="custom">Custom Range</option>
                                </select>
                                <div
                                    className="audit-custom-range"
                                    id="audit-custom-range"
                                    hidden=""
                                >
                                    <input
                                        type="date"
                                        id="audit-range-start"
                                        className="input-primary"
                                        aria-label="Start date"
                                    />
                                    <span className="text-on-surface-variant">–</span>
                                    <input
                                        type="date"
                                        id="audit-range-end"
                                        className="input-primary"
                                        aria-label="End date"
                                    />
                                </div>
                                <button
                                    type="button"
                                    id="btn-advanced-toggle"
                                    className="btn-secondary"
                                >
                                    <span
                                        className="material-symbols-outlined"
                                        style={{ fontSize: 18 }}
                                    >
                                        tune
                                    </span>{" "}
                                    Advanced Filters
                                </button>
                                <button
                                    type="button"
                                    id="btn-reset-filters"
                                    className="btn-secondary"
                                >
                                    <span
                                        className="material-symbols-outlined"
                                        style={{ fontSize: 18 }}
                                    >
                                        filter_alt_off
                                    </span>{" "}
                                    Clear Filters
                                </button>
                            </div>
                            <div
                                className="advanced-filters-panel"
                                id="audit-advanced-panel"
                                hidden=""
                            >
                                <label>
                                    IP Address{" "}
                                    <input
                                        type="text"
                                        id="audit-adv-ip"
                                        className="input-primary"
                                        placeholder="e.g. 192.168.1.100"
                                    />
                                </label>
                                <label>
                                    Device{" "}
                                    <input
                                        type="text"
                                        id="audit-adv-device"
                                        className="input-primary"
                                        placeholder="e.g. Windows Desktop"
                                    />
                                </label>
                                <label>
                                    Browser{" "}
                                    <input
                                        type="text"
                                        id="audit-adv-browser"
                                        className="input-primary"
                                        placeholder="e.g. Chrome"
                                    />
                                </label>
                                <label>
                                    OS{" "}
                                    <input
                                        type="text"
                                        id="audit-adv-os"
                                        className="input-primary"
                                        placeholder="e.g. Windows 11"
                                    />
                                </label>
                                <label>
                                    Session ID{" "}
                                    <input
                                        type="text"
                                        id="audit-adv-session"
                                        className="input-primary"
                                        placeholder="e.g. SESS-000123"
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-title-lg font-semibold">Activity Log</h2>
                            <span className="live-dot-wrap">
                                <span className="live-dot" /> Live
                            </span>
                        </div>
                        <div id="audit-skeleton" className="panel" hidden="">
                            <p className="mb-4 text-on-surface-variant">
                                Refreshing audit log...
                            </p>
                            <div className="skeleton skeleton-line" />
                            <div className="skeleton skeleton-line" />
                            <div className="skeleton skeleton-line" />
                        </div>
                        <div id="audit-empty" className="empty-state" hidden="">
                            <span className="empty-state__icon">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    history_toggle_off
                                </span>
                            </span>
                            <h3>No activities found</h3>
                            <p>No activity matches the current filters.</p>
                            <button type="button" id="empty-reset-btn" className="btn-primary">
                                Clear Filters
                            </button>
                        </div>
                        <article className="panel panel--flush" id="audit-table-wrap">
                            <div className="table-scroll">
                                <table className="dash-table">
                                    <caption className="sr-only">Audit Log</caption>
                                    <thead>
                                        <tr>
                                            <th data-sort="timestamp" data-dir="desc">
                                                Date &amp; Time <span className="sort-arrow" />
                                            </th>
                                            <th data-sort="user">
                                                User <span className="sort-arrow" />
                                            </th>
                                            <th data-sort="action">
                                                Activity <span className="sort-arrow" />
                                            </th>
                                            <th data-sort="type">
                                                Type <span className="sort-arrow" />
                                            </th>
                                            <th>Target</th>
                                            <th>Location</th>
                                            <th data-sort="status">
                                                Status <span className="sort-arrow" />
                                            </th>
                                            <th style={{ textAlign: "right" }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="audit-tbody" />
                                </table>
                            </div>
                        </article>
                        <div className="mt-4 flex flex-col items-center gap-3 md:flex-row md:justify-between md:px-2">
                            <label
                                className="flex items-center gap-2 text-label-sm text-on-surface-variant"
                                style={{ whiteSpace: "nowrap" }}
                            >
                                Rows per page
                                <select
                                    id="audit-rows-per-page"
                                    className="input-primary"
                                    defaultValue={20}
                                    style={{ padding: "6px 10px", width: "auto" }}
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>
                                        20
                                    </option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </label>
                            <div className="pagination" id="audit-pagination" />
                        </div>
                    </section>
                    <section className="mt-10" data-no-reveal="">
                        <h2 className="mb-4 text-title-lg font-semibold">Security Activity</h2>
                        <article className="panel" id="audit-security-list" />
                    </section>
                </main>
            </div>
            {/* Activity Details */}
            <dialog
                className="confirm-dialog confirm-dialog--wide"
                id="audit-details-dialog"
            >
                <div
                    className="flex items-start justify-between gap-4"
                    style={{
                        position: "sticky",
                        top: 0,
                        background: "var(--surface)",
                        paddingBottom: 8,
                        zIndex: 1
                    }}
                >
                    <div>
                        <h3>Activity Details</h3>
                        <p
                            id="audit-detail-id"
                            style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 2 }}
                            className="mono"
                        />
                    </div>
                    <button
                        type="button"
                        id="btn-details-close"
                        className="rounded-full p-2"
                        aria-label="Close details"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div
                    className="stat-grid"
                    style={{
                        gridTemplateColumns: "1fr 1fr",
                        marginTop: 18,
                        marginBottom: 18
                    }}
                >
                    <div>
                        <p className="stat-card__label">Date &amp; Time</p>
                        <p
                            id="audit-detail-time"
                            className="mono"
                            style={{ fontSize: 14, marginTop: 2 }}
                        />
                    </div>
                    <div>
                        <p className="stat-card__label">User</p>
                        <div
                            id="audit-detail-user"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                marginTop: 4
                            }}
                        />
                    </div>
                    <div>
                        <p className="stat-card__label">Action</p>
                        <p id="audit-detail-action" style={{ marginTop: 2 }} />
                    </div>
                    <div>
                        <p className="stat-card__label">Target</p>
                        <p id="audit-detail-target" style={{ marginTop: 2 }} />
                    </div>
                    <div>
                        <p className="stat-card__label">Location</p>
                        <p id="audit-detail-location" style={{ marginTop: 2 }} />
                    </div>
                    <div>
                        <p className="stat-card__label">Status</p>
                        <div id="audit-detail-status" style={{ marginTop: 4 }} />
                    </div>
                    <div>
                        <p className="stat-card__label">IP Address</p>
                        <p id="audit-detail-ip" className="mono" style={{ marginTop: 2 }} />
                    </div>
                    <div>
                        <p className="stat-card__label">Device / Browser</p>
                        <p id="audit-detail-device" style={{ marginTop: 2 }} />
                    </div>
                </div>
                <p className="stat-card__label">Additional Details</p>
                <p id="audit-detail-notes" style={{ marginTop: 4, marginBottom: 18 }} />
                <p className="stat-card__label" style={{ marginBottom: 6 }}>
                    Activity Timeline
                </p>
                <div className="timeline" id="audit-detail-timeline" />
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
