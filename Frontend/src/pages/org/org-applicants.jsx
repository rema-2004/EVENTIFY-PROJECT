export default function OrgApplicants() {
    return (
        <>
            <meta charSet="utf-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <title>Applicants | EVENTIFY</title>
            <meta
                name="description"
                content="Applicants on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
            />
            <meta property="og:title" content="Applicants | EVENTIFY" />
            <meta
                property="og:description"
                content="Applicants on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
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
                        "\n    @font-face {\n        font-family: 'Material Symbols Outlined';\n        font-style: normal;\n        font-weight: 100 700;\n        font-display: block;\n        src: url('../assets/fonts/material-symbols-outlined.woff2') format('woff2');\n    }\n    .material-symbols-outlined {\n        font-family: 'Material Symbols Outlined';\n        font-weight: normal;\n        font-style: normal;\n        font-size: 24px;\n        line-height: 1;\n        letter-spacing: normal;\n        text-transform: none;\n        display: inline-block;\n        white-space: nowrap;\n        overflow: hidden;\n        word-wrap: normal;\n        direction: ltr;\n        -webkit-font-feature-settings: 'liga';\n        -webkit-font-smoothing: antialiased;\n        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n        vertical-align: middle;\n    }\n"
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
                            <a
                                className="nav-link"
                                href="/org/applicants"
                                aria-current="page"
                            >
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
                <main className="flex-1 w-full px-4 md:px-10 pt-6 pb-24 lg:pb-8">
                    {/* Global Top Header: page title (left) + global controls (right) */}
                    <div className="org-topbar">
                        <h1 id="applicants-title" className="org-topbar__title">
                            Applicants · Global AI Innovation Challenge
                        </h1>
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
                    {/* Page Header: breadcrumb, page-specific actions */}
                    <div className="org-page-header">
                        <nav className="breadcrumb-nav" aria-label="Breadcrumb">
                            <a href="/org/dashboard">Dashboard</a>
                            <span className="breadcrumb-sep">/</span>
                            <span className="breadcrumb-current">Applicants</span>
                        </nav>
                        <div className="org-page-header__actions">
                            {/* Reusable Organizer Event Selector Component */}
                            <div className="org-event-dropdown">
                                <button
                                    className="org-event-btn"
                                    id="org-event-toggle"
                                    type="button"
                                    aria-haspopup="listbox"
                                    aria-expanded="false"
                                    aria-label="Switch selected opportunity"
                                >
                                    <span className="event-icon">
                                        <span className="material-symbols-outlined" aria-hidden="true">
                                            event_note
                                        </span>
                                    </span>
                                    <span
                                        className="org-event-btn__name"
                                        id="org-event-selected-name"
                                    >
                                        Global AI Innovation Challenge
                                    </span>
                                    <span
                                        className="material-symbols-outlined chevron-icon"
                                        aria-hidden="true"
                                    >
                                        expand_more
                                    </span>
                                </button>
                                <div
                                    className="org-event-panel"
                                    id="org-event-panel"
                                    hidden=""
                                    role="listbox"
                                    aria-label="Select opportunity"
                                >
                                    <button
                                        type="button"
                                        className="org-event-item active"
                                        data-event-id="evt-1"
                                        role="option"
                                        aria-selected="true"
                                    >
                                        <span className="item-name">
                                            Global AI Innovation Challenge
                                        </span>
                                        <span className="item-meta">98 applicants</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="org-event-item"
                                        data-event-id="evt-2"
                                        role="option"
                                        aria-selected="false"
                                    >
                                        <span className="item-name">Frontend Wizards</span>
                                        <span className="item-meta">150 applicants</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="org-event-item"
                                        data-event-id="evt-3"
                                        role="option"
                                        aria-selected="false"
                                    >
                                        <span className="item-name">Startup Challenge</span>
                                        <span className="item-meta">84 applicants</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="org-event-item"
                                        data-event-id="evt-4"
                                        role="option"
                                        aria-selected="false"
                                    >
                                        <span className="item-name">DevOps Masterclass</span>
                                        <span className="item-meta">72 applicants</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="org-event-item"
                                        data-event-id="evt-5"
                                        role="option"
                                        aria-selected="false"
                                    >
                                        <span className="item-name">Cloud Native Bootcamp</span>
                                        <span className="item-meta">42 applicants</span>
                                    </button>
                                </div>
                            </div>
                            {/* Native select for seamless underlying data compatibility */}
                            <select
                                id="applicants-event-select"
                                className="sr-only"
                                aria-hidden="true"
                                tabIndex={-1}
                            >
                                <option value="evt-1">Global AI Innovation Challenge</option>
                                <option value="evt-2">Frontend Wizards</option>
                                <option value="evt-3">Startup Challenge</option>
                                <option value="evt-4">DevOps Masterclass</option>
                                <option value="evt-5">Cloud Native Bootcamp</option>
                            </select>
                            <span className="badge badge--pending" style={{ fontSize: 12 }}>
                                Review applicants
                            </span>
                        </div>
                    </div>
                    {/* Status Filter Tabs */}
                    <div
                        className="applicants-filters"
                        role="group"
                        aria-label="Filter applicants by review status"
                    >
                        <button
                            className="filter-btn active"
                            data-filter="all"
                            type="button"
                            aria-pressed="true"
                        >
                            All{" "}
                            <span className="filter-count" data-count="all">
                                98
                            </span>
                        </button>
                        <button
                            className="filter-btn"
                            data-filter="pending"
                            type="button"
                            aria-pressed="false"
                        >
                            Pending{" "}
                            <span className="filter-count" data-count="pending">
                                17
                            </span>
                        </button>
                        <button
                            className="filter-btn"
                            data-filter="accepted"
                            type="button"
                            aria-pressed="false"
                        >
                            Accepted{" "}
                            <span className="filter-count" data-count="accepted">
                                72
                            </span>
                        </button>
                        <button
                            className="filter-btn"
                            data-filter="rejected"
                            type="button"
                            aria-pressed="false"
                        >
                            Rejected{" "}
                            <span className="filter-count" data-count="rejected">
                                9
                            </span>
                        </button>
                    </div>
                    {/* Applicants Table Panel */}
                    <section className="applicants-panel">
                        <div className="table-scroll">
                            <table className="applicants-table" id="applicants-table">
                                <caption className="sr-only">
                                    Applicants for selected opportunity
                                </caption>
                                <thead>
                                    <tr>
                                        <th>Applicant</th>
                                        <th>AI Match</th>
                                        <th>Skills</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: "right" }}>Decision</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        className="applicant-row"
                                        data-status="pending"
                                        data-id="app-1"
                                    >
                                        <td>
                                            <div className="applicant-entity">
                                                <div className="applicant-avatar">A</div>
                                                <div>
                                                    <a
                                                        className="applicant-name"
                                                        href="/org/applicants"
                                                    >
                                                        Alex Rivera
                                                    </a>
                                                    <p className="applicant-headline">
                                                        3 yrs experience · Computer Vision
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                className="match-score match-score--strong"
                                                title="AI Match Score: 94%"
                                            >
                                                94% match
                                            </span>
                                        </td>
                                        <td>
                                            <div className="skills-list">
                                                <span className="skill-chip">Python</span>
                                                <span className="skill-chip">PyTorch</span>
                                                <span className="skill-chip">React</span>
                                            </div>
                                        </td>
                                        <td className="status-cell">
                                            <span className="badge badge--pending">Pending</span>
                                        </td>
                                        <td className="decision-cell" style={{ textAlign: "right" }}>
                                            <div className="decision-actions">
                                                <button
                                                    type="button"
                                                    className="btn-accept"
                                                    aria-label="Accept Alex Rivera"
                                                >
                                                    <span
                                                        className="material-symbols-outlined"
                                                        style={{ fontSize: 16 }}
                                                    >
                                                        check
                                                    </span>{" "}
                                                    Accept
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-reject"
                                                    aria-label="Reject Alex Rivera"
                                                >
                                                    <span
                                                        className="material-symbols-outlined"
                                                        style={{ fontSize: 16 }}
                                                    >
                                                        close
                                                    </span>{" "}
                                                    Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr
                                        className="applicant-row"
                                        data-status="pending"
                                        data-id="app-2"
                                    >
                                        <td>
                                            <div className="applicant-entity">
                                                <div className="applicant-avatar">N</div>
                                                <div>
                                                    <a
                                                        className="applicant-name"
                                                        href="/org/applicants"
                                                    >
                                                        Nadia Farouk
                                                    </a>
                                                    <p className="applicant-headline">
                                                        Final-year CS student
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                className="match-score match-score--strong"
                                                title="AI Match Score: 88%"
                                            >
                                                88% match
                                            </span>
                                        </td>
                                        <td>
                                            <div className="skills-list">
                                                <span className="skill-chip">Python</span>
                                                <span className="skill-chip">ML</span>
                                            </div>
                                        </td>
                                        <td className="status-cell">
                                            <span className="badge badge--pending">Pending</span>
                                        </td>
                                        <td className="decision-cell" style={{ textAlign: "right" }}>
                                            <div className="decision-actions">
                                                <button
                                                    type="button"
                                                    className="btn-accept"
                                                    aria-label="Accept Nadia Farouk"
                                                >
                                                    <span
                                                        className="material-symbols-outlined"
                                                        style={{ fontSize: 16 }}
                                                    >
                                                        check
                                                    </span>{" "}
                                                    Accept
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-reject"
                                                    aria-label="Reject Nadia Farouk"
                                                >
                                                    <span
                                                        className="material-symbols-outlined"
                                                        style={{ fontSize: 16 }}
                                                    >
                                                        close
                                                    </span>{" "}
                                                    Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr
                                        className="applicant-row"
                                        data-status="accepted"
                                        data-id="app-3"
                                    >
                                        <td>
                                            <div className="applicant-entity">
                                                <div className="applicant-avatar">M</div>
                                                <div>
                                                    <a
                                                        className="applicant-name"
                                                        href="/org/applicants"
                                                    >
                                                        Marcus Lee
                                                    </a>
                                                    <p className="applicant-headline">Product Designer</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                className="match-score match-score--moderate"
                                                title="AI Match Score: 76%"
                                            >
                                                76% match
                                            </span>
                                        </td>
                                        <td>
                                            <div className="skills-list">
                                                <span className="skill-chip">UI/UX</span>
                                                <span className="skill-chip">Three.js</span>
                                            </div>
                                        </td>
                                        <td className="status-cell">
                                            <span className="badge badge--approved">Accepted</span>
                                        </td>
                                        <td className="decision-cell" style={{ textAlign: "right" }}>
                                            <span className="decision-state">
                                                <span className="material-symbols-outlined">
                                                    check_circle
                                                </span>
                                                Reviewed
                                            </span>
                                        </td>
                                    </tr>
                                    <tr
                                        className="applicant-row"
                                        data-status="accepted"
                                        data-id="app-4"
                                    >
                                        <td>
                                            <div className="applicant-entity">
                                                <div className="applicant-avatar">E</div>
                                                <div>
                                                    <a
                                                        className="applicant-name"
                                                        href="/org/applicants"
                                                    >
                                                        Elena Rodriguez
                                                    </a>
                                                    <p className="applicant-headline">Data Analyst</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                className="match-score match-score--strong"
                                                title="AI Match Score: 81%"
                                            >
                                                81% match
                                            </span>
                                        </td>
                                        <td>
                                            <div className="skills-list">
                                                <span className="skill-chip">Python</span>
                                                <span className="skill-chip">Data Viz</span>
                                            </div>
                                        </td>
                                        <td className="status-cell">
                                            <span className="badge badge--approved">Accepted</span>
                                        </td>
                                        <td className="decision-cell" style={{ textAlign: "right" }}>
                                            <span className="decision-state">
                                                <span className="material-symbols-outlined">
                                                    check_circle
                                                </span>
                                                Reviewed
                                            </span>
                                        </td>
                                    </tr>
                                    <tr
                                        className="applicant-row"
                                        data-status="rejected"
                                        data-id="app-5"
                                    >
                                        <td>
                                            <div className="applicant-entity">
                                                <div className="applicant-avatar">K</div>
                                                <div>
                                                    <a
                                                        className="applicant-name"
                                                        href="/org/applicants"
                                                    >
                                                        Kevin Park
                                                    </a>
                                                    <p className="applicant-headline">Mobile Developer</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                className="match-score match-score--neutral"
                                                title="AI Match Score: 55%"
                                            >
                                                55% match
                                            </span>
                                        </td>
                                        <td>
                                            <div className="skills-list">
                                                <span className="skill-chip">Flutter</span>
                                            </div>
                                        </td>
                                        <td className="status-cell">
                                            <span className="badge badge--rejected">Rejected</span>
                                        </td>
                                        <td className="decision-cell" style={{ textAlign: "right" }}>
                                            <span className="decision-state">
                                                <span className="material-symbols-outlined">mail</span>
                                                Notified
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {/* Empty State when status filter yields 0 results */}
                        <div className="applicants-empty" id="applicants-empty-state" hidden="">
                            <div className="applicants-empty__icon">
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: 26 }}
                                    aria-hidden="true"
                                >
                                    group_off
                                </span>
                            </div>
                            <h3 className="applicants-empty__title">
                                No applicants in this category
                            </h3>
                            <p className="applicants-empty__desc">
                                There are no applicants matching the selected status filter.
                            </p>
                            <button
                                type="button"
                                className="btn-secondary mt-2"
                                id="applicants-empty-reset"
                            >
                                Show all applicants
                            </button>
                        </div>
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
                    <a className="nav-link" href="/org/applicants" aria-current="page">
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
