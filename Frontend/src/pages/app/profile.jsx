import AppPageHead from '../../components/app/AppPageHead'
import AppFooter from '../../components/app/AppFooter'
import { Link } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { useLanguage } from '../../hooks/useLanguage'
import { useState, useRef, useEffect } from 'react'

const DEFAULT_COVER = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeHOaLhImSXpSf94lw-SYxPYBwlc5gBXk7btOOFAhqx_oZFBSKtgn_P2pIGvFfCBhoMLxLxt6nkAaVv6TstLXm2DSDLS1AOT6QH_IRGTfXo2OtjjsArXHvWKur1GZZ2eDK6qHuSbQcfxMGo0fzNj2QnZzFWPIyhuDuCUdRosBAChWJFtM6RTcO8__ey71pVTFe5E9QEaseLBt6QNApMCSG2FDAAUMEE4xtjtfwbTwTctscv_cpXmi6Kt9_szB4pNw3Yn5KbAGVUlRw'
const DEFAULT_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsQh5xOHYdmYcFmjJRpba3iiPC5g3JPTyK7qlEyYGrWLO_FtAHZOzRW4cX1RMPUClIy0d90XrNRLcOHNKGQkJKGdAt1u1Ukq4lYdrRDfJqdzzKVIyNbQ2FgWThdiwD06oY_uvI63tt40yB9wAi_f92Yb_O6IrGry-GNDu_3j-NEv3cU8WRQgm1fNlsToUpHXTKZszchQ4CRvtQhgyxMTzzWqjh7YpyYoacng83yN5O38dvrRRbO8B2iYc2p5lfWbCbUaTJ-KCVF07o'

const PROFILE_KEY = 'eventify:participant-profile'
const SKILL_STYLES = [
    'bg-primary/5 text-primary border border-primary/10',
    'bg-secondary/5 text-secondary border border-secondary/10',
    'bg-surface-container-high text-on-surface-variant',
]

// Shared look for the edit dialog: every button gets a hover lift and a visible press.
const PRESS = 'transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 active:brightness-90'
const INPUT = 'w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-on-surface outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/20'
const LABEL = 'flex flex-col gap-1 font-label-md text-label-md text-on-surface'
const LEGEND = 'flex items-center gap-2 px-2 font-label-md text-label-md font-semibold text-on-surface'

function loadProfile() {
    try {
        return JSON.parse(localStorage.getItem(PROFILE_KEY)) || null
    } catch {
        return null
    }
}

export default function Profile() {
    const { setTheme } = useTheme()
    const { language, toggleLanguage } = useLanguage()
    const ar = language === 'ar'

    // Fields the participant has edited; anything missing falls back to the built-in sample text.
    const [saved, setSaved] = useState(loadProfile)
    const [editOpen, setEditOpen] = useState(false)
    const [draft, setDraft] = useState(null)
    const [editError, setEditError] = useState('')

    const [coverImg, setCoverImg] = useState(DEFAULT_COVER)
    const [cvFile, setCvFile] = useState(null)
    const [certModal, setCertModal] = useState(null)
    const [toast, setToast] = useState(null)

    const coverInputRef = useRef(null)
    const cvInputRef = useRef(null)

    const showToast = (msg, tone = 'success') => {
        setToast({ msg, tone })
        setTimeout(() => setToast(null), 2800)
    }

    const handleCoverChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setCoverImg(URL.createObjectURL(file))
            showToast(ar ? 'تم تحديث صورة الغلاف' : 'Cover photo updated')
        }
    }

    const handleCvChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setCvFile(file)
            showToast(ar ? `تم رفع ${file.name} بنجاح` : `${file.name} uploaded successfully`)
        }
    }

    const handlePreviewCv = () => {
        if (cvFile) {
            window.open(URL.createObjectURL(cvFile), '_blank')
        } else {
            showToast(ar ? 'لا يوجد ملف محدّث، يتم فتح السيرة الأخيرة' : 'Opening last saved CV')
        }
    }

    const defaults = {
        name: 'ALI',
        headline: ar ? 'طالب أبحاث ذكاء اصطناعي وقائد فريق هاكاثون' : 'AI Research Student & Hackathon Team Lead',
        location: ar ? 'عمّان، الأردن • 3 هاكاثونات فائزة' : 'Amman, Jordan • 3 Hackathons Won',
        about: ar
            ? 'شغوف بالتقاطع بين الذكاء الاصطناعي وتفاعل الإنسان مع الحاسوب. أمضيت السنتين الماضيتين في بناء مشاريع جانبية مدعومة بالذكاء الاصطناعي وقيادة الفرق في هاكاثونات الجامعة. أبحث حاليًا عن مسابقات وورش عمل لتطوير مهاراتي في تعلم الآلة وبناء المنتجات عبر Eventify.'
            : 'Passionate about the intersection of Artificial Intelligence and Human-Computer Interaction. I\'ve spent the past two years building AI-driven side projects and leading teams through university hackathons. Currently looking for competitions and workshops that sharpen my machine learning and product skills through Eventify.',
    }
    const profile = { ...defaults, ...(saved || {}) }

    // `focus` ('experience' | 'projects') appends a blank entry and scrolls the form to that section.
    const openEdit = (focus) => {
        const experience = (saved?.experience ?? EXPERIENCE).map(({ title, org, period, desc }) => ({ title, org, period, desc }))
        const projects = (saved?.projects ?? DEFAULT_PROJECTS).map(({ title, desc }) => ({ title, desc }))
        if (focus === 'experience') experience.push({ title: '', org: '', period: '', desc: '' })
        if (focus === 'projects') projects.push({ title: '', desc: '' })
        setDraft({ ...profile, skills: (saved?.skills ?? SKILLS.map((s) => s.label)).join(', '), experience, projects })
        setEditError('')
        setEditOpen(true)
        if (typeof focus === 'string') {
            setTimeout(() => document.getElementById(`edit-${focus}`)?.scrollIntoView({ block: 'start' }), 50)
        }
    }

    const updateItem = (list, index, key, value) =>
        setDraft((d) => ({ ...d, [list]: d[list].map((item, i) => (i === index ? { ...item, [key]: value } : item)) }))
    const removeItem = (list, index) => setDraft((d) => ({ ...d, [list]: d[list].filter((_, i) => i !== index) }))
    const addItem = (list, blank) => setDraft((d) => ({ ...d, [list]: [...d[list], blank] }))

    const handleSaveProfile = (e) => {
        e.preventDefault()
        const keepFilled = (list, requiredKey) => list
            .map((item) => Object.fromEntries(Object.entries(item).map(([k, v]) => [k, v.trim()])))
            .filter((item) => item[requiredKey])
        const next = {
            name: draft.name.trim(),
            headline: draft.headline.trim(),
            location: draft.location.trim(),
            about: draft.about.trim(),
            skills: draft.skills.split(/[,،]/).map((s) => s.trim()).filter(Boolean),
            experience: keepFilled(draft.experience, 'title'),
            projects: keepFilled(draft.projects, 'title'),
        }
        if (!next.name) {
            setEditError(ar ? 'الاسم مطلوب' : 'Name is required')
            return
        }
        try { localStorage.setItem(PROFILE_KEY, JSON.stringify(next)) } catch { /* storage unavailable */ }
        setSaved(next)
        setEditOpen(false)
        showToast(ar ? 'تم حفظ الملف الشخصي' : 'Profile saved')
    }

    // While the dialog is open the page behind it must not scroll; Escape closes it.
    useEffect(() => {
        if (!editOpen) return undefined
        const previous = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        const onKey = (e) => { if (e.key === 'Escape') setEditOpen(false) }
        window.addEventListener('keydown', onKey)
        return () => {
            document.body.style.overflow = previous
            window.removeEventListener('keydown', onKey)
        }
    }, [editOpen])

    const NAV_LINKS = [
        { to: '/app', icon: 'home', label: ar ? 'الرئيسية' : 'Home' },
        { to: '/app/my-applications', icon: 'assignment_turned_in', label: ar ? 'فعالياتي' : 'My Event' },
        { to: '/app/posts', icon: 'campaign', label: ar ? 'المنشورات' : 'Posts' },
        { to: '/app/notifications', icon: 'notifications', label: ar ? 'الإشعارات' : 'Notifications' },
        { to: '/app/saved', icon: 'bookmark', label: ar ? 'المحفوظات' : 'Saved' },
    ]

    const STATS = [
        { icon: 'emoji_events', color: 'text-primary', bg: 'bg-primary/10', value: '7', label: ar ? 'مسابقات انضممت إليها' : 'Competitions Joined', sub: ar ? '+2 هذا العام' : '+2 this year' },
        { icon: 'bookmark_added', color: 'text-secondary', bg: 'bg-secondary/10', value: '18', label: ar ? 'فرص محفوظة' : 'Saved Opportunities', sub: ar ? 'جديد' : 'New' },
        { icon: 'group', color: 'text-tertiary', bg: 'bg-tertiary/10', value: '4', label: ar ? 'فرق قدتها' : 'Teams Led', sub: ar ? 'أعلى 5%' : 'Top 5%' },
    ]

    const EXPERIENCE = [
        {
            icon: 'hub', iconColor: 'text-primary',
            title: ar ? 'قائد فريق، تحدي الابتكار العالمي بالذكاء الاصطناعي' : 'Team Lead, Global AI Innovation Challenge',
            org: ar ? 'هاكاثون Eventify • وُجد عبر Eventify' : 'Eventify Hackathon • Found via Eventify', orgColor: 'text-primary',
            period: ar ? 'أكتوبر 2024 • فريق من 4 أشخاص' : 'Oct 2024 • 4-person team',
            desc: ar ? 'قدت فريقًا من 4 أشخاص خلال هاكاثون 48 ساعة، وبنينا نظام توصية بالفرص مدعوم بالذكاء الاصطناعي حل ضمن أفضل 3.' : 'Led a 4-person team through a 48-hour hackathon, building an AI-powered opportunity matcher that placed in the top 3.',
        },
        {
            icon: 'terminal', iconColor: 'text-secondary',
            title: ar ? 'متدرب تعلم آلة' : 'Machine Learning Intern',
            org: ar ? 'مختبر أبحاث الجامعة • 3 أشهر' : 'University Research Lab • 3 months', orgColor: 'text-secondary',
            period: ar ? 'صيف 2024' : 'Summer 2024',
            desc: ar ? 'بنيت ونقّيت نماذج توصية لمشروع بحثي جامعي حول مسارات التعلم الشخصية.' : 'Built and evaluated recommendation models for a university research project on personalized learning paths.',
        },
    ]

    const SKILLS = [
        { label: ar ? 'الذكاء الاصطناعي' : 'Artificial Intelligence', cls: 'bg-primary/5 text-primary border border-primary/10' },
        { label: ar ? 'تصميم UX/UI' : 'UI/UX Design', cls: 'bg-secondary/5 text-secondary border border-secondary/10' },
        { label: ar ? 'استراتيجية المنتج' : 'Product Strategy', cls: 'bg-surface-container-high text-on-surface-variant' },
        { label: 'Web3', cls: 'bg-surface-container-high text-on-surface-variant' },
        { label: ar ? 'هندسة الأنظمة' : 'System Architecture', cls: 'bg-surface-container-high text-on-surface-variant' },
        { label: ar ? 'تعلم الآلة' : 'Machine Learning', cls: 'bg-primary/5 text-primary border border-primary/10' },
        { label: ar ? 'إتقان Figma' : 'Figma Mastery', cls: 'bg-secondary/5 text-secondary border border-secondary/10' },
    ]

    const CERTS = [
        { id: '4471', title: ar ? 'متخصص ذكاء اصطناعي معتمد من Eventify' : 'Eventify Certified AI Specialist', sub: ar ? 'مسار التعلم بالذكاء الاصطناعي - مايو 2025' : 'AI learning path - May 2025' },
        { id: '3892', title: ar ? 'تميّز UX من Eventify' : 'Eventify UX Excellence', sub: ar ? 'مسار UX المتقدم - فبراير 2025' : 'Advanced UX track - Feb 2025' },
        { id: '3105', title: ar ? 'نمو مهني من Eventify' : 'Eventify Career Growth', sub: ar ? 'برنامج التطوير المهني - ديسمبر 2024' : 'Career development program - Dec 2024' },
        { id: '2847', title: ar ? 'إتقان البيانات من Eventify' : 'Eventify Data Mastery', sub: ar ? 'مسار إتقان البيانات - أغسطس 2024' : 'Data mastery pathway - Aug 2024' },
    ]

    const DEFAULT_PROJECTS = [
                        {
                            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCpvGQnNSgyBkfeKNI1KzqCGukBowAFe9bpr4Biw9DbjP1RWrLw0k5LOSotFyKqYwFOuAfNA5pKZEB2JGkGyceEJOcskEeJ3yo6bIFV8xTMUMf4sUGXn8cX9PQ0WSUHozy4mjKLeDyW9_qm5Ahuab-hxhkgQbQWVKd3g45u-9iCZE0kxul3mTn4VVEYPZLfh6wNdWaxd9HHp_aUPHxbpnO1xmmAyEActsVW7OGdfVecfbEy6XWnJsSkhSZ4VV2X6d_8jAlbyg8cDWL',
                            title: ar ? 'NeuralMesh — محرك تطابق الفرص بالذكاء الاصطناعي' : 'NeuralMesh — AI Opportunity Matcher',
                            desc: ar ? 'المركز الثالث في تحدي الابتكار العالمي: محرك توصية يطابق الطلاب بالمسابقات.' : 'Top 3 finish at the Global AI Innovation Challenge: a recommendation engine that matches students to competitions.',
                        },
                        {
                            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEJY6yyoRdZ_CRUZSXJwzE3ox-OqrFeSHeY3Oo3ym3Xxnd9ro2HyG2GyX1Z6xfO1A8KB3Bp-h-CTp6Ek3EOsKXNaeValVc4zw9Vwfq7pUDeqnMN0grO7waWQreeR8Y-ZWPiHh8fy9vmEUKkRt4_gOGVz6EFbqboaKUe5WSe4Ql4XQWITBfhfS2IR3XHHePa02Dw2grCSlvjWwGvmP4xHq2cSiydzuQY0tVFdV-H9SQe0YH60IcWOn_nA-ztK2kYf8KXUEXADThyjTS',
                            title: ar ? 'نموذج مسار التعلم الشخصي' : 'Personalized Learning Path Model',
                            desc: ar ? 'مشروع بحثي جامعي يوصي بتسلسلات الدورات بناءً على الفجوات المهارية للطالب.' : 'University research project recommending course sequences based on a student\'s skill gaps.',
                        },
    ]

    const shownExperience = saved?.experience
        ? saved.experience.map((item, i) => ({ icon: i % 2 ? 'terminal' : 'hub', iconColor: i % 2 ? 'text-secondary' : 'text-primary', orgColor: i % 2 ? 'text-secondary' : 'text-primary', ...item }))
        : EXPERIENCE
    const shownProjects = saved?.projects
        ? saved.projects.map((item) => ({ img: DEFAULT_PROJECTS.find((d) => d.title === item.title)?.img, ...item }))
        : DEFAULT_PROJECTS

    return (
        <>
            <AppPageHead title={ar ? 'الملف الشخصي | EVENTIFY' : 'Profile | EVENTIFY'} />

            {/* Hidden file inputs */}
            <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
            <input ref={cvInputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={handleCvChange} />

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 px-5 py-3 rounded-full shadow-xl font-label-md text-white" style={{ backgroundColor: toast.tone === 'success' ? '#1e7a4f' : '#FF4D2E' }}>
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                        {toast.tone === 'success' ? 'check_circle' : 'info'}
                    </span>
                    {toast.msg}
                </div>
            )}

            {/* Edit Profile Modal */}
            {editOpen && draft && (
                <div className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-sm flex items-center justify-center p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) setEditOpen(false) }}>
                    <form
                        className="ev-fade-up bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-gray-100 dark:border-white/10"
                        dir={ar ? 'rtl' : 'ltr'}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="edit-profile-title"
                        onClick={(e) => e.stopPropagation()}
                        onSubmit={handleSaveProfile}
                        noValidate
                    >
                        <header className="shrink-0 flex items-start justify-between gap-4 px-6 py-4 border-b border-outline-variant/40">
                            <div>
                                <h3 id="edit-profile-title" className="text-lg font-bold text-gray-900 dark:text-white">{ar ? 'تعديل الملف الشخصي' : 'Edit Profile'}</h3>
                                <p className="text-sm text-on-surface-variant">{ar ? 'حدّث بياناتك وسيظهر التعديل في ملفك مباشرة.' : 'Update your details and they show on your profile right away.'}</p>
                            </div>
                            <button type="button" className={`${PRESS} w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container`} aria-label={ar ? 'إغلاق' : 'Close'} onClick={() => setEditOpen(false)}>
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </header>

                        <div data-edit-body className="flex-1 overflow-y-auto overscroll-contain px-6 py-5 space-y-5">
                            <fieldset className="space-y-3 rounded-xl border border-outline-variant/50 p-4">
                                <legend className={LEGEND}><span className="material-symbols-outlined text-[18px] text-primary">person</span>{ar ? 'المعلومات الأساسية' : 'Basics'}</legend>
                                {[
                                    { key: 'name', label: ar ? 'الاسم' : 'Name', max: 60 },
                                    { key: 'headline', label: ar ? 'المسمى التعريفي' : 'Headline', max: 100 },
                                    { key: 'location', label: ar ? 'الموقع' : 'Location', max: 100 },
                                ].map(({ key, label, max }) => (
                                    <label key={key} className={LABEL}>
                                        {label}
                                        <input className={INPUT} maxLength={max} value={draft[key]} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} />
                                    </label>
                                ))}
                                <label className={LABEL}>
                                    {ar ? 'نبذة عني' : 'About'}
                                    <textarea className={INPUT} rows={4} maxLength={600} value={draft.about} onChange={(e) => setDraft({ ...draft, about: e.target.value })} />
                                    <span className="text-xs text-outline">{draft.about.length} / 600</span>
                                </label>
                            </fieldset>

                            <fieldset className="space-y-3 rounded-xl border border-outline-variant/50 p-4">
                                <legend className={LEGEND}><span className="material-symbols-outlined text-[18px] text-primary">psychology</span>{ar ? 'المهارات' : 'Skills'}</legend>
                                <label className={LABEL}>
                                    {ar ? 'المهارات (افصل بينها بفاصلة)' : 'Skills (separate with commas)'}
                                    <input className={INPUT} value={draft.skills} onChange={(e) => setDraft({ ...draft, skills: e.target.value })} />
                                </label>
                            </fieldset>

                            <fieldset id="edit-experience" className="space-y-3 rounded-xl border border-outline-variant/50 p-4">
                                <legend className={LEGEND}><span className="material-symbols-outlined text-[18px] text-primary">work</span>{ar ? 'الخبرات' : 'Experience'}</legend>
                                {draft.experience.map((item, i) => (
                                    <div key={i} className="rounded-lg bg-surface-container-low p-3 space-y-2">
                                        {[
                                            { key: 'title', label: ar ? 'المسمى' : 'Title' },
                                            { key: 'org', label: ar ? 'الجهة' : 'Organization' },
                                            { key: 'period', label: ar ? 'الفترة' : 'Period' },
                                        ].map(({ key, label }) => (
                                            <input
                                                key={key}
                                                className={INPUT}
                                                aria-label={`${ar ? 'خبرة' : 'Experience'} ${i + 1} ${label}`}
                                                placeholder={label}
                                                maxLength={120}
                                                value={item[key]}
                                                onChange={(e) => updateItem('experience', i, key, e.target.value)}
                                            />
                                        ))}
                                        <textarea
                                            className={INPUT}
                                            aria-label={`${ar ? 'خبرة' : 'Experience'} ${i + 1} ${ar ? 'الوصف' : 'Description'}`}
                                            placeholder={ar ? 'الوصف' : 'Description'}
                                            rows={3}
                                            maxLength={400}
                                            value={item.desc}
                                            onChange={(e) => updateItem('experience', i, 'desc', e.target.value)}
                                        />
                                        <button type="button" className={`${PRESS} inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-error hover:bg-error/10`} onClick={() => removeItem('experience', i)}>
                                            <span className="material-symbols-outlined text-[16px]">delete</span>{ar ? 'حذف هذه الخبرة' : 'Remove this experience'}
                                        </button>
                                    </div>
                                ))}
                                <button type="button" className={`${PRESS} inline-flex items-center gap-1 rounded-full border border-primary/40 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5`} onClick={() => addItem('experience', { title: '', org: '', period: '', desc: '' })}>
                                    <span className="material-symbols-outlined text-[18px]">add</span>{ar ? 'إضافة خبرة' : 'Add experience'}
                                </button>
                            </fieldset>

                            <fieldset id="edit-projects" className="space-y-3 rounded-xl border border-outline-variant/50 p-4">
                                <legend className={LEGEND}><span className="material-symbols-outlined text-[18px] text-primary">rocket_launch</span>{ar ? 'المشاريع المميزة' : 'Featured Projects'}</legend>
                                {draft.projects.map((item, i) => (
                                    <div key={i} className="rounded-lg bg-surface-container-low p-3 space-y-2">
                                        <input
                                            className={INPUT}
                                            aria-label={`${ar ? 'مشروع' : 'Project'} ${i + 1} ${ar ? 'العنوان' : 'Title'}`}
                                            placeholder={ar ? 'عنوان المشروع' : 'Project title'}
                                            maxLength={120}
                                            value={item.title}
                                            onChange={(e) => updateItem('projects', i, 'title', e.target.value)}
                                        />
                                        <textarea
                                            className={INPUT}
                                            aria-label={`${ar ? 'مشروع' : 'Project'} ${i + 1} ${ar ? 'الوصف' : 'Description'}`}
                                            placeholder={ar ? 'الوصف' : 'Description'}
                                            rows={3}
                                            maxLength={400}
                                            value={item.desc}
                                            onChange={(e) => updateItem('projects', i, 'desc', e.target.value)}
                                        />
                                        <button type="button" className={`${PRESS} inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-error hover:bg-error/10`} onClick={() => removeItem('projects', i)}>
                                            <span className="material-symbols-outlined text-[16px]">delete</span>{ar ? 'حذف هذا المشروع' : 'Remove this project'}
                                        </button>
                                    </div>
                                ))}
                                <button type="button" className={`${PRESS} inline-flex items-center gap-1 rounded-full border border-primary/40 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5`} onClick={() => addItem('projects', { title: '', desc: '' })}>
                                    <span className="material-symbols-outlined text-[18px]">add</span>{ar ? 'إضافة مشروع' : 'Add project'}
                                </button>
                            </fieldset>
                        </div>

                        <footer className="shrink-0 flex items-center justify-between gap-3 px-6 py-4 border-t border-outline-variant/40 bg-white dark:bg-slate-800">
                            <p className="text-sm text-error" role="alert">{editError}</p>
                            <div className="flex gap-3">
                                <button type="button" className={`${PRESS} px-5 py-2.5 rounded-full border border-outline-variant font-label-md text-on-surface hover:bg-surface-container`} onClick={() => setEditOpen(false)}>
                                    {ar ? 'إلغاء' : 'Cancel'}
                                </button>
                                <button type="submit" className={`${PRESS} px-6 py-2.5 rounded-full font-semibold hover:shadow-lg`} style={{ backgroundColor: '#FF4D2E', color: '#ffffff' }}>
                                    {ar ? 'حفظ' : 'Save'}
                                </button>
                            </div>
                        </footer>
                    </form>
                </div>
            )}

            {/* Certificate Modal */}
            {certModal && (
                <div className="fixed inset-0 z-[9998] bg-black/60 flex items-center justify-center p-4" onClick={() => setCertModal(null)}>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-100 dark:border-white/10" onClick={(e) => e.stopPropagation()}>
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>workspace_premium</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{certModal.title}</h3>
                            <p className="font-body-sm text-body-sm text-gray-500 dark:text-gray-400">{certModal.sub}</p>
                            <div className="border border-dashed border-primary/40 rounded-xl p-4 bg-primary/5">
                                <p className="text-sm font-semibold text-primary">{ar ? 'شهادة موثّقة من EVENTIFY' : 'Verified by EVENTIFY'}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">ALI • ID: EV-2025-{certModal.id}</p>
                            </div>
                            <button className="w-full py-3 rounded-full font-semibold transition-opacity hover:opacity-85" style={{ backgroundColor: '#FF4D2E', color: '#ffffff' }} onClick={() => setCertModal(null)}>
                                {ar ? 'إغلاق' : 'Close'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div
                className="max-w-[1280px] mx-auto flex gap-6 px-container-margin-mobile md:px-container-margin-desktop pt-24 pb-0 relative"
                dir={ar ? 'rtl' : 'ltr'}
            >
                {/* Left Sidebar */}
                <aside className="hidden lg:flex flex-col gap-4 sticky top-[calc(72px+24px)] h-[calc(100vh-120px)] w-56 shrink-0 glass-sidebar border border-outline-variant/30 rounded-xl p-4">
                    <nav className="flex flex-col gap-2">
                        {NAV_LINKS.map(({ to, icon, label }) => (
                            <Link
                                key={to}
                                className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-lg group"
                                to={to}
                            >
                                <span className="material-symbols-outlined text-outline group-hover:text-primary">{icon}</span>
                                <span className="font-label-md text-label-md">{label}</span>
                            </Link>
                        ))}
                        <Link
                            className="flex items-center gap-3 px-4 py-3 bg-primary-container/10 text-primary font-bold border-l-4 border-primary rounded-r-lg"
                            to="/app/profile"
                        >
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>account_circle</span>
                            <span className="font-label-md text-label-md">{ar ? 'الملف الشخصي' : 'Profile'}</span>
                        </Link>
                    </nav>
                    <div className="mt-auto p-4 bg-surface-container-low rounded-xl border border-outline-variant/50">
                        <p className="font-label-sm text-label-sm text-primary mb-2">{ar ? 'الخطة الاحترافية' : 'PRO PLAN'}</p>
                        <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                            {ar ? 'افتح التطابق المتقدم بالذكاء الاصطناعي ورؤى Rafeeq ذات الأولوية.' : 'Unlock advanced AI matching and priority Rafeeq insights.'}
                        </p>
                        <button
                            className="w-full py-2 bg-secondary text-white rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity"
                            onClick={() => showToast(ar ? 'ميزة الترقية قريباً!' : 'Upgrade feature coming soon!', 'info')}
                        >
                            {ar ? 'ترقية' : 'Upgrade'}
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col gap-6 min-w-0 pb-12">
                    {/* Profile Header Card */}
                    <section className="ev-fade-up ev-stagger-1 bg-surface-container-lowest rounded-2xl overflow-hidden premium-shadow border border-outline-variant/50">
                        <div className="h-48 w-full bg-cover bg-center relative" style={{ backgroundImage: `url("${coverImg}")` }}>
                            <button
                                className={`absolute top-4 ${ar ? 'left-4' : 'right-4'} bg-surface/80 backdrop-blur-md p-2 rounded-full text-on-surface-variant hover:text-primary transition-colors`}
                                aria-label={ar ? 'تعديل الغلاف' : 'Edit cover'}
                                onClick={() => coverInputRef.current?.click()}
                            >
                                <span className="material-symbols-outlined">edit</span>
                            </button>
                        </div>
                        <div className="px-8 pb-8 relative z-10 space-y-5">
                            <div className={`flex flex-col md:flex-row md:items-end gap-6 ${ar ? 'md:flex-row-reverse' : ''}`}>
                                <div className="-mt-2 w-28 h-28 rounded-full border-4 border-surface-container-lowest overflow-hidden premium-shadow bg-surface shrink-0">
                                    <img className="w-full h-full object-cover" alt={ar ? 'صورة الملف الشخصي' : 'Profile'} src={DEFAULT_AVATAR} />
                                </div>
                                <div className={`flex-1 min-w-0 ${ar ? 'text-right' : ''}`}>
                                    <div className={`flex items-center gap-2 ${ar ? 'flex-row-reverse' : ''}`}>
                                        <h1 className="font-headline-lg text-headline-lg text-on-surface">{profile.name}</h1>
                                        <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: '"FILL" 1' }} title={ar ? 'ملف موثّق' : 'Verified Profile'}>verified</span>
                                    </div>
                                    <p className="font-title-lg text-title-lg text-on-surface-variant">
                                        {profile.headline}
                                    </p>
                                    <p className={`font-body-md text-body-md text-outline mt-1 flex items-center gap-1 ${ar ? 'flex-row-reverse' : ''}`}>
                                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                                        {profile.location}
                                    </p>
                                </div>
                            </div>
                            <div className={`flex gap-2 w-full md:w-auto ${ar ? 'flex-row-reverse' : ''}`}>
                                <button type="button" className="lg:hidden flex-1 md:flex-none text-center px-6 py-2.5 border border-outline-variant text-primary rounded-full font-label-md text-label-md hover:bg-surface-container-low transition-colors" onClick={openEdit}>
                                    {ar ? 'تعديل الملف' : 'Edit Profile'}
                                </button>
                                <Link className="flex-1 md:flex-none text-center px-6 py-2.5 rounded-full font-label-md text-label-md transition-colors hover:opacity-90" style={{ backgroundColor: '#FF4D2E', color: '#fff' }} to="/app/explore">
                                    {ar ? 'أبحث عن فرص' : 'Looking for opportunities'}
                                </Link>
                                <Link className="flex-1 md:flex-none text-center px-6 py-2.5 border border-outline-variant text-primary rounded-full font-label-md text-label-md hover:bg-surface-container-low transition-colors" to="/app/create-team">
                                    {ar ? 'إضافة قسم' : 'Add Section'}
                                </Link>
                            </div>
                        </div>
                        <div className="px-8 pb-8">
                            <h3 className="font-headline-md text-headline-md mb-2">{ar ? 'نبذة عني' : 'About'}</h3>
                            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                                {profile.about}
                            </p>
                        </div>
                    </section>

                    {/* Stats */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {STATS.map(({ icon, color, bg, value, label, sub }) => (
                            <div key={label} className="ev-card spotlight ev-fade-up ev-stagger-2 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/50 premium-shadow group">
                                <div className={`flex justify-between items-start mb-4 ${ar ? 'flex-row-reverse' : ''}`}>
                                    <span className={`material-symbols-outlined ${color} p-2 ${bg} rounded-lg`}>{icon}</span>
                                    <span className="font-label-sm text-label-sm text-outline">{sub}</span>
                                </div>
                                <p className="font-mono text-headline-lg text-on-surface" data-count>{value}</p>
                                <p className="font-label-md text-label-md text-on-surface-variant">{label}</p>
                            </div>
                        ))}
                    </section>

                    {/* Experience */}
                    <section className="ev-fade-up ev-stagger-2 bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/50 premium-shadow">
                        <div className={`flex justify-between items-center mb-6 ${ar ? 'flex-row-reverse' : ''}`}>
                            <h3 className="font-headline-md text-headline-md">{ar ? 'الخبرات' : 'Experience'}</h3>
                            <button type="button" className="material-symbols-outlined text-outline hover:text-primary" aria-label={ar ? 'إضافة خبرة' : 'Add experience'} onClick={() => openEdit('experience')}>add</button>
                        </div>
                        <div className="space-y-8">
                            {shownExperience.map(({ icon, iconColor, title, org, orgColor, period, desc }, index) => (
                                <div key={`${title}-${index}`} className={`flex gap-4 ${ar ? 'flex-row-reverse text-right' : ''}`}>
                                    <div className="w-12 h-12 bg-surface-container rounded-lg shrink-0 flex items-center justify-center">
                                        <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-title-lg text-title-lg">{title}</h4>
                                        <p className={`font-label-md text-label-md ${orgColor}`}>{org}</p>
                                        <p className="font-label-sm text-label-sm text-outline">{period}</p>
                                        <p className="font-body-md text-body-md text-on-surface-variant mt-2">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Skills */}
                    <section className="ev-fade-up ev-stagger-3 bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/50 premium-shadow">
                        <h3 className="font-headline-md text-headline-md mb-6">{ar ? 'المهارات' : 'Skills'}</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                            {ar ? 'أبرز مهاراتك وقدراتك الأساسية المكتسبة عبر المنصة.' : 'Showcase the participant\'s core skills and strengths learned through the platform.'}
                        </p>
                        <div className={`flex flex-wrap gap-3 ${ar ? 'flex-row-reverse' : ''}`}>
                            {(saved?.skills ? saved.skills.map((label, i) => ({ label, cls: SKILL_STYLES[i % SKILL_STYLES.length] })) : SKILLS).map(({ label, cls }) => (
                                <span key={label} className={`px-4 py-2 font-label-md text-label-md rounded-full ${cls}`}>{label}</span>
                            ))}
                        </div>
                    </section>

                    {/* Upload CV */}
                    <section className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/50 premium-shadow">
                        <div className="flex flex-col gap-4">
                            <div className={`flex items-center justify-between mb-4 ${ar ? 'flex-row-reverse' : ''}`}>
                                <h3 className="font-headline-md text-headline-md">{ar ? 'رفع السيرة الذاتية' : 'Upload Your CV'}</h3>
                                <span className="material-symbols-outlined text-primary">upload_file</span>
                            </div>
                            <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container p-6 text-center">
                                <span className="material-symbols-outlined text-5xl text-primary">cloud_upload</span>
                                <p className="mt-4 font-label-md text-label-md">
                                    {ar ? 'احتفظ بملفك الشخصي محدّثًا بأحدث سيرة ذاتية.' : 'Keep your profile updated with your latest resume.'}
                                </p>
                                <p className="mt-2 font-label-md text-label-md text-on-surface-variant">
                                    {ar ? 'الصيغ المدعومة: PDF, DOCX • الحجم الأقصى: 10MB' : 'Supported formats: PDF, DOCX • Max size: 10MB'}
                                </p>
                                <button
                                    className={`mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 font-label-md text-label-md transition-opacity hover:opacity-90 gap-2 ${ar ? 'flex-row-reverse' : ''}`}
                                    style={{ backgroundColor: '#FF4D2E', color: '#fff' }}
                                    onClick={() => cvInputRef.current?.click()}
                                >
                                    <span className="material-symbols-outlined">cloud_upload</span>
                                    {ar ? 'رفع السيرة الذاتية' : 'Upload CV'}
                                </button>
                            </div>
                            <div className={`flex items-center justify-between rounded-xl bg-surface-container-low p-4 border border-outline-variant ${ar ? 'flex-row-reverse' : ''}`}>
                                <div className={ar ? 'text-right' : ''}>
                                    <p className="font-label-md text-label-md">{ar ? 'السيرة الذاتية الحالية' : 'Current resume'}</p>
                                    <p className="font-label-md text-label-md text-on-surface-variant">
                                        {cvFile ? cvFile.name : 'ALI_CV_2024.pdf'} • {cvFile ? (ar ? 'تم الرفع للتو' : 'Just uploaded') : (ar ? 'تم التحديث منذ 3 أيام' : 'Updated 3 days ago')}
                                    </p>
                                </div>
                                <button
                                    className="rounded-full border border-primary px-4 py-2 text-primary font-label-md text-label-md hover:bg-primary/5 transition-colors shrink-0"
                                    onClick={handlePreviewCv}
                                >
                                    {ar ? 'معاينة' : 'Preview'}
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Projects */}
                    <section className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/50 premium-shadow">
                        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 ${ar ? 'sm:flex-row-reverse' : ''}`}>
                            <h3 className="font-headline-md text-headline-md">{ar ? 'المشاريع المميزة' : 'Featured Projects'}</h3>
                            <button
                                className={`inline-flex items-center justify-center rounded-full px-5 py-2 font-label-md text-label-md transition-opacity hover:opacity-85 gap-2 ${ar ? 'flex-row-reverse' : ''}`}
                                style={{ backgroundColor: '#FF4D2E', color: '#ffffff' }}
                                onClick={() => openEdit('projects')}
                            >
                                <span className="material-symbols-outlined">add</span>
                                {ar ? 'إضافة مشروع' : 'Add project'}
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {shownProjects.map(({ img, title, desc }) => (
                                <div key={title} className="group">
                                    <div className="h-48 bg-surface-container-low rounded-xl overflow-hidden mb-4">
                                        {img
                                            ? <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={title} src={img} />
                                            : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10"><span className="material-symbols-outlined text-primary text-5xl">rocket_launch</span></div>}
                                    </div>
                                    <h4 className={`font-title-lg text-title-lg group-hover:text-primary transition-colors ${ar ? 'text-right' : ''}`}>{title}</h4>
                                    <p className={`font-body-md text-body-md text-on-surface-variant ${ar ? 'text-right' : ''}`}>{desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Certifications */}
                    <section className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/50 premium-shadow">
                        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 ${ar ? 'sm:flex-row-reverse' : ''}`}>
                            <div className={ar ? 'text-right' : ''}>
                                <h3 className="font-headline-md text-headline-md">{ar ? 'الشهادات' : 'Certifications'}</h3>
                                <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                                    {ar ? 'شهاداتك الموثّقة من Eventify معروضة هنا بتنسيق نظيف وسهل القراءة.' : 'Your verified certificates from Eventify are listed here in a clean, easy-to-scan format.'}
                                </p>
                            </div>
                            <span className={`inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-primary font-label-sm text-label-sm ${ar ? 'flex-row-reverse' : ''}`}>
                                <span className="material-symbols-outlined">school</span>
                                {ar ? '4 شهادات' : '4 certificates'}
                            </span>
                        </div>
                        <div className="overflow-hidden rounded-[28px] bg-white dark:bg-slate-900 border border-outline-variant shadow-sm">
                            <div className={`grid grid-cols-[1fr_auto] gap-4 px-5 py-4 font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant/50 ${ar ? 'flex-row-reverse text-right' : ''}`}>
                                <span>{ar ? 'الفرصة' : 'Opportunity'}</span>
                                <span>{ar ? 'الإجراء' : 'Action'}</span>
                            </div>
                            <div className="space-y-3 p-4 overflow-y-auto max-h-[430px]">
                                {CERTS.map((cert) => (
                                    <div key={cert.id} className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-3xl border border-surface-container-high p-4 bg-surface ${ar ? 'sm:flex-row-reverse text-right' : ''}`}>
                                        <div>
                                            <p className="font-label-md text-label-md text-on-surface">{cert.title}</p>
                                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{cert.sub}</p>
                                        </div>
                                        <button
                                            className="inline-flex items-center justify-center rounded-full px-5 py-2 font-label-md text-label-md shrink-0 transition-opacity hover:opacity-85"
                                            style={{ backgroundColor: '#FF4D2E', color: '#ffffff' }}
                                            onClick={() => setCertModal(cert)}
                                        >
                                            {ar ? 'عرض الشهادة' : 'View certificate'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>

                {/* Right Settings Panel */}
                <aside className="hidden lg:flex flex-col gap-4 sticky top-[calc(72px+24px)] max-h-[calc(100vh-120px)] overflow-y-auto w-56 shrink-0 glass-sidebar border border-outline-variant/30 rounded-xl p-4">
                    <h3 className="font-label-md text-label-md text-on-surface dark:text-white px-2 mb-2">
                        {ar ? 'إدارة الملف الشخصي' : 'Profile Management'}
                    </h3>
                    <div className="flex flex-col gap-1">
                        {[
                            { icon: 'person_edit', label: ar ? 'تعديل الملف' : 'Edit Profile', action: openEdit },
                            { icon: 'upload_file', label: ar ? 'تحديث السيرة' : 'Update CV', cv: true },
                            { icon: 'privacy_tip', label: ar ? 'إعدادات الخصوصية' : 'Privacy Settings', action: () => showToast(ar ? 'إعدادات الخصوصية قريباً' : 'Privacy settings coming soon', 'info') },
                        ].map(({ icon, label, cv, action }) => (
                            <button key={label} onClick={() => (cv ? cvInputRef.current?.click() : action?.())} className={`flex items-center justify-between w-full p-3 hover:bg-surface-container dark:hover:bg-slate-800 rounded-lg transition-colors group text-on-surface dark:text-gray-200 ${ar ? 'flex-row-reverse' : ''}`}>
                                <div className={`flex items-center gap-3 ${ar ? 'flex-row-reverse' : ''}`}>
                                    <span className="material-symbols-outlined text-outline group-hover:text-primary">{icon}</span>
                                    <span className="font-label-md text-label-md">{label}</span>
                                </div>
                                <span className={`material-symbols-outlined text-outline text-[18px] ${ar ? 'rotate-180' : ''}`}>chevron_right</span>
                            </button>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-outline-variant/30 dark:border-white/10">
                        <h3 className="font-label-md text-label-md text-on-surface dark:text-white px-2 mb-2">
                            {ar ? 'المظهر' : 'Appearance'}
                        </h3>
                        <div className={`flex items-center justify-between p-3 ${ar ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex items-center gap-3 ${ar ? 'flex-row-reverse' : ''}`}>
                                <span className="material-symbols-outlined text-outline dark:text-gray-400">palette</span>
                                <span className="font-label-md text-label-md dark:text-gray-200">{ar ? 'السمة' : 'Theme'}</span>
                            </div>
                            <div className="flex bg-surface-container-high dark:bg-slate-800 rounded-full p-1">
                                <button className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-primary" onClick={() => setTheme('light')} aria-label={ar ? 'الوضع الفاتح' : 'Light mode'}>
                                    <span className="material-symbols-outlined text-[18px]">light_mode</span>
                                </button>
                                <button className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-on-surface dark:hover:text-white" onClick={() => setTheme('dark')} aria-label={ar ? 'الوضع الداكن' : 'Dark mode'}>
                                    <span className="material-symbols-outlined text-[18px]">dark_mode</span>
                                </button>
                            </div>
                        </div>
                        <div className={`flex items-center justify-between p-3 ${ar ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex items-center gap-3 ${ar ? 'flex-row-reverse' : ''}`}>
                                <span className="material-symbols-outlined text-outline dark:text-gray-400">translate</span>
                                <span className="font-label-md text-label-md dark:text-gray-200">{ar ? 'اللغة' : 'Language'}</span>
                            </div>
                            <button
                                className="h-8 px-3 rounded-xl flex items-center justify-center font-bold text-sm text-on-surface-variant dark:text-gray-300 border border-outline-variant hover:text-primary hover:border-primary transition-colors"
                                onClick={toggleLanguage}
                                aria-label={ar ? 'تبديل اللغة' : 'Toggle language'}
                            >
                                {ar ? 'AR' : 'EN'}
                            </button>
                        </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-outline-variant/30 dark:border-white/10">
                        <Link className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors text-error hover:bg-error/10 ${ar ? 'flex-row-reverse' : ''}`} to="/auth/login">
                            <span className="material-symbols-outlined text-[18px] text-error">logout</span>
                            <span className="font-label-md text-label-md">{ar ? 'تسجيل الخروج' : 'Sign out'}</span>
                        </Link>
                    </div>

                    <div className="mt-auto p-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20">
                        <div className={`flex items-center gap-2 mb-2 ${ar ? 'flex-row-reverse' : ''}`}>
                            <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: '"FILL" 1' }}>auto_awesome</span>
                            <p className="font-label-md text-label-md text-primary">{ar ? 'رؤية الذكاء الاصطناعي' : 'AI Insight'}</p>
                        </div>
                        <p className={`font-label-sm text-label-sm text-gray-600 dark:text-gray-300 ${ar ? 'text-right' : ''}`} style={{ textTransform: 'none' }}>
                            {ar
                                ? <>قوة ملفك الشخصي: <span style={{ color: '#FF4D2E', fontWeight: 700 }}>خبير</span>. إضافة شهادتين إضافيتين قد يزيد وصولك بنسبة 25%.</>
                                : <>Your profile strength is <span style={{ color: '#FF4D2E', fontWeight: 700 }}>Expert</span>. Adding 2 more certifications could increase reach by 25%.</>}
                        </p>
                    </div>
                </aside>
            </div>
            <AppFooter />
        </>
    )
}
