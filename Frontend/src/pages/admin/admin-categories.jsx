import { Link } from 'react-router-dom'
import AppPageHead from '../../components/app/AppPageHead'
import { useAdminPageControls } from './useAdminPageControls.js'
import AdminSidebar, { AdminMobileHeader } from '../../components/admin/AdminSidebar'
import LangToggleBtn from '../../components/org/LangToggleBtn'
import '../../styles/admin/admin.css'

export default function AdminCategories() {
    useAdminPageControls()
    return (
        <>
            <AppPageHead title="Categories Management | EVENTIFY" />
            <AdminMobileHeader />
            <div className="flex min-h-screen">
                <AdminSidebar />
                <main className="w-full flex-1 px-4 pt-6 pb-24 md:px-10 lg:pb-8">
                    {/* Global Top Header: page title (left) + global controls (right) */}
                    <div className="admin-topbar">
                        <h1 className="admin-topbar__title">Categories Management</h1>
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
                                    hidden={true}
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
                                    hidden={true}
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
                            <p className="mt-1 text-on-surface-variant">
                                Maintain opportunity types and skill tags used by search and AI
                                matching.
                            </p>
                        </div>
                        <button type="button" className="btn-primary" id="btn-add-category">
                            Add category
                        </button>
                    </div>
                    <section className="section-card mx-auto max-w-2xl">
                        <h2 className="mb-4 text-title-lg font-semibold">
                            Opportunity Categories
                        </h2>
                        <div className="flex flex-col gap-3" id="category-list">
                            <div
                                className="flex items-center justify-between rounded-xl bg-surface-container-low p-4 row-animated"
                                style={{ '--stagger-idx': 0 }}
                                data-active={84}
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <span
                                        className="material-symbols-outlined text-on-surface-variant"
                                        aria-hidden="true"
                                        style={{ fontSize: 20 }}
                                    >
                                        category
                                    </span>
                                    <span className="cat-name truncate">Competition</span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <Link
                                        className="text-on-surface-variant hover:text-primary hover:underline"
                                        to="/admin/events?category=Competition"
                                    >
                                        84 active
                                    </Link>
                                    <div className="row-actions">
                                        <button
                                            type="button"
                                            data-act="edit"
                                            aria-label="Edit Competition"
                                        >
                                            <span
                                                className="material-symbols-outlined"
                                                aria-hidden="true"
                                            >
                                                edit
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            data-act="delete"
                                            aria-label="Delete Competition"
                                        >
                                            <span
                                                className="material-symbols-outlined"
                                                aria-hidden="true"
                                            >
                                                delete
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="flex items-center justify-between rounded-xl bg-surface-container-low p-4 row-animated"
                                style={{ '--stagger-idx': 1 }}
                                data-active={112}
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <span
                                        className="material-symbols-outlined text-on-surface-variant"
                                        aria-hidden="true"
                                        style={{ fontSize: 20 }}
                                    >
                                        category
                                    </span>
                                    <span className="cat-name truncate">Event</span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <Link
                                        className="text-on-surface-variant hover:text-primary hover:underline"
                                        to="/admin/events?category=Event"
                                    >
                                        112 active
                                    </Link>
                                    <div className="row-actions">
                                        <button type="button" data-act="edit" aria-label="Edit Event">
                                            <span
                                                className="material-symbols-outlined"
                                                aria-hidden="true"
                                            >
                                                edit
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            data-act="delete"
                                            aria-label="Delete Event"
                                        >
                                            <span
                                                className="material-symbols-outlined"
                                                aria-hidden="true"
                                            >
                                                delete
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="flex items-center justify-between rounded-xl bg-surface-container-low p-4 row-animated"
                                style={{ '--stagger-idx': 2 }}
                                data-active={96}
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <span
                                        className="material-symbols-outlined text-on-surface-variant"
                                        aria-hidden="true"
                                        style={{ fontSize: 20 }}
                                    >
                                        category
                                    </span>
                                    <span className="cat-name truncate">Workshop</span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <Link
                                        className="text-on-surface-variant hover:text-primary hover:underline"
                                        to="/admin/events?category=Workshop"
                                    >
                                        96 active
                                    </Link>
                                    <div className="row-actions">
                                        <button
                                            type="button"
                                            data-act="edit"
                                            aria-label="Edit Workshop"
                                        >
                                            <span
                                                className="material-symbols-outlined"
                                                aria-hidden="true"
                                            >
                                                edit
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            data-act="delete"
                                            aria-label="Delete Workshop"
                                        >
                                            <span
                                                className="material-symbols-outlined"
                                                aria-hidden="true"
                                            >
                                                delete
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="flex items-center justify-between rounded-xl bg-surface-container-low p-4 row-animated"
                                style={{ '--stagger-idx': 3 }}
                                data-active={56}
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <span
                                        className="material-symbols-outlined text-on-surface-variant"
                                        aria-hidden="true"
                                        style={{ fontSize: 20 }}
                                    >
                                        category
                                    </span>
                                    <span className="cat-name truncate">Course</span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <Link
                                        className="text-on-surface-variant hover:text-primary hover:underline"
                                        to="/admin/events?category=Course"
                                    >
                                        56 active
                                    </Link>
                                    <div className="row-actions">
                                        <button type="button" data-act="edit" aria-label="Edit Course">
                                            <span
                                                className="material-symbols-outlined"
                                                aria-hidden="true"
                                            >
                                                edit
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            data-act="delete"
                                            aria-label="Delete Course"
                                        >
                                            <span
                                                className="material-symbols-outlined"
                                                aria-hidden="true"
                                            >
                                                delete
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
                <dialog className="confirm-dialog" id="add-category-dialog" style={{ position: "fixed", inset: 0, margin: "auto" }}>
                    <form method="dialog" id="add-category-form">
                        <h3 id="add-category-title">Add category</h3>
                        <p id="add-category-hint">
                            Give it a clear, unique name — it will appear in the category filters
                            right away.
                        </p>
                        <label className="sr-only" htmlFor="new-category-name">
                            Category name
                        </label>
                        <input
                            className="input-primary"
                            type="text"
                            id="new-category-name"
                            name="name"
                            placeholder="e.g. Internship"
                            maxLength={40}
                            required=""
                            style={{ marginBottom: 20 }}
                        />
                        <div className="confirm-dialog__actions">
                            <button
                                type="button"
                                className="btn-secondary"
                                id="add-category-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                id="add-category-submit"
                            >
                                Add category
                            </button>
                        </div>
                    </form>
                </dialog>
                <dialog className="confirm-dialog" id="delete-category-dialog" style={{ position: "fixed", inset: 0, margin: "auto" }}
                    aria-labelledby="delete-cat-title"
                >
                    <h3 id="delete-cat-title">Delete category?</h3>
                    <p id="delete-cat-message" />
                    <div className="confirm-dialog__actions">
                        <button type="button" className="btn-secondary" id="delete-cat-cancel">
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn-primary"
                            id="delete-cat-confirm"
                            style={{ background: "var(--error,#B3261E)" }}
                        >
                            Delete
                        </button>
                    </div>
                </dialog>
            </div>
            
        </>
    )
}
