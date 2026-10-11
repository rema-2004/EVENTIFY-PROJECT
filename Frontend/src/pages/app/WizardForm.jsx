import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useOnboarding } from '../../context/OnboardingContext'

const MAJOR_OPTIONS = [
    {
        id: 'cs_se',
        titleEn: 'Computer Science & Software',
        titleAr: 'علوم حاسوب وهندسة برمجيات',
        icon: 'terminal',
        headlineEn: 'Computer Science & Software Engineering',
        headlineAr: 'علوم حاسوب وهندسة برمجيات',
    },
    {
        id: 'ai_ds',
        titleEn: 'AI & Data Science',
        titleAr: 'الذكاء الاصطناعي وعلم البيانات',
        icon: 'psychology',
        headlineEn: 'Artificial Intelligence & Data Science',
        headlineAr: 'الذكاء الاصطناعي وعلم البيانات',
    },
    {
        id: 'cyber',
        titleEn: 'Cybersecurity & Networks',
        titleAr: 'الأمن السيبراني والشبكات',
        icon: 'security',
        headlineEn: 'Cybersecurity & Network Engineering',
        headlineAr: 'الأمن السيبراني وهندسة الشبكات',
    },
    {
        id: 'uiux',
        titleEn: 'UI/UX & Product Design',
        titleAr: 'تصميم واجهات وتجربة المستخدم',
        icon: 'palette',
        headlineEn: 'UI/UX Designer & Product Specialist',
        headlineAr: 'تصميم واجهات وتجربة مستخدم (UI/UX)',
    },
    {
        id: 'web_mobile',
        titleEn: 'Web & Mobile Apps',
        titleAr: 'تطوير تطبيقات الويب والموبايل',
        icon: 'phone_iphone',
        headlineEn: 'Web & Mobile App Developer',
        headlineAr: 'مطور تطبيقات ويب وموبايل',
    },
    {
        id: 'ce_ee',
        titleEn: 'Computer Engineering & IoT',
        titleAr: 'هندسة حاسوب ونظم ذكية',
        icon: 'memory',
        headlineEn: 'Computer Engineering & Embedded Systems',
        headlineAr: 'هندسة حاسوب ونظم ذكية',
    },
    {
        id: 'mis',
        titleEn: 'MIS & Business Tech',
        titleAr: 'نظم معلومات وتكنولوجيا أعمال',
        icon: 'analytics',
        headlineEn: 'Management Information Systems (MIS)',
        headlineAr: 'نظم معلومات إدارية وريادة تقنية',
    },
    {
        id: 'other',
        titleEn: 'Other Major / Tech Enthusiast',
        titleAr: 'تخصص آخر / مهتم بالتقنية',
        icon: 'school',
        headlineEn: 'Technology Enthusiast & Student',
        headlineAr: 'مهتم بالتقنية والابتكار',
    },
]

const POPULAR_SKILLS = [
    'React', 'Python', 'UI/UX', 'Node.js', 'AI', 'Tailwind CSS',
    'Figma', 'Flutter', 'TypeScript', 'Data Science', 'Docker', 'SQL',
]

const POPULAR_INTERESTS = [
    { id: 'ai', en: 'AI & Machine Learning', ar: 'الذكاء الاصطناعي وتعلم الآلة', icon: 'smart_toy' },
    { id: 'web', en: 'Web Development', ar: 'تطوير وتصميم الويب', icon: 'language' },
    { id: 'mobile', en: 'Mobile Apps', ar: 'تطبيقات الهواتف الذكية', icon: 'smartphone' },
    { id: 'security', en: 'Cybersecurity & CTF', ar: 'الأمن السيبراني والـ CTF', icon: 'security' },
    { id: 'uiux', en: 'UI/UX & Product Design', ar: 'تصميم واجهات وتجربة المستخدم', icon: 'palette' },
    { id: 'data', en: 'Data Science & Analytics', ar: 'علم البيانات وتحليل البيانات', icon: 'insights' },
    { id: 'cloud', en: 'Cloud & DevOps', ar: 'الحوسبة السحابية و DevOps', icon: 'cloud' },
    { id: 'game', en: 'Game Development', ar: 'تطوير وبرمجة الألعاب', icon: 'sports_esports' },
    { id: 'iot', en: 'Robotics & Hardware IoT', ar: 'الروبوتات وإنترنت الأشياء', icon: 'precision_manufacturing' },
    { id: 'startups', en: 'Tech Startups & Innovation', ar: 'ريادة الأعمال والمشاريع الناشئة', icon: 'rocket_launch' },
]

export default function WizardForm() {
    const navigate = useNavigate()
    const { language } = useLanguage()
    const ar = language === 'ar'
    const { userProfile, completeProfile, setIsProfileComplete } = useOnboarding()

    const [currentStep, setCurrentStep] = useState(1)
    const totalSteps = 4

    // Selected major ID
    const [selectedMajorId, setSelectedMajorId] = useState('cs_se')

    // Form inputs state
    const [formData, setFormData] = useState({
        name: userProfile?.fullName || 'John Nanna',
        headline: userProfile?.education || (ar ? 'علوم حاسوب وهندسة برمجيات' : 'Computer Science & Software Engineering'),
        location: userProfile?.location || (ar ? 'عمّان، الأردن' : 'Amman, Jordan'),
        skills: userProfile?.skills && userProfile.skills.length > 0
            ? userProfile.skills
            : ['React', 'Python', 'UI/UX'],
        interests: userProfile?.interests && userProfile.interests.length > 0
            ? userProfile.interests
            : [ar ? 'الذكاء الاصطناعي وتعلم الآلة' : 'AI & Machine Learning', ar ? 'تطوير وتصميم الويب' : 'Web Development'],
        experience: [
            {
                title: '',
                org: '',
                period: '',
                desc: '',
            },
        ],
        projects: [
            {
                title: '',
                context: '',
                desc: '',
            },
        ],
    })

    const [customSkillInput, setCustomSkillInput] = useState('')
    const [customInterestInput, setCustomInterestInput] = useState('')
    const [showProjectFields, setShowProjectFields] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isUnlocking, setIsUnlocking] = useState(false)

    // Validation rules
    const isStep1Valid = Boolean(formData.headline && formData.headline.trim().length > 0)
    const isStep2Valid = Boolean(formData.skills && formData.skills.length > 0)

    // Handle major selection
    const handleSelectMajor = (major) => {
        setSelectedMajorId(major.id)
        setFormData((prev) => ({
            ...prev,
            headline: ar ? major.headlineAr : major.headlineEn,
        }))
    }

    // Toggle skills
    const toggleSkill = (skill) => {
        if (formData.skills.includes(skill)) {
            setFormData((prev) => ({
                ...prev,
                skills: prev.skills.filter((s) => s !== skill),
            }))
        } else {
            setFormData((prev) => ({
                ...prev,
                skills: [...prev.skills, skill],
            }))
        }
    }

    const handleAddCustomSkill = (e) => {
        e?.preventDefault()
        const trimmed = customSkillInput.trim()
        if (trimmed && !formData.skills.includes(trimmed)) {
            setFormData((prev) => ({
                ...prev,
                skills: [...prev.skills, trimmed],
            }))
            setCustomSkillInput('')
        }
    }

    // Interest handlers (for Step 4)
    const toggleInterest = (interestName) => {
        setFormData((prev) => {
            const currentInterests = prev.interests || []
            if (currentInterests.includes(interestName)) {
                return {
                    ...prev,
                    interests: currentInterests.filter((item) => item !== interestName),
                }
            } else {
                return {
                    ...prev,
                    interests: [...currentInterests, interestName],
                }
            }
        })
    }

    const handleAddCustomInterest = (e) => {
        e?.preventDefault()
        const trimmed = customInterestInput.trim()
        if (trimmed && !(formData.interests || []).includes(trimmed)) {
            setFormData((prev) => ({
                ...prev,
                interests: [...(prev.interests || []), trimmed],
            }))
            setCustomInterestInput('')
        }
    }

    // Experience handlers
    const handleUpdateExperience = (index, field, value) => {
        setFormData((prev) => {
            const next = [...prev.experience]
            next[index] = { ...next[index], [field]: value }
            return { ...prev, experience: next }
        })
    }

    const handleAddExperience = () => {
        setFormData((prev) => ({
            ...prev,
            experience: [
                ...prev.experience,
                { title: '', org: '', period: '', desc: '' },
            ],
        }))
    }

    const handleRemoveExperience = (index) => {
        setFormData((prev) => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index),
        }))
    }

    // Projects handlers (optional)
    const handleUpdateProject = (index, field, value) => {
        setFormData((prev) => {
            const next = [...prev.projects]
            next[index] = { ...next[index], [field]: value }
            return { ...prev, projects: next }
        })
    }

    // Navigation
    const handleNext = () => {
        if (currentStep === 1 && !isStep1Valid) return
        if (currentStep === 2 && !isStep2Valid) return

        if (currentStep < totalSteps) {
            setCurrentStep((prev) => prev + 1)
        } else {
            handleFinish()
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1)
        } else {
            setIsProfileComplete(false)
            navigate('/app')
        }
    }

    // Optional Step 3 Skip handler
    const handleSkipExperience = () => {
        setFormData((prev) => ({ ...prev, experience: [] }))
        setCurrentStep(4)
    }

    // Optional Step 4 Skip handler (immediately submits form)
    const handleSkipInterests = () => {
        handleFinish()
    }

    // Form Submission: Only sends fields the user actually provided
    const handleFinish = (overrideProjects) => {
        setIsSaving(true)
        setIsUnlocking(true)

        // Only include experience entries with an actual title
        const cleanExperience = (formData.experience || [])
            .map((e) => ({
                title: (e.title || '').trim(),
                org: (e.org || '').trim(),
                period: (e.period || '').trim(),
                desc: (e.desc || '').trim(),
            }))
            .filter((e) => e.title)

        // Only include projects with an actual title
        const targetProjects = overrideProjects !== undefined ? overrideProjects : formData.projects
        const cleanProjects = (targetProjects || [])
            .map((p) => ({
                title: (p.title || '').trim(),
                context: (p.context || '').trim(),
                desc: (p.desc || '').trim(),
            }))
            .filter((p) => p.title)

        setTimeout(() => {
            completeProfile({
                name: (formData.name || 'John Nanna').trim(),
                fullName: (formData.name || 'John Nanna').trim(),
                headline: formData.headline.trim(),
                education: formData.headline.trim(),
                location: (formData.location || 'Amman, Jordan').trim(),
                about: (formData.about || (ar
                    ? `طالب ومطور مهتم بـ ${formData.headline}. أبحث عن المشاركة في الهاكاثونات والفعاليات التقنية وتطوير المشاريع المبتكرة.`
                    : `Passionate developer focused on ${formData.headline}. Looking to participate in top hackathons, tech workshops, and innovative projects.`)).trim(),
                skills: formData.skills,
                interests: (formData.interests && formData.interests.length > 0)
                    ? formData.interests
                    : (formData.skills.slice(0, 3)),
                experience: cleanExperience,
                projects: cleanProjects,
                setupMethod: 'wizard',
            })
            setIsSaving(false)
            navigate('/app')
        }, 1400)
    }

    return (
        <div className="min-h-screen bg-[#0E1116] text-white flex flex-col justify-between py-6 px-4 relative">
            {/* Unlock Celebration Modal */}
            {isUnlocking && (
                <div className="fixed inset-0 z-[9999] bg-[#0E1116]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-[#FF4D2E]/30 rounded-full blur-2xl animate-pulse" />
                        <div className="relative w-28 h-28 rounded-full bg-slate-900 border-2 border-[#FF4D2E] flex items-center justify-center text-[#FF4D2E] shadow-[0_0_50px_rgba(255,77,46,0.6)] animate-bounce">
                            <span className="material-symbols-outlined text-6xl">
                                lock_open
                            </span>
                        </div>
                        <div className="absolute -top-3 -right-3 text-amber-400 animate-spin">
                            <span className="material-symbols-outlined text-3xl">auto_awesome</span>
                        </div>
                        <div className="absolute -bottom-2 -left-3 text-green-400">
                            <span className="material-symbols-outlined text-2xl">verified</span>
                        </div>
                    </div>

                    <div className="space-y-3 max-w-sm">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                            {ar ? 'تم تجهيز ملفك بنجاح!' : 'Profile Ready & Unlocked!'}
                        </h2>
                        <p className="text-sm text-gray-300">
                            {ar
                                ? 'يقوم الذكاء الاصطناعي الآن بفتح الفعاليات والهاكاثونات المطابقة لمهاراتك وتخصصك...'
                                : 'AI matching engine has unlocked opportunities tailored specifically to your profile!'}
                        </p>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF4D2E]/20 text-[#FF4D2E] text-xs font-semibold mt-2">
                            <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                            <span>{ar ? 'جاري فتح التوصيات...' : 'Opening Recommended For You...'}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Navigation Bar with Step Count */}
            <div className="max-w-5xl w-full mx-auto pb-4 border-b border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all text-xs font-semibold cursor-pointer border border-white/10"
                        title={ar ? 'رجوع' : 'Back'}
                        aria-label={ar ? 'رجوع' : 'Back'}
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            {ar ? 'arrow_forward' : 'arrow_back'}
                        </span>
                        <span>{ar ? 'رجوع' : 'Back'}</span>
                    </button>

                    <div className="text-center">
                        <h1 className="text-base font-bold text-white">
                            {ar ? 'الاستبيان السريع' : 'Quick Questionnaire'}
                        </h1>
                        <span className="text-xs text-[#FF8566] font-semibold">
                            {ar
                                ? `الخطوة ${currentStep} من ${totalSteps}${currentStep >= 3 ? ' (اختياري)' : ' (إلزامي)'}`
                                : `Step ${currentStep} of ${totalSteps}${currentStep >= 3 ? ' (Optional)' : ' (Mandatory)'}`}
                        </span>
                    </div>

                    <div className="w-16 flex justify-end">
                        {/* Step 1 & 2 are strictly mandatory: NO skip button rendered */}
                        {currentStep === 3 && (
                            <button
                                type="button"
                                onClick={handleSkipExperience}
                                className="text-xs text-gray-400 hover:text-[#FF8566] underline underline-offset-2 transition-colors cursor-pointer"
                            >
                                {ar ? 'تخطي' : 'Skip'}
                            </button>
                        )}
                        {currentStep === 4 && (
                            <button
                                type="button"
                                onClick={handleSkipInterests}
                                className="text-xs text-gray-400 hover:text-[#FF8566] underline underline-offset-2 transition-colors cursor-pointer"
                            >
                                {ar ? 'تخطي' : 'Skip'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-[#FF4D2E] to-[#FF8566] transition-all duration-300 rounded-full"
                        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    />
                </div>
            </div>

            {/* Step Content Container (Spacious Full Width) */}
            <div className="max-w-5xl w-full mx-auto my-auto py-6">
                {/* STEP 1 (MANDATORY): Basic Info (Title/Headline & Location) */}
                {currentStep === 1 && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="space-y-1">
                            <div className="inline-flex items-center gap-1.5 text-xs text-[#FF8566] font-bold">
                                <span className="material-symbols-outlined text-[14px]">school</span>
                                <span>{ar ? '1. المعلومات الأساسية (إلزامي)' : '1. Basic Info (Mandatory)'}</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black text-white">
                                {ar ? 'شو تخصصك ومجالك الأساسي؟' : 'What is your title & specialization?'}
                            </h2>
                            <p className="text-xs text-gray-400">
                                {ar
                                    ? 'يجب ملء المسمى والتخصص للبدء، اختر أحد المجالات أو اكتب تخصصك بالتحديد'
                                    : 'Title/specialization is required so AI can match relevant hackathons.'}
                            </p>
                        </div>

                        {/* Interactive Major Selection Cards - Spacious 4-column Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-1">
                            {MAJOR_OPTIONS.map((major) => {
                                const isSelected = selectedMajorId === major.id
                                return (
                                    <button
                                        key={major.id}
                                        type="button"
                                        onClick={() => handleSelectMajor(major)}
                                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                                            isSelected
                                                ? 'bg-[#FF4D2E]/15 border-[#FF4D2E] text-white shadow-[0_0_20px_rgba(255,77,46,0.25)] ring-1 ring-[#FF4D2E]'
                                                : 'bg-slate-900/80 border-white/10 hover:border-white/25 text-gray-300 hover:bg-slate-900'
                                        }`}
                                    >
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                            isSelected ? 'bg-[#FF4D2E] text-white' : 'bg-white/5 text-gray-400'
                                        }`}>
                                            <span className="material-symbols-outlined text-[20px]">
                                                {major.icon}
                                            </span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs sm:text-sm font-bold leading-tight line-clamp-2">
                                                {ar ? major.titleAr : major.titleEn}
                                            </p>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Detailed Title / Location Inputs - Spacious 3 Columns */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-white/10">
                            <div className="space-y-1 md:col-span-1">
                                <label className="text-xs font-semibold text-gray-300 flex items-center justify-between">
                                    <span>
                                        {ar ? 'المسمى / التخصص *' : 'Title / Specialization *'}
                                    </span>
                                    <span className="text-[10px] text-[#FF8566] font-bold">
                                        {ar ? 'إلزامي' : 'Required'}
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.headline}
                                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                                    className={`w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border text-white text-xs focus:outline-none transition-colors ${
                                        !isStep1Valid ? 'border-red-500/50 focus:border-red-500' : 'border-white/15 focus:border-[#FF4D2E]'
                                    }`}
                                    placeholder={ar ? 'مثال: مهندس برمجيات / علوم حاسوب' : 'e.g. Software Engineer / Computer Science'}
                                    required
                                />
                                {!isStep1Valid && (
                                    <p className="text-[11px] text-red-400 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[13px]">info</span>
                                        <span>{ar ? 'يرجى كتابة المسمى أو التخصص للمتابعة' : 'Title is required to continue'}</span>
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-300">
                                    {ar ? 'الاسم' : 'Name'}
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-white/15 focus:border-[#FF4D2E] text-white text-xs focus:outline-none"
                                    placeholder="John Nanna"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-300">
                                    {ar ? 'الموقع' : 'Location'}
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-white/15 focus:border-[#FF4D2E] text-white text-xs focus:outline-none"
                                    placeholder="Amman, Jordan"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2 (MANDATORY): Skills (At least 1 skill required) */}
                {currentStep === 2 && (
                    <div className="space-y-4 animate-in fade-in">
                        <div className="space-y-1">
                            <div className="inline-flex items-center gap-1.5 text-xs text-[#FF8566] font-bold">
                                <span className="material-symbols-outlined text-[14px]">psychology</span>
                                <span>{ar ? '2. المهارات التقنية (إلزامي)' : '2. Skills (Mandatory)'}</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black text-white">
                                {ar ? 'حدد مهاراتك وتقنياتك' : 'Select your skills & tools'}
                            </h2>
                            <p className="text-xs text-gray-400">
                                {ar
                                    ? 'يجب اختيار مهارة واحدة على الأقل للمتابعة وحساب نسبة المطابقة بالذكاء الاصطناعي'
                                    : 'At least one skill must be selected for the AI matcher to work.'}
                            </p>
                        </div>

                        {/* Interactive Clickable Tags */}
                        <div className="space-y-2 pt-1">
                            <div className="flex flex-wrap gap-2">
                                {POPULAR_SKILLS.map((skill) => {
                                    const isSelected = formData.skills.includes(skill)
                                    return (
                                        <button
                                            key={skill}
                                            type="button"
                                            onClick={() => toggleSkill(skill)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                                                isSelected
                                                    ? 'bg-[#FF4D2E] text-white border-[#FF4D2E] shadow-sm scale-105'
                                                    : 'bg-slate-900 text-gray-300 border-white/15 hover:border-white/30'
                                            }`}
                                        >
                                            {isSelected && <span className="mr-1 font-bold">✔</span>}
                                            <span>{skill}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Selected skills summary */}
                        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
                            <div className="flex justify-between items-center text-[11px] text-gray-400">
                                <span>{ar ? 'المهارات المحددة في ملفك:' : 'Selected Skills:'}</span>
                                <span className={formData.skills.length > 0 ? 'text-[#FF8566] font-bold' : 'text-red-400 font-bold'}>
                                    {formData.skills.length} {formData.skills.length === 0 && (ar ? '(اختر مهارة واحدة على الأقل)' : '(pick at least 1)')}
                                </span>
                            </div>
                            {formData.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                    {formData.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FF4D2E]/20 text-[#FF8566] text-[11px] font-semibold border border-[#FF4D2E]/30"
                                        >
                                            <span>{skill}</span>
                                            <button
                                                type="button"
                                                onClick={() => toggleSkill(skill)}
                                                className="hover:text-white cursor-pointer ml-1"
                                                aria-label={`Remove ${skill}`}
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-500 italic">
                                    {ar ? 'لم يتم تحديد أي مهارة بعد' : 'No skills selected yet'}
                                </p>
                            )}
                        </div>

                        {/* Custom skill adder */}
                        <form onSubmit={handleAddCustomSkill} className="flex gap-2">
                            <input
                                type="text"
                                value={customSkillInput}
                                onChange={(e) => setCustomSkillInput(e.target.value)}
                                placeholder={ar ? 'إضافة مهارة أخرى (مثال: Flutter, AWS)...' : 'Add another skill (e.g. Flutter, AWS)...'}
                                className="flex-1 py-2 px-3 text-xs rounded-xl bg-slate-900 border border-white/15 focus:border-[#FF4D2E] text-white focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="px-3.5 py-2 text-xs rounded-xl bg-white/10 hover:bg-[#FF4D2E] text-white font-bold transition-colors cursor-pointer"
                            >
                                {ar ? 'إضافة' : 'Add'}
                            </button>
                        </form>
                    </div>
                )}

                {/* STEP 3 (OPTIONAL): Experience */}
                {currentStep === 3 && (
                    <div className="space-y-4 animate-in fade-in">
                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <div className="inline-flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                                    <span className="material-symbols-outlined text-[14px]">work</span>
                                    <span>{ar ? '3. الخبرات (اختياري)' : '3. Experience (Optional)'}</span>
                                </div>
                                <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/10 text-gray-300 font-semibold">
                                    {ar ? 'اختياري' : 'Optional'}
                                </span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black text-white">
                                {ar ? 'هل لديك خبرات سابقة أو تدريب؟' : 'Any prior experience or internships?'}
                            </h2>
                            <p className="text-xs text-gray-400">
                                {ar
                                    ? 'يمكنك ملء بيانات خبراتك، أو الضغط على "تخطي هذه الخطوة" والمتابعة بدون خبرة'
                                    : 'You can fill in your experience, or click "Skip this step" to proceed without it.'}
                            </p>
                        </div>

                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                            {formData.experience.map((exp, index) => (
                                <div
                                    key={index}
                                    className="p-3.5 rounded-xl bg-slate-950 border border-white/10 space-y-2.5 relative"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-bold text-gray-400">
                                            {ar ? `خبرة #${index + 1}` : `Experience #${index + 1}`}
                                        </span>
                                        {formData.experience.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveExperience(index)}
                                                className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                                                title={ar ? 'حذف' : 'Remove'}
                                            >
                                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            value={exp.title}
                                            onChange={(e) => handleUpdateExperience(index, 'title', e.target.value)}
                                            placeholder={ar ? 'المسمى (مثال: متدرب برمجيات)' : 'Role Title (e.g. Software Intern)'}
                                            className="py-2 px-3 text-xs rounded-lg bg-slate-900 border border-white/15 focus:border-[#FF4D2E] text-white focus:outline-none"
                                        />
                                        <input
                                            type="text"
                                            value={exp.org}
                                            onChange={(e) => handleUpdateExperience(index, 'org', e.target.value)}
                                            placeholder={ar ? 'الجهة / الشركة / الجامعة' : 'Company / Organization'}
                                            className="py-2 px-3 text-xs rounded-lg bg-slate-900 border border-white/15 focus:border-[#FF4D2E] text-white focus:outline-none"
                                        />
                                    </div>

                                    <input
                                        type="text"
                                        value={exp.period}
                                        onChange={(e) => handleUpdateExperience(index, 'period', e.target.value)}
                                        placeholder={ar ? 'الفترة (مثال: صيف 2024 • 3 أشهر)' : 'Period (e.g. Summer 2024)'}
                                        className="w-full py-2 px-3 text-xs rounded-lg bg-slate-900 border border-white/15 focus:border-[#FF4D2E] text-white focus:outline-none"
                                    />

                                    <textarea
                                        rows={2}
                                        value={exp.desc}
                                        onChange={(e) => handleUpdateExperience(index, 'desc', e.target.value)}
                                        placeholder={ar ? 'وصف مختصر للمهام والإنجازات...' : 'Short description...'}
                                        className="w-full py-2 px-3 text-xs rounded-lg bg-slate-900 border border-white/15 focus:border-[#FF4D2E] text-white focus:outline-none leading-relaxed"
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={handleAddExperience}
                            className="inline-flex items-center gap-1 text-xs text-[#FF8566] hover:text-[#FF4D2E] font-bold cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[16px]">add_circle</span>
                            <span>{ar ? 'إضافة خبرة أخرى' : 'Add another experience'}</span>
                        </button>
                    </div>
                )}

                {/* STEP 4 (OPTIONAL): Interests & Learning Aspirations (Replaces daunting mandatory projects for beginners) */}
                {currentStep === 4 && (
                    <div className="space-y-4 animate-in fade-in">
                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <div className="inline-flex items-center gap-1.5 text-xs text-[#FF8566] font-bold">
                                    <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                                    <span>{ar ? '4. مجالات الاهتمام والشغف' : '4. Areas of Interest & Goals'}</span>
                                </div>
                                <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/10 text-gray-300 font-semibold">
                                    {ar ? 'اختياري' : 'Optional'}
                                </span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black text-white">
                                {ar ? 'شو المجالات اللي حابب تستكشفها وتتعلمها؟' : 'What topics are you eager to explore?'}
                            </h2>
                            <p className="text-xs text-gray-400">
                                {ar
                                    ? 'اختر مجالات اهتمامك وشغفك لنرشح لك ورش العمل، الهاكاثونات، والمسابقات الأنسب لمستواك.'
                                    : 'Select topics you want to explore so AI recommends relevant workshops, student hackathons, and learning sprints.'}
                            </p>
                        </div>

                        {/* Interactive Interests Grid - Spacious 5 Columns */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
                            {POPULAR_INTERESTS.map((item) => {
                                const label = ar ? item.ar : item.en
                                const isSelected = (formData.interests || []).includes(label)
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => toggleInterest(label)}
                                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                                            isSelected
                                                ? 'bg-[#FF4D2E]/20 border-[#FF4D2E] text-white shadow-[0_0_15px_rgba(255,77,46,0.25)] ring-1 ring-[#FF4D2E]'
                                                : 'bg-slate-900/80 border-white/10 hover:border-white/25 text-gray-300 hover:bg-slate-900'
                                        }`}
                                    >
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                            isSelected ? 'bg-[#FF4D2E] text-white' : 'bg-white/5 text-gray-400'
                                        }`}>
                                            <span className="material-symbols-outlined text-[17px]">{item.icon}</span>
                                        </div>
                                        <span className="text-xs font-semibold leading-snug line-clamp-2">
                                            {label}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Custom Interest Input */}
                        <form onSubmit={handleAddCustomInterest} className="flex gap-2 pt-2 max-w-xl">
                            <input
                                type="text"
                                value={customInterestInput}
                                onChange={(e) => setCustomInterestInput(e.target.value)}
                                placeholder={ar ? 'أضف مجال أو اهتمام آخر...' : 'Add another topic of interest...'}
                                className="flex-1 py-2.5 px-3.5 text-xs rounded-xl bg-slate-900 border border-white/15 focus:border-[#FF4D2E] text-white focus:outline-none"
                            />
                            <button
                                type="submit"
                                disabled={!customInterestInput.trim()}
                                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-40 text-xs font-bold text-white transition-colors cursor-pointer"
                            >
                                {ar ? 'إضافة' : 'Add'}
                            </button>
                        </form>

                        {/* Optional Accordion: Have a project? Add it optionally without pressure */}
                        <div className="pt-3 border-t border-white/10">
                            <button
                                type="button"
                                onClick={() => setShowProjectFields((prev) => !prev)}
                                className="w-full flex items-center justify-between text-xs text-gray-400 hover:text-white transition-colors cursor-pointer py-1"
                            >
                                <span className="flex items-center gap-1.5 font-medium">
                                    <span className="material-symbols-outlined text-[15px] text-[#FF8566]">rocket_launch</span>
                                    {ar ? 'هل لديك مشروع سابق ترغب بإبرازه؟ (اختياري تماماً)' : 'Have a project you want to mention? (Optional)'}
                                </span>
                                <span className="material-symbols-outlined text-[16px]">
                                    {showProjectFields ? 'expand_less' : 'expand_more'}
                                </span>
                            </button>

                            {showProjectFields && (
                                <div className="mt-2 space-y-2 p-3.5 rounded-xl bg-slate-950/80 border border-white/10 max-w-2xl">
                                    <input
                                        type="text"
                                        value={formData.projects[0]?.title || ''}
                                        onChange={(e) => handleUpdateProject(0, 'title', e.target.value)}
                                        placeholder={ar ? 'اسم المشروع (مثال: Smart Task Manager)' : 'Project title'}
                                        className="w-full py-2.5 px-3.5 text-xs rounded-lg bg-slate-900 border border-white/15 focus:border-[#FF4D2E] text-white focus:outline-none"
                                    />
                                    <input
                                        type="text"
                                        value={formData.projects[0]?.desc || ''}
                                        onChange={(e) => handleUpdateProject(0, 'desc', e.target.value)}
                                        placeholder={ar ? 'وصف مختصر للمشروع أو التقنيات المستخدمة...' : 'Brief description...'}
                                        className="w-full py-2.5 px-3.5 text-xs rounded-lg bg-slate-900 border border-white/15 focus:border-[#FF4D2E] text-white focus:outline-none"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Actions Bar (Spacious Full Width) */}
            <div className="max-w-5xl w-full mx-auto pt-4 border-t border-white/10">
                <div className="max-w-md mx-auto space-y-2">
                    {currentStep === 1 && (
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={!isStep1Valid}
                            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#FF4D2E] to-[#FF6B4A] hover:from-[#e03e22] hover:to-[#FF4D2E] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm shadow-[0_0_20px_rgba(255,77,46,0.35)] transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <span>{ar ? 'متابعة الخطوة التالية' : 'Next'}</span>
                            <span className="material-symbols-outlined text-[18px]">
                                {ar ? 'arrow_back' : 'arrow_forward'}
                            </span>
                        </button>
                    )}

                    {currentStep === 2 && (
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={!isStep2Valid}
                            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#FF4D2E] to-[#FF6B4A] hover:from-[#e03e22] hover:to-[#FF4D2E] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm shadow-[0_0_20px_rgba(255,77,46,0.35)] transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <span>{ar ? 'متابعة الخطوة التالية' : 'Next'}</span>
                            <span className="material-symbols-outlined text-[18px]">
                                {ar ? 'arrow_back' : 'arrow_forward'}
                            </span>
                        </button>
                    )}

                    {currentStep === 3 && (
                        <>
                            <button
                                type="button"
                                onClick={handleNext}
                                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#FF4D2E] to-[#FF6B4A] hover:from-[#e03e22] hover:to-[#FF4D2E] text-white font-bold text-sm shadow-[0_0_20px_rgba(255,77,46,0.35)] transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <span>{ar ? 'متابعة الخطوة التالية' : 'Next'}</span>
                                <span className="material-symbols-outlined text-[18px]">
                                    {ar ? 'arrow_back' : 'arrow_forward'}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={handleSkipExperience}
                                className="w-full py-2.5 px-4 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-1 cursor-pointer border border-white/5"
                            >
                                <span className="material-symbols-outlined text-[15px]">fast_forward</span>
                                <span>{ar ? 'تخطي هذه الخطوة' : 'Skip this step'}</span>
                            </button>
                        </>
                    )}

                    {currentStep === 4 && (
                        <>
                            <button
                                type="button"
                                onClick={() => handleFinish()}
                                disabled={isSaving}
                                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#FF4D2E] to-[#FF6B4A] hover:from-[#e03e22] hover:to-[#FF4D2E] text-white font-bold text-sm shadow-[0_0_25px_rgba(255,77,46,0.4)] transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {isSaving ? (
                                    <>
                                        <span className="material-symbols-outlined text-[18px] animate-spin">
                                            progress_activity
                                        </span>
                                        <span>{ar ? 'جاري الحفظ والتفعيل...' : 'Saving & Entering...'}</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[18px]">
                                            check_circle
                                        </span>
                                        <span>{ar ? 'حفظ والدخول (Save & Enter)' : 'Save & Enter'}</span>
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleSkipInterests}
                                disabled={isSaving}
                                className="w-full py-2.5 px-4 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-1 cursor-pointer border border-white/5"
                            >
                                <span className="material-symbols-outlined text-[15px]">fast_forward</span>
                                <span>{ar ? 'تخطي هذه الخطوة' : 'Skip this step'}</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
