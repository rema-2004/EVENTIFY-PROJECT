import AppLangToggle from '../../components/app/AppLangToggle'
import AppFooter from '../../components/app/AppFooter'
import AppPageHead from '../../components/app/AppPageHead'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { TEAM_LIMITS, teamSizeOptions } from './team-limits'

const INITIAL_SKILLS = ['React', 'Tailwind', 'AI Models']

export default function CreateTeam() {
    const { language } = useLanguage()
    const ar = language === 'ar'
    const navigate = useNavigate()

    const [skills, setSkills] = useState(INITIAL_SKILLS)
    const [skillInput, setSkillInput] = useState('')
    const [visible, setVisible] = useState(true)

    const addSkill = (e) => {
        if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
            e.preventDefault()
            const val = skillInput.trim().replace(/,$/, '')
            if (val && !skills.includes(val)) setSkills((prev) => [...prev, val])
            setSkillInput('')
        }
    }

    const removeSkill = (s) => setSkills((prev) => prev.filter((x) => x !== s))

    return (
        <>
            <AppPageHead title={ar ? 'إنشاء فريق | EVENTIFY' : 'Create Team | EVENTIFY'} />

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
                <Link className="p-2 hover:bg-surface-container-low rounded-full transition-colors" to="/app/participation-type" aria-label="Close">
                    <span className="material-symbols-outlined text-on-surface-variant">close</span>
                </Link>
            </header>

            <div className="min-h-[calc(100vh-64px)] flex flex-col" dir={ar ? 'rtl' : 'ltr'}>
                <main className="w-full max-w-7xl mx-auto px-4 md:px-gutter py-10 flex flex-col items-center flex-grow">

                    {/* Form header & progress */}
                    <div className="w-full max-w-2xl mb-10">
                        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 ${ar ? 'md:flex-row-reverse' : ''}`}>
                            <div className={ar ? 'text-right' : ''}>
                                <h1 className="font-headline-lg text-headline-lg mb-2">
                                    {ar ? 'أنشئ فريقك' : 'Create Your Team'}
                                </h1>
                                <p className="text-on-surface-variant font-body-md">
                                    {ar ? 'اجمع الفريق المثالي لمشروعك القادم.' : 'Assemble the perfect crew for your next breakthrough project.'}
                                </p>
                            </div>
                            <div className={`flex flex-col gap-2 ${ar ? 'items-start' : 'items-end'}`}>
                                <span className="font-label-sm text-label-sm uppercase tracking-wider" style={{ color: '#FF4D2E' }}>
                                    {ar ? 'الخطوة 2 من 3' : 'Step 2 of 3'}
                                </span>
                                <div className="w-32 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: '66%', backgroundColor: '#FF4D2E' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form card */}
                    <div className="w-full max-w-2xl bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/30 shadow-sm">
                        <form
                            className="flex flex-col gap-8"
                            onSubmit={(e) => {
                                e.preventDefault()
                                navigate('/app/registration-success', { state: { type: 'create', team: e.currentTarget.elements['team-name'].value.trim() } })
                            }}
                        >
                            {/* Team Identity */}
                            <section className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="font-label-md text-label-md text-on-surface" htmlFor="team-name">
                                        {ar ? 'اسم الفريق' : 'Team Name'}
                                    </label>
                                    <input
                                        className="input-primary h-12"
                                        id="team-name"
                                        placeholder={ar ? 'مثال: مبتكرو الفينيكس' : 'e.g. Phoenix Innovators'}
                                        required
                                        type="text"
                                        dir={ar ? 'rtl' : 'ltr'}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-label-md text-label-md text-on-surface" htmlFor="team-desc">
                                        {ar ? 'وصف الفريق' : 'Team Description'}
                                    </label>
                                    <textarea
                                        className="input-primary resize-none"
                                        id="team-desc"
                                        placeholder={ar ? 'صِف رسالة فريقك وأهدافه بإيجاز...' : 'Briefly describe your team\'s mission and goals...'}
                                        required
                                        rows={4}
                                        dir={ar ? 'rtl' : 'ltr'}
                                    />
                                </div>
                            </section>

                            {/* Team Configuration */}
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="font-label-md text-label-md text-on-surface" htmlFor="max-members">
                                        {ar ? 'الحد الأقصى للأعضاء' : 'Maximum Members'}
                                    </label>
                                    <div className="relative">
                                        <select className="input-primary h-12 appearance-none" id="max-members" defaultValue={Math.min(4, TEAM_LIMITS.max)} dir={ar ? 'rtl' : 'ltr'}>
                                            {teamSizeOptions().map((n) => (
                                                <option key={n} value={n}>{ar ? `${n} أعضاء` : `${n} Members`}</option>
                                            ))}
                                        </select>
                                        <span className={`material-symbols-outlined absolute ${ar ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant`}>expand_more</span>
                                    </div>
                                </div>

                                {/* Visibility toggle */}
                                <div className={`flex items-center justify-between p-4 bg-surface-container-low rounded-lg border border-outline-variant/50 ${ar ? 'flex-row-reverse' : ''}`}>
                                    <div className={`flex flex-col ${ar ? 'text-right' : ''}`}>
                                        <span className="font-label-md text-label-md">
                                            {ar ? 'البحث عن أعضاء' : 'Looking for Members'}
                                        </span>
                                        <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
                                            {ar ? 'مرئي في الاستكشاف' : 'Visible in Explore'}
                                        </span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input checked={visible} className="sr-only peer" type="checkbox" onChange={() => setVisible(v => !v)} />
                                        <div
                                            className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all transition-colors"
                                            style={{ backgroundColor: visible ? '#FF4D2E' : 'var(--color-surface-container-highest)' }}
                                        />
                                    </label>
                                </div>
                            </section>

                            {/* Skills chips */}
                            <section className="flex flex-col gap-4">
                                <div className={`flex items-center justify-between ${ar ? 'flex-row-reverse' : ''}`}>
                                    <label className="font-label-md text-label-md text-on-surface">
                                        {ar ? 'المهارات المطلوبة' : 'Required Skills'}
                                    </label>
                                    <span className="font-label-sm text-label-sm uppercase bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded">
                                        {ar ? 'اقتراحات AI متاحة' : 'AI Suggestions Available'}
                                    </span>
                                </div>
                                <div className={`flex flex-wrap gap-2 p-4 bg-white border border-outline-variant rounded-lg min-h-[64px] ${ar ? 'flex-row-reverse' : ''}`}>
                                    {skills.map((s) => (
                                        <div key={s} className="flex items-center gap-1.5 bg-primary-fixed text-on-primary-fixed px-3 py-1.5 rounded-full font-label-sm text-label-sm">
                                            <span>{s}</span>
                                            <button type="button" className="hover:text-error transition-colors" onClick={() => removeSkill(s)} aria-label="Remove">
                                                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                                            </button>
                                        </div>
                                    ))}
                                    <input
                                        className="flex-1 min-w-[120px] border-none p-0 focus:ring-0 text-label-md bg-transparent outline-none"
                                        placeholder={ar ? 'أضف مهارة...' : 'Add more...'}
                                        type="text"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={addSkill}
                                        dir={ar ? 'rtl' : 'ltr'}
                                    />
                                </div>
                            </section>

                            {/* Form actions */}
                            <div className={`flex items-center justify-between pt-6 border-t border-outline-variant ${ar ? 'flex-row-reverse' : ''}`}>
                                <Link
                                    className="px-6 py-3 text-on-surface-variant font-label-md hover:bg-surface-container-low rounded-xl transition-all active:scale-95"
                                    to="/app/participation-type"
                                >
                                    {ar ? 'رجوع' : 'Back'}
                                </Link>
                                <button
                                    className="px-10 py-3 rounded-full font-label-md text-label-md shadow-md active:scale-95 transition-all"
                                    style={{ backgroundColor: '#FF4D2E', color: '#fff' }}
                                    type="submit"
                                >
                                    {ar ? 'إنشاء الفريق' : 'Create Team'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Tips */}
                    <div className="w-full max-w-2xl mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            {
                                icon: 'lightbulb',
                                title: { en: 'Pro Tip', ar: 'نصيحة' },
                                body: { en: 'Teams with 4+ members have 35% higher success rate.', ar: 'الفرق المكوّنة من 4+ أعضاء نسبة نجاحها أعلى بـ 35%.' },
                            },
                            {
                                icon: 'auto_awesome',
                                title: { en: 'Auto-Match', ar: 'تطابق تلقائي' },
                                body: { en: 'AI will notify potential members after creation.', ar: 'سيُنبّه الذكاء الاصطناعي الأعضاء المحتملين بعد الإنشاء.' },
                            },
                        ].map(({ icon, title, body }) => (
                            <div key={icon} className={`p-6 rounded-xl border border-dashed border-outline-variant flex items-center gap-4 opacity-70 ${ar ? 'flex-row-reverse' : ''}`}>
                                <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-outline">{icon}</span>
                                </div>
                                <div className={ar ? 'text-right' : ''}>
                                    <p className="font-label-md text-on-surface-variant">{ar ? title.ar : title.en}</p>
                                    <p className="font-body-sm text-body-sm text-outline">{ar ? body.ar : body.en}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>

                <AppFooter />
            </div>
        </>
    )
}
