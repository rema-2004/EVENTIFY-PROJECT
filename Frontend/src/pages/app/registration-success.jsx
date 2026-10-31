import AppLangToggle from '../../components/app/AppLangToggle'
import AppFooter from '../../components/app/AppFooter'
import AppPageHead from '../../components/app/AppPageHead'
import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { readSessionJSON } from '../../utils/storage'

export default function RegistrationSuccess() {
    const { language } = useLanguage()
    const ar = language === 'ar'
    const { state } = useLocation()

    // Retrieve opportunity object from state or sessionStorage
    const comp = state?.competition || state?.opportunity
        || readSessionJSON('eventify_selected_competition', null)
        || readSessionJSON('eventify_selected_opportunity', {})

    const cat = comp?.cat || 'competition'
    const opportunityTitle = comp?.title || (ar ? 'تحدي الابتكار العالمي بالذكاء الاصطناعي' : 'Global AI Innovation Challenge')

    const type = state?.type ?? 'solo'
    const team = state?.team || (ar ? 'فريقك' : 'your team')
    const mode = state?.mode ?? 'ready'
    const members = state?.members ?? []

    // Ensure this registration is added to "My Applications"
    useEffect(() => {
        if (!opportunityTitle) return
        try {
            const STORAGE_KEY = 'eventify_my_applications'
            const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
            const titleEn = typeof comp?.title === 'object' ? comp.title.en : (typeof comp?.title === 'string' ? comp.title : opportunityTitle)
            const titleAr = typeof comp?.title === 'object' ? comp.title.ar : (typeof comp?.title === 'string' ? comp.title : opportunityTitle)
            const exists = existing.some(item => 
                (comp?.id && (item.eventId === comp.id || item.id === comp.id)) ||
                item.title?.ar === titleAr ||
                item.title?.en === titleEn
            )

            if (!exists) {
                const newRegistration = {
                    id: Date.now(),
                    eventId: comp?.id || Date.now(),
                    status: type === 'join' ? 'pending' : 'accepted',
                    icon: cat === 'course' ? 'school' : cat === 'workshop' ? 'terminal' : cat === 'event' ? 'campaign' : 'emoji_events',
                    iconBg: type === 'join' ? 'bg-primary/10' : 'bg-success/10',
                    iconColor: type === 'join' ? 'text-primary' : 'text-success',
                    iconFill: type !== 'join',
                    title: { en: titleEn, ar: titleAr },
                    sub: {
                        en: `${comp?.org || 'Eventify Partner'} • Registered Today`,
                        ar: `${comp?.org || 'شريك EVENTIFY'} • سُجل اليوم`,
                    },
                    badge: type === 'join' ? { en: 'Pending Review', ar: 'قيد المراجعة' } : { en: 'Confirmed', ar: 'مقبول ومؤكد' },
                    badgeCls: type === 'join' ? 'bg-tertiary/10 text-tertiary' : 'bg-success/10 text-success',
                }
                localStorage.setItem(STORAGE_KEY, JSON.stringify([newRegistration, ...existing]))
            }
        } catch {}
    }, [comp, cat, type, opportunityTitle])

    // Copy, step badge, and icons per category & registration path
    const getOutcome = () => {
        if (cat === 'course') {
            return {
                icon: 'school',
                pending: false,
                stepBadge: ar ? 'الخطوة 2 من 2 · تأكيد التسجيل بالدورة' : 'Step 2 of 2 · Course Registration Confirmed',
                title: ar ? 'تم التسجيل في الدورة بنجاح!' : 'Course Registration Confirmed!',
                body: ar
                    ? <>سُجِّلت بنجاح في الدورة التدريبية <span className="font-bold text-on-surface">"{opportunityTitle}"</span>. ملفك مكتمل وبإمكانك الآن الوصول لمنهج الدورة وبدء التعلم فور انطلاقها.</>
                    : <>You're enrolled in <span className="font-bold text-on-surface">"{opportunityTitle}"</span>. You're all set to access the curriculum and start learning.</>,
                label: ar ? 'دورة تدريبية (تسجيل فردي معتمد)' : 'Training Course (Certified Individual)',
                emailNote: ar
                    ? 'تم إرسال رابط الانضمام ومنهاج الدورة التدريبية إلى بريدك الإلكتروني.'
                    : 'A confirmation with syllabus and course portal link has been sent to your email.',
                detailsBtn: ar ? 'تفاصيل الدورة' : 'Course Details',
            }
        }

        if (cat === 'workshop') {
            return {
                icon: 'terminal',
                pending: false,
                stepBadge: ar ? 'الخطوة 2 من 2 · تأكيد حجز مقعد الورشة' : 'Step 2 of 2 · Workshop Seat Confirmed',
                title: ar ? 'تم حجز مقعدك في الورشة بنجاح!' : 'Workshop Seat Reserved!',
                body: ar
                    ? <>تم تأكيد حجز مقعدك في ورشة العمل التفاعلية <span className="font-bold text-on-surface">"{opportunityTitle}"</span>. جهّز أدواتك لحضور الجلسة التطبيقية المباشرة.</>
                    : <>Your seat is reserved for the workshop <span className="font-bold text-on-surface">"{opportunityTitle}"</span>. Get ready for the live hands-on session.</>,
                label: ar ? 'ورشة عمل تطبيقية (مقعد مؤكد)' : 'Interactive Workshop (Confirmed Seat)',
                emailNote: ar
                    ? 'تم إرسال تذكرة الحضور ورابط القاعة الافتراضية للورشة إلى بريدك الإلكتروني.'
                    : 'Your workshop access pass and workspace link have been sent to your email.',
                detailsBtn: ar ? 'تفاصيل الورشة' : 'Workshop Details',
            }
        }

        if (cat === 'event') {
            return {
                icon: 'campaign',
                pending: false,
                stepBadge: ar ? 'الخطوة 2 من 2 · تأكيد الحضور بالفعالية' : 'Step 2 of 2 · Event Pass Confirmed',
                title: ar ? 'تم تأكيد حضورك في الفعالية!' : 'Attendance Confirmed!',
                body: ar
                    ? <>تم تأكيد تسجيلك وحجز تذكرة حضور <span className="font-bold text-on-surface">"{opportunityTitle}"</span> مجاناً. نتطلع لمشاركتك والتفاعل معك خلال الفعالية.</>
                    : <>Your free access pass for <span className="font-bold text-on-surface">"{opportunityTitle}"</span> has been confirmed. We look forward to seeing you!</>,
                label: ar ? 'تذكرة حضور فعالية / مؤتمر' : 'Event / Conference Pass',
                emailNote: ar
                    ? 'تم إرسال تذكرة الدخول الرقمية والجدول الزمني للفعالية إلى بريدك الإلكتروني.'
                    : 'Your digital entrance pass and schedule have been sent to your email.',
                detailsBtn: ar ? 'تفاصيل الفعالية' : 'Event Details',
            }
        }

        // Default: competition
        const OUTCOMES = {
            solo: {
                icon: 'person',
                pending: false,
                stepBadge: ar ? 'الخطوة 3 من 3 · تأكيد التسجيل' : 'Step 3 of 3 · Confirmation',
                title: ar ? 'تم التسجيل بنجاح!' : 'Registration Successful!',
                body: ar
                    ? <>سُجِّلت كمشارك فردي في <span className="font-bold text-on-surface">"{opportunityTitle}"</span>. ملفك مكتمل وأنت جاهز لخوض التحدي.</>
                    : <>You're registered as a solo participant for <span className="font-bold text-on-surface">"{opportunityTitle}"</span>. You're all set to compete on your own.</>,
                label: ar ? 'مشاركة فردية' : 'Solo competitor',
                emailNote: ar
                    ? 'تم إرسال إشعار تأكيد إلى بريدك الإلكتروني يتضمن التفاصيل والخطوات التالية.'
                    : 'A confirmation has been sent to your email with next steps and deadlines.',
                detailsBtn: ar ? 'تفاصيل المسابقة' : 'Competition Details',
            },
            create: {
                icon: mode === 'ready' ? 'groups' : 'add_circle',
                pending: false,
                stepBadge: ar ? 'الخطوة 3 من 3 · تأكيد التسجيل' : 'Step 3 of 3 · Confirmation',
                title: mode === 'ready'
                    ? (ar ? 'تم تسجيل وتوثيق الفريق بنجاح!' : 'Complete Team Registered!')
                    : (ar ? 'تم إنشاء الفريق!' : 'Team Created!'),
                body: ar
                    ? (mode === 'ready'
                        ? <>سُجِّل فريقك <span className="font-bold text-on-surface">"{team}"</span> رسمياً في <span className="font-bold text-on-surface">"{opportunityTitle}"</span> مع <span className="font-bold text-primary">{members.length}</span> من زملائك المضافين.</>
                        : <>أنشأت فريق <span className="font-bold text-on-surface">"{team}"</span> وسُجِّلت كقائد له في <span className="font-bold text-on-surface">"{opportunityTitle}"</span>. فريقك الآن معروض في لوحة الاستكشاف لاستقبال المتسابقين.</>)
                    : (mode === 'ready'
                        ? <>Your squad <span className="font-bold text-on-surface">"{team}"</span> was officially registered for <span className="font-bold text-on-surface">"{opportunityTitle}"</span> with <span className="font-bold text-primary">{members.length}</span> linked teammates.</>
                        : <>You created <span className="font-bold text-on-surface">"{team}"</span> as team leader in <span className="font-bold text-on-surface">"{opportunityTitle}"</span>. Your team is now live on Explore ready to receive candidate requests.</>),
                label: mode === 'ready' ? (ar ? 'فريق جاهز ومكتمل' : 'Full Squad') : (ar ? 'قائد فريق (يبحث عن أعضاء)' : 'Team Leader (Recruiting)'),
                emailNote: ar
                    ? 'تم إرسال إشعار تأكيد إلى بريدك الإلكتروني يتضمن التفاصيل والخطوات التالية.'
                    : 'A confirmation has been sent to your email with next steps and deadlines.',
                detailsBtn: ar ? 'تفاصيل المسابقة' : 'Competition Details',
            },
            join: {
                icon: 'groups',
                pending: true,
                stepBadge: ar ? 'الخطوة 3 من 3 · إرسال طلب الانضمام' : 'Step 3 of 3 · Request Sent',
                title: ar ? 'تم إرسال طلب الانضمام!' : 'Join Request Sent!',
                body: ar
                    ? <>أُرسل طلب انضمامك إلى <span className="font-bold text-on-surface">"{team}"</span>. يكتمل تسجيلك النهائي في <span className="font-bold text-on-surface">"{opportunityTitle}"</span> فور موافقة قائد الفريق.</>
                    : <>Your request to join <span className="font-bold text-on-surface">"{team}"</span> was dispatched. Your registration completes once the leader approves.</>,
                label: ar ? 'بانتظار موافقة القائد' : 'Pending leader approval',
                emailNote: ar
                    ? 'تم إرسال إشعار تأكيد إلى بريدك الإلكتروني يتضمن تفاصيل طلبك.'
                    : 'A notification has been sent to your email with your join request details.',
                detailsBtn: ar ? 'تفاصيل المسابقة' : 'Competition Details',
            },
        }

        return OUTCOMES[type] ?? OUTCOMES.solo
    }

    const outcome = getOutcome()

    return (
        <>
            <AppPageHead title={ar ? 'تم التسجيل بنجاح | EVENTIFY' : 'Registration Successful | EVENTIFY'} />

            {/* Task-flow header */}
            <header className="glass-header sticky top-0 z-50 w-full h-16 border-b border-outline-variant/30 flex items-center px-6">
                <Link className="flex items-center gap-2" to="/app">
                    <span className="material-symbols-outlined text-3xl" style={{ color: '#FF4D2E', fontVariationSettings: '"FILL" 1' }}>hub</span>
                    <span className="font-headline-md text-headline-md font-black" style={{ color: '#FF4D2E' }}>EVENTIFY</span>
                </Link>
                <AppLangToggle className="ml-auto mr-3" />
                <Link
                    className="mr-3 font-label-md text-label-md"
                    style={{ color: '#FF4D2E' }}
                    to="/app/my-applications"
                >
                    {ar ? 'طلباتي' : 'My Applications'}
                </Link>
                <Link
                    className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
                    to="/app/my-applications"
                    aria-label="Close"
                >
                    <span className="material-symbols-outlined text-on-surface-variant">close</span>
                </Link>
            </header>

            <div className="min-h-[calc(100vh-64px)] flex flex-col relative overflow-hidden" dir={ar ? 'rtl' : 'ltr'}>
                {/* Visual Ambient Glows */}
                <div className="fixed top-12 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-emerald-500/10 via-[#FF4D2E]/10 to-transparent blur-3xl pointer-events-none -z-10" />

                <main className="flex-grow flex items-center justify-center p-4 sm:p-8">
                    <div className="w-full max-w-xl mx-auto text-center space-y-8 my-auto fade-in-up">

                        {/* Step badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-container-high/80 backdrop-blur-md rounded-full border border-outline-variant/40 shadow-sm">
                            <span className={`w-2 h-2 rounded-full ${outcome.pending ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
                            <span className="font-bold text-xs uppercase tracking-wider text-on-surface-variant">
                                {outcome.stepBadge}
                            </span>
                        </div>

                        {/* Animated Hero Success Icon */}
                        <div className="relative inline-block mx-auto">
                            <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-emerald-500/20 via-[#FF4D2E]/20 to-emerald-500/10 blur-xl animate-pulse" />
                            <div
                                className={`w-24 h-24 rounded-3xl ${
                                    outcome.pending
                                        ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                                        : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                                } flex items-center justify-center relative shadow-2xl shadow-emerald-500/20 animate-[successPop_0.6s_cubic-bezier(0.16,1,0.3,1)]`}
                            >
                                <span
                                    className="material-symbols-outlined text-5xl"
                                    style={{ fontVariationSettings: '"FILL" 1' }}
                                >
                                    {outcome.pending ? 'schedule' : 'verified'}
                                </span>
                            </div>
                        </div>

                        {/* Heading & Subtext */}
                        <div className="space-y-3">
                            <h1 className="text-3xl sm:text-4xl font-black text-on-surface tracking-tight">
                                {outcome.title}
                            </h1>
                            <p className="text-base text-on-surface-variant max-w-md mx-auto leading-relaxed">
                                {outcome.body}
                            </p>
                        </div>

                        {/* Detail card */}
                        <div
                            className={`bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-6 space-y-4 shadow-sm ${ar ? 'text-right' : 'text-left'}`}
                        >
                            <div className={`flex items-center gap-3 ${ar ? 'flex-row-reverse' : ''}`}>
                                <span className="material-symbols-outlined text-primary">{outcome.icon}</span>
                                <span className="font-label-md text-label-md text-on-surface">
                                    {ar ? 'نوع المشاركة: ' : 'Participation type: '}<span className="font-bold">{outcome.label}</span>
                                </span>
                            </div>

                            <div className={`flex items-center gap-3 ${ar ? 'flex-row-reverse' : ''}`}>
                                <span className="material-symbols-outlined text-primary">mail</span>
                                <span className="font-body-sm text-body-sm text-on-surface-variant">
                                    {outcome.emailNote}
                                </span>
                            </div>

                            {/* Linked members preview (if any for created team) */}
                            {type === 'create' && members.length > 0 && (
                                <div className="pt-3 border-t border-outline-variant/40 space-y-2">
                                    <span className="text-xs font-bold text-on-surface-variant block">
                                        {ar ? `الأعضاء المسجلون في الفريق (${members.length}):` : `Linked Teammates (${members.length}):`}
                                    </span>
                                    <div className={`flex flex-wrap gap-2 ${ar ? 'flex-row-reverse' : ''}`}>
                                        {members.map((m) => (
                                            <span key={m} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                {m}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Navigation Actions */}
                        <div className={`flex flex-col sm:flex-row gap-3 justify-center pt-2 ${ar ? 'sm:flex-row-reverse' : ''}`}>
                            <Link
                                className="w-full sm:w-auto py-3.5 px-8 rounded-full border border-outline-variant text-on-surface font-bold text-sm hover:bg-surface-container-high active:scale-95 transition-all text-center"
                                to="/app/opportunity"
                                state={{ competition: comp }}
                            >
                                {outcome.detailsBtn}
                            </Link>

                            {cat === 'competition' && type === 'create' && mode === 'recruiting' && (
                                <Link
                                    className="w-full sm:w-auto py-3.5 px-8 rounded-full border border-outline-variant text-on-surface font-bold text-sm hover:bg-surface-container-high active:scale-95 transition-all text-center flex items-center justify-center gap-1.5"
                                    to="/app/team-dashboard"
                                >
                                    <span className="material-symbols-outlined text-[18px]">group_add</span>
                                    {ar ? 'لوحة استقطاب الأعضاء' : 'Recruitment Dashboard'}
                                </Link>
                            )}

                            <Link
                                className="w-full sm:w-auto py-3.5 px-8 rounded-full font-bold text-sm shadow-xl shadow-[#FF4D2E]/25 hover:shadow-2xl hover:shadow-[#FF4D2E]/40 active:scale-95 transition-all text-center text-white"
                                style={{ backgroundColor: '#FF4D2E' }}
                                to="/app/my-applications"
                            >
                                {ar ? 'متابعة في طلباتي' : 'View in My Applications'}
                            </Link>
                        </div>
                    </div>
                </main>

                <AppFooter />
            </div>
        </>
    )
}
