export default function TeamDashboard() {
    return (
        <>
            <meta charSet="utf-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <title>Team Leader Dashboard - AI Pioneers</title>
            <meta
                name="description"
                content="Team Leader Dashboard - AI Pioneers on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
            />
            <meta property="og:title" content="Team Leader Dashboard - AI Pioneers" />
            <meta
                property="og:description"
                content="Team Leader Dashboard - AI Pioneers on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
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
            {/* Global Theme Handler (Prevents FOUC in dark mode) */}
            <link rel="stylesheet" href="nav.css" />
            <link rel="stylesheet" href="app-shell.css" />
            <link rel="stylesheet" href="../assets/css/theme.css" />
            <style
                dangerouslySetInnerHTML={{
                    __html:
                        "\n    @font-face {\n        font-family: 'Material Symbols Outlined';\n        font-style: normal;\n        font-weight: 100 700;\n        font-display: block;\n        src: url('../assets/fonts/material-symbols-outlined.woff2') format('woff2');\n    }\n    .material-symbols-outlined {\n        font-family: 'Material Symbols Outlined';\n        font-weight: normal;\n        font-style: normal;\n        font-size: 24px;\n        line-height: 1;\n        letter-spacing: normal;\n        text-transform: none;\n        display: inline-block;\n        white-space: nowrap;\n        overflow: hidden;\n        word-wrap: normal;\n        direction: ltr;\n        -webkit-font-feature-settings: 'liga';\n        -webkit-font-smoothing: antialiased;\n    }\n    "
                }}
            />
            {/* Shared Component Styling & Design System Config */}
            <style
                dangerouslySetInnerHTML={{
                    __html:
                        "\n        body {\n            font-family: 'Inter', sans-serif;\n            -webkit-font-smoothing: antialiased;\n        }\n        .glass-panel {\n            background: rgba(255, 255, 255, 0.7);\n            backdrop-filter: blur(12px);\n            -webkit-backdrop-filter: blur(12px);\n        }\n        .ai-gradient-border {\n            position: relative;\n            background: #fff;\n            background-clip: padding-box;\n            border: 2px solid transparent;\n        }\n        .ai-gradient-border::before {\n            content: '';\n            position: absolute;\n            top: 0; right: 0; bottom: 0; left: 0;\n            z-index: -1;\n            margin: -2px;\n            border-radius: inherit;\n            background: linear-gradient(to right, #FF4D2E, #0E1116);\n        }\n        .hover-lift {\n            transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);\n        }\n        .hover-lift:hover {\n            transform: translateY(-4px);\n        }\n        .material-symbols-outlined {\n            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n        }\n    "
                }}
            />
            <style
                dangerouslySetInnerHTML={{
                    __html: "\n    body {\n      min-height: max(884px, 100dvh);\n    }\n  "
                }}
            />
            {/* Header (Unified Task-Flow Chrome) */}
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
            <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 mb-24">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wider">
                                Active Hackathon
                            </span>
                        </div>
                        <h1 className="font-headline-lg text-headline-lg text-on-surface">
                            AI Pioneers
                        </h1>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                            <span className="font-label-md text-label-md text-primary">
                                Recruiting
                            </span>
                            <span className="text-outline mx-2">•</span>
                            <span className="font-label-md text-label-md text-on-surface-variant">
                                4 / 6 Members
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-all active:scale-95">
                            <span
                                className="material-symbols-outlined text-[18px]"
                                data-icon="settings"
                            >
                                settings
                            </span>
                            Team Settings
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-md hover:bg-primary-container transition-all active:scale-95">
                            <span
                                className="material-symbols-outlined text-[18px]"
                                data-icon="add"
                            >
                                add
                            </span>
                            Invite Member
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
                    {/* Main Content Area (Left/Center) */}
                    <div className="lg:col-span-2 space-y-stack_gap_lg">
                        {/* Pending Join Requests */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                                    Pending Join Requests
                                    <span className="bg-error-container text-error text-label-sm px-2 py-0.5 rounded-full">
                                        1
                                    </span>
                                </h3>
                            </div>
                            {/* Request Card */}
                            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm hover-lift relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Avatar & Quick Info */}
                                    <div className="flex-shrink-0 flex flex-col items-center">
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden mb-3 border-2 border-surface-container-high shadow-inner">
                                            <img
                                                className="w-full h-full object-cover"
                                                data-alt="A portrait of Alex Rivera, a young software engineer with a friendly smile, professional tech attire, in a brightly lit studio. The style is clean, modern corporate photography with high-end clarity and soft focus background."
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGWZsh5hb95_nQ-ArZECm2xz51h_f0sPqc4LL8qGy875HaknSaoOd9whCqRWOAJaYYuX_cBzGsQcjj8xhc7QoTT6y-XLY-KVOPvgiItAyfXLMKLZKaqxq-GFjHKVfw11WWKJratVoYRJUJkObmjI2Yh2SRjJkQAlP4hsyT5I5aoEcEKZ39ROl9jY0CJ-u0QfL5GKPKBgrP3_N9YxnPMk2WzIaIUweEhInZGIOhHa2d9HMQ9qQi-2PEjdpX9TumFB5OCFmHAI2G_Tcl"
                                            />
                                        </div>
                                        <div className="flex items-center gap-1 text-on-surface-variant">
                                            <span
                                                className="material-symbols-outlined text-[16px]"
                                                data-icon="work"
                                            >
                                                work
                                            </span>
                                            <span className="font-label-sm text-label-sm">
                                                3 Years Exp
                                            </span>
                                        </div>
                                    </div>
                                    {/* Details */}
                                    <div className="flex-grow">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                                            <h4 className="font-title-lg text-title-lg text-on-surface">
                                                Alex Rivera
                                            </h4>
                                            <div className="flex gap-4">
                                                <a
                                                    className="text-on-surface-variant hover:text-primary flex items-center gap-1 font-label-sm text-label-sm transition-colors"
                                                    href="#"
                                                >
                                                    <span
                                                        className="material-symbols-outlined text-[18px]"
                                                        data-icon="description"
                                                    >
                                                        description
                                                    </span>{" "}
                                                    CV
                                                </a>
                                                <a
                                                    className="text-on-surface-variant hover:text-primary flex items-center gap-1 font-label-sm text-label-sm transition-colors"
                                                    href="#"
                                                >
                                                    <span
                                                        className="material-symbols-outlined text-[18px]"
                                                        data-icon="code"
                                                    >
                                                        code
                                                    </span>{" "}
                                                    GitHub
                                                </a>
                                                <a
                                                    className="text-on-surface-variant hover:text-primary flex items-center gap-1 font-label-sm text-label-sm transition-colors"
                                                    href="#"
                                                >
                                                    <span
                                                        className="material-symbols-outlined text-[18px]"
                                                        data-icon="link"
                                                    >
                                                        link
                                                    </span>{" "}
                                                    LinkedIn
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className="px-3 py-1 rounded-lg bg-surface-container text-primary font-label-sm text-label-sm">
                                                Python
                                            </span>
                                            <span className="px-3 py-1 rounded-lg bg-surface-container text-primary font-label-sm text-label-sm">
                                                PyTorch
                                            </span>
                                            <span className="px-3 py-1 rounded-lg bg-surface-container text-primary font-label-sm text-label-sm">
                                                Computer Vision
                                            </span>
                                            <span className="px-3 py-1 rounded-lg bg-surface-container text-primary font-label-sm text-label-sm">
                                                React
                                            </span>
                                        </div>
                                        <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
                                            Passionate about building scalable AI solutions. I recently
                                            worked on a real-time object detection system for autonomous
                                            drones. Looking to join a team that values clean code and
                                            innovative problem-solving.
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <button className="flex-1 md:flex-none px-8 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md shadow-sm hover:bg-primary-container transition-all active:scale-95">
                                                Accept Request
                                            </button>
                                            <button className="flex-1 md:flex-none px-8 py-2.5 rounded-xl border border-outline text-on-surface-variant font-label-md text-label-md hover:bg-error-container hover:text-error hover:border-error transition-all active:scale-95">
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* Current Members */}
                        <section>
                            <h3 className="font-headline-md text-headline-md text-on-surface mb-6">
                                Current Members
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Member 1 */}
                                <div className="flex items-center gap-4 p-4 bg-surface-container-low border border-outline-variant rounded-xl hover:bg-surface-container transition-colors">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border border-outline-variant">
                                        <img
                                            className="w-full h-full object-cover"
                                            data-alt="A profile photo of a diverse female software developer with glasses, smiling warmly, in a minimalist office setting. Modern lighting, crisp details, professional atmosphere."
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsk7muPFHYbZe7Z-rUcABeLlGKC3fPcjQvlSlvDR2xQmsCdjD_N5AhN_FIpOxnBOoRFJLYbLp_sbVgThwqN61SNeKujEibFe8f5cuALXg14FqDKFra6QXhkb_QkJ9MaFs2NquGZyYUmOcXHcAxpytMjpzKqzdgt8y-bygB6f3e9Hwuc70pexiu63M8y-FeeoRKHQRbBWOnbK7Om1NIZFjccFbJeTi4Dct6x19p9enOjySz-zAc7WDkeiz2b5Zkyv7hciqBciIkhsI7"
                                        />
                                    </div>
                                    <div>
                                        <h5 className="font-label-md text-label-md text-on-surface">
                                            Sarah Chen (You)
                                        </h5>
                                        <p className="font-label-sm text-label-sm text-on-surface-variant">
                                            Team Lead • AI Research
                                        </p>
                                    </div>
                                </div>
                                {/* Member 2 */}
                                <div className="flex items-center gap-4 p-4 bg-surface-container-low border border-outline-variant rounded-xl hover:bg-surface-container transition-colors">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border border-outline-variant">
                                        <img
                                            className="w-full h-full object-cover"
                                            data-alt="A portrait of a male data scientist, calm expression, natural lighting, wearing a hoodie in a creative studio space. Professional high-quality photography, clean background."
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmxDoxVMYKdjLBI4LTyACovkoA7uosdPqmrae8x1N8ktTZL_u2lHHqBKZVBUlQBcWdpSUiUZd3cTPzyRjLO_jFUxCdutbIhy1pj8kvFx02gnLTAAPaQ4VlgTElAkYkQPBlfxbJrrgVrkg_9-VOh8rufjYPqqj7l23exRU5rNDr7p90wCxB5Eiex3SBJcTbCtAcZVDbubo4OWdf-lwjVcf-g8Uzrut7uEWkt3AR_S4ZeTb4nLPvdegGx8tz56WWbDgXgs38QzCGKN92"
                                        />
                                    </div>
                                    <div>
                                        <h5 className="font-label-md text-label-md text-on-surface">
                                            Marcus Thorne
                                        </h5>
                                        <p className="font-label-sm text-label-sm text-on-surface-variant">
                                            Data Engineering
                                        </p>
                                    </div>
                                </div>
                                {/* Member 3 */}
                                <div className="flex items-center gap-4 p-4 bg-surface-container-low border border-outline-variant rounded-xl hover:bg-surface-container transition-colors">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border border-outline-variant">
                                        <img
                                            className="w-full h-full object-cover"
                                            data-alt="A headshot of a female UX designer, stylish and professional, soft studio lighting. Minimalist professional aesthetic, sharp details."
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOV34IwdMrDUOuFd5cGHQYtCTtgkIj993EGhm9-yJWSvP8ysLpA36Eyx10SBESZ7PtNZ-jqAbctO84uEIXhN0ulGxY-MOal6nmIYo5CfFgxE2WHVy7JW4In6iX9VVmzMp6QU-rDqAbEYHywag67SFhv5TYwuu0VpHZSoNoqW9izgBggdmllvvhSLRJFcvdWDoxZYzArX5GFZZjZwfUw8QpsUlD2QUbx9Z5sXxCExbF2yOaUnRHtdNtnevMhuEzcADkOnLt0KDTiIJm"
                                        />
                                    </div>
                                    <div>
                                        <h5 className="font-label-md text-label-md text-on-surface">
                                            Elena Rodriguez
                                        </h5>
                                        <p className="font-label-sm text-label-sm text-on-surface-variant">
                                            Product Design
                                        </p>
                                    </div>
                                </div>
                                {/* Member 4 */}
                                <div className="flex items-center gap-4 p-4 bg-surface-container-low border border-outline-variant rounded-xl hover:bg-surface-container transition-colors">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border border-outline-variant">
                                        <img
                                            className="w-full h-full object-cover"
                                            data-alt="A professional portrait of a male backend developer, focused and friendly, indoor office lighting. High-end business casual photography."
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcTN_fBBPE7UutBfaFRRZX5sFqx7xFgBTx1xJWZiRZiervLaW8j6fXApyz-lC37L-9-e9zem29PdBNnzmcyQAyN5BXQRnQZJU4F-9qCLTVZICagRsqbzn0oDsZ1XJSE-X-4ntW4ODtewcEdOgt43G-kCdMWu9kE6aos01MOOH6bJajd7IsUooiOCYCt-wEDO8yZ-33jR5Li1s7yFFOes26hwW7mokDuPDIY25dtmumzZGDKBW6lmLtnkANsucN6c9xEoLszP2it_hF"
                                        />
                                    </div>
                                    <div>
                                        <h5 className="font-label-md text-label-md text-on-surface">
                                            James Wilson
                                        </h5>
                                        <p className="font-label-sm text-label-sm text-on-surface-variant">
                                            Cloud Infrastructure
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                    {/* Sidebar Info (Right) */}
                    <div className="space-y-stack_gap_lg">
                        {/* AI Insights Card */}
                        <div className="ai-gradient-border p-6 rounded-2xl shadow-lg">
                            <div className="flex items-center gap-2 mb-4">
                                <span
                                    className="material-symbols-outlined text-secondary"
                                    data-icon="auto_awesome"
                                    style={{ fontVariationSettings: '"FILL" 1' }}
                                >
                                    auto_awesome
                                </span>
                                <h4 className="font-label-md text-label-md text-secondary font-bold uppercase tracking-wide">
                                    AI Recommendation
                                </h4>
                            </div>
                            <p className="font-body-md text-body-md text-on-surface mb-4">
                                Based on your project "NeuralMesh", Alex Rivera's experience with{" "}
                                <strong>PyTorch</strong> and <strong>Computer Vision</strong> makes
                                them a <span className="text-primary font-bold">94% match</span> for
                                your team's technical gaps.
                            </p>
                            <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: "94%" }} />
                            </div>
                        </div>
                        {/* Team Stats */}
                        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant">
                            <h4 className="font-title-lg text-title-lg text-on-surface mb-4">
                                Project Progress
                            </h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-label-md text-label-md text-on-surface-variant">
                                        Architecture
                                    </span>
                                    <span className="font-mono text-label-md text-primary">85%</span>
                                </div>
                                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: "85%" }} />
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-label-md text-label-md text-on-surface-variant">
                                        Frontend Mockups
                                    </span>
                                    <span className="font-mono text-label-md text-primary">40%</span>
                                </div>
                                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: "40%" }} />
                                </div>
                            </div>
                            <button className="w-full mt-6 py-2.5 rounded-xl border border-primary text-primary font-label-md text-label-md hover:bg-primary-container hover:text-on-primary-container transition-colors">
                                View Roadmap
                            </button>
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
            {/* Bottom Navigation Shell (Shared Component Mapping) */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 pb-safe bg-surface dark:bg-surface-dim shadow-[0_-1px_12px_rgba(59,130,246,0.08)]">
                <a
                    className="flex flex-col items-center justify-center text-on-surface-variant py-1 px-4 hover:bg-surface-container-high transition-colors active:scale-90 duration-200"
                    href="index.html"
                >
                    <span className="material-symbols-outlined" data-icon="home">
                        home
                    </span>
                    <span className="font-label-sm text-label-sm">Home</span>
                </a>
                <a
                    className="flex flex-col items-center justify-center text-on-surface-variant py-1 px-4 hover:bg-surface-container-high transition-colors active:scale-90 duration-200"
                    href="explore.html"
                >
                    <span className="material-symbols-outlined" data-icon="explore">
                        explore
                    </span>
                    <span className="font-label-sm text-label-sm">Explore</span>
                </a>
                <a
                    className="flex flex-col items-center justify-center text-on-surface-variant py-1 px-4 hover:bg-surface-container-high transition-colors active:scale-90 duration-200"
                    href="notifications.html"
                >
                    <span className="material-symbols-outlined" data-icon="notifications">
                        notifications
                    </span>
                    <span className="font-label-sm text-label-sm">Alerts</span>
                </a>
                <a
                    className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-xl py-1 px-4 active:scale-90 duration-200"
                    href="profile.html"
                >
                    <span
                        className="material-symbols-outlined"
                        data-icon="person"
                        style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                        person
                    </span>
                    <span className="font-label-sm text-label-sm">Profile</span>
                </a>
            </nav>
        </>
    )
}
