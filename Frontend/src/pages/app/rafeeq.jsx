import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Rafeeq() {
    const navigate = useNavigate()
    const location = useLocation()
    const [message, setMessage] = useState(location.state?.transcript || '')

    return (
        <>
            <meta charSet="utf-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <title>Rafeeq AI | EVENTIFY</title>
            <meta
                name="description"
                content="Rafeeq AI on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
            />
            <meta property="og:title" content="Rafeeq AI | EVENTIFY" />
            <meta
                property="og:description"
                content="Rafeeq AI on EVENTIFY — the AI-powered hub for competitions, workshops, courses and internships."
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
                        "\n    \n    .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; vertical-align: middle; }\n    .rafeeq-gradient { background: linear-gradient(135deg, #FF4D2E 0%, #0E1116 100%); }\n    .bubble-ai { background: #ffffff; border: 1px solid #c2c6d6; color: #0d1c2e; }\n    html.dark .bubble-ai { background: #1d2a3a; border-color: rgba(255,255,255,.14); color: #f8f9ff; }\n    html.dark .mode-active { background: #FF4D2E; color: #ffffff; }\n    .bubble-user { background: #FF4D2E; color: #fff; }\n    .mode-active { background: #fff; color: #FF4D2E; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }\n"
                }}
            />
            {/* Top Bar */}
            <header className="sticky top-0 z-50 w-full h-16 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 flex items-center px-container-margin-mobile md:px-container-margin-desktop">
                <div className="flex flex-wrap justify-between items-center gap-y-2 w-full max-w-[900px] mx-auto">
                    <a
                        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
                        href="index.html"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span className="font-label-md text-label-md">Back</span>
                    </a>
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full rafeeq-gradient flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-[20px]">
                                smart_toy
                            </span>
                        </div>
                        <span className="font-title-md text-title-md">Rafeeq</span>
                    </div>
                    <div className="flex bg-surface-container rounded-full p-1">
                        <button
                            className="mode-active px-4 py-1.5 rounded-full font-label-sm text-label-sm transition-all"
                            id="text-mode-btn"
                            type="button"
                            aria-current="page"
                        >
                            Text
                        </button>
                        <button
                            className="px-4 py-1.5 rounded-full font-label-sm text-label-sm text-on-surface-variant transition-all"
                            id="voice-mode-btn"
                            type="button"
                            onClick={() => navigate('/app/rafeeq/voice')}
                        >
                            Voice
                        </button>
                    </div>
                </div>
            </header>
            {/* Chat Area */}
            <main
                className="flex-1 max-w-[900px] w-full mx-auto px-container-margin-mobile md:px-container-margin-desktop py-8 flex flex-col gap-6"
                id="chat-log"
            >
                <p className="self-center text-center font-body-sm text-body-sm text-on-surface-variant">
                    Sample conversation with pre-written replies; live AI is not connected.
                </p>
                <div className="flex gap-3 max-w-[80%]">
                    <div className="w-9 h-9 rounded-full rafeeq-gradient flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-white text-[18px]">
                            smart_toy
                        </span>
                    </div>
                    <div className="bubble-ai rounded-2xl rounded-tl-sm px-5 py-3.5 font-body-md text-body-md">
                        Hi! I'm Rafeeq, your AI voice companion. Ready to help you find the
                        right opportunity — want me to check what matches your skills right now?
                    </div>
                </div>
                <div className="flex gap-3 max-w-[80%] self-end flex-row-reverse">
                    <div className="bubble-user rounded-2xl rounded-tr-sm px-5 py-3.5 font-body-md text-body-md">
                        Yes, what matches my Python and machine learning skills?
                    </div>
                </div>
                <div className="flex gap-3 max-w-[80%]">
                    <div className="w-9 h-9 rounded-full rafeeq-gradient flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-white text-[18px]">
                            smart_toy
                        </span>
                    </div>
                    <div className="space-y-3">
                        <div className="bubble-ai rounded-2xl rounded-tl-sm px-5 py-3.5 font-body-md text-body-md">
                            I found 3 strong matches. The top one is a <strong>98% match</strong>{" "}
                            — the Global AI Innovation Challenge, a hackathon focused on applied
                            AI. Want me to summarize it or check your compatibility in detail?
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <a
                                className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-label-sm text-label-sm hover:border-primary/50 transition-colors flex items-center gap-1"
                                href="opportunity.html"
                            >
                                <span className="material-symbols-outlined text-[16px] text-primary">
                                    summarize
                                </span>{" "}
                                Summarize it
                            </a>
                            <a
                                className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-label-sm text-label-sm hover:border-primary/50 transition-colors flex items-center gap-1"
                                href="opportunity.html"
                            >
                                <span className="material-symbols-outlined text-[16px] text-secondary">
                                    target
                                </span>{" "}
                                Check compatibility
                            </a>
                            <a
                                className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-label-sm text-label-sm hover:border-primary/50 transition-colors flex items-center gap-1"
                                href="explore.html"
                            >
                                <span className="material-symbols-outlined text-[16px] text-tertiary">
                                    explore
                                </span>{" "}
                                Show more matches
                            </a>
                        </div>
                    </div>
                </div>
            </main>
            {/* Text Input Bar */}
            <div
                className="sticky bottom-0 w-full bg-surface/95 backdrop-blur-md border-t border-outline-variant/30 p-4"
                id="text-input-bar"
            >
                <form
                    className="max-w-[900px] mx-auto flex items-center gap-3"
                    onSubmit={(event) => event.preventDefault()}
                >
                    <input
                        className="flex-1 min-w-0 h-12 px-5 bg-surface-container-lowest border border-outline-variant rounded-full focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-body-md"
                        placeholder="Ask Rafeeq anything about opportunities…"
                        type="text"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                    />
                    <button
                        className="w-12 h-12 rafeeq-gradient rounded-full flex items-center justify-center text-white shadow-md hover:scale-105 transition-transform flex-shrink-0"
                        type="submit"
                        aria-label="Send message"
                    >
                        <span className="material-symbols-outlined">send</span>
                    </button>
                </form>
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
                                    <a href="my-applications.html">My Applications</a>
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
        </>
    )
}
