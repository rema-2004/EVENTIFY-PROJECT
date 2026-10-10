import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../../hooks/useLanguage'
import { useOnboarding } from '../../../context/OnboardingContext'

export default function WelcomeOnboarding() {
    const navigate = useNavigate()
    const { language } = useLanguage()
    const ar = language === 'ar'
    const { setIsProfileComplete } = useOnboarding()

    const handleUploadClick = () => {
        navigate('/app/upload-cv')
    }

    const handleWizardClick = () => {
        navigate('/app/wizard-form')
    }

    return (
        <div className="relative min-h-[88vh] flex flex-col justify-between max-w-5xl mx-auto px-4 py-6 overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 bg-gradient-to-b from-[#FF4D2E]/15 via-[#8B5CF6]/10 to-transparent blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-1/3 -left-32 w-72 h-72 bg-[#FF4D2E]/10 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-1/3 -right-32 w-72 h-72 bg-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Header Brand & Welcome Title */}
            <div className="text-center space-y-4 pt-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0ED] dark:bg-[#FF4D2E]/15 border border-[#FF4D2E]/30 text-[#D83A1E] dark:text-[#FF4D2E] text-xs font-bold tracking-widest uppercase shadow-[0_2px_12px_rgba(255,77,46,0.1)] animate-pulse">
                    <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                    <span>{ar ? 'محرك التوصيات بالذكاء الاصطناعي' : 'AI Opportunity Matching Engine'}</span>
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                        {ar ? (
                            <>مرحباً بك في <span className="bg-gradient-to-r from-[#FF4D2E] via-[#FF6B4A] to-[#FF4D2E] dark:from-white dark:via-[#FF8566] dark:to-[#FF4D2E] bg-clip-text text-transparent">Eventify!</span></>
                        ) : (
                            <>Welcome to <span className="bg-gradient-to-r from-[#FF4D2E] via-[#FF6B4A] to-[#FF4D2E] dark:from-white dark:via-[#FF8566] dark:to-[#FF4D2E] bg-clip-text text-transparent">Eventify!</span></>
                        )}
                    </h1>

                    <p className="text-base sm:text-lg text-slate-800 dark:text-gray-200 max-w-2xl mx-auto font-semibold leading-relaxed">
                        {ar
                            ? 'اكتشف الفرصة المناسبة لك بدقة متناهية بالذكاء الاصطناعي'
                            : 'Discover the Right Opportunity with AI Precision'}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
                        {ar
                            ? 'أنشئ ملفك الآن لفتح المسابقات، الدورات، ورش العمل، والفعاليات المطابقة لك خصيصاً باستخدام الذكاء الاصطناعي.'
                            : 'Setup your profile to unlock competitions, courses, workshops, and events matched specifically for you using AI.'}
                    </p>
                </div>

                {/* Micro Stats Bar */}
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-2 text-xs text-slate-700 dark:text-gray-300">
                    <div className="flex items-center gap-1.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3.5 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span className="font-medium">{ar ? '1,420+ مسابقة وفعالية متاحة' : '1,420+ Live Events & Hackathons'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3.5 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
                        <span className="material-symbols-outlined text-[#FF4D2E] text-[16px]">bolt</span>
                        <span className="font-medium">{ar ? 'دقة مطابقة تصل إلى 98%' : 'Up to 98% Match Accuracy'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3.5 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
                        <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-[16px]">timer</span>
                        <span className="font-medium">{ar ? 'إعداد فوري خلال أقل من دقيقة' : 'Under 1-min Setup'}</span>
                    </div>
                </div>
            </div>

            {/* Two Action Cards (Light & Dark Mode Cohesive Design) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 max-w-3xl mx-auto w-full">
                {/* Card 1: Upload Your Resume (Hero Primary) */}
                <div
                    onClick={handleUploadClick}
                    onMouseEnter={() => setHoveredCard('upload')}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="relative group cursor-pointer rounded-3xl bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:via-slate-950/95 dark:to-black border-2 border-[#FF4D2E]/40 hover:border-[#FF4D2E] dark:border-[#FF4D2E]/70 dark:hover:border-[#FF4D2E] p-7 sm:p-8 flex flex-col justify-between shadow-[0_10px_35px_rgba(255,77,46,0.08)] hover:shadow-[0_15px_45px_rgba(255,77,46,0.22)] dark:shadow-[0_0_35px_rgba(255,77,46,0.18)] dark:hover:shadow-[0_0_55px_rgba(255,77,46,0.35)] transition-all duration-300 hover:-translate-y-1.5 overflow-hidden"
                >
                    {/* Top Glow bar */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#FF4D2E] to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                    {/* Fastest Badge */}
                    <div className="absolute top-4 right-4 text-[11px] bg-[#FFF0ED] dark:bg-gradient-to-r dark:from-[#FF4D2E]/25 dark:to-[#FF6B4A]/25 border border-[#FF4D2E]/30 dark:border-[#FF4D2E]/40 text-[#D83A1E] dark:text-[#FF8566] px-3 py-1 rounded-full font-bold flex items-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-[14px]">bolt</span>
                        <span>{ar ? 'الأسرع (دقيقة واحدة)' : 'Fastest (1 Min)'}</span>
                    </div>

                    <div>
                        <div className="w-20 h-20 rounded-2xl bg-[#FFF0ED] dark:bg-gradient-to-br dark:from-[#FF4D2E]/20 dark:to-[#FF4D2E]/5 border border-[#FF4D2E]/30 dark:border-[#FF4D2E]/40 flex items-center justify-center text-[#FF4D2E] mb-6 group-hover:scale-110 shadow-sm dark:shadow-[0_0_25px_rgba(255,77,46,0.25)] transition-transform duration-300">
                            <span className="material-symbols-outlined text-4xl">upload_file</span>
                        </div>

                        <div className="space-y-2 mb-6">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-[#FF4D2E] transition-colors">
                                Upload Your Resume
                            </h2>
                            <p className="text-sm text-[#D83A1E] dark:text-[#FF8566] font-bold">
                                {ar ? 'رفع السيرة الذاتية الذكية' : 'AI Resume Parsing'}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed pt-1 font-medium">
                                {ar
                                    ? 'يقوم الذكاء الاصطناعي بقراءة سيرتك الذاتية واستخراج مهاراتك وخبراتك تلقائياً لترشيح أفضل الفرص'
                                    : 'Instant AI parsing extracts your skills, tools, and background to match top competitions'}
                            </p>

                            {/* Features list */}
                            <div className="pt-3 space-y-2 text-[12px] text-slate-700 dark:text-gray-300 font-medium">
                                <div className="flex items-center gap-2">
                                    <span className="text-[#FF4D2E] font-bold">✔</span>
                                    <span>{ar ? 'يدعم ملفات PDF و Word' : 'Supports PDF & DOCX formats'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[#FF4D2E] font-bold">✔</span>
                                    <span>{ar ? 'استخراج تلقائي لتخصصك ومهاراتك' : 'Automatic skills & major extraction'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleUploadClick()
                        }}
                        className="w-full mt-4 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#FF4D2E] to-[#FF6B4A] hover:from-[#e03e22] hover:to-[#FF4D2E] text-white font-bold text-sm shadow-[0_4px_16px_rgba(255,77,46,0.35)] transition-all active:scale-95 flex items-center justify-center gap-2 group-hover:shadow-[0_4px_22px_rgba(255,77,46,0.5)] cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[18px]">upload</span>
                        <span>Upload PDF / Word</span>
                    </button>
                </div>

                {/* Card 2: Build Manually (No Resume) */}
                <div
                    onClick={handleWizardClick}
                    onMouseEnter={() => setHoveredCard('wizard')}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="relative group cursor-pointer rounded-3xl bg-white dark:bg-gradient-to-b dark:from-slate-900/80 dark:via-slate-950/90 dark:to-black border-2 border-slate-200/90 hover:border-[#FF4D2E]/60 dark:border-white/15 dark:hover:border-[#FF4D2E]/60 p-7 sm:p-8 flex flex-col justify-between shadow-[0_10px_35px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_45px_rgba(255,77,46,0.18)] dark:shadow-xl dark:hover:shadow-[0_0_40px_rgba(255,77,46,0.2)] transition-all duration-300 hover:-translate-y-1.5 overflow-hidden"
                >
                    {/* Top Glow bar */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Step Count Badge */}
                    <div className="absolute top-4 right-4 text-[11px] bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/15 text-slate-700 dark:text-gray-300 px-3 py-1 rounded-full font-bold flex items-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-[14px]">format_list_numbered</span>
                        <span>{ar ? '4 خطوات سريعة' : '4 Quick Steps'}</span>
                    </div>

                    <div>
                        <div className="w-20 h-20 rounded-2xl bg-purple-50 dark:bg-white/5 border border-purple-200/80 dark:border-white/10 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:text-[#FF4D2E] dark:group-hover:text-[#FF8566] mb-6 group-hover:scale-110 group-hover:border-[#FF4D2E]/40 shadow-sm transition-all duration-300">
                            <span className="material-symbols-outlined text-4xl">auto_fix_high</span>
                        </div>

                        <div className="space-y-2 mb-6">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-[#FF4D2E] dark:group-hover:text-[#FF8566] transition-colors">
                                Build Manually
                            </h2>
                            <p className="text-sm text-slate-600 dark:text-gray-400 font-bold">
                                {ar ? 'عين بياناتك (بدون سيرة ذاتية)' : 'No Resume Required'}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed pt-1 font-medium">
                                {ar
                                    ? 'أجب عن بضعة أسئلة تفاعلية سريعة حول اهتماماتك ومستواك لبناء ملفك المخصص في دقائق'
                                    : 'Answer interactive questions about your interests, skills, and formats to build your profile'}
                            </p>

                            {/* Features list */}
                            <div className="pt-3 space-y-2 text-[12px] text-slate-700 dark:text-gray-300 font-medium">
                                <div className="flex items-center gap-2">
                                    <span className="text-purple-600 dark:text-purple-400 font-bold group-hover:text-[#FF4D2E]">✔</span>
                                    <span>{ar ? 'مناسب لمن ليس لديه سيرة جاهزة' : 'Ideal if you don\'t have a resume ready'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-purple-600 dark:text-purple-400 font-bold group-hover:text-[#FF4D2E]">✔</span>
                                    <span>{ar ? 'اختيار تفضيلات المشاركة الفردية والجماعية' : 'Set solo/team hackathon preferences'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleWizardClick()
                        }}
                        className="w-full mt-4 py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-[#FF4D2E] text-white border border-slate-900 hover:border-[#FF4D2E] dark:bg-white/10 dark:hover:bg-[#FF4D2E]/20 dark:text-white dark:hover:text-[#FF4D2E] dark:border-white/20 dark:hover:border-[#FF4D2E]/50 font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                        <span>{ar ? 'ابدأ بالأسئلة السريعة' : 'Fill Form'}</span>
                    </button>
                </div>
            </div>

            {/* Bottom Locked Events Showcase (Stunning Frosted Glass Effect) */}
            <div className="w-full max-w-4xl mx-auto space-y-4">
                <div className="flex items-center justify-between px-1">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#FF4D2E] text-[20px]">lock</span>
                            <span>{ar ? 'استكشف المسابقات والفعاليات العامة' : 'Explore Competitions & Events'}</span>
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-gray-400">
                            {ar
                                ? 'الفعاليات مقفلة ومحمية حتى تكمل ملفك الشخصي لحساب نسبة المطابقة بالذكاء الاصطناعي'
                                : 'Competitions are locked until your profile is ready to compute matching scores'}
                        </p>
                    </div>
                    <span className="text-xs bg-[#FFF0ED] dark:bg-[#FF4D2E]/10 border border-[#FF4D2E]/30 text-[#D83A1E] dark:text-[#FF4D2E] px-3 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-sm">
                        <span className="material-symbols-outlined text-[14px]">lock</span>
                        <span>{ar ? 'مقفلة مؤقتاً' : 'Locked'}</span>
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Locked Card 1: CTF Hackathon Preview */}
                    <div
                        onClick={handleUploadClick}
                        className="relative h-48 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900/70 p-5 flex flex-col justify-between cursor-pointer group shadow-sm hover:shadow-md hover:border-[#FF4D2E]/60 dark:hover:border-[#FF4D2E]/50 transition-all duration-300"
                    >
                        {/* Background Media with rich blur */}
                        <div
                            className="absolute inset-0 bg-cover bg-center filter blur-md opacity-30 group-hover:scale-105 group-hover:blur-[3px] transition-all duration-700"
                            style={{
                                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuB9CEnFNI0sa64wtdt1xcbuCO2ctuePljYf3b0mGoAfsaVbTQZl6EUEKGeq_A-lCje6-84UGOy-xM_EX1fj34sF-YWMO-_0SG4_iedT1vjYrRw5UpEFxOlngZ_cDhCxJRFxyyChSuzfbQzaifbDrY-ySQm0SZNqdXFNpNdzVSiaboP2NAJ4pYTV-P32G1lYqug8kLksnCytiGNYKiUHGIacjDYyZIZ5HHucNTeyCLWQmzn3HRdmrm8n18EIgGN0AobDjfqjTG3DQkjK')`
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/70 to-slate-900/40 backdrop-blur-[3px]" />

                        {/* Top Teaser */}
                        <div className="relative z-10 flex justify-between items-start">
                            <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white/90 text-[11px] font-semibold tracking-wider uppercase">
                                HACKATHON
                            </span>
                            <div className="px-2.5 py-0.5 rounded-full bg-[#FF4D2E]/30 text-[#FF8566] text-xs font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-[13px]">lock</span>
                                <span>98% Match</span>
                            </div>
                        </div>

                        {/* Center Glowing Lock Overlay */}
                        <div className="relative z-10 flex flex-col items-center justify-center space-y-1.5 py-2">
                            <div className="w-12 h-12 rounded-2xl bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#FF4D2E] shadow-[0_0_20px_rgba(255,77,46,0.3)] group-hover:scale-110 group-hover:border-[#FF4D2E] transition-all">
                                <span className="material-symbols-outlined text-2xl animate-pulse">lock</span>
                            </div>
                            <span className="text-sm font-bold text-white group-hover:text-[#FF4D2E] transition-colors">
                                Prepare your profile to unlock
                            </span>
                            <span className="text-xs text-slate-300">
                                {ar ? 'اضغط هنا لرفع سيرتك الذاتية وفتح الفعالية' : 'Click to upload resume & unlock'}
                            </span>
                        </div>

                        {/* Bottom Teaser Details */}
                        <div className="relative z-10 flex items-center justify-between text-xs text-gray-300 border-t border-white/15 pt-2">
                            <span>CTF Hackathon 2025</span>
                            <span className="text-emerald-400 font-bold">{ar ? 'جائزة: $10,000' : 'Prize: $10,000'}</span>
                        </div>
                    </div>

                    {/* Locked Card 2: Data Science Sprint Preview */}
                    <div
                        onClick={handleWizardClick}
                        className="relative h-48 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900/70 p-5 flex flex-col justify-between cursor-pointer group shadow-sm hover:shadow-md hover:border-[#FF4D2E]/60 dark:hover:border-[#FF4D2E]/50 transition-all duration-300"
                    >
                        {/* Background Media with rich blur */}
                        <div
                            className="absolute inset-0 bg-cover bg-center filter blur-md opacity-30 group-hover:scale-105 group-hover:blur-[3px] transition-all duration-700"
                            style={{
                                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBcUXLF60F3KbDnIVZepTTte_yzkhe3rkuMtXTXTMQzA1gyVuzXN1NQ0DXC7XHQBDIHEA2TXLK8EoSvioCS5PoWNoZKnVI7YeLCAxqcRtKE-cfSsrD6X3yBiiGI_J0DdnCu4vgHVOf7tn5UW93gDceqUiZ4hVu5ZCvSuDbEd3Dm8uTINHyELfvrJM4AvcW6lRAm2zAmGTlp9N7rNMUMizYToAN1_rTfY1KtEjsmeIx--zlkOzEz07DRgirbjC8bnSBfxNFTTtVBYuqf')`
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/70 to-slate-900/40 backdrop-blur-[3px]" />

                        {/* Top Teaser */}
                        <div className="relative z-10 flex justify-between items-start">
                            <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white/90 text-[11px] font-semibold tracking-wider uppercase">
                                DATA SPRINT
                            </span>
                            <div className="px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 text-xs font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-[13px]">lock</span>
                                <span>98% Match</span>
                            </div>
                        </div>

                        {/* Center Glowing Lock Overlay */}
                        <div className="relative z-10 flex flex-col items-center justify-center space-y-1.5 py-2">
                            <div className="w-12 h-12 rounded-2xl bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-purple-400 group-hover:text-[#FF4D2E] shadow-[0_0_20px_rgba(168,85,247,0.3)] group-hover:scale-110 group-hover:border-[#FF4D2E] transition-all">
                                <span className="material-symbols-outlined text-2xl animate-pulse">lock</span>
                            </div>
                            <span className="text-sm font-bold text-white group-hover:text-[#FF8566] transition-colors">
                                Prepare your profile to unlock
                            </span>
                            <span className="text-xs text-slate-300">
                                {ar ? 'اضغط هنا للبدء بالأسئلة السريعة وفتح الفعالية' : 'Click to fill wizard & unlock'}
                            </span>
                        </div>

                        {/* Bottom Teaser Details */}
                        <div className="relative z-10 flex items-center justify-between text-xs text-gray-300 border-t border-white/15 pt-2">
                            <span>Data Science Sprint 2025</span>
                            <span className="text-emerald-400 font-bold">{ar ? 'عن بُعد • عالمي' : 'Global • Remote'}</span>
                        </div>
                    </div>
                </div>

                {/* Developer / Demo convenience bar */}
                <div className="pt-4 pb-2 text-center">
                    <button
                        type="button"
                        onClick={() => setIsProfileComplete(true)}
                        className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-gray-400 hover:text-[#FF4D2E] dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 transition-colors shadow-sm cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[15px] text-[#FF4D2E]">visibility</span>
                        <span>{ar ? 'معاينة تجريبية سريعة: تخطي إلى شاشة التوصيات المفتوحة' : 'Quick Preview: Skip directly to Unlocked Dashboard'}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
