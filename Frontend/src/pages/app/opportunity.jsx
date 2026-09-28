import { useTranslation } from 'react-i18next'

export default function Opportunity() {
    const { t } = useTranslation()
    return (
        <>
            <meta charSet="utf-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <title>{t('opportunity.title')} | EVENTIFY</title>
            <meta
                name="description"
                content={t('opportunity.aboutText')}
            />
            <meta
                property="og:title"
                content={`${t('opportunity.title')} | EVENTIFY`}
            />
            <meta
                property="og:description"
                content={t('opportunity.aboutText')}
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
                        "\n    \n    .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; vertical-align: middle; }\n"
                }}
            />
            {/* Top Navigation Bar */}
            <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm h-16 flex items-center">
                <div className="flex justify-between items-center px-container-margin-mobile md:px-container-margin-desktop w-full max-w-[1280px] mx-auto">
                    <div className="flex items-center gap-8">
                        <a
                            className="flex items-center gap-2 font-headline-lg-mobile text-headline-lg-mobile font-bold tracking-tight text-primary"
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
                        <div className="hidden md:flex gap-6">
                            <a
                                className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
                                href="index.html"
                            >
                                {t('opportunity.home')}
                            </a>
                            <a
                                className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
                                href="explore.html"
                            >
                                {t('opportunity.explore')}
                            </a>
                            <a
                                className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
                                href="posts.html"
                            >
                                {t('opportunity.posts')}
                            </a>
                            <a
                                className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
                                href="my-applications.html"
                            >
                                {t('opportunity.myEvent')}
                            </a>
                            <a
                                className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
                                href="notifications.html"
                            >
                                {t('opportunity.notifications')}
                            </a>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            className="theme-toggle w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
                            title={t('nav.toggleTheme')}
                            aria-label={t('nav.toggleTheme')}
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
                            {t('opportunity.rafeeq')}
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
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant mb-4">
                    <a className="hover:text-primary transition-colors" href="explore.html">
                        {t('opportunity.explore')}
                    </a>
                    <span>/</span>
                    <span className="text-on-surface">{t('opportunity.title')}</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
                    {/* Main Column */}
                    <div className="ev-fade-up lg:col-span-2 space-y-6">
                        <div className="rounded-xl overflow-hidden h-64 md:h-80 relative">
                            <img
                                className="w-full h-full object-cover"
                                data-alt="A dynamic digital art piece representing a global coding hackathon with glowing blue circuit lines flowing through a futuristic city skyline."
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9CEnFNI0sa64wtdt1xcbuCO2ctuePljYf3b0mGoAfsaVbTQZl6EUEKGeq_A-lCje6-84UGOy-xM_EX1fj34sF-YWMO-_0SG4_iedT1vjYrRw5UpEFxOlngZ_cDhCxJRFxyyChSuzfbQzaifbDrY-ySQm0SZNqdXFNpNdzVSiaboP2NAJ4pYTV-P32G1lYqug8kLksnCytiGNYKiUHGIacjDYyZIZ5HHucNTeyCLWQmzn3HRdmrm8n18EIgGN0AobDjfqjTG3DQkjK"
                            />
                            <div className="absolute top-4 right-4 px-3 py-1.5 bg-secondary text-white rounded-lg font-label-sm flex items-center gap-1 shadow-lg">
                                <span className="material-symbols-outlined text-[16px]">bolt</span>{" "}
                                98% {t('opportunity.match')}
                            </div>
                        </div>
                        <div>
                            <span className="font-label-sm text-label-sm uppercase text-secondary">
                                {t('opportunity.category')}
                            </span>
                            <h1 className="font-headline-xl text-headline-xl mt-1">
                                {t('opportunity.title')}
                            </h1>
                            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                                {t('opportunity.by')}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 mt-4 text-on-surface-variant font-label-sm">
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[18px]">
                                        calendar_month
                                    </span>{" "}
                                    {t('opportunity.date')}
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[18px]">
                                        location_on
                                    </span>{" "}
                                    {t('opportunity.remote')}
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[18px]">
                                        groups
                                    </span>{" "}
                                    {t('opportunity.teams')}
                                </span>
                                <span className="flex items-center gap-1 text-tertiary font-bold">
                                    <span className="material-symbols-outlined text-[18px]">
                                        military_tech
                                    </span>{" "}
                                    {t('opportunity.prize')}
                                </span>
                            </div>
                        </div>
                        <div className="border-t border-outline-variant/30 pt-6 space-y-3">
                            <h2 className="font-title-lg text-title-lg">{t('opportunity.aboutTitle')}</h2>
                            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                                {t('opportunity.aboutText')}
                            </p>
                        </div>
                        <div className="space-y-3">
                            <h2 className="font-title-lg text-title-lg">{t('opportunity.requirements')}</h2>
                            <ul className="space-y-2 font-body-md text-body-md text-on-surface-variant">
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-tertiary text-[20px]">
                                        check_circle
                                    </span>{" "}
                                    {t('opportunity.requirement1')}
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-tertiary text-[20px]">
                                        check_circle
                                    </span>{" "}
                                    {t('opportunity.requirement2')}
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-tertiary text-[20px]">
                                        check_circle
                                    </span>{" "}
                                    {t('opportunity.requirement3')}
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h2 className="font-title-lg text-title-lg">
                                {t('opportunity.skills')}
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 rounded-lg bg-primary/5 text-primary font-label-sm text-label-sm border border-primary/10">
                                    Python
                                </span>
                                <span className="px-3 py-1 rounded-lg bg-primary/5 text-primary font-label-sm text-label-sm border border-primary/10">
                                    {t('opportunity.machineLearning')}
                                </span>
                                <span className="px-3 py-1 rounded-lg bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                                    React
                                </span>
                                <span className="px-3 py-1 rounded-lg bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                                    {t('opportunity.productDesign')}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Sidebar */}
                    <div className="ev-fade-up ev-stagger-1 space-y-6">
                        <div className="ev-card spotlight bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm space-y-4 sticky top-24">
                            <div className="flex items-center justify-between">
                                <span className="font-label-sm text-label-sm text-on-surface-variant">
                                    {t('opportunity.deadline')}
                                </span>
                                <span className="font-label-md text-label-md text-error font-bold">
                                    {t('opportunity.daysLeft')}
                                </span>
                            </div>
                            <a
                                className="btn-primary w-full py-3.5 font-label-lg"
                                href="participation-type.html"
                            >
                                {t('opportunity.apply')}
                            </a>
                            <button className="btn-secondary w-full py-3 font-label-md flex items-center justify-center gap-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors">
                                <span className="material-symbols-outlined text-[18px]">
                                    bookmark
                                </span>{" "}
                                {t('opportunity.save')}
                            </button>
                            <div className="border-t border-outline-variant/30 pt-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                                    <span
                                        className="material-symbols-outlined text-secondary"
                                        style={{ fontVariationSettings: '"FILL" 1' }}
                                    >
                                        smart_toy
                                    </span>
                                </div>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">
                                    {t('opportunity.ask')}{" "}
                                    <a
                                        className="text-primary font-semibold hover:underline"
                                        href="rafeeq.html"
                                    >
                                        Rafeeq
                                    </a>{" "}
                                    {t('opportunity.askRafeeq')}
                                </p>
                            </div>
                        </div>
                        <div className="ev-card spotlight bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm space-y-4">
                            <h3 className="font-title-md text-title-md">{t('opportunity.availableTeams')}</h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                {t('opportunity.teamsRecruiting')}
                            </p>
                            <a
                                className="w-full block text-center border border-primary text-primary font-label-md text-label-md py-2.5 rounded-lg hover:bg-primary/5 transition-colors"
                                href="teams.html"
                            >
                                {t('opportunity.browseTeams')}
                            </a>
                        </div>
                        <div className="ev-card spotlight bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm space-y-3">
                            <h3 className="font-title-md text-title-md">{t('opportunity.similar')}</h3>
                            <a className="flex items-center gap-3 group" href="opportunity.html">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-primary">
                                        bolt
                                    </span>
                                </div>
                                <div>
                                    <p className="font-label-md text-label-md group-hover:text-primary transition-colors">
                                        Frontend Wizards 2024
                                    </p>
                                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                                        {t('opportunity.competitionLondon')}
                                    </p>
                                </div>
                            </a>
                            <a className="flex items-center gap-3 group" href="opportunity.html">
                                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-secondary">
                                        school
                                    </span>
                                </div>
                                <div>
                                    <p className="font-label-md text-label-md group-hover:text-primary transition-colors">
                                        Deep Learning Mastery
                                    </p>
                                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                                        {t('opportunity.workshopHybrid')}
                                    </p>
                                </div>
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
                                {t('opportunity.footerDescription')}
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
                            <h4>{t('opportunity.explore')}</h4>
                            <ul>
                                <li>
                                    <a href="index.html">{t('opportunity.home')}</a>
                                </li>
                                <li>
                                    <a href="explore.html">{t('opportunity.explore')}</a>
                                </li>
                                <li>
                                    <a href="posts.html">{t('opportunity.posts')}</a>
                                </li>
                                <li>
                                    <a href="my-applications.html">{t('opportunity.myEvent')}</a>
                                </li>
                                <li>
                                    <a href="notifications.html">{t('opportunity.notifications')}</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4>{t('opportunity.support')}</h4>
                            <ul>
                                <li>
                                    <a href="../The%20Visitor/about.html">About</a>
                                </li>
                                <li>
                                    <a href="../The%20Visitor/landing.html#faq">{t('opportunity.faq')}</a>
                                </li>
                                <li>
                                    <a href="../The%20Visitor/contact.html">Contact</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <span>{t('opportunity.rights')}</span>
                        <span>·</span>
                        <a href="../auth/privacy.html">{t('opportunity.privacy')}</a>
                        <span>·</span>
                        <a href="../auth/terms.html">{t('opportunity.terms')}</a>
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
                    <span className="font-label-sm text-label-sm">{t('opportunity.home')}</span>
                </a>
                <a
                    className="flex flex-col items-center justify-center text-secondary bg-secondary-container/20 rounded-xl px-3 py-1 transition-transform active:scale-90"
                    href="explore.html"
                >
                    <span className="material-symbols-outlined">explore</span>
                    <span className="font-label-sm text-label-sm">{t('opportunity.explore')}</span>
                </a>
                <a
                    className="flex flex-col items-center justify-center text-on-surface-variant transition-transform active:scale-90"
                    href="posts.html"
                >
                    <span className="material-symbols-outlined">campaign</span>
                    <span className="font-label-sm text-label-sm">{t('opportunity.posts')}</span>
                </a>
                <a
                    className="flex flex-col items-center justify-center text-on-surface-variant transition-transform active:scale-90"
                    href="rafeeq.html"
                >
                    <span className="material-symbols-outlined">smart_toy</span>
                    <span className="font-label-sm text-label-sm">{t('opportunity.rafeeq')}</span>
                </a>
                <a
                    className="flex flex-col items-center justify-center text-on-surface-variant transition-transform active:scale-90"
                    href="profile.html"
                >
                    <span className="material-symbols-outlined">person</span>
                    <span className="font-label-sm text-label-sm">{t('nav.profile', 'Profile')}</span>
                </a>
            </nav>
        </>
    )
}
