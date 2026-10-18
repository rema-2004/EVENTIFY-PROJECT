import AppLangToggle from '../../components/app/AppLangToggle'
import AppFooter from '../../components/app/AppFooter'
import AppPageHead from '../../components/app/AppPageHead'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'

export default function RequestMember() {
    const { language } = useLanguage()
    const ar = language === 'ar'
    const location = useLocation()

    // TODO: both come from the backend (current team size and the team's max)
    const currentMembers = 4
    const maxMembers = 6
    const openSlots = maxMembers - currentMembers

    // Opened from a "member left" notification: exactly one position per vacant role,
    // so the count always matches the members who left (no adding or removing)
    const vacantRoles = location.state?.vacantRoles || []
    const fixedPositions = vacantRoles.length > 0
    const [positions, setPositions] = useState(() => {
        if (fixedPositions) return vacantRoles.map((r, i) => ({ id: i, role: ar ? r.ar : r.en, skills: '' }))
        return [{ id: 0, role: '', skills: '' }]
    })
    const [nextId, setNextId] = useState(positions.length)
    const [sent, setSent] = useState(false)

    const updatePosition = (id, field, value) =>
        setPositions((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)))

    const addPosition = () => {
        setPositions((prev) => [...prev, { id: nextId, role: '', skills: '' }])
        setNextId((n) => n + 1)
    }

    const submit = (e) => {
        e.preventDefault()
        // TODO: POST the new member request (all positions) to the backend
        setSent(true)
    }

    return (
        <>
            <AppPageHead title={ar ? 'طلب عضو جديد | EVENTIFY' : 'Request a New Member | EVENTIFY'} />

            <header className="glass-header sticky top-0 z-50 w-full h-16 border-b border-outline-variant/30 flex items-center px-6">
                <Link className="flex items-center gap-2" to="/app">
                    <span className="material-symbols-outlined text-3xl" style={{ color: '#FF4D2E', fontVariationSettings: '"FILL" 1' }}>hub</span>
                    <span className="font-headline-md text-headline-md font-black" style={{ color: '#FF4D2E' }}>EVENTIFY</span>
                </Link>
                <AppLangToggle className="ml-auto mr-3" />
                <Link className="p-2 hover:bg-surface-container-low rounded-full transition-colors" to="/app/team-dashboard" aria-label="Close">
                    <span className="material-symbols-outlined text-on-surface-variant">close</span>
                </Link>
            </header>

            <main className="max-w-xl mx-auto px-4 md:px-8 py-10 mb-24" dir={ar ? 'rtl' : 'ltr'}>
                {sent ? (
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 text-center fade-in">
                        <span className="material-symbols-outlined text-5xl mb-3" style={{ color: '#FF4D2E', fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                        <h1 className="font-headline-md text-headline-md text-on-surface mb-2">
                            {ar ? 'تم إرسال الطلب' : 'Request sent'}
                        </h1>
                        <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                            {ar ? 'سيظهر طلبك للمشاركين المناسبين. سنخبرك عند وصول طلبات انضمام.' : 'Your request is now visible to matching participants. We will notify you when join requests arrive.'}
                        </p>
                        <Link
                            className="inline-block px-8 py-2.5 rounded-xl font-label-md text-label-md active:scale-95 transition-all"
                            style={{ backgroundColor: '#FF4D2E', color: '#fff' }}
                            to="/app/team-dashboard"
                        >
                            {ar ? 'العودة للوحة الفريق' : 'Back to Team Dashboard'}
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={submit} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
                        <h1 className="font-headline-md text-headline-md text-on-surface mb-6">
                            {ar ? 'طلب عضو جديد' : 'Request a New Member'}
                        </h1>

                        <label className="block font-label-md text-label-md text-on-surface-variant mb-1">{ar ? 'الفريق' : 'Team'}</label>
                        <input className="w-full mb-4 px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container text-on-surface" value={ar ? 'رواد الذكاء الاصطناعي' : 'AI Pioneers'} readOnly />

                        <label className="block font-label-md text-label-md text-on-surface-variant mb-1">{ar ? 'الفعالية' : 'Event'}</label>
                        <input className="w-full mb-4 px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container text-on-surface" value={ar ? 'هاكاثون نشط' : 'Active Hackathon'} readOnly />

                        <div className={`flex items-center justify-between mb-3 ${ar ? 'flex-row-reverse' : ''}`}>
                            <h2 className="font-title-md text-title-md text-on-surface">
                                {ar ? 'الأدوار المطلوبة' : 'Positions needed'}
                            </h2>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">
                                {fixedPositions ? positions.length : `${positions.length} / ${openSlots}`}
                            </span>
                        </div>

                        {positions.map((pos, idx) => (
                            <div key={pos.id} className="mb-4 p-4 rounded-xl border border-outline-variant bg-surface-container-low">
                                <div className={`flex items-center justify-between mb-2 ${ar ? 'flex-row-reverse' : ''}`}>
                                    <span className="font-label-md text-label-md text-on-surface-variant">
                                        {ar ? `العضو ${idx + 1}` : `Member ${idx + 1}`}
                                    </span>
                                </div>
                                <input
                                    className="w-full mb-3 px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface"
                                    placeholder={ar ? 'الدور المطلوب' : 'Role needed'}
                                    value={pos.role}
                                    onChange={(e) => updatePosition(pos.id, 'role', e.target.value)}
                                    required
                                />
                                <input
                                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface"
                                    placeholder={ar ? 'المهارات المطلوبة' : 'Required skills'}
                                    value={pos.skills}
                                    onChange={(e) => updatePosition(pos.id, 'skills', e.target.value)}
                                />
                            </div>
                        ))}

                        {!fixedPositions && (
                        <button
                            type="button"
                            className="mb-6 flex items-center gap-1 font-label-md text-label-md disabled:opacity-40"
                            style={{ color: '#FF4D2E' }}
                            onClick={addPosition}
                            disabled={positions.length >= openSlots}
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            {ar ? 'إضافة عضو آخر' : 'Add another member'}
                        </button>
                        )}

                        <div className={`flex gap-3 ${ar ? 'flex-row-reverse' : ''}`}>
                            <button type="submit" className="flex-1 px-6 py-2.5 rounded-xl font-label-md text-label-md active:scale-95 transition-all" style={{ backgroundColor: '#FF4D2E', color: '#fff' }}>
                                {ar ? 'إرسال الطلب' : 'Send Request'}
                            </button>
                            <Link to="/app/team-dashboard" className="flex-1 text-center px-6 py-2.5 rounded-xl border border-outline text-on-surface-variant font-label-md text-label-md">
                                {ar ? 'إلغاء' : 'Cancel'}
                            </Link>
                        </div>
                    </form>
                )}
            </main>

            <AppFooter />
        </>
    )
}
