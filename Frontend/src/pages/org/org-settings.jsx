import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppPageHead from '../../components/app/AppPageHead'
import { toast } from '../../utils/toast.js'
import { useOrgPageControls } from './useOrgPageControls.js'
import LangToggleBtn from '../../components/org/LangToggleBtn'
import '../../styles/org/sidebar.css'
import '../../styles/admin/admin.css'
import '../../styles/org/org-create-event.css'

const INIT = {
    name: 'TechGenius Labs',
    type: 'Company',
    email: 'contact@techgenius.io',
    website: 'https://techgenius.io',
    city: 'Amman',
    country: 'Jordan',
    desc: 'A regional training and innovation lab helping students build practical AI, cloud, and product skills through workshops, competitions, and mentorship programs.',
}

const INIT_NOTIF = {
    applicants: true,
    adminReview: true,
    weeklyReport: false,
}

export default function OrgSettings() {
    useOrgPageControls()

    const [form, setForm] = useState(INIT)
    const [notif, setNotif] = useState(INIT_NOTIF)

    function handleField(e) {
        const { id, value } = e.target
        const key = id.replace('org-', '')
        setForm(prev => ({ ...prev, [key]: value }))
    }

    function handleSave(e) {
        e.preventDefault()
        toast('Settings saved successfully')
    }

    return (
        <>
            <AppPageHead title="Organization Settings | EVENTIFY" />
            <header className="lg:hidden w-full sticky top-0 z-40 flex justify-between items-center px-4 h-16 bg-surface border-b border-border shadow-sm">
                <Link className="flex items-center gap-2" to="/">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>hub</span>
                    <span className="font-bold text-headline-lg-mobile text-primary" style={{ fontFamily: 'var(--font-display)' }}>EVENTIFY</span>
                </Link>
                <div className="flex items-center gap-2">
                    <LangToggleBtn small />
                    <button className="theme-toggle icon-btn" type="button" title="Switch theme" aria-label="Switch theme" style={{ width: 36, height: 36 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>dark_mode</span>
                    </button>
                    <span className="admin-badge">Organizer</span>
                    <button className="mobile-hamburger" id="org-hamburger" aria-label="Open navigation" aria-expanded="false">
                        <span className="material-symbols-outlined" style={{ fontSize: 22 }}>menu</span>
                    </button>
                </div>
            </header>
            <div className="flex min-h-screen">
                <aside className="admin-accent-sidebar hidden lg:flex flex-col w-[280px] h-screen sticky top-0 bg-surface border-r border-border z-50 p-6">
                    <Link className="mb-2 flex items-center gap-3" to="/">
                        <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>hub</span>
                        <span className="font-bold text-headline-md text-primary" style={{ fontFamily: 'var(--font-display)' }}>EVENTIFY</span>
                    </Link>
                    <span className="admin-badge mb-8 w-fit">Organizer console</span>
                    <nav className="flex flex-1 flex-col gap-1" aria-label="Organizer sections">
                        <div className="nav-group">
                            <Link className="nav-link" to="/org/dashboard"><span className="material-symbols-outlined" aria-hidden="true">dashboard</span>Dashboard</Link>
                            <Link className="nav-link" to="/org/posts"><span className="material-symbols-outlined" aria-hidden="true">campaign</span>Posts</Link>
                            <Link className="nav-link" to="/org/profile"><span className="material-symbols-outlined" aria-hidden="true">apartment</span>Organization Profile</Link>
                            <Link className="nav-link" to="/org/opportunities"><span className="material-symbols-outlined" aria-hidden="true">event_note</span>My Opportunities</Link>
                            <Link className="nav-link" to="/org/create-event"><span className="material-symbols-outlined" aria-hidden="true">add_circle</span>Create Event</Link>
                            <Link className="nav-link" to="/org/applicants"><span className="material-symbols-outlined" aria-hidden="true">group</span>Applicants</Link>
                            <Link className="nav-link" to="/org/report-center"><span className="material-symbols-outlined" aria-hidden="true">bar_chart</span>Reports</Link>
                            <Link className="nav-link" to="/org/settings" aria-current="page"><span className="material-symbols-outlined" aria-hidden="true">settings</span>Settings</Link>
                        </div>
                    </nav>
                    <div className="mt-auto rounded-2xl bg-surface-container p-4">
                        <p className="mb-2 text-label-sm font-label-sm text-on-surface-variant">ORGANIZATION</p>
                        <p className="mb-1 font-label-md text-label-md text-on-surface font-semibold">TechGenius Labs</p>
                        <p className="text-label-sm font-label-sm text-success">Verified organizer since 2024</p>
                    </div>
                </aside>
                <main className="w-full flex-1 px-4 pt-6 pb-8 md:px-10">
                    <div className="org-topbar">
                        <h1 className="org-topbar__title">Organization Settings</h1>
                        <div className="org-topbar__right">
                            <div className="org-dropdown">
                                <button className="icon-btn" id="org-notif-toggle" type="button" aria-label="Notifications (3 unread)" aria-expanded="false">
                                    <span className="material-symbols-outlined">notifications</span>
                                    <span className="icon-btn__dot" />
                                </button>
                                <div className="org-dropdown__panel org-dropdown__panel--notif" id="org-notif-panel" hidden role="menu" aria-label="Notifications">
                                    <div className="flex items-center justify-between px-3 py-2 border-b border-outline-variant/40 mb-1">
                                        <span className="font-semibold text-xs text-on-surface">Notifications</span>
                                        <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">3 unread</span>
                                    </div>
                                    <div className="space-y-1">
                                        <Link className="org-dropdown__item" to="/org/applicants">
                                            <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}>
                                                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">person_add</span>
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="block font-medium text-xs leading-snug">Ahmed Ali applied to Global AI Innovation Challenge</span>
                                                <span className="org-dropdown__meta">2 hours ago</span>
                                            </span>
                                        </Link>
                                        <Link className="org-dropdown__item" to="/org/opportunities">
                                            <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}>
                                                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">hourglass_top</span>
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="block font-medium text-xs leading-snug">DevOps Masterclass is awaiting approval</span>
                                                <span className="org-dropdown__meta">Yesterday</span>
                                            </span>
                                        </Link>
                                        <Link className="org-dropdown__item" to="/org/applicants">
                                            <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}>
                                                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">star</span>
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="block font-medium text-xs leading-snug">Frontend Wizards received a new 5-star rating</span>
                                                <span className="org-dropdown__meta">2 days ago</span>
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="pt-2 mt-1 border-t border-outline-variant/40">
                                        <Link to="/org/applicants" className="block text-center text-xs font-semibold text-primary hover:underline py-1">View all activity →</Link>
                                    </div>
                                </div>
                            </div>
                            <LangToggleBtn />
                            <button className="theme-toggle icon-btn" type="button" title="Switch theme" aria-label="Switch theme">
                                <span className="material-symbols-outlined">dark_mode</span>
                            </button>
                            <div className="org-dropdown">
                                <button className="dash-profile" id="org-profile-toggle" type="button" aria-label="Organization menu" aria-expanded="false">
                                    <span className="dash-profile__avatar">TG</span>
                                    <span style={{ fontSize: 13, fontWeight: 600 }}>TechGenius Labs</span>
                                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--text-muted)' }}>expand_more</span>
                                </button>
                                <div className="org-dropdown__panel org-dropdown__panel--profile" id="org-profile-panel" hidden role="menu" aria-label="Organization menu">
                                    <div className="px-3 py-2 border-b border-outline-variant/40 mb-1">
                                        <p className="font-semibold text-xs text-on-surface">TechGenius Labs</p>
                                        <p className="text-[11px] text-on-surface-variant truncate">Verified organizer since 2024</p>
                                    </div>
                                    <Link className="org-dropdown__item" to="/org/profile"><span className="material-symbols-outlined text-[18px] text-on-surface-variant" aria-hidden="true">apartment</span><span>Organization Profile</span></Link>
                                    <Link className="org-dropdown__item" to="/org/settings"><span className="material-symbols-outlined text-[18px] text-on-surface-variant" aria-hidden="true">settings</span><span>Settings</span></Link>
                                    <div className="my-1 border-t border-outline-variant/40" />
                                    <Link className="org-dropdown__item text-error hover:bg-error/10" to="/auth/login">
                                        <span className="material-symbols-outlined text-[18px] text-error" aria-hidden="true">logout</span>
                                        <span className="text-error font-medium">Sign out</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="org-page-header">
                        <div className="flex items-center gap-2 text-sm mb-2">
                            <Link className="text-on-surface-variant hover:text-primary transition-colors" to="/org/dashboard">Dashboard</Link>
                            <span className="text-outline">/</span>
                            <span className="font-semibold text-on-surface">Settings</span>
                        </div>
                        <p className="profile-page-desc">Maintain official profile data, verification documents, and organizer preferences.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <section className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-8 lg:col-span-2">
                            <h3 className="mb-6 text-title-lg font-semibold">Official Information</h3>
                            <form className="grid grid-cols-1 gap-5 md:grid-cols-2" onSubmit={handleSave}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="org-name">Organization name</label>
                                    <input className="form-input" id="org-name" type="text" value={form.name} onChange={handleField} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="org-type">Organization type</label>
                                    <select className="form-input" id="org-type" value={form.type} onChange={handleField}>
                                        <option>University</option>
                                        <option>Company</option>
                                        <option>NGO</option>
                                        <option>Government</option>
                                        <option>Startup</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="org-email">Work email</label>
                                    <input className="form-input" id="org-email" type="email" value={form.email} onChange={handleField} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="org-website">Website</label>
                                    <input className="form-input" id="org-website" type="url" value={form.website} onChange={handleField} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="org-city">City</label>
                                    <input className="form-input" id="org-city" type="text" value={form.city} onChange={handleField} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="org-country">Country</label>
                                    <input className="form-input" id="org-country" type="text" value={form.country} onChange={handleField} />
                                </div>
                                <div className="form-group md:col-span-2">
                                    <label className="form-label" htmlFor="org-desc">Public description</label>
                                    <textarea className="form-textarea" id="org-desc" rows={4} value={form.desc} onChange={handleField} />
                                </div>
                                <div className="md:col-span-2 flex justify-end">
                                    <button type="submit" className="btn-primary">Save changes</button>
                                </div>
                            </form>
                        </section>
                        <aside className="space-y-6">
                            <section className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-6">
                                <h3 className="mb-4 text-title-lg font-semibold">Verification</h3>
                                <div className="mb-4 rounded-xl bg-success/10 p-4 text-success">
                                    <p className="font-semibold">Verified organizer</p>
                                    <p className="text-label-md">Reviewed by Eventify Admin on Mar 18, 2026.</p>
                                </div>
                                <div className="space-y-3 text-label-md">
                                    <p className="flex items-center justify-between">
                                        <span>Business license</span>
                                        <span className="badge badge--approved">Approved</span>
                                    </p>
                                    <p className="flex items-center justify-between">
                                        <span>Domain email</span>
                                        <span className="badge badge--approved">Approved</span>
                                    </p>
                                    <p className="flex items-center justify-between">
                                        <span>Training registry</span>
                                        <span className="badge badge--approved">Approved</span>
                                    </p>
                                </div>
                            </section>
                            <section className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-6">
                                <h3 className="mb-4 text-title-lg font-semibold">Notification Rules</h3>
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between gap-3">
                                        <span>New applicants</span>
                                        <input
                                            className="rounded text-primary"
                                            type="checkbox"
                                            checked={notif.applicants}
                                            onChange={e => setNotif(p => ({ ...p, applicants: e.target.checked }))}
                                        />
                                    </label>
                                    <label className="flex items-center justify-between gap-3">
                                        <span>Admin review updates</span>
                                        <input
                                            className="rounded text-primary"
                                            type="checkbox"
                                            checked={notif.adminReview}
                                            onChange={e => setNotif(p => ({ ...p, adminReview: e.target.checked }))}
                                        />
                                    </label>
                                    <label className="flex items-center justify-between gap-3">
                                        <span>Weekly performance report</span>
                                        <input
                                            className="rounded text-primary"
                                            type="checkbox"
                                            checked={notif.weeklyReport}
                                            onChange={e => setNotif(p => ({ ...p, weeklyReport: e.target.checked }))}
                                        />
                                    </label>
                                </div>
                            </section>
                        </aside>
                    </div>
                </main>
            </div>

            <div className="mobile-nav-overlay" id="org-mobile-overlay" />
            <nav className="mobile-nav-drawer" id="org-mobile-drawer" aria-label="Organizer navigation">
                <button className="mobile-nav-close" id="org-nav-close" aria-label="Close navigation">
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
                </button>
                <Link className="flex items-center gap-3 mb-2" to="/">
                    <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>hub</span>
                    <span className="font-bold text-headline-md text-primary" style={{ fontFamily: 'var(--font-display)' }}>EVENTIFY</span>
                </Link>
                <span className="admin-badge mb-6 w-fit">Organizer console</span>
                <div className="nav-group flex flex-1 flex-col gap-1">
                    <Link className="nav-link" to="/org/dashboard"><span className="material-symbols-outlined" aria-hidden="true">dashboard</span>Dashboard</Link>
                    <Link className="nav-link" to="/org/posts"><span className="material-symbols-outlined" aria-hidden="true">campaign</span>Posts</Link>
                    <Link className="nav-link" to="/org/profile"><span className="material-symbols-outlined" aria-hidden="true">apartment</span>Organization Profile</Link>
                    <Link className="nav-link" to="/org/opportunities"><span className="material-symbols-outlined" aria-hidden="true">event_note</span>My Opportunities</Link>
                    <Link className="nav-link" to="/org/create-event"><span className="material-symbols-outlined" aria-hidden="true">add_circle</span>Create Event</Link>
                    <Link className="nav-link" to="/org/applicants"><span className="material-symbols-outlined" aria-hidden="true">group</span>Applicants</Link>
                    <Link className="nav-link" to="/org/report-center"><span className="material-symbols-outlined" aria-hidden="true">bar_chart</span>Reports</Link>
                    <Link className="nav-link" to="/org/settings" aria-current="page"><span className="material-symbols-outlined" aria-hidden="true">settings</span>Settings</Link>
                </div>
                <div className="mt-auto rounded-2xl bg-surface-container p-4">
                    <p className="mb-2 text-label-sm font-label-sm text-on-surface-variant">ORGANIZATION</p>
                    <p className="mb-1 font-label-md text-label-md text-on-surface font-semibold">TechGenius Labs</p>
                    <p className="text-label-sm font-label-sm text-success">Verified organizer since 2024</p>
                </div>
            </nav>
        </>
    )
}
