import { useNavigate } from 'react-router-dom'

export default function CreateTeam() {
    const navigate = useNavigate()

    return (
        <>
            <meta charSet="utf-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <title>Create Your Team - Eventify</title>
            <meta
                name="description"
                content="Create Your Team - Eventify on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
            />
            <meta property="og:title" content="Create Your Team - Eventify" />
            <meta
                property="og:description"
                content="Create Your Team - Eventify on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
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
            {/* Google Fonts: Inter */}
            {/* Material Symbols Outlined */}
            {/* Tailwind CSS */}
            {/* Tailwind Config */}
            <style
                dangerouslySetInnerHTML={{
                    __html:
                        "\n        .material-symbols-outlined {\n            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n            vertical-align: middle;\n        }\n        .glass-header {\n            background: rgba(250, 248, 255, 0.8);\n            backdrop-filter: blur(12px);\n        }\n        .step-gradient {\n            background: linear-gradient(90deg, #FF4D2E 0%, #0E1116 100%);\n        }\n        .soft-shadow {\n            box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.08);\n        }\n        input:focus, textarea:focus, select:focus {\n            outline: none !important;\n            border-color: #FF4D2E !important;\n            box-shadow: 0 0 0 3px rgba(255, 77, 46, 0.1) !important;\n        }\n    "
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
            <div className="min-h-[calc(100vh-64px)] flex flex-col">
                {/* Main Content Area */}
                <main className="w-full max-w-7xl mx-auto px-4 md:px-gutter py-10 flex flex-col items-center flex-grow">
                    {/* Form Header & Progress */}
                    <div className="w-full max-w-2xl mb-10 text-center md:text-left ev-fade-up ev-stagger-1">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                            <div>
                                <h1 className="font-headline-lg text-headline-lg mb-2">
                                    Create Your Team
                                </h1>
                                <p className="text-on-surface-variant font-body-md">
                                    Assemble the perfect crew for your next breakthrough project.
                                </p>
                            </div>
                            <div className="flex flex-col items-center md:items-end gap-2">
                                <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">
                                    Step 2 of 3
                                </span>
                                <div className="w-32 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                                    <div className="h-full step-gradient w-[66%]" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Main Form Card */}
                    <div className="w-full max-w-2xl bg-surface-container-lowest p-8 rounded-xl soft-shadow border border-outline-variant/30 ev-fade-up ev-stagger-2">
                        <form
                            className="flex flex-col gap-8"
                            onSubmit={(event) => {
                                event.preventDefault()
                                navigate('/app/team-dashboard')
                            }}
                        >
                            {/* Team Identity Section */}
                            <section className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label
                                            className="font-label-md text-label-md text-on-surface"
                                            htmlFor="team-name"
                                        >
                                            Team Name
                                        </label>
                                        <input
                                            className="input-primary h-12"
                                            id="team-name"
                                            placeholder="e.g. Phoenix Innovators"
                                            required=""
                                            type="text"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label
                                            className="font-label-md text-label-md text-on-surface"
                                            htmlFor="team-desc"
                                        >
                                            Team Description
                                        </label>
                                        <textarea
                                            className="input-primary resize-none"
                                            id="team-desc"
                                            placeholder="Briefly describe your team's mission and goals..."
                                            required=""
                                            rows={4}
                                            defaultValue={""}
                                        />
                                    </div>
                                </div>
                            </section>
                            {/* Team Configuration */}
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label
                                        className="font-label-md text-label-md text-on-surface"
                                        htmlFor="max-members"
                                    >
                                        Maximum Members
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="input-primary h-12 appearance-none"
                                            id="max-members"
                                        >
                                            <option value={2}>2 Members</option>
                                            <option selected="" value={4}>
                                                4 Members
                                            </option>
                                            <option value={6}>6 Members</option>
                                            <option value={8}>8 Members</option>
                                            <option value="10+">10+ Members</option>
                                        </select>
                                        <span
                                            className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant"
                                            data-icon="expand_more"
                                        >
                                            expand_more
                                        </span>
                                    </div>
                                </div>
                                {/* Visibility Toggle */}
                                <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg border border-outline-variant/50">
                                    <div className="flex flex-col">
                                        <span className="font-label-md text-label-md">
                                            Looking for Members
                                        </span>
                                        <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
                                            Visible in Explore
                                        </span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            defaultChecked=""
                                            className="sr-only peer"
                                            type="checkbox"
                                            defaultValue=""
                                        />
                                        <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                                    </label>
                                </div>
                            </section>
                            {/* Skills Multi-Select (Chips) */}
                            <section className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <label className="font-label-md text-label-md text-on-surface">
                                        Required Skills
                                    </label>
                                    <span className="font-label-sm text-label-sm uppercase text-primary bg-primary-fixed px-2 py-0.5 rounded">
                                        AI Suggestions Available
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2 p-4 bg-white border border-outline-variant rounded-lg min-h-[64px]">
                                    {/* React Chip */}
                                    <div className="flex items-center gap-1.5 bg-primary-fixed text-on-primary-fixed px-3 py-1.5 rounded-full font-label-sm text-label-sm">
                                        <span>React</span>
                                        <button
                                            className="hover:text-error transition-colors"
                                            type="button"
                                            aria-label="Close"
                                        >
                                            <span
                                                className="material-symbols-outlined !text-[16px]"
                                                data-icon="close"
                                            >
                                                close
                                            </span>
                                        </button>
                                    </div>
                                    {/* Tailwind Chip */}
                                    <div className="flex items-center gap-1.5 bg-primary-fixed text-on-primary-fixed px-3 py-1.5 rounded-full font-label-sm text-label-sm">
                                        <span>Tailwind</span>
                                        <button
                                            className="hover:text-error transition-colors"
                                            type="button"
                                            aria-label="Close"
                                        >
                                            <span
                                                className="material-symbols-outlined !text-[16px]"
                                                data-icon="close"
                                            >
                                                close
                                            </span>
                                        </button>
                                    </div>
                                    {/* AI Models Chip */}
                                    <div className="flex items-center gap-1.5 bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1.5 rounded-full font-label-sm text-label-sm">
                                        <span>AI Models</span>
                                        <button
                                            className="hover:text-error transition-colors"
                                            type="button"
                                            aria-label="Close"
                                        >
                                            <span
                                                className="material-symbols-outlined !text-[16px]"
                                                data-icon="close"
                                            >
                                                close
                                            </span>
                                        </button>
                                    </div>
                                    <input
                                        className="flex-1 min-w-[120px] border-none p-0 focus:ring-0 text-label-md bg-transparent"
                                        placeholder="Add more..."
                                        type="text"
                                    />
                                </div>
                            </section>
                            {/* Form Actions */}
                            <div className="flex items-center justify-between pt-6 border-t border-outline-variant ev-fade-up ev-stagger-3">
                                <a
                                    className="px-6 py-3 text-on-surface-variant font-label-md hover:bg-surface-container-low rounded-xl transition-all active:scale-95"
                                    href="participation-type.html"
                                >
                                    Back
                                </a>
                                <button
                                    className="btn-primary px-10 py-3"
                                    type="submit"
                                >
                                    Create Team
                                </button>
                            </div>
                        </form>
                    </div>
                    {/* Secondary Visual Context (AI Recommendation Preview) */}
                    <div className="w-full max-w-2xl mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 ev-fade-up ev-stagger-4">
                        <div className="p-6 rounded-xl border border-dashed border-outline-variant flex items-center gap-4 opacity-70">
                            <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center">
                                <span
                                    className="material-symbols-outlined text-outline"
                                    data-icon="lightbulb"
                                >
                                    lightbulb
                                </span>
                            </div>
                            <div>
                                <p className="font-label-md text-on-surface-variant">Pro Tip</p>
                                <p className="font-body-sm text-body-sm text-outline">
                                    Teams with 4+ members have 35% higher success rate.
                                </p>
                            </div>
                        </div>
                        <div className="p-6 rounded-xl border border-dashed border-outline-variant flex items-center gap-4 opacity-70">
                            <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center">
                                <span
                                    className="material-symbols-outlined text-outline"
                                    data-icon="auto_awesome"
                                >
                                    auto_awesome
                                </span>
                            </div>
                            <div>
                                <p className="font-label-md text-on-surface-variant">Auto-Match</p>
                                <p className="font-body-sm text-body-sm text-outline">
                                    AI will notify potential members after creation.
                                </p>
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
            {/* Mobile Navigation Shell (Shared Component) */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 pb-safe bg-surface dark:bg-surface-dim shadow-[0_-1px_12px_rgba(59,130,246,0.08)]">
                <a
                    className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant py-1 px-4 hover:bg-surface-container-high active:scale-90 duration-200"
                    href="index.html"
                >
                    <span className="material-symbols-outlined" data-icon="home">
                        home
                    </span>
                    <span className="font-label-sm text-label-sm">Home</span>
                </a>
                <a
                    className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant py-1 px-4 hover:bg-surface-container-high active:scale-90 duration-200"
                    href="explore.html"
                >
                    <span className="material-symbols-outlined" data-icon="explore">
                        explore
                    </span>
                    <span className="font-label-sm text-label-sm">Explore</span>
                </a>
                <a
                    className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-xl py-1 px-4 active:scale-90 duration-200"
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
