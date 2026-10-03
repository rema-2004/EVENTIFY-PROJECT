import AppLangToggle from '../../components/app/AppLangToggle'
import AppFooter from '../../components/app/AppFooter'
import AppPageHead from '../../components/app/AppPageHead'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'

const OPTIONS = [
    {
        key: 'solo',
        to: '/app/registration-success',
        iconBg: 'bg-primary-fixed',
        icon: 'person',
        iconColor: 'text-primary',
        title: { en: 'Participate Solo', ar: 'المشاركة منفرداً' },
        desc:  { en: 'Join as an individual competitor.', ar: 'انضم كمتسابق فردي.' },
        badge: { en: 'No team required', ar: 'لا يلزم فريق' },
        badgeCls: 'bg-surface-container-highest text-on-surface-variant',
    },
    {
        key: 'team',
        to: '/app/teams',
        iconBg: 'bg-secondary-fixed',
        icon: 'groups',
        iconColor: 'text-secondary',
        title: { en: 'Looking for a Team', ar: 'البحث عن فريق' },
        desc:  { en: 'Browse existing teams and request to join one.', ar: 'تصفّح الفرق الموجودة واطلب الانضمام إلى إحداها.' },
        badge: { en: 'Find teammates easily', ar: 'ابحث عن زملاء بسهولة' },
        badgeCls: 'bg-secondary-container/10 text-secondary',
    },
    {
        key: 'create',
        to: '/app/create-team',
        iconBg: 'bg-tertiary-fixed',
        icon: 'add_circle',
        iconColor: 'text-tertiary',
        title: { en: 'Create a Team', ar: 'إنشاء فريق' },
        desc:  { en: 'Create your own team and recruit members.', ar: 'أنشئ فريقك الخاص واستقطب الأعضاء.' },
        badge: { en: 'Become a team leader', ar: 'كن قائد الفريق' },
        badgeCls: 'bg-tertiary-fixed-dim/20 text-tertiary border border-tertiary/20',
    },
]

export default function ParticipationType() {
    const { language } = useLanguage()
    const ar = language === 'ar'
    const navigate = useNavigate()
    const [selected, setSelected] = useState(null)

    const selectedOpt = OPTIONS.find((o) => o.key === selected)

    return (
        <>
            <AppPageHead title={ar ? 'نوع المشاركة | EVENTIFY' : 'Participation Type | EVENTIFY'} />

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
                    to="/app/opportunity"
                    aria-label="Close"
                >
                    <span className="material-symbols-outlined text-on-surface-variant">close</span>
                </Link>
            </header>

            <div className="min-h-[calc(100vh-64px)] flex flex-col" dir={ar ? 'rtl' : 'ltr'}>
                <main className="flex-grow flex items-center justify-center p-4 md:p-8">
                    <div className="w-full max-w-4xl mx-auto space-y-10">

                        {/* Step indicator + heading */}
                        <div className="text-center space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-container-high rounded-full">
                                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#FF4D2E' }} />
                                <span className="font-label-md text-label-md text-on-surface-variant">
                                    {ar ? 'الخطوة 1 من 3' : 'Step 1 of 3'}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <h1 className="font-headline-lg text-headline-lg text-on-surface">
                                    {ar ? 'كيف تريد المشاركة؟' : 'How would you like to participate?'}
                                </h1>
                                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mx-auto">
                                    {ar ? 'اختر طريقة مشاركتك في هذه المسابقة.' : 'Select how you want to join this competition.'}
                                </p>
                            </div>
                        </div>

                        {/* Options grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {OPTIONS.map((opt) => {
                                const isActive = selected === opt.key
                                return (
                                    <button
                                        key={opt.key}
                                        type="button"
                                        className={`flex flex-col items-start p-6 rounded-xl border transition-all duration-300 text-left relative ${ar ? 'text-right' : 'text-left'} ${
                                            isActive
                                                ? 'border-[#FF4D2E] bg-surface-container-low -translate-y-1'
                                                : 'bg-surface border-outline-variant hover:border-[#FF4D2E]/50 hover:bg-surface-container-low'
                                        }`}
                                        style={{ boxShadow: '0 4px 20px -2px rgba(15,23,42,0.08)' }}
                                        onClick={() => setSelected(opt.key)}
                                    >
                                        {/* Check badge */}
                                        <div className={`absolute top-4 ${ar ? 'left-4' : 'right-4'} transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                                            <span
                                                className="material-symbols-outlined"
                                                style={{ color: '#FF4D2E', fontVariationSettings: '"FILL" 1' }}
                                            >check_circle</span>
                                        </div>

                                        {/* Icon */}
                                        <div className={`w-12 h-12 rounded-lg ${opt.iconBg} flex items-center justify-center mb-6`}>
                                            <span className={`material-symbols-outlined ${opt.iconColor} text-2xl`}>{opt.icon}</span>
                                        </div>

                                        {/* Text */}
                                        <div className="space-y-3 mb-8 flex-grow">
                                            <h3 className="font-title-lg text-title-lg text-on-surface">
                                                {ar ? opt.title.ar : opt.title.en}
                                            </h3>
                                            <p className="font-body-md text-body-md text-on-surface-variant">
                                                {ar ? opt.desc.ar : opt.desc.en}
                                            </p>
                                        </div>

                                        {/* Badge */}
                                        <span className={`inline-block px-3 py-1 rounded-full font-label-sm text-label-sm ${opt.badgeCls}`}>
                                            {ar ? opt.badge.ar : opt.badge.en}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Continue button */}
                        <div className="flex flex-col items-center pt-8">
                            <button
                                type="button"
                                className="w-full md:w-64 py-4 px-8 rounded-full font-title-lg text-title-lg shadow-lg active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                                style={selected ? { backgroundColor: '#FF4D2E', color: '#fff' } : { backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-on-surface-variant)' }}
                                disabled={!selected}
                                onClick={() => selectedOpt && navigate(selectedOpt.to)}
                            >
                                {ar ? 'متابعة' : 'Continue'}
                            </button>
                            <p className="mt-4 font-label-md text-label-md text-on-surface-variant text-center">
                                {ar ? 'يمكنك تغيير هذا لاحقاً من إعدادات ملفك الشخصي.' : 'You can change this later in your profile settings.'}
                            </p>
                        </div>
                    </div>
                </main>

                <AppFooter />
            </div>

            {/* Background blobs */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full blur-3xl opacity-30" style={{ backgroundColor: 'rgba(255,77,46,0.05)' }} />
                <div className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl opacity-30" />
            </div>
        </>
    )
}
