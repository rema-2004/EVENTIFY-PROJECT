import AppLangToggle from '../../components/app/AppLangToggle'
import AppFooter from '../../components/app/AppFooter'
import AppPageHead from '../../components/app/AppPageHead'
import SkillFilter from '../../components/SkillFilter'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'

const TEAMS = [
    {
        id: 1, featured: true,
        name: 'NeuroNex',
        logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABqnU1m7CfKkx7tOe81VT8yI0CFQm_2I7ZvpiTA4DumdAIgiS7XqO1U1aUBmSJn9g-NpN98ovqEo04AuH_D-qniLjNQWt9sOdvi76vb-8vbD3tS51NdfOgpmRw4hnGvopwUuBYsMVG2x8GRwRB7LWMquyr0bg4iPTcxWbeskgEmhobXCr8gH29lOwfCBNUUeZt-BH7j1mq56twFAxdfMzvHXhoUhhGOEJpD_Np1tJJH1MgQj1tNf0KAjLucTaGNeAAKQI8ikEoTDM4',
        logoBg: 'bg-primary-fixed',
        leader: { en: 'Dr. Aris Thorne', ar: 'د. أريس ثورن' },
        status: { en: 'Recruiting', ar: 'يُجنّد' },
        desc: {
            en: 'Building a decentralized LLM orchestrator for sustainable edge computing. We need visionary thinkers.',
            ar: 'نبني منسِّق LLM لامركزياً للحوسبة الحافّية المستدامة. نحتاج مفكّرين ذوي رؤية.',
        },
        skills: ['Python', 'PyTorch', 'UI/UX', 'AI'],
        members: 3, max: 5,
        avatars: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDhT6Su_LJr5bDu0t_rxToc1xk8wOTZWIoQB6wS1IThyVSFhWbROhg737J79LKV-Pmc-HtsjSYdTXHbb4Yh28Vux1q1cNcpRWxovJwLO0dldJmvPXVvMd6MSUPozJbhRiwGE_RxBnhoUVj30gyMuEm4F3_b8A5v9t_FPdyVddIKf4jSzLapoE2w8Z0gQJWosGSj_UCh0xjYGLuURk35QhnQN08ua5G3699BYrDOGxYAQvKKPR9yIluBtX0j9tc3rBqY2e4E4lmjm1xA',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDuSV1bfBO_FrWx-qTQa2gLqBTYHIDLSZpFqAFmpBQX9kmamCr_nm57FIoYWEWtRKsl9wZlUDb4TlVTaKTM4y0l-OBR-5ZJs4_Ib1fHcbDOZTlXodi3Crl9DEXFAW8nPbGeakm7igqp-uZCmK2egYkUjmB5Jiwrdo6nsZi8DHv6AU9OZkWO3p-IKjfDjB_WBUEirWkbfmS_waug6wi6YksChigukYcMs2PPfI273T7tV5KxAstCD59VP7h83fiSbvL_USnlLoKcpAz2',
        ],
    },
    {
        id: 2, featured: false,
        name: 'CloudScale',
        logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqCYVrg0hwpqru5Fe9bAcf3hFI_HcymhazDgPmLMdQtxbpkY9eHL3TnCI0B3dMEunM0pQyLAS5lrN2DgFvg8q98c0KEMC7H9TQNXVEHZBMjPY1Mxwhz9qdGgQo5jSTZWlNCr9HLa3BkWZT5L9vIyP9OmJNH3l76N7kVsdk_8ASVSzY6E8jckg6VzjXLtFklmpYRCvWrRQbC1aIqgGR3xJpWw9q-h6T-PbFekofMk12kas89Dh14E8vCqerj_uz9csAkaDHzyGva6J-',
        logoBg: 'bg-secondary-fixed',
        leader: { en: 'Sarah Jenkins', ar: 'سارة جينكينز' },
        status: null,
        desc: {
            en: 'Optimizing serverless architectures for heavy traffic spikes.',
            ar: 'تحسين البنى بدون خوادم لمواجهة ارتفاعات حركة المرور الكثيفة.',
        },
        skills: ['AWS', 'Node.js'],
        members: 4, max: 5,
        avatars: [],
    },
    {
        id: 3, featured: false,
        name: 'PixelPerfect',
        logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxSqoiKhKuMhzosASWGg81635Ybgh4kl_FC3b3ssNURpqcZT0fH2Kk4mj86YC5NzjdfAg9LQfigAVcy5WPTKFO1fUX1h_ioelRwNBrwpS6wIZ76_fi1UIp3PKrmdl6gJG7ihBL_LnFZYMoFnSrTRW0jG_Kvj8LSS0HeLmYA2liTwMvufy9s0OPKUIJOLeEjnT3LsnMNqJ9yp68jjnSrBMZfnSMs-GPXDhmQzrLD9vYjuXLgOOSSE0GMYevawgA6wRU0Cz4eW1xk6bT',
        logoBg: 'bg-tertiary-fixed-dim',
        leader: { en: 'Marcus Lee', ar: 'ماركوس لي' },
        status: null,
        desc: {
            en: 'Designing the next generation of social interaction through spatial web.',
            ar: 'تصميم الجيل القادم من التفاعل الاجتماعي عبر الويب المكاني.',
        },
        skills: ['UI/UX', 'Three.js'],
        members: 2, max: 5,
        avatars: [],
    },
    {
        id: 4, featured: false,
        name: 'DataStream',
        logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQOtjzK7bS-lnWwGCqf2XFj_M89deQV3ailE42kVi-oPOnYyeqiwEMIkEeDJ-bb_Am0rYDwkGHKDmpHm0yDIvmlu0XMmHls8l-EWtZ1-5myAD1gkwKHFuLkZ7I9kvtv3w-P-3ooDi8WJcflJsznBzyWUxELWyrOzdbMc--8vNSybPYpjqbe9W6vVEnIXkbl-xAr2-F8_tMZOsueHVeIgibVp571Egl48PJr1rhySEGxbk9efBOEIMHygMHwkMa9jI_1pbxfvRx4kpA',
        logoBg: 'bg-surface-container-highest',
        leader: { en: 'Elena Rodriguez', ar: 'إيلينا رودريغيز' },
        status: null,
        desc: {
            en: 'Real-time analytics for carbon footprint monitoring.',
            ar: 'تحليلات في الوقت الفعلي لمراقبة البصمة الكربونية.',
        },
        skills: ['Python', 'Data Viz'],
        members: 3, max: 5,
        avatars: [],
    },
    {
        id: 5, featured: false,
        name: 'SwiftDev',
        logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_2fjHl1PmJX5xPgzlAPmyUqD4BeGfNI8Cv7pkj-Hp4fyBI4BOhr3m5g4P9RUy60PBm61guxYOm5rEYgqrz3ey2JD2v4t2qE3i_bViZfX7BEdjuiT_bwuuP59QHXiSuXIc2MqHckc-ZdAOmKVKD2yP2bZJZ8ZG2gDMKQSosd1NkDpsnZ7w-GkUqsSKFm7TB1nof-gMsKsGSsW2h5dOm_KJ08ZL_wfiZrXWd2gH3yCZifAqfK-CWDGxdwROtZWZn_rVgvyHVkhPpTa-',
        logoBg: 'bg-primary-container/20',
        leader: { en: 'Kevin Park', ar: 'كيفن بارك' },
        status: null,
        desc: {
            en: 'Mobile-first banking for the underbanked communities.',
            ar: 'خدمات مصرفية تُعطي الأولوية للجوّال لخدمة المجتمعات المحرومة.',
        },
        skills: ['Flutter', 'AI'],
        members: 1, max: 5,
        avatars: [],
    },
]

export default function Teams() {
    const { language } = useLanguage()
    const ar = language === 'ar'
    const navigate = useNavigate()
    const requestToJoin = (team) =>
        navigate('/app/registration-success', { state: { type: 'join', team: team.name } })

    const [selectedSkills, setSelectedSkills] = useState([])
    const [searchQuery, setSearchQuery] = useState('')

    const visible = TEAMS.filter((t) => {
        const matchesSkill = selectedSkills.length === 0 || selectedSkills.some((s) => t.skills.includes(s))
        const text = `${t.name} ${ar ? t.desc.ar : t.desc.en} ${t.skills.join(' ')}`.toLowerCase()
        return matchesSkill && text.includes(searchQuery.trim().toLowerCase())
    })

    return (
        <>
            <AppPageHead title={ar ? 'الفرق المتاحة | EVENTIFY' : 'Available Teams | EVENTIFY'} />

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
                <Link
                    className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
                    to="/app/participation-type"
                    aria-label="Close"
                >
                    <span className="material-symbols-outlined text-on-surface-variant">close</span>
                </Link>
            </header>

            <div className="min-h-screen" dir={ar ? 'rtl' : 'ltr'}>
                <main className="w-full max-w-7xl mx-auto px-4 md:px-12 py-8 pb-32 md:pb-8">

                    {/* Page header */}
                    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 ${ar ? 'md:flex-row-reverse' : ''}`}>
                        <div className={ar ? 'text-right' : ''}>
                            <div className={`flex items-center gap-2 mb-2 ${ar ? 'flex-row-reverse' : ''}`}>
                                <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-label-sm font-label-sm rounded-full">
                                    {ar ? 'المسابقة جارية' : 'Competition Live'}
                                </span>
                                <span className="text-on-surface-variant text-label-md font-label-md">
                                    {ar ? 'الخطوة 2 من 3' : 'Step 2 of 3'}
                                </span>
                            </div>
                            <h2 className="font-headline-lg text-headline-lg leading-tight">
                                {ar ? 'الفرق المتاحة لهذه المسابقة' : 'Available Teams for This Competition'}
                            </h2>
                        </div>
                        <Link
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-label-md text-label-md shadow-lg hover:opacity-90 active:scale-95 transition-all shrink-0"
                            style={{ backgroundColor: '#FF4D2E', color: '#fff' }}
                            to="/app/create-team"
                        >
                            <span className="material-symbols-outlined">add</span>
                            {ar ? 'إنشاء فريق جديد' : 'Create New Team'}
                        </Link>
                    </div>

                    {/* Search & Skill Filters */}
                    <div className="flex flex-col gap-6 mb-12 relative z-30">
                        <div className={`flex flex-col md:flex-row gap-4 relative z-30 ${ar ? 'md:flex-row-reverse' : ''}`}>
                            {/* Search */}
                            <div className="flex-1 relative">
                                <span className={`material-symbols-outlined absolute ${ar ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-outline`}>search</span>
                                <input
                                    className={`w-full ${ar ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4'} py-3 rounded-2xl border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-body-md`}
                                    placeholder={ar ? 'ابحث باسم الفريق أو فكرة المشروع...' : 'Search by team name or project idea...'}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    dir={ar ? 'rtl' : 'ltr'}
                                />
                            </div>

                            {/* Skill Filter Component with Dropdown & Multi-Select */}
                            <SkillFilter
                                selectedSkills={selectedSkills}
                                onSkillsChange={setSelectedSkills}
                                quickSkills={['Python', 'UI/UX', 'AI']}
                                ar={ar}
                            />
                        </div>
                    </div>

                    {/* Teams Grid */}
                    <div key={selectedSkills.join('-') + '-' + search} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {visible.map((team, idx) =>
                            team.featured ? (
                                /* Featured wide card */
                                <div 
                                    key={team.id} 
                                    className="ai-border md:col-span-2 lg:col-span-2 row-animated transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                    style={{ '--stagger-idx': idx }}
                                >
                                    <div className={`p-8 h-full flex flex-col md:flex-row gap-8 bg-white rounded-2xl ${ar ? 'md:flex-row-reverse' : ''}`}>
                                        <div className="flex-shrink-0">
                                            <div className={`w-32 h-32 rounded-3xl ${team.logoBg} flex items-center justify-center overflow-hidden`}>
                                                <img className="w-full h-full object-cover" src={team.logo} alt={team.name} />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className={`flex flex-wrap items-center justify-between gap-4 mb-4 ${ar ? 'flex-row-reverse' : ''}`}>
                                                <div className={ar ? 'text-right' : ''}>
                                                    <h3 className="text-title-lg font-title-lg mb-1">{team.name}</h3>
                                                    <p className={`text-on-surface-variant flex items-center gap-1 text-label-md font-label-md ${ar ? 'flex-row-reverse' : ''}`}>
                                                        <span className="material-symbols-outlined text-lg" style={{ color: '#FF4D2E', fontVariationSettings: '"FILL" 1' }}>stars</span>
                                                        {ar ? `القائد: ${team.leader.ar}` : `Leader: ${team.leader.en}`}
                                                    </p>
                                                </div>
                                                {team.status && (
                                                    <span className="bg-success-container px-4 py-1.5 rounded-full border border-primary text-on-success-container text-label-sm font-label-sm uppercase tracking-wider flex items-center gap-1">
                                                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#FF4D2E' }} />
                                                        {ar ? team.status.ar : team.status.en}
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`text-body-md text-on-surface-variant mb-6 line-clamp-2 ${ar ? 'text-right' : ''}`}>
                                                {ar ? team.desc.ar : team.desc.en}
                                            </p>
                                            <div className={`flex flex-wrap gap-2 mb-8 ${ar ? 'flex-row-reverse' : ''}`}>
                                                {team.skills.filter(s => s !== 'AI').map((s) => (
                                                    <span key={s} className="bg-surface-container-high px-3 py-1 rounded-lg text-label-sm font-label-sm">{s}</span>
                                                ))}
                                            </div>
                                            <div className={`flex flex-wrap items-center justify-between gap-3 mt-auto ${ar ? 'flex-row-reverse' : ''}`}>
                                                <div className={`flex items-center gap-3 ${ar ? 'flex-row-reverse' : ''}`}>
                                                    <div className={`flex ${ar ? 'space-x-reverse' : ''} -space-x-3`}>
                                                        {team.avatars.map((src, i) => (
                                                            <img key={i} className="w-10 h-10 rounded-full border-2 border-white object-cover" src={src} alt="" />
                                                        ))}
                                                        <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-container-highest flex items-center justify-center text-label-sm">+1</div>
                                                    </div>
                                                    <span className="text-label-md font-label-md text-on-surface-variant">
                                                        {team.members}/{team.max} {ar ? 'أعضاء' : 'Members'}
                                                    </span>
                                                </div>
                                                <div className={`flex gap-3 ${ar ? 'flex-row-reverse' : ''}`}>
                                                    <Link className="px-6 py-2.5 rounded-full border border-outline-variant font-label-md text-label-md hover:bg-surface-container transition-all text-center" to="/app/team-dashboard">
                                                        {ar ? 'عرض التفاصيل' : 'View Details'}
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        className="px-6 py-2.5 rounded-full font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all text-center disabled:opacity-50 disabled:pointer-events-none"
                                                        style={{ backgroundColor: '#FF4D2E', color: '#fff' }}
                                                        disabled={team.members >= team.max}
                                                        onClick={() => requestToJoin(team)}
                                                    >
                                                        {team.members >= team.max ? (ar ? 'مكتمل' : 'Full') : ar ? 'طلب الانضمام' : 'Request to Join'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Standard card */
                                <div 
                                    key={team.id} 
                                    className="bg-white p-6 rounded-2xl border border-outline-variant flex flex-col h-full hover:-translate-y-1 hover:shadow-lg transition-all duration-200 row-animated"
                                    style={{ '--stagger-idx': idx }}
                                >
                                    <div className={`flex items-start justify-between mb-6 ${ar ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-16 h-16 rounded-2xl ${team.logoBg} flex items-center justify-center overflow-hidden`}>
                                            <img className="w-full h-full object-cover" src={team.logo} alt={team.name} />
                                        </div>
                                        <span className="bg-surface-container px-3 py-1 rounded-full text-primary text-label-sm font-mono flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">groups</span>
                                            {team.members}/{team.max}
                                        </span>
                                    </div>
                                    <h3 className={`text-title-md font-title-md mb-1 ${ar ? 'text-right' : ''}`}>{team.name}</h3>
                                    <p className={`text-on-surface-variant text-label-md font-label-md mb-4 ${ar ? 'text-right' : ''}`}>
                                        {ar ? `القائد: ${team.leader.ar}` : `Leader: ${team.leader.en}`}
                                    </p>
                                    <p className={`text-body-md text-on-surface-variant mb-6 flex-grow ${ar ? 'text-right' : ''}`}>
                                        {ar ? team.desc.ar : team.desc.en}
                                    </p>
                                    <div className={`flex flex-wrap gap-2 mb-8 ${ar ? 'flex-row-reverse' : ''}`}>
                                        {team.skills.map((s) => (
                                            <span key={s} className="bg-surface-container px-3 py-1 rounded-lg text-label-sm font-label-sm">{s}</span>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mt-auto">
                                        <Link className="py-2.5 rounded-xl border border-outline-variant font-label-md text-label-md hover:bg-surface-container transition-all text-center" to="/app/team-dashboard">
                                            {ar ? 'عرض' : 'View'}
                                        </Link>
                                        <button
                                            type="button"
                                            className="py-2.5 rounded-xl font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all text-center disabled:opacity-50 disabled:pointer-events-none"
                                            style={{ backgroundColor: '#FF4D2E', color: '#fff' }}
                                            disabled={team.members >= team.max}
                                            onClick={() => requestToJoin(team)}
                                        >
                                            {team.members >= team.max ? (ar ? 'مكتمل' : 'Full') : ar ? 'انضمام' : 'Join'}
                                        </button>
                                    </div>
                                </div>
                            )
                        )}

                        {visible.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4 text-center">
                                <span className="material-symbols-outlined text-6xl text-outline">group</span>
                                <h3 className="font-title-lg text-title-lg">
                                    {ar ? 'لا توجد فرق مطابقة' : 'No matching teams'}
                                </h3>
                                <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                                    {ar ? 'جرّب تغيير فلتر المهارة أو مصطلح البحث.' : 'Try changing the skill filter or search term.'}
                                </p>
                            </div>
                        )}
                    </div>
                </main>
                <AppFooter />
            </div>
        </>
    )
}
