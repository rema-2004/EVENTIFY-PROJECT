export default function Saved() {
    return (
        <>
            <meta charSet="utf-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <title>Saved | EVENTIFY</title>
            <meta
                name="description"
                content="Saved on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
            />
            <meta property="og:title" content="Saved | EVENTIFY" />
            <meta
                property="og:description"
                content="Saved on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
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
                        "\n        @font-face {\n            font-family: 'Material Symbols Outlined';\n            font-style: normal;\n            font-weight: 100 700;\n            font-display: block;\n            src: url('../assets/fonts/material-symbols-outlined.woff2') format('woff2');\n        }\n\n        .material-symbols-outlined {\n            font-family: 'Material Symbols Outlined';\n            font-weight: normal;\n            font-style: normal;\n            font-size: 24px;\n            line-height: 1;\n            letter-spacing: normal;\n            text-transform: none;\n            display: inline-block;\n            white-space: nowrap;\n            overflow: hidden;\n            word-wrap: normal;\n            direction: ltr;\n            -webkit-font-feature-settings: 'liga';\n            -webkit-font-smoothing: antialiased;\n            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n            vertical-align: middle;\n        }\n    "
                }}
            />
            <div className="min-h-screen">
                <main className="mx-auto w-full max-w-7xl px-4 py-8 pb-24 md:px-12 lg:pb-8">
                    <div className="mb-6 flex items-center gap-3 text-label-md">
                        <a
                            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-on-surface-variant hover:bg-surface-container-high transition-colors"
                            href="profile.html"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                            <span>Back to profile</span>
                        </a>
                    </div>
                    <div className="mb-6 flex items-center gap-2 text-label-md">
                        <a
                            className="text-on-surface-variant hover:text-primary"
                            href="profile.html"
                        >
                            Profile
                        </a>
                        <span className="text-outline">/</span>
                        <span>Saved</span>
                    </div>
                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="font-headline-lg text-headline-lg">
                                Saved opportunities
                            </h1>
                            <p className="mt-1 text-on-surface-variant">
                                Your saved competitions and opportunities are stored here for quick
                                access.
                            </p>
                        </div>
                        <button className="rounded-full bg-primary px-6 py-3 text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors">
                            Manage saved items
                        </button>
                    </div>
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        data-empty-when-empty=""
                        data-empty-icon="bookmark"
                        data-empty-title="Nothing saved yet"
                        data-empty-body="Save an opportunity while you browse and it waits for you here until the deadline."
                        data-empty-action="Browse opportunities"
                        data-empty-href="explore.html"
                    >
                        <div className="ev-card spotlight ev-fade-up ev-stagger-2 ev-fade-up ev-stagger-1 bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm group cursor-pointer">
                            <div className="h-56 relative overflow-hidden">
                                <img
                                    className="ev-card-img w-full h-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9CEnFNI0sa64wtdt1xcbuCO2ctuePljYf3b0mGoAfsaVbTQZl6EUEKGeq_A-lCje6-84UGOy-xM_EX1fj34sF-YWMO-_0SG4_iedT1vjYrRw5UpEFxOlngZ_cDhCxJRFxyyChSuzfbQzaifbDrY-ySQm0SZNqdXFNpNdzVSiaboP2NAJ4pYTV-P32G1lYqug8kLksnCytiGNYKiUHGIacjDYyZIZ5HHucNTeyCLWQmzn3HRdmrm8n18EIgGN0AobDjfqjTG3DQkjK"
                                    alt="Global AI Innovation Challenge"
                                />
                                <div className="absolute top-3 left-3 rounded-full bg-secondary text-white px-3 py-1 font-label-sm text-label-sm uppercase">
                                    HACKATHON
                                </div>
                                <div className="absolute top-3 right-3 rounded-full bg-primary/95 text-white px-3 py-1 font-label-sm text-label-sm uppercase">
                                    Saved
                                </div>
                            </div>
                            <div className="p-5 space-y-4">
                                <h3 className="font-title-md text-title-md line-clamp-2">
                                    Global AI Innovation Challenge
                                </h3>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">
                                    By TechGenius Labs · Remote
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="bg-surface-container text-on-surface rounded-full px-3 py-1 font-label-sm text-label-sm uppercase">
                                        Competition
                                    </span>
                                    <span className="bg-secondary/10 text-secondary rounded-full px-3 py-1 font-mono text-label-sm">
                                        98%
                                    </span>
                                </div>
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center">
                                    <a
                                        href="opportunity.html"
                                        className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-on-primary font-label-md text-label-md hover:bg-primary-container hover:shadow-lg transition-all"
                                    >
                                        Go to opportunity
                                    </a>
                                    <button className="inline-flex items-center justify-center rounded-full border border-outline-variant px-4 py-2 text-on-surface font-label-md text-label-md hover:border-primary hover:text-primary hover:shadow-sm transition-all">
                                        Remove from saved
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="ev-card spotlight ev-fade-up ev-stagger-2 ev-fade-up ev-stagger-1 bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm group cursor-pointer">
                            <div className="h-56 relative overflow-hidden">
                                <img
                                    className="ev-card-img w-full h-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcUXLF60F3KbDnIVZepTTte_yzkhe3rkuMtXTXTMQzA1gyVuzXN1NQ0DXC7XHQBDIHEA2TXLK8EoSvioCS5PoWNoZKnVI7YeLCAxqcRtKE-cfSsrD6X3yBiiGI_J0DdnCu4vgHVOf7tn5UW93gDceqUiZ4hVu5ZCvSuDbEd3Dm8uTINHyELfvrJM4AvcW6lRAm2zAmGTlp9N7rNMUMizYToAN1_rTfY1KtEjsmeIx--zlkOzEz07DRgirbjC8bnSBfxNFTTtVBYuqf"
                                    alt="Deep Learning Mastery"
                                />
                                <div className="absolute top-3 left-3 rounded-full bg-primary text-white px-3 py-1 font-label-sm text-label-sm uppercase">
                                    WORKSHOP
                                </div>
                                <div className="absolute top-3 right-3 rounded-full bg-primary/95 text-white px-3 py-1 font-label-sm text-label-sm uppercase">
                                    Saved
                                </div>
                            </div>
                            <div className="p-5 space-y-4">
                                <h3 className="font-title-md text-title-md line-clamp-2">
                                    Deep Learning Mastery
                                </h3>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">
                                    University of Technology · Hybrid
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="bg-surface-container text-on-surface rounded-full px-3 py-1 font-label-sm text-label-sm uppercase">
                                        Workshop
                                    </span>
                                    <span className="bg-secondary/10 text-secondary rounded-full px-3 py-1 font-label-sm text-label-sm uppercase">
                                        Hands-on
                                    </span>
                                </div>
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center">
                                    <a
                                        href="opportunity.html"
                                        className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-on-primary font-label-md text-label-md hover:bg-primary-container hover:shadow-lg transition-all"
                                    >
                                        Go to opportunity
                                    </a>
                                    <button className="inline-flex items-center justify-center rounded-full border border-outline-variant px-4 py-2 text-on-surface font-label-md text-label-md hover:border-primary hover:text-primary hover:shadow-sm transition-all">
                                        Remove from saved
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="ev-card spotlight ev-fade-up ev-stagger-2 ev-fade-up ev-stagger-1 bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm group cursor-pointer">
                            <div className="h-56 relative overflow-hidden">
                                <img
                                    className="ev-card-img w-full h-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoXFluzheWmZ490MELdToAMEYpR_txVKV30osgae_hCJtZOTitQ7q-hlRINJEb6yu8WczfucSzRFeg7_ASopSg4PYi40bcSgLBAzpyDWcgZltV0lVaadKj9Hxg_0-MIvEynOlpWfO6oad4LDePXnQqUogQYAUOomnsxNQRm0sYppi6tcEF-XVtGAmZwLlJ7Zzvf2ojEvEnU0EwWkAE_qpAYRfUYUWLDeKx1nnQtM-6DxX8uCm13GfTKpd5tCt-XHKS5s04qO3jTwFA"
                                    alt="Frontend Wizards 2024"
                                />
                                <div className="absolute top-3 left-3 rounded-full bg-secondary text-white px-3 py-1 font-label-sm text-label-sm uppercase">
                                    COMPETITION
                                </div>
                                <div className="absolute top-3 right-3 rounded-full bg-primary/95 text-white px-3 py-1 font-label-sm text-label-sm uppercase">
                                    Saved
                                </div>
                            </div>
                            <div className="p-5 space-y-4">
                                <h3 className="font-title-md text-title-md line-clamp-2">
                                    Frontend Wizards 2024
                                </h3>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">
                                    DevCommunity Hub · London, UK
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="bg-surface-container text-on-surface rounded-full px-3 py-1 font-label-sm text-label-sm uppercase">
                                        Competition
                                    </span>
                                    <span className="bg-secondary/10 text-secondary rounded-full px-3 py-1 font-label-sm text-label-sm uppercase">
                                        Top 10
                                    </span>
                                </div>
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center">
                                    <a
                                        href="opportunity.html"
                                        className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-on-primary font-label-md text-label-md hover:bg-primary-container hover:shadow-lg transition-all"
                                    >
                                        Go to opportunity
                                    </a>
                                    <button className="inline-flex items-center justify-center rounded-full border border-outline-variant px-4 py-2 text-on-surface font-label-md text-label-md hover:border-primary hover:text-primary hover:shadow-sm transition-all">
                                        Remove from saved
                                    </button>
                                </div>
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
            </div>
        </>
    )
}
