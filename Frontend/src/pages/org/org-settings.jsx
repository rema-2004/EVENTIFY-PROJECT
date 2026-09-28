export default function OrgSettings() {
    return (
        <>
            <meta charSet="utf-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <title>Organization Settings | EVENTIFY</title>
            <meta
                name="description"
                content="Organization Settings on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
            />
            <meta property="og:title" content="Organization Settings | EVENTIFY" />
            <meta
                property="og:description"
                content="Organization Settings on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
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
                        "\n        @font-face {\n            font-family: 'Material Symbols Outlined';\n            font-style: normal;\n            font-weight: 100 700;\n            font-display: block;\n            src: url('../assets/fonts/material-symbols-outlined.woff2') format('woff2');\n        }\n        .material-symbols-outlined {\n            font-family: 'Material Symbols Outlined';\n            font-weight: normal;\n            font-style: normal;\n            font-size: 24px;\n            line-height: 1;\n            letter-spacing: normal;\n            text-transform: none;\n            display: inline-block;\n            white-space: nowrap;\n            overflow: hidden;\n            word-wrap: normal;\n            direction: ltr;\n            -webkit-font-feature-settings: 'liga';\n            -webkit-font-smoothing: antialiased;\n            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n            vertical-align: middle;\n        }\n    "
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
                    <a className="mb-2 flex items-center gap-3" href="/">
                        <span
                            className="material-symbols-outlined text-3xl text-primary"
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
                            <a className="nav-link" href="/org/report-center">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    bar_chart
                                </span>
                                Reports
                            </a>
                            <a className="nav-link" href="/org/settings" aria-current="page">
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
                <main className="w-full flex-1 px-4 pt-6 pb-8 md:px-10">
                    {/* Global Top Header: page title (left) + global controls (right) */}
                    <div className="org-topbar">
                        <h1 className="org-topbar__title">Organization Settings</h1>
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
                    {/* Page Header: breadcrumb, title, description */}
                    <div className="org-page-header">
                        <div className="flex items-center gap-2 text-sm mb-2">
                            <a
                                className="text-on-surface-variant hover:text-primary transition-colors"
                                href="/org/dashboard"
                            >
                                Dashboard
                            </a>
                            <span className="text-outline">/</span>
                            <span className="font-semibold text-on-surface">Settings</span>
                        </div>
                        <p className="profile-page-desc">
                            Maintain official profile data, verification documents, and organizer
                            preferences.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <section className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-8 lg:col-span-2">
                            <h3 className="mb-6 text-title-lg font-semibold">
                                Official Information
                            </h3>
                            <form className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="org-name">
                                        Organization name
                                    </label>
                                    <input
                                        className="form-input"
                                        id="org-name"
                                        type="text"
                                        defaultValue="TechGenius Labs"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="org-type">
                                        Organization type
                                    </label>
                                    <select className="form-input" id="org-type" defaultValue="Company">
                                        <option>University</option>
                                        <option>Company</option>
                                        <option>NGO</option>
                                        <option>Government</option>
                                        <option>Startup</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="org-email">
                                        Work email
                                    </label>
                                    <input
                                        className="form-input"
                                        id="org-email"
                                        type="email"
                                        defaultValue="contact@techgenius.io"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="org-website">
                                        Website
                                    </label>
                                    <input
                                        className="form-input"
                                        id="org-website"
                                        type="url"
                                        defaultValue="https://techgenius.io"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="org-city">
                                        City
                                    </label>
                                    <input
                                        className="form-input"
                                        id="org-city"
                                        type="text"
                                        defaultValue="Amman"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="org-country">
                                        Country
                                    </label>
                                    <input
                                        className="form-input"
                                        id="org-country"
                                        type="text"
                                        defaultValue="Jordan"
                                    />
                                </div>
                                <div className="form-group md:col-span-2">
                                    <label className="form-label" htmlFor="org-desc">
                                        Public description
                                    </label>
                                    <textarea
                                        className="form-textarea"
                                        id="org-desc"
                                        rows={4}
                                        defaultValue={
                                            "A regional training and innovation lab helping students build practical AI, cloud, and product skills through workshops, competitions, and mentorship programs."
                                        }
                                    />
                                </div>
                                <div className="md:col-span-2 flex justify-end">
                                    <button type="button" className="btn-primary">
                                        Save changes
                                    </button>
                                </div>
                            </form>
                        </section>
                        <aside className="space-y-6">
                            <section className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-6">
                                <h3 className="mb-4 text-title-lg font-semibold">Verification</h3>
                                <div className="mb-4 rounded-xl bg-success/10 p-4 text-success">
                                    <p className="font-semibold">Verified organizer</p>
                                    <p className="text-label-md">
                                        Reviewed by Eventify Admin on Mar 18, 2026.
                                    </p>
                                </div>
                                <div className="space-y-3 text-label-md">
                                    <p className="flex items-center justify-between">
                                        <span>Business license</span>
                                        <span className="badge badge--approved">Approved</span>
                                    </p>
                                    <p className="flex items-center justify-between">
                                        <span>Domain email</span>
                                        <span className="badge badge--approved">Approved</span>
                                    </p>
                                    <p className="flex items-center justify-between">
                                        <span>Training registry</span>
                                        <span className="badge badge--approved">Approved</span>
                                    </p>
                                </div>
                            </section>
                            <section className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-6">
                                <h3 className="mb-4 text-title-lg font-semibold">
                                    Notification Rules
                                </h3>
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between gap-3">
                                        <span>New applicants</span>
                                        <input
                                            className="rounded text-primary"
                                            defaultChecked=""
                                            type="checkbox"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between gap-3">
                                        <span>Admin review updates</span>
                                        <input
                                            className="rounded text-primary"
                                            defaultChecked=""
                                            type="checkbox"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between gap-3">
                                        <span>Weekly performance report</span>
                                        <input className="rounded text-primary" type="checkbox" />
                                    </label>
                                </div>
                            </section>
                        </aside>
                    </div>
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
                    <a className="nav-link" href="/org/report-center">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            bar_chart
                        </span>
                        Reports
                    </a>
                    <a className="nav-link" href="/org/settings" aria-current="page">
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
        </>
    )
}
