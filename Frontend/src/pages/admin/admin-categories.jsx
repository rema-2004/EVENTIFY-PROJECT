export default function AdminCategories() {
    return (
        <>
            <meta charSet="utf-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <title>Categories Management | EVENTIFY</title>
            <meta
                name="description"
                content="Categories Management on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
            />
            <meta property="og:title" content="Categories Management | EVENTIFY" />
            <meta
                property="og:description"
                content="Categories Management on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
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
                        "\n    @font-face {\n        font-family: 'Material Symbols Outlined';\n        font-style: normal;\n        font-weight: 100 700;\n        font-display: block;\n        src: url('../assets/fonts/material-symbols-outlined.woff2') format('woff2');\n    }\n    .material-symbols-outlined {\n        font-family: 'Material Symbols Outlined';\n        font-weight: normal;\n        font-style: normal;\n        font-size: 24px;\n        line-height: 1;\n        letter-spacing: normal;\n        text-transform: none;\n        display: inline-block;\n        white-space: nowrap;\n        overflow: hidden;\n        word-wrap: normal;\n        direction: ltr;\n        -webkit-font-feature-settings: 'liga';\n        -webkit-font-smoothing: antialiased;\n        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n        vertical-align: middle;\n    }\n    "
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
                            <a
                                className="nav-link"
                                href="/admin/categories"
                                aria-current="page"
                            >
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
                <main className="w-full flex-1 px-4 pt-6 pb-24 md:px-10 lg:pb-8">
                    {/* Global Top Header: page title (left) + global controls (right) */}
                    <div className="admin-topbar">
                        <h1 className="admin-topbar__title">Categories Management</h1>
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
                                Maintain opportunity types and skill tags used by search and AI
                                matching.
                            </p>
                        </div>
                        <button type="button" className="btn-primary" id="btn-add-category">
                            Add category
                        </button>
                    </div>
                    <section className="section-card mx-auto max-w-2xl">
                        <h2 className="mb-4 text-title-lg font-semibold">
                            Opportunity Categories
                        </h2>
                        <div className="flex flex-col gap-3" id="category-list">
                            <div
                                className="flex items-center justify-between rounded-xl bg-surface-container-low p-4"
                                data-active={84}
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <span
                                        className="material-symbols-outlined text-on-surface-variant"
                                        aria-hidden="true"
                                        style={{ fontSize: 20 }}
                                    >
                                        category
                                    </span>
                                    <span className="cat-name truncate">Competition</span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <a
                                        className="text-on-surface-variant hover:text-primary hover:underline"
                                        href="/admin/events?category=Competition"
                                    >
                                        84 active
                                    </a>
                                    <div className="row-actions">
                                        <button
                                            type="button"
                                            data-act="edit"
                                            aria-label="Edit Competition"
                                        >
                                            <span
                                                className="material-symbols-outlined"
                                                aria-hidden="true"
                                            >
                                                edit
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            data-act="delete"
                                            aria-label="Delete Competition"
                                        >
                                            <span
                                                className="material-symbols-outlined"
                                                aria-hidden="true"
                                            >
                                                delete
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="flex items-center justify-between rounded-xl bg-surface-container-low p-4"
                                data-active={112}
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <span
                                        className="material-symbols-outlined text-on-surface-variant"
                                        aria-hidden="true"
                                        style={{ fontSize: 20 }}
                                    >
                                        category
                                    </span>
                                    <span className="cat-name truncate">Event</span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <a
                                        className="text-on-surface-variant hover:text-primary hover:underline"
                                        href="/admin/events?category=Event"
                                    >
                                        112 active
                                    </a>
                                    <div className="row-actions">
                                        <button type="button" data-act="edit" aria-label="Edit Event">
                                            <span
                                                className="material-symbols-outlined"
                                                aria-hidden="true"
                                            >
                                                edit
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            data-act="delete"
                                            aria-label="Delete Event"
                                        >
                                            <span
                                                className="material-symbols-outlined"
                                                aria-hidden="true"
                                            >
                                                delete
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="flex items-center justify-between rounded-xl bg-surface-container-low p-4"
                                data-active={96}
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <span
                                        className="material-symbols-outlined text-on-surface-variant"
                                        aria-hidden="true"
                                        style={{ fontSize: 20 }}
                                    >
                                        category
                                    </span>
                                    <span className="cat-name truncate">Workshop</span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <a
                                        className="text-on-surface-variant hover:text-primary hover:underline"
                                        href="/admin/events?category=Workshop"
                                    >
                                        96 active
                                    </a>
                                    <div className="row-actions">
                                        <button
                                            type="button"
                                            data-act="edit"
                                            aria-label="Edit Workshop"
                                        >
                                            <span
                                                className="material-symbols-outlined"
                                                aria-hidden="true"
                                            >
                                                edit
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            data-act="delete"
                                            aria-label="Delete Workshop"
                                        >
                                            <span
                                                className="material-symbols-outlined"
                                                aria-hidden="true"
                                            >
                                                delete
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="flex items-center justify-between rounded-xl bg-surface-container-low p-4"
                                data-active={56}
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <span
                                        className="material-symbols-outlined text-on-surface-variant"
                                        aria-hidden="true"
                                        style={{ fontSize: 20 }}
                                    >
                                        category
                                    </span>
                                    <span className="cat-name truncate">Course</span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <a
                                        className="text-on-surface-variant hover:text-primary hover:underline"
                                        href="/admin/events?category=Course"
                                    >
                                        56 active
                                    </a>
                                    <div className="row-actions">
                                        <button type="button" data-act="edit" aria-label="Edit Course">
                                            <span
                                                className="material-symbols-outlined"
                                                aria-hidden="true"
                                            >
                                                edit
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            data-act="delete"
                                            aria-label="Delete Course"
                                        >
                                            <span
                                                className="material-symbols-outlined"
                                                aria-hidden="true"
                                            >
                                                delete
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
                <dialog className="confirm-dialog" id="add-category-dialog">
                    <form method="dialog" id="add-category-form">
                        <h3 id="add-category-title">Add category</h3>
                        <p id="add-category-hint">
                            Give it a clear, unique name — it will appear in the category filters
                            right away.
                        </p>
                        <label className="sr-only" htmlFor="new-category-name">
                            Category name
                        </label>
                        <input
                            className="input-primary"
                            type="text"
                            id="new-category-name"
                            name="name"
                            placeholder="e.g. Internship"
                            maxLength={40}
                            required=""
                            style={{ marginBottom: 20 }}
                        />
                        <div className="confirm-dialog__actions">
                            <button
                                type="button"
                                className="btn-secondary"
                                id="add-category-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                id="add-category-submit"
                            >
                                Add category
                            </button>
                        </div>
                    </form>
                </dialog>
                <dialog
                    className="confirm-dialog"
                    id="delete-category-dialog"
                    aria-labelledby="delete-cat-title"
                >
                    <h3 id="delete-cat-title">Delete category?</h3>
                    <p id="delete-cat-message" />
                    <div className="confirm-dialog__actions">
                        <button type="button" className="btn-secondary" id="delete-cat-cancel">
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn-primary"
                            id="delete-cat-confirm"
                            style={{ background: "var(--error,#B3261E)" }}
                        >
                            Delete
                        </button>
                    </div>
                </dialog>
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
