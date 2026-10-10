import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppPageHead from '../../components/app/AppPageHead'
import { useAdminPageControls } from './useAdminPageControls.js'
import AdminSidebar, { AdminMobileHeader } from '../../components/admin/AdminSidebar'
import LangToggleBtn from '../../components/org/LangToggleBtn'
import { useLanguage } from '../../hooks/useLanguage'
import { toast } from '../../utils/toast'
import '../../styles/admin/admin.css'

const INITIAL_EVENTS = [
    {
        id: 'evt-1',
        title: 'DevOps Masterclass',
        category: 'Course',
        organizer: 'TechGenius Labs',
        submitted: 'Submitted 2 hours ago',
        submittedAr: 'تم التقديم منذ ساعتين',
        description: 'A hands-on cloud lab covering CI/CD, Kubernetes, and infrastructure as code over 6 weeks.',
        descriptionAr: 'مختبر سحابي عملي يغطي CI/CD وKubernetes والبنية التحتية ككود على مدار 6 أسابيع.',
        status: 'pending',
    },
    {
        id: 'evt-2',
        title: 'Quantum Computing Bootcamp',
        category: 'Workshop',
        organizer: 'University of Technology',
        submitted: 'Submitted yesterday',
        submittedAr: 'تم التقديم بالأمس',
        description: 'An intensive 3-day introduction to quantum algorithms for advanced undergraduate students.',
        descriptionAr: 'مقدمة مكثفة مدتها 3 أيام لخوارزميات الحوسبة الكمية لطلاب البكالوريوس المتقدمين.',
        status: 'pending',
    },
    {
        id: 'evt-3',
        title: 'Product Design Sprint',
        category: 'Competition',
        organizer: 'DesignHub Amman',
        submitted: 'Submitted 3 days ago',
        submittedAr: 'تم التقديم منذ 3 أيام',
        description: 'Teams of 2-4 compete to redesign a real fintech product in 48 hours, judged by industry mentors.',
        descriptionAr: 'تتنافس فرق من 2 إلى 4 أعضاء لإعادة تصميم منتج حقيقي في التكنولوجيا المالية خلال 48 ساعة.',
        status: 'pending',
    },
    {
        id: 'evt-4',
        title: 'Future of AI Summit',
        category: 'Conference',
        organizer: 'TechGenius Labs',
        submitted: 'Submitted 5 hours ago',
        submittedAr: 'تم التقديم منذ 5 ساعات',
        description: 'A one-day conference with keynote talks and panels on applied AI, open to students and industry professionals.',
        descriptionAr: 'مؤتمر ليوم واحد يضم كلمات رئيسية وحلقات نقاشية حول الذكاء الاصطناعي التطبيقي.',
        status: 'pending',
    },
]

export default function AdminEvents() {
    useAdminPageControls()
    const { language } = useLanguage()
    const ar = language === 'ar'

    const [events, setEvents] = useState(INITIAL_EVENTS)
    const [rejectModalOpen, setRejectModalOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [rejectionReason, setRejectionReason] = useState('')

    const handleOpenRejectModal = (event) => {
        setSelectedEvent(event)
        setRejectionReason('')
        setRejectModalOpen(true)
    }

    const handleCloseRejectModal = () => {
        setRejectModalOpen(false)
        setSelectedEvent(null)
        setRejectionReason('')
    }

    const handleConfirmReject = () => {
        if (!rejectionReason.trim() || !selectedEvent) return

        executeReject(selectedEvent.id, rejectionReason.trim())
        handleCloseRejectModal()
    }

    const executeReject = (eventId, reason) => {
        setEvents((prev) =>
            prev.map((e) => {
                if (e.id === eventId) {
                    return { ...e, status: 'rejected', rejectionReason: reason }
                }
                return e
            }),
        )
        const eventItem = events.find((e) => e.id === eventId)
        toast(ar ? `تم رفض فعالية "${eventItem?.title}"` : `Event "${eventItem?.title}" rejected`, 'error')
        setTimeout(() => window.refreshEventsFilter?.(), 50)
    }

    const handleApprove = (eventId) => {
        setEvents((prev) =>
            prev.map((e) => {
                if (e.id === eventId) {
                    return { ...e, status: 'approved' }
                }
                return e
            }),
        )
        const eventItem = events.find((e) => e.id === eventId)
        toast(ar ? `تمت الموافقة على فعالية "${eventItem?.title}"` : `Event "${eventItem?.title}" approved`, 'success')
        setTimeout(() => window.refreshEventsFilter?.(), 50)
    }

    return (
        <>
            <AppPageHead title="Review Events | EVENTIFY" />
            <AdminMobileHeader />
            <div className="flex min-h-screen">
                <AdminSidebar />
                <main className="flex-1 w-full px-4 md:px-10 pt-6 pb-24 lg:pb-8">
                    {/* Global Top Header: page title (left) + global controls (right) */}
                    <div className="admin-topbar">
                        <h1 className="admin-topbar__title">Review Events</h1>
                        <div className="admin-topbar__right">
                            <div className="org-dropdown">
                                <button
                                    className="icon-btn"
                                    id="admin-notif-toggle"
                                    type="button"
                                    aria-label="Notifications (3 unread)"
                                    aria-expanded="false"
                                >
                                    <span className="material-symbols-outlined">notifications</span>
                                    <span className="icon-btn__dot" />
                                </button>
                                <div
                                    className="org-dropdown__panel org-dropdown__panel--notif"
                                    id="admin-notif-panel"
                                    hidden=""
                                    role="menu"
                                    aria-label="Notifications"
                                >
                                    <div className="flex items-center justify-between px-3 py-2 border-b border-outline-variant/40 mb-1">
                                        <span className="font-semibold text-xs text-on-surface">
                                            Notifications
                                        </span>
                                        <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                            3 unread
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <Link
                                            className="org-dropdown__item"
                                            to="/admin/verify-organizations"
                                        >
                                            <span
                                                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                                style={{
                                                    background: "var(--surface-2)",
                                                    color: "var(--accent)"
                                                }}
                                            >
                                                <span
                                                    className="material-symbols-outlined text-[18px]"
                                                    aria-hidden="true"
                                                >
                                                    verified
                                                </span>
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="block font-medium text-xs leading-snug">
                                                    DesignHub Amman is awaiting verification
                                                </span>
                                                <span className="org-dropdown__meta">1 hour ago</span>
                                            </span>
                                        </Link>
                                        <Link className="org-dropdown__item" to="/admin/reports">
                                            <span
                                                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                                style={{
                                                    background: "var(--surface-2)",
                                                    color: "var(--accent)"
                                                }}
                                            >
                                                <span
                                                    className="material-symbols-outlined text-[18px]"
                                                    aria-hidden="true"
                                                >
                                                    flag
                                                </span>
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="block font-medium text-xs leading-snug">
                                                    New report filed on "Cloud Native Bootcamp"
                                                </span>
                                                <span className="org-dropdown__meta">3 hours ago</span>
                                            </span>
                                        </Link>
                                        <Link className="org-dropdown__item" to="/admin/audit-log">
                                            <span
                                                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                                style={{
                                                    background: "var(--surface-2)",
                                                    color: "var(--accent)"
                                                }}
                                            >
                                                <span
                                                    className="material-symbols-outlined text-[18px]"
                                                    aria-hidden="true"
                                                >
                                                    gpp_maybe
                                                </span>
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="block font-medium text-xs leading-snug">
                                                    Sensitive operation: account suspended by Sara Al-Khatib
                                                </span>
                                                <span className="org-dropdown__meta">Yesterday</span>
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="pt-2 mt-1 border-t border-outline-variant/40">
                                        <Link
                                            to="/admin/audit-log"
                                            className="block text-center text-xs font-semibold text-primary hover:underline py-1"
                                        >
                                            View all activity →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <LangToggleBtn />
                            <button
                                className="theme-toggle icon-btn"
                                type="button"
                                title="Switch theme"
                                aria-label="Switch theme"
                            >
                                <span className="material-symbols-outlined">dark_mode</span>
                            </button>
                            <div className="org-dropdown">
                                <button
                                    className="dash-profile"
                                    id="admin-profile-toggle"
                                    type="button"
                                    aria-label="Admin menu"
                                    aria-expanded="false"
                                    style={{ cursor: "pointer" }}
                                >
                                    <span className="dash-profile__avatar">PA</span>
                                    <span style={{ fontSize: 13, fontWeight: 600 }}>
                                        Platform Admin
                                    </span>
                                    <span
                                        className="material-symbols-outlined"
                                        style={{ fontSize: 18, color: "var(--text-muted)" }}
                                    >
                                        expand_more
                                    </span>
                                </button>
                                <div
                                    className="org-dropdown__panel org-dropdown__panel--profile"
                                    id="admin-profile-panel"
                                    hidden=""
                                    role="menu"
                                    aria-label="Admin menu"
                                >
                                    <div className="px-3 py-2 border-b border-outline-variant/40 mb-1">
                                        <p className="font-semibold text-xs text-on-surface">
                                            Platform Admin
                                        </p>
                                        <p className="text-[11px] text-on-surface-variant truncate">
                                            Full access
                                        </p>
                                    </div>
                                    <Link
                                        className="org-dropdown__item text-error hover:bg-error/10"
                                        to="/auth/login"
                                    >
                                        <span
                                            className="material-symbols-outlined text-[18px] text-error"
                                            aria-hidden="true"
                                        >
                                            logout
                                        </span>
                                        <span className="text-error font-medium">Sign out</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <p className="text-on-surface-variant font-body-md mt-1">
                                Approve or reject events submitted by organizers before they go
                                live.
                            </p>
                        </div>
                    </div>
                    <div
                        className="flex flex-wrap gap-2 mb-6"
                        id="events-tab-group"
                        role="tablist"
                        aria-label="Filter events by status"
                    >
                        <button
                            type="button"
                            className="px-5 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md"
                            data-filter="pending"
                            aria-pressed="true"
                        >
                            Pending <span data-filter-count="">(3)</span>
                        </button>
                        <button
                            type="button"
                            className="px-5 py-2 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors font-label-md text-label-md"
                            data-filter="approved"
                            aria-pressed="false"
                        >
                            Approved <span data-filter-count="">(0)</span>
                        </button>
                        <button
                            type="button"
                            className="px-5 py-2 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors font-label-md text-label-md"
                            data-filter="rejected"
                            aria-pressed="false"
                        >
                            Rejected <span data-filter-count="">(0)</span>
                        </button>
                    </div>
                    <div className="section-card mb-4" id="events-category-banner" hidden="">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-on-surface-variant">
                                Showing events in category:{" "}
                                <strong
                                    className="text-on-surface"
                                    id="events-category-banner-name"
                                />
                            </p>
                            <Link className="btn-secondary" to="/admin/events">
                                Clear filter
                            </Link>
                        </div>
                    </div>
                    <div className="space-y-4" id="events-list">
                        {events.map((event, idx) => (
                            <div
                                key={event.id}
                                className="section-card row-animated transition-all duration-200"
                                style={{ '--stagger-idx': idx }}
                                data-status={event.status}
                                data-category={event.category}
                            >
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="event-content-body flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] uppercase tracking-wider text-secondary font-bold">
                                                {event.category}
                                            </span>
                                            {event.status === 'pending' && (
                                                <span className="badge badge--pending" data-status-badge="">
                                                    <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle', marginInlineEnd: 4 }}>schedule</span>
                                                    {ar ? 'قيد المراجعة' : 'Pending'}
                                                </span>
                                            )}
                                            {event.status === 'approved' && (
                                                <span className="badge badge--approved" data-status-badge="">
                                                    <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle', marginInlineEnd: 4 }}>check_circle</span>
                                                    {ar ? 'مقبول' : 'Approved'}
                                                </span>
                                            )}
                                            {event.status === 'rejected' && (
                                                <span className="badge badge--rejected" data-status-badge="">
                                                    <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle', marginInlineEnd: 4 }}>cancel</span>
                                                    {ar ? 'مرفوض' : 'Rejected'}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-title-lg text-title-lg text-on-surface mt-1">
                                            {event.title}
                                        </h3>
                                        <p className="font-label-md text-label-md text-on-surface-variant mt-1">
                                            {ar ? `بواسطة ${event.organizer} · ${event.submittedAr || event.submitted}` : `By ${event.organizer} · ${event.submitted}`}
                                        </p>
                                        <p className="font-body-md text-body-md text-on-surface-variant mt-3 max-w-2xl">
                                            {ar ? (event.descriptionAr || event.description) : event.description}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                                        <Link
                                            to="/admin/event-review-details"
                                            className="btn-secondary"
                                        >
                                            {ar ? 'عرض التفاصيل' : 'View Details'}
                                        </Link>
                                        {event.status === 'pending' ? (
                                            <>
                                                <button
                                                    type="button"
                                                    className="btn-success cursor-pointer"
                                                    onClick={() => handleApprove(event.id)}
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check</span>
                                                    <span>{ar ? 'قبول' : 'Approve'}</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-danger-outline cursor-pointer"
                                                    onClick={() => handleOpenRejectModal(event)}
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
                                                    <span>{ar ? 'رفض' : 'Reject'}</span>
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-xs text-on-surface-variant self-center font-medium px-3 py-1.5 rounded-lg bg-surface-container-low">
                                                {ar ? 'تم اتخاذ القرار' : 'Decision recorded'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="empty-state" id="events-empty" hidden="">
                            <span className="empty-state__icon">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    event_busy
                                </span>
                            </span>
                            <h3>{ar ? 'لا توجد فعاليات في هذه الحالة' : 'No events in this status'}</h3>
                            <p>{ar ? 'لا توجد أي فعاليات مطابقة لهذا الفلتر حالياً.' : 'No events match this filter right now.'}</p>
                        </div>
                    </div>

                    {/* Rejection Reason Modal (Tailwind CSS) */}
                    {rejectModalOpen && (
                        <div
                            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="reject-event-modal-title"
                            dir={ar ? 'rtl' : 'ltr'}
                            onClick={handleCloseRejectModal}
                        >
                            <div
                                className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 md:p-8 space-y-6 animate-in zoom-in-95 duration-200"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Modal Header */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 border border-red-100">
                                            <span className="material-symbols-outlined text-2xl">report_problem</span>
                                        </div>
                                        <div>
                                            <h3 id="reject-event-modal-title" className="text-lg md:text-xl font-bold text-gray-900">
                                                {ar ? 'سبب الرفض' : 'Rejection Reason'}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                {ar ? 'الفعالية: ' : 'Event: '}
                                                <strong className="text-gray-800 font-semibold">{selectedEvent?.title}</strong>
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleCloseRejectModal}
                                        className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                                        aria-label="Close modal"
                                    >
                                        <span className="material-symbols-outlined text-xl">close</span>
                                    </button>
                                </div>

                                {/* Modal Body: Required Textarea */}
                                <div className="space-y-2">
                                    <label htmlFor="event-rejection-reason" className="block text-sm font-semibold text-gray-700">
                                        {ar ? 'يرجى كتابة سبب رفض الفعالية' : 'Please provide a rejection reason'} <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="event-rejection-reason"
                                        rows={4}
                                        required
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        placeholder={
                                            ar
                                                ? 'اكتب سبب الرفض بالتفصيل هنا (مثال: محتوى الفعالية غير مكتمل، الموعد يتعارض، الشروط غير مستوفاة)...'
                                                : 'Provide the reason for rejecting this event (e.g. incomplete agenda, missing prerequisites, policy non-compliance)...'
                                        }
                                        className="w-full p-3.5 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 transition-all resize-none text-gray-800"
                                        autoFocus
                                    />
                                    <div className="flex justify-between items-center text-xs text-gray-400 px-1">
                                        <span>{ar ? 'حقل إلزامي لتوثيق سبب القرار' : 'Required to document the rejection decision'}</span>
                                        <span>{rejectionReason.trim().length} {ar ? 'حرف' : 'characters'}</span>
                                    </div>
                                </div>

                                {/* Modal Footer / Actions */}
                                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={handleCloseRejectModal}
                                        className="px-5 py-2.5 rounded-2xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                                    >
                                        {ar ? 'إلغاء' : 'Cancel'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleConfirmReject}
                                        disabled={!rejectionReason.trim()}
                                        className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                                            !rejectionReason.trim()
                                                ? 'bg-red-200 text-white cursor-not-allowed opacity-60'
                                                : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25 active:scale-95'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-lg">check</span>
                                        {ar ? 'تأكيد الرفض' : 'Confirm Reject'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    )
}
