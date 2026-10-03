import AppLangToggle from '../../components/app/AppLangToggle'
import AppFooter from '../../components/app/AppFooter'
import AppPageHead from '../../components/app/AppPageHead'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'

const MEMBERS = [
    {
        id: 1,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsk7muPFHYbZe7Z-rUcABeLlGKC3fPcjQvlSlvDR2xQmsCdjD_N5AhN_FIpOxnBOoRFJLYbLp_sbVgThwqN61SNeKujEibFe8f5cuALXg14FqDKFra6QXhkb_QkJ9MaFs2NquGZyYUmOcXHcAxpytMjpzKqzdgt8y-bygB6f3e9Hwuc70pexiu63M8y-FeeoRKHQRbBWOnbK7Om1NIZFjccFbJeTi4Dct6x19p9enOjySz-zAc7WDkeiz2b5Zkyv7hciqBciIkhsI7',
        name: { en: 'Sarah Chen (You)', ar: 'سارة تشن (أنت)' },
        role: { en: 'Team Lead • AI Research', ar: 'قائد الفريق • بحث الذكاء الاصطناعي' },
    },
    {
        id: 2,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmxDoxVMYKdjLBI4LTyACovkoA7uosdPqmrae8x1N8ktTZL_u2lHHqBKZVBUlQBcWdpSUiUZd3cTPzyRjLO_jFUxCdutbIhy1pj8kvFx02gnLTAAPaQ4VlgTElAkYkQPBlfxbJrrgVrkg_9-VOh8rufjYPqqj7l23exRU5rNDr7p90wCxB5Eiex3SBJcTbCtAcZVDbubo4OWdf-lwjVcf-g8Uzrut7uEWkt3AR_S4ZeTb4nLPvdegGx8tz56WWbDgXgs38QzCGKN92',
        name: { en: 'Marcus Thorne', ar: 'ماركوس ثورن' },
        role: { en: 'Data Engineering', ar: 'هندسة البيانات' },
    },
    {
        id: 3,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOV34IwdMrDUOuFd5cGHQYtCTtgkIj993EGhm9-yJWSvP8ysLpA36Eyx10SBESZ7PtNZ-jqAbctO84uEIXhN0ulGxY-MOal6nmIYo5CfFgxE2WHVy7JW4In6iX9VVmzMp6QU-rDqAbEYHywag67SFhv5TYwuu0VpHZSoNoqW9izgBggdmllvvhSLRJFcvdWDoxZYzArX5GFZZjZwfUw8QpsUlD2QUbx9Z5sXxCExbF2yOaUnRHtdNtnevMhuEzcADkOnLt0KDTiIJm',
        name: { en: 'Elena Rodriguez', ar: 'إيلينا رودريغيز' },
        role: { en: 'Product Design', ar: 'تصميم المنتج' },
    },
    {
        id: 4,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcTN_fBBPE7UutBfaFRRZX5sFqx7xFgBTx1xJWZiRZiervLaW8j6fXApyz-lC37L-9-e9zem29PdBNnzmcyQAyN5BXQRnQZJU4F-9qCLTVZICagRsqbzn0oDsZ1XJSE-X-4ntW4ODtewcEdOgt43G-kCdMWu9kE6aos01MOOH6bJajd7IsUooiOCYCt-wEDO8yZ-33jR5Li1s7yFFOes26hwW7mokDuPDIY25dtmumzZGDKBW6lmLtnkANsucN6c9xEoLszP2it_hF',
        name: { en: 'James Wilson', ar: 'جيمس ويلسون' },
        role: { en: 'Cloud Infrastructure', ar: 'البنية السحابية' },
    },
]

export default function TeamDashboard() {
    const { language } = useLanguage()
    const ar = language === 'ar'

    const [requestStatus, setRequestStatus] = useState(null)

    return (
        <>
            <AppPageHead title={ar ? 'لوحة الفريق | EVENTIFY' : 'Team Dashboard | EVENTIFY'} />

            {/* Task-flow header */}
            <header className="glass-header sticky top-0 z-50 w-full h-16 border-b border-outline-variant/30 flex items-center px-6">
                <Link className="flex items-center gap-2" to="/app">
                    <span className="material-symbols-outlined text-3xl" style={{ color: '#FF4D2E', fontVariationSettings: '"FILL" 1' }}>hub</span>
                    <span className="font-headline-md text-headline-md font-black" style={{ color: '#FF4D2E' }}>EVENTIFY</span>
                </Link>
                <AppLangToggle className="ml-auto mr-3" />
                <Link className="mr-3 font-label-md text-label-md" style={{ color: '#FF4D2E' }} to="/app/my-applications">
                    {ar ? 'طلباتي' : 'My Applications'}
                </Link>
                <Link className="p-2 hover:bg-surface-container-low rounded-full transition-colors" to="/app/my-applications" aria-label="Close">
                    <span className="material-symbols-outlined text-on-surface-variant">close</span>
                </Link>
            </header>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 mb-24" dir={ar ? 'rtl' : 'ltr'}>

                {/* Dashboard Header */}
                <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 ${ar ? 'md:flex-row-reverse' : ''}`}>
                    <div className={ar ? 'text-right' : ''}>
                        <div className={`flex items-center gap-3 mb-2 ${ar ? 'flex-row-reverse' : ''}`}>
                            <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wider">
                                {ar ? 'هاكاثون نشط' : 'Active Hackathon'}
                            </span>
                        </div>
                        <h1 className="font-headline-lg text-headline-lg text-on-surface">
                            {ar ? 'رواد الذكاء الاصطناعي' : 'AI Pioneers'}
                        </h1>
                        <div className={`flex items-center gap-2 mt-2 ${ar ? 'flex-row-reverse' : ''}`}>
                            <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: '#FF4D2E' }} />
                            <span className="font-label-md text-label-md" style={{ color: '#FF4D2E' }}>
                                {ar ? 'يُجنّد' : 'Recruiting'}
                            </span>
                            <span className="text-outline mx-2">•</span>
                            <span className="font-label-md text-label-md text-on-surface-variant" data-count>
                                {ar ? '4 / 6 أعضاء' : '4 / 6 Members'}
                            </span>
                        </div>
                    </div>
                    <div className={`flex items-center gap-3 ${ar ? 'flex-row-reverse' : ''}`}>
                        <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-all active:scale-95">
                            <span className="material-symbols-outlined text-[18px]">settings</span>
                            {ar ? 'إعدادات الفريق' : 'Team Settings'}
                        </button>
                        <button
                            className="flex items-center gap-2 px-6 py-3 rounded-full font-label-md text-label-md shadow-md active:scale-95 transition-all"
                            style={{ backgroundColor: '#FF4D2E', color: '#fff' }}
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            {ar ? 'دعوة عضو' : 'Invite Member'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
                    {/* Main — Left/Center */}
                    <div className="lg:col-span-2 space-y-stack_gap_lg">

                        {/* Pending Join Requests */}
                        <section>
                            <div className={`flex items-center justify-between mb-6 ${ar ? 'flex-row-reverse' : ''}`}>
                                <h3 className={`font-headline-md text-headline-md text-on-surface flex items-center gap-2 ${ar ? 'flex-row-reverse' : ''}`}>
                                    {ar ? 'طلبات الانضمام المعلّقة' : 'Pending Join Requests'}
                                    <span className="bg-error-container text-error text-label-sm px-2 py-0.5 rounded-full">1</span>
                                </h3>
                            </div>

                            {requestStatus === null ? (
                                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm relative overflow-hidden">
                                    <div className={`absolute top-0 ${ar ? 'right-0' : 'left-0'} w-1 h-full`} style={{ backgroundColor: '#FF4D2E' }} />
                                    <div className={`flex flex-col md:flex-row gap-6 ${ar ? 'md:flex-row-reverse' : ''}`}>
                                        {/* Avatar */}
                                        <div className="flex-shrink-0 flex flex-col items-center">
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden mb-3 border-2 border-surface-container-high shadow-inner">
                                                <img
                                                    className="w-full h-full object-cover"
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGWZsh5hb95_nQ-ArZECm2xz51h_f0sPqc4LL8qGy875HaknSaoOd9whCqRWOAJaYYuX_cBzGsQcjj8xhc7QoTT6y-XLY-KVOPvgiItAyfXLMKLZKaqxq-GFjHKVfw11WWKJratVoYRJUJkObmjI2Yh2SRjJkQAlP4hsyT5I5aoEcEKZ39ROl9jY0CJ-u0QfL5GKPKBgrP3_N9YxnPMk2WzIaIUweEhInZGIOhHa2d9HMQ9qQi-2PEjdpX9TumFB5OCFmHAI2G_Tcl"
                                                    alt="Alex Rivera"
                                                />
                                            </div>
                                            <div className={`flex items-center gap-1 text-on-surface-variant ${ar ? 'flex-row-reverse' : ''}`}>
                                                <span className="material-symbols-outlined text-[16px]">work</span>
                                                <span className="font-label-sm text-label-sm">{ar ? '3 سنوات خبرة' : '3 Years Exp'}</span>
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="flex-grow">
                                            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3 ${ar ? 'md:flex-row-reverse' : ''}`}>
                                                <h4 className="font-title-lg text-title-lg text-on-surface">Alex Rivera</h4>
                                                <div className={`flex gap-4 ${ar ? 'flex-row-reverse' : ''}`}>
                                                    {['CV', 'GitHub', 'LinkedIn'].map((lbl) => (
                                                        <a key={lbl} className="text-on-surface-variant hover:text-primary flex items-center gap-1 font-label-sm text-label-sm transition-colors" href="#">
                                                            <span className="material-symbols-outlined text-[18px]">
                                                                {lbl === 'CV' ? 'description' : lbl === 'GitHub' ? 'code' : 'link'}
                                                            </span>
                                                            {lbl}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className={`flex flex-wrap gap-2 mb-4 ${ar ? 'flex-row-reverse' : ''}`}>
                                                {['Python', 'PyTorch', 'Computer Vision', 'React'].map((s) => (
                                                    <span key={s} className="px-3 py-1 rounded-lg bg-surface-container text-primary font-label-sm text-label-sm">{s}</span>
                                                ))}
                                            </div>

                                            <p className={`font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed ${ar ? 'text-right' : ''}`}>
                                                {ar
                                                    ? 'شغوف ببناء حلول ذكاء اصطناعي قابلة للتطوير. عملت مؤخراً على نظام كشف الأجسام الآني للطائرات المسيّرة المستقلة.'
                                                    : 'Passionate about building scalable AI solutions. I recently worked on a real-time object detection system for autonomous drones. Looking to join a team that values clean code and innovative problem-solving.'}
                                            </p>

                                            <div className={`flex items-center gap-3 ${ar ? 'flex-row-reverse' : ''}`}>
                                                <button
                                                    className="flex-1 md:flex-none px-8 py-2.5 rounded-xl font-label-md text-label-md shadow-sm active:scale-95 transition-all"
                                                    style={{ backgroundColor: '#FF4D2E', color: '#fff' }}
                                                    onClick={() => setRequestStatus('accepted')}
                                                >
                                                    {ar ? 'قبول الطلب' : 'Accept Request'}
                                                </button>
                                                <button
                                                    className="flex-1 md:flex-none px-8 py-2.5 rounded-xl border border-outline text-on-surface-variant font-label-md text-label-md hover:bg-error-container hover:text-error hover:border-error transition-all active:scale-95"
                                                    onClick={() => setRequestStatus('rejected')}
                                                >
                                                    {ar ? 'رفض' : 'Reject'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 text-center">
                                    <p className="font-label-md text-label-md" style={{ color: requestStatus === 'accepted' ? '#FF4D2E' : 'var(--color-on-surface-variant)' }}>
                                        {requestStatus === 'accepted'
                                            ? (ar ? '✓ تم قبول الطلب' : '✓ Request accepted')
                                            : (ar ? 'تم رفض الطلب' : 'Request rejected')}
                                    </p>
                                </div>
                            )}
                        </section>

                        {/* Current Members */}
                        <section>
                            <h3 className={`font-headline-md text-headline-md text-on-surface mb-6 ${ar ? 'text-right' : ''}`}>
                                {ar ? 'الأعضاء الحاليون' : 'Current Members'}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {MEMBERS.map((m) => (
                                    <div key={m.id} className={`flex items-center gap-4 p-4 bg-surface-container-low border border-outline-variant rounded-xl hover:bg-surface-container transition-colors ${ar ? 'flex-row-reverse' : ''}`}>
                                        <div className="w-12 h-12 rounded-full overflow-hidden border border-outline-variant flex-shrink-0">
                                            <img className="w-full h-full object-cover" src={m.img} alt={m.name.en} />
                                        </div>
                                        <div className={ar ? 'text-right' : ''}>
                                            <h5 className="font-title-md text-title-md text-on-surface">{ar ? m.name.ar : m.name.en}</h5>
                                            <p className="font-label-sm text-label-sm text-on-surface-variant">{ar ? m.role.ar : m.role.en}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar — Right */}
                    <div className="space-y-stack_gap_lg">
                        {/* AI Insights */}
                        <div className="ai-gradient-border p-6 rounded-2xl shadow-lg">
                            <div className={`flex items-center gap-2 mb-4 ${ar ? 'flex-row-reverse' : ''}`}>
                                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: '"FILL" 1' }}>auto_awesome</span>
                                <h4 className="font-label-md text-label-md text-secondary font-bold uppercase tracking-wide">
                                    {ar ? 'توصية AI' : 'AI Recommendation'}
                                </h4>
                            </div>
                            <p className={`font-body-md text-body-md text-on-surface mb-4 ${ar ? 'text-right' : ''}`} style={{ textTransform: 'none' }}>
                                {ar
                                    ? <>بناءً على مشروعك "NeuralMesh"، خبرة Alex Rivera في <strong>PyTorch</strong> و<strong>Computer Vision</strong> تجعله <span style={{ color: '#FF4D2E', fontWeight: 700 }}>تطابقاً بنسبة 94%</span> للثغرات التقنية في فريقك.</>
                                    : <>Based on your project "NeuralMesh", Alex Rivera's experience with <strong>PyTorch</strong> and <strong>Computer Vision</strong> makes them a <span style={{ color: '#FF4D2E', fontWeight: 700 }}>94% match</span> for your team's technical gaps.</>}
                            </p>
                            <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: '94%', backgroundColor: '#FF4D2E' }} />
                            </div>
                        </div>

                        {/* Project Progress */}
                        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant">
                            <h4 className={`font-title-lg text-title-lg text-on-surface mb-4 ${ar ? 'text-right' : ''}`}>
                                {ar ? 'تقدّم المشروع' : 'Project Progress'}
                            </h4>
                            <div className="space-y-4">
                                {[
                                    { label: { en: 'Architecture', ar: 'البنية المعمارية' }, pct: 85 },
                                    { label: { en: 'Frontend Mockups', ar: 'تصاميم الواجهة' }, pct: 40 },
                                ].map(({ label, pct }) => (
                                    <div key={pct}>
                                        <div className={`flex justify-between items-center mb-1 ${ar ? 'flex-row-reverse' : ''}`}>
                                            <span className="font-label-md text-label-md text-on-surface-variant">{ar ? label.ar : label.en}</span>
                                            <span className="font-mono text-label-md" style={{ color: '#FF4D2E' }}>{pct}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                                            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: '#FF4D2E' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-2.5 rounded-xl border font-label-md text-label-md transition-colors hover:opacity-90" style={{ borderColor: '#FF4D2E', color: '#FF4D2E' }}>
                                {ar ? 'عرض خارطة الطريق' : 'View Roadmap'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <AppFooter />
        </>
    )
}
