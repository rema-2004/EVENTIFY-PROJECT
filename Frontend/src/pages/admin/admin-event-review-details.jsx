import { Link } from 'react-router-dom'
import AppPageHead from '../../components/app/AppPageHead'
import { useAdminPageControls } from './useAdminPageControls.js'
import AdminSidebar, { AdminMobileHeader } from '../../components/admin/AdminSidebar'
import LangToggleBtn from '../../components/org/LangToggleBtn'
import '../../styles/admin/admin.css'

export default function AdminEventReviewDetails() {
    useAdminPageControls()
    return (
        <>
            <AppPageHead title="Event Review Details | EVENTIFY" />
            <AdminMobileHeader />
            <div className="flex min-h-screen">
                <AdminSidebar />
                <main className="w-full flex-1 px-4 pt-6 pb-24 md:px-10 lg:pb-8">
                    {/* Global Top Header: page title (left) + global controls (right) */}
                    <div className="admin-topbar">
                        <h1 className="admin-topbar__title">Event Review Details</h1>
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
                    <div className="mb-6 flex items-center gap-2 text-label-md">
                        <Link
                            className="text-on-surface-variant hover:text-primary"
                            to="/admin/events"
                        >
                            Review Events
                        </Link>
                        <span className="text-outline">/</span>
                        <span>DevOps Masterclass</span>
                    </div>
                    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <p className="mt-1 text-on-surface-variant">
                                Validate content quality, organizer trust, dates, and publishing
                                readiness.
                            </p>
                        </div>
                        <div className="flex gap-3" data-review-container="">
                            <button type="button" className="btn-danger-outline" data-ui-action="reject">
                                Reject with reason
                            </button>
                            <button type="button" className="btn-success" data-ui-action="approve">
                                Approve publish
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <section className="section-card lg:col-span-2">
                            <div className="mb-6 flex flex-wrap items-center gap-2">
                                <span className="badge badge--pending">Pending approval</span>
                                <span className="rounded-full bg-primary/10 px-3 py-1 text-label-sm font-semibold text-primary">
                                    Course
                                </span>
                                <span className="rounded-full bg-surface-container px-3 py-1 text-label-sm font-semibold text-on-surface-variant">
                                    Online
                                </span>
                            </div>
                            <h2 className="text-headline-md font-semibold">DevOps Masterclass</h2>
                            <p className="mt-2 text-on-surface-variant">
                                A hands-on cloud lab covering CI/CD, Kubernetes, and infrastructure
                                as code over 6 weeks.
                            </p>
                            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="rounded-xl bg-surface-container-low p-4">
                                    <p className="text-label-sm font-semibold text-on-surface-variant">
                                        Organizer
                                    </p>
                                    <p className="font-semibold">TechGenius Labs</p>
                                </div>
                                <div className="rounded-xl bg-surface-container-low p-4">
                                    <p className="text-label-sm font-semibold text-on-surface-variant">
                                        Dates
                                    </p>
                                    <p className="font-semibold">Nov 12 - Dec 24, 2026</p>
                                </div>
                                <div className="rounded-xl bg-surface-container-low p-4">
                                    <p className="text-label-sm font-semibold text-on-surface-variant">
                                        Target audience
                                    </p>
                                    <p className="font-semibold">Students and junior developers</p>
                                </div>
                                <div className="rounded-xl bg-surface-container-low p-4">
                                    <p className="text-label-sm font-semibold text-on-surface-variant">
                                        Capacity
                                    </p>
                                    <p className="font-semibold">120 participants</p>
                                </div>
                            </div>
                            <div className="mt-8">
                                <h3 className="mb-4 text-title-lg font-semibold">Requirements</h3>
                                <ul className="space-y-2 text-on-surface-variant">
                                    <li>Basic Linux command-line knowledge.</li>
                                    <li>GitHub account and laptop with stable internet.</li>
                                    <li>Weekly attendance for live labs.</li>
                                </ul>
                            </div>
                        </section>
                        <aside className="space-y-6">
                            <section className="section-card">
                                <h3 className="mb-4 text-title-lg font-semibold">
                                    Review Checklist
                                </h3>
                                <div className="space-y-3 text-label-md">
                                    <p className="flex justify-between">
                                        <span>Verified organizer</span>
                                        <span className="text-success">Pass</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>Clear description</span>
                                        <span className="text-success">Pass</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>Valid dates</span>
                                        <span className="text-success">Pass</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>Policy risk</span>
                                        <span className="text-tertiary">Low</span>
                                    </p>
                                </div>
                            </section>
                            <section className="section-card">
                                <h3 className="mb-4 text-title-lg font-semibold">
                                    Rejection Reason
                                </h3>
                                <textarea
                                    className="h-36 w-full resize-none rounded-xl border-outline-variant bg-white p-4"
                                    placeholder="Write a clear reason if rejecting..."
                                    defaultValue={""}
                                />
                                <button
                                    type="button"
                                    className="btn-danger-outline"
                                    style={{ width: "100%", marginTop: 12 }}
                                >
                                    Send rejection
                                </button>
                            </section>
                        </aside>
                    </div>
                </main>
            </div>
        </>
    )
}
