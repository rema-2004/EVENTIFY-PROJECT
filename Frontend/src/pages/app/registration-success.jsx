import AppLangToggle from '../../components/app/AppLangToggle'
import AppFooter from '../../components/app/AppFooter'
import AppPageHead from '../../components/app/AppPageHead'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'

export default function RegistrationSuccess() {
    const { language } = useLanguage()
    const ar = language === 'ar'
    const { state } = useLocation()
    const type = state?.type ?? 'solo'
    const team = state?.team || (ar ? 'فريقك' : 'your team')
    const mode = state?.mode ?? 'ready'
    const members = state?.members ?? []
    const competition = ar ? 'تحدي الابتكار العالمي بالذكاء الاصطناعي' : 'Global AI Innovation Challenge'

    // Copy and icons per registration path
    const OUTCOMES = {
        solo: {
            icon: 'person', pending: false,
            title: ar ? 'تم التسجيل بنجاح!' : 'Registration Successful!',
            body: ar
                ? <>سُجِّلت كمشارك فردي في <span className="font-bold text-on-surface">{competition}</span>. ملفك مكتمل وأنت جاهز لخوض التحدي.</>
                : <>You're registered as a solo participant for <span className="font-bold text-on-surface">{competition}</span>. You're all set to compete on your own.</>,
            label: ar ? 'مشاركة فردية' : 'Solo competitor',
        },
        create: {
            icon: mode === 'ready' ? 'groups' : 'add_circle', pending: false,
            title: mode === 'ready'
                ? (ar ? 'تم تسجيل وتوثيق الفريق بنجاح!' : 'Complete Team Registered!')
                : (ar ? 'تم إنشاء الفريق!' : 'Team Created!'),
            body: ar
                ? (mode === 'ready'
                    ? <>سُجِّل فريقك <span className="font-bold text-on-surface">"{team}"</span> رسمياً في <span className="font-bold text-on-surface">{competition}</span> مع <span className="font-bold text-primary">{members.length}</span> من زملائك المضافين.</>
                    : <>أنشأت فريق <span className="font-bold text-on-surface">"{team}"</span> وسُجِّلت كقائد له في <span className="font-bold text-on-surface">{competition}</span>. فريقك الآن معروض في لوحة الاستكشاف لاستقبال المتسابقين.</>)
                : (mode === 'ready'
                    ? <>Your squad <span className="font-bold text-on-surface">"{team}"</span> was officially registered for <span className="font-bold text-on-surface">{competition}</span> with <span className="font-bold text-primary">{members.length}</span> linked teammates.</>
                    : <>You created <span className="font-bold text-on-surface">"{team}"</span> as team leader. Your team is now live on Explore ready to receive candidate requests.</>),
            label: mode === 'ready' ? (ar ? 'فريق جاهز ومكتمل' : 'Full Squad') : (ar ? 'قائد فريق (يبحث عن أعضاء)' : 'Team Leader (Recruiting)'),
        },
        join: {
            icon: 'groups', pending: true,
            title: ar ? 'تم إرسال طلب الانضمام!' : 'Join Request Sent!',
            body: ar
                ? <>أُرسل طلب انضمامك إلى <span className="font-bold text-on-surface">{team}</span>. يكتمل تسجيلك النهائي في <span className="font-bold text-on-surface">{competition}</span> فور موافقة قائد الفريق.</>
                : <>Your request to join <span className="font-bold text-on-surface">{team}</span> was dispatched. Your registration completes once the leader approves.</>,
            label: ar ? 'بانتظار موافقة القائد' : 'Pending leader approval',
        },
    }
    const outcome = OUTCOMES[type] ?? OUTCOMES.solo

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
                    <div className="w-full max-w-xl mx-auto text-center space-y-8 my-auto">

                        {/* Step 3 of 3 badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-container-high/80 backdrop-blur-md rounded-full border border-outline-variant/40 shadow-sm">
                            <span className={`w-2 h-2 rounded-full ${outcome.pending ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
                            <span className="font-bold text-xs uppercase tracking-wider text-on-surface-variant">
                                {ar ? 'الخطوة 3 من 3 · تأكيد التسجيل' : 'Step 3 of 3 · Confirmation'}
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
                                    {ar
                                        ? 'تم إرسال إشعار تأكيد إلى بريدك الإلكتروني يتضمن التفاصيل والخطوات التالية.'
                                        : 'A confirmation has been sent to your email with next steps and deadlines.'}
                                </span>
                            </div>

                            {/* Linked members preview (if any) */}
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
                            >
                                {ar ? 'تفاصيل المسابقة' : 'Competition Details'}
                            </Link>

                            {type === 'create' && mode === 'recruiting' && (
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
