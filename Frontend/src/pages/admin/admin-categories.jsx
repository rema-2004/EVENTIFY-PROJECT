import { Link } from 'react-router-dom'
import AppPageHead from '../../components/app/AppPageHead'
import { useAdminPageControls } from './useAdminPageControls.js'
import AdminSidebar, { AdminMobileHeader } from '../../components/admin/AdminSidebar'
import AdminTopbar from '../../components/admin/AdminTopbar'
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
                    <AdminTopbar title="Categories Management" />
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
