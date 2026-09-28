export default function AdminUsers() {
    return (
<>
    <meta charSet="utf-8" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <title>Manage Users | EVENTIFY</title>
    <meta
        name="description"
        content="Manage Users on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
    />
    <meta property="og:title" content="Manage Users | EVENTIFY" />
    <meta
        property="og:description"
        content="Manage Users on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
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
                "\n        .glass-sidebar { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border-right: 1px solid #E2E8F0; }\n        .glass-header { background: rgba(250, 248, 255, 0.8); backdrop-filter: blur(12px); }\n        .card-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }\n        .card-lift:hover { transform: translateY(-4px); box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.08); }\n        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; vertical-align: middle; }\n    "
        }}
    />
    <header className="lg:hidden glass-header w-full sticky top-0 z-50 flex justify-between items-center px-4 h-16 shadow-sm">
        <a className="flex items-center gap-2" href="/">
            <span
                className="material-symbols-outlined text-primary"
                style={{ fontVariationSettings: '"FILL" 1' }}
            >
                hub
            </span>
            <h1 className="font-bold text-headline-lg-mobile text-primary">
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
    <div className="flex">
        <aside className="admin-accent-sidebar hidden lg:flex flex-col w-[280px] sticky top-0 max-h-screen glass-sidebar z-50 p-6">
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
                    <a className="nav-link" href="/admin/users" aria-current="page">
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
        <main className="flex-1 w-full px-4 md:px-10 pt-6 pb-24 lg:pb-8">
            {/* Global Top Header: page title (left) + global controls (right) */}
            <div className="admin-topbar">
                <h1 className="admin-topbar__title">Manage Users</h1>
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
                    <p className="text-on-surface-variant font-body-md mt-1">
                        Search, filter, and moderate participant and organizer accounts.{" "}
                        <span
                            id="users-count-label"
                            className="font-semibold text-on-surface"
                        />
                    </p>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                        search
                    </span>
                    <input
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-body-md"
                        placeholder="Search by name or email..."
                        type="text"
                        id="users-search"
                    />
                </div>
                <div
                    className="flex flex-wrap gap-2"
                    id="users-tab-group"
                    role="tablist"
                    aria-label="Filter users by role"
                >
                    <button
                        type="button"
                        className="px-5 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md whitespace-nowrap"
                        data-filter="all"
                        aria-pressed="true"
                    >
                        All
                    </button>
                    <button
                        type="button"
                        className="px-5 py-2 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors font-label-md text-label-md whitespace-nowrap"
                        data-filter="organizer"
                        aria-pressed="false"
                    >
                        Organizers
                    </button>
                    <button
                        type="button"
                        className="px-5 py-2 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors font-label-md text-label-md whitespace-nowrap"
                        data-filter="participant"
                        aria-pressed="false"
                    >
                        Participants
                    </button>
                </div>
            </div>
            <div className="section-card" style={{ padding: 0, overflow: "hidden" }}>
                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wide hidden md:grid">
                    <span className="col-span-4">User</span>
                    <span className="col-span-3">Role</span>
                    <span className="col-span-2">Status</span>
                    <span className="col-span-3 text-right">Actions</span>
                </div>
                <div className="divide-y divide-outline-variant/30" id="users-list">
                    <div
                        className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-4 items-center"
                        data-role="participant"
                        data-name="sarah chen sarah.chen@eventify.io"
                    >
                        <div className="md:col-span-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center font-label-md text-primary">
                                S
                            </div>
                            <div>
                                <p className="font-label-md text-label-md text-on-surface">
                                    Sarah Chen
                                </p>
                                <p className="text-label-sm font-label-sm text-on-surface-variant">
                                    sarah.chen@eventify.io
                                </p>
                            </div>
                        </div>
                        <div className="md:col-span-3 font-label-md text-label-md text-on-surface-variant">
                            Participant
                        </div>
                        <div className="md:col-span-2">
                            <span className="badge badge--approved">active</span>
                        </div>
                        <div className="md:col-span-3 flex justify-end gap-2">
                            <button
                                type="button"
                                className="btn-danger-outline"
                                data-ui-action="suspend"
                            >
                                Suspend
                            </button>
                            <button
                                type="button"
                                className="btn-danger-outline"
                                data-ui-action="delete"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                    <div
                        className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-4 items-center"
                        data-role="organizer"
                        data-name="techgenius labs contact@techgenius.io"
                    >
                        <div className="md:col-span-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center font-label-md text-primary">
                                T
                            </div>
                            <div>
                                <p className="font-label-md text-label-md text-on-surface">
                                    TechGenius Labs
                                </p>
                                <p className="text-label-sm font-label-sm text-on-surface-variant">
                                    contact@techgenius.io
                                </p>
                            </div>
                        </div>
                        <div className="md:col-span-3 font-label-md text-label-md text-on-surface-variant">
                            Organizer
                        </div>
                        <div className="md:col-span-2">
                            <span className="badge badge--approved">active</span>
                        </div>
                        <div className="md:col-span-3 flex justify-end gap-2">
                            <button
                                type="button"
                                className="btn-danger-outline"
                                data-ui-action="suspend"
                            >
                                Suspend
                            </button>
                            <button
                                type="button"
                                className="btn-danger-outline"
                                data-ui-action="delete"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                    <div
                        className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-4 items-center"
                        data-role="participant"
                        data-name="marcus thorne marcus.t@eventify.io"
                    >
                        <div className="md:col-span-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center font-label-md text-primary">
                                M
                            </div>
                            <div>
                                <p className="font-label-md text-label-md text-on-surface">
                                    Marcus Thorne
                                </p>
                                <p className="text-label-sm font-label-sm text-on-surface-variant">
                                    marcus.t@eventify.io
                                </p>
                            </div>
                        </div>
                        <div className="md:col-span-3 font-label-md text-label-md text-on-surface-variant">
                            Participant
                        </div>
                        <div className="md:col-span-2">
                            <span className="badge badge--approved">active</span>
                        </div>
                        <div className="md:col-span-3 flex justify-end gap-2">
                            <button
                                type="button"
                                className="btn-danger-outline"
                                data-ui-action="suspend"
                            >
                                Suspend
                            </button>
                            <button
                                type="button"
                                className="btn-danger-outline"
                                data-ui-action="delete"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                    <div
                        className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-4 items-center"
                        data-role="participant"
                        data-name="kevin park kevin.park@eventify.io"
                    >
                        <div className="md:col-span-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center font-label-md text-primary">
                                K
                            </div>
                            <div>
                                <p className="font-label-md text-label-md text-on-surface">
                                    Kevin Park
                                </p>
                                <p className="text-label-sm font-label-sm text-on-surface-variant">
                                    kevin.park@eventify.io
                                </p>
                            </div>
                        </div>
                        <div className="md:col-span-3 font-label-md text-label-md text-on-surface-variant">
                            Participant
                        </div>
                        <div className="md:col-span-2">
                            <span className="badge badge--rejected">suspended</span>
                        </div>
                        <div className="md:col-span-3 flex justify-end gap-2">
                            <button
                                type="button"
                                className="btn-success"
                                data-ui-action="reinstate"
                            >
                                Reinstate
                            </button>
                            <button
                                type="button"
                                className="btn-danger-outline"
                                data-ui-action="delete"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                    <div
                        className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-4 items-center"
                        data-role="organizer"
                        data-name="designhub amman hello@designhub.jo"
                    >
                        <div className="md:col-span-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center font-label-md text-primary">
                                D
                            </div>
                            <div>
                                <p className="font-label-md text-label-md text-on-surface">
                                    DesignHub Amman
                                </p>
                                <p className="text-label-sm font-label-sm text-on-surface-variant">
                                    hello@designhub.jo
                                </p>
                            </div>
                        </div>
                        <div className="md:col-span-3 font-label-md text-label-md text-on-surface-variant">
                            Organizer
                        </div>
                        <div className="md:col-span-2">
                            <span className="badge badge--approved">active</span>
                        </div>
                        <div className="md:col-span-3 flex justify-end gap-2">
                            <button
                                type="button"
                                className="btn-danger-outline"
                                data-ui-action="suspend"
                            >
                                Suspend
                            </button>
                            <button
                                type="button"
                                className="btn-danger-outline"
                                data-ui-action="delete"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
                <div className="empty-state" id="users-empty" hidden="">
                    <span className="empty-state__icon">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            person_search
                        </span>
                    </span>
                    <h3>No users found</h3>
                    <p>No users match your search or filters.</p>
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
