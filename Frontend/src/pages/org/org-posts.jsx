export default function OrgPosts() {
    return (
        <>
            <meta charSet="utf-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <title>Posts | EVENTIFY</title>
            <meta
                name="description"
                content="Posts on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
            />
            <meta property="og:title" content="Posts | EVENTIFY" />
            <meta
                property="og:description"
                content="Posts on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
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
                            <a className="nav-link" href="/org/posts" aria-current="page">
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
                <main className="w-full flex-1 px-4 pt-6 pb-24 md:px-10 lg:pb-8">
                    {/* Global Top Header: page title (left) + global controls (right) */}
                    <div className="org-topbar">
                        <h1 className="org-topbar__title">Posts</h1>
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
                            <span className="font-semibold text-on-surface">Posts</span>
                        </div>
                        <p className="profile-page-desc">
                            Share updates, announcements, and news with the people following
                            TechGenius Labs.
                        </p>
                        <div className="org-page-header__actions">
                            <div className="panel" style={{ padding: "12px 20px" }}>
                                <p className="text-sm text-on-surface-variant">Active followers</p>
                                <p className="text-2xl font-semibold text-on-surface font-mono">
                                    3,214
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_0.9fr]">
                        <div className="space-y-4">
                            {/* Composer */}
                            <div className="soft-card premium-card rounded-[28px] p-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <span className="material-symbols-outlined text-[18px]">
                                            edit_square
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-title-lg font-semibold text-on-surface">
                                            Write a new post
                                        </h3>
                                        <p className="text-sm text-on-surface-variant">
                                            Keep your audience informed with concise updates.
                                        </p>
                                    </div>
                                </div>
                                <textarea
                                    className="w-full resize-none rounded-2xl border border-outline-variant/60 bg-surface-container-low p-4 text-body-md text-on-surface shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    id="post-content"
                                    placeholder="Share news, a registration deadline, or an update with your followers…"
                                    rows={3}
                                    defaultValue={""}
                                />
                                <p
                                    id="composerImageName"
                                    className="mt-2 hidden text-sm text-on-surface-variant"
                                />
                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                    <input
                                        type="file"
                                        id="postImageInput"
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <button id="addImageBtn" className="btn-secondary" type="button">
                                        <span
                                            className="material-symbols-outlined"
                                            style={{ fontSize: 18 }}
                                        >
                                            image
                                        </span>{" "}
                                        Add image
                                    </button>
                                    <button id="publishPostBtn" className="btn-primary" type="button">
                                        Publish
                                    </button>
                                </div>
                            </div>
                            {/* Published Posts */}
                            <div className="flex items-center justify-between pt-2">
                                <h3 className="text-title-lg font-semibold">Your Posts</h3>
                                <span
                                    id="postsCount"
                                    className="rounded-full bg-surface-container px-3 py-1 text-sm text-on-surface-variant"
                                >
                                    5 updates
                                </span>
                            </div>
                            <div id="publishedPosts" className="space-y-4">
                                <div
                                    className="soft-card premium-card rounded-[28px] p-6"
                                    data-post=""
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-label-md font-semibold text-primary">
                                                TG
                                            </div>
                                            <div>
                                                <p className="font-semibold text-on-surface">
                                                    TechGenius Labs
                                                </p>
                                                <p className="text-sm text-on-surface-variant">
                                                    2 hours ago • Announcement
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 gap-1">
                                            <button
                                                className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high"
                                                title="Edit post"
                                                aria-label="Edit post"
                                                type="button"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">
                                                    edit
                                                </span>
                                            </button>
                                            <button
                                                className="rounded-lg p-2 text-error transition-colors hover:bg-error/10"
                                                title="Delete post"
                                                aria-label="Delete post"
                                                type="button"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">
                                                    delete
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                    <p
                                        className="mt-4 text-body-md text-on-surface-variant"
                                        data-post-body=""
                                    >
                                        Registration for the{" "}
                                        <span className="font-semibold text-on-surface">
                                            Global AI Innovation Challenge
                                        </span>{" "}
                                        is now open! Teams of 2-4, $10k in prizes, remote-friendly.
                                        Apply before Oct 26.
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                                            Opportunity
                                        </span>
                                        <span className="rounded-full bg-surface-container px-3 py-1 text-sm text-on-surface-variant">
                                            Apply now
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className="soft-card premium-card rounded-[28px] p-6"
                                    data-post=""
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary/10 text-label-md font-semibold text-secondary">
                                                CF
                                            </div>
                                            <div>
                                                <p className="font-semibold text-on-surface">
                                                    TechGenius Labs
                                                </p>
                                                <p className="text-sm text-on-surface-variant">
                                                    1 day ago • Event
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 gap-1">
                                            <button
                                                className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high"
                                                title="Edit post"
                                                aria-label="Edit post"
                                                type="button"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">
                                                    edit
                                                </span>
                                            </button>
                                            <button
                                                className="rounded-lg p-2 text-error transition-colors hover:bg-error/10"
                                                title="Delete post"
                                                aria-label="Delete post"
                                                type="button"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">
                                                    delete
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                    <p
                                        className="mt-4 text-body-md text-on-surface-variant"
                                        data-post-body=""
                                    >
                                        Our booth at the{" "}
                                        <span className="font-semibold text-on-surface">
                                            Career &amp; Internship Fair
                                        </span>{" "}
                                        is confirmed — come say hi and pick up an application on the
                                        spot.
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <span className="rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success">
                                            On-site
                                        </span>
                                        <span className="rounded-full bg-surface-container px-3 py-1 text-sm text-on-surface-variant">
                                            Meet us there
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className="soft-card premium-card rounded-[28px] p-6 opacity-95"
                                    data-post=""
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-tertiary/10 text-label-md font-semibold text-tertiary">
                                                DM
                                            </div>
                                            <div>
                                                <p className="font-semibold text-on-surface">
                                                    TechGenius Labs
                                                </p>
                                                <p className="text-sm text-on-surface-variant">
                                                    6 days ago • Wrap-up
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 gap-1">
                                            <button
                                                className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high"
                                                title="Edit post"
                                                aria-label="Edit post"
                                                type="button"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">
                                                    edit
                                                </span>
                                            </button>
                                            <button
                                                className="rounded-lg p-2 text-error transition-colors hover:bg-error/10"
                                                title="Delete post"
                                                aria-label="Delete post"
                                                type="button"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">
                                                    delete
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                    <p
                                        className="mt-4 text-body-md text-on-surface-variant"
                                        data-post-body=""
                                    >
                                        DevOps Masterclass wrapped this week — thank you to everyone who
                                        joined! Certificates go out by Friday.
                                    </p>
                                </div>
                                <div
                                    className="soft-card premium-card rounded-[28px] p-6"
                                    data-post=""
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-label-md font-semibold text-primary">
                                                AI
                                            </div>
                                            <div>
                                                <p className="font-semibold text-on-surface">
                                                    TechGenius Labs
                                                </p>
                                                <p className="text-sm text-on-surface-variant">
                                                    1 week ago • Community
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 gap-1">
                                            <button
                                                className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high"
                                                title="Edit post"
                                                aria-label="Edit post"
                                                type="button"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">
                                                    edit
                                                </span>
                                            </button>
                                            <button
                                                className="rounded-lg p-2 text-error transition-colors hover:bg-error/10"
                                                title="Delete post"
                                                aria-label="Delete post"
                                                type="button"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">
                                                    delete
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                    <p
                                        className="mt-4 text-body-md text-on-surface-variant"
                                        data-post-body=""
                                    >
                                        We are hosting a live Q&amp;A session next week for students
                                        interested in AI and product design. Save your spot now.
                                    </p>
                                </div>
                                <div
                                    className="soft-card premium-card rounded-[28px] p-6"
                                    data-post=""
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary/10 text-label-md font-semibold text-secondary">
                                                NS
                                            </div>
                                            <div>
                                                <p className="font-semibold text-on-surface">
                                                    TechGenius Labs
                                                </p>
                                                <p className="text-sm text-on-surface-variant">
                                                    2 weeks ago • Network
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 gap-1">
                                            <button
                                                className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high"
                                                title="Edit post"
                                                aria-label="Edit post"
                                                type="button"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">
                                                    edit
                                                </span>
                                            </button>
                                            <button
                                                className="rounded-lg p-2 text-error transition-colors hover:bg-error/10"
                                                title="Delete post"
                                                aria-label="Delete post"
                                                type="button"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">
                                                    delete
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                    <p
                                        className="mt-4 text-body-md text-on-surface-variant"
                                        data-post-body=""
                                    >
                                        New networking session with founders and mentors is now open for
                                        registration. Join the conversation and grow your circle.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2 flex justify-center">
                                <button
                                    id="loadMoreBtn"
                                    className="rounded-full border border-primary/20 px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                                    type="button"
                                >
                                    Load more
                                </button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="rounded-[28px] border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-sm">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-title-lg font-semibold">
                                        Explore Other Posts
                                    </h3>
                                    <span className="rounded-full bg-primary/10 px-3 py-1 text-label-sm text-primary">
                                        Discover
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-low p-3">
                                        <p className="mb-2 text-sm font-semibold text-primary">
                                            Latest posts
                                        </p>
                                        <div className="space-y-2">
                                            <button
                                                className="w-full rounded-xl border border-outline-variant/30 bg-surface p-3 text-left transition-colors hover:border-primary/30 hover:bg-surface-container-high"
                                                type="button"
                                                data-org="GreenFuture Initiative"
                                                data-title="Community Volunteer Day"
                                                data-body="Join our team this Friday to plant 300 trees and support a greener city. The event starts at 8:00 AM and everyone is welcome."
                                                data-meta="Posted 2 hours ago • Open for volunteers"
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div>
                                                        <p className="font-semibold text-on-surface">
                                                            GreenFuture Initiative
                                                        </p>
                                                        <p className="mt-1 text-sm text-on-surface-variant">
                                                            Volunteer day this Friday — join us to plant 300
                                                            trees.
                                                        </p>
                                                    </div>
                                                    <span className="material-symbols-outlined text-[18px] text-primary">
                                                        chevron_right
                                                    </span>
                                                </div>
                                            </button>
                                            <button
                                                className="w-full rounded-xl border border-outline-variant/30 bg-surface p-3 text-left transition-colors hover:border-primary/30 hover:bg-surface-container-high"
                                                type="button"
                                                data-org="City Tech Hub"
                                                data-title="Startup Bootcamp Open"
                                                data-body="Students can now register for our startup bootcamp to learn product design, pitch building, and founder basics with mentors."
                                                data-meta="Posted 1 day ago • Registration open"
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div>
                                                        <p className="font-semibold text-on-surface">
                                                            City Tech Hub
                                                        </p>
                                                        <p className="mt-1 text-sm text-on-surface-variant">
                                                            New startup bootcamp registrations are now open for
                                                            students.
                                                        </p>
                                                    </div>
                                                    <span className="material-symbols-outlined text-[18px] text-primary">
                                                        chevron_right
                                                    </span>
                                                </div>
                                            </button>
                                            <button
                                                className="w-full rounded-xl border border-outline-variant/30 bg-surface p-3 text-left transition-colors hover:border-primary/30 hover:bg-surface-container-high"
                                                type="button"
                                                data-org="Creative Minds Studio"
                                                data-title="Design Challenge Results"
                                                data-body="The winners of our design challenge will be announced next week. Stay tuned for featured projects and awards."
                                                data-meta="Posted 3 days ago • Upcoming announcement"
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div>
                                                        <p className="font-semibold text-on-surface">
                                                            Creative Minds Studio
                                                        </p>
                                                        <p className="mt-1 text-sm text-on-surface-variant">
                                                            Design challenge winners will be announced next week.
                                                        </p>
                                                    </div>
                                                    <span className="material-symbols-outlined text-[18px] text-primary">
                                                        chevron_right
                                                    </span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                    <div
                                        id="postsListContainer"
                                        className="hidden max-h-80 space-y-2 overflow-y-auto pr-1"
                                    >
                                        <button
                                            className="w-full rounded-xl border border-outline-variant/30 bg-surface p-3 text-left transition-colors hover:border-primary/30 hover:bg-surface-container-high"
                                            type="button"
                                            data-org="GreenFuture Initiative"
                                            data-title="Community Volunteer Day"
                                            data-body="Join our team this Friday to plant 300 trees and support a greener city. The event starts at 8:00 AM and everyone is welcome."
                                            data-meta="Posted 2 hours ago • Open for volunteers"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <p className="font-semibold text-on-surface">
                                                        GreenFuture Initiative
                                                    </p>
                                                    <p className="mt-1 text-sm text-on-surface-variant">
                                                        Volunteer day this Friday — join us to plant 300 trees.
                                                    </p>
                                                </div>
                                                <span className="material-symbols-outlined text-[18px] text-primary">
                                                    chevron_right
                                                </span>
                                            </div>
                                        </button>
                                        <button
                                            className="w-full rounded-xl border border-outline-variant/30 bg-surface p-3 text-left transition-colors hover:border-primary/30 hover:bg-surface-container-high"
                                            type="button"
                                            data-org="City Tech Hub"
                                            data-title="Startup Bootcamp Open"
                                            data-body="Students can now register for our startup bootcamp to learn product design, pitch building, and founder basics with mentors."
                                            data-meta="Posted 1 day ago • Registration open"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <p className="font-semibold text-on-surface">
                                                        City Tech Hub
                                                    </p>
                                                    <p className="mt-1 text-sm text-on-surface-variant">
                                                        New startup bootcamp registrations are now open for
                                                        students.
                                                    </p>
                                                </div>
                                                <span className="material-symbols-outlined text-[18px] text-primary">
                                                    chevron_right
                                                </span>
                                            </div>
                                        </button>
                                        <button
                                            className="w-full rounded-xl border border-outline-variant/30 bg-surface p-3 text-left transition-colors hover:border-primary/30 hover:bg-surface-container-high"
                                            type="button"
                                            data-org="Creative Minds Studio"
                                            data-title="Design Challenge Results"
                                            data-body="The winners of our design challenge will be announced next week. Stay tuned for featured projects and awards."
                                            data-meta="Posted 3 days ago • Upcoming announcement"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <p className="font-semibold text-on-surface">
                                                        Creative Minds Studio
                                                    </p>
                                                    <p className="mt-1 text-sm text-on-surface-variant">
                                                        Design challenge winners will be announced next week.
                                                    </p>
                                                </div>
                                                <span className="material-symbols-outlined text-[18px] text-primary">
                                                    chevron_right
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                    <div className="flex justify-center">
                                        <button
                                            id="viewAllPostsBtn"
                                            className="rounded-full border border-primary/20 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                                            type="button"
                                        >
                                            View all posts
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="soft-card premium-card rounded-[28px] p-5">
                                <h3 className="text-title-lg font-semibold">Posting Tips</h3>
                                <div className="mt-3 space-y-3">
                                    <p className="flex items-start gap-2 text-sm text-on-surface-variant">
                                        <span className="material-symbols-outlined text-[18px] text-tertiary">
                                            check_circle
                                        </span>{" "}
                                        Mention deadlines to create urgency.
                                    </p>
                                    <p className="flex items-start gap-2 text-sm text-on-surface-variant">
                                        <span className="material-symbols-outlined text-[18px] text-tertiary">
                                            check_circle
                                        </span>{" "}
                                        Add a clear image to boost engagement.
                                    </p>
                                    <p className="flex items-start gap-2 text-sm text-on-surface-variant">
                                        <span className="material-symbols-outlined text-[18px] text-tertiary">
                                            check_circle
                                        </span>{" "}
                                        Keep updates short and specific.
                                    </p>
                                </div>
                            </div>
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
                    <a className="nav-link" href="/org/posts" aria-current="page">
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
            <div
                id="postModal"
                className="fixed inset-0 z-[60] hidden items-center justify-center bg-black/40 p-4"
            >
                <div className="soft-card w-full max-w-lg rounded-[30px] border border-outline-variant/50 p-6 shadow-2xl">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p id="modalOrg" className="text-label-md font-semibold text-primary">
                                Organization
                            </p>
                            <h3
                                id="modalTitle"
                                className="mt-1 text-title-lg font-semibold text-on-surface"
                            >
                                Post details
                            </h3>
                        </div>
                        <button
                            id="closeModalBtn"
                            className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high"
                            type="button"
                            aria-label="Close post details"
                        >
                            <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                    </div>
                    <p id="modalBody" className="mt-4 text-body-md text-on-surface-variant" />
                    <div className="mt-6 flex items-center justify-between rounded-xl bg-surface-container p-3 text-sm text-on-surface-variant">
                        <span id="modalMeta">Loading...</span>
                        <button
                            id="modalActionBtn"
                            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-on-primary"
                            type="button"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
