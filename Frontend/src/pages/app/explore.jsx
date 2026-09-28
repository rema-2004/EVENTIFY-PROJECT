import { useNavigate } from 'react-router-dom'

export default function Explore() {
    const navigate = useNavigate()
    const openOpportunity = () => navigate('/app/opportunity')
    return (
        <>
            <meta charSet="utf-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <title>Explore | EVENTIFY</title>
            <meta
                name="description"
                content="Explore on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
            />
            <meta property="og:title" content="Explore | EVENTIFY" />
            <meta
                property="og:description"
                content="Explore on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
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
            <style
                dangerouslySetInnerHTML={{
                    __html:
                        "\n    .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; vertical-align: middle; }\n    .tab-active { background: #FF4D2E; color: #fff; }\n    .chip-active { background: #FF4D2E; color: #fff; }\n    .save-btn { transform: scale(1); }\n    .save-btn.save-pop { animation: save-pop .45s ease; }\n    @keyframes save-pop {\n        0% { transform: scale(1); }\n        35% { transform: scale(1.35); }\n        60% { transform: scale(0.9); }\n        100% { transform: scale(1); }\n    }\n    .save-confirm {\n        position: absolute;\n        top: 6px;\n        left: 48px;\n        background: #FF4D2E;\n        color: #fff;\n        font-size: 11px;\n        font-weight: 700;\n        padding: 4px 10px;\n        border-radius: 999px;\n        white-space: nowrap;\n        opacity: 0;\n        pointer-events: none;\n        z-index: 20;\n        display: flex;\n        align-items: center;\n        gap: 4px;\n    }\n    .save-confirm.show { animation: save-confirm-fade 1.6s ease forwards; }\n    @keyframes save-confirm-fade {\n        0% { opacity: 0; transform: translateY(-4px); }\n        15% { opacity: 1; transform: translateY(0); }\n        80% { opacity: 1; transform: translateY(0); }\n        100% { opacity: 0; transform: translateY(-4px); }\n    }\n"
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
                                className="font-label-md text-label-md text-primary font-bold border-b-2 border-primary pb-1 transition-all"
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
                            aria-label="Switch theme"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                dark_mode
                            </span>
                        </button>
                        <a
                            className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/5 hover:bg-primary/10 rounded-lg text-primary dark:text-primary dark:hover:bg-primary/10 font-label-md transition-all"
                            href="rafeeq.html"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                smart_toy
                            </span>{" "}
                            Rafeeq AI
                        </a>
                        <a
                            className="h-10 w-10 rounded-full overflow-hidden border-2 border-primary-container block"
                            href="profile.html"
                            aria-label="Open profile"
                        >
                            <img
                                className="w-full h-full object-cover"
                                data-alt="Profile headshot"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaUW4ycO4zpbXU8-f7qQ8e67JQFR0kFopGobvmcyuwtb7RmtLjv8uPEEmSl-hbsk0Uo2ApZUUq0wRlZ_zn8PJ4ugNgbj5OOGiU0BEkvvm8agYRwod83fIHy3htoOWJsIvO4ldpAhRTz0oyAMispIOZSiEf-bq73m7QKJeH-ZAfVM4q8r4pOddVVra4gOVTwYxIXtrSAQ5_f0WzHxDTzUUNzi4IEbgzPPqIh4aHvXgk12witr7-3N8pVFOo07Rs0y08Ht-8bubrd2i-"
                            />
                        </a>
                    </div>
                </div>
            </nav>
            <main className="pt-24 pb-12 px-container-margin-mobile md:px-container-margin-desktop max-w-[1280px] mx-auto space-y-10">
                {/* Header & Search */}
                <div className="ev-fade-up ev-stagger-1 space-y-6">
                    <div>
                        <h1 className="font-headline-lg text-headline-lg">
                            Explore Opportunities
                        </h1>
                        <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
                            Browse every competition, event, workshop, and course — matched to you
                            by AI.
                        </p>
                    </div>
                    <div className="w-full relative">
                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline">
                            search
                        </span>
                        <input
                            className="w-full pl-14 pr-4 py-4 bg-surface border border-outline-variant shadow-sm rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body-md text-body-md"
                            id="search-input"
                            placeholder="Search opportunities, skills, or keywords..."
                            type="text"
                        />
                    </div>
                    {/* Category Tabs */}
                    <div className="flex gap-3 overflow-x-auto pb-1" id="category-tabs">
                        <button
                            className="tab-active px-5 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors"
                            data-cat="all"
                        >
                            All
                        </button>
                        <button
                            className="bg-surface-container text-on-surface-variant px-5 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors hover:bg-primary-container/20"
                            data-cat="competition"
                        >
                            Competitions
                        </button>
                        <button
                            className="bg-surface-container text-on-surface-variant px-5 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors hover:bg-primary-container/20"
                            data-cat="event"
                        >
                            Events
                        </button>
                        <button
                            className="bg-surface-container text-on-surface-variant px-5 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors hover:bg-primary-container/20"
                            data-cat="workshop"
                        >
                            Workshops
                        </button>
                        <button
                            className="bg-surface-container text-on-surface-variant px-5 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors hover:bg-primary-container/20"
                            data-cat="course"
                        >
                            Courses
                        </button>
                    </div>
                    <p
                        className="font-body-sm text-body-sm text-on-surface-variant"
                        id="results-status"
                        aria-live="polite"
                    />
                </div>
                {/* Results Grid */}
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter"
                    id="results-grid"
                >
                    {/* Card 1 */}
                    <div
                        className="ev-card spotlight ev-fade-up ev-stagger-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm group cursor-pointer"
                        data-cat="competition"
                        onClick={openOpportunity}
                    >
                        <div className="h-40 relative overflow-hidden">
                            <img
                                className="ev-card-img w-full h-full object-cover"
                                data-alt="Digital art of a global coding hackathon with glowing blue circuit lines over a futuristic city skyline."
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9CEnFNI0sa64wtdt1xcbuCO2ctuePljYf3b0mGoAfsaVbTQZl6EUEKGeq_A-lCje6-84UGOy-xM_EX1fj34sF-YWMO-_0SG4_iedT1vjYrRw5UpEFxOlngZ_cDhCxJRFxyyChSuzfbQzaifbDrY-ySQm0SZNqdXFNpNdzVSiaboP2NAJ4pYTV-P32G1lYqug8kLksnCytiGNYKiUHGIacjDYyZIZ5HHucNTeyCLWQmzn3HRdmrm8n18EIgGN0AobDjfqjTG3DQkjK"
                            />
                            <div className="absolute top-3 right-3 px-3 py-1 bg-secondary text-white rounded-lg font-label-sm flex items-center gap-1 shadow-lg">
                                <span className="material-symbols-outlined text-[14px]">bolt</span>{" "}
                                98%
                            </div>
                            <button
                                className="save-btn absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-on-surface-variant hover:text-primary shadow-lg transition-colors"
                                data-ui-action="save"
                                data-ui-key="global-ai-innovation-challenge"
                                aria-label="Save for later"
                                onClick={(event) => event.stopPropagation()}
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    bookmark
                                </span>
                            </button>
                        </div>
                        <div className="p-5 space-y-2">
                            <span className="font-label-sm text-label-sm uppercase text-secondary">
                                HACKATHON
                            </span>
                            <h3 className="font-title-md text-title-md line-clamp-1">
                                Global AI Innovation Challenge
                            </h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                By TechGenius Labs · Remote
                            </p>
                        </div>
                    </div>
                    {/* Card 2 */}
                    <div
                        className="ev-card spotlight ev-fade-up ev-stagger-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm group cursor-pointer"
                        data-cat="workshop"
                        onClick={openOpportunity}
                    >
                        <div className="h-40 relative overflow-hidden">
                            <img
                                className="ev-card-img w-full h-full object-cover"
                                data-alt="A minimalist classroom with glass boards filled with neural network diagrams."
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcUXLF60F3KbDnIVZepTTte_yzkhe3rkuMtXTXTMQzA1gyVuzXN1NQ0DXC7XHQBDIHEA2TXLK8EoSvioCS5PoWNoZKnVI7YeLCAxqcRtKE-cfSsrD6X3yBiiGI_J0DdnCu4vgHVOf7tn5UW93gDceqUiZ4hVu5ZCvSuDbEd3Dm8uTINHyELfvrJM4AvcW6lRAm2zAmGTlp9N7rNMUMizYToAN1_rTfY1KtEjsmeIx--zlkOzEz07DRgirbjC8bnSBfxNFTTtVBYuqf"
                            />
                            <div className="absolute top-3 right-3 px-3 py-1 bg-secondary text-white rounded-lg font-label-sm flex items-center gap-1 shadow-lg">
                                <span className="material-symbols-outlined text-[14px]">bolt</span>{" "}
                                95%
                            </div>
                            <button
                                className="save-btn absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-on-surface-variant hover:text-primary shadow-lg transition-colors"
                                data-ui-action="save"
                                data-ui-key="deep-learning-mastery"
                                aria-label="Save for later"
                                onClick={(event) => event.stopPropagation()}
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    bookmark
                                </span>
                            </button>
                        </div>
                        <div className="p-5 space-y-2">
                            <span className="font-label-sm text-label-sm uppercase text-primary">
                                WORKSHOP
                            </span>
                            <h3 className="font-title-md text-title-md line-clamp-1">
                                Deep Learning Mastery
                            </h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                University of Technology · Hybrid
                            </p>
                        </div>
                    </div>
                    {/* Card 3 */}
                    <div
                        className="ev-card spotlight ev-fade-up ev-stagger-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm group cursor-pointer"
                        data-cat="competition"
                        onClick={openOpportunity}
                    >
                        <div className="h-40 relative overflow-hidden">
                            <img
                                className="ev-card-img w-full h-full object-cover"
                                data-alt="Abstract geometric 3D shapes representing code blocks in emerald green and blue."
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoXFluzheWmZ490MELdToAMEYpR_txVKV30osgae_hCJtZOTitQ7q-hlRINJEb6yu8WczfucSzRFeg7_ASopSg4PYi40bcSgLBAzpyDWcgZltV0lVaadKj9Hxg_0-MIvEynOlpWfO6oad4LDePXnQqUogQYAUOomnsxNQRm0sYppi6tcEF-XVtGAmZwLlJ7Zzvf2ojEvEnU0EwWkAE_qpAYRfUYUWLDeKx1nnQtM-6DxX8uCm13GfTKpd5tCt-XHKS5s04qO3jTwFA"
                            />
                            <div className="absolute top-3 right-3 px-3 py-1 bg-secondary text-white rounded-lg font-label-sm flex items-center gap-1 shadow-lg">
                                <span className="material-symbols-outlined text-[14px]">bolt</span>{" "}
                                92%
                            </div>
                            <button
                                className="save-btn absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-on-surface-variant hover:text-primary shadow-lg transition-colors"
                                data-ui-action="save"
                                data-ui-key="frontend-wizards-2024"
                                aria-label="Save for later"
                                onClick={(event) => event.stopPropagation()}
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    bookmark
                                </span>
                            </button>
                        </div>
                        <div className="p-5 space-y-2">
                            <span className="font-label-sm text-label-sm uppercase text-secondary">
                                COMPETITION
                            </span>
                            <h3 className="font-title-md text-title-md line-clamp-1">
                                Frontend Wizards 2024
                            </h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                DevCommunity Hub · London, UK
                            </p>
                        </div>
                    </div>
                    {/* Card 4 */}
                    <div
                        className="ev-card spotlight ev-fade-up ev-stagger-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm group cursor-pointer"
                        data-cat="competition"
                        onClick={openOpportunity}
                    >
                        <div className="h-40 relative overflow-hidden">
                            <img
                                className="ev-card-img w-full h-full object-cover"
                                data-alt="A digital render of a cybersecurity challenge with neon green grid lines on a dark background."
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv-V-8GjFWlxuhqQq9nPPBCQKNIYRDy0-x7U8GZDqCxf3lpcSiGNgXTpm9Dp9vtBNtYRJM9-o_XfAV_yWpqjCDBHhA3Xin8gTKbYsCIpYqce02UMEzafn25IYfHI6hd-IasfwMRqIx3qADrfqnj7m-D_PHpWiW6GRyb70Zw9C6yT7Xu6xsRz80sxxnJdXORtOzWdcpjojOlvDh2cdJULC_KUcENGeijXkCPjAA02-axN9qR_MrffMvhq-xjwZhj4cy_sT0Lsf7llBS"
                            />
                            <div className="absolute top-3 right-3 px-3 py-1 bg-secondary text-white rounded-lg font-label-sm flex items-center gap-1 shadow-lg">
                                <span className="material-symbols-outlined text-[14px]">bolt</span>{" "}
                                88%
                            </div>
                            <button
                                className="save-btn absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-on-surface-variant hover:text-primary shadow-lg transition-colors"
                                data-ui-action="save"
                                data-ui-key="cyber-sentinel-ctf"
                                aria-label="Save for later"
                                onClick={(event) => event.stopPropagation()}
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    bookmark
                                </span>
                            </button>
                        </div>
                        <div className="p-5 space-y-2">
                            <span className="font-label-sm text-label-sm uppercase text-secondary">
                                COMPETITION
                            </span>
                            <h3 className="font-title-md text-title-md line-clamp-1">
                                Cyber Sentinel CTF
                            </h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                Teams of 2-4 · $10k Prize
                            </p>
                        </div>
                    </div>
                    {/* Card 5 */}
                    <div
                        className="ev-card spotlight ev-fade-up ev-stagger-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm group cursor-pointer"
                        data-cat="event"
                        onClick={openOpportunity}
                    >
                        <div className="h-40 relative overflow-hidden">
                            <img
                                className="ev-card-img w-full h-full object-cover"
                                data-alt="A high-tech conference hall with a stage displaying a blue and purple digital landscape."
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4XGVVgdXcQZS5VeH1XemHRZule_sQgpM4yB8dp3TMxmIjOTnb7x77AU3_AQqluVNnUoBk5iOwilGg_Cj8LHOtQPsJVDcaa2kfvpwYLdBwATyhzxwNtAS856W4G73Ol2mDobe-pFocsYIgmXPkxxqQyS3aZpjC91TuFLwh-po8QIPiLvPOm1yFqZmmNUYFn-URTuNl5djEq9B_ex_XDVvWZZOaO1ql7f1IdMFa91gP9zwnDLnSsn8-06q6CYeqKkjDxqTjq8-BsmeU"
                            />
                            <div className="absolute top-3 right-3 px-3 py-1 bg-secondary text-white rounded-lg font-label-sm flex items-center gap-1 shadow-lg">
                                <span className="material-symbols-outlined text-[14px]">bolt</span>{" "}
                                85%
                            </div>
                            <button
                                className="save-btn absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-on-surface-variant hover:text-primary shadow-lg transition-colors"
                                data-ui-action="save"
                                data-ui-key="global-ai-summit-2024"
                                aria-label="Save for later"
                                onClick={(event) => event.stopPropagation()}
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    bookmark
                                </span>
                            </button>
                        </div>
                        <div className="p-5 space-y-2">
                            <span className="font-label-sm text-label-sm uppercase text-primary">
                                EVENT · LIVE
                            </span>
                            <h3 className="font-title-md text-title-md line-clamp-1">
                                Global AI Summit 2024
                            </h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                The Future of Agents
                            </p>
                        </div>
                    </div>
                    {/* Card 6 */}
                    <div
                        className="ev-card spotlight ev-fade-up ev-stagger-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm group cursor-pointer"
                        data-cat="course"
                        onClick={openOpportunity}
                    >
                        <div className="h-40 relative overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-5xl">
                                school
                            </span>
                            <div className="absolute top-3 right-3 px-3 py-1 bg-secondary text-white rounded-lg font-label-sm flex items-center gap-1 shadow-lg">
                                <span className="material-symbols-outlined text-[14px]">bolt</span>{" "}
                                79%
                            </div>
                            <button
                                className="save-btn absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-on-surface-variant hover:text-primary shadow-lg transition-colors"
                                data-ui-action="save"
                                data-ui-key="product-strategy-course"
                                aria-label="Save for later"
                                onClick={(event) => event.stopPropagation()}
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    bookmark
                                </span>
                            </button>
                        </div>
                        <div className="p-5 space-y-2">
                            <span className="font-label-sm text-label-sm uppercase text-tertiary">
                                COURSE
                            </span>
                            <h3 className="font-title-md text-title-md line-clamp-1">
                                Product Strategy Course
                            </h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                6-Week Certificate Program
                            </p>
                        </div>
                    </div>
                    {/* Card 7 */}
                    <div
                        className="ev-card spotlight ev-fade-up ev-stagger-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm group cursor-pointer"
                        data-cat="workshop"
                        onClick={openOpportunity}
                    >
                        <div className="h-40 relative overflow-hidden bg-gradient-to-br from-secondary/20 to-primary/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-secondary text-5xl">
                                terminal
                            </span>
                            <div className="absolute top-3 right-3 px-3 py-1 bg-secondary text-white rounded-lg font-label-sm flex items-center gap-1 shadow-lg">
                                <span className="material-symbols-outlined text-[14px]">bolt</span>{" "}
                                91%
                            </div>
                            <button
                                className="save-btn absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-on-surface-variant hover:text-primary shadow-lg transition-colors"
                                data-ui-action="save"
                                data-ui-key="rust-for-web-devs"
                                aria-label="Save for later"
                                onClick={(event) => event.stopPropagation()}
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    bookmark
                                </span>
                            </button>
                        </div>
                        <div className="p-5 space-y-2">
                            <span className="font-label-sm text-label-sm uppercase text-primary">
                                WORKSHOP
                            </span>
                            <h3 className="font-title-md text-title-md line-clamp-1">
                                Rust for Web Devs
                            </h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                Interactive Workshop
                            </p>
                        </div>
                    </div>
                    {/* Card 8 */}
                    <div
                        className="ev-card spotlight ev-fade-up ev-stagger-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm group cursor-pointer"
                        data-cat="course"
                        onClick={openOpportunity}
                    >
                        <div className="h-40 relative overflow-hidden bg-gradient-to-br from-tertiary/20 to-primary/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-tertiary text-5xl">
                                cloud
                            </span>
                            <div className="absolute top-3 right-3 px-3 py-1 bg-secondary text-white rounded-lg font-label-sm flex items-center gap-1 shadow-lg">
                                <span className="material-symbols-outlined text-[14px]">bolt</span>{" "}
                                74%
                            </div>
                            <button
                                className="save-btn absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-on-surface-variant hover:text-primary shadow-lg transition-colors"
                                data-ui-action="save"
                                data-ui-key="devops-masterclass"
                                aria-label="Save for later"
                                onClick={(event) => event.stopPropagation()}
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    bookmark
                                </span>
                            </button>
                        </div>
                        <div className="p-5 space-y-2">
                            <span className="font-label-sm text-label-sm uppercase text-tertiary">
                                COURSE
                            </span>
                            <h3 className="font-title-md text-title-md line-clamp-1">
                                DevOps Masterclass
                            </h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                Hands-on Cloud Lab
                            </p>
                        </div>
                    </div>
                </div>
                <div
                    className="hidden rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-8 text-center"
                    id="empty-state"
                    role="status"
                >
                    <span className="material-symbols-outlined text-4xl text-outline">
                        search_off
                    </span>
                    <h2 className="font-title-md text-title-md mt-3">
                        No opportunities found
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        Try a different keyword or category.
                    </p>
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
                    className="flex flex-col items-center justify-center text-secondary bg-secondary-container/20 rounded-xl px-3 py-1 transition-transform active:scale-90"
                    href="explore.html"
                >
                    <span className="material-symbols-outlined">explore</span>
                    <span className="font-label-sm text-label-sm">Explore</span>
                </a>
                <a
                    className="flex flex-col items-center justify-center text-on-surface-variant transition-transform active:scale-90"
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
