export default function Posts() {
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
            <link rel="stylesheet" href="nav.css" />
            <link rel="stylesheet" href="app-shell.css" />
            <link rel="stylesheet" href="../assets/css/theme.css" />
            <style
                dangerouslySetInnerHTML={{
                    __html:
                        "\n    @font-face {\n        font-family: 'Material Symbols Outlined';\n        font-style: normal;\n        font-weight: 100 700;\n        font-display: block;\n        src: url('../assets/fonts/material-symbols-outlined.woff2') format('woff2');\n    }\n    .material-symbols-outlined {\n        font-family: 'Material Symbols Outlined';\n        font-weight: normal;\n        font-style: normal;\n        font-size: 24px;\n        line-height: 1;\n        letter-spacing: normal;\n        text-transform: none;\n        display: inline-block;\n        white-space: nowrap;\n        overflow: hidden;\n        word-wrap: normal;\n        direction: ltr;\n        -webkit-font-feature-settings: 'liga';\n        font-feature-settings: 'liga';\n        -webkit-font-smoothing: antialiased;\n    }\n    "
                }}
            />
            <style
                dangerouslySetInnerHTML={{
                    __html:
                        "\n    \n    .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; vertical-align: middle; }\n"
                }}
            />
            {/* Top Navigation Bar */}
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
                                className="font-label-md text-label-md text-primary font-bold border-b-2 border-primary pb-1 transition-all"
                                href="posts.html"
                            >
                                Posts
                            </a>
                            <a
                                className="font-label-md text-label-md text-on-surface-variant hover:text-primary dark:text-[#c3c6d7] dark:hover:text-primary transition-colors"
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
                            aria-label="Switch theme"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                dark_mode
                            </span>
                        </button>
                        <a
                            className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/5 hover:bg-primary/10 rounded-lg text-primary font-label-md transition-all"
                            href="rafeeq.html"
                        >
                            <span className="material-symbols-outlined text-[20px]">
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
                                data-alt="Profile headshot."
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaUW4ycO4zpbXU8-f7qQ8e67JQFR0kFopGobvmcyuwtb7RmtLjv8uPEEmSl-hbsk0Uo2ApZUUq0wRlZ_zn8PJ4ugNgbj5OOGiU0BEkvvm8agYRwod83fIHy3htoOWJsIvO4ldpAhRTz0oyAMispIOZSiEf-bq73m7QKJeH-ZAfVM4q8r4pOddVVra4gOVTwYxIXtrSAQ5_f0WzHxDTzUUNzi4IEbgzPPqIh4aHvXgk12witr7-3N8pVFOo07Rs0y08Ht-8bubrd2i-"
                            />
                        </a>
                    </div>
                </div>
            </nav>
            <main className="pt-24 pb-12 px-container-margin-mobile md:px-container-margin-desktop max-w-[1280px] mx-auto">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="font-headline-lg text-headline-lg">Posts</h1>
                        <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
                            Browse the latest updates shared by organizers.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-outline-variant/40 bg-white px-3 py-2 shadow-sm">
                        <span className="material-symbols-outlined text-on-surface-variant">
                            search
                        </span>
                        <input
                            className="w-40 border-0 bg-transparent font-body-sm text-body-sm outline-none"
                            placeholder="Search posts"
                            type="text"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-gutter">
                    <div className="space-y-4">
                        <div className="ev-card spotlight ev-fade-up ev-stagger-2 ev-fade-up ev-stagger-1 overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <span
                                        className="material-symbols-outlined text-primary"
                                        style={{ fontVariationSettings: '"FILL" 1' }}
                                    >
                                        apartment
                                    </span>
                                </div>
                                <div>
                                    <p className="font-label-md text-label-md">TechGenius Labs</p>
                                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                                        Verified Organizer · 2h ago
                                    </p>
                                </div>
                            </div>
                            <p className="mt-4 font-body-md text-body-md">
                                Registration for the Global AI Innovation Challenge is now open.
                                Teams of 2-4, $10k in prizes, and remote-friendly opportunities are
                                available.
                            </p>
                            <p className="details mt-3 hidden font-body-sm text-body-sm text-on-surface-variant">
                                More details will appear here for applicants who want to learn about
                                the challenge timeline, eligibility, and how to submit the
                                application before the deadline.
                            </p>
                            <button
                                className="read-more mt-4 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 font-label-md text-label-md text-primary transition-all"
                                type="button"
                            >
                                Read more
                            </button>
                        </div>
                        <div className="ev-card spotlight ev-fade-up ev-stagger-2 ev-fade-up ev-stagger-2 overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-secondary/10">
                                    <span
                                        className="material-symbols-outlined text-secondary"
                                        style={{ fontVariationSettings: '"FILL" 1' }}
                                    >
                                        apartment
                                    </span>
                                </div>
                                <div>
                                    <p className="font-label-md text-label-md">DevCommunity Hub</p>
                                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                                        Verified Organizer · 5h ago
                                    </p>
                                </div>
                            </div>
                            <p className="mt-4 font-body-md text-body-md">
                                A new opportunity is now open for students and young founders to
                                join Startup Sprint 2024 in Amman. Register before Friday to reserve
                                your place and receive the event kit.
                            </p>
                            <p className="details mt-3 hidden font-body-sm text-body-sm text-on-surface-variant">
                                The registration form is open for early applicants. Participants
                                will receive a confirmation email, event access details, and
                                guidance on what to prepare before attending.
                            </p>
                            <button
                                className="read-more mt-4 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 font-label-md text-label-md text-primary transition-all"
                                type="button"
                            >
                                Read more
                            </button>
                        </div>
                        <div className="ev-card spotlight ev-fade-up ev-stagger-2 ev-fade-up ev-stagger-3 overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-tertiary/10">
                                    <span
                                        className="material-symbols-outlined text-tertiary"
                                        style={{ fontVariationSettings: '"FILL" 1' }}
                                    >
                                        apartment
                                    </span>
                                </div>
                                <div>
                                    <p className="font-label-md text-label-md">
                                        University of Technology
                                    </p>
                                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                                        Verified Organizer · 1d ago
                                    </p>
                                </div>
                            </div>
                            <p className="mt-4 font-body-md text-body-md">
                                We just wrapped the Quantum Computing Bootcamp and shared the
                                highlights with all participants. Certificates are on their way.
                            </p>
                            <p className="details mt-3 hidden font-body-sm text-body-sm text-on-surface-variant">
                                This post can expand to include learning resources, event recap
                                notes, and follow-up instructions for all participants who want more
                                context.
                            </p>
                            <button
                                className="read-more mt-4 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 font-label-md text-label-md text-primary transition-all"
                                type="button"
                            >
                                Read more
                            </button>
                        </div>
                        <div className="ev-card spotlight ev-fade-up ev-stagger-2 ev-fade-up ev-stagger-4 overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <span
                                        className="material-symbols-outlined text-primary"
                                        style={{ fontVariationSettings: '"FILL" 1' }}
                                    >
                                        emoji_events
                                    </span>
                                </div>
                                <div>
                                    <p className="font-label-md text-label-md">EVENTIFY Team</p>
                                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                                        New competition · Just posted
                                    </p>
                                </div>
                            </div>
                            <p className="mt-4 font-body-md text-body-md">
                                We just launched a new competition for creators and innovators. Join
                                the challenge and share your idea with the community.
                            </p>
                            <a
                                className="mt-3 inline-flex items-center gap-2 font-label-md text-label-md text-primary hover:underline"
                                href="opportunity.html"
                            >
                                <span className="material-symbols-outlined text-[16px]">link</span>
                                Open opportunity
                            </a>
                        </div>
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
            {/* Mobile Navigation */}
            <nav className="fixed bottom-0 w-full rounded-t-xl z-50 md:hidden flex justify-around items-center px-4 py-2 pb-safe bg-surface shadow-[0_-4px_12px_rgba(59,130,246,0.08)]">
                <a
                    className="flex flex-col items-center justify-center text-on-surface-variant transition-transform active:scale-90"
                    href="index.html"
                >
                    <span className="material-symbols-outlined">home</span>
                    <span className="font-label-sm text-label-sm">Home</span>
                </a>
                <a
                    className="flex flex-col items-center justify-center text-on-surface-variant transition-transform active:scale-90"
                    href="explore.html"
                >
                    <span className="material-symbols-outlined">explore</span>
                    <span className="font-label-sm text-label-sm">Explore</span>
                </a>
                <a
                    className="flex flex-col items-center justify-center text-secondary bg-secondary-container/20 rounded-xl px-3 py-1 transition-transform active:scale-90"
                    href="posts.html"
                >
                    <span className="material-symbols-outlined">campaign</span>
                    <span className="font-label-sm text-label-sm">Posts</span>
                </a>
                <a
                    className="flex flex-col items-center justify-center text-on-surface-variant transition-transform active:scale-90"
                    href="rafeeq.html"
                >
                    <span className="material-symbols-outlined">smart_toy</span>
                    <span className="font-label-sm text-label-sm">Rafeeq</span>
                </a>
                <a
                    className="flex flex-col items-center justify-center text-on-surface-variant transition-transform active:scale-90"
                    href="profile.html"
                >
                    <span className="material-symbols-outlined">person</span>
                    <span className="font-label-sm text-label-sm">Profile</span>
                </a>
            </nav>
        </>
    )
}
