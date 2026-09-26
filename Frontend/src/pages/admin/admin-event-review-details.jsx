export default function AdminEventReviewDetails() {
    return (
        <>
            <meta charSet="utf-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <title>Event Review Details | EVENTIFY</title>
            <meta
                name="description"
                content="Event Review Details on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
            />
            <meta property="og:title" content="Event Review Details | EVENTIFY" />
            <meta
                property="og:description"
                content="Event Review Details on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
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
                <span className="rounded-full bg-primary/10 px-3 py-1 text-label-sm font-label-sm text-primary">
                    ADMIN
                </span>
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
                    <span className="mb-8 w-fit rounded-full bg-primary/10 px-3 py-1 text-label-sm font-label-sm text-primary">
                        ADMIN
                    </span>
                    <nav className="flex flex-1 flex-col gap-1" aria-label="Admin sections">
                        <div className="nav-group">
                            <a className="nav-link" href="/admin/dashboard">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    dashboard
                                </span>
                                Overview
                            </a>
                            <a className="nav-link" href="/admin/events" aria-current="page">
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
                        <p className="text-label-sm font-label-sm text-error">Full access</p>
                    </div>
                </aside>
                <main className="w-full flex-1 px-4 pt-6 pb-24 md:px-10 lg:pb-8">
                    {/* Global Top Header: page title (left) + global controls (right) */}
                    <div className="admin-topbar">
                        <h1 className="admin-topbar__title">Event Review Details</h1>
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
                    <div className="mb-6 flex items-center gap-2 text-label-md">
                        <a
                            className="text-on-surface-variant hover:text-primary"
                            href="/admin/events"
                        >
                            Review Events
                        </a>
                        <span className="text-outline">/</span>
                        <span>DevOps Masterclass</span>
                    </div>
                    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <p className="mt-1 text-on-surface-variant">
                                Validate content quality, organizer trust, dates, and publishing
                                readiness.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button type="button" className="btn-danger-outline">
                                Reject with reason
                            </button>
                            <button type="button" className="btn-success">
                                Approve publish
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <section className="section-card lg:col-span-2">
                            <div className="mb-6 flex flex-wrap items-center gap-2">
                                <span className="badge badge--pending">Pending approval</span>
                                <span className="rounded-full bg-primary/10 px-3 py-1 text-label-sm font-semibold text-primary">
                                    Course
                                </span>
                                <span className="rounded-full bg-surface-container px-3 py-1 text-label-sm font-semibold text-on-surface-variant">
                                    Online
                                </span>
                            </div>
                            <h2 className="text-headline-md font-semibold">DevOps Masterclass</h2>
                            <p className="mt-2 text-on-surface-variant">
                                A hands-on cloud lab covering CI/CD, Kubernetes, and infrastructure
                                as code over 6 weeks.
                            </p>
                            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="rounded-xl bg-surface-container-low p-4">
                                    <p className="text-label-sm font-semibold text-on-surface-variant">
                                        Organizer
                                    </p>
                                    <p className="font-semibold">TechGenius Labs</p>
                                </div>
                                <div className="rounded-xl bg-surface-container-low p-4">
                                    <p className="text-label-sm font-semibold text-on-surface-variant">
                                        Dates
                                    </p>
                                    <p className="font-semibold">Nov 12 - Dec 24, 2026</p>
                                </div>
                                <div className="rounded-xl bg-surface-container-low p-4">
                                    <p className="text-label-sm font-semibold text-on-surface-variant">
                                        Target audience
                                    </p>
                                    <p className="font-semibold">Students and junior developers</p>
                                </div>
                                <div className="rounded-xl bg-surface-container-low p-4">
                                    <p className="text-label-sm font-semibold text-on-surface-variant">
                                        Capacity
                                    </p>
                                    <p className="font-semibold">120 participants</p>
                                </div>
                            </div>
                            <div className="mt-8">
                                <h3 className="mb-4 text-title-lg font-semibold">Requirements</h3>
                                <ul className="space-y-2 text-on-surface-variant">
                                    <li>Basic Linux command-line knowledge.</li>
                                    <li>GitHub account and laptop with stable internet.</li>
                                    <li>Weekly attendance for live labs.</li>
                                </ul>
                            </div>
                        </section>
                        <aside className="space-y-6">
                            <section className="section-card">
                                <h3 className="mb-4 text-title-lg font-semibold">
                                    Review Checklist
                                </h3>
                                <div className="space-y-3 text-label-md">
                                    <p className="flex justify-between">
                                        <span>Verified organizer</span>
                                        <span className="text-success">Pass</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>Clear description</span>
                                        <span className="text-success">Pass</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>Valid dates</span>
                                        <span className="text-success">Pass</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>Policy risk</span>
                                        <span className="text-tertiary">Low</span>
                                    </p>
                                </div>
                            </section>
                            <section className="section-card">
                                <h3 className="mb-4 text-title-lg font-semibold">
                                    Rejection Reason
                                </h3>
                                <textarea
                                    className="h-36 w-full resize-none rounded-xl border-outline-variant bg-white p-4"
                                    placeholder="Write a clear reason if rejecting..."
                                    defaultValue={""}
                                />
                                <button
                                    type="button"
                                    className="btn-danger-outline"
                                    style={{ width: "100%", marginTop: 12 }}
                                >
                                    Send rejection
                                </button>
                            </section>
                        </aside>
                    </div>
                </main>
            </div>
        </>
    )
}
