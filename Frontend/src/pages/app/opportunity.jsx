import AppFooter from '../../components/app/AppFooter'
import AppPageHead from '../../components/app/AppPageHead'
import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import AnimatedCounter from '../../components/shared/AnimatedCounter'
import { loadSavedIds, persistSavedIds } from './savedItems.js'
import { readSessionJSON } from '../../utils/storage'

const OPPORTUNITY_DETAILS = {
    'global-ai-innovation-challenge': {
        about: {
            ar: 'هاكاثون عالمي لمدة 48 ساعة للمبدعين والمهندسين الراغبين في استكشاف آفاق الذكاء الاصطناعي التطبيقي. ستقوم الفرق بتصميم وإنتاج نموذج أولي يحل مشكلة واقعية باستخدام نماذج توليدية أو تنبؤية. مفتوح للطلاب والخريجين والمحترفين — لا يلزم خبرة سابقة في الهاكاثون.',
            en: 'A 48-hour global hackathon for builders exploring the frontier of applied AI. Teams will design and ship a working prototype that solves a real-world problem using generative or predictive models. Open to students, graduates, and early-career professionals.',
        },
        requirements: [
            { en: 'Basic programming experience (Python, JS, etc.)', ar: 'خبرة برمجية أساسية (بايثون، جافاسكربت، إلخ)' },
            { en: 'A laptop and stable internet connection', ar: 'جهاز كمبيوتر محمول واتصال إنترنت مستقر' },
            { en: 'Ability to collaborate in teams of 2–4', ar: 'القدرة على العمل الجماعي في فرق من 2–4 أشخاص' },
        ],
        skills: [
            { label: 'Python', matched: true },
            { label: { en: 'Machine Learning', ar: 'التعلم الآلي' }, matched: true },
            { label: 'React', matched: false },
            { label: { en: 'Prompt Engineering', ar: 'هندسة الأوامر' }, matched: true },
        ],
        dates: { ar: '24 أكتوبر – 26 أكتوبر 2026', en: 'Oct 24 – Oct 26, 2026' },
        location: { ar: 'عن بُعد (عالمي)', en: 'Remote (Global)' },
        reward: { ar: 'جائزة $10,000 للمراكز الأولى', en: '$10,000 Prize Pool' },
    },
    'smart-climate-hackathon': {
        about: {
            ar: 'هاكاثون تكنولوجي يركز على إيجاد حلول رقمية مبتكرة لمواجهة التغير المناخي وبناء مدن مستدامة وذكية، بالاعتماد على إنترنت الأشياء والذكاء الاصطناعي وتحليل البيانات البيئية.',
            en: 'A tech hackathon focused on engineering digital solutions for climate action, clean energy, and smart cities using IoT, AI, and environmental datasets.',
        },
        requirements: [
            { en: 'Passion for sustainability and climate tech solutions', ar: 'شغف بحلول الاستدامة وتكنولوجيا المناخ' },
            { en: 'Experience in IoT, software, or data visualization', ar: 'خبرة في إنترنت الأشياء أو تطوير البرمجيات أو تحليل البيانات' },
            { en: 'Solo participants or teams of 2–4 are welcome', ar: 'متاح للمتسابقين الأفراد أو الفرق المكونة من 2–4 أشخاص' },
        ],
        skills: [
            { label: 'IoT', matched: true },
            { label: { en: 'Green Tech', ar: 'التكنولوجيا الخضراء' }, matched: true },
            { label: 'Python', matched: true },
            { label: { en: 'Data Science', ar: 'علم البيانات' }, matched: false },
        ],
        dates: { ar: '12 نوفمبر – 15 نوفمبر 2026', en: 'Nov 12 – Nov 15, 2026' },
        location: { ar: 'هجين (عن بُعد وحضوري)', en: 'Hybrid (Remote & On-site)' },
        reward: { ar: 'جوائز ودعم تمويلي بقيمة $25,000', en: '$25,000 Funding & Prizes' },
    },
    'cyber-sentinel-ctf': {
        about: {
            ar: 'تحدي أمن سيبراني فردي تنافسي (Capture The Flag) مصمم لاختبار مهارات الأمن الهجومي، فحص الثغرات، الهندسة العكسية، والتشفير في بيئات محاكاة واقعية.',
            en: 'An intense solo Capture The Flag cybersecurity competition designed to test skills in offensive security, vulnerability exploitation, reverse engineering, and cryptography in realistic isolated labs.',
        },
        requirements: [
            { en: 'Solid understanding of network protocols and security principles', ar: 'فهم عميق لبروتوكولات الشبكات ومبادئ الأمن السيبراني' },
            { en: 'Familiarity with CTF tools and Linux environments', ar: 'إلمام بأدوات الـ CTF وبيئات نظام لينكس' },
            { en: 'Solo participation strictly required (No teams)', ar: 'المشاركة فردية تماماً ومستقلة (يمنع تشكيل الفرق)' },
        ],
        skills: [
            { label: { en: 'Network Security', ar: 'أمن الشبكات' }, matched: true },
            { label: 'Linux', matched: true },
            { label: { en: 'Reverse Engineering', ar: 'الهندسة العكسية' }, matched: true },
            { label: { en: 'Cryptography', ar: 'علم التشفير' }, matched: false },
        ],
        dates: { ar: '5 نوفمبر 2026 (12 ساعة)', en: 'Nov 5, 2026 (12 Hours)' },
        location: { ar: 'منصة التدريب السيبراني أونلاين', en: 'Online CTF Platform' },
        reward: { ar: 'شهادات معتمدة وجوائز بقيمة $5,000', en: '$5,000 Bounty + Certificates' },
    },
    'frontend-wizards-2024': {
        about: {
            ar: 'مسابقة تحدي لتصميم وبناء واجهات مستخدم مذهلة، تفاعلية وسريعة الاستجابة. يتنافس المطورون على بناء أفضل تجربة رقمية وتصميم كود عالي الجودة وسلس.',
            en: 'A premier frontend showdown celebrating UI craftsmanship, accessibility, and stellar web performance. Teams push the limits of modern web technologies to craft breathtaking user experiences.',
        },
        requirements: [
            { en: 'Strong proficiency in modern JavaScript/TypeScript and React', ar: 'إتقان متقدم لـ JavaScript/TypeScript و React' },
            { en: 'Eye for pixel-perfect design and modern micro-animations', ar: 'حس جمالي عالي للتصميم الدقيق والتحريكات السلسة' },
            { en: 'Participation in teams of 2–3 developers & designers', ar: 'المشاركة بفرق تضم من 2 إلى 3 مطورين ومصممين' },
        ],
        skills: [
            { label: 'React', matched: true },
            { label: 'Tailwind CSS', matched: true },
            { label: 'TypeScript', matched: true },
            { label: { en: 'UI/UX Design', ar: 'تصميم تجربة المستخدم' }, matched: false },
        ],
        dates: { ar: '1 ديسمبر – 3 ديسمبر 2026', en: 'Dec 1 – Dec 3, 2026' },
        location: { ar: 'عن بُعد عبر الإنترنت', en: 'Remote Online' },
        reward: { ar: 'جوائز نقدية $8,000 وأجهزة مطورين', en: '$8,000 Cash & Dev Gear' },
    },
    'algomaster-solo-cup': {
        about: {
            ar: 'سباق خوارزميات فردي بنظام خروج المغلوب 1 ضد 1. يحل المتسابق مسائل برمجية معقدة بالرياضيات وهياكل البيانات تحت ضغط الوقت لاختبار السرعة ودقة التفكير.',
            en: 'Fast-paced head-to-head competitive programming tournament testing algorithmic efficiency, data structure mastery, and code speed under strict time pressure.',
        },
        requirements: [
            { en: 'Solid background in Algorithms and Data Structures', ar: 'خلفية متينة في الخوارزميات وتراكيب البيانات' },
            { en: 'Speed in implementing solutions in C++, Python, or Java', ar: 'السرعة في كتابة وتطبيق الحلول بلغات مثل C++ أو Python' },
            { en: 'Solo individual competitor only', ar: 'مخصص للمتسابقين الأفراد فقط' },
        ],
        skills: [
            { label: { en: 'Algorithms', ar: 'الخوارزميات' }, matched: true },
            { label: { en: 'Data Structures', ar: 'تراكيب البيانات' }, matched: true },
            { label: 'C++', matched: true },
            { label: { en: 'Problem Solving', ar: 'حل المشكلات' }, matched: true },
        ],
        dates: { ar: '18 أكتوبر 2026', en: 'Oct 18, 2026' },
        location: { ar: 'بث ومنافسة مباشرة عبر المنصة', en: 'Live Platform Arena' },
        reward: { ar: 'لقب بطل الخوارزميات وجائزة $3,000', en: 'AlgoMaster Trophy + $3,000' },
    },
    'deep-learning-mastery': {
        about: {
            ar: 'ورشة عمل تدريبية وتطبيقية معمقة تأخذك خطوة بخطوة لبناء وتدريب الشبكات العصبية العميقة (Deep Neural Networks) ونماذج الرؤية الحاسوبية ومعالجة اللغات الطبيعية.',
            en: 'An immersive hands-on technical workshop guiding developers through training deep neural networks, computer vision models, and fine-tuning architectures from scratch.',
        },
        requirements: [
            { en: 'Basic Python programming knowledge', ar: 'معرفة أساسية بأساسيات لغة بايثون' },
            { en: 'Laptop with access to Google Colab or Jupyter Notebook', ar: 'جهاز حاسوب مع إمكانية الوصول إلى Google Colab أو Jupyter' },
            { en: 'Interest in AI and modern deep neural architectures', ar: 'شغف بالذكاء الاصطناعي وبنى الشبكات العصبية الحديثة' },
        ],
        skills: [
            { label: 'PyTorch', matched: true },
            { label: { en: 'Deep Learning', ar: 'التعلم العميق' }, matched: true },
            { label: { en: 'Computer Vision', ar: 'الرؤية الحاسوبية' }, matched: false },
            { label: 'Python', matched: true },
        ],
        dates: { ar: '28 أكتوبر 2026 (جلسة تطبيقية مباشرة)', en: 'Oct 28, 2026 (Live Workshop)' },
        location: { ar: 'جلسة تفاعلية مباشرة عبر Zoom ومختبر سحابي', en: 'Live Interactive Session + Cloud Lab' },
        reward: { ar: 'شهادة حضور ومشاريع عملية لمحفظتك', en: 'Verified Attendance & Portfolio Project' },
    },
    'rust-for-web-devs': {
        about: {
            ar: 'ورشة عمل عملية وسريعة لنقل مهاراتك من لغات الويب التقليدية إلى لغة Rust، مع التركيز على بناء خوادم ويب عالية الأداء وتجميع كود WebAssembly للمتصفح.',
            en: 'Hands-on practical workshop tailored for web engineers transitioning to Rust, unlocking high-throughput backend services and blazing-fast WebAssembly modules.',
        },
        requirements: [
            { en: 'Experience in backend or modern web development', ar: 'خبرة سابقة في تطوير الويب أو الخدمات الخلفية' },
            { en: 'Pre-installed Rust compiler (rustup)', ar: 'تثبيت مسبق لمترجم لغة Rust على جهازك' },
            { en: 'Ready to code live alongside instructors', ar: 'الاستعداد للبرمجة المباشرة والتطبيق مع المدرب' },
        ],
        skills: [
            { label: 'Rust', matched: true },
            { label: 'WebAssembly', matched: true },
            { label: { en: 'Backend APIs', ar: 'واجهات برمجة التطبيقات' }, matched: false },
            { label: { en: 'Systems Programming', ar: 'برمجة الأنظمة' }, matched: true },
        ],
        dates: { ar: '8 نوفمبر 2026 (4 ساعات مكثفة)', en: 'Nov 8, 2026 (4 Intensive Hours)' },
        location: { ar: 'مختبر رقمي مباشر ومفتوح', en: 'Virtual Live Lab' },
        reward: { ar: 'كود مفتوح المصدر وشهادة إنجاز الورشة', en: 'Open-Source Project + Workshop Badge' },
    },
    'product-strategy-course': {
        about: {
            ar: 'دورة تدريبية متكاملة تمتد لعدة أسابيع تركز على إعداد مدراء ومخططي المنتجات الرقمية، تشمل أبحاث المستخدمين، تحديد مؤشرات الأداء (KPIs)، ورسم خرائط طريق المنتجات الناجحة.',
            en: 'A comprehensive multi-week training program designed to mentor aspiring product leaders in user discovery, product-market fit, agile roadmapping, and metrics that matter.',
        },
        requirements: [
            { en: 'Commitment to weekly lectures and case studies', ar: 'الالتزام بحضور المحاضرات الأسبوعية ودراسات الحالة' },
            { en: 'Basic understanding of digital tech and software lifecycles', ar: 'فهم أولي لدورة حياة البرمجيات والتقنيات الرقمية' },
            { en: 'Completion of the final graduation capstone project', ar: 'تسليم مشروع التخرج العملي بنهاية البرنامج' },
        ],
        skills: [
            { label: { en: 'Product Strategy', ar: 'استراتيجية المنتج' }, matched: true },
            { label: { en: 'User Research', ar: 'أبحاث المستخدمين' }, matched: true },
            { label: 'Agile & Scrum', matched: true },
            { label: { en: 'Roadmapping', ar: 'تخطيط خرائط الطريق' }, matched: false },
        ],
        dates: { ar: '1 نوفمبر – 15 ديسمبر 2026 (6 أسابيع)', en: 'Nov 1 – Dec 15, 2026 (6 Weeks)' },
        location: { ar: 'منصة تعليمية متكاملة (فيديوهات + لقاءات حية)', en: 'Self-Paced Portal + Weekly Live Mentorship' },
        reward: { ar: 'شهادة إتمام مهنية معتمدة دولياً', en: 'Accredited Professional Certificate' },
    },
    'global-ai-summit-2024': {
        about: {
            ar: 'المؤتمر والقمة السنوية الأكبر التي تجمع رواد الأعمال والمستثمرين وكبار الباحثين لمناقشة طفرات الذكاء الاصطناعي التوليدي، الحوسبة المتقدمة، ومستقبل الوكلاء المستقلين.',
            en: 'The premier annual summit gathering industry trailblazers, researchers, and venture capitalists to explore the frontiers of autonomous agents, edge computing, and AI safety.',
        },
        requirements: [
            { en: 'Pre-registration ticket confirmation', ar: 'تأكيد التسجيل الإلكتروني واستلام التذكرة' },
            { en: 'Interest in artificial intelligence and tech entrepreneurship', ar: 'الاهتمام بمجال الذكاء الاصطناعي وريادة الأعمال التكنولوجية' },
            { en: 'Valid virtual or on-site badge', ar: 'بطاقة حضور رقمية أو بطاقة دخول للقاعة' },
        ],
        skills: [
            { label: { en: 'AI Ecosystem', ar: 'منظومة الذكاء الاصطناعي' }, matched: true },
            { label: { en: 'Tech Leadership', ar: 'القيادة التقنية' }, matched: true },
            { label: { en: 'Networking', ar: 'التواصل وبناء العلاقات' }, matched: true },
            { label: { en: 'Generative AI', ar: 'الذكاء الاصطناعي التوليدي' }, matched: false },
        ],
        dates: { ar: '10 ديسمبر – 11 ديسمبر 2026', en: 'Dec 10 – Dec 11, 2026' },
        location: { ar: 'مركز المؤتمرات الدولي وبث حي فائق الجودة', en: 'Convention Center & 4K Global Livestream' },
        reward: { ar: 'تذكرة دخول مجانية وشبكة علاقات مهنية', en: 'Free Access Pass & Executive Networking' },
    },
}

// Fallback generator based on category
const getCategoryFallbackDetails = (cat, title) => {
    if (cat === 'course') {
        return {
            about: {
                ar: `برنامج تعليمي متكامل في "${title}" صُمم لتمكينك من إتقان المفاهيم الأساسية والتطبيقات العملية عبر وحدات تعليمية تفاعلية واختبارات قياس مستوى.`,
                en: `A structured training course in "${title}" designed to equip you with fundamental concepts and practical skills through interactive modules and exercises.`,
            },
            requirements: [
                { en: 'Curiosity and commitment to complete the modules', ar: 'الرغبة والشغف بإكمال الوحدات التعليمية' },
                { en: 'Laptop or tablet with internet access', ar: 'جهاز حاسوب أو لوحي مع اتصال إنترنت مستقر' },
                { en: 'Completion of self-paced assignments', ar: 'تسليم التطبيقات والتمارين الذاتية المقررة' },
            ],
            skills: [
                { label: 'Self Learning', matched: true },
                { label: 'Practical Labs', matched: true },
                { label: 'Domain Foundations', matched: true },
            ],
            dates: { ar: 'دراسة ذاتية (متاحة فوراً)', en: 'Self-Paced (Instant Access)' },
            location: { ar: 'المنصة التعليمية أونلاين', en: 'Online Learning Platform' },
            reward: { ar: 'شهادة إتمام معتمدة قابلة للمشاركة', en: 'Verified Completion Certificate' },
        }
    }
    if (cat === 'workshop') {
        return {
            about: {
                ar: `ورشة عمل تفاعلية وتطبيقية تركز على التطبيق المباشر وبناء نماذج حقيقية في "${title}" بمساعدة وتوجيه مدربين متخصصين.`,
                en: `A hands-on practical workshop focusing on live experimentation and real-world implementation in "${title}" with expert guidance.`,
            },
            requirements: [
                { en: 'Familiarity with foundational principles', ar: 'معرفة أولية بالمبادئ العامة للمجال' },
                { en: 'Pre-installed required development tools', ar: 'تجهيز بيئة وأدوات العمل الموصى بها قبل بدء الجلسة' },
                { en: 'Active participation during live labs', ar: 'المشاركة الفعالة والتطبيق المباشر أثناء الورشة' },
            ],
            skills: [
                { label: 'Hands-on Labs', matched: true },
                { label: 'Interactive Building', matched: true },
                { label: 'Problem Solving', matched: true },
            ],
            dates: { ar: 'ورشة مكثفة (نهاية الأسبوع)', en: 'Intensive Weekend Workshop' },
            location: { ar: 'قاعة افتراضية تفاعلية', en: 'Interactive Virtual Room' },
            reward: { ar: 'شهادة حضور ومشاريع تطبيقية', en: 'Attendance Certificate & Project Code' },
        }
    }
    if (cat === 'event') {
        return {
            about: {
                ar: `لقاء وفعالية مميزة تجمع المهتمين والخبراء لمناقشة أحدث المستجدات والفرص في "${title}" مع فقرات حوارية وفرص تواصل مهني.`,
                en: `An engaging event connecting community members and experts to discuss key insights and upcoming trends in "${title}".`,
            },
            requirements: [
                { en: 'Confirmed online registration ticket', ar: 'تأكيد التسجيل الإلكتروني المسبق' },
                { en: 'Timely attendance to scheduled sessions', ar: 'الحضور في الوقت المحدد لبدء الجلسات' },
                { en: 'Active engagement in Q&A segments', ar: 'التفاعل الإيجابي في فقرات الأسئلة والنقاش' },
            ],
            skills: [
                { label: 'Networking', matched: true },
                { label: 'Industry Insights', matched: true },
                { label: 'Community Exchange', matched: true },
            ],
            dates: { ar: 'جلسة مسائية (مباشرة)', en: 'Evening Live Session' },
            location: { ar: 'بث حي عالي الدقة وتجمع افتراضي', en: 'HD Livestream & Virtual Lounge' },
            reward: { ar: 'تذكرة حضور مجانية بالكامل', en: 'Free Digital Pass' },
        }
    }
    // Default competition
    return {
        about: {
            ar: `تحدٍّ تنافسي ملهم في "${title}" يهدف إلى تحفيز الابتكار وتطوير حلول برمجية وتقنية ذات أثر حقيقي للمراكز الفائزة.`,
            en: `An exciting competitive challenge in "${title}" driving tech innovation and prototype creation for awards and recognition.`,
        },
        requirements: [
            { en: 'Relevant technical and analytical problem solving skills', ar: 'مهارات تقنية وتحليلية مناسبة لحل التحدي' },
            { en: 'Deliver a working prototype before deadline', ar: 'تسليم نموذج أولي عامل قبل انتهاء الموعد المحدد' },
            { en: 'Adherence to code of conduct and rules', ar: 'الالتزام بقواعد المنافسة وميثاق الأخلاقيات' },
        ],
        skills: [
            { label: 'Software Development', matched: true },
            { label: 'Innovation', matched: true },
            { label: 'Rapid Prototyping', matched: true },
        ],
        dates: { ar: 'تحدي لمدة 48 ساعة', en: '48-Hour Sprint Challenge' },
        location: { ar: 'عن بُعد (Remote)', en: 'Remote' },
        reward: { ar: 'جوائز نقدية وشهادات تقديرية', en: 'Cash Prizes & Certificates' },
    }
}

const SIMILAR = [
    { icon: 'bolt',   color: 'text-primary',   bg: 'bg-primary/10',   title: 'Frontend Wizards 2026', sub: { en: 'Competition · London, UK', ar: 'مسابقة · لندن، المملكة المتحدة' } },
    { icon: 'school', color: 'text-secondary',  bg: 'bg-secondary/10', title: 'Deep Learning Mastery', sub: { en: 'Workshop · Hybrid',         ar: 'ورشة عمل · هجين' } },
]

export default function Opportunity() {
    const navigate = useNavigate()
    const { language } = useLanguage()
    const ar = language === 'ar'
    const location = useLocation()
    const compFromState = location.state?.competition

    // Prefer state, then sessionStorage, then fallback
    const comp = compFromState || readSessionJSON('eventify_selected_competition', null) || {
        id: 'global-ai-innovation-challenge',
        title: ar ? 'تحدي الابتكار العالمي بالذكاء الاصطناعي' : 'Global AI Innovation Challenge',
        cat: 'competition',
        type: ar ? 'هاكاثون · مسابقة' : 'HACKATHON · COMPETITION',
        participationType: 'team',
        match: 98,
        sub: ar ? 'بواسطة TechGenius Labs' : 'By TechGenius Labs',
    }

    const info = OPPORTUNITY_DETAILS[comp.id] || getCategoryFallbackDetails(comp.cat, comp.title)

    useEffect(() => {
        if (comp) {
            try {
                sessionStorage.setItem('eventify_selected_competition', JSON.stringify(comp))
            } catch {
                // ignore
            }
        }
    }, [comp])

    const [saved, setSaved] = useState(() => loadSavedIds().has(comp.id))
    const [toast, setToast] = useState(null)

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2800) }
    const toggleSave = () => {
        setSaved((prev) => {
            showToast(prev
                ? (ar ? 'تمت إزالته من المحفوظات' : 'Removed from saved')
                : (ar ? 'تم الحفظ لوقت لاحق' : 'Saved for later'))
            const ids = loadSavedIds()
            if (prev) ids.delete(comp.id)
            else ids.add(comp.id)
            persistSavedIds(ids)
            return !prev
        })
    }

    return (
        <>
            <AppPageHead title={`${comp.title} | EVENTIFY`} />

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 px-5 py-3 rounded-full shadow-xl font-label-md text-white fade-in-up" style={{ backgroundColor: '#1e7a4f' }}>
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                    {toast}
                </div>
            )}

            <main
                className="pt-24 pb-12 px-container-margin-mobile md:px-container-margin-desktop max-w-[1280px] mx-auto"
                dir={ar ? 'rtl' : 'ltr'}
            >
                {/* Breadcrumb */}
                <div className={`flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant mb-4 ${ar ? 'flex-row-reverse' : ''}`}>
                    <Link className="hover:text-primary transition-colors" to="/app/explore">
                        {ar ? 'استكشاف' : 'Explore'}
                    </Link>
                    <span>/</span>
                    <span className="text-on-surface">
                        {comp.title}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
                    {/* Main Column */}
                    <div className="ev-fade-up lg:col-span-2 space-y-6">

                        {/* Hero image + match badge */}
                        <div className="group rounded-xl overflow-hidden h-64 md:h-80 relative shadow-md">
                            {comp.img ? (
                                <img
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    alt={comp.title}
                                    src={comp.img}
                                />
                            ) : (
                                <div className={`w-full h-full ${comp.bgClass || 'bg-gradient-to-br from-amber-500/20 to-orange-500/10'} flex items-center justify-center`}>
                                    <span className={`material-symbols-outlined ${comp.iconColor || 'text-amber-500'} text-7xl`}>
                                        {comp.icon || 'terminal'}
                                    </span>
                                </div>
                            )}
                            <div className={`absolute top-4 ${ar ? 'left-4' : 'right-4'} px-3 py-1.5 bg-secondary text-white rounded-lg font-label-sm flex items-center gap-1 shadow-lg backdrop-blur-sm fade-in`}>
                                <span className="material-symbols-outlined text-[16px]">bolt</span>
                                {ar ? 'تطابق ' : ''}<AnimatedCounter value={comp.match || 98} suffix="%" />{ar ? '' : ' Match for you'}
                            </div>
                        </div>

                        {/* Title block */}
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="font-label-sm text-label-sm uppercase text-secondary">
                                    {comp.type || (ar ? 'فرصة تدريبية' : 'OPPORTUNITY')}
                                </span>

                                {/* Category & Participation Badges */}
                                {(!comp.cat || comp.cat === 'competition') ? (
                                    <span
                                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                            comp.participationType === 'solo'
                                                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
                                                : comp.participationType === 'team'
                                                ? 'bg-[#FF4D2E]/10 text-[#FF4D2E] border-[#FF4D2E]/30'
                                                : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-[14px]">
                                            {comp.participationType === 'solo' ? 'person' : comp.participationType === 'team' ? 'groups' : 'join_inner'}
                                        </span>
                                        {comp.participationType === 'solo'
                                            ? (ar ? 'مشاركة فردية فقط' : 'Solo Participation Only')
                                            : comp.participationType === 'team'
                                            ? (ar ? 'مشاركة جماعية (فرق فقط)' : 'Team Participation Only')
                                            : (ar ? 'متاح فردي أو جماعي' : 'Solo or Team Allowed')}
                                    </span>
                                ) : comp.cat === 'course' ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30">
                                        <span className="material-symbols-outlined text-[14px]">school</span>
                                        {ar ? 'دورة تدريبية معتمدة' : 'Certified Course'}
                                    </span>
                                ) : comp.cat === 'workshop' ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30">
                                        <span className="material-symbols-outlined text-[14px]">terminal</span>
                                        {ar ? 'ورشة عمل تفاعلية' : 'Hands-on Workshop'}
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                                        <span className="material-symbols-outlined text-[14px]">campaign</span>
                                        {ar ? 'فعالية مباشرة ومفتوحة' : 'Live Event'}
                                    </span>
                                )}
                            </div>

                            <h1 className="font-headline-xl text-headline-xl mt-1">
                                {comp.title}
                            </h1>
                            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                                {comp.sub || (ar ? 'بواسطة TechGenius Labs' : 'By TechGenius Labs')}
                            </p>
                            <div className={`flex flex-wrap items-center gap-4 mt-4 text-on-surface-variant font-label-sm ${ar ? 'flex-row-reverse' : ''}`}>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                                    {ar ? info.dates.ar : info.dates.en}
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                                    {ar ? info.location.ar : info.location.en}
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[18px]">
                                        {(!comp.cat || comp.cat === 'competition')
                                            ? (comp.participationType === 'solo' ? 'person' : 'groups')
                                            : comp.cat === 'event' ? 'groups' : 'person'}
                                    </span>
                                    {comp.cat === 'course'
                                        ? (ar ? 'تعلّم فردي ذاتي' : 'Self-Paced')
                                        : comp.cat === 'workshop'
                                        ? (ar ? 'مقاعد فردية محدودة' : 'Limited Seats')
                                        : comp.cat === 'event'
                                        ? (ar ? 'حضور مفتوح' : 'Open Attendance')
                                        : comp.participationType === 'solo'
                                        ? (ar ? 'فردي' : 'Solo')
                                        : comp.participationType === 'team'
                                        ? (ar ? 'فرق من 2–4' : 'Teams of 2–4')
                                        : (ar ? 'فردي أو فرق 2–4' : 'Solo or Teams of 2–4')}
                                </span>
                                <span className="flex items-center gap-1 text-tertiary font-bold">
                                    <span className="material-symbols-outlined text-[18px]">
                                        {comp.cat === 'course' ? 'workspace_premium' : comp.cat === 'workshop' ? 'code' : comp.cat === 'event' ? 'confirmation_number' : 'military_tech'}
                                    </span>
                                    {ar ? info.reward.ar : info.reward.en}
                                </span>
                            </div>
                        </div>

                        {/* About */}
                        <div className="border-t border-outline-variant/30 pt-6 space-y-3">
                            <h2 className="font-headline-md text-headline-md">
                                {comp.cat === 'course'
                                    ? (ar ? 'عن هذه الدورة التدريبية' : 'About this course')
                                    : comp.cat === 'workshop'
                                    ? (ar ? 'عن ورشة العمل التفاعلية' : 'About this workshop')
                                    : comp.cat === 'event'
                                    ? (ar ? 'عن هذه الفعالية واللقاء' : 'About this event')
                                    : (ar ? 'عن هذا التحدي والمسابقة' : 'About this challenge')}
                            </h2>
                            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                                {ar ? info.about.ar : info.about.en}
                            </p>
                        </div>

                        {/* Requirements */}
                        <div className="space-y-3">
                            <h2 className="font-headline-md text-headline-md">
                                {comp.cat === 'course'
                                    ? (ar ? 'متطلبات ومحتوى الدورة' : 'Course Requirements')
                                    : comp.cat === 'workshop'
                                    ? (ar ? 'متطلبات الورشة والتجهيزات' : 'Workshop Requirements')
                                    : comp.cat === 'event'
                                    ? (ar ? 'شروط وتفاصيل الحضور' : 'Event Guidelines')
                                    : (ar ? 'متطلبات التقديم والتأهيل' : 'Challenge Requirements')}
                            </h2>
                            <ul className="space-y-2 font-body-md text-body-md text-on-surface-variant">
                                {info.requirements.map((req, i) => (
                                    <li key={req.en} className={`row-animated flex items-start gap-2 ${ar ? 'flex-row-reverse text-right' : ''} hover:translate-x-1 transition-transform duration-200`} style={{ '--stagger-idx': i }}>
                                        <span className="material-symbols-outlined text-tertiary text-[20px] shrink-0" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                                        {ar ? req.ar : req.en}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Skills */}
                        <div className="space-y-3">
                            <h2 className="font-headline-md text-headline-md">
                                {ar ? 'المهارات والمجالات المستفادة' : 'Skills & Topics Covered'}
                            </h2>
                            <div className={`flex flex-wrap gap-2 ${ar ? 'flex-row-reverse' : ''}`}>
                                {info.skills.map((skill, i) => {
                                    const label = typeof skill.label === 'string' ? skill.label : (ar ? skill.label.ar : skill.label.en)
                                    return (
                                        <span
                                            key={typeof skill.label === 'string' ? skill.label : skill.label.en}
                                            className={`row-animated px-3 py-1 rounded-lg font-label-sm text-label-sm hover:scale-105 transition-transform duration-200 cursor-default ${skill.matched
                                                ? 'bg-primary/5 text-primary border border-primary/10'
                                                : 'bg-surface-container text-on-surface-variant'}`}
                                            style={{ '--stagger-idx': i }}
                                        >
                                            {label}
                                        </span>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="ev-fade-up ev-stagger-1 space-y-6">

                        {/* Apply card */}
                        <div className="ev-card spotlight bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm space-y-4 sticky top-24">
                            <div className={`flex items-center justify-between ${ar ? 'flex-row-reverse' : ''}`}>
                                <span className="font-label-sm text-label-sm text-on-surface-variant">
                                    {ar ? 'آخر موعد للتقديم' : 'Application deadline'}
                                </span>
                                <span className="font-label-md text-label-md text-error font-bold">
                                    {ar ? 'باقي 3 أيام' : '3 days left'}
                                </span>
                            </div>
                            <button
                                type="button"
                                className="block w-full text-center py-3.5 rounded-full font-label-lg shadow-md active:scale-95 transition-all font-bold text-white cursor-pointer"
                                style={{ backgroundColor: '#FF4D2E' }}
                                onClick={() => {
                                    try {
                                        sessionStorage.setItem('eventify_selected_competition', JSON.stringify(comp))
                                    } catch {}
                                    if (!comp.cat || comp.cat === 'competition') {
                                        navigate('/app/participation-type', { state: { competition: comp } })
                                    } else {
                                        // بالنسبة للدورات وورش العمل والفعاليات، التسجيل فردي ومباشر
                                        navigate('/app/registration-success', { state: { competition: comp } })
                                    }
                                }}
                            >
                                {comp.cat === 'course'
                                    ? (ar ? 'التسجيل في الدورة' : 'Enroll in Course')
                                    : comp.cat === 'workshop'
                                    ? (ar ? 'حجز مقعد في الورشة' : 'Book a Seat')
                                    : comp.cat === 'event'
                                    ? (ar ? 'تأكيد الحضور مجاناً' : 'Register for Event')
                                    : (ar ? 'تقدّم الآن' : 'Apply Now')}
                            </button>
                            <button
                                className={`w-full py-3 font-label-md flex items-center justify-center gap-2 border rounded-lg transition-colors ${saved
                                    ? 'border-[#FF4D2E] bg-[#FF4D2E]/5'
                                    : 'border-outline-variant hover:bg-surface-container'}`}
                                style={saved ? { color: '#FF4D2E' } : {}}
                                onClick={toggleSave}
                            >
                                <span
                                    className="material-symbols-outlined text-[18px]"
                                    style={{ fontVariationSettings: saved ? '"FILL" 1' : '"FILL" 0' }}
                                >
                                    {saved ? 'bookmark_added' : 'bookmark'}
                                </span>
                                {ar ? 'حفظ لوقت لاحق' : 'Save for later'}
                            </button>
                            <div className={`border-t border-outline-variant/30 pt-4 flex items-center gap-3 ${ar ? 'flex-row-reverse' : ''}`}>
                                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: '"FILL" 1' }}>smart_toy</span>
                                </div>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">
                                    {ar ? 'اسأل ' : 'Ask '}
                                    <Link className="font-semibold hover:underline" style={{ color: '#FF4D2E' }} to="/app/rafeeq">Rafeeq</Link>
                                    {ar ? ' لتلخيص هذه الفرصة لك.' : ' to summarize this opportunity for you.'}
                                </p>
                            </div>
                        </div>

                        {/* Category Specific Context Card */}
                        {comp.cat === 'course' ? (
                            <div className="ev-card bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm space-y-3">
                                <div className={`flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm ${ar ? 'flex-row-reverse text-right' : ''}`}>
                                    <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
                                    <span>{ar ? 'مزايا الدورة التدريبية' : 'Course Inclusions'}</span>
                                </div>
                                <ul className={`text-xs text-on-surface-variant space-y-2 ${ar ? 'text-right' : ''}`}>
                                    <li className={`flex items-center gap-2 ${ar ? 'flex-row-reverse' : ''}`}><span className="material-symbols-outlined text-purple-500 text-[16px]">check_circle</span>{ar ? 'شهادة إتمام معتمدة قابلة للمشاركة' : 'Verified completion certificate'}</li>
                                    <li className={`flex items-center gap-2 ${ar ? 'flex-row-reverse' : ''}`}><span className="material-symbols-outlined text-purple-500 text-[16px]">check_circle</span>{ar ? 'وصول دائم وشامل لمواد الدورة' : 'Lifetime access to materials'}</li>
                                    <li className={`flex items-center gap-2 ${ar ? 'flex-row-reverse' : ''}`}><span className="material-symbols-outlined text-purple-500 text-[16px]">check_circle</span>{ar ? 'تمارين ومختبرات عملية تطبيقية' : 'Hands-on practical labs'}</li>
                                </ul>
                            </div>
                        ) : comp.cat === 'workshop' ? (
                            <div className="ev-card bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm space-y-3">
                                <div className={`flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm ${ar ? 'flex-row-reverse text-right' : ''}`}>
                                    <span className="material-symbols-outlined text-[20px]">terminal</span>
                                    <span>{ar ? 'مخرجات ورشة العمل' : 'Workshop Takeaways'}</span>
                                </div>
                                <ul className={`text-xs text-on-surface-variant space-y-2 ${ar ? 'text-right' : ''}`}>
                                    <li className={`flex items-center gap-2 ${ar ? 'flex-row-reverse' : ''}`}><span className="material-symbols-outlined text-blue-500 text-[16px]">check_circle</span>{ar ? 'جلسة تدريبية تفاعلية ومباشرة' : 'Live interactive session'}</li>
                                    <li className={`flex items-center gap-2 ${ar ? 'flex-row-reverse' : ''}`}><span className="material-symbols-outlined text-blue-500 text-[16px]">check_circle</span>{ar ? 'بناء نموذج عملي وتطبيقي' : 'Real-world project building'}</li>
                                    <li className={`flex items-center gap-2 ${ar ? 'flex-row-reverse' : ''}`}><span className="material-symbols-outlined text-blue-500 text-[16px]">check_circle</span>{ar ? 'شهادة حضور وتفاعل معتمدة' : 'Verified attendance certificate'}</li>
                                </ul>
                            </div>
                        ) : comp.cat === 'event' ? (
                            <div className="ev-card bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm space-y-3">
                                <div className={`flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm ${ar ? 'flex-row-reverse text-right' : ''}`}>
                                    <span className="material-symbols-outlined text-[20px]">campaign</span>
                                    <span>{ar ? 'تفاصيل الحضور والمشاركة' : 'Event Details'}</span>
                                </div>
                                <ul className={`text-xs text-on-surface-variant space-y-2 ${ar ? 'text-right' : ''}`}>
                                    <li className={`flex items-center gap-2 ${ar ? 'flex-row-reverse' : ''}`}><span className="material-symbols-outlined text-emerald-500 text-[16px]">check_circle</span>{ar ? 'دخول مجاني بالكامل وبث حي عالي الدقة' : '100% Free pass & HD stream'}</li>
                                    <li className={`flex items-center gap-2 ${ar ? 'flex-row-reverse' : ''}`}><span className="material-symbols-outlined text-emerald-500 text-[16px]">check_circle</span>{ar ? 'جلسات حوارية مع قادة التكنولوجيا' : 'Keynotes from tech leaders'}</li>
                                    <li className={`flex items-center gap-2 ${ar ? 'flex-row-reverse' : ''}`}><span className="material-symbols-outlined text-emerald-500 text-[16px]">check_circle</span>{ar ? 'فرص بناء شبكة علاقات مهنية' : 'Networking opportunities'}</li>
                                </ul>
                            </div>
                        ) : comp.participationType !== 'solo' ? (
                            <div className="ev-card spotlight bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm space-y-4">
                                <h3 className="font-title-md text-title-md">{ar ? 'الفرق المتاحة' : 'Available Teams'}</h3>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">
                                    {ar ? 'فرق تبحث عن أعضاء لهذا التحدي.' : 'Teams are recruiting for this challenge.'}
                                </p>
                                <Link
                                    className="w-full block text-center border font-label-md text-label-md py-2.5 rounded-lg hover:bg-[#FF4D2E]/5 transition-colors"
                                    style={{ borderColor: '#FF4D2E', color: '#FF4D2E' }}
                                    to="/app/teams"
                                >
                                    {ar ? 'تصفح الفرق' : 'Browse Teams'}
                                </Link>
                            </div>
                        ) : (
                            <div className="ev-card bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm space-y-2">
                                <div className={`flex items-center gap-2 text-amber-600 font-bold text-sm ${ar ? 'flex-row-reverse text-right' : ''}`}>
                                    <span className="material-symbols-outlined text-[20px]">person</span>
                                    <span>{ar ? 'مشاركة فردية فقط' : 'Solo Participation Only'}</span>
                                </div>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">
                                    {ar ? 'هذه المسابقة مخصصة للمتسابقين الأفراد فقط، دون الحاجة أو إمكانية لتشكيل فرق.' : 'This challenge is exclusively for solo competitors. No team formation required.'}
                                </p>
                            </div>
                        )}

                        {/* Similar */}
                        <div className="ev-card spotlight bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm space-y-3">
                            <h3 className="font-title-md text-title-md">{ar ? 'فرص مشابهة' : 'Similar Opportunities'}</h3>
                            {SIMILAR.map(({ icon, color, bg, title, sub }, i) => (
                                <Link key={title} className={`row-animated flex items-center gap-3 group p-2 rounded-lg hover:bg-surface-container-low transition-all duration-200 ${ar ? 'flex-row-reverse' : ''}`} to="/app/opportunity" style={{ '--stagger-idx': i }}>
                                    <div className={`w-12 h-12 rounded-lg ${bg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200`}>
                                        <span className={`material-symbols-outlined ${color}`}>{icon}</span>
                                    </div>
                                    <div className={ar ? 'text-right' : ''}>
                                        <p className="font-label-md text-label-md group-hover:text-primary transition-colors">{title}</p>
                                        <p className="font-label-sm text-label-sm text-on-surface-variant">{ar ? sub.ar : sub.en}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <AppFooter />
        </>
    )
}
