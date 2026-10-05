import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppPageHead from '../../components/app/AppPageHead'
import { useAdminPageControls } from './useAdminPageControls.js'
import LangToggleBtn from '../../components/org/LangToggleBtn'
import { useLanguage } from '../../hooks/useLanguage'
import { toast } from '../../utils/toast'
import '../../styles/admin/admin.css'

const INITIAL_ORGANIZATIONS = [
    {
        id: 1,
        name: 'University of Technology',
        type: 'University · Amman · official domain verified · 2 documents attached',
        details: [
            { label: 'Domain email', value: 'valid' },
            { label: 'License', value: 'readable' },
            { label: 'Contact', value: 'dean.office@uot.edu' },
        ],
        status: 'pending',
        rejectionReason: '',
    },
    {
        id: 2,
        name: 'DesignHub Amman',
        type: 'Student club · portfolio site verified · missing official club letter',
        details: [
            { label: 'Domain email', value: 'valid' },
            { label: 'Club letter', value: 'missing' },
            { label: 'Past events', value: '5' },
        ],
        status: 'pending',
        rejectionReason: '',
    },
    {
        id: 3,
        name: 'Zain Innovation Campus',
        type: 'Corporate innovation hub · Amman · 3 documents attached',
        details: [
            { label: 'Domain email', value: 'valid' },
            { label: 'Commercial registration', value: 'attached' },
            { label: 'Contact', value: 'events@zain.jo' },
        ],
        status: 'pending',
        rejectionReason: '',
    },
    {
        id: 4,
        name: 'Cloud Native Academy',
        type: 'Tech training institute · Amman · e-learning platform verified · 1 document attached',
        details: [
            { label: 'Domain email', value: 'valid' },
            { label: 'Ministry letter', value: 'missing' },
            { label: 'Contact', value: 'info@cloudnative.jo' },
        ],
        status: 'pending',
        rejectionReason: '',
    },
]

export default function AdminVerifyOrganizations() {
    useAdminPageControls()
    const { language } = useLanguage()
    const ar = language === 'ar'

    const [organizations, setOrganizations] = useState(INITIAL_ORGANIZATIONS)
    const [rejectModalOpen, setRejectModalOpen] = useState(false)
    const [selectedOrg, setSelectedOrg] = useState(null)
    const [rejectionReason, setRejectionReason] = useState('')

    const handleOpenRejectModal = (org) => {
        setSelectedOrg(org)
        setRejectionReason('')
        setRejectModalOpen(true)
    }

    const handleCloseRejectModal = () => {
        setRejectModalOpen(false)
        setSelectedOrg(null)
        setRejectionReason('')
    }

    const handleConfirmReject = () => {
        if (!rejectionReason.trim() || !selectedOrg) return

        executeReject(selectedOrg.id, rejectionReason.trim())
        handleCloseRejectModal()
    }

    const executeReject = (orgId, reason) => {
        setOrganizations((prev) =>
            prev.map((org) => {
                if (org.id === orgId) {
                    return { ...org, status: 'rejected', rejectionReason: reason }
                }
                return org
            }),
        )
        const org = organizations.find((o) => o.id === orgId)
        toast(ar ? `تم رفض طلب "${org?.name}"` : `Application for "${org?.name}" rejected`, 'error')
    }

    const handleAccept = (orgId) => {
        setOrganizations((prev) =>
            prev.map((org) => {
                if (org.id === orgId) {
                    return { ...org, status: 'accepted' }
                }
                return org
            }),
        )
        const org = organizations.find((o) => o.id === orgId)
        toast(ar ? `تم قبول طلب "${org?.name}" بنجاح` : `Application for "${org?.name}" verified successfully`, 'success')
    }

    const pendingCount = organizations.filter((o) => o.status === 'pending').length
    const acceptedCount = organizations.filter((o) => o.status === 'accepted').length
    const rejectedCount = organizations.filter((o) => o.status === 'rejected').length
    return (
        <>
            <AppPageHead title="Verify Organizations | EVENTIFY" />
            <header className="lg:hidden glass-header sticky top-0 z-50 flex h-16 items-center justify-between px-4 shadow-sm">
                <Link className="flex items-center gap-2" to="/">
                    <span
                        className="material-symbols-outlined text-primary"
                        style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                        hub
                    </span>
                    <h1 className="text-headline-lg-mobile font-bold text-primary">
                        EVENTIFY
                    </h1>
                </Link>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <LangToggleBtn small />
                    <span className="admin-badge">Admin</span>
                    <button
                        className="mobile-hamburger"
                        id="admin-hamburger"
                        aria-label="Open navigation"
                        aria-expanded="false"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
                            menu
                        </span>
                    </button>
                </div>
            </header>
            <div className="flex min-h-screen">
                <aside className="admin-accent-sidebar glass-sidebar sticky top-0 z-50 hidden h-screen w-[280px] flex-col p-6 lg:flex">
                    <Link className="mb-2 flex items-center gap-3" to="/">
                        <span
                            className="material-symbols-outlined text-3xl text-primary"
                            style={{ fontVariationSettings: '"FILL" 1' }}
                        >
                            hub
                        </span>
                        <h1 className="text-headline-md font-bold text-primary">EVENTIFY</h1>
                    </Link>
                    <span className="admin-badge mb-8 w-fit">Admin console</span>
                    <nav className="flex flex-1 flex-col gap-1" aria-label="Admin sections">
                        <div className="nav-group">
                            <Link className="nav-link" to="/admin/dashboard">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    dashboard
                                </span>
                                Overview
                            </Link>
                            <Link className="nav-link" to="/admin/events">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    trophy
                                </span>
                                Competitions &amp; Events
                            </Link>
                            <Link className="nav-link" to="/admin/users">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    group
                                </span>
                                Participants
                            </Link>
                            <Link
                                className="nav-link"
                                to="/admin/verify-organizations"
                                aria-current="page"
                            >
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    verified
                                </span>
                                Organizations
                            </Link>
                            <Link className="nav-link" to="/admin/categories">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    category
                                </span>
                                Categories
                            </Link>
                            <Link className="nav-link" to="/admin/reports">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    flag
                                </span>
                                Reports
                            </Link>
                            <Link className="nav-link" to="/admin/audit-log">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    history
                                </span>
                                Audit log
                            </Link>
                        </div>
                    </nav>
                    <div className="mt-auto rounded-2xl bg-surface-container p-4">
                        <p className="mb-2 text-label-sm font-label-sm text-on-surface-variant">
                            SIGNED IN AS
                        </p>
                        <p className="mb-1 font-label-md text-label-md text-on-surface">
                            Platform Admin
                        </p>
                        <p
                            className="text-label-sm font-label-sm"
                            style={{ color: "var(--accent)", fontWeight: 600 }}
                        >
                            Full access
                        </p>
                    </div>
                </aside>
                <main className="w-full flex-1 px-4 pt-6 pb-8 md:px-10">
                    {/* Global Top Header: page title (left) + global controls (right) */}
                    <div className="admin-topbar">
                        <h1 className="admin-topbar__title">Verify Organizations</h1>
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
                    <div className="mb-8">
                        <p className="mt-1 text-on-surface-variant">
                            Organizations submitted these verification details when they created
                            their account. Review the documents, then accept or reject each
                            application.
                        </p>
                    </div>
                    <div className="stat-grid stat-grid--3 mb-6">
                        <div className="stat-card">
                            <p className="stat-card__value">{pendingCount}</p>
                            <p className="stat-card__label">Pending review</p>
                            <p className="stat-card__hint">On this page</p>
                        </div>
                        <div className="stat-card">
                            <p className="stat-card__value">{312 + acceptedCount}</p>
                            <p className="stat-card__label">Verified organizations</p>
                            <p className="stat-card__hint">All time</p>
                        </div>
                        <div className="stat-card">
                            <p className="stat-card__value">{4 + rejectedCount}</p>
                            <p className="stat-card__label">Rejected requests</p>
                            <p className="stat-card__hint">All time</p>
                        </div>
                    </div>
                    <section className="space-y-4">
                        {organizations.map((org) => (
                            <article key={org.id} className="section-card transition-all duration-200">
                                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                                    <div className="flex-1">
                                        <div className="mb-2 flex flex-wrap items-center gap-2">
                                            <h3 className="text-title-lg font-semibold">{org.name}</h3>
                                            {org.status === 'pending' && <span className="badge badge--pending">{ar ? 'قيد المراجعة' : 'Pending'}</span>}
                                            {org.status === 'accepted' && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
                                                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                                    {ar ? 'تم التحقق' : 'Verified'}
                                                </span>
                                            )}
                                            {org.status === 'rejected' && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 shadow-sm">
                                                    <span className="material-symbols-outlined text-[16px]">cancel</span>
                                                    {ar ? 'مرفوض' : 'Rejected'}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-on-surface-variant">{org.type}</p>
                                        <div className="mt-4 grid grid-cols-1 gap-3 text-label-md md:grid-cols-3">
                                            {org.details.map((detail, idx) => (
                                                <span key={idx} className="rounded-lg bg-surface-container-low p-3">
                                                    {detail.label}: {detail.value}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Rejection Reason Note if rejected */}
                                        {org.status === 'rejected' && org.rejectionReason && (
                                            <div className="mt-4 p-4 rounded-2xl bg-red-50/90 border border-red-200/80 text-sm text-red-900 animate-in fade-in duration-200">
                                                <div className="flex items-center gap-1.5 font-bold text-red-800 mb-1">
                                                    <span className="material-symbols-outlined text-lg">info</span>
                                                    {ar ? 'سبب الرفض:' : 'Rejection Reason:'}
                                                </div>
                                                <p className="text-red-700 leading-relaxed whitespace-pre-wrap">{org.rejectionReason}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        {org.status === 'pending' ? (
                                            <>
                                                <button
                                                    type="button"
                                                    className="btn-danger-outline hover:bg-red-50 transition-colors cursor-pointer"
                                                    onClick={() => handleOpenRejectModal(org)}
                                                >
                                                    Reject
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-success hover:brightness-105 transition-all cursor-pointer"
                                                    onClick={() => handleAccept(org.id)}
                                                >
                                                    Accept
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-xs text-on-surface-variant self-center font-medium px-3 py-1.5 rounded-lg bg-surface-container-low">
                                                {ar ? 'تم تسجيل القرار' : 'Decision recorded'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </section>

                    {/* Rejection Reason Modal */}
                    {rejectModalOpen && (
                        <div
                            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="reject-modal-title"
                            dir={ar ? 'rtl' : 'ltr'}
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
                                            <h3 id="reject-modal-title" className="text-lg md:text-xl font-bold text-gray-900">
                                                {ar ? 'سبب الرفض' : 'Rejection Reason'}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                {ar ? 'المنظمة: ' : 'Organization: '}
                                                <strong className="text-gray-800 font-semibold">{selectedOrg?.name}</strong>
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

                                {/* Modal Body: Textarea */}
                                <div className="space-y-2">
                                    <label htmlFor="rejection-reason" className="block text-sm font-semibold text-gray-700">
                                        {ar ? 'يرجى كتابة سبب الرفض' : 'Please provide a rejection reason'} <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="rejection-reason"
                                        rows={4}
                                        required
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        placeholder={
                                            ar
                                                ? 'اكتب سبب الرفض بالتفصيل هنا (مثال: الوثائق المرفقة غير واضحة، السجل التجاري منتهي الصلاحية، إلخ)...'
                                                : 'Provide the reason for rejecting this application (e.g. invalid documentation, expired business license, etc.)...'
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
            <div className="mobile-nav-overlay" id="admin-mobile-overlay" />
            <nav
                className="mobile-nav-drawer"
                id="admin-mobile-drawer"
                aria-label="Admin navigation"
            >
                <button
                    className="mobile-nav-close"
                    id="admin-nav-close"
                    aria-label="Close navigation"
                >
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                        close
                    </span>
                </button>
                <Link
                    to="/"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 4
                    }}
                >
                    <span
                        className="material-symbols-outlined"
                        style={{
                            fontSize: 28,
                            fontVariationSettings: '"FILL" 1',
                            color: "var(--accent)"
                        }}
                    >
                        hub
                    </span>
                    <span
                        style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            fontSize: 20,
                            color: "var(--accent)"
                        }}
                    >
                        EVENTIFY
                    </span>
                </Link>
                <span className="admin-badge">Admin console</span>
                <div className="nav-group" style={{ marginTop: 16 }}>
                    <Link className="nav-link" to="/admin/dashboard">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            dashboard
                        </span>
                        Overview
                    </Link>
                    <Link className="nav-link" to="/admin/events">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            trophy
                        </span>
                        Competitions &amp; Events
                    </Link>
                    <Link className="nav-link" to="/admin/users">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            group
                        </span>
                        Participants
                    </Link>
                    <Link className="nav-link" to="/admin/verify-organizations">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            verified
                        </span>
                        Organizations
                    </Link>
                    <Link className="nav-link" to="/admin/categories">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            category
                        </span>
                        Categories
                    </Link>
                    <Link className="nav-link" to="/admin/reports">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            flag
                        </span>
                        Reports
                    </Link>
                    <Link className="nav-link" to="/admin/audit-log">
                        <span className="material-symbols-outlined" aria-hidden="true">
                            history
                        </span>
                        Audit log
                    </Link>
                </div>
            </nav>
        </>
    )
}
