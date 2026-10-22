import AppFooter from '../../components/app/AppFooter'
import AppPageHead from '../../components/app/AppPageHead'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import AnimatedCounter from '../../components/shared/AnimatedCounter'
import { toast } from '../../utils/toast.js'
import { apiFetch, getToken } from '../../services/api'

const STORAGE_KEY = 'eventify_my_applications'

const INITIAL_APPLICATIONS = [
    {
        id: 1, eventId: 1, status: 'pending',
        icon: 'emoji_events', iconBg: 'bg-primary/10', iconColor: 'text-primary',
        title: { en: 'Global AI Innovation Challenge', ar: 'تحدي الابتكار العالمي بالذكاء الاصطناعي' },
        sub:   { en: 'TechGenius Labs • Applied Jul 12, 2026', ar: 'TechGenius Labs • تقدّمت في 12 يوليو 2026' },
        badge: { en: 'Pending Review', ar: 'قيد المراجعة' },
        badgeCls: 'bg-tertiary/10 text-tertiary',
    },
    {
        id: 2, eventId: 2, status: 'pending',
        icon: 'terminal', iconBg: 'bg-primary/10', iconColor: 'text-primary',
        title: { en: 'DevOps Masterclass', ar: 'ماستركلاس DevOps' },
        sub:   { en: 'TechGenius Labs • Applied Jul 9, 2026', ar: 'TechGenius Labs • تقدّمت في 9 يوليو 2026' },
        badge: { en: 'Pending Review', ar: 'قيد المراجعة' },
        badgeCls: 'bg-tertiary/10 text-tertiary',
    },
    {
        id: 3, eventId: 3, status: 'pending',
        icon: 'groups', iconBg: 'bg-primary/10', iconColor: 'text-primary',
        title: { en: 'Cloud Career Bootcamp', ar: 'معسكر مسار الحوسبة السحابية' },
        sub:   { en: 'DevCommunity Hub • Applied Jul 4, 2026', ar: 'DevCommunity Hub • تقدّمت في 4 يوليو 2026' },
        badge: { en: 'Pending Review', ar: 'قيد المراجعة' },
        badgeCls: 'bg-tertiary/10 text-tertiary',
    },
    {
        id: 4, eventId: 4, status: 'accepted',
        icon: 'check_circle', iconBg: 'bg-success/10', iconColor: 'text-success', iconFill: true,
        title: { en: 'Quantum Computing Workshop', ar: 'ورشة الحوسبة الكمية' },
        sub:   { en: 'University Research Lab • Applied Jun 28, 2026', ar: 'مختبر الجامعة البحثي • تقدّمت في 28 يونيو 2026' },
        badge: { en: 'Accepted', ar: 'مقبول' },
        badgeCls: 'bg-success/10 text-success',
    },
    {
        id: 5, eventId: 5, status: 'accepted',
        icon: 'check_circle', iconBg: 'bg-success/10', iconColor: 'text-success', iconFill: true,
        title: { en: 'Frontend Wizards 2026', ar: 'Frontend Wizards 2026' },
        sub:   { en: 'DevCommunity Hub • Applied Jun 20, 2026', ar: 'DevCommunity Hub • تقدّمت في 20 يونيو 2026' },
        badge: { en: 'Accepted', ar: 'مقبول' },
        badgeCls: 'bg-success/10 text-success',
    },
    {
        id: 6, eventId: 6, status: 'rejected',
        icon: 'cancel', iconBg: 'bg-error/10', iconColor: 'text-error',
        title: { en: 'Global Design Summit', ar: 'قمة التصميم العالمية' },
        sub:   { en: 'Global Design Guild • Applied Jun 2, 2026', ar: 'Global Design Guild • تقدّمت في 2 يونيو 2026' },
        badge: { en: 'Not Selected', ar: 'لم يتم الاختيار' },
        badgeCls: 'bg-error/10 text-error',
        dim: true,
    },
]

const TABS = [
    { key: 'all',       labelEn: 'All',           labelAr: 'الكل' },
    { key: 'pending',   labelEn: 'Pending',       labelAr: 'قيد المراجعة' },
    { key: 'accepted',  labelEn: 'Accepted',      labelAr: 'المقبولة' },
    { key: 'rejected',  labelEn: 'Not Selected',  labelAr: 'غير المختارة' },
    { key: 'cancelled', labelEn: 'Cancelled',     labelAr: 'الملغية' },
]

export default function MyApplications() {
    const { language } = useLanguage()
    const ar = language === 'ar'

    const [applications, setApplications] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS
        } catch {
            return INITIAL_APPLICATIONS
        }
    })

    const [activeFilter, setActiveFilter] = useState('all')
    const [confirmModal, setConfirmModal] = useState({ open: false, app: null, loading: false })

    // Optional sync with backend registrations if logged in
    useEffect(() => {
        if (!getToken()) return

        let isMounted = true
        apiFetch('/my/registrations')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (!isMounted || !data?.data || !Array.isArray(data.data) || data.data.length === 0) return
                // Map backend registrations to application card format
                const backendApps = data.data.map(reg => {
                    const ev = reg.event || {}
                    const isConfirmed = reg.status === 'confirmed'
                    const isCancelled = reg.status === 'cancelled'
                    return {
                        id: reg.id,
                        eventId: ev.id,
                        status: isCancelled ? 'cancelled' : isConfirmed ? 'accepted' : 'pending',
                        icon: isCancelled ? 'event_busy' : isConfirmed ? 'check_circle' : 'emoji_events',
                        iconBg: isCancelled ? 'bg-outline-variant/20' : isConfirmed ? 'bg-success/10' : 'bg-primary/10',
                        iconColor: isCancelled ? 'text-outline' : isConfirmed ? 'text-success' : 'text-primary',
                        title: {
                            en: ev.title || 'Event Registration',
                            ar: ev.title || 'تسجيل فعالية',
                        },
                        sub: {
                            en: `${ev.organization?.name || 'Organization'} • Registered ${reg.registered_at ? new Date(reg.registered_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'recently'}`,
                            ar: `${ev.organization?.name || 'المنظمة'} • سُجل في ${reg.registered_at ? new Date(reg.registered_at).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', year: 'numeric' }) : 'مؤخراً'}`,
                        },
                        badge: isCancelled
                            ? { en: 'Cancelled', ar: 'تم الإلغاء' }
                            : isConfirmed
                            ? { en: 'Confirmed', ar: 'مؤكد' }
                            : { en: 'Pending', ar: 'قيد الانتظار' },
                        badgeCls: isCancelled
                            ? 'bg-outline-variant/30 text-outline'
                            : isConfirmed
                            ? 'bg-success/10 text-success'
                            : 'bg-tertiary/10 text-tertiary',
                        dim: isCancelled,
                    }
                })

                setApplications(prev => {
                    // Merge backend apps avoiding duplicates
                    const existingIds = new Set(backendApps.map(b => b.eventId))
                    const merged = [...backendApps, ...prev.filter(p => !existingIds.has(p.eventId))]
                    try {
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
                    } catch { /* ignore */ }
                    return merged
                })
            })
            .catch(() => { /* backend unavailable — keep local data */ })

        return () => { isMounted = false }
    }, [])

    const counts = {
        all: applications.length,
        pending: applications.filter(a => a.status === 'pending').length,
        accepted: applications.filter(a => a.status === 'accepted').length,
        rejected: applications.filter(a => a.status === 'rejected').length,
        cancelled: applications.filter(a => a.status === 'cancelled').length,
    }

    const visible = applications.filter(a => activeFilter === 'all' || a.status === activeFilter)

    const confirmCancel = async () => {
        if (!confirmModal.app) return
        setConfirmModal(prev => ({ ...prev, loading: true }))
        const app = confirmModal.app
        const eventId = app.eventId || app.id

        try {
            if (getToken()) {
                await apiFetch(`/events/${eventId}/register`, { method: 'DELETE' })
            }
        } catch (err) {
            console.warn('Backend cancellation API call notice:', err)
        }

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
            <AppPageHead title={ar ? 'طلباتي | EVENTIFY' : 'My Applications | EVENTIFY'} />

            <main
                className="pt-24 pb-12 px-container-margin-mobile md:px-container-margin-desktop max-w-[1280px] mx-auto flex flex-col gap-stack_gap_md"
                dir={ar ? 'rtl' : 'ltr'}
            >
                {/* Page header */}
                <section className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 premium-shadow border border-outline-variant/50">
                    <h1 className="font-headline-lg text-headline-lg mb-1">
                        {ar ? 'طلباتي' : 'My Applications'}
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                        {ar
                            ? 'كل فرصة وفعالية تقدّمت إليها في مكان واحد — تابع حالة طلبك أو انسحب عند الحاجة.'
                            : "Every opportunity and event you've applied to in one place — track your application status or withdraw when needed."}
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
                                className={`bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/50 flex flex-col sm:flex-row sm:items-center gap-4 row-animated transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${app.dim ? 'opacity-75' : ''} ${ar ? 'sm:flex-row-reverse' : ''}`}
                                style={{ '--stagger-idx': idx }}
                            >
                                <div className={`w-12 h-12 rounded-full ${app.iconBg} flex items-center justify-center flex-shrink-0`}>
                                    <span
                                        className={`material-symbols-outlined ${app.iconColor}`}
                                        style={app.iconFill ? { fontVariationSettings: '"FILL" 1' } : undefined}
                                    >
                                        {app.icon}
                                    </span>
                                </div>

                                <div className={`flex-1 min-w-0 ${ar ? 'text-right' : ''}`}>
                                    <p className="font-title-md text-title-md truncate">
                                        {ar ? app.title.ar : app.title.en}
                                    </p>
                                    <p className="font-label-sm text-label-sm text-outline">
                                        {ar ? app.sub.ar : app.sub.en}
                                    </p>
                                </div>

                                <span className={`ev-badge whitespace-nowrap ${app.badgeCls}`}>
                                    {ar ? app.badge.ar : app.badge.en}
                                </span>

                                <div className={`flex items-center gap-2 flex-wrap sm:flex-nowrap ${ar ? 'flex-row-reverse' : ''}`}>
                                    <Link
                                        className="px-4 py-2 rounded-full border border-outline-variant font-label-sm text-label-sm hover:bg-surface-container-low transition-colors whitespace-nowrap text-center"
                                        to="/app/opportunity"
                                    >
                                        {ar ? 'عرض التفاصيل' : 'View Details'}
                                    </Link>

                                    {canCancel && (
                                        <button
                                            type="button"
                                            onClick={() => setConfirmModal({ open: true, app, loading: false })}
                                            className="px-3.5 py-2 rounded-full border border-error/30 text-error hover:bg-error hover:text-white font-label-sm text-label-sm transition-all whitespace-nowrap flex items-center gap-1.5 shadow-sm active:scale-95"
                                            title={ar ? 'إلغاء التسجيل في هذه الفعالية' : 'Cancel registration for this event'}
                                        >
                                            <span className="material-symbols-outlined text-[16px]">cancel</span>
                                            <span>{ar ? 'إلغاء التسجيل' : 'Cancel'}</span>
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

            {/* Cancel Confirmation Modal */}
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
