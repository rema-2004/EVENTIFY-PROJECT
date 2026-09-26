export default function OrgProfile() {
    return (
        <>
            <meta charSet="utf-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <title>Organization Profile | EVENTIFY</title>
            <meta
                name="description"
                content="Organization Profile on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
            />
            <meta property="og:title" content="Organization Profile | EVENTIFY" />
            <meta
                property="og:description"
                content="Organization Profile on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
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
            {/* Mobile Header */}
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
                {/* Desktop Sidebar */}
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
                            <a className="nav-link" href="/org/profile" aria-current="page">
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
                {/* Main Content */}
                <main className="w-full flex-1 px-4 pt-6 pb-24 md:px-10 lg:pb-8">
                    {/* Global Top Header: page title (left) + global controls (right) */}
                    <div className="org-topbar">
                        <h1 className="org-topbar__title">Organization Profile</h1>
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
                            <span className="font-semibold text-on-surface">
                                Organization Profile
                            </span>
                        </div>
                        <p className="profile-page-desc">
                            An official public profile presenting the organization’s mission,
                            programs, and verified credibility to students, partners, and
                            institutional stakeholders.
                        </p>
                        <div className="org-page-header__actions">
                            <a className="btn-secondary" href="/org/settings">
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: 18 }}
                                >
                                    settings
                                </span>{" "}
                                Manage profile
                            </a>
                            <a className="btn-primary" href="/org/opportunities">
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: 18 }}
                                >
                                    visibility
                                </span>{" "}
                                View opportunities
                            </a>
                        </div>
                    </div>
                    {/* Organization Showcase Hero */}
                    <section className="org-showcase-card">
                        <div className="org-showcase-banner" />
                        <div className="org-showcase-body">
                            <div className="org-identity-bar">
                                <div className="org-avatar-box">TG</div>
                                <div className="org-identity-info">
                                    <div className="flex flex-wrap items-center gap-2.5 mb-2">
                                        <h2 className="org-identity-title">TechGenius Labs</h2>
                                        <span className="org-badge-verified">
                                            <span
                                                className="material-symbols-outlined"
                                                style={{ fontSize: 14 }}
                                            >
                                                verified
                                            </span>{" "}
                                            Verified institution
                                        </span>
                                        <span className="org-badge-type">
                                            Training and innovation center
                                        </span>
                                    </div>
                                    <p className="text-body-md text-on-surface-variant">
                                        This organization is dedicated to delivering high-quality
                                        programs, training opportunities, and development initiatives
                                        that support students, professionals, and community partners.
                                    </p>
                                </div>
                                <div className="org-pills-row">
                                    <span className="org-pill">
                                        <span className="material-symbols-outlined">
                                            calendar_month
                                        </span>{" "}
                                        Founded 2024
                                    </span>
                                    <span className="org-pill">
                                        <span className="material-symbols-outlined">location_on</span>{" "}
                                        Amman, Jordan
                                    </span>
                                    <span className="org-pill">
                                        <span className="material-symbols-outlined">verified_user</span>{" "}
                                        Verified by Eventify
                                    </span>
                                </div>
                            </div>
                            {/* 3 Key Metric Stats */}
                            <div className="org-metrics-grid">
                                <div className="org-metric-card">
                                    <div className="org-metric-num">24</div>
                                    <div className="org-metric-label">Active programs</div>
                                </div>
                                <div className="org-metric-card">
                                    <div className="org-metric-num">1.9k</div>
                                    <div className="org-metric-label">Applicants reached</div>
                                </div>
                                <div className="org-metric-card">
                                    <div className="org-metric-num">4.8</div>
                                    <div className="org-metric-label">Community rating</div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* 2-Column Content Layout */}
                    <div className="org-content-grid">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* About Organization */}
                            <section className="org-section-card">
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <span className="org-section-eyebrow">
                                            About the organization
                                        </span>
                                        <h3 className="org-section-title">
                                            What the organization stands for
                                        </h3>
                                    </div>
                                    <span className="rounded-full bg-primary/10 px-3 py-1 text-label-sm font-semibold text-primary">
                                        Mission driven
                                    </span>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="rounded-xl border border-border bg-surface-2 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                                            Mission
                                        </p>
                                        <p className="mt-2 text-body-md text-on-surface">
                                            We design and deliver structured, career-oriented learning
                                            pathways that strengthen knowledge, build professional
                                            capabilities, and connect participants with meaningful
                                            opportunities.
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-border bg-surface-2 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                                            Core domains
                                        </p>
                                        <ul className="mt-2 space-y-2 text-body-md text-on-surface-variant">
                                            <li className="flex items-center gap-2">
                                                <span className="text-primary font-bold">•</span> Artificial
                                                intelligence and data science
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="text-primary font-bold">•</span> Cloud
                                                infrastructure and DevOps
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="text-primary font-bold">•</span> Product
                                                development and entrepreneurship
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </section>
                            {/* Featured Programs */}
                            <section className="org-section-card">
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <span className="org-section-eyebrow">Featured programs</span>
                                        <h3 className="org-section-title">Programs and initiatives</h3>
                                    </div>
                                    <a
                                        className="text-label-md font-medium text-primary hover:underline flex items-center gap-1"
                                        href="/org/opportunities"
                                    >
                                        View all{" "}
                                        <span
                                            className="material-symbols-outlined"
                                            style={{ fontSize: 16 }}
                                        >
                                            arrow_forward
                                        </span>
                                    </a>
                                </div>
                                <div className="space-y-3">
                                    <div className="org-program-item">
                                        <div>
                                            <p className="font-semibold text-on-surface">
                                                Global AI Innovation Challenge
                                            </p>
                                            <p className="text-label-md text-on-surface-variant">
                                                <span className="inline-flex items-center gap-1 text-primary font-semibold">
                                                    ● Live
                                                </span>{" "}
                                                · Remote ·{" "}
                                                <span style={{ fontFamily: "var(--font-mono)" }}>98</span>{" "}
                                                applicants
                                            </p>
                                        </div>
                                        <a
                                            className="org-program-link"
                                            href="/org/applicants?event=evt-001"
                                        >
                                            View applicants{" "}
                                            <span
                                                className="material-symbols-outlined"
                                                style={{ fontSize: 16 }}
                                            >
                                                chevron_right
                                            </span>
                                        </a>
                                    </div>
                                    <div className="org-program-item">
                                        <div>
                                            <p className="font-semibold text-on-surface">
                                                DevOps Masterclass
                                            </p>
                                            <p className="text-label-md text-on-surface-variant">
                                                <span className="inline-flex items-center gap-1 text-amber-500 font-semibold">
                                                    ⏳ Pending approval
                                                </span>{" "}
                                                · Online
                                            </p>
                                        </div>
                                        <a className="org-program-link" href="/org/opportunities">
                                            See details{" "}
                                            <span
                                                className="material-symbols-outlined"
                                                style={{ fontSize: 16 }}
                                            >
                                                chevron_right
                                            </span>
                                        </a>
                                    </div>
                                    <div className="org-program-item">
                                        <div>
                                            <p className="font-semibold text-on-surface">
                                                Cloud Career Bootcamp
                                            </p>
                                            <p className="text-label-md text-on-surface-variant">
                                                <span className="inline-flex items-center gap-1 text-on-surface-variant font-semibold">
                                                    📝 Draft
                                                </span>{" "}
                                                · 6-week certificate
                                            </p>
                                        </div>
                                        <a className="org-program-link" href="/org/opportunities">
                                            Open program{" "}
                                            <span
                                                className="material-symbols-outlined"
                                                style={{ fontSize: 16 }}
                                            >
                                                chevron_right
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </section>
                        </div>
                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Institutional Details */}
                            <section className="org-section-card">
                                <span className="org-section-eyebrow">Institutional details</span>
                                <h3 className="org-section-title mb-4">Contact and location</h3>
                                <div className="space-y-3">
                                    <div className="org-info-block">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                                            Website
                                        </p>
                                        <a
                                            className="org-info-link mt-1"
                                            href="https://www.techgenius.io"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            www.techgenius.io{" "}
                                            <span
                                                className="material-symbols-outlined"
                                                style={{ fontSize: 16 }}
                                            >
                                                open_in_new
                                            </span>
                                        </a>
                                    </div>
                                    <div className="org-info-block">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                                            Work email
                                        </p>
                                        <a
                                            className="org-info-link mt-1"
                                            href="mailto:contact@techgenius.io"
                                        >
                                            contact@techgenius.io{" "}
                                            <span
                                                className="material-symbols-outlined"
                                                style={{ fontSize: 16 }}
                                            >
                                                mail
                                            </span>
                                        </a>
                                    </div>
                                    <div className="org-info-block">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                                            Location
                                        </p>
                                        <p className="mt-1 text-body-md font-medium text-on-surface">
                                            Amman, Jordan
                                        </p>
                                    </div>
                                </div>
                            </section>
                            {/* Verification Status */}
                            <section className="org-section-card">
                                <span className="org-section-eyebrow">Verification</span>
                                <h3 className="org-section-title mb-4">Trust status</h3>
                                <div className="space-y-3">
                                    <div className="org-trust-highlight">
                                        <p className="font-semibold text-success flex items-center gap-1.5">
                                            <span
                                                className="material-symbols-outlined"
                                                style={{ fontSize: 18 }}
                                            >
                                                verified
                                            </span>{" "}
                                            Verified institution
                                        </p>
                                        <p className="mt-1 text-label-md text-success/90">
                                            Reviewed and approved by the Eventify administration team
                                        </p>
                                    </div>
                                    <div className="org-trust-item">
                                        <span className="font-medium text-on-surface text-sm">
                                            Business license
                                        </span>
                                        <span className="badge badge--approved">Approved</span>
                                    </div>
                                    <div className="org-trust-item">
                                        <span className="font-medium text-on-surface text-sm">
                                            Domain email
                                        </span>
                                        <span className="badge badge--approved">Approved</span>
                                    </div>
                                </div>
                            </section>
                        </div>
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
                    <a className="nav-link" href="/org/profile" aria-current="page">
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
        </>
    )
}
