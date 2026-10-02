import AppFooter from '../../components/app/AppFooter'
import AppPageHead from '../../components/app/AppPageHead'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'

const RAFEEQ_GRADIENT = 'linear-gradient(135deg, #FF4D2E 0%, #0E1116 100%)'

const MESSAGES = [
    {
        role: 'ai',
        text: {
            en: "Hi! I'm Rafeeq, your AI companion. Ready to help you find the right opportunity — want me to check what matches your skills right now?",
            ar: 'مرحباً! أنا رفيق، مرافقك الذكي. هل تريد أن أبحث عن الفرص المناسبة لمهاراتك الآن؟',
        },
    },
    {
        role: 'user',
        text: {
            en: 'Yes, what matches my Python and machine learning skills?',
            ar: 'نعم، ما الفرص المناسبة لمهاراتي في Python والتعلم الآلي؟',
        },
    },
    {
        role: 'ai',
        text: {
            en: <>I found 3 strong matches. The top one is a <strong>98% match</strong> — the Global AI Innovation Challenge, a hackathon focused on applied AI. Want me to summarize it or check your compatibility in detail?</>,
            ar: <>وجدت 3 تطابقات قوية. الأفضل هو تطابق <strong>98%</strong> — تحدي الابتكار العالمي بالذكاء الاصطناعي، هاكاثون متخصص في الذكاء الاصطناعي التطبيقي. هل تريد ملخصاً أو فحص التوافق بالتفصيل؟</>,
        },
        actions: [
            { icon: 'summarize',  iconColor: '#FF4D2E',              to: '/app/opportunity', label: { en: 'Summarize it',        ar: 'تلخيصه' } },
            { icon: 'target',     iconColor: 'var(--color-secondary)', to: '/app/opportunity', label: { en: 'Check compatibility', ar: 'فحص التوافق' } },
            { icon: 'explore',    iconColor: 'var(--color-tertiary)',  to: '/app/explore',     label: { en: 'Show more matches',   ar: 'عرض المزيد' } },
        ],
    },
]

export default function Rafeeq() {
    const { language } = useLanguage()
    const ar = language === 'ar'
    const navigate = useNavigate()
    const location = useLocation()
    const [message, setMessage] = useState(location.state?.transcript || '')

    return (
        <>
            <AppPageHead title="Rafeeq AI | EVENTIFY" />

            {/* Top Bar */}
            <header className="sticky top-0 z-50 w-full h-16 border-b border-outline-variant/30 backdrop-blur-md flex items-center px-container-margin-mobile md:px-container-margin-desktop" style={{ backgroundColor: 'rgba(var(--color-surface-rgb, 250 248 255) / 0.9)' }}>
                <div className="flex flex-wrap justify-between items-center gap-y-2 w-full max-w-[900px] mx-auto">
                    {/* Back */}
                    <Link
                        className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors"
                        to="/app"
                    >
                        <span className="material-symbols-outlined">{ar ? 'arrow_forward' : 'arrow_back'}</span>
                        <span className="font-label-md text-label-md">{ar ? 'رجوع' : 'Back'}</span>
                    </Link>

                    {/* Brand + demo badge */}
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: RAFEEQ_GRADIENT }}>
                            <span className="material-symbols-outlined text-white" style={{ fontSize: 20 }}>smart_toy</span>
                        </div>
                        <span className="font-title-md text-title-md">{ar ? 'رفيق' : 'Rafeeq'}</span>
                        <span className="px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-surface-container-highest text-on-surface-variant uppercase tracking-wide">
                            Demo
                        </span>
                    </div>

                    {/* Mode toggle */}
                    <div className="flex bg-surface-container rounded-full p-1">
                        <button
                            type="button"
                            className="px-4 py-1.5 rounded-full font-label-sm text-label-sm transition-all"
                            style={{ backgroundColor: '#fff', color: '#FF4D2E', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
                            aria-current="page"
                        >
                            {ar ? 'نص' : 'Text'}
                        </button>
                        <button
                            type="button"
                            className="px-4 py-1.5 rounded-full font-label-sm text-label-sm text-on-surface-variant transition-all hover:text-on-surface"
                            onClick={() => navigate('/app/rafeeq/voice')}
                        >
                            {ar ? 'صوت' : 'Voice'}
                        </button>
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <main
                className="flex-1 max-w-[900px] w-full mx-auto px-container-margin-mobile md:px-container-margin-desktop py-8 flex flex-col gap-6 pb-28"
                dir={ar ? 'rtl' : 'ltr'}
            >
                <p className="self-center text-center font-body-sm text-body-sm text-on-surface-variant">
                    {ar
                        ? 'هذه محادثة تجريبية بردود جاهزة — لا يوجد ذكاء اصطناعي حقيقي متصل.'
                        : 'This is a demo conversation with pre-written replies — no live AI is connected.'}
                </p>

                {MESSAGES.map((msg, i) => (
                    <div key={i} className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : ''}`}>
                        {msg.role === 'ai' && (
                            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: RAFEEQ_GRADIENT }}>
                                <span className="material-symbols-outlined text-white" style={{ fontSize: 18 }}>smart_toy</span>
                            </div>
                        )}

                        {msg.role === 'ai' ? (
                            <div className="space-y-3">
                                <div
                                    className={`rounded-2xl px-5 py-3.5 font-body-md text-body-md ${ar ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
                                    style={{ backgroundColor: '#ffffff', border: '1px solid #c2c6d6', color: '#0d1c2e' }}
                                >
                                    {ar ? msg.text.ar : msg.text.en}
                                </div>
                                {msg.actions && (
                                    <div className="flex flex-wrap gap-2">
                                        {msg.actions.map((action) => (
                                            <Link
                                                key={action.icon}
                                                to={action.to}
                                                className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-label-sm text-label-sm hover:border-[#FF4D2E]/50 transition-colors flex items-center gap-1"
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: 16, color: action.iconColor }}>{action.icon}</span>
                                                {ar ? action.label.ar : action.label.en}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div
                                className={`rounded-2xl px-5 py-3.5 font-body-md text-body-md ${ar ? 'rounded-tl-sm' : 'rounded-tr-sm'}`}
                                style={{ backgroundColor: '#FF4D2E', color: '#ffffff' }}
                            >
                                {ar ? msg.text.ar : msg.text.en}
                            </div>
                        )}
                    </div>
                ))}
            </main>

            {/* Text Input Bar */}
            <div className="sticky bottom-0 w-full backdrop-blur-md border-t border-outline-variant/30 p-4 bg-surface/95">
                <form
                    className="max-w-[900px] mx-auto flex items-center gap-3"
                    dir={ar ? 'rtl' : 'ltr'}
                    onSubmit={(e) => e.preventDefault()}
                >
                    <input
                        className="flex-1 min-w-0 h-12 px-5 bg-surface-container-lowest border border-outline-variant rounded-full focus:outline-none transition-all font-body-md"
                        placeholder={ar ? 'اسأل رفيق عن أي فرصة...' : 'Ask Rafeeq anything about opportunities…'}
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md hover:scale-105 transition-transform flex-shrink-0"
                        style={{ background: RAFEEQ_GRADIENT }}
                        type="submit"
                        aria-label={ar ? 'إرسال' : 'Send message'}
                    >
                        <span className="material-symbols-outlined">{ar ? 'send' : 'send'}</span>
                    </button>
                </form>
            </div>

            <AppFooter />
        </>
    )
}
