import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import AppPageHead from '../../components/app/AppPageHead'
import { useOrgPageControls } from './useOrgPageControls.js'
import LangToggleBtn from '../../components/org/LangToggleBtn'
import { useLanguage } from '../../hooks/useLanguage'
import { toast } from '../../utils/toast'
import '../../styles/org/sidebar.css'
import OrgSidebar, { OrgMobileHeader } from '../../components/org/OrgSidebar'
import '../../styles/admin/admin.css'
import '../../styles/org/org-dashboard.css'
import '../../styles/org/org-opportunities.css'

const INITIAL_OPPORTUNITIES = [
    { 
        id: 'evt-1', 
        name: 'Global AI Innovation Challenge', 
        nameAr: 'تحدي الابتكار العالمي للذكاء الاصطناعي',
        meta: 'Hackathon · Remote · Teams of 2-4', 
        metaAr: 'هاكاثون · عن بعد · فرق من 2-4',
        status: 'live',     
        deadline: 'Oct 20, 2026', 
        applicants: 98,  
        primaryAction: 'applicants' 
    },
    { 
        id: 'evt-3', 
        name: 'Startup Challenge',              
        nameAr: 'تحدي الشركات الناشئة',
        meta: 'Competition · Entrepreneurship',         
        metaAr: 'مسابقة · ريادة أعمال',
        status: 'upcoming', 
        deadline: 'Nov 25, 2026', 
        applicants: 84,  
        primaryAction: 'applicants' 
    },
    { 
        id: 'evt-4', 
        name: 'DevOps Masterclass',             
        nameAr: 'دورة ديف أوبس الاحترافية',
        meta: 'Workshop · Online · Cloud Engineering',  
        metaAr: 'ورشة عمل · عبر الإنترنت · هندسة السحابة',
        status: 'pending',  
        deadline: 'Nov 3, 2026',  
        applicants: 0,  
        primaryAction: 'edit' 
    },
    { 
        id: 'evt-2', 
        name: 'Frontend Wizards',               
        nameAr: 'معسكر مبرمجي الواجهات الأمامية',
        meta: 'Hackathon · Web Development',            
        metaAr: 'هاكاثون · تطوير الويب',
        status: 'ended',    
        deadline: 'Closed',       
        applicants: 150, 
        primaryAction: 'report' 
    },
    { 
        id: 'evt-5', 
        name: 'Cloud Native Bootcamp',          
        nameAr: 'مخيم الحوسبة السحابية الأصلية',
        meta: 'Course · Infrastructure',                
        metaAr: 'دورة تدريبية · بنية تحتية',
        status: 'ended',    
        deadline: 'Closed',       
        applicants: 42,  
        primaryAction: 'report' 
    },
    { 
        id: 'evt-6', 
        name: 'Cybersecurity Defense Challenge',          
        nameAr: 'تحدي الدفاع السيبراني المتقدم',
        meta: 'Competition · In-person · Riyadh',                
        metaAr: 'مسابقة · حضورية · الرياض',
        status: 'rejected', 
        rejectionReason: 'Event agenda is missing the certified cybersecurity accreditation and detailed venue safety plan. Please attach the required approvals.',
        rejectionReasonAr: 'أجندة الفعالية تفتقر إلى الاعتماد الأكاديمي المطلوب وخطة السلامة للمقر الحضوري. يرجى إرفاق الموافقات اللازمة.',
        deadline: 'Dec 10, 2026',       
        applicants: 0,  
        primaryAction: 'resubmit' 
    },
]

const STATUS_BADGE = {
    live:     { cls: 'badge badge--active',    label: 'Live',             labelAr: 'مباشر' },
    pending:  { cls: 'badge badge--pending',   label: 'Pending Approval', labelAr: 'معلق' },
    upcoming: { cls: 'badge badge--upcoming',  label: 'Upcoming',         labelAr: 'قادم' },
    ended:    { cls: 'badge badge--completed', label: 'Ended',            labelAr: 'منتهي' },
    rejected: { cls: 'badge badge--rejected',  label: 'Rejected',         labelAr: 'مرفوض' },
}

const FILTER_TABS = [
    { key: 'all',      label: 'All',      labelAr: 'الكل' },
    { key: 'live',     label: 'Live',     labelAr: 'مباشر' },
    { key: 'upcoming', label: 'Upcoming', labelAr: 'قادم' },
    { key: 'pending',  label: 'Pending',  labelAr: 'معلق' },
    { key: 'ended',    label: 'Ended',    labelAr: 'منتهي' },
]

const KPI_FILTERS = [
    { key: 'live',     label: 'Live',     labelAr: 'مباشر',  icon: 'play_circle' },
    { key: 'upcoming', label: 'Upcoming', labelAr: 'قادم',   icon: 'event_upcoming' },
    { key: 'pending',  label: 'Pending',  labelAr: 'معلق',   icon: 'hourglass_top' },
    { key: 'ended',    label: 'Ended',    labelAr: 'منتهي',  icon: 'task_alt' },
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

    const [opportunities, setOpportunities] = useState(INITIAL_OPPORTUNITIES)
    const [activeFilter, setActiveFilter] = useState('all')
    const [search, setSearch] = useState('')
    const [animatingId, setAnimatingId] = useState(null)
    const [pulseId, setPulseId] = useState(null)

    const counts = {
        all:      opportunities.length,
        live:     opportunities.filter(o => o.status === 'live').length,
        upcoming: opportunities.filter(o => o.status === 'upcoming').length,
        pending:  opportunities.filter(o => o.status === 'pending').length,
        ended:    opportunities.filter(o => o.status === 'ended').length,
    }

    const visible = opportunities.filter(o => {
        // Rejected events only appear when activeFilter === 'all'
        if (activeFilter !== 'all' && o.status !== activeFilter) return false
        if (search) {
            const q = search.toLowerCase()
            const nameEn = o.name.toLowerCase()
            const nameAr = (o.nameAr || '').toLowerCase()
            const metaEn = o.meta.toLowerCase()
            const metaAr = (o.metaAr || '').toLowerCase()
            return nameEn.includes(q) || nameAr.includes(q) || metaEn.includes(q) || metaAr.includes(q)
        }
        return true
    })

    const handleResubmit = (oppId) => {
        if (animatingId) return
        setAnimatingId(oppId)

        setTimeout(() => {
            setOpportunities(prev => prev.map(opp => {
                if (opp.id === oppId) {
                    return {
                        ...opp,
                        status: 'pending',
                        rejectionReason: '',
                        rejectionReasonAr: '',
                    }
                }
                return opp
            }))

            setAnimatingId(null)
            setPulseId(oppId)

            toast(
                isRtl 
                    ? 'تم تحديث حالة الفعالية إلى "معلق" وإعادة إرسالها للمراجعة بنجاح' 
                    : 'Event resubmitted: status updated to "Pending" and submitted for approval',
                'success'
            )

            setTimeout(() => setPulseId(null), 2000)
        }, 320)
    }

    function handleKpiClick(key) {
        setActiveFilter(f => f === key ? 'all' : key)
    }

    return (
        <>
            <AppPageHead title="My Opportunities | EVENTIFY" />
            <OrgMobileHeader />
            <div className="flex min-h-screen">
                <OrgSidebar />
                <main className="flex-1 w-full px-4 md:px-10 pt-6 pb-24 lg:pb-8">
                    <div className="org-topbar">
                        <h1 className="org-topbar__title">My Opportunities</h1>
                        <div className="org-topbar__right">
                            <div className="org-dropdown">
                                <button className="icon-btn" id="org-notif-toggle" type="button" aria-label="Notifications (3 unread)" aria-expanded="false">
                                    <span className="material-symbols-outlined">notifications</span>
                                    <span className="icon-btn__dot" />
                                </button>
                                <div className="org-dropdown__panel org-dropdown__panel--notif" id="org-notif-panel" hidden role="menu" aria-label="Notifications">
                                    <div className="flex items-center justify-between px-3 py-2 border-b border-outline-variant/40 mb-1">
                                        <span className="font-semibold text-xs text-on-surface">Notifications</span>
                                        <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">3 unread</span>
                                    </div>
                                    <div className="space-y-1">
                                        <Link className="org-dropdown__item" to="/org/applicants">
                                            <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--surface-2)", color: "var(--accent)" }}>
                                                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">person_add</span>
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="block font-medium text-xs leading-snug">Ahmed Ali applied to Global AI Innovation Challenge</span>
                                                <span className="org-dropdown__meta">2 hours ago</span>
                                            </span>
                                        </Link>
                                        <Link className="org-dropdown__item" to="/org/opportunities">
                                            <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--surface-2)", color: "var(--accent)" }}>
                                                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">hourglass_top</span>
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="block font-medium text-xs leading-snug">DevOps Masterclass is awaiting approval</span>
                                                <span className="org-dropdown__meta">Yesterday</span>
                                            </span>
                                        </Link>
                                        <Link className="org-dropdown__item" to="/org/applicants">
                                            <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--surface-2)", color: "var(--accent)" }}>
                                                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">star</span>
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="block font-medium text-xs leading-snug">Frontend Wizards received a new 5-star rating</span>
                                                <span className="org-dropdown__meta">2 days ago</span>
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="pt-2 mt-1 border-t border-outline-variant/40">
                                        <Link to="/org/applicants" className="block text-center text-xs font-semibold text-primary hover:underline py-1">View all activity →</Link>
                                    </div>
                                </div>
                            </div>
                            <LangToggleBtn />
                            <button className="theme-toggle icon-btn" type="button" title="Switch theme" aria-label="Switch theme">
                                <span className="material-symbols-outlined">dark_mode</span>
                            </button>
                            <div className="org-dropdown">
                                <button className="dash-profile" id="org-profile-toggle" type="button" aria-label="Organization menu" aria-expanded="false">
                                    <span className="dash-profile__avatar">TG</span>
                                    <span style={{ fontSize: 13, fontWeight: 600 }}>TechGenius Labs</span>
                                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: "var(--text-muted)" }}>expand_more</span>
                                </button>
                                <div className="org-dropdown__panel org-dropdown__panel--profile" id="org-profile-panel" hidden role="menu" aria-label="Organization menu">
                                    <div className="px-3 py-2 border-b border-outline-variant/40 mb-1">
                                        <p className="font-semibold text-xs text-on-surface">TechGenius Labs</p>
                                        <p className="text-[11px] text-on-surface-variant truncate">Verified organizer since 2024</p>
                                    </div>
                                    <Link className="org-dropdown__item" to="/org/profile"><span className="material-symbols-outlined text-[18px] text-on-surface-variant" aria-hidden="true">apartment</span><span>Organization Profile</span></Link>
                                    <Link className="org-dropdown__item" to="/org/settings"><span className="material-symbols-outlined text-[18px] text-on-surface-variant" aria-hidden="true">settings</span><span>Settings</span></Link>
                                    <div className="my-1 border-t border-outline-variant/40" />
                                    <Link className="org-dropdown__item text-error hover:bg-error/10" to="/auth/login">
                                        <span className="material-symbols-outlined text-[18px] text-error" aria-hidden="true">logout</span>
                                        <span className="text-error font-medium">Sign out</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="org-page-header">
                        <div className="flex items-center gap-2 text-sm mb-2">
                            <Link className="text-on-surface-variant hover:text-primary transition-colors" to="/org/dashboard">Dashboard</Link>
                            <span className="text-outline">/</span>
                            <span className="font-semibold text-on-surface">My Opportunities</span>
                        </div>
                        <p className="profile-page-desc">Track every draft, submission, approval, and ended opportunity.</p>
                        <div className="org-page-header__actions">
                            <Link className="btn-primary" to="/org/create-event">
                                <span className="material-symbols-outlined" style={{ fontSize: 18, verticalAlign: "middle" }}>add</span>
                                Create opportunity
                            </Link>
                        </div>
                    </div>

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
                                    <tbody key={activeFilter + (search ? '-search' : '')}>
                                        {visible.map((opp, index) => {
                                            const badge = STATUS_BADGE[opp.status]
                                            const isEnded = opp.status === 'ended'
                                            const isRejected = opp.status === 'rejected'
                                            const isUnpublished = ['pending', 'draft', 'rejected'].includes(opp.status)
                                            const rejectionText = isRtl && opp.rejectionReasonAr ? opp.rejectionReasonAr : opp.rejectionReason
                                            const isResubmitting = animatingId === opp.id
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
                                                                    {isRtl && opp.nameAr ? opp.nameAr : opp.name}
                                                                </p>
                                                                <p className="opp-entity__meta text-xs text-on-surface-variant">
                                                                    {isRtl && opp.metaAr ? opp.metaAr : opp.meta}
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
                                                    <td className="mono whitespace-nowrap">{opp.deadline}</td>
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
                                                                <button
                                                                    type="button"
                                                                    disabled={isResubmitting}
                                                                    onClick={() => handleResubmit(opp.id)}
                                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white transition-all shadow-sm hover:shadow cursor-pointer ${isResubmitting ? 'opacity-75 scale-95' : ''}`}
                                                                    title={isRtl ? 'تعديل وإعادة إرسال الفعالية للمراجعة' : 'Edit & Resubmit event for approval'}
                                                                >
                                                                    <span className={`material-symbols-outlined text-[15px] ${isResubmitting ? 'icon-spin-fast' : ''}`} aria-hidden="true">
                                                                        published_with_changes
                                                                    </span>
                                                                    <span>{isResubmitting ? (isRtl ? 'جارِ الإرسال...' : 'Submitting...') : (isRtl ? 'تعديل وإعادة إرسال' : 'Edit & Resubmit')}</span>
                                                                </button>
                                                            ) : isUnpublished ? (
                                                                /* Pending / Unpublished events: Hide Applicants button completely, show only Edit */
                                                                <Link to="/org/create-event" aria-label={`Edit ${opp.name}`} className="org-action--primary">
                                                                    {isRtl ? 'تعديل' : 'Edit'}
                                                                </Link>
                                                            ) : isEnded ? (
                                                                <>
                                                                    <Link to={`/org/applicants?event=${opp.id}`} aria-label={`View applicants for ${opp.name}`}>
                                                                        {isRtl ? 'المتقدمون' : 'Applicants'}
                                                                    </Link>
                                                                    <Link to="/org/report-center" className="org-action--primary" aria-label={`View report for ${opp.name}`}>
                                                                        {isRtl ? 'عرض التقرير' : 'View report'}
                                                                    </Link>
                                                                </>
                                                            ) : (
                                                                /* Accepted live / upcoming events */
                                                                <>
                                                                    <Link to={`/org/applicants?event=${opp.id}`} className="org-action--primary" aria-label={`View applicants for ${opp.name}`}>
                                                                        {isRtl ? 'المتقدمون' : 'Applicants'}
                                                                    </Link>
                                                                    <Link to="/org/create-event" aria-label={`Edit ${opp.name}`}>
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
                                <h3 className="opp-empty__title">No opportunities found</h3>
                                <p className="opp-empty__desc">No opportunities match your current filter or search criteria.</p>
                                <button type="button" className="btn-secondary mt-2" onClick={() => { setActiveFilter('all'); setSearch('') }}>
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </section>
                </main>
            </div>

            {/* Mobile Navigation Drawer */}
            </>
    )
}
