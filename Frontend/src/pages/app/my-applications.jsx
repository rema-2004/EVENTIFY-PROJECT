import AppFooter from '../../components/app/AppFooter'
import AppPageHead from '../../components/app/AppPageHead'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import AnimatedCounter from '../../components/shared/AnimatedCounter'
import { toast } from '../../utils/toast.js'

const STORAGE_KEY = 'eventify_my_applications'

const INITIAL_APPLICATIONS = [
    {
        id: 1, eventId: 1, status: 'pending',
        isCompetition: true,
        category: 'competition',
        icon: 'emoji_events', iconBg: 'bg-primary/10', iconColor: 'text-primary',
        title: { en: 'Global AI Innovation Challenge', ar: 'تحدي الابتكار العالمي بالذكاء الاصطناعي' },
        sub:   { en: 'TechGenius Labs • Applied Jul 12, 2026', ar: 'TechGenius Labs • تقدّمت في 12 يوليو 2026' },
        badge: { en: 'Pending Review', ar: 'قيد المراجعة' },
        badgeCls: 'bg-tertiary/10 text-tertiary',
        competitionDetails: {
            competitionName: { en: 'Global AI Innovation Challenge 2026', ar: 'تحدي الابتكار العالمي بالذكاء الاصطناعي 2026' },
            track: { en: 'Generative AI & Autonomous Agents Track', ar: 'مسار الذكاء الاصطناعي التوليدي والوكلاء المستقلين' },
            team: {
                name: { en: 'AI Pioneers', ar: 'رواد الذكاء الاصطناعي' },
                isLeader: true,
                role: { en: 'Team Leader', ar: 'قائد الفريق' },
                membersCount: 4,
                members: [
                    { id: 1, name: { en: 'Sarah Chen (You)', ar: 'سارة تشن (أنت)' }, role: { en: 'Team Lead', ar: 'قائد الفريق' }, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsk7muPFHYbZe7Z-rUcABeLlGKC3fPcjQvlSlvDR2xQmsCdjD_N5AhN_FIpOxnBOoRFJLYbLp_sbVgThwqN61SNeKujEibFe8f5cuALXg14FqDKFra6QXhkb_QkJ9MaFs2NquGZyYUmOcXHcAxpytMjpzKqzdgt8y-bygB6f3e9Hwuc70pexiu63M8y-FeeoRKHQRbBWOnbK7Om1NIZFjccFbJeTi4Dct6x19p9enOjySz-zAc7WDkeiz2b5Zkyv7hciqBciIkhsI7' },
                    { id: 2, name: { en: 'Marcus Thorne', ar: 'ماركوس ثورن' }, role: { en: 'Data Engineering', ar: 'هندسة البيانات' }, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmxDoxVMYKdjLBI4LTyACovkoA7uosdPqmrae8x1N8ktTZL_u2lHHqBKZVBUlQBcWdpSUiUZd3cTPzyRjLO_jFUxCdutbIhy1pj8kvFx02gnLTAAPaQ4VlgTElAkYkQPBlfxbJrrgVrkg_9-VOh8rufjYPqqj7l23exRU5rNDr7p90wCxB5Eiex3SBJcTbCtAcZVDbubo4OWdf-lwjVcf-g8Uzrut7uEWkt3AR_S4ZeTb4nLPvdegGx8tz56WWbDgXgs38QzCGKN92' },
                    { id: 3, name: { en: 'Elena Rodriguez', ar: 'إيلينا رودريغيز' }, role: { en: 'Product Design', ar: 'تصميم المنتج' }, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOV34IwdMrDUOuFd5cGHQYtCTtgkIj993EGhm9-yJWSvP8ysLpA36Eyx10SBESZ7PtNZ-jqAbctO84uEIXhN0ulGxY-MOal6nmIYo5CfFgxE2WHVy7JW4In6iX9VVmzMp6QU-rDqAbEYHywag67SFhv5TYwuu0VpHZSoNoqW9izgBggdmllvvhSLRJFcvdWDoxZYzArX5GFZZjZwfUw8QpsUlD2QUbx9Z5sXxCExbF2yOaUnRHtdNtnevMhuEzcADkOnLt0KDTiIJm' },
                    { id: 4, name: { en: 'James Wilson', ar: 'جيمس ويلسون' }, role: { en: 'Cloud Infrastructure', ar: 'البنية السحابية' }, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcTN_fBBPE7UutBfaFRRZX5sFqx7xFgBTx1xJWZiRZiervLaW8j6fXApyz-lC37L-9-e9zem29PdBNnzmcyQAyN5BXQRnQZJU4F-9qCLTVZICagRsqbzn0oDsZ1XJSE-X-4ntW4ODtewcEdOgt43G-kCdMWu9kE6aos01MOOH6bJajd7IsUooiOCYCt-wEDO8yZ-33jR5Li1s7yFFOes26hwW7mokDuPDIY25dtmumzZGDKBW6lmLtnkANsucN6c9xEoLszP2it_hF' },
                ]
            },
            prize: { en: '$50,000 Total Prizes', ar: '50,000$ جوائز نقدية' },
            deadline: { en: 'Aug 20, 2026', ar: '20 أغسطس 2026' },
            rules: {
                en: 'Teams must consist of 2-6 members. Solutions must be open source.',
                ar: 'يتكون الفريق من 2 إلى 6 أعضاء. يجب أن تكون الحلول مفتوحة المصدر.'
            }
        }
    },
    {
        id: 2, eventId: 2, status: 'pending',
        isCompetition: false,
        category: 'workshop',
        icon: 'terminal', iconBg: 'bg-primary/10', iconColor: 'text-primary',
        title: { en: 'DevOps Masterclass', ar: 'ماستركلاس DevOps' },
        sub:   { en: 'TechGenius Labs • Applied Jul 9, 2026', ar: 'TechGenius Labs • تقدّمت في 9 يوليو 2026' },
        badge: { en: 'Pending Review', ar: 'قيد المراجعة' },
        badgeCls: 'bg-tertiary/10 text-tertiary',
    },
    {
        id: 3, eventId: 3, status: 'pending',
        isCompetition: false,
        category: 'bootcamp',
        icon: 'groups', iconBg: 'bg-primary/10', iconColor: 'text-primary',
        title: { en: 'Cloud Career Bootcamp', ar: 'معسكر مسار الحوسبة السحابية' },
        sub:   { en: 'DevCommunity Hub • Applied Jul 4, 2026', ar: 'DevCommunity Hub • تقدّمت في 4 يوليو 2026' },
        badge: { en: 'Pending Review', ar: 'قيد المراجعة' },
        badgeCls: 'bg-tertiary/10 text-tertiary',
    },
    {
        id: 4, eventId: 4, status: 'accepted',
        isCompetition: false,
        category: 'workshop',
        icon: 'check_circle', iconBg: 'bg-success/10', iconColor: 'text-success', iconFill: true,
        title: { en: 'Quantum Computing Workshop', ar: 'ورشة الحوسبة الكمية' },
        sub:   { en: 'University Research Lab • Applied Jun 28, 2026', ar: 'مختبر الجامعة البحثي • تقدّمت في 28 يونيو 2026' },
        badge: { en: 'Accepted', ar: 'مقبول' },
        badgeCls: 'bg-success/10 text-success',
    },
    {
        id: 5, eventId: 5, status: 'accepted',
        isCompetition: true,
        category: 'competition',
        icon: 'check_circle', iconBg: 'bg-success/10', iconColor: 'text-success', iconFill: true,
        title: { en: 'Frontend Wizards 2026', ar: 'معالجو الواجهة الأمامية 2026' },
        sub:   { en: 'DevCommunity Hub • Applied Jun 20, 2026', ar: 'DevCommunity Hub • تقدّمت في 20 يونيو 2026' },
        badge: { en: 'Accepted', ar: 'مقبول' },
        badgeCls: 'bg-success/10 text-success',
        competitionDetails: {
            competitionName: { en: 'Frontend Wizards Hackathon 2026', ar: 'هاكاثون معالجو الواجهة الأمامية 2026' },
            track: { en: 'UI/UX & Interactive Design Track', ar: 'مسار واجهات وتجربة المستخدم التفاعلية' },
            team: {
                name: { en: 'CodeCraft Squad', ar: 'فرقة كودكرافت' },
                isLeader: true,
                role: { en: 'Team Leader', ar: 'قائد الفريق' },
                membersCount: 3,
                members: [
                    { id: 1, name: { en: 'Sarah Chen (You)', ar: 'سارة تشن (أنت)' }, role: { en: 'Team Lead', ar: 'قائد الفريق' }, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsk7muPFHYbZe7Z-rUcABeLlGKC3fPcjQvlSlvDR2xQmsCdjD_N5AhN_FIpOxnBOoRFJLYbLp_sbVgThwqN61SNeKujEibFe8f5cuALXg14FqDKFra6QXhkb_QkJ9MaFs2NquGZyYUmOcXHcAxpytMjpzKqzdgt8y-bygB6f3e9Hwuc70pexiu63M8y-FeeoRKHQRbBWOnbK7Om1NIZFjccFbJeTi4Dct6x19p9enOjySz-zAc7WDkeiz2b5Zkyv7hciqBciIkhsI7' },
                    { id: 10, name: { en: 'Tariq Al-Mansoor', ar: 'طارق المنصور' }, role: { en: 'CSS & Motion Designer', ar: 'مصمم حركات وCSS' }, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGWZsh5hb95_nQ-ArZECm2xz51h_f0sPqc4LL8qGy875HaknSaoOd9whCqRWOAJaYYuX_cBzGsQcjj8xhc7QoTT6y-XLY-KVOPvgiItAyfXLMKLZKaqxq-GFjHKVfw11WWKJratVoYRJUJkObmjI2Yh2SRjJkQAlP4hsyT5I5aoEcEKZ39ROl9jY0CJ-u0QfL5GKPKBgrP3_N9YxnPMk2WzIaIUweEhInZGIOhHa2d9HMQ9qQi-2PEjdpX9TumFB5OCFmHAI2G_Tcl' },
                    { id: 11, name: { en: 'Nour El-Din', ar: 'نور الدين' }, role: { en: 'React Developer', ar: 'مطور React' }, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmxDoxVMYKdjLBI4LTyACovkoA7uosdPqmrae8x1N8ktTZL_u2lHHqBKZVBUlQBcWdpSUiUZd3cTPzyRjLO_jFUxCdutbIhy1pj8kvFx02gnLTAAPaQ4VlgTElAkYkQPBlfxbJrrgVrkg_9-VOh8rufjYPqqj7l23exRU5rNDr7p90wCxB5Eiex3SBJcTbCtAcZVDbubo4OWdf-lwjVcf-g8Uzrut7uEWkt3AR_S4ZeTb4nLPvdegGx8tz56WWbDgXgs38QzCGKN92' },
                ]
            },
            prize: { en: '$10,000 Prizes', ar: '10,000$ جوائز' },
            deadline: { en: 'Jul 30, 2026', ar: '30 يوليو 2026' },
        }
    },
    {
        id: 6, eventId: 6, status: 'rejected',
        isCompetition: false,
        category: 'event',
        icon: 'cancel', iconBg: 'bg-error/10', iconColor: 'text-error',
        title: { en: 'Global Design Summit', ar: 'قمة التصميم العالمية' },
        sub:   { en: 'Global Design Guild • Applied Jun 2, 2026', ar: 'Global Design Guild • تقدّمت في 2 يونيو 2026' },
        badge: { en: 'Not Selected', ar: 'لم يتم الاختيار' },
        badgeCls: 'bg-error/10 text-error',
        dim: true,
    },
]

const TABS = [
    { key: 'all',          labelEn: 'All',           labelAr: 'الكل' },
    { key: 'pending',      labelEn: 'Pending',       labelAr: 'قيد المراجعة' },
    { key: 'accepted',     labelEn: 'Accepted',      labelAr: 'المقبولة' },
    { key: 'rejected',     labelEn: 'Not Selected',  labelAr: 'غير المختارة' },
    { key: 'cancelled',    labelEn: 'Cancelled',     labelAr: 'الملغية' },
]

export default function MyApplications() {
    const { language } = useLanguage()
    const ar = language === 'ar'
    const navigate = useNavigate()

    const [applications, setApplications] = useState(INITIAL_APPLICATIONS)

    // Reset withdrawal flag on fresh page reload
    useEffect(() => {
        try {
            localStorage.removeItem('eventify_team_withdrawn')
            localStorage.removeItem('eventify_team_members')
            localStorage.removeItem('eventify_withdrawn_competitions')
        } catch {}
    }, [])

    const [activeFilter, setActiveFilter] = useState('all')
    const [confirmModal, setConfirmModal] = useState({ open: false, app: null, loading: false })
    const [leaderTransferModal, setLeaderTransferModal] = useState({
        open: false,
        app: null,
        teamName: '',
        members: [],
        selectedLeaderId: null,
        loading: false,
    })
    const [detailsModal, setDetailsModal] = useState({ open: false, app: null })

    const counts = {
        all: applications.length,
        pending: applications.filter(a => a.status === 'pending').length,
        accepted: applications.filter(a => a.status === 'accepted').length,
        rejected: applications.filter(a => a.status === 'rejected').length,
        cancelled: applications.filter(a => a.status === 'cancelled').length,
    }

    const visible = applications.filter(a => activeFilter === 'all' || a.status === activeFilter)

    // Leader Unregister Validation check (Requirement 2 & 3: In-Modal Transfer & Direct Unregister)
    const handleCancelClick = (app) => {
        const team = app.competitionDetails?.team
        const isLeader = team?.isLeader
        const membersCount = team?.membersCount || 1

        // If user is Leader and there are other members in the team (> 1), open in-modal leadership transfer
        if (app.isCompetition && isLeader && membersCount > 1) {
            let teamMembers = team.members || []
            try {
                const storedTeam = localStorage.getItem('eventify_team_members')
                if (storedTeam) {
                    teamMembers = JSON.parse(storedTeam)
                }
            } catch {}

            const candidates = teamMembers.filter(m => m.id !== 1)
            const initialCandidateId = candidates[0]?.id || ''

            setLeaderTransferModal({
                open: true,
                app,
                teamName: typeof team.name === 'object' ? (ar ? team.name.ar : team.name.en) : team.name,
                members: candidates,
                selectedLeaderId: initialCandidateId,
                loading: false,
            })
            return
        }

        // Otherwise (sole member or non-leader), allow cancellation
        setConfirmModal({ open: true, app, loading: false })
    }

    // Direct in-modal transfer leadership & unregister (Unified API Call, NO Redirect)
    const confirmTransferAndUnregister = async () => {
        if (!leaderTransferModal.app || !leaderTransferModal.selectedLeaderId) return

        setLeaderTransferModal(prev => ({ ...prev, loading: true }))

        // Simulate unified API call
        setTimeout(() => {
            const app = leaderTransferModal.app
            const selectedMember = leaderTransferModal.members.find(
                m => String(m.id) === String(leaderTransferModal.selectedLeaderId)
            )
            const selectedMemberName = selectedMember
                ? (typeof selectedMember.name === 'object' ? (ar ? selectedMember.name.ar : selectedMember.name.en) : selectedMember.name)
                : (ar ? 'القائد الجديد' : 'New Leader')

            // 1. Update application in state to cancelled
            setApplications(prev => {
                const updated = prev.map(a => a.id === app.id ? {
                    ...a,
                    status: 'cancelled',
                    badge: { en: 'Cancelled', ar: 'تم الإلغاء' },
                    badgeCls: 'bg-outline-variant/30 text-outline',
                    icon: 'event_busy',
                    iconBg: 'bg-outline-variant/20',
                    iconColor: 'text-outline',
                    dim: true,
                } : a)
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
                } catch { /* ignore */ }
                return updated
            })

            // 2. Mark user as withdrawn from this specific competition's team
            try {
                const withdrawn = JSON.parse(localStorage.getItem('eventify_withdrawn_competitions') || '[]')
                if (!withdrawn.includes(app.id)) withdrawn.push(app.id)
                localStorage.setItem('eventify_withdrawn_competitions', JSON.stringify(withdrawn))
                localStorage.setItem('eventify_team_withdrawn', 'true')
            } catch {}

            // 3. Close modal & reset loading
            setLeaderTransferModal({
                open: false,
                app: null,
                teamName: '',
                members: [],
                selectedLeaderId: null,
                loading: false,
            })

            // 4. Show success toast without ANY redirect! User stays on My Event.
            toast(
                ar
                    ? `تم نقل قيادة الفريق إلى "${selectedMemberName}" وإلغاء تسجيلك بنجاح.`
                    : `Leadership transferred to "${selectedMemberName}" and your registration cancelled.`,
                'success'
            )
        }, 600)
    }

    const confirmCancel = async () => {
        if (!confirmModal.app) return
        setConfirmModal(prev => ({ ...prev, loading: true }))
        const app = confirmModal.app

        setApplications(prev => {
            const updated = prev.map(a => a.id === app.id ? {
                ...a,
                status: 'cancelled',
                badge: { en: 'Cancelled', ar: 'تم الإلغاء' },
                badgeCls: 'bg-outline-variant/30 text-outline',
                icon: 'event_busy',
                iconBg: 'bg-outline-variant/20',
                iconColor: 'text-outline',
                dim: true,
            } : a)
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
            } catch { /* ignore */ }
            return updated
        })

        setConfirmModal({ open: false, app: null, loading: false })
        toast(
            ar
                ? `تم إلغاء التسجيل في "${app.title.ar}" بنجاح.`
                : `Successfully cancelled registration for "${app.title.en}".`,
            'success'
        )
    }

    return (
        <>
            <AppPageHead title={ar ? 'طلباتي والمسابقات | EVENTIFY' : 'My Applications & Competitions | EVENTIFY'} />

            <main
                className="pt-24 pb-12 px-container-margin-mobile md:px-container-margin-desktop max-w-[1280px] mx-auto flex flex-col gap-stack_gap_md"
                dir={ar ? 'rtl' : 'ltr'}
            >
                {/* Page header */}
                <section className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 premium-shadow border border-outline-variant/50">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-[#FF4D2E]">assignment_turned_in</span>
                        <span className="text-xs font-bold text-[#FF4D2E] uppercase tracking-wider">
                            {ar ? 'سجل الطلبات والمشاركات' : 'Applications & Registrations'}
                        </span>
                    </div>
                    <h1 className="font-headline-lg text-headline-lg mb-1">
                        {ar ? 'طلباتي' : 'My Applications'}
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                        {ar
                            ? 'كل فرصة ومسابقة وفعالية تقدّمت إليها في مكان واحد — تابع حالة طلبك أو انسحب عند الحاجة.'
                            : "Every competition, opportunity, and event you've applied to in one place — track status or withdraw when needed."}
                    </p>
                </section>

                {/* Filter Tabs */}
                <div className={`flex gap-stack_gap_md overflow-x-auto no-scrollbar ${ar ? 'flex-row-reverse' : ''}`}>
                    {TABS.map(({ key, labelEn, labelAr }) => (
                        <button
                            key={key}
                            type="button"
                            className="flex-shrink-0 px-6 py-2 rounded-full font-label-md text-label-md transition-all flex items-center gap-1.5"
                            style={activeFilter === key
                                ? { backgroundColor: '#FF4D2E', color: '#fff', boxShadow: '0 2px 8px rgba(255,77,46,.25)' }
                                : { backgroundColor: 'var(--color-surface-container)', color: 'var(--color-on-surface-variant)' }}
                            aria-pressed={activeFilter === key}
                            onClick={() => setActiveFilter(key)}
                        >
                            <span>{ar ? labelAr : labelEn}</span>
                            <span className="opacity-90 text-xs">
                                (<AnimatedCounter value={counts[key] || 0} duration={400} />)
                            </span>
                        </button>
                    ))}
                </div>

                {/* Applications List */}
                <div key={activeFilter} className="flex flex-col gap-4 fade-in">
                    {visible.map((app, idx) => {
                        const canCancel = app.status === 'pending' || app.status === 'accepted'

                        return (
                            <div
                                key={app.id}
                                className={`bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/50 flex flex-col sm:flex-row sm:items-center gap-4 row-animated transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${app.dim ? 'opacity-75' : ''} ${ar ? 'sm:flex-row-reverse' : ''}`}
                                style={{ '--stagger-idx': idx }}
                            >
                                <div className={`w-12 h-12 rounded-2xl ${app.iconBg} flex items-center justify-center flex-shrink-0`}>
                                    <span
                                        className={`material-symbols-outlined ${app.iconColor}`}
                                        style={app.iconFill ? { fontVariationSettings: '"FILL" 1' } : undefined}
                                    >
                                        {app.icon}
                                    </span>
                                </div>

                                <div className={`flex-1 min-w-0 ${ar ? 'text-right' : ''}`}>
                                    <div className={`flex items-center gap-2 flex-wrap mb-1 ${ar ? 'flex-row-reverse' : ''}`}>
                                        <p className="font-title-md text-title-md font-bold truncate">
                                            {ar ? app.title.ar : app.title.en}
                                        </p>
                                        {app.isCompetition && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FF4D2E]/10 text-[#FF4D2E] border border-[#FF4D2E]/20">
                                                <span className="material-symbols-outlined text-[13px]">emoji_events</span>
                                                <span>{ar ? 'مسابقة' : 'Competition'}</span>
                                            </span>
                                        )}
                                    </div>

                                    {/* Competition Track & Team Subtitle */}
                                    {app.isCompetition && app.competitionDetails && (
                                        <div className={`flex items-center gap-2 text-xs text-on-surface-variant font-medium mb-1.5 flex-wrap ${ar ? 'flex-row-reverse' : ''}`}>
                                            <span className="text-[#FF4D2E] font-bold">
                                                {typeof app.competitionDetails.track === 'object' ? (ar ? app.competitionDetails.track.ar : app.competitionDetails.track.en) : app.competitionDetails.track}
                                            </span>
                                            <span>•</span>
                                            <span className="bg-surface-container-high px-2 py-0.5 rounded-md text-[11px] font-semibold text-on-surface">
                                                {ar
                                                    ? `فريق: ${typeof app.competitionDetails.team.name === 'object' ? app.competitionDetails.team.name.ar : app.competitionDetails.team.name} (${app.competitionDetails.team.isLeader ? 'أنت قائد الفريق' : 'عضو'} • ${app.competitionDetails.team.membersCount} أعضاء)`
                                                    : `Team: ${typeof app.competitionDetails.team.name === 'object' ? app.competitionDetails.team.name.en : app.competitionDetails.team.name} (${app.competitionDetails.team.isLeader ? 'Team Leader' : 'Member'} • ${app.competitionDetails.team.membersCount} members)`}
                                            </span>
                                        </div>
                                    )}

                                    <p className="font-label-sm text-label-sm text-outline">
                                        {ar ? app.sub.ar : app.sub.en}
                                    </p>
                                </div>

                                <span className={`ev-badge whitespace-nowrap ${app.badgeCls}`}>
                                    {ar ? app.badge.ar : app.badge.en}
                                </span>

                                <div className={`flex items-center gap-2 flex-wrap sm:flex-nowrap ${ar ? 'flex-row-reverse' : ''}`}>
                                    <button
                                        type="button"
                                        onClick={() => setDetailsModal({ open: true, app })}
                                        className="px-4 py-2 rounded-full border border-outline-variant font-label-sm text-label-sm hover:bg-surface-container-low transition-colors whitespace-nowrap text-center font-medium"
                                    >
                                        {ar ? 'عرض التفاصيل' : 'View Details'}
                                    </button>

                                    {canCancel && (
                                        <button
                                            type="button"
                                            onClick={() => handleCancelClick(app)}
                                            className="px-3.5 py-2 rounded-full border border-error/30 text-error hover:bg-error hover:text-white font-label-sm text-label-sm transition-all whitespace-nowrap flex items-center gap-1.5 shadow-sm active:scale-95"
                                            title={ar ? 'إلغاء التسجيل في هذه الفعالية أو المسابقة' : 'Unregister / Withdraw'}
                                        >
                                            <span className="material-symbols-outlined text-[16px]">cancel</span>
                                            <span>{ar ? 'إلغاء التسجيل' : 'Unregister'}</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}

                    {visible.length === 0 && (
                        <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/60 p-8">
                            <span className="material-symbols-outlined text-4xl text-outline mb-2">inbox</span>
                            <p className="text-on-surface-variant font-body-md text-body-md">
                                {ar ? 'لا توجد طلبات في هذا التبويب.' : 'No applications found in this tab.'}
                            </p>
                        </div>
                    )}
                </div>
            </main>

            {/* ================= MODAL 1: COMPETITION & APPLICATION DETAILS ================= */}
            {detailsModal.open && detailsModal.app && (
                <div
                    className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
                    onClick={() => setDetailsModal({ open: false, app: null })}
                >
                    <div
                        className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative my-auto animate-scale-in"
                        dir={ar ? 'rtl' : 'ltr'}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between pb-4 border-b border-outline-variant/30 mb-4">
                            <div>
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span className="material-symbols-outlined text-[#FF4D2E] text-base">emoji_events</span>
                                    <span className="text-xs font-bold text-[#FF4D2E]">
                                        {detailsModal.app.isCompetition ? (ar ? 'تفاصيل المسابقة' : 'Competition Details') : (ar ? 'تفاصيل الفعالية' : 'Event Details')}
                                    </span>
                                </div>
                                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                                    {ar ? detailsModal.app.title.ar : detailsModal.app.title.en}
                                </h3>
                            </div>
                            <button
                                onClick={() => setDetailsModal({ open: false, app: null })}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:bg-surface-container"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="space-y-3.5 text-xs text-on-surface-variant">
                            {detailsModal.app.competitionDetails && (
                                <>
                                    <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40">
                                        <p className="font-bold text-on-surface mb-0.5">{ar ? 'المسار التنافسي (Track):' : 'Competition Track:'}</p>
                                        <p className="text-[#FF4D2E] font-semibold">
                                            {typeof detailsModal.app.competitionDetails.track === 'object' ? (ar ? detailsModal.app.competitionDetails.track.ar : detailsModal.app.competitionDetails.track.en) : detailsModal.app.competitionDetails.track}
                                        </p>
                                    </div>

                                    <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="font-bold text-on-surface">{ar ? 'الفريق المسجل:' : 'Registered Team:'}</p>
                                            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                                {detailsModal.app.competitionDetails.team.membersCount} {ar ? 'أعضاء' : 'Members'}
                                            </span>
                                        </div>
                                        <p className="text-on-surface font-semibold text-sm">
                                            {typeof detailsModal.app.competitionDetails.team.name === 'object' ? (ar ? detailsModal.app.competitionDetails.team.name.ar : detailsModal.app.competitionDetails.team.name.en) : detailsModal.app.competitionDetails.team.name}
                                        </p>
                                        <p className="text-xs text-outline mt-0.5">
                                            {ar ? `دورك في الفريق: ${detailsModal.app.competitionDetails.team.isLeader ? 'قائد الفريق (Team Leader)' : 'عضو'}` : `Your role: ${detailsModal.app.competitionDetails.team.isLeader ? 'Team Leader' : 'Member'}`}
                                        </p>
                                    </div>
                                </>
                            )}

                            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-on-surface">{ar ? 'حالة الطلب:' : 'Application Status:'}</p>
                                    <p className="text-xs">{ar ? detailsModal.app.sub.ar : detailsModal.app.sub.en}</p>
                                </div>
                                <span className={`ev-badge ${detailsModal.app.badgeCls}`}>
                                    {ar ? detailsModal.app.badge.ar : detailsModal.app.badge.en}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2.5 pt-5 mt-4 border-t border-outline-variant/30">
                            {detailsModal.app.competitionDetails?.team?.name && detailsModal.app.status !== 'cancelled' ? (
                                <button
                                    onClick={() => {
                                        const targetId = detailsModal.app.id
                                        setDetailsModal({ open: false, app: null })
                                        navigate(`/app/team-dashboard?id=${targetId}`, { state: { competitionId: targetId } })
                                    }}
                                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#FF4D2E] text-white font-bold text-xs hover:bg-[#e03d20] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-sm">dashboard</span>
                                    <span>{ar ? 'الانتقال للوحة تحكم الفريق' : 'Go to Team Dashboard'}</span>
                                </button>
                            ) : detailsModal.app.status === 'cancelled' ? (
                                <div className="flex-1 p-2.5 rounded-xl bg-error/10 border border-error/20 text-error text-xs flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base shrink-0">block</span>
                                    <span className="leading-tight">{ar ? 'تم إلغاء التسجيل والانسحاب (غير مصرح بالدخول للوحة التحكم)' : 'Registration cancelled. Dashboard access is forbidden.'}</span>
                                </div>
                            ) : null}
                            <button
                                onClick={() => setDetailsModal({ open: false, app: null })}
                                className="py-2.5 px-4 rounded-xl border border-outline-variant font-semibold text-xs hover:bg-surface-container"
                            >
                                {ar ? 'إغلاق' : 'Close'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= MODAL 2: IN-MODAL LEADER TRANSFER & UNREGISTER ================= */}
            {leaderTransferModal.open && (
                <div
                    className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => !leaderTransferModal.loading && setLeaderTransferModal({ open: false, app: null, teamName: '', members: [], selectedLeaderId: null, loading: false })}
                >
                    <div
                        className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl relative my-auto animate-scale-in"
                        dir={ar ? 'rtl' : 'ltr'}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                            <span className="material-symbols-outlined text-3xl">how_to_reg</span>
                        </div>
                        <h3 className="font-headline-sm text-headline-sm text-center font-black text-on-surface mb-2">
                            {ar ? 'تعيين قائد جديد وإلغاء التسجيل' : 'Transfer Leadership & Unregister'}
                        </h3>
                        <p className="font-body-sm text-body-sm text-center text-on-surface-variant mb-3 leading-relaxed">
                            {ar
                                ? `بصفتك قائداً لفريق (${leaderTransferModal.teamName})، يرجى اختيار عضو ليتولى قيادة الفريق قبل إتمام إلغاء تسجيلك.`
                                : `As leader of (${leaderTransferModal.teamName}), please select a member to take over leadership before unregistering.`}
                        </p>

                        <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 mb-4 leading-relaxed flex items-center gap-2">
                            <span className="material-symbols-outlined text-base shrink-0">info</span>
                            <span>
                                {ar
                                    ? 'ستتم عملية نقل القيادة وإلغاء تسجيلك فوراً وبشكل متزامن وستبقى في هذه الصفحة.'
                                    : 'Leadership transfer and unregister will execute simultaneously without leaving this page.'}
                            </span>
                        </div>

                        {/* Candidates list */}
                        <div className="mb-5">
                            <label className="block text-xs font-bold text-on-surface mb-2">
                                {ar ? 'اختر القائد الجديد للفريق:' : 'Select the new team leader:'}
                            </label>
                            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                {leaderTransferModal.members && leaderTransferModal.members.length > 0 ? (
                                    leaderTransferModal.members.map((member) => {
                                        const isSelected = String(leaderTransferModal.selectedLeaderId) === String(member.id)
                                        const memberName = typeof member.name === 'object' ? (ar ? member.name.ar : member.name.en) : member.name
                                        const memberRole = typeof member.role === 'object' ? (ar ? member.role.ar : member.role.en) : member.role
                                        return (
                                            <div
                                                key={member.id}
                                                onClick={() => !leaderTransferModal.loading && setLeaderTransferModal(prev => ({ ...prev, selectedLeaderId: member.id }))}
                                                className={`flex items-center gap-3.5 p-3 rounded-2xl border cursor-pointer transition-all ${
                                                    isSelected
                                                        ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary/30'
                                                        : 'border-outline-variant/40 hover:border-outline-variant hover:bg-surface-container/50'
                                                }`}
                                            >
                                                <div className="relative">
                                                    <img
                                                        src={member.img || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                                                        alt={memberName}
                                                        className="w-10 h-10 rounded-full object-cover border border-outline-variant/30"
                                                    />
                                                    {isSelected && (
                                                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary text-on-primary rounded-full flex items-center justify-center text-[10px]">
                                                            ✓
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-sm text-on-surface truncate">{memberName}</p>
                                                    <p className="text-xs text-on-surface-variant truncate">{memberRole || (ar ? 'عضو بالفريق' : 'Team Member')}</p>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                                        isSelected ? 'border-primary bg-primary' : 'border-outline-variant'
                                                    }`}>
                                                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <p className="text-xs text-on-surface-variant text-center py-4">
                                        {ar ? 'لا يوجد أعضاء آخرين متاحين لنقل القيادة إليهم' : 'No other members available for transfer'}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2.5">
                            <button
                                type="button"
                                onClick={confirmTransferAndUnregister}
                                disabled={leaderTransferModal.loading || !leaderTransferModal.selectedLeaderId}
                                className="w-full py-3 px-4 rounded-xl bg-error text-white hover:bg-error/90 active:scale-95 transition-all font-bold text-xs flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {leaderTransferModal.loading ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                                        <span>{ar ? 'جارٍ نقل القيادة وإلغاء التسجيل...' : 'Transferring & Unregistering...'}</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-base">how_to_reg</span>
                                        <span>{ar ? 'تأكيد نقل القيادة وإلغاء التسجيل' : 'Confirm Transfer & Unregister'}</span>
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                disabled={leaderTransferModal.loading}
                                onClick={() => setLeaderTransferModal({ open: false, app: null, teamName: '', members: [], selectedLeaderId: null, loading: false })}
                                className="w-full py-2.5 px-4 rounded-xl border border-outline-variant text-on-surface-variant font-semibold text-xs hover:bg-surface-container transition-colors disabled:opacity-50"
                            >
                                {ar ? 'تراجع' : 'Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= MODAL 3: NORMAL CANCEL CONFIRMATION ================= */}
            {confirmModal.open && (
                <div
                    className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => !confirmModal.loading && setConfirmModal({ open: false, app: null, loading: false })}
                >
                    <div
                        className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative my-auto animate-scale-in"
                        dir={ar ? 'rtl' : 'ltr'}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-14 h-14 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-3xl">event_busy</span>
                        </div>
                        <h3 className="font-headline-sm text-headline-sm text-center font-bold text-on-surface mb-2">
                            {ar ? 'تأكيد إلغاء التسجيل' : 'Confirm Registration Cancellation'}
                        </h3>
                        <p className="font-body-md text-body-md text-center text-on-surface-variant mb-4">
                            {ar
                                ? 'هل أنت متأكد من رغبتك في إلغاء تسجيلك والانسحاب من هذه الفعالية؟'
                                : 'Are you sure you want to cancel your registration for this event?'}
                        </p>

                        {confirmModal.app && (
                            <div className="bg-surface-container/60 border border-outline-variant/40 rounded-xl p-3.5 mb-4 text-center">
                                <p className="font-title-sm text-title-sm text-on-surface font-semibold truncate">
                                    {ar ? confirmModal.app.title.ar : confirmModal.app.title.en}
                                </p>
                                <p className="font-label-sm text-label-sm text-outline mt-0.5">
                                    {ar ? confirmModal.app.sub.ar : confirmModal.app.sub.en}
                                </p>
                            </div>
                        )}

                        <p className="text-xs text-outline text-center mb-6">
                            {ar
                                ? '💡 ملاحظة: سيتم إخلاء مقعدك بالفعالية، ويمكنك التسجيل مجدداً لاحقاً ما دامت المقاعد متاحة.'
                                : '💡 Note: Your seat will be vacated. You can register again later as long as seats remain available.'}
                        </p>

                        <div className={`flex gap-3 ${ar ? 'flex-row-reverse' : ''}`}>
                            <button
                                type="button"
                                disabled={confirmModal.loading}
                                onClick={() => setConfirmModal({ open: false, app: null, loading: false })}
                                className="flex-1 py-2.5 px-4 rounded-full border border-outline-variant hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors font-semibold"
                            >
                                {ar ? 'تراجع' : 'Keep Registration'}
                            </button>
                            <button
                                type="button"
                                disabled={confirmModal.loading}
                                onClick={confirmCancel}
                                className="flex-1 py-2.5 px-4 rounded-full bg-error text-white hover:bg-error/90 active:scale-95 transition-all font-label-md text-label-md flex items-center justify-center gap-2 font-semibold shadow-sm"
                            >
                                {confirmModal.loading ? (
                                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                                )}
                                <span>
                                    {confirmModal.loading
                                        ? (ar ? 'جاري الإلغاء...' : 'Cancelling...')
                                        : (ar ? 'نعم، إلغاء التسجيل' : 'Yes, Cancel')}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AppFooter />
        </>
    )
}
