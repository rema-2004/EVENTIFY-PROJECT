import { Fragment, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppPageHead from '../../components/app/AppPageHead'
import { useOrgPageControls } from './useOrgPageControls.js'
import { useLanguage } from '../../hooks/useLanguage'
import { toast } from '../../utils/toast.js'
import LangToggleBtn from '../../components/org/LangToggleBtn'
import OrgSidebar, { OrgMobileHeader } from '../../components/org/OrgSidebar'
import '../../styles/org/sidebar.css'
import '../../styles/admin/admin.css'
import '../../styles/org/org-dashboard.css'
import '../../styles/org/org-create-event.css'

const DRAFT_KEY = 'eventify:event-draft'
const PUBLISHED_KEY = 'eventify:published-events'

const CATEGORIES = [
    { id: 'Competition', labelEn: 'Competition', labelAr: 'مسابقات', icon: 'emoji_events' },
    { id: 'Event',       labelEn: 'Event',       labelAr: 'فعالية',   icon: 'event' },
    { id: 'Workshop',    labelEn: 'Workshop',    labelAr: 'ورشة عمل', icon: 'build' },
    { id: 'Course',      labelEn: 'Course',      labelAr: 'دورة',     icon: 'school' },
]

// خيارات نوع المشاركة المطلوبة بدقة مع التسميات المحددة
const PARTICIPATION_OPTIONS = [
    {
        value: 'Solo Only',
        badge: 'Solo Only (للـفردي فقط)',
        subAr: 'مشاركة فردية فقط، بدون الحاجة لتشكيل فرق',
        subEn: 'Individual participants only; no teams allowed',
        icon: 'person',
        code: 'solo',
    },
    {
        value: 'Team Only',
        badge: 'Team Only (للـفريق فقط)',
        subAr: 'مشاركة جماعية كفريق، يتطلب تشكيل فريق للتسجيل',
        subEn: 'Team formation strictly required to participate',
        icon: 'groups',
        code: 'team',
    },
    {
        value: 'Both / Solo & Team',
        badge: 'Both / Solo & Team (لكلا الخيارين)',
        subAr: 'متاح للأفراد وللفرق، حرية الاختيار للمشارك',
        subEn: 'Flexible: contenders can join as solo or in teams',
        icon: 'join_inner',
        code: 'both',
    },
]

// تحويل الأرقام العربية والمشرقية إلى أرقام عادية وتنظيف النص
function normalizeDigits(value) {
    if (value === null || value === undefined) return ''
    return String(value)
        .replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 1632))
        .replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 1776))
        .replace(/[^0-9]/g, '')
}

function getSafeTeamSize(val, fallback) {
    const cleaned = normalizeDigits(val)
    if (!cleaned) return fallback
    const n = parseInt(cleaned, 10)
    return isNaN(n) || n < 1 ? fallback : String(n)
}

export default function OrgCreateEvent() {
    useOrgPageControls()
    const navigate = useNavigate()
    const { language, isRtl } = useLanguage()
    const isAr = Boolean(isRtl || language?.startsWith('ar'))

    const [step, setStep] = useState(1)
    const [catOpen, setCatOpen] = useState(false)
    const [reviewData, setReviewData] = useState({})
    const [publishing, setPublishing] = useState(false)

    // Form State الشامل مع استعادة المسودة فورياً عند التحميل
    const [formData, setFormData] = useState(() => {
        const defaults = {
            title: '',
            category: 'Competition',
            location: '',
            startDate: '',
            endDate: '',
            description: '',
            requirements: '',
            prize: '',
            participationType: 'Both / Solo & Team',
            minTeamSize: '',
            maxTeamSize: '',
        }
        try {
            const rawDraft = localStorage.getItem(DRAFT_KEY)
            if (!rawDraft) return defaults
            const draft = JSON.parse(rawDraft)
            return {
                ...defaults,
                ...draft,
                category: draft.category || 'Competition',
                participationType: draft.participationType || 'Both / Solo & Team',
                minTeamSize: draft.minTeamSize ? getSafeTeamSize(draft.minTeamSize, '') : '',
                maxTeamSize: draft.maxTeamSize ? getSafeTeamSize(draft.maxTeamSize, '') : '',
            }
        } catch {
            return defaults
        }
    })

    const [coverName, setCoverName] = useState(() => {
        try {
            const raw = localStorage.getItem(DRAFT_KEY)
            return raw ? JSON.parse(raw).coverName || null : null
        } catch {
            return null
        }
    })

    // إغلاق قائمة التصنيفات عند النقر خارجها
    useEffect(() => {
        if (!catOpen) return
        const handler = (e) => {
            const toggle = document.getElementById('org-category-toggle')
            const panel = document.getElementById('org-category-panel')
            if (!panel?.contains(e.target) && e.target !== toggle) {
                setCatOpen(false)
            }
        }
        document.addEventListener('click', handler)
        return () => document.removeEventListener('click', handler)
    }, [catOpen])

    const isComp = formData.category === 'Competition'

    // دالة لتجهيز البيانات المحفوظة والمنسقة مع الـ Explore Filters
    function getPreparedPayload(currentData = formData) {
        const comp = currentData.category === 'Competition'
        const codeMap = {
            'Solo Only': 'solo',
            'Team Only': 'team',
            'Both / Solo & Team': 'both',
        }

        const selectedType = comp ? currentData.participationType : ''
        const code = comp ? (codeMap[selectedType] || 'both') : 'all'
        const hasTeam = comp && (selectedType === 'Team Only' || selectedType === 'Both / Solo & Team')
        const safeMin = hasTeam && currentData.minTeamSize ? (parseInt(normalizeDigits(currentData.minTeamSize), 10) || null) : null
        const safeMax = hasTeam && currentData.maxTeamSize ? (parseInt(normalizeDigits(currentData.maxTeamSize), 10) || null) : null

        return {
            ...currentData,
            category: currentData.category,
            coverName,
            // بيانات نوع المشاركة وحجم الفريق المتوافقة مع أزرار الفلترة
            participationType: selectedType,
            participationTypeCode: code, // 'solo' | 'team' | 'both'
            allowsSolo: comp ? selectedType !== 'Team Only' : true,
            allowsTeam: hasTeam,
            minTeamSize: safeMin,
            maxTeamSize: safeMax,
            teamSize: hasTeam && safeMin && safeMax
                ? `${safeMin}-${safeMax} members`
                : (comp && selectedType === 'Solo Only' ? 'Solo' : ''),
            updatedAt: new Date().toISOString(),
        }
    }

    function saveDraft() {
        try {
            const payload = getPreparedPayload()
            localStorage.setItem(DRAFT_KEY, JSON.stringify(payload))
        } catch (e) {
            console.error('Failed to save draft:', e)
        }
    }

    const handleInputChange = (field, value) => {
        setFormData(prev => {
            const updated = { ...prev, [field]: value }
            try {
                // حفظ المسودة مع الحفاظ على القيمة المدخلة كما هي
                const draftData = {
                    ...getPreparedPayload(updated),
                    minTeamSize: updated.minTeamSize,
                    maxTeamSize: updated.maxTeamSize,
                }
                localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData))
            } catch {}
            return updated
        })
    }

    const handleCategorySelect = (catId) => {
        setFormData(prev => {
            const isTargetComp = catId === 'Competition'
            const next = {
                ...prev,
                category: catId,
                // إذا لم يعد تصنيف مسابقات، نفرغ حقول المسابقات
                prize: isTargetComp ? prev.prize : '',
                participationType: isTargetComp ? (prev.participationType || 'Both / Solo & Team') : '',
                minTeamSize: isTargetComp ? (prev.minTeamSize ? getSafeTeamSize(prev.minTeamSize, '') : '') : '',
                maxTeamSize: isTargetComp ? (prev.maxTeamSize ? getSafeTeamSize(prev.maxTeamSize, '') : '') : '',
            }
            try {
                localStorage.setItem(DRAFT_KEY, JSON.stringify(getPreparedPayload(next)))
            } catch {}
            return next
        })
        setCatOpen(false)
    }

    const handleParticipationSelect = (optValue) => {
        setFormData(prev => {
            const isSoloOnly = optValue === 'Solo Only'
            const next = {
                ...prev,
                participationType: optValue,
                // إفراغ وإخفاء حقول حجم الفريق عند اختيار Solo Only
                minTeamSize: isSoloOnly ? '' : (prev.minTeamSize ? getSafeTeamSize(prev.minTeamSize, '') : ''),
                maxTeamSize: isSoloOnly ? '' : (prev.maxTeamSize ? getSafeTeamSize(prev.maxTeamSize, '') : ''),
            }
            try {
                localStorage.setItem(DRAFT_KEY, JSON.stringify(getPreparedPayload(next)))
            } catch {}
            return next
        })
    }

    function validateStep1() {
        if (!formData.title.trim()) {
            toast(isAr ? 'يرجى إدخال عنوان الفعالية' : 'Add an event title first', 'error')
            document.getElementById('ev-title')?.focus()
            return false
        }
        if (!formData.startDate) {
            toast(isAr ? 'يرجى تحديد تاريخ البدء' : 'Please select a start date', 'error')
            document.getElementById('ev-start')?.focus()
            return false
        }
        if (!formData.endDate) {
            toast(isAr ? 'يرجى تحديد تاريخ الانتهاء' : 'Please select an end date', 'error')
            document.getElementById('ev-end')?.focus()
            return false
        }
        if (formData.endDate < formData.startDate) {
            toast(isAr ? 'تاريخ الانتهاء لا يمكن أن يكون قبل تاريخ البدء' : 'End date cannot be before start date', 'error')
            return false
        }
        if (!formData.description.trim()) {
            toast(isAr ? 'يرجى كتابة وصف تفصيلي للفعالية' : 'Add a description so participants know what to expect', 'error')
            document.getElementById('ev-desc')?.focus()
            return false
        }

        // التحقق الخاص بالمسابقات
        if (isComp) {
            if (!formData.participationType) {
                toast(isAr ? 'يرجى اختيار نوع المشاركة للمسابقة' : 'Please choose a participation type', 'error')
                return false
            }

            if (formData.participationType === 'Team Only' || formData.participationType === 'Both / Solo & Team') {
                const min = Number(formData.minTeamSize)
                const max = Number(formData.maxTeamSize)

                if (!formData.minTeamSize || isNaN(min) || min < 2) {
                    toast(isAr ? 'الحد الأدنى لأعضاء الفريق يجب أن يكون عضوين على الأقل' : 'Minimum team size must be at least 2 members', 'error')
                    document.getElementById('ev-minTeamSize')?.focus()
                    return false
                }
                if (!formData.maxTeamSize || isNaN(max) || max < 1) {
                    toast(isAr ? 'يرجى تحديد الحد الأقصى لأعضاء الفريق' : 'Please enter valid maximum team members', 'error')
                    document.getElementById('ev-maxTeamSize')?.focus()
                    return false
                }
                if (max < min) {
                    toast(isAr ? 'الحد الأقصى لأعضاء الفريق يجب أن يكون أكبر من أو يساوي الحد الأدنى' : 'Max team size cannot be smaller than min team size', 'error')
                    document.getElementById('ev-maxTeamSize')?.focus()
                    return false
                }
            }
        }

        return true
    }

    function goTo(target) {
        if (target === 2) {
            setReviewData(getPreparedPayload())
        }
        setStep(target)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    function handleNext() {
        if (step === 1 && !validateStep1()) return
        saveDraft()
        goTo(step + 1)
    }

    function handlePublish() {
        saveDraft()
        setPublishing(true)

        // حفظ الحدث المنشور في LocalStorage لترتبط به صفحات الفلترة والاستكشاف
        try {
            const existing = JSON.parse(localStorage.getItem(PUBLISHED_KEY) || '[]')
            const finalEvent = {
                id: 'evt-' + Date.now(),
                ...getPreparedPayload(),
                status: 'pending',
                createdAt: new Date().toISOString(),
            }
            existing.unshift(finalEvent)
            localStorage.setItem(PUBLISHED_KEY, JSON.stringify(existing))
        } catch (e) {
            console.error('Failed to append to published events:', e)
        }

        toast(isAr ? 'تم إرسال الفعالية للمراجعة والاعتماد بنجاح' : 'Event submitted for approval', 'success')
        setTimeout(() => navigate('/org/dashboard'), 1600)
    }

    const currentCatMeta = CATEGORIES.find(c => c.id === formData.category) || CATEGORIES[0]

    return (
        <>
            <AppPageHead title={isAr ? 'إنشاء فعالية | EVENTIFY' : 'Create Event | EVENTIFY'} />
            <OrgMobileHeader />

            <div className="flex min-h-screen bg-bg text-on-surface">
                <OrgSidebar />

                <main className="flex-1 w-full px-4 md:px-12 pt-6 pb-24 lg:pb-8">
                    {/* Topbar */}
                    <div className="org-topbar">
                        <h1 className="org-topbar__title font-headline-lg text-headline-lg">
                            {isAr ? 'إنشاء فعالية جديدة' : 'Create Event'}
                        </h1>

                        <div className="org-topbar__right">
                            <div className="org-dropdown">
                                <button className="icon-btn" id="org-notif-toggle" type="button" aria-label="Notifications" aria-expanded="false">
                                    <span className="material-symbols-outlined">notifications</span>
                                    <span className="icon-btn__dot" />
                                </button>
                                <div className="org-dropdown__panel org-dropdown__panel--notif" id="org-notif-panel" hidden role="menu">
                                    <div className="flex items-center justify-between px-3 py-2 border-b border-outline-variant/40 mb-1">
                                        <span className="font-semibold text-xs text-on-surface">Notifications</span>
                                        <span className="text-[11px] font-semibold text-[#FF4D2E] bg-[#FF4D2E]/10 px-2 py-0.5 rounded-full">3 unread</span>
                                    </div>
                                    <div className="space-y-1">
                                        <Link className="org-dropdown__item" to="/org/applicants">
                                            <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--surface-2)", color: "#FF4D2E" }}>
                                                <span className="material-symbols-outlined text-[18px]">person_add</span>
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="block font-medium text-xs leading-snug">Ahmed Ali applied to Global AI Innovation Challenge</span>
                                                <span className="org-dropdown__meta">2 hours ago</span>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <LangToggleBtn />

                            <button className="theme-toggle icon-btn" type="button" title="Switch theme" aria-label="Switch theme">
                                <span className="material-symbols-outlined icon-dark">dark_mode</span>
                                <span className="material-symbols-outlined icon-light">light_mode</span>
                            </button>

                            <div className="org-dropdown">
                                <button className="dash-profile" id="org-profile-toggle" type="button" aria-label="Organization menu" aria-expanded="false">
                                    <span className="dash-profile__avatar bg-[#FF4D2E] text-white">TG</span>
                                    <span className="font-semibold text-xs">TechGenius Labs</span>
                                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">expand_more</span>
                                </button>
                                <div className="org-dropdown__panel org-dropdown__panel--profile" id="org-profile-panel" hidden role="menu">
                                    <div className="px-3 py-2 border-b border-outline-variant/40 mb-1">
                                        <p className="font-semibold text-xs text-on-surface">TechGenius Labs</p>
                                        <p className="text-[11px] text-on-surface-variant truncate">Verified organizer since 2024</p>
                                    </div>
                                    <Link className="org-dropdown__item" to="/org/profile">
                                        <span className="material-symbols-outlined text-[18px]">apartment</span>
                                        <span>Organization Profile</span>
                                    </Link>
                                    <Link className="org-dropdown__item" to="/org/settings">
                                        <span className="material-symbols-outlined text-[18px]">settings</span>
                                        <span>Settings</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Page Header Breadcrumb */}
                    <div className="org-page-header">
                        <div className="flex items-center gap-2 text-sm mb-2">
                            <Link className="text-on-surface-variant hover:text-[#FF4D2E] transition-colors" to="/org/dashboard">
                                {isAr ? 'لوحة التحكم' : 'Dashboard'}
                            </Link>
                            <span className="text-outline">/</span>
                            <span className="font-semibold text-on-surface">
                                {isAr ? 'إنشاء حدث' : 'Create Event'}
                            </span>
                        </div>
                        <p className="profile-page-desc">
                            {isAr
                                ? 'يتم مراجعة الفعاليات المنشأة من قبل فريق EVENTIFY قبل اعتمادها ونشرها للمتسابقين.'
                                : 'Submitted events are reviewed by our team before they go live for participants.'}
                        </p>
                    </div>

                    <div className="mx-auto w-full max-w-4xl">
                        {/* Stepper Progress Indicator */}
                        <div className="wizard-stepper" id="wizard-steps" role="tablist">
                            {[1, 2, 3].map((n, i) => {
                                const labels = isAr
                                    ? ['تفاصيل الفعالية', 'المراجعة والتدقيق', 'النشر']
                                    : ['Event Details', 'Review', 'Publish']
                                return (
                                    <Fragment key={n}>
                                        {i > 0 && <span className="stepper-sep">•</span>}
                                        <span
                                            className={`wizard-chip transition-all duration-200 ${
                                                step === n
                                                    ? '!bg-[#FF4D2E] !border-[#FF4D2E] text-white shadow-sm shadow-[#FF4D2E]/25'
                                                    : step > n
                                                    ? 'completed border-outline-variant/60 text-on-surface'
                                                    : 'text-on-surface-variant opacity-70'
                                            }`}
                                        >
                                            <span className={`chip-num font-mono ${step === n ? 'bg-white/25 text-white' : ''}`}>
                                                {n}
                                            </span>{' '}
                                            {labels[i]}
                                        </span>
                                    </Fragment>
                                )
                            })}
                        </div>

                        {/* Wizard Form */}
                        <form
                            className="wizard-form-card border border-outline-variant/30 bg-surface dark:bg-[#16181c] rounded-2xl p-6 md:p-8 shadow-sm space-y-6"
                            id="event-wizard"
                            noValidate
                            onSubmit={e => e.preventDefault()}
                        >
                            {/* STEP 1: Event Details */}
                            <section className={step === 1 ? 'flex flex-col gap-6 fade-in' : 'hidden'}>
                                {/* Event Title */}
                                <div className="form-group">
                                    <label className="form-label" htmlFor="ev-title">
                                        {isAr ? 'عنوان الفعالية' : 'Event Title'} <span className="text-[#FF4D2E]">*</span>
                                    </label>
                                    <input
                                        className="form-input focus:!border-[#FF4D2E] focus:!ring-2 focus:!ring-[#FF4D2E]/20"
                                        id="ev-title"
                                        name="title"
                                        type="text"
                                        value={formData.title}
                                        onChange={e => handleInputChange('title', e.target.value)}
                                        placeholder={isAr ? 'مثال: هاكاثون الابتكار العالمي للذكاء الاصطناعي' : 'e.g. Global AI Innovation Challenge'}
                                        required
                                    />
                                </div>

                                {/* Category & Location */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Category Selector */}
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="ev-type">
                                            {isAr ? 'تصنيف الفعالية' : 'Category'} <span className="text-[#FF4D2E]">*</span>
                                        </label>
                                        <div className="org-cat-dropdown">
                                            <button
                                                type="button"
                                                className="org-cat-btn hover:border-[#FF4D2E] focus:border-[#FF4D2E]"
                                                id="org-category-toggle"
                                                aria-haspopup="listbox"
                                                aria-expanded={catOpen}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setCatOpen(o => !o)
                                                }}
                                            >
                                                <div className="btn-left flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[#FF4D2E] text-[18px]">
                                                        {currentCatMeta.icon}
                                                    </span>
                                                    <span id="org-category-selected-name" className="font-semibold text-sm">
                                                        {isAr ? currentCatMeta.labelAr : currentCatMeta.labelEn}
                                                    </span>
                                                </div>
                                                <span className={`material-symbols-outlined chevron-icon transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`}>
                                                    expand_more
                                                </span>
                                            </button>

                                            <div
                                                className="org-cat-panel bg-surface dark:bg-[#16181c] border border-outline-variant/60 shadow-xl rounded-xl p-1 z-50"
                                                id="org-category-panel"
                                                hidden={!catOpen}
                                                role="listbox"
                                            >
                                                {CATEGORIES.map(cat => {
                                                    const active = formData.category === cat.id
                                                    return (
                                                        <button
                                                            key={cat.id}
                                                            type="button"
                                                            className={`org-cat-item rounded-lg transition-colors ${active ? '!text-[#FF4D2E] bg-[#FF4D2E]/10 font-bold' : 'hover:bg-surface-container'}`}
                                                            role="option"
                                                            aria-selected={active}
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleCategorySelect(cat.id)
                                                            }}
                                                        >
                                                            <span className="flex items-center gap-2.5">
                                                                <span className="material-symbols-outlined text-[18px]">
                                                                    {cat.icon}
                                                                </span>
                                                                <span>{isAr ? cat.labelAr : cat.labelEn}</span>
                                                            </span>
                                                            {active && (
                                                                <span className="material-symbols-outlined text-[#FF4D2E] text-[18px]">check</span>
                                                            )}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="ev-location">
                                            {isAr ? 'الموقع أو المنصة' : 'Location'}
                                        </label>
                                        <input
                                            className="form-input focus:!border-[#FF4D2E] focus:!ring-2 focus:!ring-[#FF4D2E]/20"
                                            id="ev-location"
                                            name="location"
                                            type="text"
                                            value={formData.location}
                                            onChange={e => handleInputChange('location', e.target.value)}
                                            placeholder={isAr ? 'مثال: عن بعد / الرياض، المملكة العربية السعودية' : 'e.g. Remote, Riyadh, SA or Online'}
                                        />
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="ev-start">
                                            {isAr ? 'تاريخ البدء' : 'Start Date'} <span className="text-[#FF4D2E]">*</span>
                                        </label>
                                        <input
                                            className="form-input focus:!border-[#FF4D2E] focus:!ring-2 focus:!ring-[#FF4D2E]/20"
                                            id="ev-start"
                                            name="startDate"
                                            type="date"
                                            value={formData.startDate}
                                            onChange={e => handleInputChange('startDate', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="ev-end">
                                            {isAr ? 'تاريخ الانتهاء' : 'End Date'} <span className="text-[#FF4D2E]">*</span>
                                        </label>
                                        <input
                                            className="form-input focus:!border-[#FF4D2E] focus:!ring-2 focus:!ring-[#FF4D2E]/20"
                                            id="ev-end"
                                            name="endDate"
                                            type="date"
                                            value={formData.endDate}
                                            onChange={e => handleInputChange('endDate', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="form-group">
                                    <label className="form-label" htmlFor="ev-desc">
                                        {isAr ? 'الوصف ومخرجات الفعالية' : 'Description'} <span className="text-[#FF4D2E]">*</span>
                                    </label>
                                    <textarea
                                        className="form-textarea focus:!border-[#FF4D2E] focus:!ring-2 focus:!ring-[#FF4D2E]/20"
                                        id="ev-desc"
                                        name="description"
                                        rows={4}
                                        value={formData.description}
                                        onChange={e => handleInputChange('description', e.target.value)}
                                        placeholder={isAr ? 'صف أهداف الفعالية، الأجندة، والمشروع أو المهارات المتوقعة...' : 'Describe the challenge, agenda, and what participants will build or learn.'}
                                        required
                                    />
                                </div>

                                {/* Requirements */}
                                <div className="form-group">
                                    <label className="form-label" htmlFor="ev-cond">
                                        {isAr ? 'الشروط والمتطلبات' : 'Requirements / Conditions'}
                                    </label>
                                    <textarea
                                        className="form-textarea focus:!border-[#FF4D2E] focus:!ring-2 focus:!ring-[#FF4D2E]/20"
                                        id="ev-cond"
                                        name="requirements"
                                        rows={3}
                                        value={formData.requirements}
                                        onChange={e => handleInputChange('requirements', e.target.value)}
                                        placeholder={isAr ? 'المهارات المطلوبة، الأجهزة والبرمجيات، شروط التأهل...' : 'Eligibility, required skills, tools, hardware...'}
                                    />
                                </div>

                                {/* ========================================================
                                    قسم المسابقات الخاص (COMPETITION ONLY SECTION)
                                    يظهر فقط إذا كان التصنيف هو "مسابقات" (Competitions)
                                   ======================================================== */}
                                {isComp && (
                                    <div className="flex flex-col gap-6">
                                    {/* حقل الجائزة / المنحة — منفصل تماماً، اختياري، ليس ضمن كرت نوع المشاركة */}
                                    <div className="form-group">
                                        <label className="form-label flex items-center justify-between" htmlFor="ev-prize">
                                            <span className="flex items-center gap-1.5 font-semibold text-sm">
                                                <span className="material-symbols-outlined text-[#FF4D2E] text-[18px]">military_tech</span>
                                                {isAr ? 'الجوائز والمكافآت' : 'Prize / Scholarship'}
                                            </span>
                                            <span className="text-xs text-on-surface-variant font-normal bg-surface-container px-2 py-0.5 rounded-full border border-outline-variant/40">
                                                {isAr ? 'اختياري' : 'Optional'}
                                            </span>
                                        </label>
                                        <input
                                            className="form-input focus:!border-[#FF4D2E] focus:!ring-2 focus:!ring-[#FF4D2E]/20"
                                            id="ev-prize"
                                            name="prize"
                                            type="text"
                                            value={formData.prize}
                                            onChange={e => handleInputChange('prize', e.target.value)}
                                            placeholder={isAr ? 'مثال: 50,000 ريال جوائز نقدية + فرص احتضان' : 'e.g. $10,000 Prize Pool + Mentorship'}
                                        />
                                    </div>

                                    {/* كرت إعدادات نوع المشاركة — مستقل عن الجائزة */}
                                    <div className="rounded-2xl border-2 border-[#FF4D2E]/30 bg-[#FF4D2E]/[0.03] dark:bg-[#FF4D2E]/[0.05] p-5 md:p-6 space-y-6 transition-all duration-300">
                                        {/* Competition Header Badge */}
                                        <div className="flex items-center justify-between pb-3 border-b border-[#FF4D2E]/20">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-[#FF4D2E]/10 text-[#FF4D2E] flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-sm text-on-surface">
                                                        {isAr ? 'إعدادات نوع المشاركة' : 'Participation Settings'}
                                                    </h3>
                                                    <p className="text-[11px] text-on-surface-variant">
                                                        {isAr ? 'حدد كيفية تسجيل المتنافسين (فردي / فريق / كلاهما)' : 'Configure how competitors register for this challenge'}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FF4D2E] text-white uppercase tracking-wider">
                                                {isAr ? 'مسابقات فقط' : 'Competition'}
                                            </span>
                                        </div>

                                        {/* 1. حقل اختيار نوع المشاركة (Participation Type) بالخيارات الثلاثة المطلوبة */}
                                        <div className="form-group space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="form-label flex items-center gap-1.5 font-semibold text-sm">
                                                    <span className="material-symbols-outlined text-[#FF4D2E] text-[18px]">how_to_reg</span>
                                                    {isAr ? 'نوع المشاركة' : 'Participation Type'} <span className="text-[#FF4D2E]">*</span>
                                                </label>
                                                <span className="text-xs font-mono font-bold text-[#FF4D2E] bg-[#FF4D2E]/10 px-2 py-0.5 rounded">
                                                    {formData.participationType}
                                                </span>
                                            </div>

                                            <p className="text-xs text-on-surface-variant leading-relaxed">
                                                {isAr
                                                    ? 'اختر طريقة انضمام المتنافسين إلى المسابقة (فردياً فقط، كفريق فقط، أو السماح بكلا الخيارين).'
                                                    : 'Determine whether participants must compete individually, in teams, or if both options are welcome.'}
                                            </p>

                                            {/* بطاقات الخيارات الثلاثة بتصميم حديث ومتجاوب */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                                                {PARTICIPATION_OPTIONS.map((opt) => {
                                                    const isSelected = formData.participationType === opt.value
                                                    return (
                                                        <button
                                                            key={opt.value}
                                                            type="button"
                                                            onClick={() => handleParticipationSelect(opt.value)}
                                                            className={`relative flex flex-col p-4 rounded-xl border text-start transition-all duration-200 cursor-pointer ${
                                                                isSelected
                                                                    ? 'border-[#FF4D2E] bg-[#FF4D2E]/10 dark:bg-[#FF4D2E]/15 shadow-sm ring-2 ring-[#FF4D2E]/30'
                                                                    : 'border-outline-variant/60 bg-surface dark:bg-[#16181c] hover:border-[#FF4D2E]/50 hover:bg-surface-container'
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between w-full mb-2">
                                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                                                                    isSelected ? 'bg-[#FF4D2E] text-white shadow-sm shadow-[#FF4D2E]/30' : 'bg-surface-container-high text-on-surface-variant'
                                                                }`}>
                                                                    <span className="material-symbols-outlined text-[20px]">{opt.icon}</span>
                                                                </div>

                                                                <span className={`material-symbols-outlined text-[22px] transition-colors ${
                                                                    isSelected ? 'text-[#FF4D2E]' : 'text-outline/40'
                                                                }`}>
                                                                    {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                                                                </span>
                                                            </div>

                                                            <span className="font-bold text-sm text-on-surface">
                                                                {opt.value}
                                                            </span>
                                                            <span className="text-[11px] font-semibold text-[#FF4D2E] mt-0.5">
                                                                {isAr ? opt.badge.match(/\((.*?)\)/)?.[1] : opt.value}
                                                            </span>
                                                            <span className="text-[11px] text-on-surface-variant mt-1.5 leading-snug">
                                                                {isAr ? opt.subAr : opt.subEn}
                                                            </span>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        {/* 2. إظهار حقول حجم الفريق (minTeamSize و maxTeamSize) شرطياً:
                                            تظهر فقط إذا تم اختيار "Team Only" أو "Both / Solo & Team"
                                            وتختفي تماماً إذا تم اختيار "Solo Only" */}
                                        {(formData.participationType === 'Team Only' || formData.participationType === 'Both / Solo & Team') && (
                                            <div className="rounded-xl border border-outline-variant/50 bg-surface dark:bg-[#16181c] p-4 md:p-5 space-y-4 animate-[fadeIn_0.25s_ease-out]">
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[#FF4D2E] text-[20px]">group</span>
                                                    <div>
                                                        <h4 className="font-bold text-xs uppercase tracking-wider text-on-surface">
                                                            {isAr ? 'تحديد سعة وحجم الفريق' : 'Team Size Boundaries'}
                                                        </h4>
                                                        <p className="text-[11px] text-on-surface-variant">
                                                            {isAr
                                                                ? 'حدد الحد الأدنى والأقصى المسموح به لأعضاء كل فريق مسجل'
                                                                : 'Define the allowed participant count range per registered team'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {/* الحد الأدنى لأعضاء الفريق */}
                                                    <div className="form-group">
                                                        <label className="form-label text-xs" htmlFor="ev-minTeamSize">
                                                            {isAr ? 'الحد الأدنى لأعضاء الفريق' : 'Minimum Team Members'} <span className="text-[#FF4D2E]">*</span>
                                                        </label>
                                                        <div className="relative">
                                                            <span className="material-symbols-outlined absolute top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none left-3 rtl:left-auto rtl:right-3">
                                                                group
                                                            </span>
                                                            <input
                                                                className="form-input !pl-11 rtl:!pr-11 rtl:!pl-4 focus:!border-[#FF4D2E] focus:!ring-2 focus:!ring-[#FF4D2E]/20"
                                                                id="ev-minTeamSize"
                                                                name="minTeamSize"
                                                                type="text"
                                                                inputMode="numeric"
                                                                min="2"
                                                                value={formData.minTeamSize}
                                                                onChange={e => {
                                                                    const cleaned = normalizeDigits(e.target.value)
                                                                    handleInputChange('minTeamSize', cleaned)
                                                                }}
                                                                placeholder={isAr ? 'على الأقل عضوين (مثال: 2)' : 'Min. 2 members (e.g. 2)'}
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* الحد الأقصى لأعضاء الفريق */}
                                                    <div className="form-group">
                                                        <label className="form-label text-xs" htmlFor="ev-maxTeamSize">
                                                            {isAr ? 'الحد الأقصى لأعضاء الفريق' : 'Maximum Team Members'} <span className="text-[#FF4D2E]">*</span>
                                                        </label>
                                                        <div className="relative">
                                                            <span className="material-symbols-outlined absolute top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none left-3 rtl:left-auto rtl:right-3">
                                                                person_add
                                                            </span>
                                                            <input
                                                                className="form-input !pl-11 rtl:!pr-11 rtl:!pl-4 focus:!border-[#FF4D2E] focus:!ring-2 focus:!ring-[#FF4D2E]/20"
                                                                id="ev-maxTeamSize"
                                                                name="maxTeamSize"
                                                                type="text"
                                                                inputMode="numeric"
                                                                min="2"
                                                                value={formData.maxTeamSize}
                                                                onChange={e => {
                                                                    const cleaned = normalizeDigits(e.target.value)
                                                                    handleInputChange('maxTeamSize', cleaned)
                                                                }}
                                                                placeholder={isAr ? 'مثال: 4 أو 5' : 'e.g. 4 or 5'}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-2 text-[11px] text-on-surface-variant bg-surface-container/60 p-2.5 rounded-lg border border-outline-variant/30">
                                                    <span className="material-symbols-outlined text-[16px] text-[#FF4D2E] flex-shrink-0 mt-0.5">info</span>
                                                    <div className="space-y-0.5">
                                                        <span>
                                                            {isAr
                                                                ? (formData.minTeamSize && formData.maxTeamSize
                                                                    ? `سعة الفريق المسجل: من ${formData.minTeamSize} إلى ${formData.maxTeamSize} أعضاء.`
                                                                    : 'حدد سعة الفريق المسموح بها لكل فريق مسجل.')
                                                                : (formData.minTeamSize && formData.maxTeamSize
                                                                    ? `Registered team capacity: ${formData.minTeamSize} to ${formData.maxTeamSize} members.`
                                                                    : 'Define the allowed participant count per registered team.')}
                                                        </span>
                                                        {formData.participationType === 'Both / Solo & Team' && (
                                                            <p className="text-[10px] text-on-surface-variant/80">
                                                                {isAr
                                                                    ? '💡 التسجيل الفردي متاح تلقائياً (فردي)، وهذا النطاق يحدد حجم الفرق المسجلة فقط.'
                                                                    : '💡 Solo participation is allowed automatically; this range applies to teams only.'}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* تنبيه واضح عند اختيار Solo Only لتأكيد إخفاء حجم الفريق */}
                                        {formData.participationType === 'Solo Only' && (
                                            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/15 p-4 flex items-start gap-3 animate-[fadeIn_0.25s_ease-out]">
                                                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[20px] flex-shrink-0 mt-0.5">
                                                    lock
                                                </span>
                                                <div className="text-xs text-on-surface-variant space-y-1 leading-relaxed">
                                                    <span className="font-bold text-on-surface block">
                                                        {isAr ? 'تم تحديد المسابقة كفردية فقط (Solo Only)' : 'Solo Only Mode Selected'}
                                                    </span>
                                                    <p>
                                                        {isAr
                                                            ? 'حقول حجم الفريق محجوبة تلقائياً لأن التسجيل فردي حصرياً ولا يتطلب تشكيل فرق.'
                                                            : 'Team size fields are hidden because this challenge is designated solely for individual contenders.'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    </div>
                                )}

                                {/* Cover Image Upload */}
                                <div className="form-group">
                                    <label className="form-label" htmlFor="ev-cover">
                                        {isAr ? 'صورة الغلاف' : 'Cover Image'}
                                    </label>
                                    <label className="upload-dropzone hover:border-[#FF4D2E]" htmlFor="ev-cover">
                                        <span className="upload-dropzone__icon !text-[#FF4D2E] !bg-[#FF4D2E]/10">
                                            <span className="material-symbols-outlined">upload</span>
                                        </span>
                                        <p className="upload-dropzone__label" id="ev-cover-label">
                                            {coverName ?? (isAr ? 'اسحب الصورة هنا أو اضغط للاختيار' : 'Drag and drop, or click to upload cover image')}
                                        </p>
                                        <span className="upload-dropzone__hint">PNG, JPG or JPEG (max. 5MB)</span>
                                    </label>
                                    <input
                                        accept="image/*"
                                        className="sr-only"
                                        id="ev-cover"
                                        name="cover"
                                        type="file"
                                        onChange={e => {
                                            const file = e.target.files?.[0]
                                            const name = file?.name ?? null
                                            setCoverName(name)
                                            if (name) {
                                                handleInputChange('coverName', name)
                                            }
                                        }}
                                    />
                                </div>
                            </section>

                            {/* STEP 2: Review Event Details */}
                            <section className={step === 2 ? 'flex flex-col gap-5 fade-in' : 'hidden'}>
                                <div>
                                    <h3 className="font-headline-lg text-title-lg text-on-surface mb-1">
                                        {isAr ? 'مراجعة وتأكيد بيانات الفعالية' : 'Review your event details'}
                                    </h3>
                                    <p className="text-sm text-on-surface-variant">
                                        {isAr
                                            ? 'تأكد من صحة الحقول ونوع المشاركة قبل إرسال الفعالية للمراجعة النهائية.'
                                            : 'Check the details below before submitting. You can go back to edit any section.'}
                                    </p>
                                </div>

                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4" id="wizard-review">
                                    {/* Event Title */}
                                    <div className="review-card">
                                        <dt className="review-label">{isAr ? 'عنوان الفعالية' : 'Event Title'}</dt>
                                        <dd className="review-value font-bold text-base text-on-surface">
                                            {reviewData.title || (isAr ? 'غير محدد' : 'Not provided')}
                                        </dd>
                                    </div>

                                    {/* Category */}
                                    <div className="review-card">
                                        <dt className="review-label">{isAr ? 'التصنيف' : 'Category'}</dt>
                                        <dd className="review-value flex items-center gap-1.5 font-semibold text-[#FF4D2E]">
                                            <span className="material-symbols-outlined text-[18px]">
                                                {currentCatMeta.icon}
                                            </span>
                                            {isAr ? currentCatMeta.labelAr : currentCatMeta.labelEn}
                                        </dd>
                                    </div>

                                    {/* Location */}
                                    <div className="review-card">
                                        <dt className="review-label">{isAr ? 'الموقع' : 'Location'}</dt>
                                        <dd className="review-value">
                                            {reviewData.location || (isAr ? 'عن بعد / غير محدد' : 'Remote / Not provided')}
                                        </dd>
                                    </div>

                                    {/* Schedule */}
                                    <div className="review-card">
                                        <dt className="review-label">{isAr ? 'الفترة الزمنية' : 'Schedule'}</dt>
                                        <dd className="review-value font-mono text-xs">
                                            {reviewData.startDate} → {reviewData.endDate}
                                        </dd>
                                    </div>

                                    {/* Competition-specific details in Review */}
                                    {isComp && (
                                        <>
                                            <div className="review-card border-[#FF4D2E]/30 bg-[#FF4D2E]/[0.02]">
                                                <dt className="review-label text-[#FF4D2E]">{isAr ? 'نوع المشاركة' : 'Participation Type'}</dt>
                                                <dd className="review-value">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FF4D2E] text-white">
                                                        <span className="material-symbols-outlined text-[15px]">
                                                            {reviewData.participationType === 'Solo Only' ? 'person' : reviewData.participationType === 'Team Only' ? 'groups' : 'join_inner'}
                                                        </span>
                                                        {reviewData.participationType || 'Both / Solo & Team'}
                                                    </span>
                                                </dd>
                                            </div>

                                            {reviewData.participationType !== 'Solo Only' ? (
                                                <div className="review-card border-[#FF4D2E]/30 bg-[#FF4D2E]/[0.02]">
                                                    <dt className="review-label text-[#FF4D2E]">{isAr ? 'سعة الفريق' : 'Team Size Boundaries'}</dt>
                                                    <dd className="review-value font-semibold">
                                                        {isAr
                                                            ? `من ${reviewData.minTeamSize || 2} إلى ${reviewData.maxTeamSize || 4} أعضاء`
                                                            : `${reviewData.minTeamSize || 2} - ${reviewData.maxTeamSize || 4} members`}
                                                        {reviewData.participationType === 'Both / Solo & Team' && (
                                                            <span className="block text-[11px] text-on-surface-variant font-normal mt-0.5">
                                                                {isAr ? '(مع إتاحة المشاركة الفردية تلقائياً للمتسابقين)' : '(Solo participation is also allowed)'}
                                                            </span>
                                                        )}
                                                    </dd>
                                                </div>
                                            ) : (
                                                <div className="review-card border-amber-500/30 bg-amber-500/5">
                                                    <dt className="review-label text-amber-600 dark:text-amber-400">{isAr ? 'حجم الفريق' : 'Team Size'}</dt>
                                                    <dd className="review-value text-xs text-on-surface-variant font-medium">
                                                        {isAr ? 'مشاركة فردية (بدون فرق)' : 'Individual only (No teams)'}
                                                    </dd>
                                                </div>
                                            )}

                                            <div className="review-card col-span-1 md:col-span-2">
                                                <dt className="review-label">{isAr ? 'الجوائز والمكافآت' : 'Prize / Scholarship'}</dt>
                                                <dd className="review-value font-medium text-emerald-600 dark:text-emerald-400">
                                                    {reviewData.prize || (isAr ? 'لا توجد جوائز محددة' : 'Not specified')}
                                                </dd>
                                            </div>
                                        </>
                                    )}

                                    {/* Description */}
                                    <div className="review-card col-span-1 md:col-span-2">
                                        <dt className="review-label">{isAr ? 'الوصف' : 'Description'}</dt>
                                        <dd className="review-value whitespace-pre-line text-xs leading-relaxed">
                                            {reviewData.description}
                                        </dd>
                                    </div>

                                    {/* Requirements */}
                                    {reviewData.requirements && (
                                        <div className="review-card col-span-1 md:col-span-2">
                                            <dt className="review-label">{isAr ? 'المتطلبات والشروط' : 'Requirements'}</dt>
                                            <dd className="review-value whitespace-pre-line text-xs leading-relaxed">
                                                {reviewData.requirements}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </section>

                            {/* STEP 3: Publish Confirmation */}
                            <section className={step === 3 ? 'flex flex-col items-center gap-3 py-6 text-center fade-in' : 'hidden'}>
                                <div className="publish-success-card">
                                    <div className="publish-icon animate-[bounce_0.6s_ease-out]">
                                        <span className="material-symbols-outlined text-[36px]">task_alt</span>
                                    </div>
                                    <h3 className="font-headline-lg text-title-lg text-on-surface">
                                        {isAr ? 'جاهز للإرسال والمراجعة' : 'Ready to Submit for Approval'}
                                    </h3>
                                    <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
                                        {isAr
                                            ? 'سيتم إرسال الفعالية وإعدادات المشاركة المحددة إلى مسؤولي منصة EVENTIFY لمراجعتها واعتماد ظهورها لجميع المشاركين.'
                                            : 'Publishing sends the event to the EVENTIFY review team. You will receive a notification once it is approved and live for participants.'}
                                    </p>
                                </div>
                            </section>

                            {/* Action Bar */}
                            <div className="wizard-actions flex items-center justify-between pt-6 border-t border-outline-variant/30 flex-wrap gap-3">
                                <Link className="wizard-cancel-link hover:text-[#FF4D2E]" to="/org/dashboard">
                                    {isAr ? 'إلغاء والعودة' : 'Cancel'}
                                </Link>

                                <div className="flex items-center gap-3">
                                    {step > 1 && (
                                        <button
                                            className="btn-secondary px-5 py-2.5 rounded-xl border border-outline-variant/60 font-semibold text-sm hover:bg-surface-container"
                                            id="wizard-back"
                                            type="button"
                                            onClick={() => goTo(step - 1)}
                                        >
                                            {isAr ? 'السابق' : 'Back'}
                                        </button>
                                    )}

                                    <button
                                        className="btn-secondary px-5 py-2.5 rounded-xl border border-outline-variant/60 font-semibold text-sm hover:bg-surface-container"
                                        id="wizard-draft"
                                        type="button"
                                        onClick={() => {
                                            saveDraft()
                                            toast(isAr ? 'تم حفظ المسودة بنجاح' : 'Draft saved on this device', 'success')
                                        }}
                                    >
                                        {isAr ? 'حفظ كمسودة' : 'Save Draft'}
                                    </button>

                                    {step < 3 && (
                                        <button
                                            className="btn-primary !bg-[#FF4D2E] hover:!bg-[#e23b1c] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-[#FF4D2E]/25 transition-all min-w-[120px]"
                                            id="wizard-next"
                                            type="button"
                                            onClick={handleNext}
                                        >
                                            {step === 2
                                                ? (isAr ? 'متابعة إلى النشر' : 'Continue to publish')
                                                : (isAr ? 'التالي' : 'Next')}
                                        </button>
                                    )}

                                    {step === 3 && (
                                        <button
                                            className="btn-primary !bg-[#FF4D2E] hover:!bg-[#e23b1c] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-[#FF4D2E]/25 transition-all min-w-[130px] disabled:opacity-50"
                                            id="wizard-publish"
                                            type="button"
                                            disabled={publishing}
                                            onClick={handlePublish}
                                        >
                                            {publishing
                                                ? (isAr ? 'جارِ الإرسال...' : 'Submitting...')
                                                : (isAr ? 'إرسال للاعتماد' : 'Publish')}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </>
    )
}
