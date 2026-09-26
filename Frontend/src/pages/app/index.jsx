import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AppHome() {
    const navigate = useNavigate()
    const openOpportunity = () => navigate('/app/opportunity')
    const [isRafeeqOpen, setIsRafeeqOpen] = useState(false)
    const toggleRafeeq = () => setIsRafeeqOpen((isOpen) => !isOpen)
    return (
        <>
            <meta charSet="utf-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <title>EVENTIFY | AI-Powered Opportunity Hub</title>
            <meta
                name="description"
                content="AI-Powered Opportunity Hub on EVENTIFY � the AI-powered hub for competitions, workshops, courses and internships."
            />
            <meta property="og:title" content="EVENTIFY | AI-Powered Opportunity Hub" />
            <meta
                property="og:description"
                content="AI-Powered Opportunity Hub on EVENTIFY � the AI-powered hub for competitions, workshops, courses and internships."
            />
            <meta property="og:type" content="website" />
            <meta property="og:image" content="assets/images/event1.jpeg" />
            <link rel="icon" href="../assets/images/favicon.svg" type="image/svg+xml" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link
                href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"
                rel="stylesheet"
            />
            {/* Global Theme Handler (Prevents FOUC in dark mode) */}
            <link rel="stylesheet" href="../assets/css/theme.css" />
            <link rel="stylesheet" href="nav.css" />
            <link rel="stylesheet" href="app-shell.css" />
            <style
                dangerouslySetInnerHTML={{
                    __html:
                        "\n    @font-face {\n        font-family: 'Material Symbols Outlined';\n        font-style: normal;\n        font-weight: 100 700;\n        font-display: block;\n        src: url('../assets/fonts/material-symbols-outlined.woff2') format('woff2');\n    }\n    .material-symbols-outlined {\n        font-family: 'Material Symbols Outlined';\n        font-weight: normal;\n        font-style: normal;\n        font-size: 24px;\n        line-height: 1;\n        letter-spacing: normal;\n        text-transform: none;\n        display: inline-block;\n        white-space: nowrap;\n        overflow: hidden;\n        word-wrap: normal;\n        direction: ltr;\n        font-feature-settings: 'liga';\n        -webkit-font-feature-settings: 'liga';\n        -webkit-font-smoothing: antialiased;\n    }\n\n        /* phase-3 layout */\n        .home-section{margin-top:7rem;}\n\n        /* app hero */\n        .app-hero{color:#FAFAF8;}\n        .app-hero__bg{background:#0E1116;}\n        .app-hero h1,.app-hero p{color:#FAFAF8;}\n        .app-hero p{max-width:52ch;}\n        .app-hero .text-primary{color:#FF4D2E;}\n        .app-hero__badge{background:rgba(255,255,255,.1);color:#FAFAF8;border:1px solid rgba(255,255,255,.18);}\n        .app-hero .max-w-2xl{max-width:none;}\n        .app-hero .mx-auto{margin-left:0;margin-right:0;}\n        .app-hero .text-center{text-align:left;}\n        .app-hero .items-center{align-items:flex-start;}\n        .app-hero .search-icon-wrap{align-items:center;}\n    "
                }}
            />
            <style
                dangerouslySetInnerHTML={{
                    __html:
                        "\n        .bento-grid {\n            display: grid;\n            grid-template-columns: repeat(12, 1fr);\n            gap: 24px;\n        }\n        .home-section{margin-top:4rem;}\n        .home-section:first-child{margin-top:0;}\n        .home-section-header{display:flex;align-items:flex-end;justify-content:space-between;gap:1rem;margin-bottom:1.5rem;}\n        .home-card{height:100%;display:flex;flex-direction:column;}\n        .home-card-media{height:12rem;flex-shrink:0;}\n        .home-card-body{display:flex;flex:1;flex-direction:column;}\n        .home-card-actions{margin-top:auto;}\n        @media(max-width:767px){\n            .home-section{margin-top:3rem;}\n            .home-section-header{align-items:flex-start;flex-direction:column;}\n            .home-card-media{height:10rem;}\n        }\n        .match-glow {\n            box-shadow: 0 0 20px rgba(59, 130, 246, 0.15);\n        }\n        .rafeeq-gradient {\n            background: linear-gradient(135deg, #FF4D2E 0%, #0E1116 100%);\n        }\n    "
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
                                className="font-label-md text-label-md text-primary font-bold border-b-2 border-primary pb-1 transition-all"
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
                            className="h-10 w-10 avatar-squircle overflow-hidden border-2 border-primary-container block"
                            href="profile.html"
                        >
                            <img
                                className="w-full h-full object-cover"
                                data-alt="A clean, professional headshot of a diverse young professional man in his late 20s with a warm, confident smile. He is wearing a modern navy blue blazer over a crisp white shirt. The background is a soft-focus office environment with large windows and bright natural light, reflecting the premium, high-stakes event management brand aesthetic."
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaUW4ycO4zpbXU8-f7qQ8e67JQFR0kFopGobvmcyuwtb7RmtLjv8uPEEmSl-hbsk0Uo2ApZUUq0wRlZ_zn8PJ4ugNgbj5OOGiU0BEkvvm8agYRwod83fIHy3htoOWJsIvO4ldpAhRTz0oyAMispIOZSiEf-bq73m7QKJeH-ZAfVM4q8r4pOddVVra4gOVTwYxIXtrSAQ5_f0WzHxDTzUUNzi4IEbgzPPqIh4aHvXgk12witr7-3N8pVFOo07Rs0y08Ht-8bubrd2i-"
                            />
                        </a>
                    </div>
                </div>
            </nav>
            {/* Main Content Canvas */}
            <main className="pt-24 pb-12 px-container-margin-mobile md:px-container-margin-desktop max-w-[1280px] mx-auto space-y-12">
                {/* Hero Section */}
                <section className="app-hero relative overflow-hidden rounded-xl px-8 py-16 md:px-16 md:py-24 flex flex-col items-start text-left space-y-6">
                    {/* Atmospheric Background */}
                    <div className="absolute inset-0 -z-10 app-hero__bg" />
                    <div className="ev-fade-up ev-stagger-1 space-y-2">
                        <span className="app-hero__badge inline-block px-4 py-1 font-label-md rounded-full">
                            Welcome Back ??
                        </span>
                        <h1 className="font-headline-xl text-headline-xl tracking-tight max-w-3xl">
                            Discover the Right{" "}
                            <span className="text-primary italic">Opportunity</span> with AI
                        </h1>
                        <p className="font-body-lg text-body-lg text-white/70 max-w-xl mx-auto">
                            We read your resume once � now every competition, event, workshop, and
                            course below is ranked for your skills.
                        </p>
                    </div>
                    <div className="ev-fade-up ev-stagger-2 flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 font-label-sm text-label-sm max-w-full text-center">
                            <span
                                className="material-symbols-outlined text-primary text-[18px]"
                                data-icon="task_alt"
                            >
                                task_alt
                            </span>
                            CV analyzed ·{" "}
                            <strong className="font-semibold">
                                AI &amp; Software Engineering
                            </strong>{" "}
                            profile detected
                        </span>
                        <a
                            className="font-label-sm text-label-sm text-primary hover:underline"
                            href="profile.html"
                        >
                            Update your resume ?
                        </a>
                    </div>
                    <div className="ev-fade-up ev-stagger-3 w-full max-w-3xl relative mt-8">
                        <div className="search-icon-wrap absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <span
                                className="material-symbols-outlined text-on-surface-variant dark:text-gray-400"
                                data-icon="search"
                            >
                                search
                            </span>
                        </div>
                        <input
                            className="w-full pl-14 pr-32 py-5 bg-surface text-on-surface dark:bg-slate-900/90 dark:text-white placeholder:text-on-surface-variant dark:placeholder:text-gray-400 border border-outline-variant dark:border-white/15 shadow-lg rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-body-md font-body-md"
                            placeholder="Search opportunities, events, workshops, or courses..."
                            type="text"
                        />
                        <button className="absolute right-3 top-2.5 bottom-2.5 px-6 bg-primary text-on-primary font-label-md rounded-lg hover:bg-primary-container transition-colors">
                            Search
                        </button>
                    </div>
                </section>
                {/* AI Recommendation Section */}
                <section className="ev-fade-up ev-stagger-1 space-y-6 home-section">
                    <div className="home-section-header">
                        <div className="space-y-1">
                            <h2 className="font-headline-lg text-headline-lg text-on-background dark:text-white flex items-center gap-2">
                                <span
                                    className="material-symbols-outlined text-secondary"
                                    data-icon="auto_awesome"
                                >
                                    auto_awesome
                                </span>
                                Recommended For You
                            </h2>
                            <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-300">
                                Matched against the skills and experience in your CV, refreshed just
                                now.
                            </p>
                        </div>
                        <a
                            className="text-primary font-label-md hover:underline"
                            href="explore.html"
                        >
                            View All Matches
                        </a>
                    </div>
                    <div className="recommended-grid grid grid-cols-1 md:grid-cols-3 gap-gutter items-stretch">
                        {/* Recommended Card 1 */}
                        <div className="ev-fade-up ev-stagger-2 ev-card spotlight bg-surface-container-lowest dark:bg-slate-900/80 border border-outline-variant/30 dark:border-white/10 rounded-xl overflow-hidden shadow-sm group border-l-4 border-l-secondary">
                            <div className="h-48 home-card-media relative overflow-hidden">
                                <img
                                    className="ev-card-img w-full h-full object-cover"
                                    data-alt="A dynamic digital art piece representing a global coding hackathon. The scene shows glowing blue circuit lines flowing through a futuristic city skyline under a night sky."
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9CEnFNI0sa64wtdt1xcbuCO2ctuePljYf3b0mGoAfsaVbTQZl6EUEKGeq_A-lCje6-84UGOy-xM_EX1fj34sF-YWMO-_0SG4_iedT1vjYrRw5UpEFxOlngZ_cDhCxJRFxyyChSuzfbQzaifbDrY-ySQm0SZNqdXFNpNdzVSiaboP2NAJ4pYTV-P32G1lYqug8kLksnCytiGNYKiUHGIacjDYyZIZ5HHucNTeyCLWQmzn3HRdmrm8n18EIgGN0AobDjfqjTG3DQkjK"
                                />
                                <div className="absolute top-3 right-3 px-3 py-1 bg-secondary text-white rounded-lg font-label-sm flex items-center gap-1 shadow-lg">
                                    <span
                                        className="material-symbols-outlined text-[14px]"
                                        data-icon="bolt"
                                    >
                                        bolt
                                    </span>{" "}
                                    98% Match
                                </div>
                            </div>
                            <div className="p-6 space-y-4 home-card-body">
                                <div>
                                    <span className="font-label-sm text-label-sm uppercase text-secondary">
                                        HACKATHON
                                    </span>
                                    <a className="block" href="opportunity.html">
                                        <h3 className="font-title-md text-title-md text-on-background dark:text-white line-clamp-1 mt-1 hover:text-primary transition-colors">
                                            Global AI Innovation Challenge
                                        </h3>
                                    </a>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-gray-300">
                                        By TechGenius Labs
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 pt-2">
                                        <span className="px-2 py-0.5 rounded-full bg-surface-container dark:bg-slate-800 font-label-sm text-label-sm text-on-surface-variant dark:text-gray-300">
                                            From your CV: Python
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full bg-surface-container dark:bg-slate-800 font-label-sm text-label-sm text-on-surface-variant dark:text-gray-300">
                                            Machine Learning
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-outline dark:text-gray-400 font-label-sm">
                                    <div className="flex items-center gap-1">
                                        <span
                                            className="material-symbols-outlined text-[18px]"
                                            data-icon="calendar_month"
                                        >
                                            calendar_month
                                        </span>
                                        Oct 24
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span
                                            className="material-symbols-outlined text-[18px]"
                                            data-icon="location_on"
                                        >
                                            location_on
                                        </span>
                                        Remote
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2 home-card-actions">
                                    <a className="btn-primary flex-1" href="opportunity.html">
                                        Apply Now
                                    </a>
                                    <button
                                        className="px-3 border border-outline-variant dark:border-white/10 rounded-lg hover:bg-surface-container dark:hover:bg-slate-800 transition-colors text-on-surface-variant dark:text-gray-300"
                                        aria-label="Save for later"
                                    >
                                        <span
                                            className="material-symbols-outlined"
                                            data-icon="bookmark"
                                        >
                                            bookmark
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Recommended Card 2 */}
                        <div className="ev-fade-up ev-stagger-2 ev-card spotlight bg-surface-container-lowest dark:bg-slate-900/80 border border-outline-variant/30 dark:border-white/10 rounded-xl overflow-hidden shadow-sm group border-l-4 border-l-primary">
                            <div className="h-48 home-card-media relative overflow-hidden">
                                <img
                                    className="ev-card-img w-full h-full object-cover"
                                    data-alt="A professional workshop setting focused on deep learning."
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcUXLF60F3KbDnIVZepTTte_yzkhe3rkuMtXTXTMQzA1gyVuzXN1NQ0DXC7XHQBDIHEA2TXLK8EoSvioCS5PoWNoZKnVI7YeLCAxqcRtKE-cfSsrD6X3yBiiGI_J0DdnCu4vgHVOf7tn5UW93gDceqUiZ4hVu5ZCvSuDbEd3Dm8uTINHyELfvrJM4AvcW6lRAm2zAmGTlp9N7rNMUMizYToAN1_rTfY1KtEjsmeIx--zlkOzEz07DRgirbjC8bnSBfxNFTTtVBYuqf"
                                />
                                <div className="absolute top-3 right-3 px-3 py-1 bg-secondary text-white rounded-lg font-label-sm flex items-center gap-1 shadow-lg">
                                    <span
                                        className="material-symbols-outlined text-[14px]"
                                        data-icon="bolt"
                                    >
                                        bolt
                                    </span>{" "}
                                    95% Match
                                </div>
                            </div>
                            <div className="p-6 space-y-4 home-card-body">
                                <div>
                                    <span className="font-label-sm text-label-sm uppercase text-primary">
                                        WORKSHOP
                                    </span>
                                    <a className="block" href="opportunity.html">
                                        <h3 className="font-title-md text-title-md text-on-background dark:text-white line-clamp-1 mt-1 hover:text-primary transition-colors">
                                            Deep Learning Mastery
                                        </h3>
                                    </a>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-gray-300">
                                        University of Technology
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 pt-2">
                                        <span className="px-2 py-0.5 rounded-full bg-surface-container dark:bg-slate-800 font-label-sm text-label-sm text-on-surface-variant dark:text-gray-300">
                                            From your CV: TensorFlow
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full bg-surface-container dark:bg-slate-800 font-label-sm text-label-sm text-on-surface-variant dark:text-gray-300">
                                            Deep Learning
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-outline dark:text-gray-400 font-label-sm">
                                    <div className="flex items-center gap-1">
                                        <span
                                            className="material-symbols-outlined text-[18px]"
                                            data-icon="calendar_month"
                                        >
                                            calendar_month
                                        </span>
                                        Nov 12
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span
                                            className="material-symbols-outlined text-[18px]"
                                            data-icon="location_on"
                                        >
                                            location_on
                                        </span>
                                        Hybrid
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2 home-card-actions">
                                    <a className="btn-primary flex-1" href="opportunity.html">
                                        Register
                                    </a>
                                    <button
                                        className="px-3 border border-outline-variant dark:border-white/10 rounded-lg hover:bg-surface-container dark:hover:bg-slate-800 transition-colors text-on-surface-variant dark:text-gray-300"
                                        aria-label="Save for later"
                                    >
                                        <span
                                            className="material-symbols-outlined"
                                            data-icon="bookmark"
                                        >
                                            bookmark
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Recommended Card 3 */}
                        <div className="bg-surface-container-lowest dark:bg-slate-900/80 border border-outline-variant/30 dark:border-white/10 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group border-l-4 border-l-secondary premium-card spotlight">
                            <div className="h-48 home-card-media relative overflow-hidden">
                                <img
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    data-alt="A futuristic web development competition poster."
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoXFluzheWmZ490MELdToAMEYpR_txVKV30osgae_hCJtZOTitQ7q-hlRINJEb6yu8WczfucSzRFeg7_ASopSg4PYi40bcSgLBAzpyDWcgZltV0lVaadKj9Hxg_0-MIvEynOlpWfO6oad4LDePXnQqUogQYAUOomnsxNQRm0sYppi6tcEF-XVtGAmZwLlJ7Zzvf2ojEvEnU0EwWkAE_qpAYRfUYUWLDeKx1nnQtM-6DxX8uCm13GfTKpd5tCt-XHKS5s04qO3jTwFA"
                                />
                                <div className="absolute top-3 right-3 px-3 py-1 bg-secondary text-white rounded-lg font-label-sm flex items-center gap-1 shadow-lg">
                                    <span
                                        className="material-symbols-outlined text-[14px]"
                                        data-icon="bolt"
                                    >
                                        bolt
                                    </span>{" "}
                                    92% Match
                                </div>
                            </div>
                            <div className="p-6 space-y-4 home-card-body">
                                <div>
                                    <span className="font-label-sm text-label-sm uppercase text-secondary">
                                        COMPETITION
                                    </span>
                                    <a className="block" href="opportunity.html">
                                        <h3 className="font-title-md text-title-md text-on-background dark:text-white line-clamp-1 mt-1 hover:text-primary transition-colors">
                                            Frontend Wizards 2024
                                        </h3>
                                    </a>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-gray-300">
                                        DevCommunity Hub
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 pt-2">
                                        <span className="px-2 py-0.5 rounded-full bg-surface-container dark:bg-slate-800 font-label-sm text-label-sm text-on-surface-variant dark:text-gray-300">
                                            From your CV: React
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full bg-surface-container dark:bg-slate-800 font-label-sm text-label-sm text-on-surface-variant dark:text-gray-300">
                                            JavaScript
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-outline dark:text-gray-400 font-label-sm">
                                    <div className="flex items-center gap-1">
                                        <span
                                            className="material-symbols-outlined text-[18px]"
                                            data-icon="calendar_month"
                                        >
                                            calendar_month
                                        </span>
                                        Dec 05
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span
                                            className="material-symbols-outlined text-[18px]"
                                            data-icon="location_on"
                                        >
                                            location_on
                                        </span>
                                        London, UK
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2 home-card-actions">
                                    <a className="btn-primary flex-1" href="opportunity.html">
                                        Join Now
                                    </a>
                                    <button
                                        className="px-3 border border-outline-variant dark:border-white/10 rounded-lg hover:bg-surface-container dark:hover:bg-slate-800 transition-colors text-on-surface-variant dark:text-gray-300"
                                        aria-label="Save for later"
                                    >
                                        <span
                                            className="material-symbols-outlined"
                                            data-icon="bookmark"
                                        >
                                            bookmark
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Competitions Section */}
                <section className="ev-fade-up ev-stagger-1 space-y-6 home-section">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="font-headline-lg text-headline-lg text-on-background dark:text-white">
                            Explore Competitions
                        </h2>
                        <a
                            className="text-primary font-label-md hover:underline"
                            href="explore.html"
                        >
                            View All
                        </a>
                    </div>
                    <div
                        className="grid grid-cols-1 md:grid-cols-4 gap-gutter"
                        id="comp-grid"
                    >
                        {/* Comp Card 1 */}
                        <div
                            className="bg-surface-container-lowest dark:bg-slate-900/80 border border-outline-variant/30 dark:border-white/10 rounded-xl p-4 space-y-4 premium-card cursor-pointer group"
                            onClick={openOpportunity}
                        >
                            <div className="aspect-video rounded-lg overflow-hidden mb-4">
                                <img
                                    className="w-full h-full object-cover"
                                    data-alt="Cyber Sentinel CTF"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv-V-8GjFWlxuhqQq9nPPBCQKNIYRDy0-x7U8GZDqCxf3lpcSiGNgXTpm9Dp9vtBNtYRJM9-o_XfAV_yWpqjCDBHhA3Xin8gTKbYsCIpYqce02UMEzafn25IYfHI6hd-IasfwMRqIx3qADrfqnj7m-D_PHpWiW6GRyb70Zw9C6yT7Xu6xsRz80sxxnJdXORtOzWdcpjojOlvDh2cdJULC_KUcENGeijXkCPjAA02-axN9qR_MrffMvhq-xjwZhj4cy_sT0Lsf7llBS"
                                />
                            </div>
                            <div className="space-y-1">
                                <span className="font-label-sm text-label-sm uppercase text-secondary">
                                    CTF
                                </span>
                                <div className="flex justify-between items-start">
                                    <h4 className="font-title-md text-title-md text-on-background dark:text-white leading-tight">
                                        Cyber Sentinel CTF
                                    </h4>
                                    <span
                                        className="material-symbols-outlined text-outline dark:text-gray-400"
                                        data-icon="more_vert"
                                    >
                                        more_vert
                                    </span>
                                </div>
                            </div>
                            <div className="ev-fade-up ev-stagger-1 space-y-2">
                                <div className="flex items-center gap-2 text-outline dark:text-gray-400 font-label-sm">
                                    <span
                                        className="material-symbols-outlined text-[16px]"
                                        data-icon="groups"
                                    >
                                        groups
                                    </span>
                                    Teams of 2-4
                                </div>
                                <div className="flex items-center gap-2 text-outline dark:text-gray-400 font-label-sm">
                                    <span
                                        className="material-symbols-outlined text-[16px]"
                                        data-icon="history"
                                    >
                                        history
                                    </span>
                                    Ends in 5 days
                                </div>
                            </div>
                            <div className="pt-2 flex flex-wrap items-start justify-between gap-2">
                                <span className="max-w-full px-3 py-1 bg-primary/5 text-primary font-label-sm text-label-sm rounded">
                                    LEVEL: ADVANCED
                                </span>
                                <span className="min-w-0 text-right text-tertiary font-bold break-words">
                                    $10k Prize
                                </span>
                            </div>
                        </div>
                        {/* Comp Card 2 */}
                        <div
                            className="bg-surface-container-lowest dark:bg-slate-900/80 border border-outline-variant/30 dark:border-white/10 rounded-xl p-4 space-y-4 premium-card cursor-pointer group"
                            onClick={openOpportunity}
                        >
                            <div className="aspect-video rounded-lg overflow-hidden mb-4">
                                <img
                                    className="w-full h-full object-cover"
                                    data-alt="BizVantage Case Study"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXn10C98Y8WUzcNLWBVvJ22710pYfWPZ0AdwJnkvIzzrkRa7SjmiUkilVPYW1oiK4Ay94CQTAE0NXfvrvQ1ES-3iyitDyREyHfC70KWD_7_pt6i4p6iLUmLapJfW3QyXTfYv66FWPz2QXVOtb_-1E6Xq2ZxWaVcVWTZuTF9J3PPl1-05OI8e-Te2CMLQPBS91gPoxcPfvlOHji7ZgCnKJinWFcW43YJAc9F9-8zF3LC5xxItr7Sgurkz4D6WhyaY2YYeCNgPQOH1ve"
                                />
                            </div>
                            <div className="space-y-1">
                                <span className="font-label-sm text-label-sm uppercase text-secondary">
                                    Case Study
                                </span>
                                <div className="flex justify-between items-start">
                                    <h4 className="font-title-md text-title-md text-on-background dark:text-white leading-tight">
                                        BizVantage Case Study
                                    </h4>
                                    <span
                                        className="material-symbols-outlined text-outline dark:text-gray-400"
                                        data-icon="more_vert"
                                    >
                                        more_vert
                                    </span>
                                </div>
                            </div>
                            <div className="ev-fade-up ev-stagger-1 space-y-2">
                                <div className="flex items-center gap-2 text-outline dark:text-gray-400 font-label-sm">
                                    <span
                                        className="material-symbols-outlined text-[16px]"
                                        data-icon="school"
                                    >
                                        school
                                    </span>
                                    University Only
                                </div>
                                <div className="flex items-center gap-2 text-outline dark:text-gray-400 font-label-sm">
                                    <span
                                        className="material-symbols-outlined text-[16px]"
                                        data-icon="history"
                                    >
                                        history
                                    </span>
                                    Registration Open
                                </div>
                            </div>
                            <div className="pt-2 flex flex-wrap items-start justify-between gap-2">
                                <span className="max-w-full px-3 py-1 bg-primary/5 text-primary font-label-sm text-label-sm rounded">
                                    LEVEL: INTERMEDIATE
                                </span>
                                <span className="min-w-0 text-right text-tertiary font-bold break-words">
                                    Scholarship
                                </span>
                            </div>
                        </div>
                        {/* Comp Card 3 */}
                        <div
                            className="bg-surface-container-lowest dark:bg-slate-900/80 border border-outline-variant/30 dark:border-white/10 rounded-xl p-4 space-y-4 premium-card cursor-pointer group"
                            onClick={openOpportunity}
                        >
                            <div className="aspect-video rounded-lg overflow-hidden mb-4">
                                <img
                                    className="w-full h-full object-cover"
                                    data-alt="DesignSprint 2024"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3eL49qDKde8nJat8bbMD-e7iLAX5jUmYWEgqWWO3G4gKStDqZVQcvk-s0RAU_pzaZfmmGzBNiqJ0B90CztUFJsVgCQpiCiOIrzyZSob_6KdzfhMj191B5cm02XzBYKFUHVnYwHkgLcxET11ZEq7eZ3UN9W4lbYliTucyjKFvVY8yMqG-4JV5p3mAA1oYqsYiICSzmgCacyFAQ6SXYl7Fmm2s9yLl19UR4LVmrIGVCmPfepE7pwtjpwcBOapQEnDac5lnwZZ00ht5g"
                                />
                            </div>
                            <div className="space-y-1">
                                <span className="font-label-sm text-label-sm uppercase text-secondary">
                                    Design Sprint
                                </span>
                                <div className="flex justify-between items-start">
                                    <h4 className="font-title-md text-title-md text-on-background dark:text-white leading-tight">
                                        DesignSprint 2024
                                    </h4>
                                    <span
                                        className="material-symbols-outlined text-outline dark:text-gray-400"
                                        data-icon="more_vert"
                                    >
                                        more_vert
                                    </span>
                                </div>
                            </div>
                            <div className="ev-fade-up ev-stagger-1 space-y-2">
                                <div className="flex items-center gap-2 text-outline dark:text-gray-400 font-label-sm">
                                    <span
                                        className="material-symbols-outlined text-[16px]"
                                        data-icon="brush"
                                    >
                                        brush
                                    </span>
                                    UI/UX Designers
                                </div>
                                <div className="flex items-center gap-2 text-outline dark:text-gray-400 font-label-sm">
                                    <span
                                        className="material-symbols-outlined text-[16px]"
                                        data-icon="history"
                                    >
                                        history
                                    </span>
                                    Starts Tomorrow
                                </div>
                            </div>
                            <div className="pt-2 flex flex-wrap items-start justify-between gap-2">
                                <span className="max-w-full px-3 py-1 bg-primary/5 text-primary font-label-sm text-label-sm rounded">
                                    LEVEL: OPEN
                                </span>
                                <span className="min-w-0 text-right text-tertiary font-bold break-words">
                                    Mentorship
                                </span>
                            </div>
                        </div>
                        {/* Comp Card 4 */}
                        <div
                            className="bg-surface-container-lowest dark:bg-slate-900/80 border border-outline-variant/30 dark:border-white/10 rounded-xl p-4 space-y-4 premium-card cursor-pointer group"
                            onClick={openOpportunity}
                        >
                            <div className="aspect-video rounded-lg overflow-hidden mb-4">
                                <img
                                    className="w-full h-full object-cover"
                                    data-alt="RoboQuest Tech Challenge"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXjuV5CQGqc-ZmamRm8rBUtKL8uClHTygX0WXc3pOz_URa_gxCcG8AwYwcTdoFJJMwYHK-8yGqGa_we6rtmdJ-o-dlrTDebv3EOaalvLTX0AbshUPKUwZyYLGMzXshnisKSXxiIb3z5i5gXzLOxFzkZDGyp2eiai4-zFbHE6L5JTyXWjUxjY4-Gr7FYQmzegkgSeyQxjeA9O5cBo5ah87T3qI-xYuJRoP8DJnofGUr37XLhF-OcBMLzFhDfV99BeirnKTIQgJ4rqvS"
                                />
                            </div>
                            <div className="space-y-1">
                                <span className="font-label-sm text-label-sm uppercase text-secondary">
                                    Robotics
                                </span>
                                <div className="flex justify-between items-start">
                                    <h4 className="font-title-md text-title-md text-on-background dark:text-white leading-tight">
                                        RoboQuest Tech
                                    </h4>
                                    <span
                                        className="material-symbols-outlined text-outline dark:text-gray-400"
                                        data-icon="more_vert"
                                    >
                                        more_vert
                                    </span>
                                </div>
                            </div>
                            <div className="ev-fade-up ev-stagger-1 space-y-2">
                                <div className="flex items-center gap-2 text-outline dark:text-gray-400 font-label-sm">
                                    <span
                                        className="material-symbols-outlined text-[16px]"
                                        data-icon="precision_manufacturing"
                                    >
                                        precision_manufacturing
                                    </span>
                                    Hardware Devs
                                </div>
                                <div className="flex items-center gap-2 text-outline dark:text-gray-400 font-label-sm">
                                    <span
                                        className="material-symbols-outlined text-[16px]"
                                        data-icon="history"
                                    >
                                        history
                                    </span>
                                    Ends in 2 days
                                </div>
                            </div>
                            <div className="pt-2 flex flex-wrap items-start justify-between gap-2">
                                <span className="max-w-full px-3 py-1 bg-primary/5 text-primary font-label-sm text-label-sm rounded">
                                    LEVEL: ADVANCED
                                </span>
                                <span className="min-w-0 text-right text-tertiary font-bold break-words">
                                    $25k Grant
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Events Section */}
                <section className="space-y-8 home-section">
                    <div className="flex flex-col md:flex-row items-center justify-between border-b border-outline-variant/30 dark:border-white/10">
                        <div
                            className="flex gap-8 overflow-x-auto no-scrollbar min-w-0 w-full md:w-auto"
                            id="events-filter-group"
                            role="group"
                            aria-label="Filter events by category"
                        >
                            <button
                                type="button"
                                className="pb-4 font-label-md text-primary border-b-2 border-primary"
                                data-event-filter="all"
                                aria-pressed="true"
                            >
                                All
                            </button>
                            <button
                                type="button"
                                className="pb-4 font-label-md text-on-surface-variant dark:text-[#c3c6d7] hover:text-primary transition-colors"
                                data-event-filter="competition"
                                aria-pressed="false"
                            >
                                Competition
                            </button>
                            <button
                                type="button"
                                className="pb-4 font-label-md text-on-surface-variant dark:text-[#c3c6d7] hover:text-primary transition-colors"
                                data-event-filter="event"
                                aria-pressed="false"
                            >
                                Event
                            </button>
                            <button
                                type="button"
                                className="pb-4 font-label-md text-on-surface-variant dark:text-[#c3c6d7] hover:text-primary transition-colors"
                                data-event-filter="workshop"
                                aria-pressed="false"
                            >
                                Workshop
                            </button>
                            <button
                                type="button"
                                className="pb-4 font-label-md text-on-surface-variant dark:text-[#c3c6d7] hover:text-primary transition-colors"
                                data-event-filter="course"
                                aria-pressed="false"
                            >
                                Course
                            </button>
                        </div>
                    </div>
                    <div
                        className="grid grid-cols-1 md:grid-cols-12 gap-gutter"
                        id="events-grid"
                    >
                        {/* Large Featured Event */}
                        <div
                            className="md:col-span-8 bg-surface-container-lowest dark:bg-slate-900/60 border border-outline-variant/30 dark:border-white/10 rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row md:min-h-[22rem] premium-card cursor-pointer"
                            data-event-category="event"
                            onClick={openOpportunity}
                        >
                            <div className="md:w-1/2 overflow-hidden">
                                <img
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    data-alt="Featured Event"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4XGVVgdXcQZS5VeH1XemHRZule_sQgpM4yB8dp3TMxmIjOTnb7x77AU3_AQqluVNnUoBk5iOwilGg_Cj8LHOtQPsJVDcaa2kfvpwYLdBwATyhzxwNtAS856W4G73Ol2mDobe-pFocsYIgmXPkxxqQyS3aZpjC91TuFLwh-po8QIPiLvPOm1yFqZmmNUYFn-URTuNl5djEq9B_ex_XDVvWZZOaO1ql7f1IdMFa91gP9zwnDLnSsn8-06q6CYeqKkjDxqTjq8-BsmeU"
                                />
                            </div>
                            <div className="md:w-1/2 p-8 flex flex-col justify-between gap-4">
                                <div className="ev-fade-up ev-stagger-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 bg-primary/10 text-primary font-label-sm text-label-sm rounded">
                                            FEATURED
                                        </span>
                                        <span className="text-error font-label-sm text-label-sm">
                                            LIVE NOW
                                        </span>
                                    </div>
                                    <h3 className="font-headline-lg text-headline-lg text-on-background dark:text-white leading-tight">
                                        Global AI Summit 2024: The Future of Agents
                                    </h3>
                                    <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-gray-300 line-clamp-2">
                                        Join industry leaders from OpenAI, Google, and Meta for a
                                        three-day intensive summit on autonomous AI agents and their
                                        impact on global productivity.
                                    </p>
                                </div>
                                <div className="flex items-center justify-between pt-4">
                                    <div className="flex items-center -space-x-2">
                                        <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-surface-container-high flex items-center justify-center font-mono text-label-sm text-on-background dark:text-white">
                                            +1.2k
                                        </div>
                                        <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 overflow-hidden bg-primary-fixed" />
                                        <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 overflow-hidden bg-secondary-fixed" />
                                    </div>
                                    <button className="px-6 py-2 bg-primary text-on-primary rounded-lg font-label-md">
                                        Join Session
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Small Sidebar Event */}
                        <div className="md:col-span-4 space-y-gutter">
                            <div
                                className="bg-surface-container-lowest dark:bg-slate-900/60 border border-outline-variant/30 dark:border-white/10 rounded-xl p-6 flex gap-4 items-center cursor-pointer hover:border-primary/50 dark:hover:border-primary/50 transition-colors"
                                data-event-category="course"
                                onClick={openOpportunity}
                            >
                                <div className="w-16 h-16 rounded-xl bg-primary-container/20 dark:bg-primary-container/10 flex flex-col items-center justify-center text-primary">
                                    <span className="font-bold text-headline-lg-mobile">28</span>
                                    <span className="font-label-sm text-label-sm uppercase">OCT</span>
                                </div>
                                <div>
                                    <span className="font-label-sm text-label-sm uppercase text-primary">
                                        Course
                                    </span>
                                    <h4 className="font-title-md text-title-md text-on-background dark:text-white line-clamp-1">
                                        Product Strategy Course
                                    </h4>
                                    <p className="text-on-surface-variant dark:text-gray-300 text-body-sm">
                                        6-Week Certificate Program
                                    </p>
                                </div>
                            </div>
                            <div
                                className="bg-surface-container-lowest dark:bg-slate-900/60 border border-outline-variant/30 dark:border-white/10 rounded-xl p-6 flex gap-4 items-center cursor-pointer hover:border-primary/50 dark:hover:border-primary/50 transition-colors"
                                data-event-category="workshop"
                                onClick={openOpportunity}
                            >
                                <div className="w-16 h-16 rounded-xl bg-secondary-container/20 dark:bg-white/10 flex flex-col items-center justify-center text-secondary dark:text-white">
                                    <span className="font-bold text-headline-lg-mobile">02</span>
                                    <span className="font-label-sm text-label-sm uppercase">NOV</span>
                                </div>
                                <div>
                                    <span className="font-label-sm text-label-sm uppercase text-primary">
                                        Workshop
                                    </span>
                                    <h4 className="font-title-md text-title-md text-on-background dark:text-white line-clamp-1">
                                        Rust for Web Devs
                                    </h4>
                                    <p className="text-on-surface-variant dark:text-gray-300 text-body-sm">
                                        Interactive Workshop
                                    </p>
                                </div>
                            </div>
                            <div
                                className="bg-surface-container-lowest dark:bg-slate-900/60 border border-outline-variant/30 dark:border-white/10 rounded-xl p-6 flex gap-4 items-center cursor-pointer hover:border-primary/50 dark:hover:border-primary/50 transition-colors"
                                data-event-category="workshop"
                                onClick={openOpportunity}
                            >
                                <div className="w-16 h-16 rounded-xl bg-tertiary-container/20 dark:bg-white/10 flex flex-col items-center justify-center text-tertiary dark:text-gray-200">
                                    <span className="font-bold text-headline-lg-mobile">15</span>
                                    <span className="font-label-sm text-label-sm uppercase">NOV</span>
                                </div>
                                <div>
                                    <span className="font-label-sm text-label-sm uppercase text-primary">
                                        Workshop
                                    </span>
                                    <h4 className="font-title-md text-title-md text-on-background dark:text-white line-clamp-1">
                                        DevOps Masterclass
                                    </h4>
                                    <p className="text-on-surface-variant dark:text-gray-300 text-body-sm">
                                        Hands-on Cloud Lab
                                    </p>
                                </div>
                            </div>
                            <div
                                className="bg-surface-container-lowest dark:bg-slate-900/60 border border-outline-variant/30 dark:border-white/10 rounded-xl p-6 flex gap-4 items-center cursor-pointer hover:border-primary/50 dark:hover:border-primary/50 transition-colors"
                                data-event-category="competition"
                                onClick={openOpportunity}
                            >
                                <div className="w-16 h-16 rounded-xl bg-tertiary-container/20 dark:bg-white/10 flex flex-col items-center justify-center text-tertiary dark:text-gray-200">
                                    <span className="font-bold text-headline-lg-mobile">21</span>
                                    <span className="font-label-sm text-label-sm uppercase">NOV</span>
                                </div>
                                <div>
                                    <span className="font-label-sm text-label-sm uppercase text-primary">
                                        Competition
                                    </span>
                                    <h4 className="font-title-md text-title-md text-on-background dark:text-white line-clamp-1">
                                        CodeSprint Hackathon
                                    </h4>
                                    <p className="text-on-surface-variant dark:text-gray-300 text-body-sm">
                                        48-Hour Team Challenge
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
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
            {/* AI Assistant: Rafeeq UI */}
            <div className="fixed bottom-8 right-8 z-[60] flex flex-col items-end pointer-events-none">
                {/* AI Dialogue Popup */}
                <div
                    className={`mb-4 w-72 bg-white dark:bg-slate-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-outline-variant/50 dark:border-white/15 overflow-hidden pointer-events-auto ${isRafeeqOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-500`}
                    id="rafeeq-popup"
                    aria-hidden={!isRafeeqOpen}
                    inert={!isRafeeqOpen}
                >
                    <div className="rafeeq-gradient p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span
                                className="material-symbols-outlined text-white"
                                data-icon="smart_toy"
                            >
                                smart_toy
                            </span>
                            <span className="text-white font-bold font-label-md">Rafeeq AI</span>
                        </div>
                        <button
                            className="text-white/80 hover:text-white pointer-events-auto"
                            onClick={toggleRafeeq}
                            aria-label="Close"
                        >
                            <span className="material-symbols-outlined" data-icon="close">
                                close
                            </span>
                        </button>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-body-sm text-on-surface dark:text-white italic">
                                "I've found 3 new competitions matching your Python skills!"
                            </p>
                            <div className="voice-wave-container ml-2">
                                <span className="voice-bar" />
                                <span className="voice-bar" />
                                <span className="voice-bar" />
                                <span className="voice-bar" />
                                <span className="voice-bar" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button className="p-2 text-left bg-surface dark:bg-slate-800 hover:bg-surface-container dark:hover:bg-slate-700/80 rounded-lg border border-outline-variant/30 dark:border-white/10 transition-colors pointer-events-auto">
                                <span
                                    className="material-symbols-outlined text-primary text-[18px] block"
                                    data-icon="summarize"
                                >
                                    summarize
                                </span>
                                <span className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-300">
                                    Summarize
                                </span>
                            </button>
                            <button className="p-2 text-left bg-surface dark:bg-slate-800 hover:bg-surface-container dark:hover:bg-slate-700/80 rounded-lg border border-outline-variant/30 dark:border-white/10 transition-colors pointer-events-auto">
                                <span
                                    className="material-symbols-outlined text-secondary text-[18px] block"
                                    data-icon="menu_book"
                                >
                                    menu_book
                                </span>
                                <span className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-300">
                                    Explain
                                </span>
                            </button>
                            <button className="p-2 text-left bg-surface dark:bg-slate-800 hover:bg-surface-container dark:hover:bg-slate-700/80 rounded-lg border border-outline-variant/30 dark:border-white/10 transition-colors pointer-events-auto">
                                <span
                                    className="material-symbols-outlined text-tertiary text-[18px] block"
                                    data-icon="analytics"
                                >
                                    analytics
                                </span>
                                <span className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-300">
                                    Analyze
                                </span>
                            </button>
                            <button className="p-2 text-left bg-surface dark:bg-slate-800 hover:bg-surface-container dark:hover:bg-slate-700/80 rounded-lg border border-outline-variant/30 dark:border-white/10 transition-colors pointer-events-auto">
                                <span
                                    className="material-symbols-outlined text-primary-container text-[18px] block"
                                    data-icon="tips_and_updates"
                                >
                                    tips_and_updates
                                </span>
                                <span className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-300">
                                    Suggest
                                </span>
                            </button>
                        </div>
                        <a
                            className="block text-center w-full py-2 bg-primary/5 hover:bg-primary/10 dark:hover:bg-primary/20 text-primary rounded-lg font-label-md text-label-md transition-colors pointer-events-auto"
                            href="rafeeq.html"
                        >
                            Open full chat
                        </a>
                    </div>
                </div>
                {/* Floating Action Button */}
                <button
                    className="pointer-events-auto h-16 w-16 rafeeq-gradient rounded-full shadow-xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-secondary/30 relative animate-pulse-wave"
                    onClick={toggleRafeeq}
                    aria-label="Start voice input"
                >
                    <span className="material-symbols-outlined text-[32px]" data-icon="mic">
                        mic
                    </span>
                </button>
            </div>
            {/* Mobile Navigation (Suppressed on Desktop) */}
            <nav className="fixed bottom-0 w-full rounded-t-xl z-50 md:hidden flex justify-around items-center px-4 py-2 pb-safe bg-surface dark:bg-slate-900 border-t border-outline-variant/30 dark:border-white/10 shadow-[0_-4px_12px_rgba(59,130,246,0.08)]">
                <a
                    className="flex flex-col items-center justify-center text-secondary bg-secondary-container/20 rounded-xl px-3 py-1 transition-transform active:scale-90"
                    href="index.html"
                >
                    <span className="material-symbols-outlined" data-icon="home">
                        home
                    </span>
                    <span className="font-label-sm text-label-sm">Home</span>
                </a>
                <a
                    className="flex flex-col items-center justify-center text-on-surface-variant dark:text-gray-400 transition-transform active:scale-90"
                    href="explore.html"
                >
                    <span className="material-symbols-outlined" data-icon="emoji_events">
                        emoji_events
                    </span>
                    <span className="font-label-sm text-label-sm">Explore</span>
                </a>
                <a
                    className="flex flex-col items-center justify-center text-on-surface-variant dark:text-gray-400 transition-transform active:scale-90"
                    href="posts.html"
                >
                    <span className="material-symbols-outlined" data-icon="campaign">
                        campaign
                    </span>
                    <span className="font-label-sm text-label-sm">Posts</span>
                </a>
                <a
                    className="flex flex-col items-center justify-center text-on-surface-variant dark:text-gray-400 transition-transform active:scale-90"
                    href="rafeeq.html"
                >
                    <span className="material-symbols-outlined" data-icon="smart_toy">
                        smart_toy
                    </span>
                    <span className="font-label-sm text-label-sm">Rafeeq</span>
                </a>
                <a
                    className="flex flex-col items-center justify-center text-on-surface-variant dark:text-gray-400 transition-transform active:scale-90"
                    href="profile.html"
                >
                    <span className="material-symbols-outlined" data-icon="person">
                        person
                    </span>
                    <span className="font-label-sm text-label-sm">Profile</span>
                </a>
            </nav>
        </>
    )
}
