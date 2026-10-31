import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import AppPageHead from '../../components/app/AppPageHead'
import { clearSession } from '../../services/api.js'
import { useOrgPageControls } from './useOrgPageControls.js'
import LangToggleBtn from '../../components/org/LangToggleBtn'
import { useLanguage } from '../../hooks/useLanguage'
import { STATUS_BADGE, formatDeadline, getDisplayName, getDisplayMeta, loadAllOpportunities, deleteOpportunity, DRAFT_KEY } from './org-opportunities-data.js'
import '../../styles/org/sidebar.css'
import OrgSidebar, { OrgMobileHeader } from '../../components/org/OrgSidebar'
import CreateEventLink from '../../components/org/CreateEventLink'
import '../../styles/admin/admin.css'
import '../../styles/org/org-dashboard.css'
import '../../styles/org/org-opportunities.css'

const FILTER_TABS = [
    { key: 'all',      label: 'All',      labelAr: 'الكل' },
    { key: 'live',     label: 'Live',     labelAr: 'مباشر' },
    { key: 'upcoming', label: 'Upcoming', labelAr: 'قادم' },
    { key: 'pending',  label: 'Pending',  labelAr: 'معلق' },
    { key: 'ended',    label: 'Ended',    labelAr: 'منتهي' },
    { key: 'rejected', label: 'Rejected', labelAr: 'مرفوض' },
]

const KPI_FILTERS = [
    { key: 'live',     label: 'Live',     labelAr: 'مباشر',  icon: 'play_circle' },
    { key: 'upcoming', label: 'Upcoming', labelAr: 'قادم',   icon: 'event_upcoming' },
    { key: 'pending',  label: 'Pending',  labelAr: 'معلق',   icon: 'hourglass_top' },
    { key: 'ended',    label: 'Ended',    labelAr: 'منتهي',  icon: 'task_alt' },
    { key: 'rejected', label: 'Rejected', labelAr: 'مرفوض',  icon: 'cancel' },
]

function AnimatedNumber({ value, duration = 650 }) {
    const [displayVal, setDisplayVal] = useState(0)
    const startValRef = useRef(0)

    useEffect(() => {
        let startTime = null
        const startVal = startValRef.current
        const targetVal = Number(value) || 0

        if (startVal === targetVal) return

        let animationFrameId

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            // easeOutCubic curve for smooth decelerating count
            const ease = 1 - Math.pow(1 - progress, 3)
            const nextVal = Math.round(startVal + (targetVal - startVal) * ease)
            setDisplayVal(nextVal)
            startValRef.current = nextVal

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(step)
            }
        }

        animationFrameId = requestAnimationFrame(step)
        return () => cancelAnimationFrame(animationFrameId)
    }, [value, duration])

    return <span>{displayVal}</span>
}

export default function OrgOpportunities() {
    useOrgPageControls()
    const { isRtl } = useLanguage()

    const [opportunities, setOpportunities] = useState(() => loadAllOpportunities())
    const [activeFilter, setActiveFilter] = useState('all')
    const [search, setSearch] = useState('')
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' })

    function handleDelete() {
        deleteOpportunity(deleteModal.id)
        setOpportunities(loadAllOpportunities())
        setDeleteModal({ open: false, id: null, name: '' })
    }

    // مسودة إنشاء فعالية غير مكتملة (إنشاء جديد فقط، ما إلها علاقة بالتعديل) — مسودة وحدة بكل وقت
    const [draft, setDraft] = useState(() => {
        try {
            const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null')
            return d && d.title ? d : null
        } catch {
            return null
        }
    })
    function discardDraft() {
        try { localStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ }
        setDraft(null)
    }

    // بعد "حفظ وإعادة الإرسال" من صفحة التعديل نُبرز صف الفرصة المُعاد إرسالها
    const location = useLocation()
    const [pulseId, setPulseId] = useState(() => location.state?.resubmittedId || null)
    useEffect(() => {
        if (!pulseId) return
        const timer = setTimeout(() => setPulseId(null), 2000)
        return () => clearTimeout(timer)
    }, [pulseId])

    const counts = {
        all:      opportunities.length,
        live:     opportunities.filter(o => o.status === 'live').length,
        upcoming: opportunities.filter(o => o.status === 'upcoming').length,
        pending:  opportunities.filter(o => o.status === 'pending').length,
        ended:    opportunities.filter(o => o.status === 'ended').length,
        rejected: opportunities.filter(o => o.status === 'rejected').length,
    }

    const visible = opportunities.filter(o => {
        if (activeFilter !== 'all' && o.status !== activeFilter) return false
        if (search) {
            const q = search.toLowerCase()
            const nameEn = getDisplayName(o, false).toLowerCase()
            const nameAr = getDisplayName(o, true).toLowerCase()
            const metaEn = getDisplayMeta(o, false).toLowerCase()
            const metaAr = getDisplayMeta(o, true).toLowerCase()
            return nameEn.includes(q) || nameAr.includes(q) || metaEn.includes(q) || metaAr.includes(q)
        }
        return true
    })

    function handleKpiClick(key) {
        setActiveFilter(f => f === key ? 'all' : key)
    }

    return (
        <>
            <AppPageHead title={isRtl ? 'فرصي وفعالياتي | EVENTIFY' : 'My Opportunities | EVENTIFY'} />
            <OrgMobileHeader />
            <div className="flex min-h-screen">
                <OrgSidebar />
                <main className="flex-1 w-full px-4 md:px-10 pt-6 pb-24 lg:pb-8">
                    <div className="org-topbar">
                        <h1 className="org-topbar__title">{isRtl ? 'فرصي وفعالياتي' : 'My Opportunities'}</h1>
                        <div className="org-topbar__right">
                            <div className="org-dropdown">
                                <button className="icon-btn" id="org-notif-toggle" type="button" aria-label={isRtl ? 'الإشعارات (3 غير مقروءة)' : 'Notifications (3 unread)'} aria-expanded="false">
                                    <span className="material-symbols-outlined">notifications</span>
                                    <span className="icon-btn__dot" />
                                </button>
                                <div className="org-dropdown__panel org-dropdown__panel--notif" id="org-notif-panel" hidden role="menu" aria-label={isRtl ? 'الإشعارات' : 'Notifications'}>
                                    <div className="flex items-center justify-between px-3 py-2 border-b border-outline-variant/40 mb-1">
                                        <span className="font-semibold text-xs text-on-surface">{isRtl ? 'الإشعارات' : 'Notifications'}</span>
                                        <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{isRtl ? '3 جديدة' : '3 unread'}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <Link className="org-dropdown__item" to="/org/applicants">
                                            <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--surface-2)", color: "var(--accent)" }}>
                                                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">person_add</span>
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="block font-medium text-xs leading-snug">
                                                    {isRtl ? 'أحمد علي قدّم على تحدي الابتكار العالمي للذكاء الاصطناعي' : 'Ahmed Ali applied to Global AI Innovation Challenge'}
                                                </span>
                                                <span className="org-dropdown__meta">{isRtl ? 'منذ ساعتين' : '2 hours ago'}</span>
                                            </span>
                                        </Link>
                                        <Link className="org-dropdown__item" to="/org/opportunities">
                                            <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--surface-2)", color: "var(--accent)" }}>
                                                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">hourglass_top</span>
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="block font-medium text-xs leading-snug">
                                                    {isRtl ? 'دورة ديف أوبس الاحترافية بانتظار الاعتماد' : 'DevOps Masterclass is awaiting approval'}
                                                </span>
                                                <span className="org-dropdown__meta">{isRtl ? 'أمس' : 'Yesterday'}</span>
                                            </span>
                                        </Link>
                                        <Link className="org-dropdown__item" to="/org/applicants">
                                            <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--surface-2)", color: "var(--accent)" }}>
                                                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">star</span>
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="block font-medium text-xs leading-snug">
                                                    {isRtl ? 'معالجو الواجهة الأمامية تلقى تقييم 5 نجوم' : 'Frontend Wizards received a new 5-star rating'}
                                                </span>
                                                <span className="org-dropdown__meta">{isRtl ? 'منذ يومين' : '2 days ago'}</span>
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="pt-2 mt-1 border-t border-outline-variant/40">
                                        <Link to="/org/applicants" className="block text-center text-xs font-semibold text-primary hover:underline py-1">
                                            {isRtl ? 'عرض كل النشاطات ←' : 'View all activity →'}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <LangToggleBtn />
                            <button className="theme-toggle icon-btn" type="button" title={isRtl ? 'تبديل المظهر' : 'Switch theme'} aria-label={isRtl ? 'تبديل المظهر' : 'Switch theme'}>
                                <span className="material-symbols-outlined icon-dark">dark_mode</span><span className="material-symbols-outlined icon-light">light_mode</span>
                            </button>
                            <div className="org-dropdown">
                                <button className="dash-profile" id="org-profile-toggle" type="button" aria-label={isRtl ? 'قائمة المنظمة' : 'Organization menu'} aria-expanded="false">
                                    <span className="dash-profile__avatar">TG</span>
                                    <span style={{ fontSize: 13, fontWeight: 600 }}>{isRtl ? 'مختبرات تيك جينيوس' : 'TechGenius Labs'}</span>
                                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: "var(--text-muted)" }}>expand_more</span>
                                </button>
                                <div className="org-dropdown__panel org-dropdown__panel--profile" id="org-profile-panel" hidden role="menu" aria-label={isRtl ? 'قائمة المنظمة' : 'Organization menu'}>
                                    <div className="px-3 py-2 border-b border-outline-variant/40 mb-1">
                                        <p className="font-semibold text-xs text-on-surface">{isRtl ? 'مختبرات تيك جينيوس' : 'TechGenius Labs'}</p>
                                        <p className="text-[11px] text-on-surface-variant truncate">{isRtl ? 'منظمة موثقة منذ 2024' : 'Verified organizer since 2024'}</p>
                                    </div>
                                    <Link className="org-dropdown__item" to="/org/profile">
                                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant" aria-hidden="true">apartment</span>
                                        <span>{isRtl ? 'ملف المنظمة' : 'Organization Profile'}</span>
                                    </Link>
                                    <Link className="org-dropdown__item" to="/org/settings">
                                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant" aria-hidden="true">settings</span>
                                        <span>{isRtl ? 'الإعدادات' : 'Settings'}</span>
                                    </Link>
                                    <div className="my-1 border-t border-outline-variant/40" />
                                    <Link className="org-dropdown__item text-error hover:bg-error/10" to="/auth/login" onClick={clearSession}>
                                        <span className="material-symbols-outlined text-[18px] text-error" aria-hidden="true">logout</span>
                                        <span className="text-error font-medium">{isRtl ? 'تسجيل الخروج' : 'Sign out'}</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="org-page-header">
                        <div className="flex items-center gap-2 text-sm mb-2 flex-wrap">
                            <Link className="text-on-surface-variant hover:text-primary transition-colors" to="/org/dashboard">
                                {isRtl ? 'لوحة التحكم' : 'Dashboard'}
                            </Link>
                            <span className="text-outline">/</span>
                            <span className="font-semibold text-on-surface">
                                {isRtl ? 'فرصي وفعالياتي' : 'My Opportunities'}
                            </span>
                        </div>
                        <p className="profile-page-desc">
                            {isRtl
                                ? 'تتبع مسوداتك وطلبات الاعتماد والفعاليات المباشرة والمنتهية.'
                                : 'Track every draft, submission, approval, and ended opportunity.'}
                        </p>
                        <div className="org-page-header__actions">
                            <CreateEventLink className="btn-primary">
                                <span className="material-symbols-outlined" style={{ fontSize: 18, verticalAlign: "middle" }}>add</span>
                                {isRtl ? 'إنشاء حدث' : 'Create opportunity'}
                            </CreateEventLink>
                        </div>
                    </div>

                    {/* Draft Banner: unfinished "create opportunity" draft, saved to this device only */}
                    {draft && (
                        <div className="draft-banner" role="status">
                            <div className="draft-banner__icon">
                                <span className="material-symbols-outlined" aria-hidden="true">draft</span>
                            </div>
                            <div className="draft-banner__body">
                                <p className="draft-banner__title">
                                    {isRtl ? 'لديك مسودة فعالية غير مكتملة' : 'You have an unfinished opportunity draft'}
                                </p>
                                <p className="draft-banner__desc">{draft.title}</p>
                            </div>
                            <div className="draft-banner__actions">
                                <Link className="btn-primary" to="/org/create-event">
                                    {isRtl ? 'متابعة' : 'Continue'}
                                </Link>
                                <button type="button" className="btn-secondary" onClick={discardDraft}>
                                    {isRtl ? 'حذف' : 'Discard'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* KPI Cards */}
                    <div className="opp-stat-grid" aria-label="Opportunities status summary">
                        {KPI_FILTERS.map(({ key, label, labelAr, icon }) => (
                            <button
                                key={key}
                                type="button"
                                className={`stat-card${activeFilter === key ? ' stat-card--active' : ''}`}
                                title={`Filter by ${label} opportunities`}
                                onClick={() => handleKpiClick(key)}
                            >
                                <div className="stat-card__top">
                                    <span className="stat-card__label">{isRtl ? labelAr : label}</span>
                                    <span className="stat-card__icon">
                                        <span className="material-symbols-outlined" aria-hidden="true">{icon}</span>
                                    </span>
                                </div>
                                <p className="stat-card__value"><AnimatedNumber value={counts[key]} /></p>
                            </button>
                        ))}
                    </div>

                    {/* Filter + Search */}
                    <div className="opp-controls">
                        <div className="opp-filter-tabs" role="group" aria-label="Filter opportunities by status">
                            {FILTER_TABS.map(tab => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    className="opp-filter-btn"
                                    aria-pressed={activeFilter === tab.key}
                                    onClick={() => setActiveFilter(tab.key)}
                                >
                                    {isRtl ? tab.labelAr : tab.label}{' '}
                                    <span className="filter-count"><AnimatedNumber value={counts[tab.key] ?? counts.all} duration={400} /></span>
                                </button>
                            ))}
                        </div>
                        <div className="opp-search">
                            <span className="material-symbols-outlined" aria-hidden="true">search</span>
                            <input
                                type="search"
                                placeholder={isRtl ? 'البحث في الفعاليات...' : 'Search opportunities...'}
                                aria-label="Search opportunities by name or category"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            {search && (
                                <button type="button" className="opp-search-clear" aria-label="Clear search" onClick={() => setSearch('')}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Table */}
                    <section className="opp-panel">
                        {visible.length > 0 ? (
                            <div className="table-scroll">
                                <table className="opp-table">
                                    <caption className="sr-only">List of your organization's opportunities</caption>
                                    <thead>
                                        <tr>
                                            <th>{isRtl ? 'الفعالية' : 'Opportunity'}</th>
                                            <th>{isRtl ? 'الحالة' : 'Status'}</th>
                                            <th>{isRtl ? 'الموعد النهائي' : 'Deadline'}</th>
                                            <th>{isRtl ? 'المتقدمون' : 'Applicants'}</th>
                                            <th style={{ textAlign: isRtl ? 'left' : 'right' }}>{isRtl ? 'الإجراءات' : 'Actions'}</th>
                                        </tr>
                                    </thead>
                                    <tbody key={activeFilter + (search ? '-search' : '')} className="fade-in">
                                        {visible.map((opp, index) => {
                                            const badge = STATUS_BADGE[opp.status]
                                            const isEnded = opp.status === 'ended'
                                            const isRejected = opp.status === 'rejected'
                                            const isPending = opp.status === 'pending'
                                            const isUnpublished = ['pending', 'draft', 'rejected'].includes(opp.status)
                                            const rejectionText = isRtl && opp.rejectionReasonAr ? opp.rejectionReasonAr : opp.rejectionReason
                                            const isPulsing = pulseId === opp.id

                                            return (
                                                <tr
                                                    key={opp.id}
                                                    data-status={opp.status}
                                                    style={{ '--stagger-idx': index }}
                                                    className={`row-animated transition-all ${isRejected ? 'bg-red-50/30 dark:bg-red-950/15' : ''} ${isPulsing ? 'row-resubmitted-pulse' : ''}`}
                                                >
                                                    <td>
                                                        <div className="opp-entity">
                                                            <div className="flex-1 min-w-0">
                                                                <p className="opp-entity__name font-semibold text-on-surface">
                                                                    {getDisplayName(opp, isRtl)}
                                                                </p>
                                                                <p className="opp-entity__meta text-xs text-on-surface-variant">
                                                                    {getDisplayMeta(opp, isRtl)}
                                                                </p>

                                                                {/* Visual Callout for Rejection Reason */}
                                                                {isRejected && rejectionText && (
                                                                    <div className="mt-2.5 flex items-start gap-2 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs">
                                                                        <span className="material-symbols-outlined text-[17px] text-red-600 dark:text-red-400 shrink-0 mt-0.5" aria-hidden="true">
                                                                            cancel
                                                                        </span>
                                                                        <div className="leading-snug">
                                                                            <span className="font-bold text-red-800 dark:text-red-200">
                                                                                {isRtl ? 'سبب الرفض: ' : 'Reason for rejection: '}
                                                                            </span>
                                                                            <span>{rejectionText}</span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={badge ? badge.cls : 'badge'}>
                                                            {badge ? (isRtl && badge.labelAr ? badge.labelAr : badge.label) : opp.status}
                                                        </span>
                                                    </td>
                                                    <td className="mono whitespace-nowrap">{formatDeadline(opp.deadline, isRtl)}</td>
                                                    <td className="whitespace-nowrap">
                                                        {isUnpublished ? (
                                                            <span className="mono text-on-surface-variant/70 font-semibold select-none text-base leading-none" title={isRtl ? 'غير منشورة بعد' : 'Not published yet'}>—</span>
                                                        ) : (
                                                            <><span className="mono">{opp.applicants}</span> {isRtl ? 'متقدم' : 'applicants'}</>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div className="org-row-actions">
                                                            {isRejected ? (
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <Link
                                                                        to={`/org/edit-opportunity/${opp.id}`}
                                                                        aria-label={`Edit ${opp.name}`}
                                                                        className="org-action--primary"
                                                                    >
                                                                        {isRtl ? 'تعديل وإرفاق' : 'Edit & Fix'}
                                                                    </Link>
                                                                </div>
                                                            ) : isUnpublished ? (
                                                                /* Pending / Unpublished events: Hide Applicants button completely, show only Edit (+ Delete for pending, no applicants yet) */
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <Link to={`/org/edit-opportunity/${opp.id}`} aria-label={`Edit ${opp.name}`} className="org-action--primary">
                                                                        {isRtl ? 'تعديل' : 'Edit'}
                                                                    </Link>
                                                                    {isPending && (
                                                                        <button
                                                                            type="button"
                                                                            className="org-action--danger"
                                                                            aria-label={`Delete ${opp.name}`}
                                                                            onClick={() => setDeleteModal({ open: true, id: opp.id, name: getDisplayName(opp, isRtl) })}
                                                                        >
                                                                            {isRtl ? 'حذف' : 'Delete'}
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ) : isEnded ? (
                                                                /* الفعالية منتهية رسمياً: الإجراء الأساسي الوحيد هو عرض التقرير النهائي */
                                                                <Link to={`/org/report-center?event=${opp.id}`} className="org-action--primary" aria-label={`View report for ${opp.name}`}>
                                                                    {isRtl ? 'عرض التقرير' : 'View report'}
                                                                </Link>
                                                            ) : (
                                                                /* Accepted live / upcoming events */
                                                                <>
                                                                    <Link to={`/org/applicants?event=${opp.id}`} className="org-action--primary" aria-label={`View applicants for ${opp.name}`}>
                                                                        {isRtl ? 'المتقدمون' : 'Applicants'}
                                                                    </Link>
                                                                    <Link to={`/org/edit-opportunity/${opp.id}`} aria-label={`Edit ${opp.name}`}>
                                                                        {isRtl ? 'تعديل' : 'Edit'}
                                                                    </Link>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="opp-empty">
                                <div className="opp-empty__icon">
                                    <span className="material-symbols-outlined" style={{ fontSize: 26 }} aria-hidden="true">search_off</span>
                                </div>
                                <h3 className="opp-empty__title">{isRtl ? 'لم يتم العثور على أي فعاليات' : 'No opportunities found'}</h3>
                                <p className="opp-empty__desc">
                                    {isRtl
                                        ? 'لا توجد فعاليات تطابق الفلتر أو معايير البحث الحالية.'
                                        : 'No opportunities match your current filter or search criteria.'}
                                </p>
                                <button type="button" className="btn-secondary mt-2" onClick={() => { setActiveFilter('all'); setSearch('') }}>
                                    {isRtl ? 'إعادة ضبط الفلاتر' : 'Clear filters'}
                                </button>
                            </div>
                        )}
                    </section>
                </main>
            </div>

            {/* Delete Confirm Modal (pending opportunities only — no real applicants to lose) */}
            {deleteModal.open && createPortal(
                <div
                    className="flex items-center justify-center p-4 fade-in"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 60,
                        background: 'rgba(14, 17, 22, 0.45)',
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)',
                    }}
                    onClick={e => { if (e.target === e.currentTarget) setDeleteModal({ open: false, id: null, name: '' }) }}
                >
                    <div className="confirm-dialog fade-in-up" style={{ position: 'static', margin: 0 }}>
                        <h3>{isRtl ? 'هل أنت متأكد من حذف هذه الفرصة؟' : 'Are you sure you want to delete this opportunity?'}</h3>
                        <p>{deleteModal.name}</p>
                        <div className="confirm-dialog__actions">
                            <button type="button" className="btn-secondary" onClick={() => setDeleteModal({ open: false, id: null, name: '' })}>
                                {isRtl ? 'إلغاء' : 'Cancel'}
                            </button>
                            <button type="button" className="btn-primary" style={{ background: 'var(--error, #B3261E)' }} onClick={handleDelete}>
                                {isRtl ? 'حذف الفرصة' : 'Delete Opportunity'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Mobile Navigation Drawer */}
            </>
    )
}
