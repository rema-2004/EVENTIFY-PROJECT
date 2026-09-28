import { useNavigate } from 'react-router-dom'

export default function Notifications() {
    const navigate = useNavigate()
    return (
        <>
            <meta charSet="utf-8" />
            <meta
                content="width=device-width, initial-scale=1.0, viewport-fit=cover"
                name="viewport"
            />
            <title>Notifications | Eventify AI</title>
            <meta
                name="description"
                content="Notifications | Eventify AI on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
            />
            <meta property="og:title" content="Notifications | Eventify AI" />
            <meta
                property="og:description"
                content="Notifications | Eventify AI on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
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
                        "\n    @font-face {\n        font-family: 'Material Symbols Outlined';\n        font-style: normal;\n        font-weight: 100 700;\n        font-display: block;\n        src: url('../assets/fonts/material-symbols-outlined.woff2') format('woff2');\n    }\n    .material-symbols-outlined {\n        font-family: 'Material Symbols Outlined';\n        font-weight: normal;\n        font-style: normal;\n        font-size: 24px;\n        line-height: 1;\n        letter-spacing: normal;\n        text-transform: none;\n        display: inline-block;\n        white-space: nowrap;\n        overflow: hidden;\n        word-wrap: normal;\n        direction: ltr;\n        -webkit-font-feature-settings: 'liga';\n        -webkit-font-smoothing: antialiased;\n    }\n    "
                }}
            />
            {/* Tailwind CSS */}
            {/* Google Fonts: Inter */}
            {/* Material Symbols */}
            {/* Theme Configuration */}
            <style
                dangerouslySetInnerHTML={{
                    __html:
                        "\n        .material-symbols-outlined {\n            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n        }\n        .active-dot {\n            width: 8px;\n            height: 8px;\n            background-color: #FF4D2E;\n            border-radius: 50%;\n        }\n        .glass-nav {\n            background: rgba(250, 248, 255, 0.8);\n            backdrop-filter: blur(12px);\n        }\n        .bento-card-hover {\n            transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;\n        }\n        .bento-card-hover:hover {\n            transform: translateY(-4px);\n            box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.08);\n        }\n    "
                }}
            />
            <style
                dangerouslySetInnerHTML={{
                    __html: "\n    body {\n      min-height: max(884px, 100dvh);\n    }\n  "
                }}
            />
            {/* Top Navigation Anchor */}
            <header className="sticky top-0 w-full z-50 glass-nav border-b border-outline-variant/30 shadow-sm flex items-center justify-between px-margin_mobile h-top_nav_height">
                <div className="flex items-center gap-4">
                    <a
                        className="material-symbols-outlined text-primary p-2 active:scale-95 duration-200"
                        data-icon="arrow_back"
                        href="index.html"
                    >
                        arrow_back
                    </a>
                    <h1 className="font-headline-lg text-headline-lg text-on-surface">
                        Notifications
                    </h1>
                </div>
                <a
                    className="material-symbols-outlined text-primary p-2 active:scale-95 duration-200"
                    data-icon="settings"
                    href="profile.html"
                >
                    settings
                </a>
            </header>
            <main className="max-w-container_max_width mx-auto pb-32">
                {/* Filter Tabs Section */}
                <section className="px-margin_mobile py-4 sticky top-[72px] z-40 bg-surface/95 backdrop-blur-md">
                    <div
                        className="flex gap-stack_gap_md overflow-x-auto no-scrollbar py-2"
                        id="notif-filter-group"
                        role="group"
                        aria-label="Filter notifications"
                    >
                        <button
                            type="button"
                            className="px-6 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-md shadow-primary/20 transition-all"
                            data-filter="all"
                            aria-pressed="true"
                        >
                            All
                        </button>
                        <button
                            type="button"
                            className="px-6 py-2 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md hover:bg-surface-variant transition-colors"
                            data-filter="unread"
                            aria-pressed="false"
                        >
                            Unread
                        </button>
                        <button
                            type="button"
                            className="px-6 py-2 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md hover:bg-surface-variant transition-colors"
                            data-filter="mentions"
                            aria-pressed="false"
                        >
                            Mentions
                        </button>
                    </div>
                </section>
                {/* Notification List */}
                <div className="px-margin_mobile flex flex-col gap-4 mt-2" id="notif-list">
                    {/* AI Recommendation Card */}
                    <div
                        className="ev-card spotlight ev-fade-up ev-stagger-2 ev-fade-up ev-stagger-1 group relative bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/50 flex gap-4 cursor-pointer"
                        data-notif=""
                        data-status="unread"
                        onClick={() => navigate('/app/opportunity')}
                    >
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary-container/10 flex items-center justify-center border border-secondary-container/20">
                            <span
                                className="material-symbols-outlined text-secondary"
                                data-icon="auto_awesome"
                                style={{ fontVariationSettings: '"FILL" 1' }}
                            >
                                auto_awesome
                            </span>
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            <div className="flex justify-between items-start">
                                <span className="font-label-sm text-label-sm text-secondary-container uppercase tracking-wider">
                                    AI Recommendation
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-on-surface-variant font-label-sm text-label-sm">
                                        2h ago
                                    </span>
                                    <div className="active-dot" />
                                </div>
                            </div>
                            <p className="font-body-md text-body-md text-on-surface pr-4">
                                Based on your CV, we found a new{" "}
                                <span className="font-semibold text-primary">Hackathon</span>{" "}
                                matching your AI skills.
                            </p>
                            <div className="mt-2 flex gap-2">
                                <span className="px-3 py-1 rounded-full bg-secondary/5 text-secondary text-label-sm font-label-sm border border-secondary/10">
                                    AI-Powered
                                </span>
                                <span className="px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-label-sm font-label-sm">
                                    New Match
                                </span>
                            </div>
                        </div>
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary rounded-l-xl" />
                    </div>
                    {/* Deadline Reminder Card */}
                    <div
                        className="ev-card spotlight ev-fade-up ev-stagger-2 ev-fade-up ev-stagger-2 group relative bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/50 flex gap-4 cursor-pointer"
                        data-notif=""
                        data-status="unread"
                        onClick={() => navigate('/app/opportunity')}
                    >
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-error-container/10 flex items-center justify-center border border-error-container/20">
                            <span
                                className="material-symbols-outlined text-error"
                                data-icon="alarm"
                                style={{ fontVariationSettings: '"FILL" 1' }}
                            >
                                alarm
                            </span>
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            <div className="flex justify-between items-start">
                                <span className="font-label-sm text-label-sm text-error uppercase tracking-wider">
                                    Deadline Reminder
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-on-surface-variant font-label-sm text-label-sm">
                                        5h ago
                                    </span>
                                    <div className="active-dot" />
                                </div>
                            </div>
                            <p className="font-body-md text-body-md text-on-surface pr-4">
                                Only <span className="font-bold text-error">24 hours left</span> to
                                apply for the Global Design Summit!
                            </p>
                        </div>
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-error rounded-l-xl" />
                    </div>
                    {/* Application Update Card */}
                    <div
                        className="ev-card spotlight ev-fade-up ev-stagger-2 ev-fade-up ev-stagger-3 group bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/50 flex gap-4 cursor-pointer"
                        data-notif=""
                        data-status="read"
                        onClick={() => navigate('/app/opportunity')}
                    >
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center border border-primary-container/20">
                            <span
                                className="material-symbols-outlined text-primary"
                                data-icon="check_circle"
                                style={{ fontVariationSettings: '"FILL" 1' }}
                            >
                                check_circle
                            </span>
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            <div className="flex justify-between items-start">
                                <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">
                                    Application Update
                                </span>
                                <span className="text-on-surface-variant font-label-sm text-label-sm">
                                    1d ago
                                </span>
                            </div>
                            <p className="font-body-md text-body-md text-on-surface">
                                Your application for{" "}
                                <span className="font-semibold">'Quantum Computing Workshop'</span>{" "}
                                has been <span className="text-primary font-bold">accepted!</span>
                            </p>
                        </div>
                    </div>
                    {/* Organization Post */}
                    <div
                        className="ev-card spotlight ev-fade-up ev-stagger-2 ev-fade-up ev-stagger-4 group bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/50 flex gap-4 cursor-pointer"
                        data-notif=""
                        data-status="read"
                        onClick={() => navigate('/app/posts')}
                    >
                        <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-surface shadow-sm bg-primary/10 flex items-center justify-center">
                            <span
                                className="material-symbols-outlined text-primary"
                                style={{ fontVariationSettings: '"FILL" 1' }}
                            >
                                apartment
                            </span>
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold text-on-surface">
                                        TechGenius Labs
                                    </span>
                                    <span className="text-on-surface-variant">
                                        published a new post
                                    </span>
                                </div>
                                <span className="text-on-surface-variant font-label-sm text-label-sm">
                                    2d ago
                                </span>
                            </div>
                            <div className="mt-2 p-3 bg-surface-container-low rounded-lg border border-outline-variant/30 italic text-on-surface-variant text-label-md">
                                "Excited to announce registration is now open for the AI Summit..."
                            </div>
                        </div>
                    </div>
                    {/* Social Activity: Friend Request */}
                    <div
                        className="group bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/50 bento-card-hover flex gap-4 cursor-pointer"
                        data-notif=""
                        data-status="read"
                        data-mention="true"
                        onClick={() => navigate('/app/profile')}
                    >
                        <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-surface shadow-sm">
                            <img
                                className="w-full h-full object-cover"
                                data-alt="Close up profile picture of a young professional male designer with a creative look, wearing stylish glasses, high-end studio lighting with subtle blue and purple accents in the background."
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2GbQS-NWZy4s11NQjIQnQlE6RA8qo3lCvQgA9R_t2cD0_3acPrckEE0p1mNr11PNtBvzZabEH08T5SS3l8_yxv1z0CKApqpBF0FeUemSWMeTsU1gyATXMZKQKcr4zB-0ZK4lP2_VXAh9cWXQJu__mUeBUD8Kyg9A3OhPaCTW6Qf5PA0ZiNCOnYnHiuu0bcvuLxY7-WgnAFp6LK_4cDOeuu71FvYU_WLyMu9GWA_8GV8mKc6ZKD0u1z-MckDKeRNePjzQ2G1fU2JqK"
                            />
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold text-on-surface">Alex Rivera</span>
                                    <span className="text-on-surface-variant">
                                        sent you a friend request
                                    </span>
                                </div>
                                <span className="text-on-surface-variant font-label-sm text-label-sm">
                                    3d ago
                                </span>
                            </div>
                            <div className="mt-3 flex gap-2">
                                <button className="flex-1 bg-primary text-on-primary py-2 rounded-full font-label-md text-label-md active:scale-95 duration-150 transition-all">
                                    Accept
                                </button>
                                <button className="flex-1 bg-surface-container text-on-surface-variant py-2 rounded-full font-label-md text-label-md active:scale-95 duration-150 transition-all">
                                    Decline
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Organization Post */}
                    <div
                        className="group bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/50 bento-card-hover flex gap-4 cursor-pointer"
                        data-notif=""
                        data-status="read"
                        onClick={() => navigate('/app/posts')}
                    >
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center border border-tertiary/20">
                            <span
                                className="material-symbols-outlined text-tertiary"
                                data-icon="campaign"
                                style={{ fontVariationSettings: '"FILL" 1' }}
                            >
                                campaign
                            </span>
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            <div className="flex justify-between items-start">
                                <span className="font-label-sm text-label-sm text-tertiary uppercase tracking-wider">
                                    Organization
                                </span>
                                <span className="text-on-surface-variant font-label-sm text-label-sm">
                                    4d ago
                                </span>
                            </div>
                            <p className="font-body-md text-body-md text-on-surface">
                                New post from{" "}
                                <span className="font-semibold text-tertiary-container">
                                    DevCommunity Hub
                                </span>
                                .
                            </p>
                            <p className="text-on-surface-variant text-label-md line-clamp-1 mt-1">
                                "Registration for Frontend Wizards 2024 closes this Friday!"
                            </p>
                        </div>
                    </div>
                </div>
                <p
                    className="text-center text-on-surface-variant py-10"
                    id="notif-empty"
                    hidden=""
                >
                    No notifications in this filter.
                </p>
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
            {/* Bottom Navigation Bar */}
            <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 glass-nav border-t border-outline-variant/20 flex justify-around items-center px-4 py-2 pb-safe shadow-lg">
                <a
                    className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                    href="index.html"
                >
                    <span className="material-symbols-outlined" data-icon="home">
                        home
                    </span>
                    <span className="font-label-sm text-label-sm">Home</span>
                </a>
                <a
                    className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                    href="explore.html"
                >
                    <span className="material-symbols-outlined" data-icon="explore">
                        explore
                    </span>
                    <span className="font-label-sm text-label-sm">Discover</span>
                </a>
                <a
                    className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                    href="my-applications.html"
                >
                    <span
                        className="material-symbols-outlined"
                        data-icon="assignment_turned_in"
                    >
                        assignment_turned_in
                    </span>
                    <span className="font-label-sm text-label-sm">Applications</span>
                </a>
                <a
                    className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                    href="create-team.html"
                >
                    <span
                        className="material-symbols-outlined text-4xl text-primary"
                        data-icon="add_circle"
                        style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                        add_circle
                    </span>
                    <span className="font-label-sm text-label-sm">Create</span>
                </a>
                <a
                    className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1"
                    href="notifications.html"
                >
                    <span
                        className="material-symbols-outlined"
                        data-icon="notifications"
                        style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                        notifications
                    </span>
                    <span className="font-label-sm text-label-sm">Alerts</span>
                </a>
                <a
                    className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                    href="profile.html"
                >
                    <span className="material-symbols-outlined" data-icon="person">
                        person
                    </span>
                    <span className="font-label-sm text-label-sm">Profile</span>
                </a>
            </nav>
            {/* Floating Action Button (FAB) logic as per mandate: Suppressed on Details/Notifications, but available for interaction */}
            {/* Not rendered here per relevance rule */}
        </>
    )
}
