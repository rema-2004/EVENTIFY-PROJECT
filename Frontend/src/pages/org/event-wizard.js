// Three-step create-event flow: details -> review -> publish.
// Draft values are kept in localStorage so a reload does not lose the form.

(function () {
    const DRAFT_KEY = 'eventify:event-draft';

    const form = document.getElementById('event-wizard');
    if (!form) return;

    const steps = [...form.querySelectorAll('[data-step]')];
    const chips = [...document.querySelectorAll('[data-step-chip]')];
    const review = document.getElementById('wizard-review');
    const backBtn = document.getElementById('wizard-back');
    const nextBtn = document.getElementById('wizard-next');
    const draftBtn = document.getElementById('wizard-draft');
    const publishBtn = document.getElementById('wizard-publish');
    const coverInput = document.getElementById('ev-cover');
    const coverLabel = document.getElementById('ev-cover-label');

    // Category Dropdown Elements
    const catToggle = document.getElementById('org-category-toggle');
    const catPanel = document.getElementById('org-category-panel');
    const catSelectedName = document.getElementById('org-category-selected-name');
    const nativeCatSelect = document.getElementById('ev-type');
    const competitionFields = document.getElementById('ev-competition-fields');
    const COMPETITION_ONLY_FIELDS = ['prize', 'teamSize'];
    const COMPETITION_CATEGORY = 'Competition';

    const LABELS = {
        title: 'Event title',
        category: 'Category',
        location: 'Location',
        startDate: 'Start date',
        endDate: 'End date',
        description: 'Description',
        requirements: 'Requirements',
        prize: 'Prize / scholarship',
        teamSize: 'Team size'
    };

    let step = 1;

    const toast = (message, tone) =>
        window.EventifyUI ? window.EventifyUI.toast(message, tone) : alert(message);

    function isCompetitionCategory() {
        return nativeCatSelect ? nativeCatSelect.value === COMPETITION_CATEGORY : false;
    }

    function syncCompetitionFieldsVisibility() {
        if (!competitionFields) return;
        const show = isCompetitionCategory();
        competitionFields.style.display = show ? '' : 'none';
        if (!show) {
            COMPETITION_ONLY_FIELDS.forEach(name => {
                const field = form.elements[name];
                if (field) field.value = '';
            });
        }
    }

    function values() {
        const data = {};
        const includeCompetitionFields = isCompetitionCategory();
        Object.keys(LABELS).forEach(name => {
            if (!includeCompetitionFields && COMPETITION_ONLY_FIELDS.includes(name)) return;
            const field = form.elements[name];
            if (field) data[name] = field.value.trim();
        });
        return data;
    }

    function saveDraft() {
        try {
            localStorage.setItem(DRAFT_KEY, JSON.stringify(values()));
        } catch { /* storage unavailable — the form still works in-session */ }
    }

    function syncCategoryUI(catValue) {
        if (catSelectedName) catSelectedName.textContent = catValue;
        if (catPanel) {
            catPanel.querySelectorAll('.org-cat-item').forEach(item => {
                const isActive = item.dataset.value === catValue;
                item.classList.toggle('active', isActive);
            });
        }
    }

    function restoreDraft() {
        let data;
        try {
            data = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
        } catch {
            return;
        }
        Object.entries(data).forEach(([name, value]) => {
            const field = form.elements[name];
            if (field && value) {
                field.value = value;
                if (name === 'category') {
                    syncCategoryUI(value);
                }
            }
        });
    }

    function wireCategoryDropdown() {
        if (!catToggle || !catPanel || !nativeCatSelect) return;

        catToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = catPanel.hasAttribute('hidden');
            if (isHidden) {
                catPanel.removeAttribute('hidden');
                catToggle.setAttribute('aria-expanded', 'true');
            } else {
                catPanel.setAttribute('hidden', '');
                catToggle.setAttribute('aria-expanded', 'false');
            }
        });

        catPanel.querySelectorAll('.org-cat-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const val = item.dataset.value;
                if (val) {
                    nativeCatSelect.value = val;
                    syncCategoryUI(val);
                    syncCompetitionFieldsVisibility();
                    saveDraft();
                }
                catPanel.setAttribute('hidden', '');
                catToggle.setAttribute('aria-expanded', 'false');
            });
        });

        nativeCatSelect.addEventListener('change', () => {
            syncCategoryUI(nativeCatSelect.value);
            syncCompetitionFieldsVisibility();
        });

        document.addEventListener('click', (e) => {
            if (!catPanel.contains(e.target) && e.target !== catToggle) {
                catPanel.setAttribute('hidden', '');
                catToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    function renderReview() {
        const data = values();
        const includeCompetitionFields = isCompetitionCategory();
        review.innerHTML = Object.entries(LABELS)
            .filter(([name]) => includeCompetitionFields || !COMPETITION_ONLY_FIELDS.includes(name))
            .map(([name, label]) => `
            <div class="review-card">
                <dt class="review-label">${label}</dt>
                <dd class="review-value">${data[name] ? escapeHtml(data[name]) : '<span style="color:var(--text-muted)">Not provided</span>'}</dd>
            </div>`).join('');
    }

    function escapeHtml(value) {
        return value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    function show(target) {
        step = target;
        steps.forEach(section => {
            const active = Number(section.dataset.step) === step;
            section.classList.toggle('hidden', !active);
            section.classList.toggle('flex', active);
        });

        chips.forEach(chip => {
            const chipStep = Number(chip.dataset.stepChip);
            chip.classList.toggle('active', chipStep === step);
            chip.classList.toggle('completed', chipStep < step);
        });

        backBtn.classList.toggle('hidden', step === 1);
        nextBtn.classList.toggle('hidden', step === 3);
        publishBtn.classList.toggle('hidden', step !== 3);
        nextBtn.textContent = step === 2 ? 'Continue to publish' : 'Next';

        if (step === 2) renderReview();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function validateStepOne() {
        const { title, startDate, endDate } = values();
        if (!title) {
            toast('Add an event title first', 'error');
            if (form.elements.title) form.elements.title.focus();
            return false;
        }
        if (startDate && endDate && endDate < startDate) {
            toast('End date cannot be before the start date', 'error');
            return false;
        }
        return true;
    }

    nextBtn.addEventListener('click', () => {
        if (step === 1 && !validateStepOne()) return;
        saveDraft();
        show(step + 1);
    });

    backBtn.addEventListener('click', () => show(step - 1));

    draftBtn.addEventListener('click', () => {
        saveDraft();
        toast('Draft saved on this device', 'success');
    });

    publishBtn.addEventListener('click', () => {
        saveDraft();
        publishBtn.disabled = true;
        publishBtn.textContent = 'Published';
        toast('Event submitted for approval', 'success');
        setTimeout(() => { location.href = '/org/dashboard'; }, 1600);
    });

    form.addEventListener('input', saveDraft);
    form.addEventListener('submit', event => event.preventDefault());

    if (coverInput) {
        coverInput.addEventListener('change', () => {
            const file = coverInput.files && coverInput.files[0];
            if (file) coverLabel.textContent = file.name;
        });
    }

    function wireMobileNav() {
        const hamburger = document.getElementById('org-hamburger');
        const overlay = document.getElementById('org-mobile-overlay');
        const drawer = document.getElementById('org-mobile-drawer');
        const closeBtn = document.getElementById('org-nav-close');

        function openDrawer() {
            if (!drawer || !overlay) return;
            drawer.classList.add('open');
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
        }

        function closeDrawer() {
            if (!drawer || !overlay) return;
            drawer.classList.remove('open');
            overlay.classList.remove('open');
            document.body.style.overflow = '';
            if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
        }

        if (hamburger) hamburger.addEventListener('click', openDrawer);
        if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
        if (overlay) overlay.addEventListener('click', closeDrawer);

        <>
            <meta charSet="utf-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <title>My Opportunities | EVENTIFY</title>
            <meta
                name="description"
                content="My Opportunities on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
            />
            <meta property="og:title" content="My Opportunities | EVENTIFY" />
            <meta
                property="og:description"
                content="My Opportunities on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
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
            <link rel="stylesheet" href="sidebar.css" />
            <link rel="stylesheet" href="../admin/admin.css" />
            <link rel="stylesheet" href="org-dashboard.css" />
            <link rel="stylesheet" href="org-opportunities.css" />
            <link rel="stylesheet" href="../assets/css/theme.css" />
            <style
                dangerouslySetInnerHTML={{
                    __html:
                        "\n        @font-face {\n            font-family: 'Material Symbols Outlined';\n            font-style: normal;\n            font-weight: 100 700;\n            font-display: block;\n            src: url('../assets/fonts/material-symbols-outlined.woff2') format('woff2');\n        }\n\n        .material-symbols-outlined {\n            font-family: 'Material Symbols Outlined';\n            font-weight: normal;\n            font-style: normal;\n            font-size: 24px;\n            line-height: 1;\n            letter-spacing: normal;\n            text-transform: none;\n            display: inline-block;\n            white-space: nowrap;\n            overflow: hidden;\n            word-wrap: normal;\n            direction: ltr;\n            -webkit-font-feature-settings: 'liga';\n            -webkit-font-smoothing: antialiased;\n            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n            vertical-align: middle;\n        }\n    "
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
                            <a
                                className="nav-link"
                                href="/org/opportunities"
                                aria-current="page"
                            >
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
                <main className="flex-1 w-full px-4 md:px-10 pt-6 pb-24 lg:pb-8">
                    {/* Global Top Header: page title (left) + global controls (right) */}
                    <div className="org-topbar">
                        <h1 className="org-topbar__title">My Opportunities</h1>
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
                                My Opportunities
                            </span>
                        </div>
                        <p className="profile-page-desc">
                            Track every draft, submission, approval, and ended opportunity.
                        </p>
                        <div className="org-page-header__actions">
                            <a className="btn-primary" href="/org/create-event">
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: 18, verticalAlign: "middle" }}
                                >
                                    add
                                </span>
                                Create opportunity
                            </a>
                        </div>
                    </div>
                    {/* KPI Summary Cards */}
                    <div className="opp-stat-grid" aria-label="Opportunities status summary">
                        <div
                            className="stat-card"
                            data-kpi-filter="live"
                            title="Filter by Live opportunities"
                        >
                            <div className="stat-card__top">
                                <span className="stat-card__label">Live</span>
                                <span className="stat-card__icon">
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        play_circle
                                    </span>
                                </span>
                            </div>
                            <p className="stat-card__value" id="kpi-live-val">
                                1
                            </p>
                        </div>
                        <div
                            className="stat-card"
                            data-kpi-filter="pending"
                            title="Filter by Pending opportunities"
                        >
                            <div className="stat-card__top">
                                <span className="stat-card__label">Pending</span>
                                <span className="stat-card__icon">
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        hourglass_top
                                    </span>
                                </span>
                            </div>
                            <p className="stat-card__value" id="kpi-pending-val">
                                1
                            </p>
                        </div>
                        <div
                            className="stat-card"
                            data-kpi-filter="upcoming"
                            title="Filter by Upcoming opportunities"
                        >
                            <div className="stat-card__top">
                                <span className="stat-card__label">Upcoming</span>
                                <span className="stat-card__icon">
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        event_upcoming
                                    </span>
                                </span>
                            </div>
                            <p className="stat-card__value" id="kpi-upcoming-val">
                                1
                            </p>
                        </div>
                        <div
                            className="stat-card"
                            data-kpi-filter="ended"
                            title="Filter by Ended opportunities"
                        >
                            <div className="stat-card__top">
                                <span className="stat-card__label">Ended</span>
                                <span className="stat-card__icon">
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        task_alt
                                    </span>
                                </span>
                            </div>
                            <p className="stat-card__value" id="kpi-ended-val">
                                2
                            </p>
                        </div>
                    </div>
                    {/* Search & Filter Controls */}
                    <div className="opp-controls">
                        <div
                            className="opp-filter-tabs"
                            role="group"
                            aria-label="Filter opportunities by status"
                        >
                            <button
                                type="button"
                                className="opp-filter-btn"
                                data-filter="all"
                                aria-pressed="true"
                            >
                                All <span className="filter-count">5</span>
                            </button>
                            <button
                                type="button"
                                className="opp-filter-btn"
                                data-filter="live"
                                aria-pressed="false"
                            >
                                Live <span className="filter-count">1</span>
                            </button>
                            <button
                                type="button"
                                className="opp-filter-btn"
                                data-filter="pending"
                                aria-pressed="false"
                            >
                                Pending <span className="filter-count">1</span>
                            </button>
                            <button
                                type="button"
                                className="opp-filter-btn"
                                data-filter="upcoming"
                                aria-pressed="false"
                            >
                                Upcoming <span className="filter-count">1</span>
                            </button>
                            <button
                                type="button"
                                className="opp-filter-btn"
                                data-filter="ended"
                                aria-pressed="false"
                            >
                                Ended <span className="filter-count">2</span>
                            </button>
                        </div>
                        <div className="opp-search">
                            <span className="material-symbols-outlined" aria-hidden="true">
                                search
                            </span>
                            <input
                                type="search"
                                id="opp-search-input"
                                placeholder="Search opportunities..."
                                aria-label="Search opportunities by name or category"
                            />
                            <button
                                type="button"
                                className="opp-search-clear"
                                id="opp-search-clear"
                                aria-label="Clear search"
                                hidden=""
                            >
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: 18 }}
                                >
                                    close
                                </span>
                            </button>
                        </div>
                    </div>
                    {/* Opportunities Table Panel */}
                    <section className="opp-panel">
                        <div className="table-scroll">
                            <table className="opp-table" id="opp-table">
                                <caption className="sr-only">
                                    List of your organization's opportunities
                                </caption>
                                <thead>
                                    <tr>
                                        <th>Opportunity</th>
                                        <th>Status</th>
                                        <th>Deadline</th>
                                        <th>Applicants</th>
                                        <th style={{ textAlign: "right" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="opp-tbody">
                                    <tr data-status="live" data-id="evt-1">
                                        <td>
                                            <div className="opp-entity">
                                                <img
                                                    src="../assets/images/event1.jpeg"
                                                    alt=""
                                                    className="opp-entity__img"
                                                    onerror="this.style.display='none'"
                                                />
                                                <div>
                                                    <p className="opp-entity__name">
                                                        Global AI Innovation Challenge
                                                    </p>
                                                    <p className="opp-entity__meta">
                                                        Hackathon · Remote · Teams of 2-4
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge--active">Live</span>
                                        </td>
                                        <td className="mono whitespace-nowrap">Oct 20, 2026</td>
                                        <td className="whitespace-nowrap">
                                            <span className="mono">98</span> applicants
                                        </td>
                                        <td>
                                            <div className="org-row-actions">
                                                <a
                                                    href="/org/applicants?event=evt-1"
                                                    className="org-action--primary"
                                                    aria-label="View applicants for Global AI Innovation Challenge"
                                                >
                                                    Applicants
                                                </a>
                                                <a
                                                    href="/org/create-event"
                                                    aria-label="Edit Global AI Innovation Challenge"
                                                >
                                                    Edit
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr data-status="pending" data-id="evt-4">
                                        <td>
                                            <div className="opp-entity">
                                                <img
                                                    src="../assets/images/event2.jpeg"
                                                    alt=""
                                                    className="opp-entity__img"
                                                    onerror="this.style.display='none'"
                                                />
                                                <div>
                                                    <p className="opp-entity__name">DevOps Masterclass</p>
                                                    <p className="opp-entity__meta">
                                                        Workshop · Online · Cloud Engineering
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge--pending">Pending Approval</span>
                                        </td>
                                        <td className="mono whitespace-nowrap">Nov 3, 2026</td>
                                        <td className="whitespace-nowrap">
                                            <span className="mono">72</span> applicants
                                        </td>
                                        <td>
                                            <div className="org-row-actions">
                                                <a
                                                    href="/org/applicants?event=evt-4"
                                                    className="org-action--primary"
                                                    aria-label="View applicants for DevOps Masterclass"
                                                >
                                                    Applicants
                                                </a>
                                                <a
                                                    href="/org/create-event"
                                                    aria-label="Edit DevOps Masterclass"
                                                >
                                                    Edit
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr data-status="upcoming" data-id="evt-3">
                                        <td>
                                            <div className="opp-entity">
                                                <img
                                                    src="../assets/images/event3.jpeg"
                                                    alt=""
                                                    className="opp-entity__img"
                                                    onerror="this.style.display='none'"
                                                />
                                                <div>
                                                    <p className="opp-entity__name">Startup Challenge</p>
                                                    <p className="opp-entity__meta">
                                                        Competition · Entrepreneurship
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge--upcoming">Upcoming</span>
                                        </td>
                                        <td className="mono whitespace-nowrap">Nov 25, 2026</td>
                                        <td className="whitespace-nowrap">
                                            <span className="mono">84</span> applicants
                                        </td>
                                        <td>
                                            <div className="org-row-actions">
                                                <a
                                                    href="/org/applicants?event=evt-3"
                                                    className="org-action--primary"
                                                    aria-label="View applicants for Startup Challenge"
                                                >
                                                    Applicants
                                                </a>
                                                <a
                                                    href="/org/create-event"
                                                    aria-label="Edit Startup Challenge"
                                                >
                                                    Edit
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr data-status="ended" data-id="evt-2">
                                        <td>
                                            <div className="opp-entity">
                                                <img
                                                    src="../assets/images/event4.jpeg"
                                                    alt=""
                                                    className="opp-entity__img"
                                                    onerror="this.style.display='none'"
                                                />
                                                <div>
                                                    <p className="opp-entity__name">Frontend Wizards</p>
                                                    <p className="opp-entity__meta">
                                                        Hackathon · Web Development
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge--completed">Ended</span>
                                        </td>
                                        <td className="mono whitespace-nowrap">Closed</td>
                                        <td className="whitespace-nowrap">
                                            <span className="mono">150</span> applicants
                                        </td>
                                        <td>
                                            <div className="org-row-actions">
                                                <a
                                                    href="/org/applicants?event=evt-2"
                                                    aria-label="View applicants for Frontend Wizards"
                                                >
                                                    Applicants
                                                </a>
                                                <a
                                                    href="/org/report-center"
                                                    className="org-action--primary"
                                                    aria-label="View report for Frontend Wizards"
                                                >
                                                    View report
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr data-status="ended" data-id="evt-5">
                                        <td>
                                            <div className="opp-entity">
                                                <img
                                                    src="../assets/images/event5.jpeg"
                                                    alt=""
                                                    className="opp-entity__img"
                                                    onerror="this.style.display='none'"
                                                />
                                                <div>
                                                    <p className="opp-entity__name">Cloud Native Bootcamp</p>
                                                    <p className="opp-entity__meta">
                                                        Course · Infrastructure
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge--completed">Ended</span>
                                        </td>
                                        <td className="mono whitespace-nowrap">Closed</td>
                                        <td className="whitespace-nowrap">
                                            <span className="mono">42</span> applicants
                                        </td>
                                        <td>
                                            <div className="org-row-actions">
                                                <a
                                                    href="/org/applicants?event=evt-5"
                                                    aria-label="View applicants for Cloud Native Bootcamp"
                                                >
                                                    Applicants
                                                </a>
                                                <a
                                                    href="/org/report-center"
                                                    className="org-action--primary"
                                                    aria-label="View report for Cloud Native Bootcamp"
                                                >
                                                    View report
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {/* Empty State when filter/search yields 0 results */}
                        <div className="opp-empty" id="opp-empty-state" hidden="">
                            <div className="opp-empty__icon">
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: 26 }}
                                    aria-hidden="true"
                                >
                                    search_off
                                </span>
                            </div>
                            <h3 className="opp-empty__title">No opportunities found</h3>
                            <p className="opp-empty__desc">
                                No opportunities match your current filter or search criteria.
                            </p>
                            <button
                                type="button"
                                className="btn-secondary mt-2"
                                id="opp-empty-reset"
                            >
                                Clear filters
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
                    <a className="nav-link" href="/org/opportunities" aria-current="page">
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
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeDrawer();
                if (catPanel) {
                    catPanel.setAttribute('hidden', '');
                    if (catToggle) catToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }

    wireCategoryDropdown();
    wireMobileNav();
    restoreDraft();
    syncCompetitionFieldsVisibility();
    show(1);
})();