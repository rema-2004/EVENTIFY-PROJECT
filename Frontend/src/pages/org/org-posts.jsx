import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import AppPageHead from '../../components/app/AppPageHead'
import { useOrgPageControls } from './useOrgPageControls.js'
import { toast } from '../../utils/toast.js'
import LangToggleBtn from '../../components/org/LangToggleBtn'
import AnimatedCounter from '../../components/shared/AnimatedCounter'
import '../../styles/org/sidebar.css'
import '../../styles/admin/admin.css'
import '../../styles/org/org-dashboard.css'

const EXPLORE_POSTS = [
    { org: 'GreenFuture Initiative', title: 'Community Volunteer Day', body: 'Join our team this Friday to plant 300 trees and support a greener city. The event starts at 8:00 AM and everyone is welcome.', meta: 'Posted 2 hours ago • Open for volunteers', preview: 'Volunteer day this Friday — join us to plant 300 trees.' },
    { org: 'City Tech Hub', title: 'Startup Bootcamp Open', body: 'Students can now register for our startup bootcamp to learn product design, pitch building, and founder basics with mentors.', meta: 'Posted 1 day ago • Registration open', preview: 'New startup bootcamp registrations are now open for students.' },
    { org: 'Creative Minds Studio', title: 'Design Challenge Results', body: 'The winners of our design challenge will be announced next week. Stay tuned for featured projects and awards.', meta: 'Posted 3 days ago • Upcoming announcement', preview: 'Design challenge winners will be announced next week.' },
]

const SEED_POSTS = [
    { id: 'seed-1', avatarInitials: 'TG', avatarColor: 'bg-primary/10 text-primary', meta: '2 hours ago • Announcement', body: 'Registration for the Global AI Innovation Challenge is now open! Teams of 2-4, $10k in prizes, remote-friendly. Apply before Oct 26.', tags: [{ label: 'Opportunity', color: 'bg-primary/10 text-primary' }, { label: 'Apply now', color: 'bg-surface-container text-on-surface-variant' }] },
    { id: 'seed-2', avatarInitials: 'CF', avatarColor: 'bg-secondary/10 text-secondary', meta: '1 day ago • Event', body: 'Our booth at the Career & Internship Fair is confirmed — come say hi and pick up an application on the spot.', tags: [{ label: 'On-site', color: 'bg-success/10 text-success' }, { label: 'Meet us there', color: 'bg-surface-container text-on-surface-variant' }] },
    { id: 'seed-3', avatarInitials: 'DM', avatarColor: 'bg-tertiary/10 text-tertiary', meta: '6 days ago • Wrap-up', body: 'DevOps Masterclass wrapped this week — thank you to everyone who joined! Certificates go out by Friday.', tags: [] },
    { id: 'seed-4', avatarInitials: 'AI', avatarColor: 'bg-primary/10 text-primary', meta: '1 week ago • Community', body: 'We are hosting a live Q&A session next week for students interested in AI and product design. Save your spot now.', tags: [] },
    { id: 'seed-5', avatarInitials: 'NS', avatarColor: 'bg-secondary/10 text-secondary', meta: '2 weeks ago • Network', body: 'New networking session with founders and mentors is now open for registration. Join the conversation and grow your circle.', tags: [] },
]

export default function OrgPosts() {
    useOrgPageControls()

    const [posts, setPosts] = useState(SEED_POSTS)
    const [draft, setDraft] = useState('')
    const [imageName, setImageName] = useState(null)
    const [imageDataUrl, setImageDataUrl] = useState(null)
    const [editingId, setEditingId] = useState(null)
    const [loadedAll, setLoadedAll] = useState(false)
    const [showAllExplore, setShowAllExplore] = useState(false)
    const [modal, setModal] = useState({ open: false, org: '', title: '', body: '', meta: '' })

    const fileInputRef = useRef(null)
    const textareaRef = useRef(null)

    function handleImageChange(e) {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > 2 * 1024 * 1024) {
            e.target.value = ''
            toast('Choose an image smaller than 2 MB', 'error')
            return
        }
        setImageName(file.name)
        const reader = new FileReader()
        reader.onload = () => setImageDataUrl(String(reader.result || ''))
        reader.readAsDataURL(file)
    }

    function handlePublish() {
        const text = draft.trim()
        if (!text) {
            toast('Write something before publishing', 'error')
            textareaRef.current?.focus()
            return
        }
        if (editingId) {
            setPosts(prev => prev.map(p => p.id === editingId ? { ...p, body: text, image: imageDataUrl || p.image } : p))
            setEditingId(null)
            toast('Post updated')
        } else {
            const newPost = {
                id: `post-${Date.now()}`,
                avatarInitials: 'TG',
                avatarColor: 'bg-primary/10 text-primary',
                meta: 'Just now • Update',
                body: text,
                image: imageDataUrl || null,
                tags: [],
            }
            setPosts(prev => [newPost, ...prev])
            toast('Post published')
        }
        setDraft('')
        setImageName(null)
        setImageDataUrl(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    function handleEdit(post) {
        setDraft(post.body)
        setEditingId(post.id)
        textareaRef.current?.focus()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        toast('Editing post — update the text and publish again')
    }

    function handleDelete(id) {
        setPosts(prev => prev.filter(p => p.id !== id))
        if (editingId === id) {
            setEditingId(null)
            setDraft('')
        }
        toast('Post deleted')
    }

    return (
        <>
            <AppPageHead title="Posts | EVENTIFY" />
            <header className="lg:hidden w-full sticky top-0 z-40 flex justify-between items-center px-4 h-16 bg-surface border-b border-border shadow-sm">
                <Link className="flex items-center gap-2" to="/">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>hub</span>
                    <span className="font-bold text-headline-lg-mobile text-primary" style={{ fontFamily: "var(--font-display)" }}>EVENTIFY</span>
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
                        <span className="font-bold text-headline-md text-primary" style={{ fontFamily: "var(--font-display)" }}>EVENTIFY</span>
                    </Link>
                    <span className="admin-badge mb-8 w-fit">Organizer console</span>
                    <nav className="flex flex-1 flex-col gap-1" aria-label="Organizer sections">
                        <div className="nav-group">
                            <Link className="nav-link" to="/org/dashboard"><span className="material-symbols-outlined" aria-hidden="true">dashboard</span>Dashboard</Link>
                            <Link className="nav-link" to="/org/posts" aria-current="page"><span className="material-symbols-outlined" aria-hidden="true">campaign</span>Posts</Link>
                            <Link className="nav-link" to="/org/profile"><span className="material-symbols-outlined" aria-hidden="true">apartment</span>Organization Profile</Link>
                            <Link className="nav-link" to="/org/opportunities"><span className="material-symbols-outlined" aria-hidden="true">event_note</span>My Opportunities</Link>
                            <Link className="nav-link" to="/org/create-event"><span className="material-symbols-outlined" aria-hidden="true">add_circle</span>Create Event</Link>
                            <Link className="nav-link" to="/org/applicants"><span className="material-symbols-outlined" aria-hidden="true">group</span>Applicants</Link>
                            <Link className="nav-link" to="/org/report-center"><span className="material-symbols-outlined" aria-hidden="true">bar_chart</span>Reports</Link>
                            <Link className="nav-link" to="/org/settings"><span className="material-symbols-outlined" aria-hidden="true">settings</span>Settings</Link>
                        </div>
                    </nav>
                    <div className="mt-auto rounded-2xl bg-surface-container p-4">
                        <p className="mb-2 text-label-sm font-label-sm text-on-surface-variant">ORGANIZATION</p>
                        <p className="mb-1 font-label-md text-label-md text-on-surface font-semibold">TechGenius Labs</p>
                        <p className="text-label-sm font-label-sm text-success">Verified organizer since 2024</p>
                    </div>
                </aside>
                <main className="w-full flex-1 px-4 pt-6 pb-24 md:px-10 lg:pb-8">
                    <div className="org-topbar">
                        <h1 className="org-topbar__title">Posts</h1>
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
                                            <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--surface-2)", color: "var(--accent)" }}>
                                                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">person_add</span>
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="block font-medium text-xs leading-snug">Ahmed Ali applied to Global AI Innovation Challenge</span>
                                                <span className="org-dropdown__meta">2 hours ago</span>
                                            </span>
                                        </Link>
                                        <Link className="org-dropdown__item" to="/org/opportunities">
                                            <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--surface-2)", color: "var(--accent)" }}>
                                                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">hourglass_top</span>
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="block font-medium text-xs leading-snug">DevOps Masterclass is awaiting approval</span>
                                                <span className="org-dropdown__meta">Yesterday</span>
                                            </span>
                                        </Link>
                                        <Link className="org-dropdown__item" to="/org/applicants">
                                            <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--surface-2)", color: "var(--accent)" }}>
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
                                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: "var(--text-muted)" }}>expand_more</span>
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
                            <span className="font-semibold text-on-surface">Posts</span>
                        </div>
                        <p className="profile-page-desc">Share updates, announcements, and news with the people following TechGenius Labs.</p>
                        <div className="org-page-header__actions">
                            <div className="panel" style={{ padding: "12px 20px" }}>
                                <p className="text-sm text-on-surface-variant">Active followers</p>
                                <p className="text-2xl font-semibold text-on-surface font-mono"><AnimatedCounter value={3214} /></p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_0.9fr]">
                        <div className="space-y-4">
                            {/* Composer */}
                            <div className="soft-card premium-card rounded-[28px] p-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <span className="material-symbols-outlined text-[18px]">edit_square</span>
                                    </div>
                                    <div>
                                        <h3 className="text-title-lg font-semibold text-on-surface">
                                            {editingId ? 'Edit post' : 'Write a new post'}
                                        </h3>
                                        <p className="text-sm text-on-surface-variant">Keep your audience informed with concise updates.</p>
                                    </div>
                                </div>
                                <textarea
                                    ref={textareaRef}
                                    className="w-full resize-none rounded-2xl border border-outline-variant/60 bg-surface-container-low p-4 text-body-md text-on-surface shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Share news, a registration deadline, or an update with your followers…"
                                    rows={3}
                                    value={draft}
                                    onChange={e => setDraft(e.target.value)}
                                />
                                {imageName && (
                                    <p className="mt-2 text-sm text-on-surface-variant">Attached: {imageName}</p>
                                )}
                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                    <button className="btn-secondary" type="button" onClick={() => fileInputRef.current?.click()}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>image</span> Add image
                                    </button>
                                    <button className="btn-primary" type="button" onClick={handlePublish}>
                                        {editingId ? 'Update post' : 'Publish'}
                                    </button>
                                </div>
                            </div>

                            {/* Published Posts */}
                            <div className="flex items-center justify-between pt-2">
                                <h3 className="text-title-lg font-semibold">Your Posts</h3>
                                <span className="rounded-full bg-surface-container px-3 py-1 text-sm text-on-surface-variant">
                                    {posts.length} update{posts.length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            <div className="space-y-4">
                                {posts.map((post, idx) => (
                                    <article key={post.id} className="soft-card premium-card rounded-[28px] p-6 row-animated transition-all duration-300 hover:shadow-md" style={{ '--stagger-idx': idx }}>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex gap-3">
                                                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${post.avatarColor} text-label-md font-semibold`}>
                                                    {post.avatarInitials}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-on-surface">TechGenius Labs</p>
                                                    <p className="text-sm text-on-surface-variant">{post.meta}</p>
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 gap-1">
                                                <button className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high" title="Edit post" aria-label="Edit post" type="button" onClick={() => handleEdit(post)}>
                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                </button>
                                                <button className="rounded-lg p-2 text-error transition-colors hover:bg-error/10" title="Delete post" aria-label="Delete post" type="button" onClick={() => handleDelete(post.id)}>
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                        <p className="mt-4 text-body-md text-on-surface-variant">{post.body}</p>
                                        {post.image && (
                                            <img src={post.image} alt="" className="mt-4 max-h-80 w-full rounded-xl object-cover" />
                                        )}
                                        {post.tags?.length > 0 && (
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {post.tags.map((tag, i) => (
                                                    <span key={i} className={`rounded-full px-3 py-1 text-sm font-medium ${tag.color}`}>{tag.label}</span>
                                                ))}
                                            </div>
                                        )}
                                    </article>
                                ))}
                            </div>

                            <div className="mt-2 flex justify-center">
                                <button
                                    className="rounded-full border border-primary/20 px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                    type="button"
                                    disabled={loadedAll}
                                    onClick={() => { setLoadedAll(true); toast("You're all caught up — no more posts to load") }}
                                >
                                    {loadedAll ? 'No more posts' : 'Load more'}
                                </button>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-4">
                            <div className="rounded-[28px] border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-sm">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-title-lg font-semibold">Explore Other Posts</h3>
                                    <span className="rounded-full bg-primary/10 px-3 py-1 text-label-sm text-primary">Discover</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-low p-3">
                                        <p className="mb-2 text-sm font-semibold text-primary">Latest posts</p>
                                        <div className="space-y-2">
                                            {EXPLORE_POSTS.map((ep, i) => (
                                                <button
                                                    key={i}
                                                    className="w-full rounded-xl border border-outline-variant/30 bg-surface p-3 text-left transition-all duration-200 hover:border-primary/40 hover:bg-surface-container-high hover:translate-x-1"
                                                    type="button"
                                                    onClick={() => setModal({ open: true, org: ep.org, title: ep.title, body: ep.body, meta: ep.meta })}
                                                >
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div>
                                                            <p className="font-semibold text-on-surface">{ep.org}</p>
                                                            <p className="mt-1 text-sm text-on-surface-variant">{ep.preview}</p>
                                                        </div>
                                                        <span className="material-symbols-outlined text-[18px] text-primary">chevron_right</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {showAllExplore && (
                                        <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                                            {EXPLORE_POSTS.map((ep, i) => (
                                                <button
                                                    key={i}
                                                    className="w-full rounded-xl border border-outline-variant/30 bg-surface p-3 text-left transition-colors hover:border-primary/30 hover:bg-surface-container-high"
                                                    type="button"
                                                    onClick={() => setModal({ open: true, org: ep.org, title: ep.title, body: ep.body, meta: ep.meta })}
                                                >
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div>
                                                            <p className="font-semibold text-on-surface">{ep.org}</p>
                                                            <p className="mt-1 text-sm text-on-surface-variant">{ep.preview}</p>
                                                        </div>
                                                        <span className="material-symbols-outlined text-[18px] text-primary">chevron_right</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex justify-center">
                                        <button
                                            className="rounded-full border border-primary/20 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                                            type="button"
                                            onClick={() => setShowAllExplore(v => !v)}
                                        >
                                            {showAllExplore ? 'Hide posts' : 'View all posts'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="soft-card premium-card rounded-[28px] p-5">
                                <h3 className="text-title-lg font-semibold">Posting Tips</h3>
                                <div className="mt-3 space-y-3">
                                    <p className="flex items-start gap-2 text-sm text-on-surface-variant"><span className="material-symbols-outlined text-[18px] text-tertiary">check_circle</span> Mention deadlines to create urgency.</p>
                                    <p className="flex items-start gap-2 text-sm text-on-surface-variant"><span className="material-symbols-outlined text-[18px] text-tertiary">check_circle</span> Add a clear image to boost engagement.</p>
                                    <p className="flex items-start gap-2 text-sm text-on-surface-variant"><span className="material-symbols-outlined text-[18px] text-tertiary">check_circle</span> Keep updates short and specific.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Mobile Navigation Drawer */}
            <div className="mobile-nav-overlay" id="org-mobile-overlay" />
            <nav className="mobile-nav-drawer" id="org-mobile-drawer" aria-label="Organizer navigation">
                <button className="mobile-nav-close" id="org-nav-close" aria-label="Close navigation">
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
                </button>
                <Link className="flex items-center gap-3 mb-2" to="/">
                    <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>hub</span>
                    <span className="font-bold text-headline-md text-primary" style={{ fontFamily: "var(--font-display)" }}>EVENTIFY</span>
                </Link>
                <span className="admin-badge mb-6 w-fit">Organizer console</span>
                <div className="nav-group flex flex-1 flex-col gap-1">
                    <Link className="nav-link" to="/org/dashboard"><span className="material-symbols-outlined" aria-hidden="true">dashboard</span>Dashboard</Link>
                    <Link className="nav-link" to="/org/posts" aria-current="page"><span className="material-symbols-outlined" aria-hidden="true">campaign</span>Posts</Link>
                    <Link className="nav-link" to="/org/profile"><span className="material-symbols-outlined" aria-hidden="true">apartment</span>Organization Profile</Link>
                    <Link className="nav-link" to="/org/opportunities"><span className="material-symbols-outlined" aria-hidden="true">event_note</span>My Opportunities</Link>
                    <Link className="nav-link" to="/org/create-event"><span className="material-symbols-outlined" aria-hidden="true">add_circle</span>Create Event</Link>
                    <Link className="nav-link" to="/org/applicants"><span className="material-symbols-outlined" aria-hidden="true">group</span>Applicants</Link>
                    <Link className="nav-link" to="/org/report-center"><span className="material-symbols-outlined" aria-hidden="true">bar_chart</span>Reports</Link>
                    <Link className="nav-link" to="/org/settings"><span className="material-symbols-outlined" aria-hidden="true">settings</span>Settings</Link>
                </div>
                <div className="mt-auto rounded-2xl bg-surface-container p-4">
                    <p className="mb-2 text-label-sm font-label-sm text-on-surface-variant">ORGANIZATION</p>
                    <p className="mb-1 font-label-md text-label-md text-on-surface font-semibold">TechGenius Labs</p>
                    <p className="text-label-sm font-label-sm text-success">Verified organizer since 2024</p>
                </div>
            </nav>

            {/* Explore Post Modal */}
            {modal.open && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
                    onClick={e => { if (e.target === e.currentTarget) setModal(m => ({ ...m, open: false })) }}
                >
                    <div className="soft-card w-full max-w-lg rounded-[30px] border border-outline-variant/50 p-6 shadow-2xl">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-label-md font-semibold text-primary">{modal.org}</p>
                                <h3 className="mt-1 text-title-lg font-semibold text-on-surface">{modal.title}</h3>
                            </div>
                            <button className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high" type="button" aria-label="Close post details" onClick={() => setModal(m => ({ ...m, open: false }))}>
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        </div>
                        <p className="mt-4 text-body-md text-on-surface-variant">{modal.body}</p>
                        <div className="mt-6 flex items-center justify-between rounded-xl bg-surface-container p-3 text-sm text-on-surface-variant">
                            <span>{modal.meta}</span>
                            <button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-on-primary" type="button" onClick={() => setModal(m => ({ ...m, open: false }))}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
