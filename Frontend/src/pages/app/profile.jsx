import { useTheme } from '../../hooks/useTheme'

export default function Profile() {
    const { setTheme } = useTheme()

    return (
        <>
            <meta charSet="utf-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <title>Profile | EVENTIFY</title>
            <meta
                name="description"
                content="Profile on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
            />
            <meta property="og:title" content="Profile | EVENTIFY" />
            <meta
                property="og:description"
                content="Profile on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
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
            {/* Global Theme Handler (Prevents FOUC in dark mode) */}
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
                        "\n        \n        .material-symbols-outlined {\n            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n        }\n        .glass-sidebar {\n            background: rgba(255, 255, 255, 0.8);\n            backdrop-filter: blur(12px);\n            -webkit-backdrop-filter: blur(12px);\n        }\n        .dark .glass-sidebar {\n            background: rgba(23, 33, 49, 0.8);\n            border-color: rgba(255, 255, 255, 0.05);\n        }\n        .premium-shadow {\n            box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.08);\n        }\n        .ai-gradient-border {\n            position: relative;\n            background: #fff;\n            border-radius: 16px;\n        }\n        .dark .ai-gradient-border {\n            background: #172131;\n        }\n        .ai-gradient-border::before {\n            content: \"\";\n            position: absolute;\n            inset: -1px;\n            border-radius: 17px;\n            padding: 1px;\n            background: linear-gradient(135deg, #FF4D2E, #8455ef);\n            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);\n            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);\n            -webkit-mask-composite: xor;\n            mask-composite: exclude;\n            pointer-events: none;\n        }\n    "
                }}
            />
            {/* Top Navigation */}
            <header className="sticky top-0 z-40 w-full h-top_nav_height glass-nav border-b border-outline-variant/30 dark:border-white/10 shadow-sm">
                <div className="flex justify-between items-center px-4 sm:px-gutter w-full max-w-container_max_width mx-auto h-full">
                    <div className="flex items-center gap-8">
                        <a
                            className="flex items-center gap-2 font-headline-md text-headline-md font-black text-primary animate-pulse-wave"
                            href="index.html"
                        >
                            <span
                                className="material-symbols-outlined"
                                style={{ fontVariationSettings: '"FILL" 1' }}
                            >
                                hub
                            </span>
                            EVENTIFY
                        </a>
                        <div className="hidden lg:flex relative group">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                                search
                            </span>
                            <input
                                className="bg-surface-container-low dark:bg-slate-900 border-none rounded-full pl-10 pr-4 py-2 w-64 focus:ring-2 focus:ring-primary/20 dark:text-white transition-all"
                                placeholder="Search opportunities, people..."
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            className="theme-toggle w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-low dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
                            title="Switch theme"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                dark_mode
                            </span>
                        </button>
                        <a
                            className="hidden lg:flex items-center gap-2 px-6 py-2 bg-primary text-on-primary rounded-full font-label-md text-label-md hover:shadow-lg transition-all"
                            href="rafeeq.html"
                        >
                            Ask Rafeeq
                        </a>
                        <div className="flex items-center gap-1 sm:gap-2 text-on-surface-variant dark:text-gray-300">
                            <a
                                className="hidden sm:inline-block material-symbols-outlined p-2 hover:bg-surface-container dark:hover:bg-slate-800 rounded-full cursor-pointer"
                                href="notifications.html"
                            >
                                notifications
                            </a>
                            <a
                                className="hidden sm:inline-block material-symbols-outlined p-2 hover:bg-surface-container dark:hover:bg-slate-800 rounded-full cursor-pointer"
                                href="#account-settings"
                            >
                                settings
                            </a>
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-primary-container overflow-hidden ml-1 sm:ml-2">
                                <img
                                    className="w-full h-full object-cover"
                                    data-alt="Profile headshot"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNZNd9jfESR_zqyCdGqZwDbntamuVnge0Tsq-V3vcF2zyvrZSvmNGaB93G0gzrTb02wHy5s8MRNZhZH9jEmI85YogBnQiONoMP1hl-rBFILklBs2VaL0dsb1XL1iEKYTwc4tqZLh4woUaUgkPRTfZQZF5ieHDS-qLMFvAF9YnfG8jjnwrS-YfcbXwjwsWi0OAYnjGUq_7cGq2t5ReBfXzPBqfTv-lV_CfGaCpqCAVu9CKXTTurrtp70Su8ifqzsfE0bBloO3zt5iub"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div className="max-w-container_max_width mx-auto flex gap-gutter px-gutter pt-stack_gap_lg pb-0 relative">
                {/* Left Sidebar Navigation */}
                <aside className="hidden lg:flex flex-col gap-4 sticky top-[calc(72px+24px)] h-[calc(100vh-120px)] w-sidebar_width shrink-0 glass-sidebar border-r border-outline-variant/30 rounded-xl p-4">
                    <nav className="flex flex-col gap-2">
                        <a
                            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-lg group"
                            href="index.html"
                        >
                            <span className="material-symbols-outlined text-outline group-hover:text-primary">
                                home
                            </span>
                            <span className="font-label-md text-label-md">Home</span>
                        </a>
                        <a
                            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-lg group"
                            href="my-applications.html"
                        >
                            <span className="material-symbols-outlined text-outline group-hover:text-primary">
                                assignment_turned_in
                            </span>
                            <span className="font-label-md text-label-md">My Event</span>
                        </a>
                        <a
                            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-lg group"
                            href="posts.html"
                        >
                            <span className="material-symbols-outlined text-outline group-hover:text-primary">
                                campaign
                            </span>
                            <span className="font-label-md text-label-md">Posts</span>
                        </a>
                        <a
                            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-lg group"
                            href="notifications.html"
                        >
                            <span className="material-symbols-outlined text-outline group-hover:text-primary">
                                notifications
                            </span>
                            <span className="font-label-md text-label-md">Notifications</span>
                        </a>
                        <a
                            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-lg group"
                            href="saved.html"
                        >
                            <span className="material-symbols-outlined text-outline group-hover:text-primary">
                                bookmark
                            </span>
                            <span className="font-label-md text-label-md">Saved</span>
                        </a>
                        <a
                            className="flex items-center gap-3 px-4 py-3 bg-primary-container/10 text-primary font-bold border-l-4 border-primary rounded-r-lg"
                            href="profile.html"
                        >
                            <span
                                className="material-symbols-outlined"
                                style={{ fontVariationSettings: '"FILL" 1' }}
                            >
                                account_circle
                            </span>
                            <span className="font-label-md text-label-md">Profile</span>
                        </a>
                    </nav>
                    <div className="mt-auto p-4 bg-surface-container-low rounded-xl border border-outline-variant/50">
                        <p className="font-label-sm text-label-sm text-primary mb-2">
                            PRO PLAN
                        </p>
                        <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                            Unlock advanced AI matching and priority Rafeeq insights.
                        </p>
                        <button className="w-full py-2 bg-secondary text-on-primary rounded-lg font-label-md text-label-md">
                            Upgrade
                        </button>
                    </div>
                </aside>
                {/* Main Content Area */}
                <main className="flex-1 flex flex-col gap-stack_gap_md min-w-0">
                    {/* Profile Header */}
                    <section className="ev-fade-up ev-stagger-1 bg-surface-container-lowest rounded-2xl overflow-hidden premium-shadow border border-outline-variant/50">
                        <div
                            className="h-48 w-full bg-cover bg-center relative"
                            data-alt="A sophisticated abstract background featuring smooth flowing waves of deep royal blue and vibrant violet. The textures resemble high-end silk or liquid glass, with soft light reflections. The mood is professional, calm, and technologically advanced, suitable for a premium social network header."
                            style={{
                                backgroundImage:
                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBeHOaLhImSXpSf94lw-SYxPYBwlc5gBXk7btOOFAhqx_oZFBSKtgn_P2pIGvFfCBhoMLxLxt6nkAaVv6TstLXm2DSDLS1AOT6QH_IRGTfXo2OtjjsArXHvWKur1GZZ2eDK6qHuSbQcfxMGo0fzNj2QnZzFWPIyhuDuCUdRosBAChWJFtM6RTcO8__ey71pVTFe5E9QEaseLBt6QNApMCSG2FDAAUMEE4xtjtfwbTwTctscv_cpXmi6Kt9_szB4pNw3Yn5KbAGVUlRw")'
                            }}
                        >
                            <button
                                className="absolute top-4 right-4 bg-surface/80 backdrop-blur-md p-2 rounded-full text-on-surface-variant hover:text-primary transition-colors"
                                aria-label="Edit"
                            >
                                <span className="material-symbols-outlined">edit</span>
                            </button>
                        </div>
                        <div className="px-8 pb-8 relative z-10 space-y-5">
                            <div className="flex flex-col md:flex-row md:items-end gap-6">
                                <div className="-mt-2 w-28 h-28 rounded-full border-4 border-surface-container-lowest overflow-hidden premium-shadow bg-surface flex-shrink-0">
                                    <img
                                        className="w-full h-full object-cover"
                                        data-alt="A high-resolution, professional portrait of a tech executive or creative director. The subject is centered with a soft, confident smile, against a light gray studio background. The lighting is bright and airy, capturing realistic skin textures and fine details of their dark business attire."
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsQh5xOHYdmYcFmjJRpba3iiPC5g3JPTyK7qlEyYGrWLO_FtAHZOzRW4cX1RMPUClIy0d90XrNRLcOHNKGQkJKGdAt1u1Ukq4lYdrRDfJqdzzKVIyNbQ2FgWThdiwD06oY_uvI63tt40yB9wAi_f92Yb_O6IrGry-GNDu_3j-NEv3cU8WRQgm1fNlsToUpHXTKZszchQ4CRvtQhgyxMTzzWqjh7YpyYoacng83yN5O38dvrRRbO8B2iYc2p5lfWbCbUaTJ-KCVF07o"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h1 className="font-headline-lg text-headline-lg text-on-surface">
                                            ALI
                                        </h1>
                                        <span
                                            className="material-symbols-outlined text-primary-container"
                                            style={{ fontVariationSettings: '"FILL" 1' }}
                                            title="Verified Profile"
                                        >
                                            verified
                                        </span>
                                    </div>
                                    <p className="font-title-lg text-title-lg text-on-surface-variant">
                                        AI Research Student &amp; Hackathon Team Lead
                                    </p>
                                    <p className="font-body-md text-body-md text-outline mt-1 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[18px]">
                                            location_on
                                        </span>{" "}
                                        Amman, Jordan • 3 Hackathons Won
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <a
                                    className="flex-1 md:flex-none text-center px-6 py-2.5 bg-primary text-on-primary rounded-full font-label-md text-label-md hover:bg-primary-container transition-colors"
                                    href="explore.html"
                                >
                                    Looking for opportunities
                                </a>
                                <a
                                    className="flex-1 md:flex-none text-center px-6 py-2.5 border border-outline-variant text-primary rounded-full font-label-md text-label-md hover:bg-surface-container-low transition-colors"
                                    href="create-team.html"
                                >
                                    Add Section
                                </a>
                            </div>
                        </div>
                        <div className="px-8 pb-8">
                            <h3 className="font-title-lg text-title-lg mb-2">About</h3>
                            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                                Passionate about the intersection of Artificial Intelligence and
                                Human-Computer Interaction. I've spent the past two years building
                                AI-driven side projects and leading teams through university
                                hackathons. Currently looking for competitions and workshops that
                                sharpen my machine learning and product skills through Eventify.
                            </p>
                        </div>
                    </section>
                    {/* Dashboard Stats */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-stack_gap_md">
                        <div className="ev-card spotlight ev-fade-up ev-stagger-2 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/50 premium-shadow group">
                            <div className="flex justify-between items-start mb-4">
                                <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-lg">
                                    emoji_events
                                </span>
                                <span className="font-label-sm text-label-sm text-outline">
                                    +2 this year
                                </span>
                            </div>
                            <p className="font-mono text-headline-lg text-on-surface">7</p>
                            <p className="font-label-md text-label-md text-on-surface-variant">
                                Competitions Joined
                            </p>
                        </div>
                        <div className="ev-card spotlight ev-fade-up ev-stagger-2 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/50 premium-shadow group">
                            <div className="flex justify-between items-start mb-4">
                                <span className="material-symbols-outlined text-secondary p-2 bg-secondary/10 rounded-lg">
                                    bookmark_added
                                </span>
                                <span className="font-label-sm text-label-sm text-outline">
                                    New
                                </span>
                            </div>
                            <p className="font-mono text-headline-lg text-on-surface">18</p>
                            <p className="font-label-md text-label-md text-on-surface-variant">
                                Saved Opportunities
                            </p>
                        </div>
                        <div className="ev-card spotlight ev-fade-up ev-stagger-2 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/50 premium-shadow group">
                            <div className="flex justify-between items-start mb-4">
                                <span className="material-symbols-outlined text-tertiary p-2 bg-tertiary/10 rounded-lg">
                                    group
                                </span>
                                <span className="font-label-sm text-label-sm text-outline">
                                    Top 5%
                                </span>
                            </div>
                            <p className="font-mono text-headline-lg text-on-surface">4</p>
                            <p className="font-label-md text-label-md text-on-surface-variant">
                                Teams Led
                            </p>
                        </div>
                    </section>
                    {/* Experience Section */}
                    <section className="ev-fade-up ev-stagger-2 bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/50 premium-shadow">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-title-lg text-title-lg">Experience</h3>
                            <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary">
                                add
                            </span>
                        </div>
                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-surface-container rounded-lg flex-shrink-0 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary">
                                        hub
                                    </span>
                                </div>
                                <div>
                                    <h4 className="font-title-lg text-title-lg">
                                        Team Lead, Global AI Innovation Challenge
                                    </h4>
                                    <p className="font-label-md text-label-md text-primary">
                                        Eventify Hackathon • Found via Eventify
                                    </p>
                                    <p className="font-label-sm text-label-sm text-outline">
                                        Oct 2024 • 4-person team
                                    </p>
                                    <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                                        Led a 4-person team through a 48-hour hackathon, building an
                                        AI-powered opportunity matcher that placed in the top 3.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-surface-container rounded-lg flex-shrink-0 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-secondary">
                                        terminal
                                    </span>
                                </div>
                                <div>
                                    <h4 className="font-title-lg text-title-lg">
                                        Machine Learning Intern
                                    </h4>
                                    <p className="font-label-md text-label-md text-secondary">
                                        University Research Lab • 3 months
                                    </p>
                                    <p className="font-label-sm text-label-sm text-outline">
                                        Summer 2024
                                    </p>
                                    <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                                        Built and evaluated recommendation models for a university
                                        research project on personalized learning paths.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Skills Section */}
                    <section className="ev-fade-up ev-stagger-3 bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/50 premium-shadow mt-stack_gap_md">
                        <h3 className="font-title-lg text-title-lg mb-6">Skills</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                            Showcase the participant's core skills and strengths learned through
                            the platform.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <span className="px-4 py-2 bg-primary/5 text-primary font-label-md text-label-md rounded-full border border-primary/10">
                                Artificial Intelligence
                            </span>
                            <span className="px-4 py-2 bg-secondary/5 text-secondary font-label-md text-label-md rounded-full border border-secondary/10">
                                UI/UX Design
                            </span>
                            <span className="px-4 py-2 bg-surface-container-high text-on-surface-variant font-label-md text-label-md rounded-full">
                                Product Strategy
                            </span>
                            <span className="px-4 py-2 bg-surface-container-high text-on-surface-variant font-label-md text-label-md rounded-full">
                                Web3
                            </span>
                            <span className="px-4 py-2 bg-surface-container-high text-on-surface-variant font-label-md text-label-md rounded-full">
                                System Architecture
                            </span>
                            <span className="px-4 py-2 bg-primary/5 text-primary font-label-md text-label-md rounded-full border border-primary/10">
                                Machine Learning
                            </span>
                            <span className="px-4 py-2 bg-secondary/5 text-secondary font-label-md text-label-md rounded-full border border-secondary/10">
                                Figma Mastery
                            </span>
                        </div>
                    </section>
                    {/* Upload CV Section */}
                    <section className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/50 premium-shadow mt-stack_gap_md">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-title-lg text-title-lg">Upload Your CV</h3>
                                <span className="material-symbols-outlined text-primary">
                                    upload_file
                                </span>
                            </div>
                            <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container p-6 text-center">
                                <span className="material-symbols-outlined text-5xl text-primary">
                                    cloud_upload
                                </span>
                                <p className="mt-4 font-label-md text-label-md">
                                    Keep your profile updated with your latest resume.
                                </p>
                                <p className="mt-2 font-label-md text-label-md text-on-surface-variant">
                                    Supported formats: PDF, DOCX • Max size: 10MB
                                </p>
                                <button className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors">
                                    <span className="material-symbols-outlined mr-2">
                                        cloud_upload
                                    </span>{" "}
                                    Upload CV
                                </button>
                            </div>
                            <div className="flex items-center justify-between rounded-xl bg-surface-container-low p-4 border border-outline-variant">
                                <div>
                                    <p className="font-label-md text-label-md">Current resume</p>
                                    <p className="font-label-md text-label-md text-on-surface-variant">
                                        ALI_CV_2024.pdf • Updated 3 days ago
                                    </p>
                                </div>
                                <button className="rounded-full border border-primary px-4 py-2 text-primary font-label-md text-label-md hover:bg-primary/5 transition-colors">
                                    Preview
                                </button>
                            </div>
                        </div>
                    </section>
                    {/* Projects Section */}
                    <section
                        id="projects-section"
                        className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/50 premium-shadow mt-stack_gap_md"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                            <h3 className="font-title-lg text-title-lg">Featured Projects</h3>
                            <a
                                href="#projects-section"
                                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-on-primary font-label-md text-label-md transition-colors hover:bg-primary-container"
                            >
                                <span className="material-symbols-outlined mr-2">add</span> Add
                                project
                            </a>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack_gap_md">
                            <div className="group cursor-pointer">
                                <div className="h-48 bg-surface-container-low rounded-xl overflow-hidden mb-4 relative">
                                    <img
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        data-alt="A sleek digital mock-up of a mobile application interface showcasing advanced data visualization. The screen displays colorful glowing nodes and neural-network-like patterns over a dark glassmorphic background. The aesthetic is futuristic and high-tech, emphasizing AI connectivity."
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCpvGQnNSgyBkfeKNI1KzqCGukBowAFe9bpr4Biw9DbjP1RWrLw0k5LOSotFyKqYwFOuAfNA5pKZEB2JGkGyceEJOcskEeJ3yo6bIFV8xTMUMf4sUGXn8cX9PQ0WSUHozy4mjKLeDyW9_qm5Ahuab-hxhkgQbQWVKd3g45u-9iCZE0kxul3mTn4VVEYPZLfh6wNdWaxd9HHp_aUPHxbpnO1xmmAyEActsVW7OGdfVecfbEy6XWnJsSkhSZ4VV2X6d_8jAlbyg8cDWL"
                                    />
                                </div>
                                <h4 className="font-title-lg text-title-lg group-hover:text-primary transition-colors">
                                    NeuralMesh — AI Opportunity Matcher
                                </h4>
                                <p className="font-body-md text-body-md text-on-surface-variant">
                                    Top 3 finish at the Global AI Innovation Challenge: a
                                    recommendation engine that matches students to competitions.
                                </p>
                            </div>
                            <div className="group cursor-pointer">
                                <div className="h-48 bg-surface-container-low rounded-xl overflow-hidden mb-4 relative">
                                    <img
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        data-alt="A high-end architectural photo of a modern workspace with ergonomic furniture, minimalist white walls, and large windows with city views. Lush green plants are placed strategically, and a sleek laptop sits on a clean wooden desk. The overall feeling is one of professional productivity and sophisticated design."
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEJY6yyoRdZ_CRUZSXJwzE3ox-OqrFeSHeY3Oo3ym3Xxnd9ro2HyG2GyX1Z6xfO1A8KB3Bp-h-CTp6Ek3EOsKXNaeValVc4zw9Vwfq7pUDeqnMN0grO7waWQreeR8Y-ZWPiHh8fy9vmEUKkRt4_gOGVz6EFbqboaKUe5WSe4Ql4XQWITBfhfS2IR3XHHePa02Dw2grCSlvjWwGvmP4xHq2cSiydzuQY0tVFdV-H9SQe0YH60IcWOn_nA-ztK2kYf8KXUEXADThyjTS"
                                    />
                                </div>
                                <h4 className="font-title-lg text-title-lg group-hover:text-primary transition-colors">
                                    Personalized Learning Path Model
                                </h4>
                                <p className="font-body-md text-body-md text-on-surface-variant">
                                    University research project recommending course sequences based on
                                    a student's skill gaps.
                                </p>
                            </div>
                        </div>
                    </section>
                    {/* Certifications Section */}
                    <section className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/50 premium-shadow mt-stack_gap_md">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div>
                                    <h3 className="font-title-lg text-title-lg">Certifications</h3>
                                    <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                                        Your verified certificates from Eventify are listed here in a
                                        clean, easy-to-scan format.
                                    </p>
                                </div>
                                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-primary font-label-sm text-label-sm">
                                    <span className="material-symbols-outlined">school</span>4
                                    certificates
                                </span>
                            </div>
                            <div className="mt-4 overflow-hidden rounded-[28px] bg-white border border-outline-variant shadow-sm">
                                <div className="grid grid-cols-[1fr_auto] gap-4 px-5 py-4 font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant/50">
                                    <span>Opportunity</span>
                                    <span className="text-left">Action</span>
                                </div>
                                <div className="space-y-3 p-4 overflow-y-auto max-h-[430px] scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-surface-container">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-3xl border border-surface-container-high p-4 bg-surface">
                                        <div>
                                            <p className="font-label-md text-label-md text-on-surface">
                                                Eventify Certified AI Specialist
                                            </p>
                                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                                                AI learning path - May 2025
                                            </p>
                                        </div>
                                        <button className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-on-primary font-label-md text-label-md transition-colors hover:bg-primary-container">
                                            View certificate
                                        </button>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-3xl border border-surface-container-high p-4 bg-surface">
                                        <div>
                                            <p className="font-label-md text-label-md text-on-surface">
                                                Eventify UX Excellence
                                            </p>
                                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                                                Advanced UX track - Feb 2025
                                            </p>
                                        </div>
                                        <button className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-on-primary font-label-md text-label-md transition-colors hover:bg-primary-container">
                                            View certificate
                                        </button>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-3xl border border-surface-container-high p-4 bg-surface">
                                        <div>
                                            <p className="font-label-md text-label-md text-on-surface">
                                                Eventify Career Growth
                                            </p>
                                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                                                Career development program - Dec 2024
                                            </p>
                                        </div>
                                        <button className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-on-primary font-label-md text-label-md transition-colors hover:bg-primary-container">
                                            View certificate
                                        </button>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-3xl border border-surface-container-high p-4 bg-surface">
                                        <div>
                                            <p className="font-label-md text-label-md text-on-surface">
                                                Eventify Data Mastery
                                            </p>
                                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                                                Data mastery pathway - Aug 2024
                                            </p>
                                        </div>
                                        <button className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-on-primary font-label-md text-label-md transition-colors hover:bg-primary-container">
                                            View certificate
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
                {/* Right Settings Panel */}
                <aside
                    className="hidden lg:flex flex-col gap-4 sticky top-[calc(72px+24px)] h-[calc(100vh-120px)] w-sidebar_width shrink-0 glass-sidebar border-l border-outline-variant/30 rounded-xl p-4"
                    id="account-settings"
                >
                    <h3 className="font-label-md text-label-md text-on-surface dark:text-white px-2 mb-2">
                        Profile Management
                    </h3>
                    <div className="flex flex-col gap-1">
                        <button className="flex items-center justify-between w-full p-3 hover:bg-surface-container dark:hover:bg-slate-800 rounded-lg transition-colors group text-on-surface dark:text-gray-200">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-outline group-hover:text-primary">
                                    person_edit
                                </span>
                                <span className="font-label-md text-label-md">Edit Profile</span>
                            </div>
                            <span className="material-symbols-outlined text-outline text-[18px]">
                                chevron_right
                            </span>
                        </button>
                        <button className="flex items-center justify-between w-full p-3 hover:bg-surface-container dark:hover:bg-slate-800 rounded-lg transition-colors group text-on-surface dark:text-gray-200">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-outline group-hover:text-primary">
                                    upload_file
                                </span>
                                <span className="font-label-md text-label-md">Update CV</span>
                            </div>
                            <span className="material-symbols-outlined text-outline text-[18px]">
                                chevron_right
                            </span>
                        </button>
                        <button className="flex items-center justify-between w-full p-3 hover:bg-surface-container dark:hover:bg-slate-800 rounded-lg transition-colors group text-on-surface dark:text-gray-200">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-outline group-hover:text-primary">
                                    privacy_tip
                                </span>
                                <span className="font-label-md text-label-md">
                                    Privacy Settings
                                </span>
                            </div>
                            <span className="material-symbols-outlined text-outline text-[18px]">
                                chevron_right
                            </span>
                        </button>
                    </div>
                    <div className="mt-4 pt-4 border-t border-outline-variant/30 dark:border-white/10">
                        <h3 className="font-label-md text-label-md text-on-surface dark:text-white px-2 mb-2">
                            Appearance
                        </h3>
                        <div className="flex items-center justify-between p-3">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-outline dark:text-gray-400">
                                    palette
                                </span>
                                <span className="font-label-md text-label-md dark:text-gray-200">
                                    Theme
                                </span>
                            </div>
                            <div className="flex bg-surface-container-high dark:bg-slate-800 rounded-full p-1">
                                <button
                                    id="profile-light-btn"
                                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-primary"
                                    onClick={() => setTheme('light')}
                                    aria-label="Switch to light mode"
                                >
                                    <span className="material-symbols-outlined text-[18px]">
                                        light_mode
                                    </span>
                                </button>
                                <button
                                    id="profile-dark-btn"
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-on-surface dark:hover:text-white"
                                    onClick={() => setTheme('dark')}
                                    aria-label="Switch to dark mode"
                                >
                                    <span className="material-symbols-outlined text-[18px]">
                                        dark_mode
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-outline-variant/30 dark:border-white/10">
                        <a
                            className="flex items-center gap-3 w-full p-3 rounded-lg transition-colors text-error hover:bg-error/10"
                            href="../auth/login.html"
                        >
                            <span
                                className="material-symbols-outlined text-[18px] text-error"
                                aria-hidden="true"
                            >
                                logout
                            </span>
                            <span className="font-label-md text-label-md">Sign out</span>
                        </a>
                    </div>
                    <div className="mt-auto p-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20">
                        <div className="flex items-center gap-2 mb-2">
                            <span
                                className="material-symbols-outlined text-primary text-[20px]"
                                style={{ fontVariationSettings: '"FILL" 1' }}
                            >
                                auto_awesome
                            </span>
                            <p className="font-label-md text-label-md text-primary">AI Insight</p>
                        </div>
                        <p className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-300">
                            Your profile strength is{" "}
                            <span className="text-primary font-bold">Expert</span>. Adding 2 more
                            certifications could increase reach by 25%.
                        </p>
                    </div>
                </aside>
            </div>
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
            {/* Mobile Nav Anchor */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface/80 dark:bg-slate-900/90 backdrop-blur-xl border-t border-outline-variant dark:border-white/10 z-50 px-gutter py-3 flex justify-between items-center">
                <a
                    className="flex flex-col items-center gap-1 text-outline dark:text-gray-400"
                    href="index.html"
                >
                    <span className="material-symbols-outlined">home</span>
                    <span className="font-label-sm text-label-sm">Home</span>
                </a>
                <a
                    className="flex flex-col items-center gap-1 text-outline dark:text-gray-400"
                    href="posts.html"
                >
                    <span className="material-symbols-outlined">campaign</span>
                    <span className="font-label-sm text-label-sm">Posts</span>
                </a>
                <a
                    className="bg-primary p-3 rounded-full -mt-10 shadow-lg text-on-primary block animate-pulse-wave"
                    href="create-team.html"
                    aria-label="Add"
                >
                    <span className="material-symbols-outlined">add</span>
                </a>
                <a
                    className="flex flex-col items-center gap-1 text-outline dark:text-gray-400"
                    href="notifications.html"
                >
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="font-label-sm text-label-sm">Alerts</span>
                </a>
                <a
                    className="flex flex-col items-center gap-1 text-primary"
                    href="profile.html"
                >
                    <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                        account_circle
                    </span>
                    <span className="font-label-sm text-label-sm">Profile</span>
                </a>
            </nav>
        </>
    )
}
