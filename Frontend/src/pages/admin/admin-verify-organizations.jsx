import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppPageHead from '../../components/app/AppPageHead'
import { useAdminPageControls } from './useAdminPageControls.js'
import { useLanguage } from '../../hooks/useLanguage'
import { toast } from '../../utils/toast'
import AnimatedCounter from '../../components/shared/AnimatedCounter'
import AdminSidebar, { AdminMobileHeader } from '../../components/admin/AdminSidebar'
import LangToggleBtn from '../../components/org/LangToggleBtn'
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
    },
]

export default function AdminVerifyOrganizations() {
    useAdminPageControls()
    const { language } = useLanguage()
    const ar = language === 'ar'

    const [organizations, setOrganizations] = useState(INITIAL_ORGANIZATIONS)

    const handleReject = (orgId) => {
        setOrganizations((prev) =>
            prev.map((org) => {
                if (org.id === orgId) {
                    return { ...org, status: 'rejected' }
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
            <AdminMobileHeader />
            <div className="flex min-h-screen">
                <AdminSidebar />
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
                            <p className="stat-card__value"><AnimatedCounter value={pendingCount} /></p>
                            <p className="stat-card__label">Pending review</p>
                            <p className="stat-card__hint">On this page</p>
                        </div>
                        <div className="stat-card">
                            <p className="stat-card__value"><AnimatedCounter value={312 + acceptedCount} /></p>
                            <p className="stat-card__label">Verified organizations</p>
                            <p className="stat-card__hint">All time</p>
                        </div>
                        <div className="stat-card">
                            <p className="stat-card__value"><AnimatedCounter value={4 + rejectedCount} /></p>
                            <p className="stat-card__label">Rejected requests</p>
                            <p className="stat-card__hint">All time</p>
                        </div>
                    </div>
                    <section className="space-y-4">
                        {organizations.map((org, idx) => (
                            <article 
                                key={org.id} 
                                className="section-card row-animated transition-all duration-200"
                                style={{ '--stagger-idx': idx }}
                            >
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
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        {org.status === 'pending' ? (
                                            <>
                                                <button
                                                    type="button"
                                                    className="btn-danger-outline hover:bg-red-50 transition-colors cursor-pointer"
                                                    onClick={() => handleReject(org.id)}
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
                </main>
            </div>
            
        </>
    )
}
