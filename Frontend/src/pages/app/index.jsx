import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppPageHead from '../../components/app/AppPageHead'
import AppFooter from '../../components/app/AppFooter'
import { useLanguage } from '../../hooks/useLanguage'

function SaveButton({ id, saved, ar, onToggle }) {
    return (
        <button
            className={`px-3 border rounded-lg transition-colors ${saved.has(id)
                ? 'border-primary text-primary bg-primary/5'
                : 'border-outline-variant dark:border-white/10 hover:bg-surface-container dark:hover:bg-slate-800 text-on-surface-variant dark:text-gray-300'}`}
            aria-label={ar ? 'احفظ لاحقاً' : 'Save for later'}
            onClick={() => onToggle(id)}
        >
            <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: saved.has(id) ? '"FILL" 1' : '"FILL" 0' }}
            >{saved.has(id) ? 'bookmark_added' : 'bookmark'}</span>
        </button>
    )
}

export default function AppHome() {
    const navigate = useNavigate()
    const { language } = useLanguage()
    const ar = language === 'ar'
    const openOpportunity = () => navigate('/app/opportunity')
    const [isRafeeqOpen, setIsRafeeqOpen] = useState(false)
    const [eventFilter, setEventFilter] = useState('all')
    const [saved, setSaved] = useState(new Set())
    const [toast, setToast] = useState(null)

    const toggleRafeeq = () => setIsRafeeqOpen((prev) => !prev)

    const showToast = (msg, tone = 'success') => {
        setToast({ msg, tone })
        setTimeout(() => setToast(null), 2800)
    }

    const toggleSave = (id) => {
        setSaved((prev) => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
                showToast(ar ? 'تمت إزالته من المحفوظات' : 'Removed from saved')
            } else {
                next.add(id)
                showToast(ar ? 'تم الحفظ لوقت لاحق' : 'Saved for later')
            }
            return next
        })
    }

    const eventFilterButtonClass = (filter) =>
        `pb-4 font-label-md transition-colors ${eventFilter === filter
            ? 'text-primary border-b-2 border-primary'
            : 'text-on-surface-variant dark:text-[#c3c6d7] hover:text-primary'}`

    useEffect(() => {
        const timer = setTimeout(() => setIsRafeeqOpen(true), 3000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <>
            <AppPageHead title="EVENTIFY | AI-Powered Opportunity Hub" />
            {/* Toast notification — bottom of screen */}
            {toast && (
                <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 px-5 py-3 rounded-full shadow-xl font-label-md text-white transition-all animate-bounce ${toast.tone === 'success' ? 'bg-[#1e7a4f]' : 'bg-red-600'}`}>
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                        {toast.tone === 'success' ? 'check_circle' : 'cancel'}
                    </span>
                    {toast.msg}
                </div>
            )}
            <main className="pt-24 pb-12 px-container-margin-mobile md:px-container-margin-desktop max-w-[1280px] mx-auto space-y-12">

{/* ── Hero Section ─────────────────────────────────────────── */}
<section className={`app-hero relative overflow-hidden rounded-xl px-8 py-16 md:px-16 md:py-24 flex flex-col items-start space-y-6 ${ar ? 'text-right items-end' : 'text-left items-start'}`}>
<div className="absolute inset-0 z-0 app-hero__bg"></div>

<div className="relative z-[3] ev-fade-up ev-stagger-1 space-y-3">
    <span className="app-hero__badge inline-block px-4 py-1 font-label-md rounded-full">
        {ar ? 'أهلاً بعودتك!' : 'Welcome back!'}
    </span>
    <h1 className="font-headline-xl text-headline-xl tracking-tight max-w-3xl">
        {ar
            ? <>اكتشف <span className="text-primary italic">الفرصة المناسبة</span> بالذكاء الاصطناعي</>
            : <>Discover the Right <span className="text-primary italic">Opportunity</span> with AI</>}
    </h1>
    <ul className="space-y-1.5 font-body-md text-body-md text-white/75 max-w-xl">
        {ar ? (
            <>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✔</span> نقرأ سيرتك الذاتية مرة واحدة.</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">◆</span> اعثر على أفضل المسابقات، الفعاليات، ورش العمل، والدورات المصنفة بناءً على مهاراتك.</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">◆</span> قم بتحديث ملفك المهني للحصول على نتائج أدق.</li>
            </>
        ) : (
            <>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">✔</span> We read your resume once.</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">◆</span> Find the perfect competitions, events, workshops, and courses ranked for your skills.</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">◆</span> Update your professional profile for better match.</li>
            </>
        )}
    </ul>
</div>

<div className="relative z-[3] ev-fade-up ev-stagger-2 flex flex-wrap items-center gap-3">
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 font-label-sm text-label-sm">
        <span className="material-symbols-outlined text-green-400 text-[18px]">task_alt</span>
        {ar
            ? 'تم تحليل السيرة بنجاح — تم التعرف على تخصص هندسة البرمجيات والذكاء الاصطناعي'
            : 'AI & Software Engineering Profile Detected — Successfully Analyzed'}
    </span>
    <Link
        className="inline-flex items-center gap-1.5 px-4 py-2 border border-white/20 rounded-lg font-label-sm text-white/80 hover:text-white hover:border-white/40 transition-colors"
        to="/app/profile"
    >
        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
        {ar ? 'تحديث الملف الشخصي' : 'Update Profile'}
    </Link>
</div>

<div className="relative z-[3] ev-fade-up ev-stagger-3 w-full max-w-3xl mt-6">
    <div className="relative">
        <span className={`material-symbols-outlined absolute ${ar ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-gray-400 pointer-events-none`}>search</span>
        <input
            className={`w-full ${ar ? 'pr-14 pl-32' : 'pl-14 pr-32'} py-5 bg-surface text-on-surface dark:bg-slate-900/90 dark:text-white placeholder:text-on-surface-variant dark:placeholder:text-gray-400 border border-outline-variant dark:border-white/15 shadow-lg rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-body-md font-body-md`}
            placeholder={ar ? 'ابحث عن فرص أو فعاليات أو ورش عمل أو دورات...' : 'Search opportunities, events, workshops, or courses...'}
            type="text"
            dir={ar ? 'rtl' : 'ltr'}
        />
        <button className={`absolute ${ar ? 'left-3' : 'right-3'} top-2.5 bottom-2.5 px-6 font-label-md rounded-lg transition-opacity hover:opacity-90 uppercase tracking-wide`} style={{ backgroundColor: '#FF4D2E', color: '#fff' }}>
            {ar ? 'بحث' : 'SEARCH'}
        </button>
    </div>
    <div className={`flex items-center gap-2 mt-3 flex-wrap ${ar ? 'flex-row-reverse' : ''}`}>
        <span className="font-label-sm text-label-sm text-white/50">
            {ar ? 'عمليات البحث الشائعة:' : 'Trending Searches'}
        </span>
        {(ar
            ? ['#ذكاء_اصطناعي', '#فولستاك', '#هاكاثون', '#تعلم_الآلة', '#هندسة']
            : ['#AI', '#Fullstack', '#Hackathon', '#MachineLearning', '#Engineering']
        ).map((tag) => (
            <button key={tag} className="px-3 py-1 rounded-full bg-white/10 border border-white/15 font-label-sm text-label-sm text-white/70 hover:bg-white/20 hover:text-white transition-colors">
                {tag}
            </button>
        ))}
    </div>
</div>
</section>

{/* ── AI Recommendation Section ────────────────────────────── */}
<section className="ev-fade-up ev-stagger-1 space-y-6 home-section">
<div className="home-section-header">
    <div className="space-y-1">
        <h2 className="font-headline-md text-headline-md text-on-background dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">auto_awesome</span>
            {ar ? 'موصى به لك' : 'Recommended For You'}
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-300">
            {ar ? 'مطابق لمهاراتك وخبراتك في سيرتك الذاتية، تم التحديث للتو.' : 'Matched against the skills and experience in your CV, refreshed just now.'}
        </p>
    </div>
    <Link className="text-primary font-label-md hover:underline" to="/app/explore">
        {ar ? 'عرض كل المطابقات' : 'View All Matches'}
    </Link>
</div>
<div className="recommended-grid grid grid-cols-1 md:grid-cols-3 gap-gutter items-stretch">

{/* Card 1 */}
<div className="ev-fade-up ev-stagger-2 ev-card spotlight bg-surface-container-lowest dark:bg-slate-900/80 border border-outline-variant/30 dark:border-white/10 rounded-xl overflow-hidden shadow-sm group border-l-4 border-l-secondary">
    <div className="h-48 home-card-media relative overflow-hidden">
        <img className="ev-card-img w-full h-full object-cover" alt="Global AI hackathon" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9CEnFNI0sa64wtdt1xcbuCO2ctuePljYf3b0mGoAfsaVbTQZl6EUEKGeq_A-lCje6-84UGOy-xM_EX1fj34sF-YWMO-_0SG4_iedT1vjYrRw5UpEFxOlngZ_cDhCxJRFxyyChSuzfbQzaifbDrY-ySQm0SZNqdXFNpNdzVSiaboP2NAJ4pYTV-P32G1lYqug8kLksnCytiGNYKiUHGIacjDYyZIZ5HHucNTeyCLWQmzn3HRdmrm8n18EIgGN0AobDjfqjTG3DQkjK"/>
        <div className="absolute top-3 right-3 px-3 py-1 bg-secondary text-white rounded-lg font-label-sm flex items-center gap-1 shadow-lg" data-count>
            <span className="material-symbols-outlined text-[14px]">bolt</span> 98%
        </div>
    </div>
    <div className="p-6 space-y-4 home-card-body">
        <div>
            <span className="font-label-sm text-label-sm uppercase text-secondary">{ar ? 'هاكاثون' : 'HACKATHON'}</span>
            <Link className="block" to="/app/opportunity">
                <h3 className="font-title-md text-title-md text-on-background dark:text-white line-clamp-1 mt-1 hover:text-primary transition-colors">
                    {ar ? 'تحدي الابتكار العالمي بالذكاء الاصطناعي' : 'Global AI Innovation Challenge'}
                </h3>
            </Link>
            <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-gray-300">By TechGenius Labs</p>
            <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="px-2 py-0.5 rounded-full bg-surface-container dark:bg-slate-800 font-label-sm text-label-sm text-on-surface-variant dark:text-gray-300">{ar ? 'من سيرتك: Python' : 'From your CV: Python'}</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container dark:bg-slate-800 font-label-sm text-label-sm text-on-surface-variant dark:text-gray-300">{ar ? 'تعلم الآلة' : 'Machine Learning'}</span>
            </div>
        </div>
        <div className="flex items-center gap-4 text-outline dark:text-gray-400 font-label-sm">
            <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">calendar_month</span> Oct 24</div>
            <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">location_on</span> {ar ? 'عن بُعد' : 'Remote'}</div>
        </div>
        <div className="flex gap-2 pt-2 home-card-actions">
            <Link className="btn-primary flex-1" to="/app/opportunity">{ar ? 'تقدّم الآن' : 'Apply Now'}</Link>
            <SaveButton id="rec-1" saved={saved} ar={ar} onToggle={toggleSave} />
        </div>
    </div>
</div>

{/* Card 2 */}
<div className="ev-fade-up ev-stagger-2 ev-card spotlight bg-surface-container-lowest dark:bg-slate-900/80 border border-outline-variant/30 dark:border-white/10 rounded-xl overflow-hidden shadow-sm group border-l-4 border-l-primary">
    <div className="h-48 home-card-media relative overflow-hidden">
        <img className="ev-card-img w-full h-full object-cover" alt="Deep Learning workshop" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcUXLF60F3KbDnIVZepTTte_yzkhe3rkuMtXTXTMQzA1gyVuzXN1NQ0DXC7XHQBDIHEA2TXLK8EoSvioCS5PoWNoZKnVI7YeLCAxqcRtKE-cfSsrD6X3yBiiGI_J0DdnCu4vgHVOf7tn5UW93gDceqUiZ4hVu5ZCvSuDbEd3Dm8uTINHyELfvrJM4AvcW6lRAm2zAmGTlp9N7rNMUMizYToAN1_rTfY1KtEjsmeIx--zlkOzEz07DRgirbjC8bnSBfxNFTTtVBYuqf"/>
        <div className="absolute top-3 right-3 px-3 py-1 bg-secondary text-white rounded-lg font-label-sm flex items-center gap-1 shadow-lg" data-count>
            <span className="material-symbols-outlined text-[14px]">bolt</span> 95%
        </div>
    </div>
    <div className="p-6 space-y-4 home-card-body">
        <div>
            <span className="font-label-sm text-label-sm uppercase text-primary">{ar ? 'ورشة عمل' : 'WORKSHOP'}</span>
            <Link className="block" to="/app/opportunity">
                <h3 className="font-title-md text-title-md text-on-background dark:text-white line-clamp-1 mt-1 hover:text-primary transition-colors">
                    {ar ? 'إتقان التعلم العميق' : 'Deep Learning Mastery'}
                </h3>
            </Link>
            <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-gray-300">{ar ? 'جامعة التكنولوجيا' : 'University of Technology'}</p>
            <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="px-2 py-0.5 rounded-full bg-surface-container dark:bg-slate-800 font-label-sm text-label-sm text-on-surface-variant dark:text-gray-300">{ar ? 'من سيرتك: TensorFlow' : 'From your CV: TensorFlow'}</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container dark:bg-slate-800 font-label-sm text-label-sm text-on-surface-variant dark:text-gray-300">{ar ? 'التعلم العميق' : 'Deep Learning'}</span>
            </div>
        </div>
        <div className="flex items-center gap-4 text-outline dark:text-gray-400 font-label-sm">
            <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">calendar_month</span> Nov 12</div>
            <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">location_on</span> {ar ? 'هجين' : 'Hybrid'}</div>
        </div>
        <div className="flex gap-2 pt-2 home-card-actions">
            <Link className="btn-primary flex-1" to="/app/opportunity">{ar ? 'سجّل الآن' : 'Register'}</Link>
            <SaveButton id="rec-2" saved={saved} ar={ar} onToggle={toggleSave} />
        </div>
    </div>
</div>

{/* Card 3 */}
<div className="ev-card spotlight bg-surface-container-lowest dark:bg-slate-900/80 border border-outline-variant/30 dark:border-white/10 rounded-xl overflow-hidden shadow-sm group border-l-4 border-l-secondary">
    <div className="h-48 home-card-media relative overflow-hidden">
        <img className="ev-card-img w-full h-full object-cover" alt="Frontend competition" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoXFluzheWmZ490MELdToAMEYpR_txVKV30osgae_hCJtZOTitQ7q-hlRINJEb6yu8WczfucSzRFeg7_ASopSg4PYi40bcSgLBAzpyDWcgZltV0lVaadKj9Hxg_0-MIvEynOlpWfO6oad4LDePXnQqUogQYAUOomnsxNQRm0sYppi6tcEF-XVtGAmZwLlJ7Zzvf2ojEvEnU0EwWkAE_qpAYRfUYUWLDeKx1nnQtM-6DxX8uCm13GfTKpd5tCt-XHKS5s04qO3jTwFA"/>
        <div className="absolute top-3 right-3 px-3 py-1 bg-secondary text-white rounded-lg font-label-sm flex items-center gap-1 shadow-lg" data-count>
            <span className="material-symbols-outlined text-[14px]">bolt</span> 92%
        </div>
    </div>
    <div className="p-6 space-y-4 home-card-body">
        <div>
            <span className="font-label-sm text-label-sm uppercase text-secondary">{ar ? 'مسابقة' : 'COMPETITION'}</span>
            <Link className="block" to="/app/opportunity">
                <h3 className="font-title-md text-title-md text-on-background dark:text-white line-clamp-1 mt-1 hover:text-primary transition-colors">
                    {ar ? 'معالجو الواجهة الأمامية 2024' : 'Frontend Wizards 2024'}
                </h3>
            </Link>
            <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-gray-300">DevCommunity Hub</p>
            <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="px-2 py-0.5 rounded-full bg-surface-container dark:bg-slate-800 font-label-sm text-label-sm text-on-surface-variant dark:text-gray-300">{ar ? 'من سيرتك: React' : 'From your CV: React'}</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container dark:bg-slate-800 font-label-sm text-label-sm text-on-surface-variant dark:text-gray-300">JavaScript</span>
            </div>
        </div>
        <div className="flex items-center gap-4 text-outline dark:text-gray-400 font-label-sm">
            <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">calendar_month</span> Dec 05</div>
            <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">location_on</span> London, UK</div>
        </div>
        <div className="flex gap-2 pt-2 home-card-actions">
            <Link className="btn-primary flex-1" to="/app/opportunity">{ar ? 'انضم الآن' : 'Join Now'}</Link>
            <SaveButton id="rec-3" saved={saved} ar={ar} onToggle={toggleSave} />
        </div>
    </div>
</div>

</div>
</section>

{/* ── Competitions Section ──────────────────────────────────── */}
<section className="ev-fade-up ev-stagger-1 space-y-6 home-section">
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <h2 className="font-headline-md text-headline-md text-on-background dark:text-white">
        {ar ? 'استكشف المسابقات' : 'Explore Competitions'}
    </h2>
    <Link className="text-primary font-label-md hover:underline" to="/app/explore">{ar ? 'عرض الكل' : 'View All'}</Link>
</div>
<div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
{[
    { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv-V-8GjFWlxuhqQq9nPPBCQKNIYRDy0-x7U8GZDqCxf3lpcSiGNgXTpm9Dp9vtBNtYRJM9-o_XfAV_yWpqjCDBHhA3Xin8gTKbYsCIpYqce02UMEzafn25IYfHI6hd-IasfwMRqIx3qADrfqnj7m-D_PHpWiW6GRyb70Zw9C6yT7Xu6xsRz80sxxnJdXORtOzWdcpjojOlvDh2cdJULC_KUcENGeijXkCPjAA02-axN9qR_MrffMvhq-xjwZhj4cy_sT0Lsf7llBS', type: ar ? 'CTF' : 'CTF', title: ar ? 'سايبر سنتينل CTF' : 'Cyber Sentinel CTF', icon: 'groups', meta: ar ? 'فرق من 2-4' : 'Teams of 2-4', timing: ar ? 'ينتهي خلال 5 أيام' : 'Ends in 5 days', level: ar ? 'متقدم' : 'ADVANCED', prize: '$10k Prize' },
    { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXn10C98Y8WUzcNLWBVvJ22710pYfWPZ0AdwJnkvIzzrkRa7SjmiUkilVPYW1oiK4Ay94CQTAE0NXfvrvQ1ES-3iyitDyREyHfC70KWD_7_pt6i4p6iLUmLapJfW3QyXTfYv66FWPz2QXVOtb_-1E6Xq2ZxWaVcVWTZuTF9J3PPl1-05OI8e-Te2CMLQPBS91gPoxcPfvlOHji7ZgCnKJinWFcW43YJAc9F9-8zF3LC5xxItr7Sgurkz4D6WhyaY2YYeCNgPQOH1ve', type: ar ? 'دراسة حالة' : 'Case Study', title: ar ? 'دراسة حالة بيزفانتاج' : 'BizVantage Case Study', icon: 'school', meta: ar ? 'للجامعيين فقط' : 'University Only', timing: ar ? 'التسجيل مفتوح' : 'Registration Open', level: ar ? 'متوسط' : 'INTERMEDIATE', prize: ar ? 'منحة' : 'Scholarship' },
    { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3eL49qDKde8nJat8bbMD-e7iLAX5jUmYWEgqWWO3G4gKStDqZVQcvk-s0RAU_pzaZfmmGzBNiqJ0B90CztUFJsVgCQpiCiOIrzyZSob_6KdzfhMj191B5cm02XzBYKFUHVnYwHkgLcxET11ZEq7eZ3UN9W4lbYliTucyjKFvVY8yMqG-4JV5p3mAA1oYqsYiICSzmgCacyFAQ6SXYl7Fmm2s9yLl19UR4LVmrIGVCmPfepE7pwtjpwcBOapQEnDac5lnwZZ00ht5g', type: ar ? 'سباق تصميم' : 'Design Sprint', title: ar ? 'سباق التصميم 2024' : 'DesignSprint 2024', icon: 'brush', meta: ar ? 'مصممو UI/UX' : 'UI/UX Designers', timing: ar ? 'يبدأ غداً' : 'Starts Tomorrow', level: ar ? 'مفتوح' : 'OPEN', prize: ar ? 'إرشاد' : 'Mentorship' },
    { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXjuV5CQGqc-ZmamRm8rBUtKL8uClHTygX0WXc3pOz_URa_gxCcG8AwYwcTdoFJJMwYHK-8yGqGa_we6rtmdJ-o-dlrTDebv3EOaalvLTX0AbshUPKUwZyYLGMzXshnisKSXxiIb3z5i5gXzLOxFzkZDGyp2eiai4-zFbHE6L5JTyXWjUxjY4-Gr7FYQmzegkgSeyQxjeA9O5cBo5ah87T3qI-xYuJRoP8DJnofGUr37XLhF-OcBMLzFhDfV99BeirnKTIQgJ4rqvS', type: ar ? 'روبوتات' : 'Robotics', title: ar ? 'تحدي روبوكويست' : 'RoboQuest Tech', icon: 'precision_manufacturing', meta: ar ? 'مطوّرو الأجهزة' : 'Hardware Devs', timing: ar ? 'ينتهي خلال يومين' : 'Ends in 2 days', level: ar ? 'متقدم' : 'ADVANCED', prize: '$25k Grant' },
].map((c, i) => (
    <div 
        key={i} 
        className="bg-surface-container-lowest dark:bg-slate-900/80 border border-outline-variant/30 dark:border-white/10 rounded-xl p-4 space-y-4 premium-card cursor-pointer group row-animated transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" 
        style={{ '--stagger-idx': i }}
        onClick={openOpportunity}
    >
        <div className="aspect-video rounded-lg overflow-hidden mb-4">
            <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={c.title} src={c.img} />
        </div>
        <div className="space-y-1">
            <span className="font-label-sm text-label-sm uppercase text-secondary">{c.type}</span>
            <div className="flex justify-between items-start">
                <h4 className="font-title-md text-title-md text-on-background dark:text-white leading-tight">{c.title}</h4>
                <span className="material-symbols-outlined text-outline dark:text-gray-400">more_vert</span>
            </div>
        </div>
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-outline dark:text-gray-400 font-label-sm">
                <span className="material-symbols-outlined text-[16px]">{c.icon}</span>{c.meta}
            </div>
            <div className="flex items-center gap-2 text-outline dark:text-gray-400 font-label-sm">
                <span className="material-symbols-outlined text-[16px]">history</span>{c.timing}
            </div>
        </div>
        <div className="pt-2 flex flex-wrap items-start justify-between gap-2">
            <span className="max-w-full px-3 py-1 bg-primary/5 text-primary font-label-sm text-label-sm rounded">
                {ar ? `المستوى: ${c.level}` : `LEVEL: ${c.level}`}
            </span>
            <span className="min-w-0 text-right text-tertiary font-bold break-words">{c.prize}</span>
        </div>
    </div>
))}
</div>
</section>

{/* ── Events Section ────────────────────────────────────────── */}
<section className="space-y-8 home-section">
<div className="flex flex-col md:flex-row items-center justify-between border-b border-outline-variant/30 dark:border-white/10">
    <div className="flex gap-8 overflow-x-auto no-scrollbar min-w-0 w-full md:w-auto" role="group">
        {[
            { key: 'all',         label: ar ? 'الكل'       : 'All' },
            { key: 'competition', label: ar ? 'مسابقات'    : 'Competition' },
            { key: 'event',       label: ar ? 'فعاليات'    : 'Event' },
            { key: 'workshop',    label: ar ? 'ورش عمل'   : 'Workshop' },
            { key: 'course',      label: ar ? 'دورات'      : 'Course' },
        ].map(({ key, label }) => (
            <button key={key} type="button" className={eventFilterButtonClass(key)} onClick={() => setEventFilter(key)} aria-pressed={eventFilter === key}>
                {label}
            </button>
        ))}
    </div>
</div>
<div key={eventFilter} className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
{(eventFilter === 'all' || eventFilter === 'event') && (
    <div className="md:col-span-8 bg-surface-container-lowest dark:bg-slate-900/60 border border-outline-variant/30 dark:border-white/10 rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row md:min-h-[22rem] ev-card spotlight cursor-pointer row-animated transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ '--stagger-idx': 0 }} onClick={openOpportunity}>
        <div className="md:w-1/2 overflow-hidden">
            <img className="w-full h-full object-cover" alt="Global AI Summit 2024" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4XGVVgdXcQZS5VeH1XemHRZule_sQgpM4yB8dp3TMxmIjOTnb7x77AU3_AQqluVNnUoBk5iOwilGg_Cj8LHOtQPsJVDcaa2kfvpwYLdBwATyhzxwNtAS856W4G73Ol2mDobe-pFocsYIgmXPkxxqQyS3aZpjC91TuFLwh-po8QIPiLvPOm1yFqZmmNUYFn-URTuNl5djEq9B_ex_XDVvWZZOaO1ql7f1IdMFa91gP9zwnDLnSsn8-06q6CYeqKkjDxqTjq8-BsmeU"/>
        </div>
        <div className="md:w-1/2 p-8 flex flex-col justify-between gap-4">
            <div className="ev-fade-up ev-stagger-1 space-y-2">
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary font-label-sm text-label-sm rounded">{ar ? 'مميز' : 'FEATURED'}</span>
                    <span className="text-error font-label-sm text-label-sm">{ar ? 'مباشر الآن' : 'LIVE NOW'}</span>
                </div>
                <h3 className="font-title-md text-title-md text-on-background dark:text-white leading-tight">
                    {ar ? 'قمة الذكاء الاصطناعي العالمية 2024: مستقبل الوكلاء' : 'Global AI Summit 2024: The Future of Agents'}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-gray-300 line-clamp-2">
                    {ar
                        ? 'انضم إلى قادة الصناعة من OpenAI وGoogle وMeta في قمة مكثفة مدتها ثلاثة أيام حول وكلاء الذكاء الاصطناعي المستقل.'
                        : 'Join industry leaders from OpenAI, Google, and Meta for a three-day intensive summit on autonomous AI agents.'}
                </p>
            </div>
            <div className="flex items-center justify-between pt-4">
                <div className="flex items-center -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-surface-container-high flex items-center justify-center font-mono text-label-sm text-on-background dark:text-white">+1.2k</div>
                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 overflow-hidden bg-primary-fixed"></div>
                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 overflow-hidden bg-secondary-fixed"></div>
                </div>
                <button className="px-6 py-2 rounded-lg font-label-md transition-opacity hover:opacity-90" style={{ backgroundColor: '#FF4D2E', color: '#fff' }}>
                    {ar ? 'انضم للجلسة' : 'Join Session'}
                </button>
            </div>
        </div>
    </div>
)}
<div className={`space-y-gutter ${(eventFilter === 'all' || eventFilter === 'event') ? 'md:col-span-4' : 'md:col-span-12'}`}>
    {(eventFilter === 'all' || eventFilter === 'course') && (
        <div className="bg-surface-container-lowest dark:bg-slate-900/60 border border-outline-variant/30 dark:border-white/10 rounded-xl p-6 flex gap-4 items-center cursor-pointer hover:border-primary/50 transition-colors" onClick={openOpportunity}>
            <div className="w-16 h-16 rounded-xl bg-primary-container/20 flex flex-col items-center justify-center text-primary flex-shrink-0">
                <span className="font-bold text-headline-lg-mobile">28</span>
                <span className="font-label-sm text-label-sm uppercase">OCT</span>
            </div>
            <div>
                <span className="font-label-sm text-label-sm uppercase text-primary">{ar ? 'دورة' : 'Course'}</span>
                <h4 className="font-title-md text-title-md text-on-background dark:text-white line-clamp-1">{ar ? 'دورة استراتيجية المنتج' : 'Product Strategy Course'}</h4>
                <p className="text-on-surface-variant dark:text-gray-300 text-body-sm">{ar ? 'برنامج شهادة 6 أسابيع' : '6-Week Certificate Program'}</p>
            </div>
        </div>
    )}
    {(eventFilter === 'all' || eventFilter === 'workshop') && (
        <div className="bg-surface-container-lowest dark:bg-slate-900/60 border border-outline-variant/30 dark:border-white/10 rounded-xl p-6 flex gap-4 items-center cursor-pointer hover:border-primary/50 transition-colors" onClick={openOpportunity}>
            <div className="w-16 h-16 rounded-xl bg-secondary-container/20 dark:bg-white/10 flex flex-col items-center justify-center text-secondary dark:text-white flex-shrink-0">
                <span className="font-bold text-headline-lg-mobile">02</span>
                <span className="font-label-sm text-label-sm uppercase">NOV</span>
            </div>
            <div>
                <span className="font-label-sm text-label-sm uppercase text-primary">{ar ? 'ورشة عمل' : 'Workshop'}</span>
                <h4 className="font-title-md text-title-md text-on-background dark:text-white line-clamp-1">{ar ? 'Rust لمطوري الويب' : 'Rust for Web Devs'}</h4>
                <p className="text-on-surface-variant dark:text-gray-300 text-body-sm">{ar ? 'ورشة تفاعلية' : 'Interactive Workshop'}</p>
            </div>
        </div>
    )}
    {(eventFilter === 'all' || eventFilter === 'workshop') && (
        <div className="bg-surface-container-lowest dark:bg-slate-900/60 border border-outline-variant/30 dark:border-white/10 rounded-xl p-6 flex gap-4 items-center cursor-pointer hover:border-primary/50 transition-colors" onClick={openOpportunity}>
            <div className="w-16 h-16 rounded-xl bg-tertiary-container/20 dark:bg-white/10 flex flex-col items-center justify-center text-tertiary dark:text-gray-200 flex-shrink-0">
                <span className="font-bold text-headline-lg-mobile">15</span>
                <span className="font-label-sm text-label-sm uppercase">NOV</span>
            </div>
            <div>
                <span className="font-label-sm text-label-sm uppercase text-primary">{ar ? 'ورشة عمل' : 'Workshop'}</span>
                <h4 className="font-title-md text-title-md text-on-background dark:text-white line-clamp-1">{ar ? 'ماستركلاس DevOps' : 'DevOps Masterclass'}</h4>
                <p className="text-on-surface-variant dark:text-gray-300 text-body-sm">{ar ? 'معمل سحابي عملي' : 'Hands-on Cloud Lab'}</p>
            </div>
        </div>
    )}
    {(eventFilter === 'all' || eventFilter === 'competition') && (
        <div className="bg-surface-container-lowest dark:bg-slate-900/60 border border-outline-variant/30 dark:border-white/10 rounded-xl p-6 flex gap-4 items-center cursor-pointer hover:border-primary/50 transition-colors" onClick={openOpportunity}>
            <div className="w-16 h-16 rounded-xl bg-tertiary-container/20 dark:bg-white/10 flex flex-col items-center justify-center text-tertiary dark:text-gray-200 flex-shrink-0">
                <span className="font-bold text-headline-lg-mobile">21</span>
                <span className="font-label-sm text-label-sm uppercase">NOV</span>
            </div>
            <div>
                <span className="font-label-sm text-label-sm uppercase text-primary">{ar ? 'مسابقة' : 'Competition'}</span>
                <h4 className="font-title-md text-title-md text-on-background dark:text-white line-clamp-1">{ar ? 'هاكاثون كود سبرينت' : 'CodeSprint Hackathon'}</h4>
                <p className="text-on-surface-variant dark:text-gray-300 text-body-sm">{ar ? 'تحدي الفريق 48 ساعة' : '48-Hour Team Challenge'}</p>
            </div>
        </div>
    )}
</div>
</div>
</section>

            </main>
            <AppFooter />

{/* ── Rafeeq AI Assistant ───────────────────────────────────── */}
<div className="fixed bottom-8 right-8 z-[60] flex flex-col items-end pointer-events-none">
    <div
        className={`mb-4 w-72 bg-white dark:bg-slate-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-outline-variant/50 dark:border-white/15 overflow-hidden pointer-events-auto transition-all duration-500 ${isRafeeqOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        dir={ar ? 'rtl' : 'ltr'}
    >
        <div className="p-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #FF4D2E 0%, #0E1116 100%)' }}>
            <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-white">smart_toy</span>
                <span className="text-white font-bold font-label-md">{ar ? 'رفيق AI' : 'My News AI'}</span>
            </div>
            <button className="text-white/80 hover:text-white" onClick={toggleRafeeq} aria-label="Close">
                <span className="material-symbols-outlined">close</span>
            </button>
        </div>
        <div className="p-4 space-y-4">
            <div className="flex items-start justify-between gap-2">
                <p className="text-body-sm text-on-surface dark:text-white/90">
                    {ar
                        ? 'ما هي أحدث توصيات الذكاء الاصطناعي والفرص المنشورة مؤخراً لك؟'
                        : 'What are the latest AI recommendations & recently posted opportunities for you?'}
                </p>
                <div className="voice-wave-container ml-2 flex-shrink-0">
                    <span className="voice-bar"></span>
                    <span className="voice-bar"></span>
                    <span className="voice-bar"></span>
                    <span className="voice-bar"></span>
                    <span className="voice-bar"></span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {[
                    { icon: 'terminal',          color: 'text-primary',   label: ar ? 'الأوامر'        : 'Command' },
                    { icon: 'format_align_left', color: 'text-secondary', label: ar ? 'تنسيق'          : 'Format' },
                    { icon: 'update',            color: 'text-tertiary',  label: ar ? 'تحديث'          : 'Update' },
                    { icon: 'description',       color: 'text-primary',   label: ar ? 'السيرة الذاتية' : 'Resume' },
                ].map(({ icon, color, label }) => (
                    <button key={label} className="p-2.5 text-left bg-surface dark:bg-slate-800 hover:bg-surface-container dark:hover:bg-slate-700/80 rounded-lg border border-outline-variant/30 dark:border-white/10 transition-colors">
                        <span className={`material-symbols-outlined ${color} text-[18px] block mb-1`}>{icon}</span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-300">{label}</span>
                    </button>
                ))}
            </div>
            <div className="flex items-center gap-2">
                <Link className="flex-1 text-center py-2 bg-primary/5 hover:bg-primary/10 dark:hover:bg-primary/20 text-primary rounded-lg font-label-md text-label-md transition-colors" to="/app/profile">
                    {ar ? 'عرض الملف الشخصي' : 'View AI Profile'}
                </Link>
                <Link className="px-4 py-2 rounded-lg font-label-sm font-bold transition-opacity hover:opacity-90 uppercase tracking-wide" style={{ backgroundColor: '#FF4D2E', color: '#fff' }} to="/app/rafeeq">
                    {ar ? 'رفيق' : 'RAFEEQ'}
                </Link>
            </div>
        </div>
    </div>
    <button
        className="pointer-events-auto h-16 w-16 rounded-full shadow-xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all"
        style={{ background: 'linear-gradient(135deg, #FF4D2E 0%, #0E1116 100%)' }}
        onClick={toggleRafeeq}
        aria-label={ar ? 'ابدأ البحث الصوتي' : 'Start voice input'}
    >
        <span className="material-symbols-outlined text-[32px]">mic</span>
    </button>
</div>

{/* ── Mobile Bottom Nav ─────────────────────────────────────── */}
<nav className="fixed bottom-0 w-full rounded-t-xl z-50 md:hidden flex justify-around items-center px-4 py-2 pb-safe bg-surface dark:bg-slate-900 border-t border-outline-variant/30 dark:border-white/10 shadow-[0_-4px_12px_rgba(59,130,246,0.08)]">
    <Link className="flex flex-col items-center justify-center text-secondary bg-secondary-container/20 rounded-xl px-3 py-1 transition-transform active:scale-90" to="/app">
        <span className="material-symbols-outlined">home</span>
        <span className="font-label-sm text-label-sm">{ar ? 'الرئيسية' : 'Home'}</span>
    </Link>
    <Link className="flex flex-col items-center justify-center text-on-surface-variant dark:text-gray-400 transition-transform active:scale-90" to="/app/explore">
        <span className="material-symbols-outlined">emoji_events</span>
        <span className="font-label-sm text-label-sm">{ar ? 'استكشف' : 'Explore'}</span>
    </Link>
    <Link className="flex flex-col items-center justify-center text-on-surface-variant dark:text-gray-400 transition-transform active:scale-90" to="/app/posts">
        <span className="material-symbols-outlined">campaign</span>
        <span className="font-label-sm text-label-sm">{ar ? 'المنشورات' : 'Posts'}</span>
    </Link>
    <Link className="flex flex-col items-center justify-center text-on-surface-variant dark:text-gray-400 transition-transform active:scale-90" to="/app/rafeeq">
        <span className="material-symbols-outlined">smart_toy</span>
        <span className="font-label-sm text-label-sm">{ar ? 'رفيق' : 'Rafeeq'}</span>
    </Link>
    <Link className="flex flex-col items-center justify-center text-on-surface-variant dark:text-gray-400 transition-transform active:scale-90" to="/app/profile">
        <span className="material-symbols-outlined">person</span>
        <span className="font-label-sm text-label-sm">{ar ? 'الملف' : 'Profile'}</span>
    </Link>
</nav>
        </>
    )
}
