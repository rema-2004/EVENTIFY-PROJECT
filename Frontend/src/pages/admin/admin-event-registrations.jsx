import { Link, useLocation, useParams } from 'react-router-dom'
import AppPageHead from '../../components/app/AppPageHead'
import { useAdminPageControls } from './useAdminPageControls.js'
import AdminSidebar, { AdminMobileHeader } from '../../components/admin/AdminSidebar'
import EventRegistrationsSection from '../../components/admin/EventRegistrationsSection'
import LangToggleBtn from '../../components/org/LangToggleBtn'
import { useLanguage } from '../../hooks/useLanguage'
import '../../styles/admin/admin.css'

// Registrations only exist once an event is approved and published, so this
// page is opened from approved events only (not from the review page).
export default function AdminEventRegistrations() {
    useAdminPageControls()
    const { eventId } = useParams()
    const { state } = useLocation()
    const { language } = useLanguage()
    const ar = language === 'ar'
    const eventTitle = state?.title ?? (ar ? 'الفعالية' : 'Event')

    return (
        <>
            <AppPageHead title="Event Registrations | EVENTIFY" />
            <AdminMobileHeader />
            <div className="flex min-h-screen">
                <AdminSidebar />
                <main className="w-full flex-1 px-4 pt-6 pb-24 md:px-10 lg:pb-8">
                    <div className="admin-topbar">
                        <h1 className="admin-topbar__title">{ar ? 'المسجّلون في الفعالية' : 'Event Registrations'}</h1>
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
                                <span className="material-symbols-outlined icon-dark">dark_mode</span><span className="material-symbols-outlined icon-light">light_mode</span>
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
                        <Link className="text-on-surface-variant hover:text-primary" to="/admin/events">
                            {ar ? 'مراجعة الفعاليات' : 'Review Events'}
                        </Link>
                        <span className="text-outline">/</span>
                        <span>{eventTitle}</span>
                    </div>
                    <EventRegistrationsSection eventId={eventId} />
                </main>
            </div>
        </>
    )
}
