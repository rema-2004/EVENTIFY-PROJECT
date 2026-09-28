export default function RegistrationSuccess() {
    return (
        <>
            <meta charSet="utf-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <title>Eventify - Registration Successful</title>
            <meta
                name="description"
                content="Eventify - Registration Successful on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
            />
            <meta property="og:title" content="Eventify - Registration Successful" />
            <meta
                property="og:description"
                content="Eventify - Registration Successful on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
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
            {/* Material Symbols */}
            {/* Google Fonts */}
            {/* Tailwind CSS */}
            <style
                dangerouslySetInnerHTML={{
                    __html:
                        "\n        .material-symbols-outlined {\n            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n        }\n        .glass-header {\n            background: rgba(250, 248, 255, 0.8);\n            backdrop-filter: blur(12px);\n        }\n        .soft-shadow {\n            box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.08);\n        }\n        .success-circle {\n            animation: pop .7s ease, pulse 2s infinite;\n        }\n        @keyframes pop {\n            from { transform: scale(.5); opacity: 0; }\n            to { transform: scale(1); opacity: 1; }\n        }\n        @keyframes pulse {\n            0% { box-shadow: 0 0 0 0 rgba(30, 122, 79, .35); }\n            70% { box-shadow: 0 0 0 22px rgba(30, 122, 79, 0); }\n            100% { box-shadow: 0 0 0 0 rgba(30, 122, 79, 0); }\n        }\n    "
                }}
            />
            <style
                dangerouslySetInnerHTML={{
                    __html: "\n    body {\n      min-height: max(884px, 100dvh);\n    }\n  "
                }}
            />
            {/* Header (Unified Task-Flow Chrome — matches participation-type.html) */}
            <header className="glass-header sticky top-0 z-50 w-full h-16 border-b border-outline-variant/30 flex items-center px-6">
                <a className="flex items-center gap-2" href="index.html">
                    <span className="material-symbols-outlined text-primary text-3xl">
                        hub
                    </span>
                    <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">
                        EVENTIFY
                    </span>
                </a>
                <a
                    className="ml-auto mr-3 font-label-md text-label-md text-primary"
                    href="my-applications.html"
                >
                    My Event
                </a>
                <div className="ml-auto">
                    <a
                        className="p-2 hover:bg-surface-container-low rounded-full transition-colors block"
                        href="my-applications.html"
                        aria-label="Close"
                    >
                        <span className="material-symbols-outlined text-on-surface-variant">
                            close
                        </span>
                    </a>
                </div>
            </header>
            <main className="flex-grow flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-container-high rounded-full ev-fade-up ev-stagger-1">
                        <span className="w-2 h-2 rounded-full bg-success" />
                        <span className="font-label-md text-label-md text-on-surface-variant">
                            Step 3 of 3
                        </span>
                    </div>
                    <div className="success-circle w-24 h-24 bg-success-container rounded-full flex items-center justify-center mx-auto">
                        <span
                            className="material-symbols-outlined text-success text-5xl"
                            style={{ fontVariationSettings: '"FILL" 1' }}
                        >
                            check_circle
                        </span>
                    </div>
                    <div className="space-y-3 ev-fade-up ev-stagger-2">
                        <h1 className="font-headline-lg text-headline-lg text-on-surface">
                            Registration Successful!
                        </h1>
                        <p className="font-body-lg text-body-lg text-on-surface-variant">
                            You're registered as a solo participant for{" "}
                            <span className="font-semibold text-on-surface">
                                Global AI Innovation Challenge
                            </span>
                            . No team needed — you're all set to compete on your own.
                        </p>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 soft-shadow text-left space-y-3 ev-fade-up ev-stagger-3">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">person</span>
                            <span className="font-label-md text-label-md text-on-surface">
                                Participation type: <span className="font-bold">Solo</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">mail</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">
                                A confirmation email is on its way to your inbox with next steps and
                                important deadlines.
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 ev-fade-up ev-stagger-4">
                        <a
                            className="w-full sm:w-auto py-4 px-8 rounded-full border border-outline-variant text-on-surface font-title-lg text-title-lg hover:bg-surface-container-low active:scale-95 transition-all duration-200"
                            href="opportunity.html"
                        >
                            Back to Opportunity
                        </a>
                        <a
                            className="w-full sm:w-auto py-4 px-8 rounded-full bg-primary text-on-primary font-title-lg text-title-lg shadow-lg hover:bg-primary-container active:scale-95 transition-all duration-200"
                            href="my-applications.html"
                        >
                            Go to My Event
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
            {/* Background Decorative Element */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-30" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] bg-success/5 rounded-full blur-3xl opacity-30" />
            </div>
        </>
    )
}
