import AppLangToggle from '../../components/app/AppLangToggle'
import AppFooter from '../../components/app/AppFooter'
import AppPageHead from '../../components/app/AppPageHead'
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { teamSizeOptions } from './team-limits'

const QUICK_SKILL_SUGGESTIONS = ['React', 'Python', 'Tailwind', 'AI / LLMs', 'UI/UX Design', 'Node.js', 'PyTorch']

export default function CreateTeam() {
    const { language } = useLanguage()
    const ar = language === 'ar'
    const navigate = useNavigate()
    const { state } = useLocation()
    const comp = state?.competition || (() => {
        try {
            return JSON.parse(sessionStorage.getItem('eventify_selected_competition') || '{}')
        } catch {
            return null
        }
    })()

    // Team formation mode: 'ready' (جاهز ومكتمل) vs 'recruiting' (ناقص العدد ويبحث عن أعضاء)
    const [teamMode, setTeamMode] = useState('ready')

    // Team identity
    const [teamName, setTeamName] = useState('')
    const [teamDesc, setTeamDesc] = useState('')

    // Member capacity & explore visibility
    const [maxMembers, setMaxMembers] = useState(4)
    const [visible, setVisible] = useState(false)

    // Existing / Invited members (email or username)
    const [memberInput, setMemberInput] = useState('')
    const [invitedMembers, setInvitedMembers] = useState([])
    const [memberError, setMemberError] = useState('')

    // Required skills (for recruiting mode)
    const [skills, setSkills] = useState(['React', 'Tailwind', 'AI / LLMs'])
    const [skillInput, setSkillInput] = useState('')

    // Switch modes and set default sensible states
    const handleModeChange = (mode) => {
        setTeamMode(mode)
        if (mode === 'ready') {
            setVisible(false) // Private team: not visible in explore
        } else {
            setVisible(true) // Recruiting team: visible in explore
        }
    }

    // Add member by email or username
    const addMember = () => {
        const val = memberInput.trim()
        setMemberError('')

        if (!val) return

        // Max check (1 leader + invited members cannot exceed maxMembers)
        if (invitedMembers.length + 1 >= maxMembers) {
            setMemberError(
                ar
                    ? `تم بلوغ الحد الأقصى للفريق (${maxMembers} أعضاء شامل القائد).`
                    : `Maximum team limit reached (${maxMembers} members including leader).`
            )
            return
        }

        // Duplicate check
        if (invitedMembers.some((m) => m.toLowerCase() === val.toLowerCase())) {
            setMemberError(
                ar ? 'هذا العضو مضاف بالفعل في القائمة.' : 'This member is already in the list.'
            )
            return
        }

        setInvitedMembers((prev) => [...prev, val])
        setMemberInput('')
    }

    const removeMember = (identifier) => {
        setInvitedMembers((prev) => prev.filter((m) => m !== identifier))
        setMemberError('')
    }

    // Skills handling
    const addSkill = (e) => {
        if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
            e.preventDefault()
            const val = skillInput.trim().replace(/,$/, '')
            if (val && !skills.includes(val)) setSkills((prev) => [...prev, val])
            setSkillInput('')
        }
    }

    const toggleQuickSkill = (s) => {
        if (skills.includes(s)) {
            setSkills((prev) => prev.filter((x) => x !== s))
        } else {
            setSkills((prev) => [...prev, s])
        }
    }

    const removeSkill = (s) => setSkills((prev) => prev.filter((x) => x !== s))

    const handleSubmit = (e) => {
        e.preventDefault()
        navigate('/app/registration-success', {
            state: {
                type: 'create',
                team: teamName.trim(),
                mode: teamMode,
                members: invitedMembers,
                maxMembers,
                visible,
                competition: comp,
            },
        })
    }

    // Current members: 1 (leader) + invited
    const currentMemberCount = 1 + invitedMembers.length
    const remainingSlots = Math.max(0, maxMembers - currentMemberCount)

    return (
        <>
            <AppPageHead title={ar ? 'إنشاء وتسجيل فريق | EVENTIFY' : 'Create & Register Team | EVENTIFY'} />

            {/* Task-flow glass header */}
            <header className="sticky top-0 z-50 w-full h-16 border-b border-white/10 dark:border-white/5 bg-surface/80 backdrop-blur-xl flex items-center px-6 transition-all">
                <Link className="flex items-center gap-2" to="/app">
                    <span className="material-symbols-outlined text-3xl" style={{ color: '#FF4D2E', fontVariationSettings: '"FILL" 1' }}>hub</span>
                    <span className="font-headline-md text-headline-md font-black" style={{ color: '#FF4D2E' }}>EVENTIFY</span>
                </Link>
                <AppLangToggle className="ml-auto mr-3" />
                <Link
                    className="mr-3 font-label-md text-label-md px-3.5 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/15 transition-colors"
                    to="/app/my-applications"
                >
                    {ar ? 'طلباتي' : 'My Applications'}
                </Link>
                <Link
                    className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant hover:text-on-surface"
                    to="/app/participation-type"
                    aria-label="Close"
                >
                    <span className="material-symbols-outlined">close</span>
                </Link>
            </header>

            <div className="min-h-[calc(100vh-64px)] flex flex-col relative overflow-hidden" dir={ar ? 'rtl' : 'ltr'}>
                {/* Visual Ambient Glows */}
                <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#FF4D2E]/10 via-[#FF4D2E]/5 to-transparent blur-3xl pointer-events-none -z-10" />
                <div className="fixed -bottom-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />

                <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 flex flex-col items-center flex-grow">

                    {/* Stepper & Heading Hero */}
                    <div className="w-full max-w-2xl mb-8 space-y-4">
                        <div className={`flex items-center justify-between ${ar ? 'flex-row-reverse' : ''}`}>
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF4D2E]/10 border border-[#FF4D2E]/20 text-[#FF4D2E] text-xs font-bold uppercase tracking-wider">
                                <span className="w-2 h-2 rounded-full bg-[#FF4D2E] animate-ping" />
                                {ar ? 'الخطوة 2 من 3' : 'Step 2 of 3'}
                            </div>
                            <span className="text-xs font-medium text-on-surface-variant font-mono">
                                {ar ? 'إعداد الفريق والمشاركين' : 'Team Setup & Roster'}
                            </span>
                        </div>

                        <div className={`space-y-1.5 ${ar ? 'text-right' : ''}`}>
                            <h1 className="text-3xl sm:text-4xl font-black text-on-surface tracking-tight">
                                {ar ? 'أنشئ وسجّل فريقك' : 'Create & Register Your Team'}
                            </h1>
                            <p className="text-on-surface-variant text-base max-w-xl">
                                {ar
                                    ? 'سواء كان لديك زملاء جاهزون بالفعل أو تبحث عن استقطاب مواهب لإكمال الفريق، اختر حالتك وابدأ الآن.'
                                    : 'Whether you already have a full crew or need to recruit missing talent, select your setup below.'}
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden p-0.5 shadow-inner">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-[#FF4D2E] via-[#FF6F4C] to-[#FF4D2E] shadow-[0_0_12px_rgba(255,77,46,0.6)] transition-all duration-500"
                                style={{ width: '66%' }}
                            />
                        </div>
                    </div>

                    {/* Main Form Container with Glass & Glow */}
                    <div className="w-full max-w-2xl bg-surface/90 dark:bg-slate-900/90 backdrop-blur-2xl p-6 sm:p-10 rounded-3xl border border-outline-variant/50 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>

                            {/* ── CARD SELECTION: Ready vs Recruiting ───────────────────────── */}
                            <section className="space-y-3">
                                <div className={`flex items-center justify-between ${ar ? 'flex-row-reverse' : ''}`}>
                                    <label className="text-sm font-bold tracking-wide uppercase text-on-surface">
                                        {ar ? '1. حدد حالة الفريق' : '1. Select Team Status'}
                                    </label>
                                    <span className="text-xs text-primary font-medium">
                                        {teamMode === 'ready' ? (ar ? 'خاص ومباشر' : 'Private & Instant') : (ar ? 'معروض للعامة' : 'Public Recruitment')}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Option 1: Complete Team */}
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                                            teamMode === 'ready'
                                                ? 'border-[#FF4D2E] bg-gradient-to-br from-[#FF4D2E]/8 via-surface to-surface shadow-lg shadow-[#FF4D2E]/10 -translate-y-1'
                                                : 'border-outline-variant/60 bg-surface hover:border-outline-variant hover:bg-surface-container-low/50 hover:-translate-y-0.5'
                                        }`}
                                        onClick={() => handleModeChange('ready')}
                                        onKeyDown={(e) => e.key === 'Enter' && handleModeChange('ready')}
                                    >
                                        <div className={`flex items-start justify-between mb-4 ${ar ? 'flex-row-reverse' : ''}`}>
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                                                teamMode === 'ready'
                                                    ? 'bg-[#FF4D2E] text-white shadow-md shadow-[#FF4D2E]/30'
                                                    : 'bg-surface-container-highest text-on-surface-variant'
                                            }`}>
                                                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>groups</span>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase flex items-center gap-1 ${
                                                teamMode === 'ready'
                                                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                                    : 'bg-surface-container-high text-on-surface-variant'
                                            }`}>
                                                <span className="material-symbols-outlined text-[14px]">lock</span>
                                                {ar ? 'خاص ومكتمل' : 'Private Team'}
                                            </span>
                                        </div>

                                        <div className={ar ? 'text-right' : ''}>
                                            <h3 className="font-bold text-lg text-on-surface group-hover:text-primary transition-colors">
                                                {ar ? 'فريق جاهز ومكتمل' : 'Ready & Complete Team'}
                                            </h3>
                                            <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                                                {ar
                                                    ? 'لدينا أعضاء بالفعل ولا نحتاج استقطاب أي غرباء. يتم تسجيل الفريق وربط الأعضاء فوراً.'
                                                    : 'Already have my full squad. No stranger recruits needed. Team is registered & locked.'}
                                            </p>
                                        </div>

                                        {/* Active Indicator Pin */}
                                        <div className={`mt-4 pt-3 border-t border-outline-variant/30 flex items-center gap-2 ${ar ? 'flex-row-reverse text-right' : ''}`}>
                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${teamMode === 'ready' ? 'border-[#FF4D2E] bg-[#FF4D2E]' : 'border-outline'}`}>
                                                {teamMode === 'ready' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                                            </div>
                                            <span className="text-xs font-semibold text-on-surface">
                                                {teamMode === 'ready' ? (ar ? 'تم الاختيار' : 'Selected') : (ar ? 'اختر هذا' : 'Select')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Option 2: Recruiting Team */}
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                                            teamMode === 'recruiting'
                                                ? 'border-[#FF4D2E] bg-gradient-to-br from-[#FF4D2E]/8 via-surface to-surface shadow-lg shadow-[#FF4D2E]/10 -translate-y-1'
                                                : 'border-outline-variant/60 bg-surface hover:border-outline-variant hover:bg-surface-container-low/50 hover:-translate-y-0.5'
                                        }`}
                                        onClick={() => handleModeChange('recruiting')}
                                        onKeyDown={(e) => e.key === 'Enter' && handleModeChange('recruiting')}
                                    >
                                        <div className={`flex items-start justify-between mb-4 ${ar ? 'flex-row-reverse' : ''}`}>
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                                                teamMode === 'recruiting'
                                                    ? 'bg-gradient-to-tr from-amber-500 to-[#FF4D2E] text-white shadow-md shadow-amber-500/30'
                                                    : 'bg-surface-container-highest text-on-surface-variant'
                                            }`}>
                                                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>person_add</span>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase flex items-center gap-1 ${
                                                teamMode === 'recruiting'
                                                    ? 'bg-primary/15 text-primary border border-primary/30'
                                                    : 'bg-surface-container-high text-on-surface-variant'
                                            }`}>
                                                <span className="material-symbols-outlined text-[14px]">travel_explore</span>
                                                {ar ? 'استكشاف عام' : 'Explore Open'}
                                            </span>
                                        </div>

                                        <div className={ar ? 'text-right' : ''}>
                                            <h3 className="font-bold text-lg text-on-surface group-hover:text-primary transition-colors">
                                                {ar ? 'فريق يبحث عن أعضاء' : 'Looking for Members'}
                                            </h3>
                                            <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                                                {ar
                                                    ? 'الفريق ناقص العدد، ونريد إظهاره في قائمة الاستكشاف مع المهارات المطلوبة لاستقبال طلبات انضمام.'
                                                    : 'Incomplete squad. We want our team visible on Explore to attract the right teammates.'}
                                            </p>
                                        </div>

                                        {/* Active Indicator Pin */}
                                        <div className={`mt-4 pt-3 border-t border-outline-variant/30 flex items-center gap-2 ${ar ? 'flex-row-reverse text-right' : ''}`}>
                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${teamMode === 'recruiting' ? 'border-[#FF4D2E] bg-[#FF4D2E]' : 'border-outline'}`}>
                                                {teamMode === 'recruiting' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                                            </div>
                                            <span className="text-xs font-semibold text-on-surface">
                                                {teamMode === 'recruiting' ? (ar ? 'تم الاختيار' : 'Selected') : (ar ? 'اختر هذا' : 'Select')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* ── SECTION 2: Team Identity ─────────────────────────────── */}
                            <section className="space-y-4 pt-2">
                                <label className="text-sm font-bold tracking-wide uppercase text-on-surface">
                                    {ar ? '2. هوية الفريق' : '2. Team Identity'}
                                </label>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-on-surface flex items-center gap-1" htmlFor="team-name">
                                            {ar ? 'اسم الفريق' : 'Team Name'}
                                            <span className="text-[#FF4D2E]">*</span>
                                        </label>
                                        <div className="relative">
                                            <span className={`material-symbols-outlined absolute ${ar ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-outline text-[20px]`}>
                                                flag
                                            </span>
                                            <input
                                                className={`w-full h-13 ${ar ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4'} rounded-2xl border border-outline-variant/60 bg-surface-container-low/40 focus:bg-surface focus:ring-2 focus:ring-[#FF4D2E]/20 focus:border-[#FF4D2E] transition-all outline-none text-sm font-medium`}
                                                id="team-name"
                                                placeholder={ar ? 'مثال: فرسان الذكاء الاصطناعي (AI Pioneers)' : 'e.g. AI Pioneers'}
                                                required
                                                type="text"
                                                value={teamName}
                                                onChange={(e) => setTeamName(e.target.value)}
                                                dir={ar ? 'rtl' : 'ltr'}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-on-surface" htmlFor="team-desc">
                                            {ar ? 'رسالة الفريق وفكرة المشروع' : 'Team Mission / Project Idea'}
                                            <span className="text-on-surface-variant font-normal mr-1">({ar ? 'مختصر' : 'brief'})</span>
                                        </label>
                                        <textarea
                                            className="w-full p-4 rounded-2xl border border-outline-variant/60 bg-surface-container-low/40 focus:bg-surface focus:ring-2 focus:ring-[#FF4D2E]/20 focus:border-[#FF4D2E] transition-all outline-none text-sm font-medium resize-none"
                                            id="team-desc"
                                            placeholder={ar ? 'اكتب نبذة سريعة عن هدف فريقكم في هذه المسابقة وما تنوون بناؤه...' : 'Write a quick summary of what your team plans to build in this competition...'}
                                            required
                                            rows={3}
                                            value={teamDesc}
                                            onChange={(e) => setTeamDesc(e.target.value)}
                                            dir={ar ? 'rtl' : 'ltr'}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* ── SECTION 3: Capacity & Visibility Controller ───────────── */}
                            <section className="p-5 rounded-2xl bg-surface-container-low/50 border border-outline-variant/50 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                                    {/* Capacity Selector */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-on-surface" htmlFor="max-members">
                                            {ar ? 'الحد الأقصى للأعضاء' : 'Maximum Team Size'}
                                        </label>
                                        <div className="relative">
                                            <select
                                                className={`w-full h-12 ${ar ? 'pr-4 pl-10 text-right' : 'pl-4 pr-10'} rounded-xl border border-outline-variant bg-surface focus:ring-2 focus:ring-[#FF4D2E]/20 focus:border-[#FF4D2E] text-sm font-bold appearance-none cursor-pointer outline-none`}
                                                id="max-members"
                                                value={maxMembers}
                                                onChange={(e) => setMaxMembers(Number(e.target.value))}
                                                dir={ar ? 'rtl' : 'ltr'}
                                            >
                                                {teamSizeOptions().map((n) => (
                                                    <option key={n} value={n}>{ar ? `${n} أعضاء (شامل القائد)` : `${n} Members (incl. Leader)`}</option>
                                                ))}
                                            </select>
                                            <span className={`material-symbols-outlined absolute ${ar ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant`}>
                                                expand_more
                                            </span>
                                        </div>
                                    </div>

                                    {/* Visibility State Card */}
                                    <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                                        visible
                                            ? 'bg-amber-500/10 border-amber-500/30'
                                            : 'bg-emerald-500/10 border-emerald-500/30'
                                    } ${ar ? 'flex-row-reverse' : ''}`}>
                                        <div className={`flex flex-col ${ar ? 'text-right' : ''}`}>
                                            <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                                                <span className={`w-2 h-2 rounded-full ${visible ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                                                {visible
                                                    ? (ar ? 'الفريق يظهر بالاستكشاف' : 'Visible on Explore')
                                                    : (ar ? 'فريق خاص (مخفي)' : 'Private Team (Hidden)')}
                                            </span>
                                            <span className="text-[11px] text-on-surface-variant mt-0.5">
                                                {visible
                                                    ? (ar ? 'يمكن للآخرين طلب الانضمام' : 'Open to join requests')
                                                    : (ar ? 'الانضمام بدعوة مباشرة فقط' : 'Invited members only')}
                                            </span>
                                        </div>

                                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                            <input
                                                checked={visible}
                                                className="sr-only peer"
                                                type="checkbox"
                                                onChange={() => setVisible((v) => !v)}
                                            />
                                            <div
                                                className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all transition-colors"
                                                style={{ backgroundColor: visible ? '#FF4D2E' : 'var(--color-surface-container-highest)' }}
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Visual Squad Roster Slots (Gaming / Hackathon aesthetic) */}
                                <div className="pt-2 border-t border-outline-variant/30">
                                    <div className={`flex items-center justify-between mb-3 ${ar ? 'flex-row-reverse' : ''}`}>
                                        <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-primary text-[18px]">group</span>
                                            {ar ? 'توزيع مقاعد الفريق' : 'Team Roster Slots'}
                                        </span>
                                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface">
                                            {currentMemberCount} / {maxMembers} {ar ? 'مقاعد مشغولة' : 'Slots Filled'}
                                        </span>
                                    </div>

                                    {/* Visual Slots Pill Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                        {/* Slot 1: Leader (You) */}
                                        <div className="p-3 rounded-xl border border-primary/30 bg-primary/5 flex flex-col items-center text-center relative overflow-hidden">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF4D2E] to-[#FF7A59] text-white flex items-center justify-center font-bold text-xs shadow-sm mb-1.5">
                                                👑
                                            </div>
                                            <span className="text-xs font-bold text-on-surface truncate w-full">{ar ? 'أنت (القائد)' : 'You (Leader)'}</span>
                                            <span className="text-[10px] text-primary font-medium">{ar ? 'مؤسس الفريق' : 'Creator'}</span>
                                        </div>

                                        {/* Invited members slots */}
                                        {invitedMembers.map((member, i) => (
                                            <div key={member} className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col items-center text-center relative group">
                                                <button
                                                    type="button"
                                                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 rounded-full bg-error/10 text-error hover:bg-error/20 transition-opacity"
                                                    onClick={() => removeMember(member)}
                                                    title={ar ? 'إزالة' : 'Remove'}
                                                >
                                                    <span className="material-symbols-outlined text-[14px]">close</span>
                                                </button>
                                                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-sm mb-1.5">
                                                    {i + 2}
                                                </div>
                                                <span className="text-xs font-bold text-on-surface truncate w-full" title={member}>
                                                    {member}
                                                </span>
                                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">{ar ? 'عضو مربوط' : 'Linked'}</span>
                                            </div>
                                        ))}

                                        {/* Empty remaining slots */}
                                        {Array.from({ length: remainingSlots }).map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`p-3 rounded-xl border-2 border-dashed border-outline-variant/60 flex flex-col items-center justify-center text-center ${
                                                    teamMode === 'ready' ? 'bg-surface/50' : 'bg-amber-500/5 border-amber-500/30'
                                                }`}
                                            >
                                                <div className="w-8 h-8 rounded-full border border-dashed border-outline flex items-center justify-center text-outline text-xs mb-1.5">
                                                    +
                                                </div>
                                                <span className="text-[11px] font-medium text-on-surface-variant">
                                                    {teamMode === 'ready'
                                                        ? (ar ? 'مقعد شاغر' : 'Empty Slot')
                                                        : (ar ? 'يُستقطب بالاستكشاف' : 'Recruiting')}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* ── SECTION 4: Add Teammates Input Box ─────────────────────── */}
                            <section className="space-y-3">
                                <div className={`flex items-center justify-between ${ar ? 'flex-row-reverse' : ''}`}>
                                    <label className="text-sm font-bold tracking-wide uppercase text-on-surface">
                                        {ar ? '3. إضافة أعضاء الفريق (عبر الإيميل أو اسم المستخدم)' : '3. Add Teammates (Email or Username)'}
                                    </label>
                                    <span className="text-xs text-on-surface-variant font-medium">
                                        {ar ? `متاح إضافة: ${remainingSlots}` : `${remainingSlots} slots left`}
                                    </span>
                                </div>

                                <div className={`flex gap-2 ${ar ? 'flex-row-reverse' : ''}`}>
                                    <div className="flex-1 relative">
                                        <span className={`material-symbols-outlined absolute ${ar ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-outline text-[20px]`}>
                                            alternate_email
                                        </span>
                                        <input
                                            className={`w-full h-12 ${ar ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4'} rounded-2xl border border-outline-variant bg-surface focus:ring-2 focus:ring-[#FF4D2E]/20 focus:border-[#FF4D2E] text-sm font-medium outline-none transition-all`}
                                            disabled={remainingSlots === 0}
                                            placeholder={
                                                remainingSlots === 0
                                                    ? (ar ? 'اكتمل عدد أعضاء الفريق بالكامل' : 'Team capacity reached')
                                                    : (ar ? 'اكتب البريد الإلكتروني أو اسم المستخدم واضغط إضافة...' : 'Enter teammate email or username...')
                                            }
                                            type="text"
                                            value={memberInput}
                                            onChange={(e) => {
                                                setMemberInput(e.target.value)
                                                setMemberError('')
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault()
                                                    addMember()
                                                }
                                            }}
                                            dir={ar ? 'rtl' : 'ltr'}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="px-6 h-12 rounded-2xl font-bold text-sm text-white flex items-center gap-1.5 shadow-md shadow-[#FF4D2E]/20 hover:opacity-95 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                                        style={{ backgroundColor: '#FF4D2E' }}
                                        disabled={remainingSlots === 0 || !memberInput.trim()}
                                        onClick={addMember}
                                    >
                                        <span className="material-symbols-outlined text-[18px]">add_circle</span>
                                        {ar ? 'إضافة' : 'Add'}
                                    </button>
                                </div>

                                {memberError && (
                                    <div className={`p-3 rounded-xl bg-error/10 border border-error/20 flex items-center gap-2 text-xs text-error font-medium fade-in ${ar ? 'flex-row-reverse' : ''}`}>
                                        <span className="material-symbols-outlined text-[18px]">warning</span>
                                        <span>{memberError}</span>
                                    </div>
                                )}
                            </section>

                            {/* ── SECTION 5: Skills & Tech Stack ────────────────────────── */}
                            <section className="space-y-3">
                                <div className={`flex items-center justify-between ${ar ? 'flex-row-reverse' : ''}`}>
                                    <label className="text-sm font-bold tracking-wide uppercase text-on-surface">
                                        {teamMode === 'recruiting'
                                            ? (ar ? '4. المهارات المطلوبة للمنضمين الجدد' : '4. Required Candidate Skills')
                                            : (ar ? '4. مهارات الفريق التقنية (اختياري)' : '4. Team Tech Stack (Optional)')}
                                    </label>
                                    {teamMode === 'recruiting' && (
                                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                                            {ar ? 'تطابق AI مفعل' : 'AI Match Active'}
                                        </span>
                                    )}
                                </div>

                                {/* Skills Box */}
                                <div className={`p-3.5 rounded-2xl border border-outline-variant bg-surface min-h-[58px] flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-[#FF4D2E]/20 focus-within:border-[#FF4D2E] transition-all ${ar ? 'flex-row-reverse' : ''}`}>
                                    {skills.map((s) => (
                                        <div
                                            key={s}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/25 text-primary text-xs font-bold fade-in"
                                        >
                                            <span>{s}</span>
                                            <button
                                                type="button"
                                                className="p-0.5 rounded-full hover:bg-primary/20 text-primary transition-colors"
                                                onClick={() => removeSkill(s)}
                                                aria-label="Remove skill"
                                            >
                                                <span className="material-symbols-outlined text-[14px]">close</span>
                                            </button>
                                        </div>
                                    ))}
                                    <input
                                        className="flex-1 min-w-[130px] border-none p-1 text-xs font-medium bg-transparent outline-none text-on-surface"
                                        placeholder={ar ? 'أضف مهارة واضغط Enter...' : 'Type skill & press Enter...'}
                                        type="text"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={addSkill}
                                        dir={ar ? 'rtl' : 'ltr'}
                                    />
                                </div>

                                {/* Quick AI Skill Pills */}
                                <div className={`flex flex-wrap items-center gap-1.5 pt-1 ${ar ? 'flex-row-reverse' : ''}`}>
                                    <span className="text-[11px] text-on-surface-variant font-medium">
                                        {ar ? 'اقتراحات سريعة:' : 'Quick tags:'}
                                    </span>
                                    {QUICK_SKILL_SUGGESTIONS.map((qs) => {
                                        const isSelected = skills.includes(qs)
                                        return (
                                            <button
                                                key={qs}
                                                type="button"
                                                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                                                    isSelected
                                                        ? 'bg-primary text-white border-primary shadow-sm'
                                                        : 'bg-surface-container-high/60 text-on-surface-variant border-transparent hover:border-outline-variant hover:text-on-surface'
                                                }`}
                                                onClick={() => toggleQuickSkill(qs)}
                                            >
                                                {isSelected ? `✓ ${qs}` : `+ ${qs}`}
                                            </button>
                                        )
                                    })}
                                </div>
                            </section>

                            {/* ── SUBMIT ACTIONS BAR ────────────────────────────────────── */}
                            <div className={`flex items-center justify-between pt-6 border-t border-outline-variant/50 ${ar ? 'flex-row-reverse' : ''}`}>
                                <Link
                                    className="px-6 py-3 rounded-full text-on-surface-variant font-bold text-sm hover:bg-surface-container-high transition-all active:scale-95"
                                    to="/app/participation-type"
                                >
                                    {ar ? '← رجوع' : '← Back'}
                                </Link>
                                <button
                                    className="px-9 py-3.5 rounded-full font-bold text-sm text-white shadow-xl shadow-[#FF4D2E]/25 hover:shadow-2xl hover:shadow-[#FF4D2E]/40 active:scale-95 transition-all flex items-center gap-2 group"
                                    style={{ backgroundColor: '#FF4D2E' }}
                                    type="submit"
                                >
                                    <span>
                                        {teamMode === 'ready'
                                            ? (ar ? 'تسجيل الفريق المكتمل' : 'Register Full Team')
                                            : (ar ? 'إنشاء الفريق وبدء الاستقطاب' : 'Create & Start Recruiting')}
                                    </span>
                                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                                        {ar ? 'arrow_back' : 'arrow_forward'}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Bottom Security & Privacy Guarantee */}
                    <div className="w-full max-w-2xl mt-8 flex items-center justify-center gap-6 text-xs text-on-surface-variant">
                        <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px] text-emerald-500">verified_user</span>
                            {ar ? 'تسجيل رسمي موثق' : 'Verified Competition Entry'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px] text-[#FF4D2E]">bolt</span>
                            {ar ? 'ربط فوري للأعضاء' : 'Instant Teammate Linking'}
                        </span>
                    </div>
                </main>

                <AppFooter />
            </div>
        </>
    )
}
