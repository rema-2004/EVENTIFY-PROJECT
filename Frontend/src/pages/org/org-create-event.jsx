import { Fragment, useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppPageHead from '../../components/app/AppPageHead'
import { useOrgPageControls } from './useOrgPageControls.js'
import { toast } from '../../utils/toast.js'
import LangToggleBtn from '../../components/org/LangToggleBtn'
import '../../styles/org/sidebar.css'
import '../../styles/admin/admin.css'
import '../../styles/org/org-dashboard.css'
import '../../styles/org/org-create-event.css'

const DRAFT_KEY = 'eventify:event-draft'
const CATEGORIES = ['Competition', 'Event', 'Workshop', 'Course']
const CATEGORY_ICONS = {
    Competition: 'emoji_events',
    Event:       'event',
    Workshop:    'build',
    Course:      'school',
}
const COMPETITION_ONLY = ['prize', 'teamSize']
const LABELS = {
    title:        'Event title',
    category:     'Category',
    location:     'Location',
    startDate:    'Start date',
    endDate:      'End date',
    description:  'Description',
    requirements: 'Requirements',
    prize:        'Prize / scholarship',
    teamSize:     'Team size',
}

function escapeHtml(v) {
    return v.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}

export default function OrgCreateEvent() {
    useOrgPageControls()
    const navigate = useNavigate()
    const formRef = useRef(null)

    const [step, setStep] = useState(1)
    const [category, setCategory] = useState(() => {
        try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}').category || 'Competition' } catch { return 'Competition' }
    })
    const [catOpen, setCatOpen] = useState(false)
    const [coverName, setCoverName] = useState(null)
    const [reviewData, setReviewData] = useState({})
    const [publishing, setPublishing] = useState(false)

    // Restore draft on mount
    useEffect(() => {
        try {
            const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}')
            const form = formRef.current
            if (!form) return
            Object.entries(draft).forEach(([name, value]) => {
                const field = form.elements[name]
                if (field && value) field.value = value
            })
        } catch {}
    }, [])

    // Close category dropdown on outside click
    useEffect(() => {
        if (!catOpen) return
        const handler = (e) => {
            const toggle = document.getElementById('org-category-toggle')
            const panel = document.getElementById('org-category-panel')
            if (!panel?.contains(e.target) && e.target !== toggle) setCatOpen(false)
        }
        document.addEventListener('click', handler)
        return () => document.removeEventListener('click', handler)
    }, [catOpen])

    function getValues() {
        const form = formRef.current
        if (!form) return {}
        const isComp = category === 'Competition'
        const data = {}
        Object.keys(LABELS).forEach(name => {
            if (!isComp && COMPETITION_ONLY.includes(name)) return
            const field = form.elements[name]
            if (field) data[name] = field.value.trim()
        })
        data.category = category
        return data
    }

    function saveDraft() {
        try { localStorage.setItem(DRAFT_KEY, JSON.stringify(getValues())) } catch {}
    }

    function validateStep1() {
        const vals = getValues()
        if (!vals.title) {
            toast('Add an event title first', 'error')
            formRef.current?.elements.title?.focus()
            return false
        }
        if (!vals.startDate) {
            toast('Please select a start date', 'error')
            formRef.current?.elements.startDate?.focus()
            return false
        }
        if (!vals.endDate) {
            toast('Please select an end date', 'error')
            formRef.current?.elements.endDate?.focus()
            return false
        }
        if (vals.endDate < vals.startDate) {
            toast('End date cannot be before the start date', 'error')
            return false
        }
        if (!vals.description) {
            toast('Add a description so participants know what to expect', 'error')
            formRef.current?.elements.description?.focus()
            return false
        }
        return true
    }

    function goTo(target) {
        if (target === 2) setReviewData(getValues())
        setStep(target)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    function handleNext() {
        if (step === 1 && !validateStep1()) return
        saveDraft()
        goTo(step + 1)
    }

    function handleCategorySelect(val) {
        setCategory(val)
        if (val !== 'Competition') {
            COMPETITION_ONLY.forEach(name => {
                const field = formRef.current?.elements[name]
                if (field) field.value = ''
            })
        }
        setCatOpen(false)
    }

    function handlePublish() {
        saveDraft()
        setPublishing(true)
        toast('Event submitted for approval', 'success')
        setTimeout(() => navigate('/org/dashboard'), 1600)
    }

    const isComp = category === 'Competition'

    return (
        <>
            <AppPageHead title="Create Event | EVENTIFY" />
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
                    <Link className="flex items-center gap-3 mb-2" to="/">
                        <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>hub</span>
                        <span className="font-bold text-headline-md text-primary" style={{ fontFamily: "var(--font-display)" }}>EVENTIFY</span>
                    </Link>
                    <span className="admin-badge mb-8 w-fit">Organizer console</span>
                    <nav className="flex flex-1 flex-col gap-1" aria-label="Organizer sections">
                        <div className="nav-group">
                            <Link className="nav-link" to="/org/dashboard"><span className="material-symbols-outlined" aria-hidden="true">dashboard</span>Dashboard</Link>
                            <Link className="nav-link" to="/org/posts"><span className="material-symbols-outlined" aria-hidden="true">campaign</span>Posts</Link>
                            <Link className="nav-link" to="/org/profile"><span className="material-symbols-outlined" aria-hidden="true">apartment</span>Organization Profile</Link>
                            <Link className="nav-link" to="/org/opportunities"><span className="material-symbols-outlined" aria-hidden="true">event_note</span>My Opportunities</Link>
                            <Link className="nav-link" to="/org/create-event" aria-current="page"><span className="material-symbols-outlined" aria-hidden="true">add_circle</span>Create Event</Link>
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
                <main className="flex-1 w-full px-4 md:px-12 pt-6 pb-24 lg:pb-8">
                    <div className="org-topbar">
                        <h1 className="org-topbar__title">Create Event</h1>
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
                            <span className="font-semibold text-on-surface">Create Event</span>
                        </div>
                        <p className="profile-page-desc">Submitted events are reviewed by our team before they go live.</p>
                    </div>
                    <div className="mx-auto w-full max-w-4xl">
                        {/* Step Indicator */}
                        <div className="wizard-stepper" id="wizard-steps" role="tablist" aria-label="Creation Steps">
                            {[1, 2, 3].map((n, i) => (
                                <Fragment key={n}>
                                    {i > 0 && <span className="stepper-sep">•</span>}
                                    <span
                                        className={`wizard-chip${step === n ? ' active' : ''}${step > n ? ' completed' : ''}`}
                                        data-step-chip={n}
                                    >
                                        <span className="chip-num">{n}</span>{' '}
                                        {['Event Details', 'Review', 'Publish'][i]}
                                    </span>
                                </Fragment>
                            ))}
                        </div>
                        {/* Wizard Form */}
                        <form
                            className="wizard-form-card"
                            id="event-wizard"
                            ref={formRef}
                            noValidate
                            onInput={saveDraft}
                            onSubmit={e => e.preventDefault()}
                        >
                            {/* Step 1: Event Details */}
                            <section className={step === 1 ? 'flex flex-col gap-6 row-animated' : 'hidden'} data-step={1}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="ev-title">
                                        Event Title <span style={{ color: "var(--accent)" }}>*</span>
                                    </label>
                                    <input className="form-input" id="ev-title" name="title" placeholder="e.g. Global AI Innovation Challenge" required type="text" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Category Dropdown */}
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="ev-type">
                                            Category <span style={{ color: "var(--accent)" }}>*</span>
                                        </label>
                                        <div className="org-cat-dropdown">
                                            <button
                                                type="button"
                                                className="org-cat-btn"
                                                id="org-category-toggle"
                                                aria-haspopup="listbox"
                                                aria-expanded={catOpen}
                                                aria-label="Select event category"
                                                onClick={(e) => { e.stopPropagation(); setCatOpen(o => !o) }}
                                            >
                                                <div className="btn-left">
                                                    <span className="material-symbols-outlined cat-icon" aria-hidden="true">{CATEGORY_ICONS[category]}</span>
                                                    <span id="org-category-selected-name">{category}</span>
                                                </div>
                                                <span className="material-symbols-outlined chevron-icon" aria-hidden="true">expand_more</span>
                                            </button>
                                            <div
                                                className="org-cat-panel"
                                                id="org-category-panel"
                                                hidden={!catOpen}
                                                role="listbox"
                                                aria-label="Event categories"
                                            >
                                                {CATEGORIES.map(cat => (
                                                    <button
                                                        key={cat}
                                                        type="button"
                                                        className={`org-cat-item${category === cat ? ' active' : ''}`}
                                                        data-value={cat}
                                                        role="option"
                                                        aria-selected={category === cat}
                                                        onClick={(e) => { e.stopPropagation(); handleCategorySelect(cat) }}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span className="material-symbols-outlined cat-icon" aria-hidden="true">{CATEGORY_ICONS[cat]}</span>
                                                            <span>{cat}</span>
                                                        </span>
                                                        <span className="material-symbols-outlined active-check" aria-hidden="true">check</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <select id="ev-type" name="category" className="sr-only" aria-hidden="true" tabIndex={-1} value={category} onChange={e => handleCategorySelect(e.target.value)}>
                                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="ev-location">Location</label>
                                        <input className="form-input" id="ev-location" name="location" placeholder="e.g. Remote, Amman, JO or Online" type="text" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="ev-start">
                                            Start Date <span style={{ color: "var(--accent)" }}>*</span>
                                        </label>
                                        <input className="form-input" id="ev-start" name="startDate" type="date" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="ev-end">
                                            End Date <span style={{ color: "var(--accent)" }}>*</span>
                                        </label>
                                        <input className="form-input" id="ev-end" name="endDate" type="date" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="ev-desc">
                                        Description <span style={{ color: "var(--accent)" }}>*</span>
                                    </label>
                                    <textarea className="form-textarea" id="ev-desc" name="description" placeholder="Describe the challenge, agenda, and what participants will build or learn." rows={4} required defaultValue="" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="ev-cond">Requirements / Conditions</label>
                                    <textarea className="form-textarea" id="ev-cond" name="requirements" placeholder="Team size, eligibility, required skills..." rows={3} defaultValue="" />
                                </div>
                                {isComp && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="ev-competition-fields">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="ev-prize">Prize / Scholarship</label>
                                            <input className="form-input" id="ev-prize" name="prize" placeholder="e.g. $10,000 Prize Pool" type="text" />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="ev-team">Team Size</label>
                                            <input className="form-input" id="ev-team" name="teamSize" placeholder="e.g. 2-4 members" type="text" />
                                        </div>
                                    </div>
                                )}
                                <div className="form-group">
                                    <label className="form-label" htmlFor="ev-cover">Cover Image</label>
                                    <label className="upload-dropzone" htmlFor="ev-cover">
                                        <span className="upload-dropzone__icon">
                                            <span className="material-symbols-outlined" aria-hidden="true">upload</span>
                                        </span>
                                        <p className="upload-dropzone__label" id="ev-cover-label">
                                            {coverName ?? 'Drag and drop, or click to upload cover image'}
                                        </p>
                                        <span className="upload-dropzone__hint">PNG, JPG or JPEG (max. 5MB)</span>
                                    </label>
                                    <input
                                        accept="image/*"
                                        className="sr-only"
                                        id="ev-cover"
                                        name="cover"
                                        type="file"
                                        onChange={e => setCoverName(e.target.files?.[0]?.name ?? null)}
                                    />
                                </div>
                            </section>

                            {/* Step 2: Review */}
                            <section className={step === 2 ? 'flex flex-col gap-5 row-animated' : 'hidden'} data-step={2}>
                                <div>
                                    <h3 className="font-headline-lg text-title-lg text-on-surface mb-1">Review your event details</h3>
                                    <p style={{ fontSize: "13.5px", color: "var(--text-muted)" }}>
                                        Check the details below before submitting. You can go back to edit any section.
                                    </p>
                                </div>
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4" id="wizard-review">
                                    {Object.entries(LABELS)
                                        .filter(([name]) => isComp || !COMPETITION_ONLY.includes(name))
                                        .map(([name, label], idx) => (
                                            <div key={name} className="review-card row-animated" style={{ '--stagger-idx': idx }}>
                                                <dt className="review-label">{label}</dt>
                                                <dd className="review-value">
                                                    {reviewData[name]
                                                        ? <span dangerouslySetInnerHTML={{ __html: escapeHtml(reviewData[name]) }} />
                                                        : <span style={{ color: 'var(--text-muted)' }}>Not provided</span>
                                                    }
                                                </dd>
                                            </div>
                                        ))
                                    }
                                </dl>
                            </section>

                            {/* Step 3: Publish */}
                            <section className={step === 3 ? 'flex flex-col items-center gap-3 py-6 text-center row-animated' : 'hidden'} data-step={3}>
                                <div className="publish-success-card">
                                    <div className="publish-icon animate-[successPop_0.4s_cubic-bezier(0.16,1,0.3,1)]">
                                        <span className="material-symbols-outlined" aria-hidden="true">task_alt</span>
                                    </div>
                                    <h3 className="font-headline-lg text-title-lg text-on-surface">Ready to Submit for Approval</h3>
                                    <p style={{ fontSize: "13.5px", color: "var(--text-muted)", maxWidth: 440, margin: "0 auto" }}>
                                        Publishing sends the event to the EVENTIFY review team. You will receive a notification once it is approved and live for participants.
                                    </p>
                                </div>
                            </section>

                            {/* Action Button Bar */}
                            <div className="wizard-actions">
                                <Link className="wizard-cancel-link" to="/org/dashboard">Cancel</Link>
                                <div className="flex items-center gap-3">
                                    {step > 1 && (
                                        <button className="btn-secondary" id="wizard-back" type="button" onClick={() => goTo(step - 1)}>Back</button>
                                    )}
                                    <button className="btn-secondary" id="wizard-draft" type="button" onClick={() => { saveDraft(); toast('Draft saved on this device', 'success') }}>
                                        Save Draft
                                    </button>
                                    {step < 3 && (
                                        <button className="btn-primary" id="wizard-next" type="button" style={{ minWidth: 130 }} onClick={handleNext}>
                                            {step === 2 ? 'Continue to publish' : 'Next'}
                                        </button>
                                    )}
                                    {step === 3 && (
                                        <button className="btn-primary" id="wizard-publish" type="button" style={{ minWidth: 130 }} disabled={publishing} onClick={handlePublish}>
                                            {publishing ? 'Published' : 'Publish'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
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
                    <Link className="nav-link" to="/org/posts"><span className="material-symbols-outlined" aria-hidden="true">campaign</span>Posts</Link>
                    <Link className="nav-link" to="/org/profile"><span className="material-symbols-outlined" aria-hidden="true">apartment</span>Organization Profile</Link>
                    <Link className="nav-link" to="/org/opportunities"><span className="material-symbols-outlined" aria-hidden="true">event_note</span>My Opportunities</Link>
                    <Link className="nav-link" to="/org/create-event" aria-current="page"><span className="material-symbols-outlined" aria-hidden="true">add_circle</span>Create Event</Link>
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
        </>
    )
}
