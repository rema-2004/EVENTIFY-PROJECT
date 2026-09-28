export default function OrgCreateEvent() {
    return (
        <>
            <meta charSet="utf-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <title>Create Event | EVENTIFY</title>
            <meta
                name="description"
                content="Create Event on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
            />
            <meta property="og:title" content="Create Event | EVENTIFY" />
            <meta
                property="og:description"
                content="Create Event on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
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
                            <a
                                className="nav-link"
                                href="/org/create-event"
                                aria-current="page"
                            >
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
                <main className="flex-1 w-full px-4 md:px-12 pt-6 pb-24 lg:pb-8">
                    {/* Global Top Header: page title (left) + global controls (right) */}
                    <div className="org-topbar">
                        <h1 className="org-topbar__title">Create Event</h1>
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
                            <span className="font-semibold text-on-surface">Create Event</span>
                        </div>
                        <p className="profile-page-desc">
                            Submitted events are reviewed by our team before they go live.
                        </p>
                    </div>
                    <div className="mx-auto w-full max-w-4xl">
                        {/* Step Indicator */}
                        <div
                            className="wizard-stepper"
                            id="wizard-steps"
                            role="tablist"
                            aria-label="Creation Steps"
                        >
                            <span className="wizard-chip active" data-step-chip={1}>
                                <span className="chip-num">1</span> Event Details
                            </span>
                            <span className="stepper-sep">•</span>
                            <span className="wizard-chip" data-step-chip={2}>
                                <span className="chip-num">2</span> Review
                            </span>
                            <span className="stepper-sep">•</span>
                            <span className="wizard-chip" data-step-chip={3}>
                                <span className="chip-num">3</span> Publish
                            </span>
                        </div>
                        {/* Wizard Form Card */}
                        <form className="wizard-form-card" id="event-wizard" noValidate="">
                            {/* Step 1: Event Details */}
                            <section className="flex flex-col gap-6" data-step={1}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="ev-title">
                                        Event Title <span style={{ color: "var(--accent)" }}>*</span>
                                    </label>
                                    <input
                                        className="form-input"
                                        id="ev-title"
                                        name="title"
                                        placeholder="e.g. Global AI Innovation Challenge"
                                        required=""
                                        type="text"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Custom Category Dropdown Component */}
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="ev-type">
                                            Category <span style={{ color: "var(--accent)" }}>*</span>
                                        </label>
                                        <div className="org-cat-dropdown">
                                            <button
                                                type="button"
                                                className="org-cat-btn"
                                                id="org-category-toggle"
                                                aria-haspopup="listbox"
                                                aria-expanded="false"
                                                aria-label="Select event category"
                                            >
                                                <div className="btn-left">
                                                    <span
                                                        className="material-symbols-outlined cat-icon"
                                                        aria-hidden="true"
                                                    >
                                                        category
                                                    </span>
                                                    <span id="org-category-selected-name">Competition</span>
                                                </div>
                                                <span
                                                    className="material-symbols-outlined chevron-icon"
                                                    aria-hidden="true"
                                                >
                                                    expand_more
                                                </span>
                                            </button>
                                            <div
                                                className="org-cat-panel"
                                                id="org-category-panel"
                                                hidden=""
                                                role="listbox"
                                                aria-label="Event categories"
                                            >
                                                <button
                                                    type="button"
                                                    className="org-cat-item active"
                                                    data-value="Competition"
                                                    role="option"
                                                    aria-selected="true"
                                                >
                                                    <span>Competition</span>
                                                    <span
                                                        className="material-symbols-outlined active-check"
                                                        aria-hidden="true"
                                                    >
                                                        check
                                                    </span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="org-cat-item"
                                                    data-value="Event"
                                                    role="option"
                                                    aria-selected="false"
                                                >
                                                    <span>Event</span>
                                                    <span
                                                        className="material-symbols-outlined active-check"
                                                        aria-hidden="true"
                                                    >
                                                        check
                                                    </span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="org-cat-item"
                                                    data-value="Workshop"
                                                    role="option"
                                                    aria-selected="false"
                                                >
                                                    <span>Workshop</span>
                                                    <span
                                                        className="material-symbols-outlined active-check"
                                                        aria-hidden="true"
                                                    >
                                                        check
                                                    </span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="org-cat-item"
                                                    data-value="Course"
                                                    role="option"
                                                    aria-selected="false"
                                                >
                                                    <span>Course</span>
                                                    <span
                                                        className="material-symbols-outlined active-check"
                                                        aria-hidden="true"
                                                    >
                                                        check
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                        {/* Underlying Select for full form & script synchronization */}
                                        <select
                                            id="ev-type"
                                            name="category"
                                            className="sr-only"
                                            aria-hidden="true"
                                            tabIndex={-1}
                                        >
                                            <option value="Competition">Competition</option>
                                            <option value="Event">Event</option>
                                            <option value="Workshop">Workshop</option>
                                            <option value="Course">Course</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="ev-location">
                                            Location
                                        </label>
                                        <input
                                            className="form-input"
                                            id="ev-location"
                                            name="location"
                                            placeholder="e.g. Remote, Amman, JO or Online"
                                            type="text"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="ev-start">
                                            Start Date
                                        </label>
                                        <input
                                            className="form-input"
                                            id="ev-start"
                                            name="startDate"
                                            type="date"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="ev-end">
                                            End Date
                                        </label>
                                        <input
                                            className="form-input"
                                            id="ev-end"
                                            name="endDate"
                                            type="date"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="ev-desc">
                                        Description
                                    </label>
                                    <textarea
                                        className="form-textarea"
                                        id="ev-desc"
                                        name="description"
                                        placeholder="Describe the challenge, agenda, and what participants will build or learn."
                                        rows={4}
                                        defaultValue={""}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="ev-cond">
                                        Requirements / Conditions
                                    </label>
                                    <textarea
                                        className="form-textarea"
                                        id="ev-cond"
                                        name="requirements"
                                        placeholder="Team size, eligibility, required skills..."
                                        rows={3}
                                        defaultValue={""}
                                    />
                                </div>
                                <div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                    id="ev-competition-fields"
                                >
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="ev-prize">
                                            Prize / Scholarship
                                        </label>
                                        <input
                                            className="form-input"
                                            id="ev-prize"
                                            name="prize"
                                            placeholder="e.g. $10,000 Prize Pool"
                                            type="text"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="ev-team">
                                            Team Size
                                        </label>
                                        <input
                                            className="form-input"
                                            id="ev-team"
                                            name="teamSize"
                                            placeholder="e.g. 2-4 members"
                                            type="text"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="ev-cover">
                                        Cover Image
                                    </label>
                                    <label className="upload-dropzone" htmlFor="ev-cover">
                                        <span className="upload-dropzone__icon">
                                            <span
                                                className="material-symbols-outlined"
                                                aria-hidden="true"
                                            >
                                                upload
                                            </span>
                                        </span>
                                        <p className="upload-dropzone__label" id="ev-cover-label">
                                            Drag and drop, or click to upload cover image
                                        </p>
                                        <span className="upload-dropzone__hint">
                                            PNG, JPG or JPEG (max. 5MB)
                                        </span>
                                    </label>
                                    <input
                                        accept="image/*"
                                        className="sr-only"
                                        id="ev-cover"
                                        name="cover"
                                        type="file"
                                    />
                                </div>
                            </section>
                            {/* Step 2: Review */}
                            <section className="hidden flex-col gap-5" data-step={2}>
                                <div>
                                    <h3 className="font-headline-lg text-title-lg text-on-surface mb-1">
                                        Review your event details
                                    </h3>
                                    <p style={{ fontSize: "13.5px", color: "var(--text-muted)" }}>
                                        Check the details below before submitting. You can go back to
                                        edit any section.
                                    </p>
                                </div>
                                <dl
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    id="wizard-review"
                                />
                            </section>
                            {/* Step 3: Publish */}
                            <section
                                className="hidden flex-col items-center gap-3 py-6 text-center"
                                data-step={3}
                            >
                                <div className="publish-success-card">
                                    <div className="publish-icon">
                                        <span className="material-symbols-outlined" aria-hidden="true">
                                            task_alt
                                        </span>
                                    </div>
                                    <h3 className="font-headline-lg text-title-lg text-on-surface">
                                        Ready to Submit for Approval
                                    </h3>
                                    <p
                                        style={{
                                            fontSize: "13.5px",
                                            color: "var(--text-muted)",
                                            maxWidth: 440,
                                            margin: "0 auto"
                                        }}
                                    >
                                        Publishing sends the event to the EVENTIFY review team. You will
                                        receive a notification once it is approved and live for
                                        participants.
                                    </p>
                                </div>
                            </section>
                            {/* Action Button Bar */}
                            <div className="wizard-actions">
                                <a className="wizard-cancel-link" href="/org/dashboard">
                                    Cancel
                                </a>
                                <div className="flex items-center gap-3">
                                    <button
                                        className="btn-secondary hidden"
                                        id="wizard-back"
                                        type="button"
                                    >
                                        Back
                                    </button>
                                    <button className="btn-secondary" id="wizard-draft" type="button">
                                        Save Draft
                                    </button>
                                    <button
                                        className="btn-primary"
                                        id="wizard-next"
                                        type="button"
                                        style={{ minWidth: 130 }}
                                    >
                                        Next
                                    </button>
                                    <button
                                        className="btn-primary hidden"
                                        id="wizard-publish"
                                        type="button"
                                        style={{ minWidth: 130 }}
                                    >
                                        Publish
                                    </button>
                                </div>
                            </div>
                        </form>
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
                    <a className="nav-link" href="/org/create-event" aria-current="page">
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
