import AppLangToggle from '../../components/app/AppLangToggle'
import AppFooter from '../../components/app/AppFooter'
import AppPageHead from '../../components/app/AppPageHead'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'

const NOTIFS = [
    {
        id: 1, status: 'unread', category: 'ai', to: '/app/opportunity',
        icon: 'auto_awesome', iconColor: 'text-secondary', iconBg: 'bg-secondary/10', iconBorder: 'border-secondary/20',
        accent: 'bg-secondary',
        badge: { en: 'AI Recommendation', ar: 'توصية ذكاء اصطناعي' },
        badgeColor: 'text-secondary',
        time: { en: '2h ago', ar: 'منذ ساعتين' },
        unread: true,
        body: null,
        bodyJsx: (ar) => (
            <p className="font-body-md text-body-md text-on-surface">
                {ar
                    ? <>بناءً على سيرتك الذاتية، وجدنا <span className="font-semibold" style={{ color: '#FF4D2E' }}>هاكاثوناً</span> جديداً يتوافق مع مهاراتك في الذكاء الاصطناعي.</>
                    : <>Based on your CV, we found a new <span className="font-semibold" style={{ color: '#FF4D2E' }}>Hackathon</span> matching your AI skills.</>}
            </p>
        ),
        tags: [
            { label: { en: 'AI-Powered', ar: 'مدعوم بالذكاء الاصطناعي' }, cls: 'bg-secondary/5 text-secondary border border-secondary/10' },
            { label: { en: 'New Match', ar: 'تطابق جديد' }, cls: 'bg-surface-container-highest text-on-surface-variant' },
        ],
    },
    {
        id: 2, status: 'unread', category: 'deadline', to: '/app/opportunity',
        icon: 'alarm', iconColor: 'text-error', iconBg: 'bg-error/10', iconBorder: 'border-error/20',
        accent: 'bg-error',
        badge: { en: 'Deadline Reminder', ar: 'تذكير بالموعد النهائي' },
        badgeColor: 'text-error',
        time: { en: '5h ago', ar: 'منذ 5 ساعات' },
        unread: true,
        bodyJsx: (ar) => (
            <p className="font-body-md text-body-md text-on-surface">
                {ar
                    ? <>تبقّى <span className="font-bold text-error">24 ساعة فقط</span> للتقديم في القمة العالمية للتصميم!</>
                    : <>Only <span className="font-bold text-error">24 hours left</span> to apply for the Global Design Summit!</>}
            </p>
        ),
        tags: [],
    },
    {
        id: 3, status: 'read', category: 'application', to: '/app/opportunity',
        icon: 'check_circle', iconColor: 'text-primary', iconBg: 'bg-primary/10', iconBorder: 'border-primary/20',
        accent: null,
        badge: { en: 'Application Update', ar: 'تحديث طلب' },
        badgeColor: 'text-primary',
        time: { en: '1d ago', ar: 'منذ يوم' },
        unread: false,
        bodyJsx: (ar) => (
            <p className="font-body-md text-body-md text-on-surface">
                {ar
                    ? <>تم <span style={{ color: '#FF4D2E', fontWeight: 700 }}>قبول</span> طلبك في <span className="font-semibold">'ورشة الحوسبة الكمية'</span>!</>
                    : <>Your application for <span className="font-semibold">'Quantum Computing Workshop'</span> has been <span style={{ color: '#FF4D2E', fontWeight: 700 }}>accepted!</span></>}
            </p>
        ),
        tags: [],
    },
    {
        id: 4, status: 'read', mention: false, to: '/app/posts',
        icon: 'apartment', iconColor: 'text-primary', iconBg: 'bg-primary/10', iconBorder: 'border-primary/20',
        accent: null,
        badge: null,
        badgeColor: null,
        time: { en: '2d ago', ar: 'منذ يومين' },
        unread: false,
        bodyJsx: (ar) => (
            <div className="flex-1 flex flex-col gap-1">
                <div className={`flex justify-between items-start ${ar ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-1 flex-wrap ${ar ? 'flex-row-reverse' : ''}`}>
                        <span className="font-semibold text-on-surface">TechGenius Labs</span>
                        <span className="text-on-surface-variant">{ar ? 'نشر منشوراً جديداً' : 'published a new post'}</span>
                    </div>
                </div>
                <div className={`mt-2 p-3 bg-surface-container-low rounded-lg border border-outline-variant/30 italic text-on-surface-variant text-label-md ${ar ? 'text-right' : ''}`}>
                    {ar ? '"نعلن بسعادة أن التسجيل مفتوح الآن لقمة الذكاء الاصطناعي..."' : '"Excited to announce registration is now open for the AI Summit..."'}
                </div>
            </div>
        ),
        tags: [],
        noInnerBody: true,
    },
    {
        id: 7, status: 'unread', category: 'ai', to: '/app/opportunity',
        icon: 'group_add', iconColor: 'text-primary', iconBg: 'bg-primary/10', iconBorder: 'border-primary/20',
        accent: '#FF4D2E',
        badge: { en: 'Team Invite', ar: 'دعوة فريق' },
        badgeColor: 'text-primary',
        time: { en: '1h ago', ar: 'منذ ساعة' },
        unread: true,
        bodyJsx: (ar) => (
            <p className="font-body-md text-body-md text-on-surface">
                {ar
                    ? <><span className="font-semibold">Sara Ahmed</span> دعتك للانضمام لفريقها في <span className="font-semibold text-primary">'Global AI Innovation Challenge'</span>.</>
                    : <><span className="font-semibold">Sara Ahmed</span> invited you to join her team in <span className="font-semibold text-primary">'Global AI Innovation Challenge'</span>.</>}
            </p>
        ),
        tags: [
            { label: { en: 'Team Invite', ar: 'دعوة فريق' }, cls: 'bg-primary/5 text-primary border border-primary/10' },
        ],
    },
    {
        id: 5, status: 'read', mention: false, to: '/app/profile',
        icon: null,
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2GbQS-NWZy4s11NQjIQnQlE6RA8qo3lCvQgA9R_t2cD0_3acPrckEE0p1mNr11PNtBvzZabEH08T5SS3l8_yxv1z0CKApqpBF0FeUemSWMeTsU1gyATXMZKQKcr4zB-0ZK4lP2_VXAh9cWXQJu__mUeBUD8Kyg9A3OhPaCTW6Qf5PA0ZiNCOnYnHiuu0bcvuLxY7-WgnAFp6LK_4cDOeuu71FvYU_WLyMu9GWA_8GV8mKc6ZKD0u1z-MckDKeRNePjzQ2G1fU2JqK',
        accent: null,
        badge: null, badgeColor: null,
        time: { en: '3d ago', ar: 'منذ 3 أيام' },
        unread: false,
        bodyJsx: null,
        tags: [],
        isFriendRequest: true,
    },
    {
        id: 6, status: 'read', mention: false, to: '/app/posts',
        icon: 'campaign', iconColor: 'text-tertiary', iconBg: 'bg-surface-container-high', iconBorder: 'border-tertiary/20',
        accent: null,
        badge: { en: 'Organization', ar: 'منظّمة' },
        badgeColor: 'text-tertiary',
        time: { en: '4d ago', ar: 'منذ 4 أيام' },
        unread: false,
        bodyJsx: (ar) => (
            <>
                <p className="font-body-md text-body-md text-on-surface">
                    {ar ? <>منشور جديد من <span className="font-semibold text-tertiary">DevCommunity Hub</span>.</> : <>New post from <span className="font-semibold text-tertiary">DevCommunity Hub</span>.</>}
                </p>
                <p className="text-on-surface-variant text-label-md line-clamp-1 mt-1">
                    {ar ? '"يغلق تسجيل Frontend Wizards 2024 هذا الجمعة!"' : '"Registration for Frontend Wizards 2024 closes this Friday!"'}
                </p>
            </>
        ),
        tags: [],
    },
]

const TABS = [
    { key: 'all',          label: { en: 'All',          ar: 'الكل' } },
    { key: 'unread',       label: { en: 'Unread',       ar: 'الجديدة' } },
    { key: 'applications', label: { en: 'Applications', ar: 'الطلبات' } },
    { key: 'deadlines',    label: { en: 'Deadlines',    ar: 'المواعيد' } },
    { key: 'ai',           label: { en: 'AI Matches',   ar: 'تطابقات AI' } },
]

export default function Notifications() {
    const { language } = useLanguage()
    const ar = language === 'ar'
    const navigate = useNavigate()

    const [filter, setFilter] = useState('all')
    const [friendStatus, setFriendStatus] = useState(null)

    const visible = (n) =>
        filter === 'all' ||
        (filter === 'unread'       && n.status === 'unread') ||
        (filter === 'applications' && n.category === 'application') ||
        (filter === 'deadlines'    && n.category === 'deadline') ||
        (filter === 'ai'           && n.category === 'ai')

    return (
        <>
            <AppPageHead title={ar ? 'الإشعارات | EVENTIFY' : 'Notifications | EVENTIFY'} />

            <div dir={ar ? 'rtl' : 'ltr'}>
                {/* Header */}
                <header className="sticky top-0 w-full z-50 glass-nav border-b border-outline-variant/30 shadow-sm flex items-center justify-between px-4 sm:px-6 h-16">
                    <div className={`flex items-center gap-4 ${ar ? 'flex-row-reverse' : ''}`}>
                        <Link
                            className="material-symbols-outlined p-2 active:scale-95 transition-transform"
                            style={{ color: '#FF4D2E', fontVariationSettings: '"FILL" 0' }}
                            to="/app"
                        >
                            {ar ? 'arrow_forward' : 'arrow_back'}
                        </Link>
                        <h1 className="font-headline-lg text-headline-lg text-on-surface">
                            {ar ? 'الإشعارات' : 'Notifications'}
                        </h1>
                    </div>
<div className="flex items-center gap-2">
<AppLangToggle />
                    <Link
                        className="material-symbols-outlined p-2 active:scale-95 transition-transform"
                        style={{ color: '#FF4D2E' }}
                        to="/app/profile"
                    >
                        settings
                    </Link>
</div>
                </header>

                <main className="max-w-[840px] mx-auto pb-40 px-4 sm:px-6">
                    {/* Filter Tabs */}
                    <section className="pt-4 pb-5">
                        <div className={`flex gap-3 overflow-x-auto py-1 ${ar ? 'flex-row-reverse' : ''}`} role="group" aria-label={ar ? 'تصفية الإشعارات' : 'Filter notifications'}>
                            {TABS.map(({ key, label }) => (
                                <button
                                    key={key}
                                    type="button"
                                    className="flex-shrink-0 px-5 py-2 rounded-full font-label-md text-label-md transition-all"
                                    style={filter === key
                                        ? { backgroundColor: '#FF4D2E', color: '#fff', boxShadow: '0 2px 8px rgba(255,77,46,.25)' }
                                        : { backgroundColor: 'var(--color-surface-container)', color: 'var(--color-on-surface-variant)' }}
                                    aria-pressed={filter === key}
                                    onClick={() => setFilter(key)}
                                >
                                    {ar ? label.ar : label.en}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Notification Cards */}
                    <div className="flex flex-col gap-4">
                        {NOTIFS.filter(visible).map((n) => {
                            if (n.isFriendRequest) {
                                return (
                                    <div
                                        key={n.id}
                                        className={`group bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/50 flex gap-4 cursor-pointer hover:shadow-md transition-shadow ${ar ? 'flex-row-reverse' : ''}`}
                                        onClick={() => navigate(n.to)}
                                    >
                                        <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-surface shadow-sm">
                                            <img className="w-full h-full object-cover" src={n.avatar} alt="Alex Rivera" />
                                        </div>
                                        <div className="flex-1 flex flex-col gap-1 min-w-0">
                                            <div className={`flex justify-between items-start ${ar ? 'flex-row-reverse' : ''}`}>
                                                <div className={`flex items-center gap-1 flex-wrap font-body-md text-body-md ${ar ? 'flex-row-reverse' : ''}`}>
                                                    <span className="font-semibold text-on-surface">Alex Rivera</span>
                                                    <span className="text-on-surface-variant">{ar ? 'أرسل لك طلب صداقة' : 'sent you a friend request'}</span>
                                                </div>
                                                <span className="text-on-surface-variant font-label-sm text-label-sm shrink-0">{ar ? n.time.ar : n.time.en}</span>
                                            </div>
                                            {friendStatus === null ? (
                                                <div className={`mt-3 flex gap-2 ${ar ? 'flex-row-reverse' : ''}`}>
                                                    <button
                                                        className="flex-1 py-2 rounded-full font-label-md text-label-md active:scale-95 transition-transform"
                                                        style={{ backgroundColor: '#FF4D2E', color: '#fff' }}
                                                        onClick={(e) => { e.stopPropagation(); setFriendStatus('accepted') }}
                                                    >
                                                        {ar ? 'قبول' : 'Accept'}
                                                    </button>
                                                    <button
                                                        className="flex-1 bg-surface-container text-on-surface-variant py-2 rounded-full font-label-md text-label-md active:scale-95 transition-transform"
                                                        onClick={(e) => { e.stopPropagation(); setFriendStatus('declined') }}
                                                    >
                                                        {ar ? 'رفض' : 'Decline'}
                                                    </button>
                                                </div>
                                            ) : (
                                                <p className="mt-2 font-label-md text-label-md" style={{ color: friendStatus === 'accepted' ? '#FF4D2E' : 'var(--color-on-surface-variant)' }}>
                                                    {friendStatus === 'accepted'
                                                        ? (ar ? '✓ تم قبول الطلب' : '✓ Request accepted')
                                                        : (ar ? 'تم رفض الطلب' : 'Request declined')}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )
                            }

                            if (n.noInnerBody) {
                                return (
                                    <div
                                        key={n.id}
                                        className={`group bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/50 flex gap-4 cursor-pointer hover:shadow-md transition-shadow ${ar ? 'flex-row-reverse' : ''}`}
                                        onClick={() => navigate(n.to)}
                                    >
                                        <div className={`shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-surface shadow-sm ${n.iconBg} flex items-center justify-center`}>
                                            <span className={`material-symbols-outlined ${n.iconColor}`} style={{ fontVariationSettings: '"FILL" 1' }}>{n.icon}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className={`flex justify-between items-start mb-1 ${ar ? 'flex-row-reverse' : ''}`}>
                                                <div />
                                                <span className="text-on-surface-variant font-label-sm text-label-sm shrink-0">{ar ? n.time.ar : n.time.en}</span>
                                            </div>
                                            {n.bodyJsx(ar)}
                                        </div>
                                    </div>
                                )
                            }

                            return (
                                <div
                                    key={n.id}
                                    className={`group relative bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/50 flex gap-4 cursor-pointer hover:shadow-md transition-shadow overflow-hidden ${ar ? 'flex-row-reverse' : ''}`}
                                    onClick={() => navigate(n.to)}
                                >
                                    <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center border ${n.iconBg} ${n.iconBorder}`}>
                                        <span className={`material-symbols-outlined ${n.iconColor}`} style={{ fontVariationSettings: '"FILL" 1' }}>{n.icon}</span>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                                        <div className={`flex justify-between items-start ${ar ? 'flex-row-reverse' : ''}`}>
                                            {n.badge && (
                                                <span className={`font-label-sm text-label-sm uppercase tracking-wider ${n.badgeColor}`}>
                                                    {ar ? n.badge.ar : n.badge.en}
                                                </span>
                                            )}
                                            <div className={`flex items-center gap-2 ${ar ? 'flex-row-reverse' : ''}`}>
                                                <span className="text-on-surface-variant font-label-sm text-label-sm">{ar ? n.time.ar : n.time.en}</span>
                                                {n.unread && <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: '#FF4D2E' }} />}
                                            </div>
                                        </div>
                                        {n.bodyJsx && n.bodyJsx(ar)}
                                        {n.tags.length > 0 && (
                                            <div className={`mt-2 flex gap-2 flex-wrap ${ar ? 'flex-row-reverse' : ''}`}>
                                                {n.tags.map((tag, i) => (
                                                    <span key={i} className={`px-3 py-1 rounded-full text-label-sm font-label-sm ${tag.cls}`}>
                                                        {ar ? tag.label.ar : tag.label.en}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {n.accent && (
                                        <div
                                            className={`absolute ${ar ? 'right-0' : 'left-0'} top-0 bottom-0 w-1 ${n.accent.startsWith('#') ? '' : n.accent} ${ar ? 'rounded-r-xl' : 'rounded-l-xl'}`}
                                            style={n.accent.startsWith('#') ? { backgroundColor: n.accent } : {}}
                                        />
                                    )}
                                </div>
                            )
                        })}

                        {NOTIFS.filter(visible).length === 0 && (
                            <p className="text-center text-on-surface-variant py-10 font-body-md text-body-md">
                                {ar ? 'لا توجد إشعارات في هذا الفلتر.' : 'No notifications in this filter.'}
                            </p>
                        )}
                    </div>
                </main>
                <AppFooter />
            </div>
        </>
    )
}
