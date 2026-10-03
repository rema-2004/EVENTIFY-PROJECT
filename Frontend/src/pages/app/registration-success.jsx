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
    const competition = ar ? 'تحدي الابتكار العالمي بالذكاء الاصطناعي' : 'Global AI Innovation Challenge'

    // Copy and icons per registration path: solo, created a team, or asked to join one.
    const OUTCOMES = {
        solo: {
            icon: 'person', pending: false,
            title: ar ? 'تم التسجيل بنجاح!' : 'Registration Successful!',
            body: ar
                ? <>سُجِّلت كمشارك فردي في <span className="font-semibold text-on-surface">{competition}</span>. لا حاجة لفريق — أنت مستعد للمنافسة بمفردك.</>
                : <>You're registered as a solo participant for <span className="font-semibold text-on-surface">{competition}</span>. No team needed — you're all set to compete on your own.</>,
            label: ar ? 'فردي' : 'Solo',
        },
        create: {
            icon: 'add_circle', pending: false,
            title: ar ? 'تم إنشاء الفريق!' : 'Team Created!',
            body: ar
                ? <>أنشأت <span className="font-semibold text-on-surface">{team}</span> وسُجِّلت كقائد له في <span className="font-semibold text-on-surface">{competition}</span>. ادعُ الأعضاء من لوحة الفريق.</>
                : <>You created <span className="font-semibold text-on-surface">{team}</span> and are registered as its leader for <span className="font-semibold text-on-surface">{competition}</span>. Invite members from the team dashboard.</>,
            label: ar ? 'قائد فريق' : 'Team leader',
        },
        join: {
            icon: 'groups', pending: true,
            title: ar ? 'تم إرسال الطلب' : 'Request Sent',
            body: ar
                ? <>أُرسل طلب انضمامك إلى <span className="font-semibold text-on-surface">{team}</span>. يكتمل تسجيلك في <span className="font-semibold text-on-surface">{competition}</span> عندما يوافق قائد الفريق.</>
                : <>Your request to join <span className="font-semibold text-on-surface">{team}</span> was sent. Your registration for <span className="font-semibold text-on-surface">{competition}</span> completes once the team leader approves.</>,
            label: ar ? 'بانتظار موافقة القائد' : 'Pending leader approval',
        },
    }
    const outcome = OUTCOMES[type] ?? OUTCOMES.solo

    return (
        <>
            <AppPageHead title={ar ? 'تم التسجيل | EVENTIFY' : 'Registration Successful | EVENTIFY'} />

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

            <div className="min-h-[calc(100vh-64px)] flex flex-col" dir={ar ? 'rtl' : 'ltr'}>
                <main className="flex-grow flex items-center justify-center p-4 md:p-8">
                    <div className="w-full max-w-xl mx-auto text-center space-y-8">

                        {/* Step badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-container-high rounded-full">
                            <span className={`w-2 h-2 rounded-full ${outcome.pending ? 'bg-primary' : 'bg-success'}`} />
                            <span className="font-label-md text-label-md text-on-surface-variant">
                                {ar ? 'الخطوة 3 من 3' : 'Step 3 of 3'}
                            </span>
                        </div>

                        {/* Animated success icon */}
                        <div
                            className={`w-24 h-24 ${outcome.pending ? 'bg-surface-container-high' : 'bg-success-container'} rounded-full flex items-center justify-center mx-auto`}
                            style={{ animation: outcome.pending ? 'successPop .7s ease' : 'successPop .7s ease, successPulse 2s 0.7s infinite' }}
                        >
                            <span
                                className={`material-symbols-outlined ${outcome.pending ? 'text-primary' : 'text-success'} text-5xl`}
                                style={{ fontVariationSettings: '"FILL" 1', fontSize: 48 }}
                            >
                                {outcome.pending ? 'schedule' : 'check_circle'}
                            </span>
                        </div>

                        {/* Heading */}
                        <div className="space-y-3">
                            <h1 className="font-headline-lg text-headline-lg text-on-surface">{outcome.title}</h1>
                            <p className="font-body-lg text-body-lg text-on-surface-variant">{outcome.body}</p>
                        </div>

                        {/* Detail card */}
                        <div
                            className={`bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 space-y-3 ${ar ? 'text-right' : 'text-left'}`}
                            style={{ boxShadow: '0 4px 20px -2px rgba(15,23,42,0.08)' }}
                        >
                            <div className={`flex items-center gap-3 ${ar ? 'flex-row-reverse' : ''}`}>
                                <span className="material-symbols-outlined" style={{ color: '#FF4D2E' }}>{outcome.icon}</span>
                                <span className="font-label-md text-label-md text-on-surface">
                                    {ar ? 'نوع المشاركة: ' : 'Participation type: '}<span className="font-bold">{outcome.label}</span>
                                </span>
                            </div>
                            <div className={`flex items-center gap-3 ${ar ? 'flex-row-reverse' : ''}`}>
                                <span className="material-symbols-outlined" style={{ color: '#FF4D2E' }}>mail</span>
                                <span className="font-body-sm text-body-sm text-on-surface-variant">
                                    {ar
                                        ? 'رسالة تأكيد في طريقها إلى بريدك الإلكتروني تتضمن الخطوات التالية والمواعيد النهائية.'
                                        : 'A confirmation email is on its way to your inbox with next steps and important deadlines.'
                                    }
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className={`flex flex-col sm:flex-row gap-3 justify-center pt-2 ${ar ? 'sm:flex-row-reverse' : ''}`}>
                            <Link
                                className="w-full sm:w-auto py-4 px-8 rounded-full border border-outline-variant text-on-surface font-title-lg text-title-lg hover:bg-surface-container-low active:scale-95 transition-all duration-200 text-center"
                                to="/app/opportunity"
                            >
                                {ar ? 'العودة إلى الفرصة' : 'Back to Opportunity'}
                            </Link>
                            {type === 'create' && (
                                <Link
                                    className="w-full sm:w-auto py-4 px-8 rounded-full border border-outline-variant text-on-surface font-title-lg text-title-lg hover:bg-surface-container-low active:scale-95 transition-all duration-200 text-center"
                                    to="/app/team-dashboard"
                                >
                                    {ar ? 'لوحة الفريق' : 'Team Dashboard'}
                                </Link>
                            )}
                            <Link
                                className="w-full sm:w-auto py-4 px-8 rounded-full font-title-lg text-title-lg shadow-lg active:scale-95 transition-all duration-200 text-center"
                                style={{ backgroundColor: '#FF4D2E', color: '#fff' }}
                                to="/app/my-applications"
                            >
                                {ar ? 'طلباتي' : 'Go to My Applications'}
                            </Link>
                        </div>
                    </div>
                </main>

                <AppFooter />
            </div>

            {/* keyframe definitions */}
            <style>{`
                @keyframes successPop {
                    from { transform: scale(.5); opacity: 0; }
                    to   { transform: scale(1);  opacity: 1; }
                }
                @keyframes successPulse {
                    0%   { box-shadow: 0 0 0 0   rgba(30,122,79,.35); }
                    70%  { box-shadow: 0 0 0 22px rgba(30,122,79, 0); }
                    100% { box-shadow: 0 0 0 0   rgba(30,122,79, 0); }
                }
            `}</style>

            {/* Background blobs */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full blur-3xl opacity-30" style={{ backgroundColor: 'rgba(255,77,46,0.05)' }} />
                <div className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] bg-success/5 rounded-full blur-3xl opacity-30" />
            </div>
        </>
    )
}
