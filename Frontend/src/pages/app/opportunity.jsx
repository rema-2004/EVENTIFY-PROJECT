import AppFooter from '../../components/app/AppFooter'
import AppPageHead from '../../components/app/AppPageHead'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'

const REQUIREMENTS = [
    { en: 'Basic programming experience (any language)', ar: 'خبرة برمجية أساسية (أي لغة)' },
    { en: 'A laptop and stable internet connection',     ar: 'جهاز كمبيوتر محمول واتصال إنترنت مستقر' },
    { en: 'Willingness to work in a team of 2–4',       ar: 'الاستعداد للعمل ضمن فريق مكون من 2–4 أشخاص' },
]

const SKILLS = [
    { label: 'Python',          matched: true },
    { label: { en: 'Machine Learning', ar: 'التعلم الآلي' }, matched: true },
    { label: 'React',           matched: false },
    { label: { en: 'Product Design', ar: 'تصميم المنتج' }, matched: false },
]

const SIMILAR = [
    { icon: 'bolt',   color: 'text-primary',   bg: 'bg-primary/10',   title: 'Frontend Wizards 2026', sub: { en: 'Competition · London, UK', ar: 'مسابقة · لندن، المملكة المتحدة' } },
    { icon: 'school', color: 'text-secondary',  bg: 'bg-secondary/10', title: 'Deep Learning Mastery', sub: { en: 'Workshop · Hybrid',         ar: 'ورشة عمل · هجين' } },
]

export default function Opportunity() {
    const { language } = useLanguage()
    const ar = language === 'ar'

    const [saved, setSaved] = useState(false)
    const [toast, setToast] = useState(null)

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2800) }
    const toggleSave = () => {
        setSaved((prev) => {
            showToast(prev
                ? (ar ? 'تمت إزالته من المحفوظات' : 'Removed from saved')
                : (ar ? 'تم الحفظ لوقت لاحق' : 'Saved for later'))
            return !prev
        })
    }

    return (
        <>
            <AppPageHead title={ar ? 'تحدي الابتكار العالمي بالذكاء الاصطناعي | EVENTIFY' : 'Global AI Innovation Challenge | EVENTIFY'} />

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 px-5 py-3 rounded-full shadow-xl font-label-md text-white" style={{ backgroundColor: '#1e7a4f' }}>
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                    {toast}
                </div>
            )}

            <main
                className="pt-24 pb-12 px-container-margin-mobile md:px-container-margin-desktop max-w-[1280px] mx-auto"
                dir={ar ? 'rtl' : 'ltr'}
            >
                {/* Breadcrumb */}
                <div className={`flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant mb-4 ${ar ? 'flex-row-reverse' : ''}`}>
                    <Link className="hover:text-primary transition-colors" to="/app/explore">
                        {ar ? 'استكشاف' : 'Explore'}
                    </Link>
                    <span>/</span>
                    <span className="text-on-surface">
                        {ar ? 'تحدي الابتكار العالمي بالذكاء الاصطناعي' : 'Global AI Innovation Challenge'}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
                    {/* Main Column */}
                    <div className="ev-fade-up lg:col-span-2 space-y-6">

                        {/* Hero image + match badge */}
                        <div className="rounded-xl overflow-hidden h-64 md:h-80 relative">
                            <img
                                className="w-full h-full object-cover"
                                alt="A dynamic digital art piece representing a global coding hackathon"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9CEnFNI0sa64wtdt1xcbuCO2ctuePljYf3b0mGoAfsaVbTQZl6EUEKGeq_A-lCje6-84UGOy-xM_EX1fj34sF-YWMO-_0SG4_iedT1vjYrRw5UpEFxOlngZ_cDhCxJRFxyyChSuzfbQzaifbDrY-ySQm0SZNqdXFNpNdzVSiaboP2NAJ4pYTV-P32G1lYqug8kLksnCytiGNYKiUHGIacjDYyZIZ5HHucNTeyCLWQmzn3HRdmrm8n18EIgGN0AobDjfqjTG3DQkjK"
                            />
                            <div className={`absolute top-4 ${ar ? 'left-4' : 'right-4'} px-3 py-1.5 bg-secondary text-white rounded-lg font-label-sm flex items-center gap-1 shadow-lg`}>
                                <span className="material-symbols-outlined text-[16px]">bolt</span>
                                {ar ? 'تطابق 98%' : '98% Match for you'}
                            </div>
                        </div>

                        {/* Title block */}
                        <div>
                            <span className="font-label-sm text-label-sm uppercase text-secondary">
                                {ar ? 'هاكاثون · مسابقة' : 'HACKATHON · COMPETITION'}
                            </span>
                            <h1 className="font-headline-xl text-headline-xl mt-1">
                                {ar ? 'تحدي الابتكار العالمي بالذكاء الاصطناعي' : 'Global AI Innovation Challenge'}
                            </h1>
                            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                                {ar ? 'بواسطة TechGenius Labs' : 'By TechGenius Labs'}
                            </p>
                            <div className={`flex flex-wrap items-center gap-4 mt-4 text-on-surface-variant font-label-sm ${ar ? 'flex-row-reverse' : ''}`}>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                                    {ar ? '24 أكتوبر – 26 أكتوبر 2026' : 'Oct 24 – Oct 26, 2026'}
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                                    {ar ? 'عن بُعد' : 'Remote'}
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[18px]">groups</span>
                                    {ar ? 'فرق من 2–4' : 'Teams of 2–4'}
                                </span>
                                <span className="flex items-center gap-1 text-tertiary font-bold">
                                    <span className="material-symbols-outlined text-[18px]">military_tech</span>
                                    {ar ? 'جائزة 10,000 دولار' : '$10,000 Prize Pool'}
                                </span>
                            </div>
                        </div>

                        {/* About */}
                        <div className="border-t border-outline-variant/30 pt-6 space-y-3">
                            <h2 className="font-headline-md text-headline-md">
                                {ar ? 'عن هذا التحدي' : 'About this challenge'}
                            </h2>
                            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                                {ar
                                    ? 'هاكاثون عالمي لمدة 48 ساعة للمبدعين الراغبين في استكشاف آفاق الذكاء الاصطناعي التطبيقي. ستقوم الفرق بتصميم وإنتاج نموذج أولي يحل مشكلة واقعية باستخدام نماذج توليدية أو تنبؤية. مفتوح للطلاب والخريجين والمحترفين في بداية مسيرتهم — لا يلزم خبرة سابقة في الهاكاثون.'
                                    : 'A 48-hour global hackathon for builders exploring the frontier of applied AI. Teams will design and ship a working prototype that solves a real-world problem using generative or predictive models. Open to students, graduates, and early-career professionals — no prior hackathon experience required.'}
                            </p>
                        </div>

                        {/* Requirements */}
                        <div className="space-y-3">
                            <h2 className="font-headline-md text-headline-md">
                                {ar ? 'المتطلبات' : 'Requirements'}
                            </h2>
                            <ul className="space-y-2 font-body-md text-body-md text-on-surface-variant">
                                {REQUIREMENTS.map((req) => (
                                    <li key={req.en} className={`flex items-start gap-2 ${ar ? 'flex-row-reverse text-right' : ''}`}>
                                        <span className="material-symbols-outlined text-tertiary text-[20px] shrink-0" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                                        {ar ? req.ar : req.en}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Skills */}
                        <div className="space-y-3">
                            <h2 className="font-headline-md text-headline-md">
                                {ar ? 'المهارات المطابقة لملفك' : 'Skills matched to your profile'}
                            </h2>
                            <div className={`flex flex-wrap gap-2 ${ar ? 'flex-row-reverse' : ''}`}>
                                {SKILLS.map((skill) => {
                                    const label = typeof skill.label === 'string' ? skill.label : (ar ? skill.label.ar : skill.label.en)
                                    return (
                                        <span
                                            key={typeof skill.label === 'string' ? skill.label : skill.label.en}
                                            className={`px-3 py-1 rounded-lg font-label-sm text-label-sm ${skill.matched
                                                ? 'bg-primary/5 text-primary border border-primary/10'
                                                : 'bg-surface-container text-on-surface-variant'}`}
                                        >
                                            {label}
                                        </span>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="ev-fade-up ev-stagger-1 space-y-6">

                        {/* Apply card */}
                        <div className="ev-card spotlight bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm space-y-4 sticky top-24">
                            <div className={`flex items-center justify-between ${ar ? 'flex-row-reverse' : ''}`}>
                                <span className="font-label-sm text-label-sm text-on-surface-variant">
                                    {ar ? 'آخر موعد للتقديم' : 'Application deadline'}
                                </span>
                                <span className="font-label-md text-label-md text-error font-bold">
                                    {ar ? 'باقي 3 أيام' : '3 days left'}
                                </span>
                            </div>
                            <Link
                                className="block w-full text-center py-3.5 rounded-full font-label-lg shadow-md active:scale-95 transition-all"
                                style={{ backgroundColor: '#FF4D2E', color: '#fff' }}
                                to="/app/participation-type"
                            >
                                {ar ? 'تقدّم الآن' : 'Apply Now'}
                            </Link>
                            <button
                                className={`w-full py-3 font-label-md flex items-center justify-center gap-2 border rounded-lg transition-colors ${saved
                                    ? 'border-[#FF4D2E] bg-[#FF4D2E]/5'
                                    : 'border-outline-variant hover:bg-surface-container'}`}
                                style={saved ? { color: '#FF4D2E' } : {}}
                                onClick={toggleSave}
                            >
                                <span
                                    className="material-symbols-outlined text-[18px]"
                                    style={{ fontVariationSettings: saved ? '"FILL" 1' : '"FILL" 0' }}
                                >
                                    {saved ? 'bookmark_added' : 'bookmark'}
                                </span>
                                {ar ? 'حفظ لوقت لاحق' : 'Save for later'}
                            </button>
                            <div className={`border-t border-outline-variant/30 pt-4 flex items-center gap-3 ${ar ? 'flex-row-reverse' : ''}`}>
                                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: '"FILL" 1' }}>smart_toy</span>
                                </div>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">
                                    {ar ? 'اسأل ' : 'Ask '}
                                    <Link className="font-semibold hover:underline" style={{ color: '#FF4D2E' }} to="/app/rafeeq">Rafeeq</Link>
                                    {ar ? ' لتلخيص هذه الفرصة لك.' : ' to summarize this opportunity for you.'}
                                </p>
                            </div>
                        </div>

                        {/* Teams card */}
                        <div className="ev-card spotlight bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm space-y-4">
                            <h3 className="font-title-md text-title-md">{ar ? 'الفرق المتاحة' : 'Available Teams'}</h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                                {ar ? '3 فرق تبحث عن أعضاء لهذا التحدي.' : '3 teams are recruiting for this challenge.'}
                            </p>
                            <Link
                                className="w-full block text-center border font-label-md text-label-md py-2.5 rounded-lg hover:bg-[#FF4D2E]/5 transition-colors"
                                style={{ borderColor: '#FF4D2E', color: '#FF4D2E' }}
                                to="/app/teams"
                            >
                                {ar ? 'تصفح الفرق' : 'Browse Teams'}
                            </Link>
                        </div>

                        {/* Similar */}
                        <div className="ev-card spotlight bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm space-y-3">
                            <h3 className="font-title-md text-title-md">{ar ? 'فرص مشابهة' : 'Similar Opportunities'}</h3>
                            {SIMILAR.map(({ icon, color, bg, title, sub }) => (
                                <Link key={title} className={`flex items-center gap-3 group ${ar ? 'flex-row-reverse' : ''}`} to="/app/opportunity">
                                    <div className={`w-12 h-12 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                                        <span className={`material-symbols-outlined ${color}`}>{icon}</span>
                                    </div>
                                    <div className={ar ? 'text-right' : ''}>
                                        <p className="font-label-md text-label-md group-hover:text-primary transition-colors">{title}</p>
                                        <p className="font-label-sm text-label-sm text-on-surface-variant">{ar ? sub.ar : sub.en}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <AppFooter />
        </>
    )
}
