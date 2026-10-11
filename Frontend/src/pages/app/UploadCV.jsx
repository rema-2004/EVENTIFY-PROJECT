import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useOnboarding } from '../../context/OnboardingContext'

export default function UploadCV() {
    const navigate = useNavigate()
    const { language } = useLanguage()
    const ar = language === 'ar'
    const { userProfile, completeProfile, setIsProfileComplete } = useOnboarding()

    const handleBack = () => {
        if (stage === 'review') {
            setStage('dropzone')
        } else {
            setIsProfileComplete(false)
            navigate('/app')
        }
    }

    // stages: 'dropzone' -> 'analyzing' -> 'review'
    const [stage, setStage] = useState('dropzone')
    const [selectedFileName, setSelectedFileName] = useState('')
    const [analyzingProgress, setAnalyzingProgress] = useState(0)
    const [analyzingStep, setAnalyzingStep] = useState(0)
    const fileInputRef = useRef(null)

    // Form state (Review & Edit Profile - exact Profile Schema)
    const [formData, setFormData] = useState({
        name: userProfile?.fullName || 'John Nanna',
        headline: userProfile?.education || 'Computer Science & AI',
        location: 'Amman, Jordan',
        about: 'Passionate computer science student & developer focused on building smart web applications and AI-driven systems. Looking for top hackathons and tech events.',
        skills: userProfile?.skills && userProfile.skills.length > 0
            ? userProfile.skills
            : ['React', 'Python', 'UI/UX', 'Node.js', 'AI', 'Tailwind CSS'],
        experience: [
            {
                title: 'Fullstack Intern',
                org: 'Tech Innovation Lab',
                period: 'Summer 2024 • 3 months',
                desc: 'Developed responsive interfaces and integrated REST APIs for an AI platform.',
            },
        ],
        projects: [
            {
                title: 'Eventify AI Matcher',
                context: 'Global AI Innovation Challenge',
                desc: 'A recommendation engine that matches students with hackathons and competitions.',
            },
        ],
    })

    const [newSkillInput, setNewSkillInput] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [isUnlocking, setIsUnlocking] = useState(false)
    const [activeTab, setActiveTab] = useState('basics') // 'basics' | 'skills' | 'experience' | 'projects'

    // Trigger analysis when a file is picked or simulated
    const startAnalysis = (fileName) => {
        setSelectedFileName(fileName || 'resume_john_nanna.pdf')
        setStage('analyzing')
        setAnalyzingProgress(10)
    }

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            startAnalysis(e.target.files[0].name)
        }
    }

    // Step-by-step analysis animation
    useEffect(() => {
        if (stage !== 'analyzing') return

        const steps = [
            { pct: 30, stepIndex: 0 },
            { pct: 60, stepIndex: 1 },
            { pct: 85, stepIndex: 2 },
            { pct: 100, stepIndex: 3 },
        ]

        let current = 0
        const interval = setInterval(() => {
            if (current < steps.length) {
                setAnalyzingProgress(steps[current].pct)
                setAnalyzingStep(steps[current].stepIndex)
                current++
            } else {
                clearInterval(interval)
                setTimeout(() => {
                    setStage('review')
                }, 500)
            }
        }, 600)

        return () => clearInterval(interval)
    }, [stage])

    // Skills handling
    const handleAddSkill = (e) => {
        e?.preventDefault()
        const trimmed = newSkillInput.trim()
        if (trimmed && !formData.skills.includes(trimmed)) {
            setFormData((prev) => ({
                ...prev,
                skills: [...prev.skills, trimmed],
            }))
            setNewSkillInput('')
        }
    }

    const handleRemoveSkill = (skillToRemove) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter((s) => s !== skillToRemove),
        }))
    }

    // Experience handling
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

    // Projects handling
    const handleUpdateProject = (index, field, value) => {
        setFormData((prev) => {
            const next = [...prev.projects]
            next[index] = { ...next[index], [field]: value }
            return { ...prev, projects: next }
        })
    }

    const handleAddProject = () => {
        setFormData((prev) => ({
            ...prev,
            projects: [
                ...prev.projects,
                { title: '', context: '', desc: '' },
            ],
        }))
    }

    const handleRemoveProject = (index) => {
        setFormData((prev) => ({
            ...prev,
            projects: prev.projects.filter((_, i) => i !== index),
        }))
    }

    // Save & Finish Action
    const handleSaveAndFinish = () => {
        setIsSaving(true)
        setIsUnlocking(true)
        setTimeout(() => {
            completeProfile({
                name: formData.name.trim() || 'John Nanna',
                fullName: formData.name.trim() || 'John Nanna',
                headline: formData.headline.trim() || 'Computer Science & AI',
                education: formData.headline.trim() || 'Computer Science & AI',
                location: formData.location.trim() || 'Amman, Jordan',
                about: formData.about.trim(),
                skills: formData.skills,
                experience: formData.experience.filter((e) => e.title.trim()),
                projects: formData.projects.filter((p) => p.title.trim()),
                resumeFileName: selectedFileName || 'resume.pdf',
                setupMethod: 'resume',
            })
            setIsSaving(false)
            navigate('/app')
        }, 1800)
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
                                ? 'يقوم الذكاء الاصطناعي الآن بفتح الفعاليات والهاكاثونات المطابقة لمهاراتك وخبراتك...'
                                : 'AI matching engine has unlocked opportunities with up to 98% match!'}
                        </p>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF4D2E]/20 text-[#FF4D2E] text-xs font-semibold mt-2">
                            <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                            <span>{ar ? 'جاري فتح التوصيات...' : 'Opening Recommended For You...'}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Navigation Bar (Spacious max-w-5xl) */}
            <div className="max-w-5xl w-full mx-auto flex items-center justify-between pb-4 border-b border-white/10">
                <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all text-xs font-semibold cursor-pointer border border-white/10"
                    title={ar ? 'تراجع والعودة لشاشة الترحيب' : 'Back to welcome screen'}
                    aria-label={ar ? 'رجوع' : 'Back'}
                >
                    <span className="material-symbols-outlined text-[18px]">
                        {ar ? 'arrow_forward' : 'arrow_back'}
                    </span>
                    <span>{ar ? 'رجوع' : 'Back'}</span>
                </button>

                <div className="flex items-center gap-1.5 font-bold tracking-wider text-sm text-[#FF4D2E]">
                    <span className="material-symbols-outlined text-[18px]">hub</span>
                    <span>EVENTIFY</span>
                </div>

                <button
                    type="button"
                    onClick={() => navigate('/app/wizard-form')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#FF4D2E]/20 text-xs text-gray-300 hover:text-[#FF8566] transition-all border border-white/10 font-semibold cursor-pointer"
                    title={ar ? 'تخطي الرفع وتعبئة البيانات يدوياً' : 'Skip upload and fill manually instead'}
                >
                    <span className="material-symbols-outlined text-[15px]">edit_note</span>
                    <span>{ar ? 'تعبئة يدوياً' : 'Fill Manually Instead'}</span>
                </button>
            </div>

            {/* STAGE 1: Dropzone / Select File (Spacious max-w-4xl) */}
            {stage === 'dropzone' && (
                <div className="max-w-4xl w-full mx-auto my-auto space-y-8 py-4">
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF4D2E]/10 border border-[#FF4D2E]/30 text-[#FF8566] text-xs font-semibold">
                            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                            <span>{ar ? 'تحليل السيرة الذاتية الذكي بالذكاء الاصطناعي' : 'AI Resume Parsing & Extraction'}</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-white">
                            Upload Your Resume
                        </h1>
                        <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
                            {ar
                                ? 'ارفع سيرتك الذاتية بصيغة PDF أو Word ليقوم الذكاء الاصطناعي باستخراج مهاراتك وخبراتك تلقائياً وبدقة'
                                : 'Upload PDF or DOCX to auto-extract your skills, background, and match top competitions with AI'}
                        </p>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx,.doc"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {/* Dropzone Card - Generous & Inviting */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-[#FF4D2E]/40 hover:border-[#FF4D2E] rounded-3xl p-10 sm:p-14 bg-slate-900/40 hover:bg-slate-900/70 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-4 group shadow-[0_0_35px_rgba(255,77,46,0.1)] hover:shadow-[0_0_50px_rgba(255,77,46,0.2)]"
                    >
                        <div className="w-20 h-20 rounded-2xl bg-[#FF4D2E]/10 border border-[#FF4D2E]/30 flex items-center justify-center text-[#FF4D2E] group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-5xl">
                                cloud_upload
                            </span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-base sm:text-lg font-bold text-white">
                                {ar ? 'اسحب الملف وأفلته هنا أو تصفح جهازك' : 'Drag & drop file here or browse files'}
                            </p>
                            <p className="text-xs text-gray-400">
                                PDF, DOCX (Max: 10MB) • {ar ? 'معالجة آمنة وفورية' : 'Instant & Secure parsing'}
                            </p>
                        </div>
                        <button
                            type="button"
                            className="py-3 px-8 rounded-xl bg-[#FF4D2E] hover:bg-[#e03e22] text-white font-semibold text-sm transition-colors shadow-lg"
                        >
                            {ar ? 'اختر ملفاً من جهازك' : 'Choose File'}
                        </button>
                    </div>

                    {/* Quick Demo & Alt Options */}
                    <div className="text-center space-y-3">
                        <button
                            type="button"
                            onClick={() => startAnalysis('john_nanna_resume.pdf')}
                            className="text-xs sm:text-sm text-gray-400 hover:text-[#FF4D2E] underline underline-offset-4 transition-colors font-medium"
                        >
                            {ar ? 'أو تجربة سيرة ذاتية نموذجية تلقائياً (Demo)' : 'Or try with sample resume (Demo)'}
                        </button>

                        <div className="pt-2 border-t border-white/5">
                            <button
                                type="button"
                                onClick={() => navigate('/app/wizard-form')}
                                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-400 hover:text-[#FF8566] transition-colors group cursor-pointer"
                            >
                                <span>{ar ? 'ليس لديك سيرة ذاتية جاهزة؟' : "Don't have a resume ready?"}</span>
                                <span className="text-[#FF4D2E] underline underline-offset-4 group-hover:text-[#FF8566] inline-flex items-center gap-0.5">
                                    {ar ? 'تعبئة البيانات يدوياً بدلاً من ذلك' : 'Fill manually instead'}
                                    <span className="material-symbols-outlined text-[14px]">
                                        {ar ? 'arrow_back' : 'arrow_forward'}
                                    </span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* STAGE 2: Analyzing Resume */}
            {stage === 'analyzing' && (
                <div className="max-w-3xl w-full mx-auto my-auto flex flex-col items-center text-center space-y-6 py-8">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-[#FF4D2E]/20 blur-xl animate-pulse" />
                        <div className="relative w-28 h-28 rounded-3xl bg-slate-900/90 border-2 border-[#FF4D2E] flex items-center justify-center text-[#FF4D2E] shadow-[0_0_40px_rgba(255,77,46,0.4)]">
                            <span className="material-symbols-outlined text-6xl animate-bounce">
                                description
                            </span>
                            <div className="absolute left-2 right-2 h-1 bg-gradient-to-r from-transparent via-[#FF4D2E] to-transparent rounded animate-ping top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight text-white">
                            Analyzing Resume
                        </h2>
                        <p className="text-sm text-[#FF4D2E] font-medium animate-pulse">
                            {ar ? 'جاري التحليل واستخراج البيانات...' : 'AI Extraction in progress...'}
                        </p>
                    </div>

                    <div className="w-full max-w-md space-y-2">
                        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#FF4D2E] to-[#FF8566] transition-all duration-500 rounded-full"
                                style={{ width: `${analyzingProgress}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-[11px] text-gray-400">
                            <span>
                                {analyzingStep === 0 && (ar ? 'قراءة الملف...' : 'Reading document...')}
                                {analyzingStep === 1 && (ar ? 'استخراج المهارات...' : 'Extracting skills...')}
                                {analyzingStep === 2 && (ar ? 'تحديد الخبرات والمشاريع...' : 'Extracting experience & projects...')}
                                {analyzingStep === 3 && (ar ? 'اكتمل التحليل!' : 'Complete!')}
                            </span>
                            <span>{analyzingProgress}%</span>
                        </div>
                    </div>
                </div>
            )}

            {/* STAGE 3: Review & Edit Profile (Spacious max-w-5xl) */}
            {stage === 'review' && (
                <div className="max-w-5xl w-full mx-auto my-auto space-y-6 py-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div>
                            <div className="inline-flex items-center gap-1.5 text-xs text-[#FF8566] font-bold mb-1">
                                <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                                <span>{ar ? 'البيانات المستخرجة بالذكاء الاصطناعي' : 'AI Extracted Profile Data'}</span>
                            </div>
                            <h2 className="text-2xl font-black text-white">
                                Review & Edit Profile
                            </h2>
                            <p className="text-xs text-gray-400">
                                {ar ? 'راجع وتأكد من بياناتك قبل حفظ الملف الشخصي وتفعيله' : 'Verify and fine-tune your details before unlocking'}
                            </p>
                        </div>
                        <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold">
                            ✔ 100% Parsed
                        </span>
                    </div>

                    {/* Section Switcher Tabs */}
                    <div className="flex gap-2 p-1.5 bg-slate-900/80 rounded-2xl border border-white/10 overflow-x-auto">
                        {[
                            { id: 'basics', label: ar ? 'المعلومات والنبذة' : 'Basic Info & About', icon: 'person' },
                            { id: 'skills', label: ar ? 'المهارات' : 'Skills', icon: 'psychology' },
                            { id: 'experience', label: ar ? 'الخبرات' : 'Experience', icon: 'work' },
                            { id: 'projects', label: ar ? 'المشاريع' : 'Projects', icon: 'rocket_launch' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                                    activeTab === tab.id
                                        ? 'bg-[#FF4D2E] text-white shadow-md'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* TAB 1: Basic Info & About */}
                    {activeTab === 'basics' && (
                        <div className="space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-white/10 animate-in fade-in">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-300">
                                        {ar ? 'الاسم الكامل' : 'Full Name'}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-white/15 focus:border-[#FF4D2E] text-white text-sm focus:outline-none"
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-300">
                                        {ar ? 'المسمى المهني / التخصص' : 'Professional Headline'}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.headline}
                                        onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                                        className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-white/15 focus:border-[#FF4D2E] text-white text-sm focus:outline-none"
                                        placeholder="e.g. Computer Science & AI"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-300">
                                    {ar ? 'الموقع' : 'Location'}
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-white/15 focus:border-[#FF4D2E] text-white text-sm focus:outline-none"
                                    placeholder="e.g. Amman, Jordan"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center text-xs text-gray-300">
                                    <label className="font-semibold">
                                        {ar ? 'نبذة عني (About)' : 'About / Bio'}
                                    </label>
                                    <span className="text-[11px] text-gray-400">{formData.about.length} / 500</span>
                                </div>
                                <textarea
                                    rows={3}
                                    value={formData.about}
                                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                                    className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-white/15 focus:border-[#FF4D2E] text-white text-sm focus:outline-none leading-relaxed"
                                    placeholder="Write a brief introduction about your focus and ambitions..."
                                />
                            </div>
                        </div>
                    )}

                    {/* TAB 2: Skills */}
                    {activeTab === 'skills' && (
                        <div className="space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-white/10 animate-in fade-in">
                            <div className="flex justify-between items-center text-xs text-gray-300">
                                <span className="font-semibold">{ar ? 'المهارات التقنية' : 'Technical Skills'}</span>
                                <span className="text-[11px] text-gray-400">{formData.skills.length} {ar ? 'مهارات محددة' : 'skills added'}</span>
                            </div>

                            {/* Tags list */}
                            <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-950 border border-white/10 min-h-[64px]">
                                {formData.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF4D2E]/20 border border-[#FF4D2E]/40 text-[#FF8566] text-xs font-semibold"
                                    >
                                        <span>{skill}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSkill(skill)}
                                            className="hover:text-white transition-colors cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-[14px]">close</span>
                                        </button>
                                    </span>
                                ))}
                            </div>

                            {/* Add Skill form */}
                            <form onSubmit={handleAddSkill} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newSkillInput}
                                    onChange={(e) => setNewSkillInput(e.target.value)}
                                    placeholder={ar ? 'أضف مهارة أخرى واضغط Enter...' : 'Add another skill (e.g. Flutter, Docker)...'}
                                    className="flex-1 py-2.5 px-3.5 text-xs rounded-xl bg-slate-950 border border-white/15 focus:border-[#FF4D2E] text-white focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2.5 text-xs rounded-xl bg-[#FF4D2E] hover:bg-[#e03e22] text-white transition-colors font-bold flex items-center gap-1 cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[16px]">add</span>
                                    <span>{ar ? 'إضافة' : 'Add'}</span>
                                </button>
                            </form>
                        </div>
                    )}

                    {/* TAB 3: Experience */}
                    {activeTab === 'experience' && (
                        <div className="space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-white/10 animate-in fade-in">
                            <div className="flex justify-between items-center text-xs text-gray-300">
                                <span className="font-semibold">{ar ? 'الخبرات والتجارب' : 'Experience & Roles'}</span>
                                <button
                                    type="button"
                                    onClick={handleAddExperience}
                                    className="inline-flex items-center gap-1 text-xs text-[#FF8566] hover:text-[#FF4D2E] font-bold cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[16px]">add_circle</span>
                                    <span>{ar ? 'إضافة خبرة أخرى' : 'Add Experience'}</span>
                                </button>
                            </div>

                            <div className="space-y-3">
                                {formData.experience.map((exp, index) => (
                                    <div
                                        key={index}
                                        className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-3 relative group"
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className="text-[11px] font-bold text-gray-400">#{index + 1}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveExperience(index)}
                                                className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                                                title={ar ? 'حذف' : 'Remove'}
                                            >
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                value={exp.title}
                                                onChange={(e) => handleUpdateExperience(index, 'title', e.target.value)}
                                                placeholder={ar ? 'المسمى الوظيفي (مثال: متدرب برمجيات)' : 'Role Title (e.g. Software Intern)'}
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
                                                placeholder={ar ? 'الفترة (مثال: صيف 2024 • 3 أشهر)' : 'Period (e.g. Summer 2024 • 3 months)'}
                                                className="w-full py-2 px-3 text-xs rounded-lg bg-slate-900 border border-white/15 focus:border-[#FF4D2E] text-white focus:outline-none"
                                        />

                                        <textarea
                                            rows={2}
                                            value={exp.desc}
                                            onChange={(e) => handleUpdateExperience(index, 'desc', e.target.value)}
                                            placeholder={ar ? 'وصف مختصر للمهام والإنجازات...' : 'Short description of responsibilities and impact...'}
                                            className="w-full py-2 px-3 text-xs rounded-lg bg-slate-900 border border-white/15 focus:border-[#FF4D2E] text-white focus:outline-none leading-relaxed"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB 4: Featured Projects */}
                    {activeTab === 'projects' && (
                        <div className="space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-white/10 animate-in fade-in">
                            <div className="flex justify-between items-center text-xs text-gray-300">
                                <span className="font-semibold">{ar ? 'المشاريع البارزة' : 'Featured Projects'}</span>
                                <button
                                    type="button"
                                    onClick={handleAddProject}
                                    className="inline-flex items-center gap-1 text-xs text-[#FF8566] hover:text-[#FF4D2E] font-bold cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[16px]">add_circle</span>
                                    <span>{ar ? 'إضافة مشروع آخر' : 'Add Project'}</span>
                                </button>
                            </div>

                            <div className="space-y-3">
                                {formData.projects.map((proj, index) => (
                                    <div
                                        key={index}
                                        className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-3 relative"
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className="text-[11px] font-bold text-gray-400">#{index + 1}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveProject(index)}
                                                className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                                                title={ar ? 'حذف' : 'Remove'}
                                            >
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                value={proj.title}
                                                onChange={(e) => handleUpdateProject(index, 'title', e.target.value)}
                                                placeholder={ar ? 'اسم المشروع' : 'Project Title'}
                                                className="py-2 px-3 text-xs rounded-lg bg-slate-900 border border-white/15 focus:border-[#FF4D2E] text-white focus:outline-none"
                                            />
                                            <input
                                                type="text"
                                                value={proj.context}
                                                onChange={(e) => handleUpdateProject(index, 'context', e.target.value)}
                                                placeholder={ar ? 'السياق / الفعالية (مثال: هاكاثون الابتكار)' : 'Context / Event (e.g. AI Hackathon)'}
                                                className="py-2 px-3 text-xs rounded-lg bg-slate-900 border border-white/15 focus:border-[#FF4D2E] text-white focus:outline-none"
                                            />
                                        </div>

                                        <textarea
                                            rows={2}
                                            value={proj.desc}
                                            onChange={(e) => handleUpdateProject(index, 'desc', e.target.value)}
                                            placeholder={ar ? 'وصف المشروع والتقنيات المستخدمة...' : 'Short description and tech stack...'}
                                            className="w-full py-2 px-3 text-xs rounded-lg bg-slate-900 border border-white/15 focus:border-[#FF4D2E] text-white focus:outline-none leading-relaxed"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Save & Finish Action Button */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setStage('dropzone')}
                            disabled={isSaving}
                            className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-semibold text-sm transition-all cursor-pointer text-center"
                        >
                            {ar ? 'تراجع / تغيير الملف' : 'Back / Change File'}
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveAndFinish}
                            disabled={isSaving}
                            className="w-full flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#FF4D2E] to-[#FF6B4A] hover:from-[#e03e22] hover:to-[#FF4D2E] text-white font-bold text-sm shadow-[0_0_25px_rgba(255,77,46,0.35)] transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {isSaving ? (
                                <>
                                    <span className="material-symbols-outlined text-[18px] animate-spin">
                                        progress_activity
                                    </span>
                                    <span>{ar ? 'جاري حفظ وتفعيل الملف الشخصي...' : 'Saving Profile...'}</span>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[18px]">
                                        check_circle
                                    </span>
                                    <span>{ar ? 'حفظ وتفعيل الملف الشخصي (Save & Finish)' : 'Save & Finish'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Bottom Footer */}
            <div className="max-w-5xl w-full mx-auto text-center text-[11px] text-gray-500 pt-4">
                EVENTIFY AI Opportunity Matching Engine
            </div>
        </div>
    )
}
