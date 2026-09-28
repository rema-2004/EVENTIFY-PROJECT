import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ParticipationType() {
    const navigate = useNavigate()
    const [selectedOption, setSelectedOption] = useState('')
    const nextPaths = {
        solo: '/app/registration-success',
        team: '/app/teams',
        create: '/app/create-team',
    }

    return (
        <>
            <meta charSet="utf-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <title>Eventify - Participation Type</title>
            <meta
                name="description"
                content="Eventify - Participation Type on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
            />
            <meta property="og:title" content="Eventify - Participation Type" />
            <meta
                property="og:description"
                content="Eventify - Participation Type on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
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
                        "\n        .material-symbols-outlined {\n            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n        }\n        .active-card {\n            border: 2px solid #FF4D2E;\n            background-color: #f3f3fe;\n            transform: translateY(-4px);\n        }\n        .glass-header {\n            background: rgba(250, 248, 255, 0.8);\n            backdrop-filter: blur(12px);\n        }\n        .soft-shadow {\n            box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.08);\n        }\n    "
                }}
            />
            <style
                dangerouslySetInnerHTML={{
                    __html: "\n    body {\n      min-height: max(884px, 100dvh);\n    }\n  "
                }}
            />
            {/* Header (Suppressed Nav Shell Logic for Task-Focused Page) */}
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
                        href="opportunity.html"
                        aria-label="Close"
                    >
                        <span className="material-symbols-outlined text-on-surface-variant">
                            close
                        </span>
                    </a>
                </div>
            </header>
            <main className="flex-grow flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-4xl mx-auto space-y-10">
                    {/* Step Indicator & Heading */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-container-high rounded-full">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="font-label-md text-label-md text-on-surface-variant">
                                Step 1 of 3
                            </span>
                        </div>
                        <div className="space-y-2">
                            <h1 className="font-headline-lg text-headline-lg text-on-surface">
                                How would you like to participate?
                            </h1>
                            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mx-auto">
                                Select how you want to join this competition.
                            </p>
                        </div>
                    </div>
                    {/* Participation Options Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Solo Card */}
                        <button
                            className={`participation-card flex flex-col items-start p-6 rounded-xl bg-surface border border-outline-variant hover:border-primary/50 hover:bg-surface-container-low transition-all duration-300 text-left soft-shadow group relative ${selectedOption === 'solo' ? 'active-card' : ''}`}
                            data-next="registration-success.html"
                            onClick={() => setSelectedOption('solo')}
                        >
                            <div className="absolute top-4 right-4 opacity-0 group-[.active-card]:opacity-100 transition-opacity">
                                <span
                                    className="material-symbols-outlined text-primary"
                                    style={{ fontVariationSettings: '"FILL" 1' }}
                                >
                                    check_circle
                                </span>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center mb-6">
                                <span
                                    className="material-symbols-outlined text-primary text-2xl"
                                    data-icon="person"
                                >
                                    person
                                </span>
                            </div>
                            <div className="space-y-3 mb-8 flex-grow">
                                <h3 className="font-title-lg text-title-lg text-on-surface">
                                    Participate Solo
                                </h3>
                                <p className="font-body-md text-body-md text-on-surface-variant">
                                    Join as an individual competitor.
                                </p>
                            </div>
                            <span className="inline-block px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm">
                                No team required
                            </span>
                        </button>
                        {/* Looking for Team Card */}
                        <button
                            className={`participation-card flex flex-col items-start p-6 rounded-xl bg-surface border border-outline-variant hover:border-primary/50 hover:bg-surface-container-low transition-all duration-300 text-left soft-shadow group relative ${selectedOption === 'team' ? 'active-card' : ''}`}
                            data-next="teams.html"
                            onClick={() => setSelectedOption('team')}
                        >
                            <div className="absolute top-4 right-4 opacity-0 group-[.active-card]:opacity-100 transition-opacity">
                                <span
                                    className="material-symbols-outlined text-primary"
                                    style={{ fontVariationSettings: '"FILL" 1' }}
                                >
                                    check_circle
                                </span>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-secondary-fixed flex items-center justify-center mb-6">
                                <span
                                    className="material-symbols-outlined text-secondary text-2xl"
                                    data-icon="groups"
                                >
                                    groups
                                </span>
                            </div>
                            <div className="space-y-3 mb-8 flex-grow">
                                <h3 className="font-title-lg text-title-lg text-on-surface">
                                    Looking for a Team
                                </h3>
                                <p className="font-body-md text-body-md text-on-surface-variant">
                                    Browse existing teams and request to join one.
                                </p>
                            </div>
                            <span className="inline-block px-3 py-1 rounded-full bg-secondary-container/10 text-secondary font-label-sm text-label-sm">
                                Find teammates easily
                            </span>
                        </button>
                        {/* Create Team Card */}
                        <button
                            className={`participation-card flex flex-col items-start p-6 rounded-xl bg-surface border border-outline-variant hover:border-primary/50 hover:bg-surface-container-low transition-all duration-300 text-left soft-shadow group relative ${selectedOption === 'create' ? 'active-card' : ''}`}
                            data-next="create-team.html"
                            onClick={() => setSelectedOption('create')}
                        >
                            <div className="absolute top-4 right-4 opacity-0 group-[.active-card]:opacity-100 transition-opacity">
                                <span
                                    className="material-symbols-outlined text-primary"
                                    style={{ fontVariationSettings: '"FILL" 1' }}
                                >
                                    check_circle
                                </span>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-tertiary-fixed flex items-center justify-center mb-6">
                                <span
                                    className="material-symbols-outlined text-tertiary text-2xl"
                                    data-icon="add_circle"
                                >
                                    add_circle
                                </span>
                            </div>
                            <div className="space-y-3 mb-8 flex-grow">
                                <h3 className="font-title-lg text-title-lg text-on-surface">
                                    Create a Team
                                </h3>
                                <p className="font-body-md text-body-md text-on-surface-variant">
                                    Create your own team and recruit members.
                                </p>
                            </div>
                            <span className="inline-block px-3 py-1 rounded-full bg-tertiary-fixed-dim/20 text-tertiary font-label-sm text-label-sm border border-tertiary/20">
                                Become a team leader
                            </span>
                        </button>
                    </div>
                    {/* Action Button */}
                    <div className="flex flex-col items-center pt-8">
                        <button
                            className="w-full md:w-64 py-4 px-8 rounded-full bg-primary text-on-primary font-title-lg text-title-lg shadow-lg hover:bg-primary-container active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                            disabled={!selectedOption}
                            onClick={() => navigate(nextPaths[selectedOption])}
                            id="continue-btn"
                        >
                            Continue
                        </button>
                        <p className="mt-4 font-label-md text-label-md text-on-surface-variant">
                            You can change this later in your profile settings.
                        </p>
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
                <div className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl opacity-30" />
            </div>
        </>
    )
}
