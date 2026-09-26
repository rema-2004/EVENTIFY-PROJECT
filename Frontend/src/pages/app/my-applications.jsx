import { useState } from 'react'

export default function MyApplications() {
    const [activeFilter, setActiveFilter] = useState('all')
    const filterButtonClass = (filter) =>
        `px-6 py-2 rounded-full font-label-md text-label-md transition-all ${activeFilter === filter ? 'bg-[#ff4d2e] text-white shadow-md shadow-[#ff4d2e]/20' : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'}`
    const filterButtonStyle = (filter) =>
        activeFilter === filter ? { backgroundColor: '#ff4d2e', color: '#fff' } : undefined

    return (
        <>
            <meta charSet="utf-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <title>My Event | EVENTIFY</title>
            <meta
                name="description"
                content="My Event on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
            />
            <meta property="og:title" content="My Event | EVENTIFY" />
            <meta
                property="og:description"
                content="My Event on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
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
            <link rel="stylesheet" href="nav.css" />
            <link rel="stylesheet" href="app-shell.css" />
            <link rel="stylesheet" href="../assets/css/theme.css" />
            <style
                dangerouslySetInnerHTML={{
                    __html:
                        "\n        @font-face {\n            font-family: 'Material Symbols Outlined';\n            font-style: normal;\n            font-weight: 100 700;\n            font-display: block;\n            src: url('../assets/fonts/material-symbols-outlined.woff2') format('woff2');\n        }\n\n        .material-symbols-outlined {\n            font-family: 'Material Symbols Outlined';\n            font-weight: normal;\n            font-style: normal;\n            font-size: 24px;\n            line-height: 1;\n            letter-spacing: normal;\n            text-transform: none;\n            display: inline-block;\n            white-space: nowrap;\n            overflow: hidden;\n            word-wrap: normal;\n            direction: ltr;\n            -webkit-font-feature-settings: 'liga';\n            -webkit-font-smoothing: antialiased;\n        }\n    "
                }}
            />
            <style
                dangerouslySetInnerHTML={{
                    __html:
                        "\n\n\n        .material-symbols-outlined {\n            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n        }\n\n        .glass-sidebar {\n            background: rgba(255, 255, 255, 0.8);\n            backdrop-filter: blur(12px);\n            -webkit-backdrop-filter: blur(12px);\n        }\n\n        .dark .glass-sidebar {\n            background: rgba(23, 33, 49, 0.8);\n            border-color: rgba(255, 255, 255, 0.05);\n        }\n\n        .premium-shadow {\n            box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.08);\n        }\n\n        .bento-card-hover {\n            transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;\n        }\n\n        .bento-card-hover:hover {\n            transform: translateY(-4px);\n            box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.08);\n        }\n    "
                }}
            />
            <nav className="fixed top-0 w-full z-50 glass-nav border-b border-outline-variant/30 dark:border-white/10 h-16 flex items-center">
                <div className="flex justify-between items-center px-container-margin-mobile md:px-container-margin-desktop w-full max-w-[1280px] mx-auto">
                    <div className="flex items-center gap-8">
                        <a
                            className="flex items-center gap-3"
                            href="index.html"
                            aria-label="EVENTIFY home"
                        >
                            <span
                                className="material-symbols-outlined text-primary text-3xl"
                                style={{ fontVariationSettings: '"FILL" 1' }}
                            >
                                hub
                            </span>
                            <span className="font-headline-md text-headline-md font-black text-primary">
                                EVENTIFY
                            </span>
                        </a>
                        <div className="hidden md:flex gap-6">
                            <a
                                className="font-label-md text-label-md text-on-surface-variant hover:text-primary dark:text-[#c3c6d7] dark:hover:text-primary transition-colors"
                                href="index.html"
                            >
                                Home
                            </a>
                            <a
                                className="font-label-md text-label-md text-on-surface-variant hover:text-primary dark:text-[#c3c6d7] dark:hover:text-primary transition-colors"
                                href="explore.html"
                            >
                                Explore
                            </a>
                            <a
                                className="font-label-md text-label-md text-on-surface-variant hover:text-primary dark:text-[#c3c6d7] dark:hover:text-primary transition-colors"
                                href="posts.html"
                            >
                                Posts
                            </a>
                            <a
                                className="font-label-md text-label-md text-primary font-bold border-b-2 border-primary pb-1 transition-all"
                                href="my-applications.html"
                            >
                                My Event
                            </a>
                            <a
                                className="font-label-md text-label-md text-on-surface-variant hover:text-primary dark:text-[#c3c6d7] dark:hover:text-primary transition-colors"
                                href="notifications.html"
                            >
                                Notifications
                            </a>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            className="theme-toggle w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-low dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
                            title="Switch theme"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                dark_mode
                            </span>
                        </button>
                        <a
                            className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/5 hover:bg-primary/10 rounded-lg text-primary dark:text-primary dark:hover:bg-primary/10 font-label-md transition-all"
                            href="rafeeq.html"
                        >
                            <span
                                className="material-symbols-outlined text-[20px]"
                                data-icon="smart_toy"
                            >
                                smart_toy
                            </span>
                            Rafeeq AI
                        </a>
                        <a
                            className="h-10 w-10 rounded-full overflow-hidden border-2 border-primary-container block"
                            href="profile.html"
                        >
                            <img
                                className="w-full h-full object-cover"
                                data-alt="A clean, professional headshot of a diverse young professional man in his late 20s with a warm, confident smile. He is wearing a modern navy blue blazer over a crisp white shirt."
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaUW4ycO4zpbXU8-f7qQ8e67JQFR0kFopGobvmcyuwtb7RmtLjv8uPEEmSl-hbsk0Uo2ApZUUq0wRlZ_zn8PJ4ugNgbj5OOGiU0BEkvvm8agYRwod83fIHy3htoOWJsIvO4ldpAhRTz0oyAMispIOZSiEf-bq73m7QKJeH-ZAfVM4q8r4pOddVVra4gOVTwYxIXtrSAQ5_f0WzHxDTzUUNzi4IEbgzPPqIh4aHvXgk12witr7-3N8pVFOo07Rs0y08Ht-8bubrd2i-"
                            />
                        </a>
                    </div>
                </div>
            </nav>
            <main className="pt-24 pb-12 px-container-margin-mobile md:px-container-margin-desktop max-w-[1280px] mx-auto flex flex-col gap-stack_gap_md">
                <section className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 premium-shadow border border-outline-variant/50">
                    <h1 className="font-headline-lg text-headline-lg mb-1">My Event</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                        Every opportunity you've applied to, in one place — track where each one
                        stands.
                    </p>
                </section>
                {/* Filter Tabs */}
                <div
                    className="flex gap-stack_gap_md overflow-x-auto no-scrollbar"
                    id="filter-tabs"
                >
                    <button
                        className={filterButtonClass('all')}
                        style={filterButtonStyle('all')}
                        data-filter="all"
                        type="button"
                        aria-pressed={activeFilter === 'all'}
                        onClick={() => setActiveFilter('all')}
                    >
                        All (6)
                    </button>
                    <button
                        className={filterButtonClass('pending')}
                        style={filterButtonStyle('pending')}
                        data-filter="pending"
                        type="button"
                        aria-pressed={activeFilter === 'pending'}
                        onClick={() => setActiveFilter('pending')}
                    >
                        Pending (3)
                    </button>
                    <button
                        className={filterButtonClass('accepted')}
                        style={filterButtonStyle('accepted')}
                        data-filter="accepted"
                        type="button"
                        aria-pressed={activeFilter === 'accepted'}
                        onClick={() => setActiveFilter('accepted')}
                    >
                        Accepted (2)
                    </button>
                    <button
                        className={filterButtonClass('rejected')}
                        style={filterButtonStyle('rejected')}
                        data-filter="rejected"
                        type="button"
                        aria-pressed={activeFilter === 'rejected'}
                        onClick={() => setActiveFilter('rejected')}
                    >
                        Not Selected (1)
                    </button>
                </div>
                {/* Applications List */}
                <div className="flex flex-col gap-4" id="applications-list">
                    <div
                        className="ev-card spotlight ev-fade-up ev-stagger-2 ev-fade-up ev-stagger-1 bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/50 flex flex-col sm:flex-row sm:items-center gap-4"
                        data-status="pending"
                        hidden={activeFilter !== 'all' && activeFilter !== 'pending'}
                    >
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-primary">
                                emoji_events
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-title-lg text-title-lg truncate">
                                Global AI Innovation Challenge
                            </p>
                            <p className="font-label-sm text-label-sm text-outline">
                                TechGenius Labs • Applied Jul 12, 2026
                            </p>
                        </div>
                        <span className="ev-badge bg-tertiary/10 text-tertiary whitespace-nowrap">
                            Pending Review
                        </span>
                        <a
                            className="px-4 py-2 rounded-full border border-outline-variant font-label-sm text-label-sm hover:bg-surface-container-low transition-colors whitespace-nowrap"
                            href="opportunity.html"
                        >
                            View
                        </a>
                    </div>
                    <div
                        className="ev-card spotlight ev-fade-up ev-stagger-2 ev-fade-up ev-stagger-2 bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/50 flex flex-col sm:flex-row sm:items-center gap-4"
                        data-status="pending"
                        hidden={activeFilter !== 'all' && activeFilter !== 'pending'}
                    >
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-primary">
                                terminal
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-title-lg text-title-lg truncate">
                                DevOps Masterclass
                            </p>
                            <p className="font-label-sm text-label-sm text-outline">
                                TechGenius Labs • Applied Jul 9, 2026
                            </p>
                        </div>
                        <span className="ev-badge bg-tertiary/10 text-tertiary whitespace-nowrap">
                            Pending Review
                        </span>
                        <a
                            className="px-4 py-2 rounded-full border border-outline-variant font-label-sm text-label-sm hover:bg-surface-container-low transition-colors whitespace-nowrap"
                            href="opportunity.html"
                        >
                            View
                        </a>
                    </div>
                    <div
                        className="ev-card spotlight ev-fade-up ev-stagger-2 ev-fade-up ev-stagger-3 bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/50 flex flex-col sm:flex-row sm:items-center gap-4"
                        data-status="pending"
                        hidden={activeFilter !== 'all' && activeFilter !== 'pending'}
                    >
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-primary">groups</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-title-lg text-title-lg truncate">
                                Cloud Career Bootcamp
                            </p>
                            <p className="font-label-sm text-label-sm text-outline">
                                DevCommunity Hub • Applied Jul 4, 2026
                            </p>
                        </div>
                        <span className="ev-badge bg-tertiary/10 text-tertiary whitespace-nowrap">
                            Pending Review
                        </span>
                        <a
                            className="px-4 py-2 rounded-full border border-outline-variant font-label-sm text-label-sm hover:bg-surface-container-low transition-colors whitespace-nowrap"
                            href="opportunity.html"
                        >
                            View
                        </a>
                    </div>
                    <div
                        className="ev-card spotlight ev-fade-up ev-stagger-2 ev-fade-up ev-stagger-4 bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/50 flex flex-col sm:flex-row sm:items-center gap-4"
                        data-status="accepted"
                        hidden={activeFilter !== 'all' && activeFilter !== 'accepted'}
                    >
                        <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                            <span
                                className="material-symbols-outlined text-success"
                                style={{ fontVariationSettings: '"FILL" 1' }}
                            >
                                check_circle
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-title-lg text-title-lg truncate">
                                Quantum Computing Workshop
                            </p>
                            <p className="font-label-sm text-label-sm text-outline">
                                University Research Lab • Applied Jun 28, 2026
                            </p>
                        </div>
                        <span className="ev-badge bg-success/10 text-success whitespace-nowrap">
                            Accepted
                        </span>
                        <a
                            className="px-4 py-2 rounded-full border border-outline-variant font-label-sm text-label-sm hover:bg-surface-container-low transition-colors whitespace-nowrap"
                            href="opportunity.html"
                        >
                            View
                        </a>
                    </div>
                    <div
                        className="ev-card spotlight ev-fade-up ev-stagger-2 ev-fade-up ev-stagger-5 bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/50 flex flex-col sm:flex-row sm:items-center gap-4"
                        data-status="accepted"
                        hidden={activeFilter !== 'all' && activeFilter !== 'accepted'}
                    >
                        <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                            <span
                                className="material-symbols-outlined text-success"
                                style={{ fontVariationSettings: '"FILL" 1' }}
                            >
                                check_circle
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-title-lg text-title-lg truncate">
                                Frontend Wizards 2026
                            </p>
                            <p className="font-label-sm text-label-sm text-outline">
                                DevCommunity Hub • Applied Jun 20, 2026
                            </p>
                        </div>
                        <span className="ev-badge bg-success/10 text-success whitespace-nowrap">
                            Accepted
                        </span>
                        <a
                            className="px-4 py-2 rounded-full border border-outline-variant font-label-sm text-label-sm hover:bg-surface-container-low transition-colors whitespace-nowrap"
                            href="opportunity.html"
                        >
                            View
                        </a>
                    </div>
                    <div
                        className="ev-card spotlight ev-fade-up ev-stagger-2 bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/50 flex flex-col sm:flex-row sm:items-center gap-4 opacity-80"
                        data-status="rejected"
                        hidden={activeFilter !== 'all' && activeFilter !== 'rejected'}
                    >
                        <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-error">cancel</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-title-lg text-title-lg truncate">
                                Global Design Summit
                            </p>
                            <p className="font-label-sm text-label-sm text-outline">
                                Global Design Guild • Applied Jun 2, 2026
                            </p>
                        </div>
                        <span className="ev-badge bg-error/10 text-error whitespace-nowrap">
                            Not Selected
                        </span>
                        <a
                            className="px-4 py-2 rounded-full border border-outline-variant font-label-sm text-label-sm hover:bg-surface-container-low transition-colors whitespace-nowrap"
                            href="opportunity.html"
                        >
                            View
                        </a>
                    </div>
                </div>
            </main>
            <footer className="footer">
                <div className="container max-w-[1280px] mx-auto px-container-margin-mobile md:px-container-margin-desktop">
                    <div className="footer-grid">
                        <div>
                            <a
                                href="index.html"
                                className="footer-logo"
                                aria-label="EVENTIFY home"
                            >
                                <span
                                    className="material-symbols-outlined text-4xl"
                                    style={{ fontVariationSettings: '"FILL" 1' }}
                                >
                                    hub
                                </span>
                                <span className="font-headline-md text-headline-md font-black">
                                    EVENTIFY
                                </span>
                            </a>
                            <p className="desc">
                                Your AI-powered hub for jobs, competitions, events, workshops, and
                                growth opportunities.
                            </p>
                            <div className="social-links">
                                <a href="#" aria-label="Facebook">
                                    <span className="material-symbols-outlined text-[18px]">
                                        thumb_up
                                    </span>
                                </a>
                                <a href="#" aria-label="Instagram">
                                    <span className="material-symbols-outlined text-[18px]">
                                        photo_camera
                                    </span>
                                </a>
                                <a href="#" aria-label="LinkedIn">
                                    <span className="material-symbols-outlined text-[18px]">
                                        business_center
                                    </span>
                                </a>
                                <a href="#" aria-label="Email">
                                    <span className="material-symbols-outlined text-[18px]">
                                        mail
                                    </span>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h4>Explore</h4>
                            <ul>
                                <li>
                                    <a href="index.html">Home</a>
                                </li>
                                <li>
                                    <a href="explore.html">Explore</a>
                                </li>
                                <li>
                                    <a href="posts.html">Posts</a>
                                </li>
                                <li>
                                    <a href="my-applications.html">My Event</a>
                                </li>
                                <li>
                                    <a href="notifications.html">Notifications</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4>Support</h4>
                            <ul>
                                <li>
                                    <a href="../The%20Visitor/about.html">About</a>
                                </li>
                                <li>
                                    <a href="../The%20Visitor/landing.html#faq">FAQ</a>
                                </li>
                                <li>
                                    <a href="../The%20Visitor/contact.html">Contact</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <span>© 2026 EVENTIFY. All rights reserved.</span>
                        <span>·</span>
                        <a href="../auth/privacy.html">Privacy</a>
                        <span>·</span>
                        <a href="../auth/terms.html">Terms</a>
                    </div>
                </div>
            </footer>
            <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-surface/80 backdrop-blur-xl border-t border-outline-variant z-50 px-gutter py-3 flex justify-between items-center">
                <a
                    className="flex flex-col items-center gap-1 text-outline"
                    href="index.html"
                >
                    <span className="material-symbols-outlined">home</span>
                    <span className="font-label-sm text-label-sm">Home</span>
                </a>
                <a
                    className="flex flex-col items-center gap-1 text-primary"
                    href="my-applications.html"
                >
                    <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                        assignment_turned_in
                    </span>
                    <span className="font-label-sm text-label-sm">Applications</span>
                </a>
                <a
                    className="flex flex-col items-center gap-1 text-outline"
                    href="saved.html"
                >
                    <span className="material-symbols-outlined">bookmark</span>
                    <span className="font-label-sm text-label-sm">Saved</span>
                </a>
                <a
                    className="flex flex-col items-center gap-1 text-outline"
                    href="profile.html"
                >
                    <span className="material-symbols-outlined">account_circle</span>
                    <span className="font-label-sm text-label-sm">Profile</span>
                </a>
            </nav>
        </>
    )
}
