import { useState } from 'react'
import AppPageHead from '../../components/app/AppPageHead'
import { useAdminPageControls } from './useAdminPageControls.js'
import AdminSidebar, { AdminMobileHeader } from '../../components/admin/AdminSidebar'
import AdminTopbar from '../../components/admin/AdminTopbar'
import { toast } from '../../utils/toast'
import '../../styles/admin/admin.css'

const PAGE_SIZE = 5

const ROLE_TABS = [
    { role: 'all', label: 'All' },
    { role: 'organizer', label: 'Organizers' },
    { role: 'participant', label: 'Participants' },
]

const ROLE_LABELS = { organizer: 'Organizer', participant: 'Participant' }

const INITIAL_USERS = [
    { id: 1, name: 'Sarah Chen', email: 'sarah.chen@eventify.io', role: 'participant', status: 'active' },
    { id: 2, name: 'TechGenius Labs', email: 'contact@techgenius.io', role: 'organizer', status: 'active' },
    { id: 3, name: 'Marcus Thorne', email: 'marcus.t@eventify.io', role: 'participant', status: 'active' },
    { id: 4, name: 'Kevin Park', email: 'kevin.park@eventify.io', role: 'participant', status: 'suspended' },
    { id: 5, name: 'DesignHub Amman', email: 'hello@designhub.jo', role: 'organizer', status: 'active' },
    { id: 6, name: 'Layla Mahmoud', email: 'layla.m@eventify.io', role: 'participant', status: 'active' },
    { id: 7, name: 'CodeCraft Academy', email: 'info@codecraft.org', role: 'organizer', status: 'active' },
    { id: 8, name: 'Omar Farooq', email: 'omar.f@eventify.io', role: 'participant', status: 'active' },
    { id: 9, name: 'NextGen Robotics', email: 'contact@nextgenrobotics.io', role: 'organizer', status: 'active' },
    { id: 10, name: 'Dana Al-Hassan', email: 'dana.h@eventify.io', role: 'participant', status: 'suspended' },
    { id: 11, name: 'Tariq Mansour', email: 'tariq.m@eventify.io', role: 'participant', status: 'active' },
    { id: 12, name: 'CloudScale Solutions', email: 'support@cloudscale.net', role: 'organizer', status: 'active' },
    { id: 13, name: 'Rania Qasim', email: 'rania.q@eventify.io', role: 'participant', status: 'active' },
    { id: 14, name: 'CyberShield Jordan', email: 'hello@cybershield.jo', role: 'organizer', status: 'active' },
    { id: 15, name: 'Zaid Al-Najjar', email: 'zaid.n@eventify.io', role: 'participant', status: 'active' },
]

export default function AdminUsers() {
    useAdminPageControls()

    const [users, setUsers] = useState(INITIAL_USERS)
    const [roleFilter, setRoleFilter] = useState('all')
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)

    // Filtering and paging are derived from state on every render.
    const query = search.trim().toLowerCase()
    const matching = users.filter(
        (u) =>
            (roleFilter === 'all' || u.role === roleFilter) &&
            (!query || `${u.name} ${u.email}`.toLowerCase().includes(query)),
    )
    const totalPages = Math.max(1, Math.ceil(matching.length / PAGE_SIZE))
    const currentPage = Math.min(page, totalPages)
    const start = (currentPage - 1) * PAGE_SIZE
    const pageUsers = matching.slice(start, start + PAGE_SIZE)

    const changeRole = (role) => {
        setRoleFilter(role)
        setPage(1)
    }

    const changeSearch = (value) => {
        setSearch(value)
        setPage(1)
    }

    const setStatus = (user, status) => {
        setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status } : u)))
        if (status === 'suspended') toast(`${user.name} suspended`, 'error')
        else toast(`${user.name} reinstated`, 'success')
    }

    const deleteUser = (user) => {
        if (!window.confirm('Delete this record? This cannot be undone.')) return
        setUsers((prev) => prev.filter((u) => u.id !== user.id))
        toast(`${user.name} deleted`, 'error')
    }

    return (
        <>
            <AppPageHead title="Manage Users | EVENTIFY" />
            <AdminMobileHeader />
            <div className="flex">
                <AdminSidebar />
                <main className="flex-1 w-full px-4 md:px-10 pt-6 pb-24 lg:pb-8">
                    <AdminTopbar title="Manage Users" />
                    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <p className="text-on-surface-variant font-body-md mt-1">
                                Search, filter, and moderate participant and organizer accounts.{" "}
                                <span className="font-semibold text-on-surface">
                                    {matching.length === 0
                                        ? '0 users'
                                        : `Showing ${start + 1}–${start + pageUsers.length} of ${matching.length} users`}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                                search
                            </span>
                            <input
                                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-body-md"
                                placeholder="Search by name or email..."
                                type="text"
                                value={search}
                                onChange={(e) => changeSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter users by role">
                            {ROLE_TABS.map((tab) => {
                                const active = tab.role === roleFilter
                                return (
                                    <button
                                        key={tab.role}
                                        type="button"
                                        className={`px-5 py-2 rounded-full font-label-md text-label-md whitespace-nowrap ${
                                            active
                                                ? 'bg-primary text-on-primary'
                                                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors'
                                        }`}
                                        aria-pressed={active}
                                        onClick={() => changeRole(tab.role)}
                                    >
                                        {tab.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                    <div className="section-card" style={{ padding: 0, overflow: "hidden" }}>
                        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wide hidden md:grid">
                            <span className="col-span-4">User</span>
                            <span className="col-span-3">Role</span>
                            <span className="col-span-2">Status</span>
                            <span className="col-span-3 text-right">Actions</span>
                        </div>
                        {/* id is a styling hook only (staggered entrance + row hover in admin.css) */}
                        <div className="divide-y divide-outline-variant/30" id="users-list">
                            {pageUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-4 items-center fade-in"
                                >
                                    <div className="md:col-span-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center font-label-md text-primary">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-label-md text-label-md text-on-surface">
                                                {user.name}
                                            </p>
                                            <p className="text-label-sm font-label-sm text-on-surface-variant">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="md:col-span-3 font-label-md text-label-md text-on-surface-variant">
                                        {ROLE_LABELS[user.role]}
                                    </div>
                                    <div className="md:col-span-2">
                                        <span className={`badge ${user.status === 'active' ? 'badge--approved' : 'badge--rejected'}`}>
                                            {user.status}
                                        </span>
                                    </div>
                                    <div className="md:col-span-3 flex justify-end gap-2">
                                        {user.status === 'active' ? (
                                            <button
                                                type="button"
                                                className="btn-danger-outline"
                                                onClick={() => setStatus(user, 'suspended')}
                                            >
                                                Suspend
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="btn-success"
                                                onClick={() => setStatus(user, 'active')}
                                            >
                                                Reinstate
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            className="btn-danger-outline"
                                            onClick={() => deleteUser(user)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {matching.length === 0 && (
                            <div className="empty-state fade-in">
                                <span className="empty-state__icon">
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                        person_search
                                    </span>
                                </span>
                                <h3>No users found</h3>
                                <p>No users match your search or filters.</p>
                            </div>
                        )}
                        {matching.length > 0 && (
                            <div className="pagination">
                                <button
                                    type="button"
                                    disabled={currentPage === 1}
                                    onClick={() => setPage(currentPage - 1)}
                                >
                                    Prev
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        aria-current={p === currentPage}
                                        onClick={() => setPage(p)}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setPage(currentPage + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    )
}
