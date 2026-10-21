import { Link } from 'react-router-dom'
import LangToggleBtn from '../org/LangToggleBtn'

// Notifications shown in the bell dropdown (static until there's a notifications API).
const NOTIFICATIONS = [
    { to: '/admin/verify-organizations', icon: 'verified', text: 'DesignHub Amman is awaiting verification', time: '1 hour ago' },
    { to: '/admin/reports', icon: 'flag', text: 'New report filed on "Cloud Native Bootcamp"', time: '3 hours ago' },
    { to: '/admin/audit-log', icon: 'gpp_maybe', text: 'Sensitive operation: account suspended by Sara Al-Khatib', time: 'Yesterday' },
]

// Global admin header: page title (left) + notifications, language, theme
// and profile menu (right). The dropdowns are wired up by
// useAdminPageControls through the admin-notif-* / admin-profile-* ids.
export default function AdminTopbar({ title }) {
    return (
        <div className="admin-topbar">
            <h1 className="admin-topbar__title">{title}</h1>
            <div className="admin-topbar__right">
                <div className="org-dropdown">
                    <button
                        className="icon-btn"
                        id="admin-notif-toggle"
                        type="button"
                        aria-label={`Notifications (${NOTIFICATIONS.length} unread)`}
                        aria-expanded="false"
                    >
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="icon-btn__dot" />
                    </button>
                    <div
                        className="org-dropdown__panel org-dropdown__panel--notif"
                        id="admin-notif-panel"
                        hidden
                        role="menu"
                        aria-label="Notifications"
                    >
                        <div className="flex items-center justify-between px-3 py-2 border-b border-outline-variant/40 mb-1">
                            <span className="font-semibold text-xs text-on-surface">
                                Notifications
                            </span>
                            <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                {NOTIFICATIONS.length} unread
                            </span>
                        </div>
                        <div className="space-y-1">
                            {NOTIFICATIONS.map((n) => (
                                <Link key={n.text} className="org-dropdown__item" to={n.to}>
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
                                            {n.icon}
                                        </span>
                                    </span>
                                    <span className="flex-1 min-w-0">
                                        <span className="block font-medium text-xs leading-snug">
                                            {n.text}
                                        </span>
                                        <span className="org-dropdown__meta">{n.time}</span>
                                    </span>
                                </Link>
                            ))}
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
                        hidden
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
    )
}
