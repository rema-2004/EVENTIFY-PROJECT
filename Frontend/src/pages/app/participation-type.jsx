import AppLangToggle from '../../components/app/AppLangToggle'
import AppFooter from '../../components/app/AppFooter'
import AppPageHead from '../../components/app/AppPageHead'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'

export default function ParticipationType() {
    const { language } = useLanguage()
    const ar = language === 'ar'
    const navigate = useNavigate()
    const location = useLocation()
    const compFromState = location.state?.competition

    // Track simulated override if user toggles buttons
    const [simulatedType, setSimulatedType] = useState(null)

    const getStoredComp = () => {
        try {
            const raw = sessionStorage.getItem('eventify_selected_competition')
            return raw ? JSON.parse(raw) : null
        } catch {
            return null
        }
    }

    // Current competition: always prefers navigated state, then stored, then fallback
    const comp = compFromState || getStoredComp() || {
        id: 'global-ai-innovation-challenge',
        title: ar ? 'تحدي الابتكار العالمي بالذكاء الاصطناعي' : 'Global AI Innovation Challenge',
        cat: 'competition',
        participationType: 'team',
    }

    // Reset simulatedType whenever comp changes
    useEffect(() => {
        setSimulatedType(null)
    }, [comp?.id, comp?.participationType])

    const participationType = simulatedType || comp?.participationType || 'team'
    const [selected, setSelected] = useState(null)

    const isOptionAllowed = (key) => {
        // عند اختيار مسابقة تيم: يتعطل الخيار الفردي
        if (participationType === 'team') {
            return key !== 'solo'
        }
        // عند اختيار مسابقة فردية: يتعطل خيار الفريق وخيار إنشاء فريق
        if (participationType === 'solo') {
            return key === 'solo'
        }
        // عند اختيار كلاهما: جميع الخيارات متاحة ومفعلة
        return true
    }

    const getDisabledReason = (key) => {
        if (participationType === 'team' && key === 'solo') {
            return ar
                ? '🔒 معطّل: المسابقة تشترط المشاركة ضمن فريق'
                : '🔒 Disabled: Team required'
        }
        if (participationType === 'solo' && (key === 'team' || key === 'create')) {
            return ar
                ? '🔒 معطّل: المسابقة مخصصة للمتسابقين الأفراد فقط'
                : '🔒 Disabled: Solo participants only'
        }
        return ''
    }

    // إعادة ضبط التحديد تلقائياً إذا أصبح الخيار المختار غير متاح
    useEffect(() => {
        if (selected && !isOptionAllowed(selected)) {
            setSelected(null)
        }
    }, [participationType])

    const OPTIONS = [
        {
            key: 'solo',
            to: '/app/registration-success',
            accent: '#F59E0B',
            gradient: 'from-amber-500/20 via-amber-500/5 to-transparent',
            badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
            title: { en: 'Participate Solo', ar: 'المشاركة منفرداً' },
            subtitle: { en: 'Independent Hero', ar: 'متسابق مستقل' },
            desc: {
                en: 'Compete autonomously on your own terms. Deliver your prototype independently.',
                ar: 'نافس بمفردك واعتمد على مهاراتك الخاصة لإنجاز مشروعك وإثبات قدراتك.',
            },
            badge: { en: 'Solo Competitor', ar: 'متسابق فردي' },
            renderGraphic: () => (
                <div className="relative w-full h-36 rounded-2xl bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-surface-container-low/40 border border-amber-500/20 p-3 flex flex-col justify-between overflow-hidden group-hover:border-amber-500/40 transition-colors">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex items-center justify-between text-[11px] font-mono z-10">
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            1x Competitor
                        </span>
                        <span className="text-on-surface-variant text-[10px]">100% Focus</span>
                    </div>
                    <div className="relative flex items-center justify-center my-auto z-10">
                        <div className="w-18 h-18 rounded-full border-2 border-dashed border-amber-500/30 flex items-center justify-center animate-[spin_20s_linear_infinite]">
                            <div className="w-2 h-2 rounded-full bg-amber-500 absolute -top-1" />
                        </div>
                        <div className="absolute w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
                            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>person</span>
                        </div>
                        <div className="absolute -left-1 bottom-0 px-2 py-0.5 rounded-md bg-surface/90 border border-outline-variant text-[10px] font-bold text-on-surface shadow-sm">
                            ⚡ Agility
                        </div>
                        <div className="absolute -right-1 top-0 px-2 py-0.5 rounded-md bg-surface/90 border border-outline-variant text-[10px] font-bold text-on-surface shadow-sm">
                            🎯 Self-Reliant
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-on-surface-variant font-medium pt-1 border-t border-amber-500/15 z-10">
                        <span>{ar ? 'لا يلزم فريق' : 'No team required'}</span>
                        <span className="text-amber-600 dark:text-amber-400 font-bold">{ar ? 'جاهز للمنافسة' : 'Ready to submit'}</span>
                    </div>
                </div>
            ),
        },
        {
            key: 'team',
            to: '/app/teams',
            accent: '#3B82F6',
            gradient: 'from-blue-500/20 via-blue-500/5 to-transparent',
            badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
            title: { en: 'Looking for a Team', ar: 'البحث عن فريق' },
            subtitle: { en: 'Squad Match', ar: 'استكشاف وتوفيق' },
            desc: {
                en: 'Browse teams actively recruiting your skill set. Request to join and build together.',
                ar: 'استكشف الفرق المفتوحة التي تبحث عن مهاراتك وقدّم طلب انضمام للعمل معاً.',
            },
            badge: { en: 'Find Teammates', ar: 'استكشف الفرق' },
            renderGraphic: () => (
                <div className="relative w-full h-36 rounded-2xl bg-gradient-to-b from-blue-500/10 via-blue-500/5 to-surface-container-low/40 border border-blue-500/20 p-3 flex flex-col justify-between overflow-hidden group-hover:border-blue-500/40 transition-colors">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex items-center justify-between text-[11px] font-mono z-10">
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-300 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                            Live Recruiting
                        </span>
                        <span className="text-on-surface-variant text-[10px]">Radar Active</span>
                    </div>
                    <div className="relative flex items-center justify-center gap-3 my-auto z-10">
                        <div className="w-9 h-9 rounded-xl bg-blue-600/80 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-500/20">
                            <span className="material-symbols-outlined text-[16px]">person</span>
                        </div>
                        <div className="w-4 h-0.5 bg-blue-500/40 relative">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 absolute -top-0.5 left-1/2 -translate-x-1/2 animate-pulse" />
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-indigo-600/80 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-indigo-500/20">
                            <span className="material-symbols-outlined text-[16px]">person</span>
                        </div>
                        <div className="w-4 h-0.5 bg-blue-500/40" />
                        <div className="w-11 h-11 rounded-xl border-2 border-dashed border-blue-500 bg-blue-500/20 text-blue-600 dark:text-blue-400 flex flex-col items-center justify-center animate-[pulse_2s_infinite] shadow-lg shadow-blue-500/30">
                            <span className="material-symbols-outlined text-[18px]">person_add</span>
                            <span className="text-[8px] font-black uppercase tracking-tighter">YOU?</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-on-surface-variant font-medium pt-1 border-t border-blue-500/15 z-10">
                        <span>{ar ? '3 فرق تستقطب حالياً' : '3 teams actively hiring'}</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold">{ar ? 'تطابق بالمهارات' : 'Skill-Matched'}</span>
                    </div>
                </div>
            ),
        },
        {
            key: 'create',
            to: '/app/create-team',
            accent: '#FF4D2E',
            gradient: 'from-[#FF4D2E]/20 via-[#FF4D2E]/5 to-transparent',
            badgeBg: 'bg-[#FF4D2E]/10 text-[#FF4D2E] border-[#FF4D2E]/20',
            title: { en: 'Create a Team', ar: 'إنشاء فريق' },
            subtitle: { en: 'Team Leader', ar: 'قائد الفريق' },
            desc: {
                en: 'Take the lead: Register your ready squad or recruit talent to complete your roster.',
                ar: 'تولّ القيادة: سجّل فريقك الجاهز فوراً أو استقطب الأعضاء لإكمال تشكيلة فريقك.',
            },
            badge: { en: 'Become Team Leader', ar: 'كن قائد الفريق' },
            renderGraphic: () => (
                <div className="relative w-full h-36 rounded-2xl bg-gradient-to-b from-[#FF4D2E]/10 via-[#FF4D2E]/5 to-surface-container-low/40 border border-[#FF4D2E]/20 p-3 flex flex-col justify-between overflow-hidden group-hover:border-[#FF4D2E]/40 transition-colors">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-[#FF4D2E]/15 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex items-center justify-between text-[11px] font-mono z-10">
                        <span className="px-2 py-0.5 rounded-full bg-[#FF4D2E]/20 text-[#FF4D2E] font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D2E] animate-ping" />
                            Squad Leader
                        </span>
                        <span className="text-on-surface-variant text-[10px]">Roster Control</span>
                    </div>
                    <div className="relative flex items-center justify-center my-auto z-10">
                        <div className="w-24 h-16 rounded-2xl border border-[#FF4D2E]/30 bg-surface/50 flex items-center justify-around px-2 relative">
                            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-base">👑</span>
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#FF4D2E] to-[#FF7A59] text-white flex items-center justify-center font-bold text-xs shadow-md shadow-[#FF4D2E]/30">
                                L
                            </div>
                            <span className="text-[#FF4D2E] text-xs font-bold">+</span>
                            <div className="w-6 h-6 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center text-[10px] text-on-surface">
                                2
                            </div>
                            <div className="w-6 h-6 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center text-[10px] text-on-surface">
                                3
                            </div>
                            <div className="w-6 h-6 rounded-lg border border-dashed border-[#FF4D2E]/50 flex items-center justify-center text-[10px] text-[#FF4D2E]">
                                4
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-on-surface-variant font-medium pt-1 border-t border-[#FF4D2E]/15 z-10">
                        <span>{ar ? 'جاهز أو استقطاب' : 'Full team or recruit'}</span>
                        <span className="text-[#FF4D2E] font-bold">{ar ? 'تحكم كامل' : 'Full Ownership'}</span>
                    </div>
                </div>
            ),
        },
    ]

    const selectedOpt = OPTIONS.find((o) => o.key === selected)

    return (
        <>
            <AppPageHead title={ar ? 'نوع المشاركة | EVENTIFY' : 'Participation Type | EVENTIFY'} />

            {/* Task-flow header with original platform logo */}
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

            <div className="min-h-[calc(100vh-64px)] flex flex-col relative overflow-hidden" dir={ar ? 'rtl' : 'ltr'}>
                {/* Visual Ambient Glows */}
                <div className="fixed top-12 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#FF4D2E]/10 via-[#FF4D2E]/5 to-transparent blur-3xl pointer-events-none -z-10" />

                <main className="flex-grow flex items-center justify-center p-4 sm:p-8">
                    <div className="w-full max-w-5xl mx-auto space-y-8 my-auto">

                        {/* Active Competition Indicator & Simulation Switcher */}
                        <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm shadow-sm backdrop-blur">
                            <div className={`flex items-center gap-3 ${ar ? 'flex-row-reverse text-right' : ''}`}>
                                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[22px]">emoji_events</span>
                                </div>
                                <div>
                                    <div className="font-bold text-on-surface leading-tight text-base">
                                        {comp.title}
                                    </div>
                                    <div className={`text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5 ${ar ? 'flex-row-reverse' : ''}`}>
                                        <span>{ar ? 'نوع المشاركة المسموح:' : 'Allowed Mode:'}</span>
                                        <span className="font-bold text-primary">
                                            {participationType === 'team'
                                                ? (ar ? '👥 تيم (يتعطل الفردي)' : '👥 Team (Solo Disabled)')
                                                : participationType === 'solo'
                                                ? (ar ? '👤 فردي (يتعطل التيم)' : '👤 Solo (Teams Disabled)')
                                                : (ar ? '👥+👤 كلاهما (جميع الخيارات مفعلة)' : '👥+👤 Both (All Active)')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Live Simulation Switcher (Quick test pills) */}
                            <div className={`flex items-center gap-1 bg-surface rounded-xl p-1 border border-outline-variant/40 shrink-0 ${ar ? 'flex-row-reverse' : ''}`}>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant px-1.5 hidden sm:inline">
                                    {ar ? 'محاكاة:' : 'Test:'}
                                </span>
                                {[
                                    { val: 'team', labelAr: 'تيم', labelEn: 'Team' },
                                    { val: 'solo', labelAr: 'فردي', labelEn: 'Solo' },
                                    { val: 'both', labelAr: 'كلاهما', labelEn: 'Both' },
                                ].map((t) => (
                                    <button
                                        key={t.val}
                                        type="button"
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            participationType === t.val
                                                ? 'bg-[#FF4D2E] text-white shadow-sm'
                                                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                                        }`}
                                        onClick={() => setSimulatedType(t.val)}
                                    >
                                        {ar ? t.labelAr : t.labelEn}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Step indicator + heading */}
                        <div className="text-center space-y-3">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FF4D2E]/10 border border-[#FF4D2E]/20 text-[#FF4D2E] rounded-full">
                                <span className="w-2 h-2 rounded-full bg-[#FF4D2E] animate-ping" />
                                <span className="text-xs font-bold uppercase tracking-wider">
                                    {ar ? 'الخطوة 1 من 3 · طريقة الانضمام' : 'Step 1 of 3 · Participation Mode'}
                                </span>
                            </div>
                            <div className="space-y-1.5">
                                <h1 className="text-3xl sm:text-4xl font-black text-on-surface tracking-tight">
                                    {ar ? 'كيف تود المشاركة في هذه المسابقة؟' : 'How Would You Like to Participate?'}
                                </h1>
                                <p className="text-on-surface-variant text-base max-w-lg mx-auto">
                                    {ar
                                        ? 'اختر شكل المشاركة الأنسب لك وفقاً لشروط وقواعد هذه المسابقة.'
                                        : 'Select your preferred formation mode according to this competition rules.'}
                                </p>
                            </div>
                        </div>

                        {/* 3 Rich Visual Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {OPTIONS.map((opt) => {
                                const allowed = isOptionAllowed(opt.key)
                                const isActive = selected === opt.key && allowed
                                const disabledReason = !allowed ? getDisabledReason(opt.key) : null

                                return (
                                    <div
                                        key={opt.key}
                                        role="button"
                                        tabIndex={allowed ? 0 : -1}
                                        aria-disabled={!allowed}
                                        className={`group relative p-6 rounded-3xl border-2 transition-all duration-300 text-left flex flex-col justify-between ${
                                            ar ? 'text-right' : 'text-left'
                                        } ${
                                            !allowed
                                                ? 'opacity-40 grayscale-[60%] cursor-not-allowed bg-surface-container-low/40 border-dashed border-outline-variant select-none'
                                                : isActive
                                                ? 'border-[#FF4D2E] bg-surface/95 dark:bg-slate-900/95 -translate-y-2 shadow-2xl shadow-[#FF4D2E]/15 ring-4 ring-[#FF4D2E]/10 cursor-pointer'
                                                : 'bg-surface/80 dark:bg-slate-900/80 border-outline-variant/60 hover:border-outline-variant hover:bg-surface hover:-translate-y-1.5 shadow-sm cursor-pointer'
                                        }`}
                                        onClick={() => {
                                            if (!allowed) return
                                            setSelected(opt.key)
                                        }}
                                        onKeyDown={(e) => {
                                            if (allowed && e.key === 'Enter') setSelected(opt.key)
                                        }}
                                    >
                                        {/* Active Checkmark Pill */}
                                        {allowed && (
                                            <div className={`absolute top-4 ${ar ? 'left-4' : 'right-4'} z-20 transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                                                <div className="w-6 h-6 rounded-full bg-[#FF4D2E] text-white flex items-center justify-center shadow-md">
                                                    <span className="material-symbols-outlined text-[16px]">check</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Lock Badge if Disabled */}
                                        {!allowed && (
                                            <div className={`absolute top-4 ${ar ? 'left-4' : 'right-4'} z-20`}>
                                                <div className="px-2.5 py-1 rounded-full bg-error/15 border border-error/30 text-error flex items-center gap-1 font-bold text-[11px] shadow-sm">
                                                    <span className="material-symbols-outlined text-[14px]">lock</span>
                                                    <span>{ar ? 'معطّل' : 'Locked'}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Graphic Illustration Container */}
                                        <div className="mb-6">
                                            {opt.renderGraphic()}
                                        </div>

                                        {/* Content Block */}
                                        <div className="space-y-2 mb-6 flex-grow">
                                            <div className={`flex items-center justify-between ${ar ? 'flex-row-reverse' : ''}`}>
                                                <h3 className={`font-bold text-xl transition-colors ${allowed ? 'text-on-surface group-hover:text-primary' : 'text-on-surface-variant'}`}>
                                                    {ar ? opt.title.ar : opt.title.en}
                                                </h3>
                                            </div>
                                            <p className="text-xs text-on-surface-variant leading-relaxed">
                                                {ar ? opt.desc.ar : opt.desc.en}
                                            </p>

                                            {/* Disabled explanation message */}
                                            {!allowed && (
                                                <div className={`pt-2 text-xs font-bold text-error flex items-center gap-1 ${ar ? 'flex-row-reverse' : ''}`}>
                                                    <span className="material-symbols-outlined text-[15px]">info</span>
                                                    <span>{disabledReason}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Footer Badge & Arrow */}
                                        <div className={`pt-3 border-t border-outline-variant/40 flex items-center justify-between ${ar ? 'flex-row-reverse' : ''}`}>
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border ${allowed ? opt.badgeBg : 'bg-surface-container text-on-surface-variant/60 border-outline-variant/30'}`}>
                                                {ar ? opt.badge.ar : opt.badge.en}
                                            </span>
                                            <span className={`material-symbols-outlined text-[18px] transition-all ${allowed ? 'text-outline group-hover:translate-x-1 group-hover:text-primary' : 'text-outline-variant/40'}`}>
                                                {ar ? 'arrow_back' : 'arrow_forward'}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Continue button */}
                        <div className="flex flex-col items-center pt-4">
                            <button
                                type="button"
                                className="w-full sm:w-72 py-4 px-8 rounded-full font-bold text-base shadow-xl shadow-[#FF4D2E]/25 hover:shadow-2xl hover:shadow-[#FF4D2E]/40 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 disabled:shadow-none text-white"
                                style={{ backgroundColor: '#FF4D2E' }}
                                disabled={!selected}
                                onClick={() => selectedOpt && navigate(selectedOpt.to, { state: { competition: comp, type: selected } })}
                            >
                                {ar ? 'متابعة الخطوة التالية' : 'Continue to Next Step'}
                            </button>
                            <p className="mt-3 text-xs text-on-surface-variant text-center">
                                {ar ? 'يمكنك دائماً تعديل أو إدارة فريقك لاحقاً من ملفك الشخصي.' : 'You can always update team details from your dashboard later.'}
                            </p>
                        </div>
                    </div>
                </main>

                <AppFooter />
            </div>
        </>
    )
}
