export default function Teams() {
    return (
        <>
            <meta charSet="utf-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <title>Eventify - Available Teams</title>
            <meta
                name="description"
                content="Eventify - Available Teams on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
            />
            <meta property="og:title" content="Eventify - Available Teams" />
            <meta
                property="og:description"
                content="Eventify - Available Teams on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
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
            {/* Google Fonts */}
            {/* Material Symbols */}
            {/* Tailwind CSS */}
            <style
                dangerouslySetInnerHTML={{
                    __html:
                        "\n        .glass-header {\n            background: rgba(250, 248, 255, 0.8);\n            backdrop-filter: blur(12px);\n        }\n        .card-lift {\n            transition: transform 0.2s ease, box-shadow 0.2s ease;\n        }\n        .card-lift:hover {\n            transform: translateY(-4px);\n            box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.08);\n        }\n        .ai-border {\n            position: relative;\n            background: #fff;\n            padding: 1px;\n            border-radius: 1.05rem;\n            background-clip: padding-box;\n            border: 1px solid transparent;\n        }\n        .ai-border::before {\n            content: '';\n            position: absolute;\n            top: 0; right: 0; bottom: 0; left: 0;\n            z-index: -1;\n            margin: -1px;\n            border-radius: inherit;\n            background: linear-gradient(135deg, #FF4D2E, #8455ef);\n        }\n        .material-symbols-outlined {\n            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n            vertical-align: middle;\n        }\n    "
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
                        href="participation-type.html"
                        aria-label="Close"
                    >
                        <span className="material-symbols-outlined text-on-surface-variant">
                            close
                        </span>
                    </a>
                </div>
            </header>
            <div className="min-h-screen">
                {/* Main Content Canvas */}
                <main className="w-full max-w-7xl mx-auto px-4 md:px-12 py-8 pb-32 md:pb-8">
                    {/* Header & Step Indicator */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 ev-fade-up ev-stagger-1">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-label-sm font-label-sm rounded-full">
                                    Competition Live
                                </span>
                                <span className="text-on-surface-variant text-label-md font-label-md">
                                    Step 2 of 3
                                </span>
                            </div>
                            <h2 className="font-headline-lg text-headline-lg leading-tight">
                                Available Teams for This Competition
                            </h2>
                        </div>
                        <a
                            className="bg-primary text-on-primary px-8 py-3 rounded-full font-label-md text-label-md shadow-lg flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all"
                            href="create-team.html"
                        >
                            <span className="material-symbols-outlined" data-icon="add">
                                add
                            </span>
                            Create New Team
                        </a>
                    </div>
                    {/* Search & Filters */}
                    <div className="flex flex-col gap-6 mb-12 ev-fade-up ev-stagger-2">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <span
                                    className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline"
                                    data-icon="search"
                                >
                                    search
                                </span>
                                <input
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-body-md"
                                    placeholder="Search by team name or project idea..."
                                    type="text"
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                                <button className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-high transition-all text-label-md font-label-md whitespace-nowrap">
                                    <span
                                        className="material-symbols-outlined text-primary"
                                        data-icon="filter_list"
                                    >
                                        filter_list
                                    </span>
                                    All Skills
                                </button>
                                <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-secondary-container text-on-secondary-container text-label-md font-label-md whitespace-nowrap shadow-sm">
                                    Python
                                </button>
                                <button className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-high transition-all text-label-md font-label-md whitespace-nowrap">
                                    UI/UX
                                </button>
                                <button className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-high transition-all text-label-md font-label-md whitespace-nowrap">
                                    AI
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Team Grid (Bento Style/Asymmetric) */}
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ev-fade-up ev-stagger-3"
                        data-empty-when-empty=""
                        data-empty-icon="group"
                        data-empty-title="You are not in a team yet"
                        data-empty-body="Create a team or join one whose skills complete yours, then apply together in one submission."
                        data-empty-action="Create a team"
                        data-empty-href="create-team.html"
                    >
                        {/* Card 1: Featured/AI Recommended */}
                        <div className="ai-border md:col-span-2 lg:col-span-2">
                            <div className="p-8 h-full flex flex-col md:flex-row gap-8 bg-white rounded-2xl">
                                <div className="flex-shrink-0">
                                    <div className="w-32 h-32 rounded-3xl bg-primary-fixed flex items-center justify-center overflow-hidden">
                                        <img
                                            className="w-full h-full object-cover"
                                            data-alt="A futuristic, minimalist geometric logo for a tech team named NeuroNex. The logo consists of clean white lines on a deep electric blue background, suggesting neural networks and high-end AI research. The aesthetic is sophisticated, corporate, and modern, fitting a high-end SaaS platform."
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuABqnU1m7CfKkx7tOe81VT8yI0CFQm_2I7ZvpiTA4DumdAIgiS7XqO1U1aUBmSJn9g-NpN98ovqEo04AuH_D-qniLjNQWt9sOdvi76vb-8vbD3tS51NdfOgpmRw4hnGvopwUuBYsMVG2x8GRwRB7LWMquyr0bg4iPTcxWbeskgEmhobXCr8gH29lOwfCBNUUeZt-BH7j1mq56twFAxdfMzvHXhoUhhGOEJpD_Np1tJJH1MgQj1tNf0KAjLucTaGNeAAKQI8ikEoTDM4"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                        <div>
                                            <h3 className="text-title-lg font-title-lg mb-1">NeuroNex</h3>
                                            <p className="text-on-surface-variant flex items-center gap-1 text-label-md font-label-md">
                                                <span
                                                    className="material-symbols-outlined text-primary text-lg"
                                                    data-icon="stars"
                                                    style={{ fontVariationSettings: '"FILL" 1' }}
                                                >
                                                    stars
                                                </span>
                                                Leader: Dr. Aris Thorne
                                            </p>
                                        </div>
                                        <span className="bg-success-container px-4 py-1.5 rounded-full border border-primary text-primary text-label-sm font-label-sm uppercase tracking-wider flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                            Recruiting
                                        </span>
                                    </div>
                                    <p className="text-body-md text-on-surface-variant mb-6 line-clamp-2">
                                        Building a decentralized LLM orchestrator for sustainable edge
                                        computing. We need visionary thinkers.
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        <span className="bg-surface-container-high px-3 py-1 rounded-lg text-label-sm font-label-sm">
                                            Python
                                        </span>
                                        <span className="bg-surface-container-high px-3 py-1 rounded-lg text-label-sm font-label-sm">
                                            PyTorch
                                        </span>
                                        <span className="bg-surface-container-high px-3 py-1 rounded-lg text-label-sm font-label-sm">
                                            UI/UX
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-between gap-3 mt-auto">
                                        <div className="flex items-center gap-3">
                                            <div className="flex -space-x-3">
                                                <img
                                                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                                    data-alt="A professional headshot of a diverse male developer in a brightly lit, modern office space. Soft cinematic lighting with a neutral gray background. High-end professional photography style."
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhT6Su_LJr5bDu0t_rxToc1xk8wOTZWIoQB6wS1IThyVSFhWbROhg737J79LKV-Pmc-HtsjSYdTXHbb4Yh28Vux1q1cNcpRWxovJwLO0dldJmvPXVvMd6MSUPozJbhRiwGE_RxBnhoUVj30gyMuEm4F3_b8A5v9t_FPdyVddIKf4jSzLapoE2w8Z0gQJWosGSj_UCh0xjYGLuURk35QhnQN08ua5G3699BYrDOGxYAQvKKPR9yIluBtX0j9tc3rBqY2e4E4lmjm1xA"
                                                />
                                                <img
                                                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                                    data-alt="A professional headshot of a confident female UI designer with a warm expression. Bright, airy daylighting in a minimalist studio environment. Clean, modern aesthetic."
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuSV1bfBO_FrWx-qTQa2gLqBTYHIDLSZpFqAFmpBQX9kmamCr_nm57FIoYWEWtRKsl9wZlUDb4TlVTaKTM4y0l-OBR-5ZJs4_Ib1fHcbDOZTlXodi3Crl9DEXFAW8nPbGeakm7igqp-uZCmK2egYkUjmB5Jiwrdo6nsZi8DHv6AU9OZkWO3p-IKjfDjB_WBUEirWkbfmS_waug6wi6YksChigukYcMs2PPfI273T7tV5KxAstCD59VP7h83fiSbvL_USnlLoKcpAz2"
                                                />
                                                <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-container-highest flex items-center justify-center text-label-sm">
                                                    +1
                                                </div>
                                            </div>
                                            <span className="text-label-md font-label-md text-on-surface-variant">
                                                3/5 Members
                                            </span>
                                        </div>
                                        <div className="flex gap-3">
                                            <a
                                                className="px-6 py-2.5 rounded-full border border-outline-variant font-label-md text-label-md hover:bg-surface-container transition-all text-center"
                                                href="team-dashboard.html"
                                            >
                                                View Details
                                            </a>
                                            <a
                                                className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:brightness-110 active:scale-95 transition-all text-center"
                                                href="team-dashboard.html"
                                            >
                                                Request to Join
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Card 2 */}
                        <div className="bg-white p-6 rounded-2xl border border-outline-variant card-lift flex flex-col h-full">
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-secondary-fixed flex items-center justify-center overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover"
                                        data-alt="A minimalist logo for a software team called CloudScale. A stylized cloud formed from sharp, modern geometric polygons in shades of purple and slate. Minimalist professional look for a tech environment."
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqCYVrg0hwpqru5Fe9bAcf3hFI_HcymhazDgPmLMdQtxbpkY9eHL3TnCI0B3dMEunM0pQyLAS5lrN2DgFvg8q98c0KEMC7H9TQNXVEHZBMjPY1Mxwhz9qdGgQo5jSTZWlNCr9HLa3BkWZT5L9vIyP9OmJNH3l76N7kVsdk_8ASVSzY6E8jckg6VzjXLtFklmpYRCvWrRQbC1aIqgGR3xJpWw9q-h6T-PbFekofMk12kas89Dh14E8vCqerj_uz9csAkaDHzyGva6J-"
                                    />
                                </div>
                                <span className="bg-surface-container px-3 py-1 rounded-full text-primary text-label-sm font-mono flex items-center gap-1">
                                    <span
                                        className="material-symbols-outlined text-sm"
                                        data-icon="groups"
                                    >
                                        groups
                                    </span>
                                    4/5
                                </span>
                            </div>
                            <h3 className="text-title-md font-title-md mb-1">CloudScale</h3>
                            <p className="text-on-surface-variant text-label-md font-label-md mb-4">
                                Leader: Sarah Jenkins
                            </p>
                            <p className="text-body-md text-on-surface-variant mb-6 flex-grow">
                                Optimizing serverless architectures for heavy traffic spikes.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-8">
                                <span className="bg-surface-container px-3 py-1 rounded-lg text-label-sm font-label-sm">
                                    AWS
                                </span>
                                <span className="bg-surface-container px-3 py-1 rounded-lg text-label-sm font-label-sm">
                                    Node.js
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mt-auto">
                                <a
                                    className="py-2.5 rounded-xl border border-outline-variant font-label-md text-label-md hover:bg-surface-container transition-all text-center"
                                    href="team-dashboard.html"
                                >
                                    View
                                </a>
                                <a
                                    className="py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:brightness-110 active:scale-95 transition-all text-center"
                                    href="team-dashboard.html"
                                >
                                    Join
                                </a>
                            </div>
                        </div>
                        {/* Card 3 */}
                        <div className="bg-white p-6 rounded-2xl border border-outline-variant card-lift flex flex-col h-full">
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-tertiary-fixed-dim flex items-center justify-center overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover"
                                        data-alt="An abstract, modern logo for a design-led team called PixelPerfect. A single vibrant purple pixel breaking away from a clean grid, symbolizing innovation. High-end, premium tech aesthetic."
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxSqoiKhKuMhzosASWGg81635Ybgh4kl_FC3b3ssNURpqcZT0fH2Kk4mj86YC5NzjdfAg9LQfigAVcy5WPTKFO1fUX1h_ioelRwNBrwpS6wIZ76_fi1UIp3PKrmdl6gJG7ihBL_LnFZYMoFnSrTRW0jG_Kvj8LSS0HeLmYA2liTwMvufy9s0OPKUIJOLeEjnT3LsnMNqJ9yp68jjnSrBMZfnSMs-GPXDhmQzrLD9vYjuXLgOOSSE0GMYevawgA6wRU0Cz4eW1xk6bT"
                                    />
                                </div>
                                <span className="bg-surface-container px-3 py-1 rounded-full text-primary text-label-sm font-mono flex items-center gap-1">
                                    <span
                                        className="material-symbols-outlined text-sm"
                                        data-icon="groups"
                                    >
                                        groups
                                    </span>
                                    2/5
                                </span>
                            </div>
                            <h3 className="text-title-md font-title-md mb-1">PixelPerfect</h3>
                            <p className="text-on-surface-variant text-label-md font-label-md mb-4">
                                Leader: Marcus Lee
                            </p>
                            <p className="text-body-md text-on-surface-variant mb-6 flex-grow">
                                Designing the next generation of social interaction through spatial
                                web.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-8">
                                <span className="bg-surface-container px-3 py-1 rounded-lg text-label-sm font-label-sm">
                                    UI/UX
                                </span>
                                <span className="bg-surface-container px-3 py-1 rounded-lg text-label-sm font-label-sm">
                                    Three.js
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mt-auto">
                                <a
                                    className="py-2.5 rounded-xl border border-outline-variant font-label-md text-label-md hover:bg-surface-container transition-all text-center"
                                    href="team-dashboard.html"
                                >
                                    View
                                </a>
                                <a
                                    className="py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:brightness-110 active:scale-95 transition-all text-center"
                                    href="team-dashboard.html"
                                >
                                    Join
                                </a>
                            </div>
                        </div>
                        {/* Card 4 */}
                        <div className="bg-white p-6 rounded-2xl border border-outline-variant card-lift flex flex-col h-full">
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-surface-container-highest flex items-center justify-center overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover"
                                        data-alt="A clean, bold typography-based logo for a team named DataStream. The letters are intertwined with a digital flow graphic in vibrant orange and deep blue. Professional and energetic look."
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQOtjzK7bS-lnWwGCqf2XFj_M89deQV3ailE42kVi-oPOnYyeqiwEMIkEeDJ-bb_Am0rYDwkGHKDmpHm0yDIvmlu0XMmHls8l-EWtZ1-5myAD1gkwKHFuLkZ7I9kvtv3w-P-3ooDi8WJcflJsznBzyWUxELWyrOzdbMc--8vNSybPYpjqbe9W6vVEnIXkbl-xAr2-F8_tMZOsueHVeIgibVp571Egl48PJr1rhySEGxbk9efBOEIMHygMHwkMa9jI_1pbxfvRx4kpA"
                                    />
                                </div>
                                <span className="bg-surface-container px-3 py-1 rounded-full text-primary text-label-sm font-mono flex items-center gap-1">
                                    <span
                                        className="material-symbols-outlined text-sm"
                                        data-icon="groups"
                                    >
                                        groups
                                    </span>
                                    3/5
                                </span>
                            </div>
                            <h3 className="text-title-md font-title-md mb-1">DataStream</h3>
                            <p className="text-on-surface-variant text-label-md font-label-md mb-4">
                                Leader: Elena Rodriguez
                            </p>
                            <p className="text-body-md text-on-surface-variant mb-6 flex-grow">
                                Real-time analytics for carbon footprint monitoring.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-8">
                                <span className="bg-surface-container px-3 py-1 rounded-lg text-label-sm font-label-sm">
                                    Python
                                </span>
                                <span className="bg-surface-container px-3 py-1 rounded-lg text-label-sm font-label-sm">
                                    Data Viz
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mt-auto">
                                <a
                                    className="py-2.5 rounded-xl border border-outline-variant font-label-md text-label-md hover:bg-surface-container transition-all text-center"
                                    href="team-dashboard.html"
                                >
                                    View
                                </a>
                                <a
                                    className="py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:brightness-110 active:scale-95 transition-all text-center"
                                    href="team-dashboard.html"
                                >
                                    Join
                                </a>
                            </div>
                        </div>
                        {/* Card 5 */}
                        <div className="bg-white p-6 rounded-2xl border border-outline-variant card-lift flex flex-col h-full">
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-primary-container/20 flex items-center justify-center overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover"
                                        data-alt="A minimalist tech logo for 'SwiftDev' featuring a stylized lightning bolt integrated into a code bracket. Vibrant blue and silver gradients on a soft white background. Modern, corporate, high-end design."
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_2fjHl1PmJX5xPgzlAPmyUqD4BeGfNI8Cv7pkj-Hp4fyBI4BOhr3m5g4P9RUy60PBm61guxYOm5rEYgqrz3ey2JD2v4t2qE3i_bViZfX7BEdjuiT_bwuuP59QHXiSuXIc2MqHckc-ZdAOmKVKD2yP2bZJZ8ZG2gDMKQSosd1NkDpsnZ7w-GkUqsSKFm7TB1nof-gMsKsGSsW2h5dOm_KJ08ZL_wfiZrXWd2gH3yCZifAqfK-CWDGxdwROtZWZn_rVgvyHVkhPpTa-"
                                    />
                                </div>
                                <span className="bg-surface-container px-3 py-1 rounded-full text-primary text-label-sm font-mono flex items-center gap-1">
                                    <span
                                        className="material-symbols-outlined text-sm"
                                        data-icon="groups"
                                    >
                                        groups
                                    </span>
                                    1/5
                                </span>
                            </div>
                            <h3 className="text-title-lg font-title-lg mb-1">SwiftDev</h3>
                            <p className="text-on-surface-variant text-label-md font-label-md mb-4">
                                Leader: Kevin Park
                            </p>
                            <p className="text-body-md text-on-surface-variant mb-6 flex-grow">
                                Mobile-first banking for the underbanked communities.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-8">
                                <span className="bg-surface-container px-3 py-1 rounded-lg text-label-sm font-label-sm">
                                    Flutter
                                </span>
                                <span className="bg-surface-container px-3 py-1 rounded-lg text-label-sm font-label-sm">
                                    AI
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mt-auto">
                                <a
                                    className="py-2.5 rounded-xl border border-outline-variant font-label-md text-label-md hover:bg-surface-container transition-all text-center"
                                    href="team-dashboard.html"
                                >
                                    View
                                </a>
                                <a
                                    className="py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:brightness-110 active:scale-95 transition-all text-center"
                                    href="team-dashboard.html"
                                >
                                    Join
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
            </div>
            {/* Bottom Navigation (Mobile) */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 pb-safe bg-surface shadow-[0_-1px_12px_rgba(59,130,246,0.08)]">
                <a
                    className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-xl py-1 px-4"
                    href="index.html"
                >
                    <span
                        className="material-symbols-outlined"
                        data-icon="home"
                        style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                        home
                    </span>
                    <span className="text-label-sm font-label-sm">Home</span>
                </a>
                <a
                    className="flex flex-col items-center justify-center text-on-surface-variant py-1 px-4"
                    href="explore.html"
                >
                    <span className="material-symbols-outlined" data-icon="explore">
                        explore
                    </span>
                    <span className="text-label-sm font-label-sm">Explore</span>
                </a>
                <a
                    className="flex flex-col items-center justify-center text-on-surface-variant py-1 px-4"
                    href="notifications.html"
                >
                    <span className="material-symbols-outlined" data-icon="notifications">
                        notifications
                    </span>
                    <span className="text-label-sm font-label-sm">Alerts</span>
                </a>
                <a
                    className="flex flex-col items-center justify-center text-on-surface-variant py-1 px-4"
                    href="profile.html"
                >
                    <span className="material-symbols-outlined" data-icon="person">
                        person
                    </span>
                    <span className="text-label-sm font-label-sm">Profile</span>
                </a>
            </nav>
        </>
    )
}
