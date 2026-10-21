import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AppPageHead from '../../components/app/AppPageHead'
import AdminSidebar, { AdminMobileHeader } from '../../components/admin/AdminSidebar'
import AdminTopbar from '../../components/admin/AdminTopbar'
import '../../styles/admin/admin.css'

const INITIAL_CATEGORIES = [
    { id: 1, name: 'Competition', active: 84 },
    { id: 2, name: 'Event', active: 112 },
    { id: 3, name: 'Workshop', active: 96 },
    { id: 4, name: 'Course', active: 56 },
]

// Opens/closes a native <dialog> as a modal to match the `open` state.
function useModal(open) {
    const ref = useRef(null)
    useEffect(() => {
        const dialog = ref.current
        if (!dialog) return
        if (open && !dialog.open) dialog.showModal()
        if (!open && dialog.open) dialog.close()
    }, [open])
    return ref
}

export default function AdminCategories() {

    const [categories, setCategories] = useState(INITIAL_CATEGORIES)
    // null = closed, { id: null } = adding, { id } = editing that category.
    const [editing, setEditing] = useState(null)
    const [name, setName] = useState('')
    const [deleting, setDeleting] = useState(null)
    const nameInput = useRef(null)
    const formDialog = useModal(editing !== null)
    const deleteDialog = useModal(deleting !== null)

    const openAdd = () => {
        setName('')
        setEditing({ id: null })
    }

    const openEdit = (category) => {
        setName(category.name)
        setEditing({ id: category.id })
    }

    const saveCategory = (event) => {
        event.preventDefault()
        const value = name.trim()
        if (!value) return
        const duplicate = categories.some(
            (c) => c.id !== editing.id && c.name.toLowerCase() === value.toLowerCase(),
        )
        if (duplicate) {
            nameInput.current.setCustomValidity('This category already exists')
            nameInput.current.reportValidity()
            nameInput.current.setCustomValidity('')
            return
        }
        if (editing.id === null) {
            setCategories((prev) => [...prev, { id: Date.now(), name: value, active: 0 }])
        } else {
            setCategories((prev) => prev.map((c) => (c.id === editing.id ? { ...c, name: value } : c)))
        }
        setEditing(null)
    }

    const confirmDelete = () => {
        setCategories((prev) => prev.filter((c) => c.id !== deleting.id))
        setDeleting(null)
    }

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
                        <button type="button" className="btn-primary" onClick={openAdd}>
                            Add category
                        </button>
                    </div>
                    <section className="section-card mx-auto max-w-2xl">
                        <h2 className="mb-4 text-title-lg font-semibold">
                            Opportunity Categories
                        </h2>
                        {/* id / data-act are styling hooks only (entrance, row hover, button hover colors in admin.css) */}
                        <div className="flex flex-col gap-3" id="category-list">
                            {categories.map((category, idx) => (
                                <div
                                    key={category.id}
                                    className="flex items-center justify-between rounded-xl bg-surface-container-low p-4 row-animated"
                                    style={{ '--stagger-idx': idx }}
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span
                                            className="material-symbols-outlined text-on-surface-variant"
                                            aria-hidden="true"
                                            style={{ fontSize: 20 }}
                                        >
                                            category
                                        </span>
                                        <span className="truncate">{category.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <Link
                                            className="text-on-surface-variant hover:text-primary hover:underline"
                                            to="/admin/events"
                                        >
                                            {category.active} active
                                        </Link>
                                        <div className="row-actions">
                                            <button
                                                type="button"
                                                data-act="edit"
                                                aria-label={`Edit ${category.name}`}
                                                onClick={() => openEdit(category)}
                                            >
                                                <span className="material-symbols-outlined" aria-hidden="true">
                                                    edit
                                                </span>
                                            </button>
                                            <button
                                                type="button"
                                                data-act="delete"
                                                aria-label={`Delete ${category.name}`}
                                                onClick={() => setDeleting(category)}
                                            >
                                                <span className="material-symbols-outlined" aria-hidden="true">
                                                    delete
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
                <dialog
                    className="confirm-dialog"
                    ref={formDialog}
                    onClose={() => setEditing(null)}
                    style={{ position: "fixed", inset: 0, margin: "auto" }}
                >
                    <form onSubmit={saveCategory}>
                        <h3>{editing?.id ? 'Edit category' : 'Add category'}</h3>
                        <p>
                            Give it a clear, unique name — it will appear in the category filters
                            right away.
                        </p>
                        <label className="sr-only" htmlFor="new-category-name">
                            Category name
                        </label>
                        <input
                            ref={nameInput}
                            className="input-primary"
                            type="text"
                            id="new-category-name"
                            name="name"
                            placeholder="e.g. Internship"
                            maxLength={40}
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ marginBottom: 20 }}
                        />
                        <div className="confirm-dialog__actions">
                            <button type="button" className="btn-secondary" onClick={() => setEditing(null)}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary">
                                {editing?.id ? 'Save changes' : 'Add category'}
                            </button>
                        </div>
                    </form>
                </dialog>
                <dialog
                    className="confirm-dialog"
                    ref={deleteDialog}
                    onClose={() => setDeleting(null)}
                    style={{ position: "fixed", inset: 0, margin: "auto" }}
                    aria-labelledby="delete-cat-title"
                >
                    <h3 id="delete-cat-title">Delete category?</h3>
                    <p>{deleting ? `Delete ${deleting.name}?` : ''}</p>
                    <div className="confirm-dialog__actions">
                        <button type="button" className="btn-secondary" onClick={() => setDeleting(null)}>
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn-primary"
                            onClick={confirmDelete}
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
