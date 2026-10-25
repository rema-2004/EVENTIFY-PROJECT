import AppLangToggle from '../../components/app/AppLangToggle'
import AppFooter from '../../components/app/AppFooter'
import AppPageHead from '../../components/app/AppPageHead'
import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import AnimatedCounter from '../../components/shared/AnimatedCounter'
import RecruitMemberModal from '../../components/app/RecruitMemberModal'
import TeamSettingsModal from '../../components/app/TeamSettingsModal'

// Pre-configured competitions with distinct team dashboards
const COMPETITIONS_MAP = {
    1: {
        id: 1,
        competitionName: { en: 'Global AI Innovation Challenge 2026', ar: 'تحدي الابتكار العالمي بالذكاء الاصطناعي 2026' },
        track: { en: 'Generative AI & Autonomous Agents Track', ar: 'مسار الذكاء الاصطناعي التوليدي والوكلاء المستقلين' },
        teamName: { en: 'AI Pioneers', ar: 'رواد الذكاء الاصطناعي' },
        tag: { en: 'Active Hackathon', ar: 'هاكاثون نشط' },
        maxMembers: 6,
        members: [
            {
                id: 1,
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsk7muPFHYbZe7Z-rUcABeLlGKC3fPcjQvlSlvDR2xQmsCdjD_N5AhN_FIpOxnBOoRFJLYbLp_sbVgThwqN61SNeKujEibFe8f5cuALXg14FqDKFra6QXhkb_QkJ9MaFs2NquGZyYUmOcXHcAxpytMjpzKqzdgt8y-bygB6f3e9Hwuc70pexiu63M8y-FeeoRKHQRbBWOnbK7Om1NIZFjccFbJeTi4Dct6x19p9enOjySz-zAc7WDkeiz2b5Zkyv7hciqBciIkhsI7',
                name: { en: 'Sarah Chen (You)', ar: 'سارة تشن (أنت)' },
                role: { en: 'Team Lead • AI Research', ar: 'قائد الفريق • بحث الذكاء الاصطناعي' },
                isLeader: true,
            },
            {
                id: 2,
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmxDoxVMYKdjLBI4LTyACovkoA7uosdPqmrae8x1N8ktTZL_u2lHHqBKZVBUlQBcWdpSUiUZd3cTPzyRjLO_jFUxCdutbIhy1pj8kvFx02gnLTAAPaQ4VlgTElAkYkQPBlfxbJrrgVrkg_9-VOh8rufjYPqqj7l23exRU5rNDr7p90wCxB5Eiex3SBJcTbCtAcZVDbubo4OWdf-lwjVcf-g8Uzrut7uEWkt3AR_S4ZeTb4nLPvdegGx8tz56WWbDgXgs38QzCGKN92',
                name: { en: 'Marcus Thorne', ar: 'ماركوس ثورن' },
                role: { en: 'Member • Data Engineering', ar: 'عضو • هندسة البيانات' },
                isLeader: false,
            },
            {
                id: 3,
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOV34IwdMrDUOuFd5cGHQYtCTtgkIj993EGhm9-yJWSvP8ysLpA36Eyx10SBESZ7PtNZ-jqAbctO84uEIXhN0ulGxY-MOal6nmIYo5CfFgxE2WHVy7JW4In6iX9VVmzMp6QU-rDqAbEYHywag67SFhv5TYwuu0VpHZSoNoqW9izgBggdmllvvhSLRJFcvdWDoxZYzArX5GFZZjZwfUw8QpsUlD2QUbx9Z5sXxCExbF2yOaUnRHtdNtnevMhuEzcADkOnLt0KDTiIJm',
                name: { en: 'Elena Rodriguez', ar: 'إيلينا رودريغيز' },
                role: { en: 'Member • Product Design', ar: 'عضو • تصميم المنتج' },
                isLeader: false,
            },
            {
                id: 4,
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcTN_fBBPE7UutBfaFRRZX5sFqx7xFgBTx1xJWZiRZiervLaW8j6fXApyz-lC37L-9-e9zem29PdBNnzmcyQAyN5BXQRnQZJU4F-9qCLTVZICagRsqbzn0oDsZ1XJSE-X-4ntW4ODtewcEdOgt43G-kCdMWu9kE6aos01MOOH6bJajd7IsUooiOCYCt-wEDO8yZ-33jR5Li1s7yFFOes26hwW7mokDuPDIY25dtmumzZGDKBW6lmLtnkANsucN6c9xEoLszP2it_hF',
                name: { en: 'James Wilson', ar: 'جيمس ويلسون' },
                role: { en: 'Member • Cloud Infrastructure', ar: 'عضو • البنية السحابية' },
                isLeader: false,
            },
        ]
    },
    5: {
        id: 5,
        competitionName: { en: 'Frontend Wizards Hackathon 2026', ar: 'هاكاثون معالجو الواجهة الأمامية 2026' },
        track: { en: 'UI/UX & Interactive Design Track', ar: 'مسار واجهات وتجربة المستخدم التفاعلية' },
        teamName: { en: 'CodeCraft Squad', ar: 'فرقة كودكرافت' },
        tag: { en: 'Accepted / Active', ar: 'مقبول / نشط' },
        maxMembers: 4,
        members: [
            {
                id: 1,
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsk7muPFHYbZe7Z-rUcABeLlGKC3fPcjQvlSlvDR2xQmsCdjD_N5AhN_FIpOxnBOoRFJLYbLp_sbVgThwqN61SNeKujEibFe8f5cuALXg14FqDKFra6QXhkb_QkJ9MaFs2NquGZyYUmOcXHcAxpytMjpzKqzdgt8y-bygB6f3e9Hwuc70pexiu63M8y-FeeoRKHQRbBWOnbK7Om1NIZFjccFbJeTi4Dct6x19p9enOjySz-zAc7WDkeiz2b5Zkyv7hciqBciIkhsI7',
                name: { en: 'Sarah Chen (You)', ar: 'سارة تشن (أنت)' },
                role: { en: 'Team Lead • Frontend Lead', ar: 'قائد الفريق • مطور واجهات رئيسي' },
                isLeader: true,
            },
            {
                id: 10,
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGWZsh5hb95_nQ-ArZECm2xz51h_f0sPqc4LL8qGy875HaknSaoOd9whCqRWOAJaYYuX_cBzGsQcjj8xhc7QoTT6y-XLY-KVOPvgiItAyfXLMKLZKaqxq-GFjHKVfw11WWKJratVoYRJUJkObmjI2Yh2SRjJkQAlP4hsyT5I5aoEcEKZ39ROl9jY0CJ-u0QfL5GKPKBgrP3_N9YxnPMk2WzIaIUweEhInZGIOhHa2d9HMQ9qQi-2PEjdpX9TumFB5OCFmHAI2G_Tcl',
                name: { en: 'Tariq Al-Mansoor', ar: 'طارق المنصور' },
                role: { en: 'Member • CSS & Motion Designer', ar: 'عضو • مصمم حركات وCSS' },
                isLeader: false,
            },
            {
                id: 11,
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmxDoxVMYKdjLBI4LTyACovkoA7uosdPqmrae8x1N8ktTZL_u2lHHqBKZVBUlQBcWdpSUiUZd3cTPzyRjLO_jFUxCdutbIhy1pj8kvFx02gnLTAAPaQ4VlgTElAkYkQPBlfxbJrrgVrkg_9-VOh8rufjYPqqj7l23exRU5rNDr7p90wCxB5Eiex3SBJcTbCtAcZVDbubo4OWdf-lwjVcf-g8Uzrut7uEWkt3AR_S4ZeTb4nLPvdegGx8tz56WWbDgXgs38QzCGKN92',
                name: { en: 'Nour El-Din', ar: 'نور الدين' },
                role: { en: 'Member • React Developer', ar: 'عضو • مطور React' },
                isLeader: false,
            },
        ]
    }
}

export default function TeamDashboard() {
    const { language } = useLanguage()
    const ar = language === 'ar'
    const location = useLocation()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    // Determine current competition ID from query param (?id=1 or ?competitionId=1) or location state
    const activeCompId = Number(searchParams.get('id') || searchParams.get('competitionId') || location.state?.competitionId || 1)
    const currentComp = COMPETITIONS_MAP[activeCompId] || COMPETITIONS_MAP[1]

    const [members, setMembers] = useState(() => currentComp.members)

    useEffect(() => {
        setMembers(currentComp.members)
    }, [activeCompId, currentComp.members])

    // Check withdrawal specifically for THIS competition
    let withdrawnCompetitions = []
    try {
        withdrawnCompetitions = JSON.parse(localStorage.getItem('eventify_withdrawn_competitions') || '[]')
    } catch {}
    const isWithdrawnFromThis = withdrawnCompetitions.includes(activeCompId)

    const currentUserId = 1
    const currentUser = members.find((m) => m.id === currentUserId)
    const isUserInTeam = Boolean(currentUser) && !isWithdrawnFromThis
    const userRole = currentUser?.isLeader ? 'leader' : 'member'
    const isLeader = userRole === 'leader'

    const [teamSettingsOpen, setTeamSettingsOpen] = useState(() => Boolean(location.state?.openSettingsModal))
    const [memberLeaveModal, setMemberLeaveModal] = useState(false)
    const [requestStatus, setRequestStatus] = useState(null)
    const [recruitModalOpen, setRecruitModalOpen] = useState(() => isLeader && (Boolean(location.state?.openRecruitModal) || Boolean(searchParams.get('recruit'))))
    const vacantRoles = location.state?.vacantRoles || [{ en: 'Product Design', ar: 'تصميم المنتج' }]
    const [alertNotice, setAlertNotice] = useState(null)
    const noticeTimerRef = useRef(null)

    const triggerNotice = (msg, duration = 5000) => {
        if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current)
        setAlertNotice(msg)
        noticeTimerRef.current = setTimeout(() => {
            setAlertNotice(null)
            noticeTimerRef.current = null
        }, duration)
    }

    useEffect(() => {
        return () => {
            if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current)
        }
    }, [])

    const [pendingInvites, setPendingInvites] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('eventify:pending-invites') || '[]')
        } catch {
            return []
        }
    })

    const maxMembers = currentComp.maxMembers || 6
    const totalOccupied = members.length + pendingInvites.length
    const isTeamFull = totalOccupied >= maxMembers

    const cancelInvite = (targetInvite, index) => {
        if (!isLeader) return
        const targetId = typeof targetInvite === 'object' ? (targetInvite.id || targetInvite.name) : targetInvite
        const updated = pendingInvites.filter((inv, i) => {
            if (targetId && (inv.id || inv.name)) {
                return (inv.id || inv.name) !== targetId
            }
            return i !== index
        })
        setPendingInvites(updated)
        try {
            localStorage.setItem('eventify:pending-invites', JSON.stringify(updated))
        } catch (err) {
            console.error(err)
        }
    }

    // Handle Transfer Leadership
    const handleTransferLeadership = (newLeaderId) => {
        const newLeader = members.find((m) => m.id === newLeaderId)
        const updated = members.map((m) => {
            const isThisNewLeader = String(m.id) === String(newLeaderId)
            const baseEn = typeof m.role === 'object'
                ? m.role.en.replace(/^(Team Lead|Member)\s*•\s*/i, '').replace(/^(قائد الفريق|عضو)\s*•\s*/, '')
                : String(m.role).replace(/^(Team Lead|Member)\s*•\s*/i, '').replace(/^(قائد الفريق|عضو)\s*•\s*/, '')
            const baseAr = typeof m.role === 'object'
                ? m.role.ar.replace(/^(قائد الفريق|عضو)\s*•\s*/, '').replace(/^(Team Lead|Member)\s*•\s*/i, '')
                : String(m.role).replace(/^(قائد الفريق|عضو)\s*•\s*/, '').replace(/^(Team Lead|Member)\s*•\s*/i, '')

            return {
                ...m,
                isLeader: isThisNewLeader,
                role: {
                    en: isThisNewLeader ? `Team Lead • ${baseEn}` : `Member • ${baseEn}`,
                    ar: isThisNewLeader ? `قائد الفريق • ${baseAr}` : `عضو • ${baseAr}`,
                },
            }
        })

        setMembers(updated)
        const newLeaderName = newLeader ? (ar ? newLeader.name.ar : newLeader.name.en) : ''
        setTeamSettingsOpen(false)
        triggerNotice(
            ar
                ? `✓ تم نقل قيادة الفريق بنجاح إلى "${newLeaderName}". أصبحت رتبتك الآن عضواً في الفريق.`
                : `✓ Leadership successfully transferred to "${newLeaderName}". Your role is now Team Member.`,
            8000
        )
    }

    // Handle Member Leave Team
    const handleConfirmMemberLeave = () => {
        const updated = members.filter((m) => m.id !== currentUserId)
        setMembers(updated)
        try {
            const list = JSON.parse(localStorage.getItem('eventify_withdrawn_competitions') || '[]')
            if (!list.includes(activeCompId)) list.push(activeCompId)
            localStorage.setItem('eventify_withdrawn_competitions', JSON.stringify(list))
        } catch {}
        setMemberLeaveModal(false)
        setAlertNotice(ar ? '✓ تم الانسحاب من الفريق بنجاح.' : '✓ You have left the team successfully.')
        setTimeout(() => {
            navigate('/app/my-applications')
        }, 1200)
    }

    // Handle Unregister / Leave Team
    const handleUnregisterTeam = () => {
        setMembers([])
        try {
            const list = JSON.parse(localStorage.getItem('eventify_withdrawn_competitions') || '[]')
            if (!list.includes(activeCompId)) list.push(activeCompId)
            localStorage.setItem('eventify_withdrawn_competitions', JSON.stringify(list))
        } catch {}
        setAlertNotice(ar ? 'تم إلغاء تسجيل الفريق والانسحاب بنجاح.' : 'Team unregistration completed successfully.')
        setTimeout(() => {
            navigate('/app/my-applications')
        }, 1500)
    }

    const hasPendingRequests = Boolean(location.state?.joinRequest) || Boolean(searchParams.get('joinRequest'))

    // Access Control: Block withdrawn or non-member users from viewing the team dashboard
    if (!isUserInTeam) {
        return (
            <div className="min-h-screen bg-surface flex flex-col justify-between" dir={ar ? 'rtl' : 'ltr'}>
                <AppPageHead title={ar ? 'غير مصرح بالدخول | EVENTIFY' : 'Access Forbidden | EVENTIFY'} />
                <header className="glass-header sticky top-0 z-50 w-full h-16 border-b border-outline-variant/30 flex items-center justify-between px-6" dir={ar ? 'rtl' : 'ltr'}>
                    <Link className="flex items-center gap-2" to="/app">
                        <span className="material-symbols-outlined text-3xl" style={{ color: '#FF4D2E', fontVariationSettings: '"FILL" 1' }}>hub</span>
                        <span className="font-headline-md text-headline-md font-black" style={{ color: '#FF4D2E' }}>EVENTIFY</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <AppLangToggle />
                        <Link className="font-label-md text-label-md hover:underline" style={{ color: '#FF4D2E' }} to="/app/my-applications">
                            {ar ? 'طلباتي' : 'My Applications'}
                        </Link>
                    </div>
                </header>

                <main className="max-w-xl mx-auto px-4 py-16 text-center my-auto animate-scale-in">
                    <div className="w-20 h-20 rounded-3xl bg-error/10 text-error flex items-center justify-center mx-auto mb-6 border border-error/20 shadow-lg">
                        <span className="material-symbols-outlined text-5xl">lock_person</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-error-container text-error text-xs font-bold uppercase tracking-wider">
                        {ar ? 'غير مصرح بالدخول' : 'Access Forbidden'}
                    </span>
                    <h1 className="font-headline-lg text-headline-lg font-black text-on-surface mt-4 mb-2">
                        {ar ? 'لا يمكنك الوصول إلى لوحة تحكم الفريق' : 'Cannot Access Team Dashboard'}
                    </h1>

                    <div className="p-3 my-4 bg-surface-container-low rounded-xl border border-outline-variant/40 text-xs text-center inline-block max-w-md w-full">
                        <div className="text-on-surface-variant font-medium">
                            {ar ? currentComp.competitionName.ar : currentComp.competitionName.en}
                        </div>
                        <div className="font-bold text-on-surface mt-1 text-sm">
                            {ar ? currentComp.teamName.ar : currentComp.teamName.en}
                        </div>
                    </div>

                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-6">
                        {ar
                            ? 'لقد قمت بإلغاء تسجيلك والانسحاب من هذا الفريق في هذه المسابقة، وتم نقل قيادة الفريق إلى عضو آخر. وفقاً لسياسات المنصة، لا يحق للأعضاء المنسحبين الدخول أو الاطلاع على لوحة تحكم هذا الفريق.'
                            : 'You have cancelled your registration and withdrawn from this team for this competition. Withdrawn members are forbidden from accessing this team dashboard.'}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            to="/app/my-applications"
                            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#FF4D2E] text-white font-bold text-xs hover:bg-[#e03d20] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-base">arrow_back</span>
                            <span>{ar ? 'العودة لصفحة طلباتي' : 'Return to My Applications'}</span>
                        </Link>
                        <Link
                            to="/app/explore"
                            className="w-full sm:w-auto px-6 py-3 rounded-full border border-outline-variant text-on-surface font-semibold text-xs hover:bg-surface-container transition-colors text-center"
                        >
                            {ar ? 'استكشاف مسابقات أخرى' : 'Explore Other Competitions'}
                        </Link>
                    </div>
                </main>

                <AppFooter />
            </div>
        )
    }

    return (
        <>
            <AppPageHead title={`${ar ? currentComp.teamName.ar : currentComp.teamName.en} | EVENTIFY`} />

            {/* Task-flow header */}
            <header className="glass-header sticky top-0 z-50 w-full h-16 border-b border-outline-variant/30 flex items-center justify-between px-6" dir={ar ? 'rtl' : 'ltr'}>
                <Link className="flex items-center gap-2" to="/app">
                    <span className="material-symbols-outlined text-3xl" style={{ color: '#FF4D2E', fontVariationSettings: '"FILL" 1' }}>hub</span>
                    <span className="font-headline-md text-headline-md font-black" style={{ color: '#FF4D2E' }}>EVENTIFY</span>
                </Link>
                <div className="flex items-center gap-3">
                    <AppLangToggle />
                    <Link className="font-label-md text-label-md hover:underline transition-colors" style={{ color: '#FF4D2E' }} to="/app/my-applications">
                        {ar ? 'طلباتي' : 'My Applications'}
                    </Link>
                    <Link className="p-2 hover:bg-surface-container-low rounded-full transition-colors flex items-center justify-center" to="/app/my-applications" aria-label="Close">
                        <span className="material-symbols-outlined text-on-surface-variant">close</span>
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 mb-24" dir={ar ? 'rtl' : 'ltr'}>

                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wider">
                                {ar ? currentComp.tag.ar : currentComp.tag.en}
                            </span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                                {ar ? currentComp.competitionName.ar : currentComp.competitionName.en}
                            </span>
                        </div>
                        <h1 className="font-headline-lg text-headline-lg text-on-surface">
                            {ar ? currentComp.teamName.ar : currentComp.teamName.en}
                        </h1>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: '#FF4D2E' }} />
                            <span className="font-label-md text-label-md" style={{ color: '#FF4D2E' }}>
                                {ar ? 'يُجنّد' : 'Recruiting'}
                            </span>
                            <span className="text-outline mx-2">•</span>
                            <span className="font-label-md text-label-md text-on-surface-variant" data-count>
                                <AnimatedCounter value={members.length} /> / {maxMembers} {ar ? 'أعضاء' : 'Members'}
                            </span>
                            <span className="text-outline mx-2">•</span>
                            <span className="font-label-sm text-label-sm text-outline">
                                {ar ? currentComp.track.ar : currentComp.track.en}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {userRole === 'leader' ? (
                            <>
                                <button
                                    onClick={() => setTeamSettingsOpen(true)}
                                    className="flex items-center gap-2 px-6 py-3 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-all active:scale-95"
                                >
                                    <span className="material-symbols-outlined text-[18px]">settings</span>
                                    {ar ? 'إعدادات الفريق' : 'Team Settings'}
                                </button>
                                <button
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-label-md text-label-md transition-all ${
                                        isTeamFull
                                            ? 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed border border-outline-variant opacity-80'
                                            : 'shadow-md active:scale-95 text-white bg-[#FF4D2E]'
                                    }`}
                                    onClick={() => {
                                        if (isTeamFull) {
                                            triggerNotice(
                                                ar
                                                    ? `الفريق مكتمل بالكامل (${members.length}/${maxMembers} أعضاء + ${pendingInvites.length} دعوة معلقة). لا يمكن إضافة دعوات جديدة.`
                                                    : `Team is at maximum capacity (${members.length}/${maxMembers} members + ${pendingInvites.length} pending invites).`,
                                                5000
                                            )
                                        } else {
                                            setRecruitModalOpen(true)
                                        }
                                    }}
                                >
                                    <span className="material-symbols-outlined text-[18px]">{isTeamFull ? 'lock' : 'add'}</span>
                                    {isTeamFull
                                        ? (ar ? `الفريق مكتمل (${totalOccupied}/${maxMembers})` : `Team Full (${totalOccupied}/${maxMembers})`)
                                        : (ar ? 'طلب عضو جديد' : 'Request New Member')}
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container border border-outline-variant text-on-surface font-label-md text-xs">
                                    <span className="w-2 h-2 rounded-full bg-primary" />
                                    <span>{ar ? 'رتبتك: عضو بالفريق' : 'Your Role: Team Member'}</span>
                                </div>
                                <button
                                    onClick={() => setMemberLeaveModal(true)}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-error/40 text-error hover:bg-error/10 font-label-md text-xs transition-all active:scale-95"
                                >
                                    <span className="material-symbols-outlined text-base">logout</span>
                                    {ar ? 'مغادرة الفريق' : 'Leave Team'}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {alertNotice && (
                    <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200/80 dark:border-emerald-800/40 flex items-center justify-between animate-fade-in shadow-sm">
                        <div className="flex items-center gap-2.5">
                            <span className="material-symbols-outlined text-emerald-600 text-xl">check_circle</span>
                            <span className="text-sm font-bold">{alertNotice}</span>
                        </div>
                        <button onClick={() => setAlertNotice(null)} className="text-emerald-600 hover:text-emerald-900">
                            <span className="material-symbols-outlined text-base">close</span>
                        </button>
                    </div>
                )}

                {/* Centered Main Layout */}
                <div className="max-w-5xl mx-auto space-y-stack_gap_lg">

                    {/* Pending Join Requests */}
                    <section>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                                    <span>{ar ? 'طلبات الانضمام المعلّقة' : 'Pending Join Requests'}</span>
                                    {hasPendingRequests && <span className="bg-error-container text-error text-label-sm px-2 py-0.5 rounded-full">1</span>}
                                </h3>
                            </div>

                            {!hasPendingRequests ? (
                                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 text-center">
                                    <p className="font-label-md text-label-md text-on-surface-variant">
                                        {ar ? 'لا توجد طلبات انضمام حالياً' : 'No pending join requests'}
                                    </p>
                                </div>
                            ) : requestStatus === null ? (
                                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm relative overflow-hidden">
                                    <div className={`absolute top-0 ${ar ? 'right-0' : 'left-0'} w-1 h-full`} style={{ backgroundColor: '#FF4D2E' }} />
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Avatar */}
                                        <div className="flex-shrink-0 flex flex-col items-center">
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden mb-3 border-2 border-surface-container-high shadow-inner">
                                                <img
                                                    className="w-full h-full object-cover"
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGWZsh5hb95_nQ-ArZECm2xz51h_f0sPqc4LL8qGy875HaknSaoOd9whCqRWOAJaYYuX_cBzGsQcjj8xhc7QoTT6y-XLY-KVOPvgiItAyfXLMKLZKaqxq-GFjHKVfw11WWKJratVoYRJUJkObmjI2Yh2SRjJkQAlP4hsyT5I5aoEcEKZ39ROl9jY0CJ-u0QfL5GKPKBgrP3_N9YxnPMk2WzIaIUweEhInZGIOhHa2d9HMQ9qQi-2PEjdpX9TumFB5OCFmHAI2G_Tcl"
                                                    alt="Alex Rivera"
                                                />
                                            </div>
                                            <div className="flex items-center gap-1 text-on-surface-variant">
                                                <span className="material-symbols-outlined text-[16px]">work</span>
                                                <span className="font-label-sm text-label-sm">{ar ? '3 سنوات خبرة' : '3 Years Exp'}</span>
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="flex-grow">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-title-lg text-title-lg text-on-surface">Alex Rivera</h4>
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF4D2E] bg-[#FF4D2E]/10 px-2 py-0.5 rounded-full">
                                                            <span className="material-symbols-outlined text-[13px]">emoji_events</span>
                                                            <span>{ar ? `مسابقة: ${currentComp.competitionName.ar}` : `Competition: ${currentComp.competitionName.en}`}</span>
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-on-surface-variant font-medium">
                                                        {ar ? 'متقدم لشاغر: مهندس ذكاء اصطناعي ونظم مستقلة' : 'Applying for: AI Engineer & Autonomous Systems'}
                                                    </p>
                                                </div>
                                                <div className="flex gap-4">
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

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {['Python', 'PyTorch', 'Computer Vision', 'React'].map((s) => (
                                                    <span key={s} className="px-3 py-1 rounded-lg bg-surface-container text-primary font-label-sm text-label-sm">{s}</span>
                                                ))}
                                            </div>

                                            <p className="font-body-md text-body-md text-on-surface-variant mb-4 leading-relaxed">
                                                {ar
                                                    ? 'شغوف ببناء حلول ذكاء اصطناعي قابلة للتطوير. عملت مؤخراً على نظام كشف الأجسام الآني للطائرات المسيّرة المستقلة.'
                                                    : 'Passionate about building scalable AI solutions. I recently worked on a real-time object detection system for autonomous drones. Looking to join a team that values clean code and innovative problem-solving.'}
                                            </p>

                                            {/* AI Smart Match Callout inside Join Request */}
                                            <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-purple-500/10 dark:from-orange-500/15 dark:via-amber-500/10 dark:to-purple-500/15 border border-orange-500/30 shadow-sm relative overflow-hidden">
                                                <div className="flex items-center justify-between mb-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-lg bg-[#FF4D2E]/15 text-[#FF4D2E] flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: '"FILL" 1' }}>auto_awesome</span>
                                                        </div>
                                                        <h5 className="font-label-md text-xs sm:text-sm font-bold text-on-surface">
                                                            {ar ? 'توصية الذكاء الاصطناعي (مطابقة المهارات)' : 'AI Skill Match Recommendation'}
                                                        </h5>
                                                    </div>
                                                    <span className="inline-flex items-center gap-1 font-mono font-black text-xs px-2.5 py-1 rounded-full bg-[#FF4D2E]/15 text-[#FF4D2E] border border-[#FF4D2E]/25 shadow-sm">
                                                        <span>94%</span>
                                                        <span className="text-[10px] font-medium">{ar ? 'تطابق مهارات عالي' : 'High Match'}</span>
                                                    </span>
                                                </div>
                                                <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                                                    {ar
                                                        ? <>بناءً على <strong>المهارات التقنية المطلوبة للفريق</strong>، خبرة Alex Rivera في <strong>PyTorch</strong> و<strong>الرؤية الحاسوبية (Computer Vision)</strong> تغطي الفجوة المهارية في فريقك بنسبة تطابق عالية جداً.</>
                                                        : <>Based on your <strong>team's required technical skills</strong>, Alex Rivera's experience with <strong>PyTorch</strong> and <strong>Computer Vision</strong> fulfills critical skill gaps in your team.</>}
                                                </p>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between items-center text-[10px] font-bold text-on-surface-variant">
                                                        <span>{ar ? 'مؤشر توافق المهارات التقنية مع احتياجات الفريق' : 'Technical Skill Alignment with Team Needs'}</span>
                                                        <span className="text-[#FF4D2E] font-mono">94%</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full ${ar ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-amber-500 to-[#FF4D2E] shadow-sm transition-all duration-1000 ease-out`} style={{ width: '94%' }} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {userRole === 'leader' ? (
                                                    <>
                                                        <button
                                                            className="flex-1 md:flex-none px-8 py-2.5 rounded-xl font-label-md text-label-md shadow-sm active:scale-95 transition-all text-white bg-[#FF4D2E]"
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
                                                    </>
                                                ) : (
                                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container border border-outline-variant text-xs text-on-surface-variant">
                                                        <span className="material-symbols-outlined text-sm text-outline">shield</span>
                                                        <span>{ar ? 'صلاحيات قبول ورفض طلبات الانضمام متاحة لقائد الفريق فقط' : 'Only the team leader can accept or reject requests'}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 text-center fade-in">
                                    <p className="font-label-md text-label-md" style={{ color: requestStatus === 'accepted' ? '#FF4D2E' : 'var(--color-on-surface-variant)' }}>
                                        {requestStatus === 'accepted'
                                            ? (ar ? '✓ تم قبول الطلب' : '✓ Request accepted')
                                            : (ar ? 'تم رفض الطلب' : 'Request rejected')}
                                    </p>
                                </div>
                            )}
                        </section>

                        {/* Pending Outgoing Invitations Sent By Leader */}
                        {pendingInvites.length > 0 && (
                            <section className="animate-fade-in">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#FF4D2E] text-2xl">outgoing_mail</span>
                                        <span>{ar ? 'دعوات مرسلة بالانتظار' : 'Pending Outgoing Invitations'}</span>
                                        <span className="bg-[#FF4D2E]/10 text-[#FF4D2E] text-xs font-bold px-2 py-0.5 rounded-full">
                                            {pendingInvites.length}
                                        </span>
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    {pendingInvites.map((inv, idx) => (
                                        <div
                                            key={inv.id || `${inv.name}-${inv.role || ''}-${idx}`}
                                            className="flex items-center justify-between p-4 bg-surface-container-lowest border border-dashed border-[#FF4D2E]/40 rounded-2xl shadow-sm"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#FF4D2E]/10 text-[#FF4D2E] flex items-center justify-center font-bold text-sm shrink-0">
                                                    {inv.avatar ? (
                                                        <img src={inv.avatar} alt={inv.name} className="w-full h-full object-cover rounded-full" />
                                                    ) : (
                                                        inv.name ? inv.name.charAt(0).toUpperCase() : '?'
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-sm text-on-surface">{inv.name}</p>
                                                        <span className="text-[11px] font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                                                            {ar ? 'بانتظار الموافقة' : 'Awaiting response'}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-on-surface-variant mt-0.5">
                                                        {ar ? `الدور المطلوب: ${inv.role}` : `Role: ${inv.role}`}
                                                    </p>
                                                </div>
                                            </div>
                                            {isLeader ? (
                                                <button
                                                    onClick={() => cancelInvite(inv, idx)}
                                                    className="text-xs font-semibold text-error hover:bg-error/10 px-3 py-1.5 rounded-lg transition-colors active:scale-95 flex items-center gap-1"
                                                >
                                                    <span className="material-symbols-outlined text-sm">cancel</span>
                                                    <span>{ar ? 'إلغاء الدعوة' : 'Cancel Invite'}</span>
                                                </button>
                                            ) : (
                                                <span className="text-[11px] text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full font-medium">
                                                    {ar ? 'مُرسلة بواسطة القائد' : 'Sent by Leader'}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Current Members */}
                        <section>
                            <h3 className="font-headline-md text-headline-md text-on-surface mb-6">
                                {ar ? 'الأعضاء الحاليون' : 'Current Members'}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {members.map((m, idx) => (
                                    <div key={m.id} className="row-animated group flex items-center gap-4 p-4 bg-surface-container-low border border-outline-variant rounded-xl hover:bg-surface-container hover:-translate-y-0.5 transition-all duration-200" style={{ '--stagger-idx': idx }}>
                                        <div className="w-12 h-12 rounded-full overflow-hidden border border-outline-variant flex-shrink-0 group-hover:scale-105 transition-transform relative">
                                            <img className="w-full h-full object-cover" src={m.img} alt={m.name.en} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h5 className="font-title-md text-title-md text-on-surface group-hover:text-primary transition-colors">{ar ? m.name.ar : m.name.en}</h5>
                                                {m.isLeader ? (
                                                    <span className="bg-amber-500/10 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                        {ar ? 'القائد' : 'Leader'}
                                                    </span>
                                                ) : (
                                                    <span className="bg-surface-container text-on-surface-variant text-[10px] font-medium px-2 py-0.5 rounded-full">
                                                        {ar ? 'عضو' : 'Member'}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="font-label-sm text-label-sm text-on-surface-variant">{ar ? m.role.ar : m.role.en}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                </div>
            </main>

            {/* In-Dashboard Member Recruitment Modal */}
            {isLeader && (
                <RecruitMemberModal
                    isOpen={recruitModalOpen}
                    onClose={() => setRecruitModalOpen(false)}
                    vacantRoles={vacantRoles}
                    teamName={ar ? currentComp.teamName.ar : currentComp.teamName.en}
                    maxMembers={maxMembers}
                    currentMemberCount={members.length}
                    pendingInvitesCount={pendingInvites.length}
                    pendingInvites={pendingInvites}
                    existingMembers={members}
                    onInviteSent={(inv) => {
                        const invList = Array.isArray(inv) ? inv : [inv]
                        setPendingInvites((prev) => {
                            const existingKeys = new Set(
                                prev.map((p) => (p.email || p.name || p.id || '').toString().toLowerCase().trim())
                            )
                            const uniqueNew = invList.filter(
                                (item) => !existingKeys.has((item.email || item.name || item.id || '').toString().toLowerCase().trim())
                            )
                            return [...prev, ...uniqueNew]
                        })
                        triggerNotice(ar ? `تم إرسال ${invList.length > 1 ? `${invList.length} دعوات` : 'الدعوة'} بنجاح` : `Invitation(s) sent successfully`, 4000)
                    }}
                    onVacancyPublished={(vac) => {
                        triggerNotice(ar ? `تم نشر شاغر "${vac.role}" بنجاح في المنصة` : `Vacancy for "${vac.role}" published live`, 4000)
                    }}
                />
            )}

            {/* In-Dashboard Team & Leadership Settings Modal (Leaders Only) */}
            {userRole === 'leader' && (
                <TeamSettingsModal
                    isOpen={teamSettingsOpen}
                    onClose={() => setTeamSettingsOpen(false)}
                    members={members}
                    currentUserId={currentUserId}
                    teamName={ar ? currentComp.teamName.ar : currentComp.teamName.en}
                    competitionName={currentComp.competitionName}
                    onTransferLeadership={handleTransferLeadership}
                    onUnregisterTeam={handleUnregisterTeam}
                />
            )}

            {/* Member Leave Team Modal */}
            {memberLeaveModal && (
                <div
                    className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setMemberLeaveModal(false)}
                >
                    <div
                        dir={ar ? 'rtl' : 'ltr'}
                        className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-7 max-w-sm w-full shadow-2xl text-center animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-14 h-14 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-3xl">logout</span>
                        </div>
                        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">
                            {ar ? 'مغادرة الفريق' : 'Leave Team'}
                        </h3>
                        <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                            {ar
                                ? 'هل أنت متأكد من رغبتك في مغادرة الفريق والانسحاب من المسابقة؟'
                                : 'Are you sure you want to leave the team and withdraw from this competition?'}
                        </p>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleConfirmMemberLeave}
                                className="w-full py-2.5 px-4 rounded-xl bg-error hover:bg-error/90 text-white font-bold text-xs transition-colors shadow-sm"
                            >
                                {ar ? 'نعم، مغادرة الفريق' : 'Yes, Leave Team'}
                            </button>
                            <button
                                onClick={() => setMemberLeaveModal(false)}
                                className="w-full py-2.5 px-4 rounded-xl border border-outline-variant text-on-surface font-semibold text-xs hover:bg-surface-container transition-colors"
                            >
                                {ar ? 'تراجع' : 'Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AppFooter />
        </>
    )
}
