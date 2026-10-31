import { Fragment, useState, useEffect, useRef, useMemo } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import AppPageHead from '../../components/app/AppPageHead'
import { useOrgPageControls } from './useOrgPageControls.js'
import { useLanguage } from '../../hooks/useLanguage'
import { toast } from '../../utils/toast.js'
import { resolveOpportunityStatus } from '../../utils/opportunityStatus.js'
import { ARABIC_TO_ENGLISH_TERMS as SHARED_ARABIC_TO_ENGLISH_TERMS, isGibberish, OPP_STORAGE_KEY, PUBLISHED_KEY, DRAFT_KEY, translateArabicStringToEnglish, translateEnglishStringToArabic } from './org-opportunities-data.js'
import LangToggleBtn from '../../components/org/LangToggleBtn'
import OrgSidebar, { OrgMobileHeader } from '../../components/org/OrgSidebar'
import '../../styles/org/sidebar.css'
import '../../styles/admin/admin.css'
import '../../styles/org/org-dashboard.css'
import '../../styles/org/org-create-event.css'

// الفرص المعرفة في النظام للتعديل السريع والاختبار
const KNOWN_OPPORTUNITIES = {
    'evt-1': {
        id: 'evt-1',
        title: 'Global AI Innovation Challenge',
        titleEn: 'Global AI Innovation Challenge',
        titleAr: 'تحدي الابتكار العالمي للذكاء الاصطناعي',
        name: 'Global AI Innovation Challenge',
        nameAr: 'تحدي الابتكار العالمي للذكاء الاصطناعي',
        category: 'Competition',
        status: 'live', // مباشر
        applicantsCount: 98,
        participationType: 'Both / Solo & Team',
        minTeamSize: '2',
        maxTeamSize: '4',
        startDate: '2026-10-15',
        endDate: '2026-11-15',
        location: 'Remote - Cloud Innovation Hub (Virtual)',
        locationEn: 'Remote - Cloud Innovation Hub (Virtual)',
        locationAr: 'عن بعد - منصة الابتكار السحابية (Virtual)',
        description: 'An international tech hackathon dedicated to creating groundbreaking Generative AI & Deep Learning solutions for sustainability and Saudi Vision 2030.',
        descriptionEn: 'An international tech hackathon dedicated to creating groundbreaking Generative AI & Deep Learning solutions for sustainability and Saudi Vision 2030.',
        descriptionAr: 'هاكاثون تقني دولي يهدف لتطوير حلول مبتكرة في الذكاء الاصطناعي التوليدي والتعلم العميق لمواجهة تحديات الاستدامة ورؤية المملكة 2030.',
        requirements: 'Proficiency in Python/JavaScript, understanding of machine learning frameworks and prompt engineering.',
        requirementsEn: 'Proficiency in Python/JavaScript, understanding of machine learning frameworks and prompt engineering.',
        requirementsAr: 'إتقان لغات البرمجة (Python / JavaScript)، وفهم أساسيات نماذج الذكاء الاصطناعي ومكتبات التعلم الآلي.',
        prize: '$25,000 Cash Prize Pool for top 3 teams + Business Incubator Sponsorship',
        prizeEn: '$25,000 Cash Prize Pool for top 3 teams + Business Incubator Sponsorship',
        prizeAr: '100,000 ريال جوائز نقدية موزعة على المراكز الثلاثة الأولى + رعاية حاضنة أعمال',
        coverName: 'ai-global-challenge.jpg'
    },
    'evt-2': {
        id: 'evt-2',
        title: 'Frontend Wizards',
        titleEn: 'Frontend Wizards',
        titleAr: 'معالجو الواجهة الأمامية',
        name: 'Frontend Wizards',
        nameAr: 'معالجو الواجهة الأمامية',
        category: 'Competition',
        status: 'ended', // منتهي
        applicantsCount: 150,
        participationType: 'Both / Solo & Team',
        minTeamSize: '2',
        maxTeamSize: '3',
        startDate: '2026-09-01',
        endDate: '2026-09-15',
        location: 'Riyadh - King Abdullah Financial District (KAFD)',
        locationEn: 'Riyadh - King Abdullah Financial District (KAFD)',
        locationAr: 'الرياض - مركز الملك عبد الله المالي',
        description: 'Specialized hackathon in modern web UI design, interactive frontend architectures, and reactive UX patterns.',
        descriptionEn: 'Specialized hackathon in modern web UI design, interactive frontend architectures, and reactive UX patterns.',
        descriptionAr: 'هاكاثون متخصص في تصميم وبرمجة واجهات المستخدم التفاعلية وتطبيقات الويب الحديثة.',
        requirements: 'Demonstrated experience in React, modern Tailwind CSS, and UX micro-interactions.',
        requirementsEn: 'Demonstrated experience in React, modern Tailwind CSS, and UX micro-interactions.',
        requirementsAr: 'خبرة في React و CSS المعاصر وتجربة المستخدم.',
        prize: '$8,000 Prize Pool for Winners',
        prizeEn: '$8,000 Prize Pool for Winners',
        prizeAr: '30,000 ريال جوائز للفائزين',
        coverName: 'frontend-wizards.jpg'
    },
    'evt-3': {
        id: 'evt-3',
        title: 'Startup Challenge',
        titleEn: 'Startup Challenge',
        titleAr: 'تحدي الشركات الناشئة',
        name: 'Startup Challenge',
        nameAr: 'تحدي الشركات الناشئة',
        category: 'Competition',
        status: 'upcoming', // قادم
        applicantsCount: 84,
        participationType: 'Team Only',
        minTeamSize: '2',
        maxTeamSize: '5',
        startDate: '2026-11-20',
        endDate: '2026-11-25',
        location: 'Riyadh International Convention & Exhibition Center',
        locationEn: 'Riyadh International Convention & Exhibition Center',
        locationAr: 'مركز الرياض الدولي للمؤتمرات',
        description: 'Intensive startup accelerator hackathon transforming early-stage ideas into viable, venture-backed business models.',
        descriptionEn: 'Intensive startup accelerator hackathon transforming early-stage ideas into viable, venture-backed business models.',
        descriptionAr: 'مسابقة مكثفة لتسريع أفكار المشاريع الريادية وتحويلها إلى نماذج أعمال حقيقية قابلة للاستثمار.',
        requirements: 'Cross-functional team of at least 2 and at most 5 members with a working pitch deck.',
        requirementsEn: 'Cross-functional team of at least 2 and at most 5 members with a working pitch deck.',
        requirementsAr: 'فريق عمل متكامل لا يقل عن عضوين ولا يزيد عن 5 أعضاء.',
        prize: '$15,000 Seed Grant for each qualified team',
        prizeEn: '$15,000 Seed Grant for each qualified team',
        prizeAr: '50,000 ريال دعم أولي لكل فريق متأهل',
        coverName: 'startup-challenge.jpg'
    },
    'evt-4': {
        id: 'evt-4',
        title: 'DevOps Masterclass',
        titleEn: 'DevOps Masterclass',
        titleAr: 'دورة ديف أوبس الاحترافية',
        name: 'DevOps Masterclass',
        nameAr: 'دورة ديف أوبس الاحترافية',
        category: 'Workshop',
        status: 'pending', // معلق
        applicantsCount: 0,
        participationType: 'Solo Only',
        minTeamSize: '',
        maxTeamSize: '',
        startDate: '2026-11-01',
        endDate: '2026-11-03',
        location: 'Online Live Stream (Zoom)',
        locationEn: 'Online Live Stream (Zoom)',
        locationAr: 'عبر الإنترنت (Zoom Live)',
        description: 'Hands-on intensive masterclass covering CI/CD pipelines, Docker containers, Kubernetes clusters, and cloud automation.',
        descriptionEn: 'Hands-on intensive masterclass covering CI/CD pipelines, Docker containers, Kubernetes clusters, and cloud automation.',
        descriptionAr: 'برنامج عملي مكثف يغطي أحدث ممارسات CI/CD و Docker و Kubernetes وأتمتة النشر السحابي.',
        requirements: 'Foundational knowledge of Linux environments and command-line shell scripts.',
        requirementsEn: 'Foundational knowledge of Linux environments and command-line shell scripts.',
        requirementsAr: 'معرفة أساسية بأنظمة لينكس وأوامر سطر الأوامر.',
        prize: '',
        prizeEn: '',
        prizeAr: '',
        coverName: null
    },
    'evt-5': {
        id: 'evt-5',
        title: 'Cloud Native Bootcamp',
        titleEn: 'Cloud Native Bootcamp',
        titleAr: 'معسكر التقنيات السحابية',
        name: 'Cloud Native Bootcamp',
        nameAr: 'معسكر التقنيات السحابية',
        category: 'Course',
        status: 'ended', // منتهي
        applicantsCount: 42,
        participationType: 'Solo Only',
        minTeamSize: '',
        maxTeamSize: '',
        startDate: '2026-08-10',
        endDate: '2026-08-25',
        location: 'Remote Online',
        locationEn: 'Remote Online',
        locationAr: 'عن بعد',
        description: 'Advanced engineering bootcamp covering distributed cloud-native infrastructure architectures.',
        descriptionEn: 'Advanced engineering bootcamp covering distributed cloud-native infrastructure architectures.',
        descriptionAr: 'دورة تدريبية متقدمة في البنية التحتية السحابية.',
        requirements: 'Basic understanding of cloud computing and microservices architectures.',
        requirementsEn: 'Basic understanding of cloud computing and microservices architectures.',
        requirementsAr: 'معرفة بأساسيات الحوسبة السحابية.',
        prize: '',
        prizeEn: '',
        prizeAr: '',
        coverName: null
    },
    'evt-6': {
        id: 'evt-6',
        title: 'Cybersecurity Defense Challenge',
        titleEn: 'Cybersecurity Defense Challenge',
        titleAr: 'تحدي الدفاع السيبراني المتقدم',
        name: 'Cybersecurity Defense Challenge',
        nameAr: 'تحدي الدفاع السيبراني المتقدم',
        category: 'Competition',
        status: 'rejected', // مرفوض
        rejectionReason: 'Event agenda is missing the certified cybersecurity accreditation and detailed venue safety plan. Please attach the required approvals.',
        rejectionReasonAr: 'أجندة الفعالية تفتقر إلى الاعتماد الأكاديمي المطلوب وخطة السلامة للمقر الحضوري. يرجى إرفاق الموافقات اللازمة.',
        applicantsCount: 0,
        participationType: 'Team Only',
        minTeamSize: '3',
        maxTeamSize: '5',
        startDate: '2026-12-10',
        endDate: '2026-12-15',
        location: 'Riyadh - King Salman Science Oasis',
        locationEn: 'Riyadh - King Salman Science Oasis',
        locationAr: 'الرياض - واحة الملك سلمان للعلوم',
        description: 'Capture-the-flag cybersecurity tournament focusing on defending distributed network endpoints and patching zero-day exploits.',
        descriptionEn: 'Capture-the-flag cybersecurity tournament focusing on defending distributed network endpoints and patching zero-day exploits.',
        descriptionAr: 'مسابقة التقاط العلم السيبرانية لحماية الأنظمة الموزعة وكشف الثغرات الحرجة.',
        requirements: 'Solid background in ethical hacking, penetration testing, and network analysis.',
        requirementsEn: 'Solid background in ethical hacking, penetration testing, and network analysis.',
        requirementsAr: 'معرفة قوية بأمن المعلومات واختبار الاختراق الأخلاقي.',
        prize: '$20,000 for top 3 defending teams',
        prizeEn: '$20,000 for top 3 defending teams',
        prizeAr: '75,000 ريال للفائزين بالمراكز الثلاثة الأولى',
        coverName: null
    },
    'evt-7': {
        id: 'evt-7',
        title: 'Smart Cities Hackathon',
        titleEn: 'Smart Cities Hackathon',
        titleAr: 'هاكاثون المدن الذكية',
        name: 'Smart Cities Hackathon',
        nameAr: 'هاكاثون المدن الذكية',
        category: 'Competition',
        status: 'live', // مباشر
        applicantsCount: 36,
        participationType: 'Team Only',
        minTeamSize: '2',
        maxTeamSize: '5',
        startDate: '2026-10-25',
        endDate: '2026-11-20',
        location: 'Amman - King Hussein Business Park',
        locationEn: 'Amman - King Hussein Business Park',
        locationAr: 'عمّان - مجمع الملك الحسين للأعمال',
        description: 'A hands-on hackathon where teams build solutions for urban mobility, energy efficiency, and smarter public services.',
        descriptionEn: 'A hands-on hackathon where teams build solutions for urban mobility, energy efficiency, and smarter public services.',
        descriptionAr: 'هاكاثون تطبيقي تبني فيه الفرق حلولاً للتنقل الحضري وكفاءة الطاقة وتطوير الخدمات العامة الذكية.',
        requirements: 'Basic programming skills and interest in IoT or data analysis.',
        requirementsEn: 'Basic programming skills and interest in IoT or data analysis.',
        requirementsAr: 'مهارات برمجية أساسية واهتمام بإنترنت الأشياء أو تحليل البيانات.',
        prize: '$10,000 for the top 3 teams',
        prizeEn: '$10,000 for the top 3 teams',
        prizeAr: '7,000 دينار للفرق الثلاثة الأولى',
        coverName: null
    },
    'evt-8': {
        id: 'evt-8',
        title: 'Mobile Apps Workshop',
        titleEn: 'Mobile Apps Workshop',
        titleAr: 'ورشة تطوير تطبيقات الجوال',
        name: 'Mobile Apps Workshop',
        nameAr: 'ورشة تطوير تطبيقات الجوال',
        category: 'Workshop',
        status: 'rejected', // مرفوض
        rejectionReason: 'The workshop description is too brief and the requirements are too vague. Please add a detailed agenda and clear participant requirements.',
        rejectionReasonAr: 'وصف الورشة مختصر جداً والمتطلبات غير واضحة. يرجى إضافة جدول تفصيلي للورشة ومتطلبات واضحة للمشاركين.',
        applicantsCount: 0,
        participationType: '',
        minTeamSize: '',
        maxTeamSize: '',
        startDate: '2026-12-01',
        endDate: '2026-12-03',
        location: 'Online - Zoom',
        locationEn: 'Online - Zoom',
        locationAr: 'عبر الإنترنت - زووم',
        description: 'Intro to building mobile apps with Flutter.',
        descriptionEn: 'Intro to building mobile apps with Flutter.',
        descriptionAr: 'مقدمة في بناء تطبيقات الجوال باستخدام فلاتر.',
        requirements: 'A laptop.',
        requirementsEn: 'A laptop.',
        requirementsAr: 'جهاز لابتوب.',
        prize: '',
        prizeEn: '',
        prizeAr: '',
        coverName: null
    }
}

// قاموس العبارات والترجمات المتبادلة لضمان عدم تسرب أي لغة للأخرى
// (مبني فوق القاموس المشترك مع صفحتي الفرص والمتقدمين، حتى تتطابق الترجمة بين كل الصفحات)
const KNOWN_PHRASES_AR_TO_EN = {
    ...SHARED_ARABIC_TO_ENGLISH_TERMS,
    // Titles
    'دورة ديف أوبس الاحترافية': 'DevOps Masterclass',
    'تحدي الابتكار العالمي للذكاء الاصطناعي': 'Global AI Innovation Challenge',
    'معالجو الواجهة الأمامية': 'Frontend Wizards',
    'تحدي الشركات الناشئة': 'Startup Challenge',
    'معسكر التقنيات السحابية': 'Cloud Native Bootcamp',
    'تحدي الدفاع السيبراني المتقدم': 'Cybersecurity Defense Challenge',

    // Locations
    'عبر الإنترنت (Zoom Live)': 'Online Live Stream (Zoom)',
    'عن بعد - منصة الابتكار السحابية (Virtual)': 'Remote - Cloud Innovation Hub (Virtual)',
    'الرياض - مركز الملك عبد الله المالي': 'Riyadh - King Abdullah Financial District (KAFD)',
    'مركز الرياض الدولي للمؤتمرات': 'Riyadh International Convention & Exhibition Center',
    'عن بعد': 'Remote Online',
    'الرياض - واحة الملك سلمان للعلوم': 'Riyadh - King Salman Science Oasis',

    // Descriptions
    'برنامج عملي مكثف يغطي أحدث ممارسات CI/CD و Docker و Kubernetes وأتمتة النشر السحابي.': 'Hands-on intensive masterclass covering CI/CD pipelines, Docker containers, Kubernetes clusters, and cloud automation.',
    'هاكاثون تقني دولي يهدف لتطوير حلول مبتكرة في الذكاء الاصطناعي التوليدي والتعلم العميق لمواجهة تحديات الاستدامة ورؤية المملكة 2030.': 'An international tech hackathon dedicated to creating groundbreaking Generative AI & Deep Learning solutions for sustainability and Saudi Vision 2030.',
    'هاكاثون متخصص في تصميم وبرمجة واجهات المستخدم التفاعلية وتطبيقات الويب الحديثة.': 'Specialized hackathon in modern web UI design, interactive frontend architectures, and reactive UX patterns.',
    'مسابقة مكثفة لتسريع أفكار المشاريع الريادية وتحويلها إلى نماذج أعمال حقيقية قابلة للاستثمار.': 'Intensive startup accelerator hackathon transforming early-stage ideas into viable, venture-backed business models.',
    'دورة تدريبية متقدمة في البنية التحتية السحابية.': 'Advanced engineering bootcamp covering distributed cloud-native infrastructure architectures.',
    'مسابقة التقاط العلم السيبرانية لحماية الأنظمة الموزعة وكشف الثغرات الحرجة.': 'Capture-the-flag cybersecurity tournament focusing on defending distributed network endpoints and patching zero-day exploits.',

    // Requirements
    'معرفة أساسية بأنظمة لينكس وأوامر سطر الأوامر.': 'Foundational knowledge of Linux environments and command-line shell scripts.',
    'إتقان لغات البرمجة (Python / JavaScript)، وفهم أساسيات نماذج الذكاء الاصطناعي ومكتبات التعلم الآلي.': 'Proficiency in Python/JavaScript, understanding of machine learning frameworks and prompt engineering.',
    'خبرة في React و CSS المعاصر وتجربة المستخدم.': 'Demonstrated experience in React, modern Tailwind CSS, and UX micro-interactions.',
    'فريق عمل متكامل لا يقل عن عضوين ولا يزيد عن 5 أعضاء.': 'Cross-functional team of at least 2 and at most 5 members with a working pitch deck.',
    'معرفة بأساسيات الحوسبة السحابية.': 'Basic understanding of cloud computing and microservices architectures.',
    'معرفة قوية بأمن المعلومات واختبار الاختراق الأخلاقي.': 'Solid background in ethical hacking, penetration testing, and network analysis.',

    // Prizes
    '100,000 ريال جوائز نقدية موزعة على المراكز الثلاثة الأولى + رعاية حاضنة أعمال': '$25,000 Cash Prize Pool for top 3 teams + Business Incubator Sponsorship',
    '30,000 ريال جوائز للفائزين': '$8,000 Prize Pool for Winners',
    '50,000 ريال دعم أولي لكل فريق متأهل': '$15,000 Seed Grant for each qualified team',
    '75,000 ريال للفائزين بالمراكز الثلاثة الأولى': '$20,000 for top 3 defending teams',
}

const KNOWN_PHRASES_EN_TO_AR = Object.fromEntries(
    Object.entries(KNOWN_PHRASES_AR_TO_EN).map(([ar, en]) => [en, ar])
)

const CATEGORIES = [
    { id: 'Competition', labelEn: 'Competition', labelAr: 'مسابقات', icon: 'emoji_events' },
    { id: 'Event',       labelEn: 'Event',       labelAr: 'فعالية',   icon: 'event' },
    { id: 'Workshop',    labelEn: 'Workshop',    labelAr: 'ورشة عمل', icon: 'build' },
    { id: 'Course',      labelEn: 'Course',      labelAr: 'دورة',     icon: 'school' },
]

// خيارات نوع المشاركة
const PARTICIPATION_OPTIONS = [
    {
        value: 'Solo Only',
        titleAr: 'مشاركة فردية فقط',
        titleEn: 'Solo Only',
        badge: 'Solo Only (للـفردي فقط)',
        badgeAr: 'للأفراد فقط',
        badgeEn: 'Individual Only',
        subAr: 'مشاركة فردية فقط، بدون الحاجة لتشكيل فرق',
        subEn: 'Individual participants only; no teams allowed',
        icon: 'person',
        code: 'solo',
    },
    {
        value: 'Team Only',
        titleAr: 'مشاركة فرق فقط',
        titleEn: 'Team Only',
        badge: 'Team Only (للـفريق فقط)',
        badgeAr: 'للفرق فقط',
        badgeEn: 'Teams Only',
        subAr: 'مشاركة جماعية كفريق، يتطلب تشكيل فريق للتسجيل',
        subEn: 'Team formation strictly required to participate',
        icon: 'groups',
        code: 'team',
    },
    {
        value: 'Both / Solo & Team',
        titleAr: 'للأفراد والفرق معاً',
        titleEn: 'Solo & Team',
        badge: 'Both / Solo & Team (لكلا الخيارين)',
        badgeAr: 'لكلا الخيارين',
        badgeEn: 'Flexible',
        subAr: 'متاح للأفراد وللفرق، حرية الاختيار للمشارك',
        subEn: 'Flexible: contenders can join as solo or in teams',
        icon: 'join_inner',
        code: 'both',
    },
]

// دالة لتنظيف وتحويل الأرقام العربية والمشرقية
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

function sanitizeOrEnrichOpportunity(item) {
    if (!item) return item

    const rawTitle = (item.title || item.name || '').trim()
    const isGenericOrArabicTitle = rawTitle === 'مسابقة' || rawTitle === 'مسابقة جديدة' || rawTitle === 'Competition' || !rawTitle || isGibberish(rawTitle)
    
    const titleEn = isGenericOrArabicTitle 
        ? 'Tech Innovation Challenge' 
        : (item.titleEn || (!(/[\u0600-\u06FF]/.test(rawTitle)) ? rawTitle : (KNOWN_PHRASES_AR_TO_EN[rawTitle] || translateArabicStringToEnglish(rawTitle))))

    const titleAr = isGenericOrArabicTitle
        ? 'مسابقة الابتكار التقني'
        : (item.titleAr || (/[\u0600-\u06FF]/.test(rawTitle) ? rawTitle : (KNOWN_PHRASES_EN_TO_AR[rawTitle] || translateEnglishStringToArabic(rawTitle))))

    const rawLoc = (item.location || item.locationEn || item.locationAr || '').trim()
    const isBadLoc = isGibberish(rawLoc)

    const locationEn = isBadLoc 
        ? ''
        : (item.locationEn || (!(/[\u0600-\u06FF]/.test(rawLoc)) ? rawLoc : (KNOWN_PHRASES_AR_TO_EN[rawLoc] || translateArabicStringToEnglish(rawLoc))))

    const locationAr = isBadLoc
        ? ''
        : (item.locationAr || (/[\u0600-\u06FF]/.test(rawLoc) ? rawLoc : (KNOWN_PHRASES_EN_TO_AR[rawLoc] || translateEnglishStringToArabic(rawLoc))))

    const rawDesc = (item.description || item.descriptionEn || item.descriptionAr || '').trim()
    const isBadDesc = isGibberish(rawDesc)

    const descriptionEn = isBadDesc
        ? ''
        : (item.descriptionEn || (!(/[\u0600-\u06FF]/.test(rawDesc)) ? rawDesc : (KNOWN_PHRASES_AR_TO_EN[rawDesc] || rawDesc)))

    const descriptionAr = isBadDesc
        ? ''
        : (item.descriptionAr || (/[\u0600-\u06FF]/.test(rawDesc) ? rawDesc : (KNOWN_PHRASES_EN_TO_AR[rawDesc] || rawDesc)))

    const rawReq = (item.requirements || item.requirementsEn || item.requirementsAr || '').trim()
    const isBadReq = isGibberish(rawReq)

    const requirementsEn = isBadReq
        ? ''
        : (item.requirementsEn || (!(/[\u0600-\u06FF]/.test(rawReq)) ? rawReq : (KNOWN_PHRASES_AR_TO_EN[rawReq] || rawReq)))

    const requirementsAr = isBadReq
        ? ''
        : (item.requirementsAr || (/[\u0600-\u06FF]/.test(rawReq) ? rawReq : (KNOWN_PHRASES_EN_TO_AR[rawReq] || rawReq)))

    // الجائزة اختيارية: لا نختلق جائزة إذا تركها المنظم فارغة
    const rawPrize = (item.prize || item.prizeEn || item.prizeAr || '').trim()

    const prizeEn = !rawPrize
        ? ''
        : (item.prizeEn || (!(/[\u0600-\u06FF]/.test(rawPrize)) ? rawPrize : (KNOWN_PHRASES_AR_TO_EN[rawPrize] || rawPrize)))

    const prizeAr = !rawPrize
        ? ''
        : (item.prizeAr || (/[\u0600-\u06FF]/.test(rawPrize) ? rawPrize : (KNOWN_PHRASES_EN_TO_AR[rawPrize] || rawPrize)))

    return {
        ...item,
        titleEn,
        titleAr,
        title: titleEn,
        name: titleEn,
        nameAr: titleAr,
        locationEn,
        locationAr,
        location: locationEn,
        descriptionEn,
        descriptionAr,
        description: descriptionEn,
        requirementsEn,
        requirementsAr,
        requirements: requirementsEn,
        prizeEn,
        prizeAr,
        prize: prizeEn,
        category: item.category || 'Competition',
        participationType: item.participationType || 'Both / Solo & Team',
        minTeamSize: item.minTeamSize || '2',
        maxTeamSize: item.maxTeamSize || '4',
    }
}

function mergeOpportunityData(known, stored) {
    if (!stored) return known || null
    if (!known) return sanitizeOrEnrichOpportunity(stored)

    const base = { ...known, ...stored }
    return sanitizeOrEnrichOpportunity(base)
}

function getStoredOpportunity(id) {
    if (!id) return null
    const known = KNOWN_OPPORTUNITIES[id] || null

    try {
        // 1. فحص التعديلات المحفوظة في localStorage أولاً
        const storedOpps = JSON.parse(localStorage.getItem(OPP_STORAGE_KEY) || '[]')
        const oppIndex = storedOpps.findIndex(x => x.id === id)
        if (oppIndex >= 0) {
            return mergeOpportunityData(known, storedOpps[oppIndex])
        }

        // 2. فحص الفعاليات المنشورة في localStorage
        const published = JSON.parse(localStorage.getItem(PUBLISHED_KEY) || '[]')
        const pubIndex = published.findIndex(x => x.id === id)
        if (pubIndex >= 0) {
            return mergeOpportunityData(known, published[pubIndex])
        }
    } catch (e) {
        console.error('Failed to parse stored opportunities:', e)
    }

    // 3. الرجوع للبيانات المعرفة مسبقاً إذا لم تكن معدلة
    return known
}

const INITIAL_EMPTY_FORM = {
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

// الحقول النصية التي لها نسخة عربية وأخرى إنجليزية
const LOCALIZED_TEXT_FIELDS = ['title', 'location', 'description', 'requirements', 'prize']

function pickTextFields(data) {
    return Object.fromEntries(LOCALIZED_TEXT_FIELDS.map(f => [f, data[f]]))
}

export default function OrgCreateEvent() {
    useOrgPageControls()
    const navigate = useNavigate()
    const { id: paramId } = useParams()
    const [searchParams] = useSearchParams()
    const { language, isRtl } = useLanguage()
    const isAr = Boolean(isRtl || language?.startsWith('ar'))

    // 1. تحديد وضع الصفحة (Create vs Edit) بناءً على وجود المعرف في الرابط أو الاستعلام
    const editId = searchParams.get('edit') || searchParams.get('id') || paramId
    // يُعاد حسابه فقط عند تغيّر editId، مش بكل render (كل ضغطة حرف أثناء الكتابة بالفورم)
    const activeEditEvent = useMemo(() => (editId ? getStoredOpportunity(editId) : null), [editId])
    const isEditMode = Boolean(activeEditEvent)

    // 2. مصفوفة حالات الفعالية (Status-based Rules)
    const eventStatus = resolveOpportunityStatus(activeEditEvent) || null
    const isEnded = eventStatus === 'ended' // منتهي: قفل كامل للقراءة والعرض فقط
    const isLive = Boolean(eventStatus === 'live' || eventStatus === 'Active') // مباشر
    const isUpcoming = eventStatus === 'upcoming' // قادم: تعديل متاح بحرية
    const isPending = eventStatus === 'pending'   // معلق: تعديل متاح بحرية
    const isRejected = eventStatus === 'rejected' // مرفوض: تعديل متاح بحرية

    const applicantsCount = activeEditEvent ? (Number(activeEditEvent.applicantsCount ?? activeEditEvent.applicants) || 0) : 0

    // شروط الحماية للحقول الأساسية: الفعالية منشورة (قادم أو مباشر) ويوجد عليها متقدمون مسجلون فعلياً
    const hasApplicantLocks = isEditMode && (isLive || isUpcoming) && applicantsCount > 0
    // تاريخ البدء يُقفل فقط إذا بدأت الفعالية فعلاً (مباشر)
    const isLiveWithApplicants = hasApplicantLocks && isLive

    // دالة مساعدة لتحديد ما إذا كان حقل معين مقفلاً (disabled / readOnly)
    function isFieldLocked(fieldName) {
        if (isEnded) return true // إذا كانت منتهية، جميع الحقول معطلة ومخصصة للقراءة والتقارير فقط
        if (!isEditMode) return false // وضع الإنشاء: جميع الحقول قابلة للإدخال
        if (isPending || isRejected) return false // معلق أو مرفوض: غير منشورة ولا متقدمين، فالتعديل حر

        if (hasApplicantLocks) {
            // الحقول الأساسية المقفلة لكل فعالية منشورة عليها متقدمون (قادم أو مباشر):
            if (fieldName === 'title' || fieldName === 'category') {
                return true
            }
            // تاريخ البدء: مقفل بعد انطلاق الفعالية، ويبقى قابلاً للتعديل في "قادم"
            if (fieldName === 'startDate' && isLive) {
                return true
            }
            // في فئة "المسابقات" حصرياً: يُقفل نوع المشاركة وحجم الفريق
            if (formData.category === 'Competition' && (fieldName === 'participationType' || fieldName === 'minTeamSize' || fieldName === 'maxTeamSize')) {
                return true
            }
        }
        return false
    }

    const [step, setStep] = useState(1)
    const [catOpen, setCatOpen] = useState(false)
    const [reviewData, setReviewData] = useState({})
    const [publishing, setPublishing] = useState(false)
    const [endDateError, setEndDateError] = useState('')
    const originalEndDate = (isEditMode && activeEditEvent?.endDate) ? activeEditEvent.endDate : ''

    // Form State الشامل: في التعديل تملأ البيانات القديمة، وفي الإنشاء تبدأ الحقول فارغة ونظيفة
    function getLocalizedEvent(ev, isArabic) {
        if (!ev) return INITIAL_EMPTY_FORM
        const enriched = sanitizeOrEnrichOpportunity(ev)
        const known = (ev.id && KNOWN_OPPORTUNITIES[ev.id]) ? KNOWN_OPPORTUNITIES[ev.id] : null

        // 1. Resolve Title
        let resolvedTitle = ''
        if (isArabic) {
            if (enriched.titleAr && /[\u0600-\u06FF]/.test(enriched.titleAr)) resolvedTitle = enriched.titleAr
            else if (enriched.title && /[\u0600-\u06FF]/.test(enriched.title)) resolvedTitle = enriched.title
            else if (known?.titleAr) resolvedTitle = known.titleAr
            else if (enriched.title && KNOWN_PHRASES_EN_TO_AR[enriched.title.trim()]) resolvedTitle = KNOWN_PHRASES_EN_TO_AR[enriched.title.trim()]
            else if (enriched.nameAr && /[\u0600-\u06FF]/.test(enriched.nameAr)) resolvedTitle = enriched.nameAr
            else resolvedTitle = 'مسابقة الابتكار التقني'
        } else {
            if (enriched.titleEn && !/[\u0600-\u06FF]/.test(enriched.titleEn)) resolvedTitle = enriched.titleEn
            else if (enriched.title && !/[\u0600-\u06FF]/.test(enriched.title)) resolvedTitle = enriched.title
            else if (known?.titleEn || known?.title) resolvedTitle = known.titleEn || known.title
            else if (enriched.title && KNOWN_PHRASES_AR_TO_EN[enriched.title.trim()]) resolvedTitle = KNOWN_PHRASES_AR_TO_EN[enriched.title.trim()]
            else if (enriched.titleAr && KNOWN_PHRASES_AR_TO_EN[enriched.titleAr.trim()]) resolvedTitle = KNOWN_PHRASES_AR_TO_EN[enriched.titleAr.trim()]
            else if (enriched.name && !/[\u0600-\u06FF]/.test(enriched.name)) resolvedTitle = enriched.name
            else resolvedTitle = 'Tech Innovation Challenge'
        }

        // 2. Resolve Location
        let resolvedLocation = ''
        if (isArabic) {
            if (enriched.locationAr && /[\u0600-\u06FF]/.test(enriched.locationAr)) resolvedLocation = enriched.locationAr
            else if (enriched.location && /[\u0600-\u06FF]/.test(enriched.location)) resolvedLocation = enriched.location
            else if (enriched.location && KNOWN_PHRASES_EN_TO_AR[enriched.location.trim()]) resolvedLocation = KNOWN_PHRASES_EN_TO_AR[enriched.location.trim()]
            else resolvedLocation = ''
        } else {
            if (enriched.locationEn && !/[\u0600-\u06FF]/.test(enriched.locationEn)) resolvedLocation = enriched.locationEn
            else if (enriched.location && !/[\u0600-\u06FF]/.test(enriched.location) && !isGibberish(enriched.location)) resolvedLocation = enriched.location
            else if (enriched.location && KNOWN_PHRASES_AR_TO_EN[enriched.location.trim()]) resolvedLocation = KNOWN_PHRASES_AR_TO_EN[enriched.location.trim()]
            else if (enriched.locationAr && KNOWN_PHRASES_AR_TO_EN[enriched.locationAr.trim()]) resolvedLocation = KNOWN_PHRASES_AR_TO_EN[enriched.locationAr.trim()]
            else resolvedLocation = ''
        }

        // 3. Resolve Description
        let resolvedDesc = ''
        if (isArabic) {
            if (enriched.descriptionAr && /[\u0600-\u06FF]/.test(enriched.descriptionAr)) resolvedDesc = enriched.descriptionAr
            else if (enriched.description && /[\u0600-\u06FF]/.test(enriched.description)) resolvedDesc = enriched.description
            else if (enriched.description && KNOWN_PHRASES_EN_TO_AR[enriched.description.trim()]) resolvedDesc = KNOWN_PHRASES_EN_TO_AR[enriched.description.trim()]
            else resolvedDesc = ''
        } else {
            if (enriched.descriptionEn && !/[\u0600-\u06FF]/.test(enriched.descriptionEn)) resolvedDesc = enriched.descriptionEn
            else if (enriched.description && !/[\u0600-\u06FF]/.test(enriched.description) && !isGibberish(enriched.description)) resolvedDesc = enriched.description
            else if (enriched.description && KNOWN_PHRASES_AR_TO_EN[enriched.description.trim()]) resolvedDesc = KNOWN_PHRASES_AR_TO_EN[enriched.description.trim()]
            else if (enriched.descriptionAr && KNOWN_PHRASES_AR_TO_EN[enriched.descriptionAr.trim()]) resolvedDesc = KNOWN_PHRASES_AR_TO_EN[enriched.descriptionAr.trim()]
            else resolvedDesc = ''
        }

        // 4. Resolve Requirements
        let resolvedReq = ''
        if (isArabic) {
            if (enriched.requirementsAr && /[\u0600-\u06FF]/.test(enriched.requirementsAr)) resolvedReq = enriched.requirementsAr
            else if (enriched.requirements && /[\u0600-\u06FF]/.test(enriched.requirements)) resolvedReq = enriched.requirements
            else if (enriched.requirements && KNOWN_PHRASES_EN_TO_AR[enriched.requirements.trim()]) resolvedReq = KNOWN_PHRASES_EN_TO_AR[enriched.requirements.trim()]
            else resolvedReq = ''
        } else {
            if (enriched.requirementsEn && !/[\u0600-\u06FF]/.test(enriched.requirementsEn)) resolvedReq = enriched.requirementsEn
            else if (enriched.requirements && !/[\u0600-\u06FF]/.test(enriched.requirements) && !isGibberish(enriched.requirements)) resolvedReq = enriched.requirements
            else if (enriched.requirements && KNOWN_PHRASES_AR_TO_EN[enriched.requirements.trim()]) resolvedReq = KNOWN_PHRASES_AR_TO_EN[enriched.requirements.trim()]
            else if (enriched.requirementsAr && KNOWN_PHRASES_AR_TO_EN[enriched.requirementsAr.trim()]) resolvedReq = KNOWN_PHRASES_AR_TO_EN[enriched.requirementsAr.trim()]
            else resolvedReq = ''
        }

        // 5. Resolve Prize
        let resolvedPrize = ''
        if (isArabic) {
            if (enriched.prizeAr && /[\u0600-\u06FF]/.test(enriched.prizeAr)) resolvedPrize = enriched.prizeAr
            else if (enriched.prize && /[\u0600-\u06FF]/.test(enriched.prize)) resolvedPrize = enriched.prize
            else if (enriched.prize && KNOWN_PHRASES_EN_TO_AR[enriched.prize.trim()]) resolvedPrize = KNOWN_PHRASES_EN_TO_AR[enriched.prize.trim()]
            else resolvedPrize = ''
        } else {
            if (enriched.prizeEn && !/[\u0600-\u06FF]/.test(enriched.prizeEn)) resolvedPrize = enriched.prizeEn
            else if (enriched.prize && !/[\u0600-\u06FF]/.test(enriched.prize) && !isGibberish(enriched.prize)) resolvedPrize = enriched.prize
            else if (enriched.prize && KNOWN_PHRASES_AR_TO_EN[enriched.prize.trim()]) resolvedPrize = KNOWN_PHRASES_AR_TO_EN[enriched.prize.trim()]
            else if (enriched.prizeAr && KNOWN_PHRASES_AR_TO_EN[enriched.prizeAr.trim()]) resolvedPrize = KNOWN_PHRASES_AR_TO_EN[enriched.prizeAr.trim()]
            else resolvedPrize = ''
        }

        return {
            title: resolvedTitle,
            category: enriched.category || 'Competition',
            location: resolvedLocation,
            startDate: enriched.startDate || '',
            endDate: enriched.endDate || '',
            description: resolvedDesc,
            requirements: resolvedReq,
            prize: resolvedPrize,
            participationType: enriched.participationType || 'Both / Solo & Team',
            minTeamSize: getSafeTeamSize(enriched.minTeamSize, '2'),
            maxTeamSize: getSafeTeamSize(enriched.maxTeamSize, '4'),
        }
    }

    const [formData, setFormData] = useState(() => {
        if (activeEditEvent) {
            return getLocalizedEvent(activeEditEvent, isAr)
        }
        try {
            const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null')
            if (draft) return { ...INITIAL_EMPTY_FORM, ...pickTextFields(draft), category: draft.category || INITIAL_EMPTY_FORM.category, startDate: draft.startDate || '', endDate: draft.endDate || '', participationType: draft.participationType || INITIAL_EMPTY_FORM.participationType, minTeamSize: draft.minTeamSize ? String(draft.minTeamSize) : '', maxTeamSize: draft.maxTeamSize ? String(draft.maxTeamSize) : '' }
        } catch {}
        return INITIAL_EMPTY_FORM
    })

    const [coverName, setCoverName] = useState(() => {
        if (activeEditEvent) return activeEditEvent.coverName || null
        try {
            const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null')
            return draft?.coverName || null
        } catch {
            return null
        }
    })

    // تعديلات النصوص غير المحفوظة لكل لغة، حتى لا تضيع عند تبديل اللغة أثناء التعديل
    const textEditsByLangRef = useRef({})
    const prevEditIdRef = useRef(editId)
    const prevIsArRef = useRef(isAr)
    const draftSaveTimerRef = useRef(null)
    useEffect(() => () => clearTimeout(draftSaveTimerRef.current), [])

    // حفظ المسودة بتأخير بسيط بدل كتابة متزامنة بكل ضغطة حرف
    function scheduleDraftSave(nextFormData) {
        clearTimeout(draftSaveTimerRef.current)
        draftSaveTimerRef.current = setTimeout(() => {
            try { localStorage.setItem(DRAFT_KEY, JSON.stringify(getPreparedPayload(nextFormData))) } catch (e) { console.error('Failed to save draft:', e) }
        }, 400)
    }

    // مزامنة وتفريغ البيانات فورياً عند تغير الـ editId أو اللغة
    useEffect(() => {
        const sameEvent = prevEditIdRef.current === editId
        const prevLang = prevIsArRef.current ? 'ar' : 'en'
        const langChanged = prevIsArRef.current !== isAr
        prevEditIdRef.current = editId
        prevIsArRef.current = isAr

        // ما تغيّر إشي فعلياً (نفس editId ونفس اللغة): إما أول mount — وبالوضعين formData/coverName
        // أصلاً اتعبّوا صح من useState (من المسودة أو من الفرصة المعدّلة) — أو تكرار الشغلة بدون سبب
        // حقيقي (React StrictMode بالتطوير بيشغّل كل useEffect مرتين). بالحالتين ما لازم نفرّغ الفورم
        // أو نمسح المسودة.
        if (sameEvent && !langChanged) return

        if (sameEvent && langChanged) {
            // تبديل اللغة فقط: نحتفظ بكل ما أدخله المنظم
            if (!activeEditEvent) return // وضع الإنشاء: النموذج يبقى كما هو
            const nextLang = isAr ? 'ar' : 'en'
            setFormData(prev => {
                textEditsByLangRef.current[prevLang] = pickTextFields(prev)
                return {
                    ...prev,
                    ...pickTextFields(getLocalizedEvent(activeEditEvent, isAr)),
                    ...textEditsByLangRef.current[nextLang],
                }
            })
            setStep(1)
            return
        }

        textEditsByLangRef.current = {}
        if (activeEditEvent) {
            setFormData(getLocalizedEvent(activeEditEvent, isAr))
            setCoverName(activeEditEvent.coverName || null)
        } else {
            // تفريغ النموذج تماماً عند الانتقال لصفحة إنشاء فعالية جديدة
            setFormData(INITIAL_EMPTY_FORM)
            setCoverName(null)
            setEndDateError('')
            try {
                localStorage.removeItem(DRAFT_KEY)
            } catch {}
        }
        setStep(1)
    }, [editId, isAr])

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

    // تجهيز كائن البيانات الموحد المتوافق مع الفلاتر
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
            participationType: selectedType,
            participationTypeCode: code,
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
        if (isEditMode) return
        try {
            const payload = getPreparedPayload()
            localStorage.setItem(DRAFT_KEY, JSON.stringify(payload))
        } catch (e) {
            console.error('Failed to save draft:', e)
        }
    }

    const handleInputChange = (field, value) => {
        if (isFieldLocked(field) || isEnded) return

        // فحص شرط تمديد تاريخ الانتهاء فقط في الفعاليات التي عليها متقدمون ومنع تقصيره
        if (field === 'endDate' && hasApplicantLocks && originalEndDate) {
            if (value && value < originalEndDate) {
                setEndDateError(
                    isAr
                        ? `لا يمكن تقصير تاريخ الانتهاء لفعالية عليها متقدمون عن الموعد الأصلي (${originalEndDate}). يُسمح بالتمديد فقط لضمان حقوق المشاركين.`
                        : `Cannot shorten end date below original (${originalEndDate}). Extending only to protect participants.`
                )
            } else {
                setEndDateError('')
            }
        }

        setFormData(prev => {
            const next = { ...prev, [field]: value }
            if (!isEditMode) scheduleDraftSave(next)
            return next
        })
    }

    const handleCategorySelect = (catId) => {
        if (isFieldLocked('category')) return
        setFormData(prev => {
            const isTargetComp = catId === 'Competition'
            const next = {
                ...prev,
                category: catId,
                prize: isTargetComp ? prev.prize : '',
                participationType: isTargetComp ? (prev.participationType || 'Both / Solo & Team') : '',
                minTeamSize: isTargetComp ? (prev.minTeamSize ? getSafeTeamSize(prev.minTeamSize, '') : '') : '',
                maxTeamSize: isTargetComp ? (prev.maxTeamSize ? getSafeTeamSize(prev.maxTeamSize, '') : '') : '',
            }
            if (!isEditMode) scheduleDraftSave(next)
            return next
        })
        setCatOpen(false)
    }

    const handleParticipationSelect = (optValue) => {
        if (isFieldLocked('participationType')) return
        setFormData(prev => {
            const isSoloOnly = optValue === 'Solo Only'
            const next = {
                ...prev,
                participationType: optValue,
                minTeamSize: isSoloOnly ? '' : (prev.minTeamSize ? getSafeTeamSize(prev.minTeamSize, '') : ''),
                maxTeamSize: isSoloOnly ? '' : (prev.maxTeamSize ? getSafeTeamSize(prev.maxTeamSize, '') : ''),
            }
            if (!isEditMode) scheduleDraftSave(next)
            return next
        })
    }

    function validateStep1() {
        if (isEnded) return true // الفعالية المنتهية تمر للمعاينة فقط

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

        // التحقق من شرط تمديد تاريخ الانتهاء لفعالية مباشرة (تمديد فقط وليس تقصير)
        if (hasApplicantLocks && originalEndDate && formData.endDate < originalEndDate) {
            toast(
                isAr
                    ? `لا يمكن تقصير تاريخ الانتهاء عن الموعد الأصلي (${originalEndDate}). مسموح بالتمديد فقط لضمان حقوق المشاركين.`
                    : `Cannot shorten end date below original (${originalEndDate}). Extending only.`,
                'error'
            )
            setEndDateError(
                isAr
                    ? `لا يمكن تقصير تاريخ الانتهاء عن الموعد الأصلي (${originalEndDate}). يُسمح بالتمديد فقط لضمان حقوق المشاركين.`
                    : `Cannot shorten end date below original (${originalEndDate}). Extending only.`
            )
            document.getElementById('ev-end')?.focus()
            return false
        }

        if (!formData.description.trim()) {
            toast(isAr ? 'يرجى كتابة وصف تفصيلي للفعالية' : 'Add a description so participants know what to expect', 'error')
            document.getElementById('ev-desc')?.focus()
            return false
        }

        // التحقق الخاص بالمسابقات (عندما تكون الحقول قابلة للتعديل)
        if (isComp && !hasApplicantLocks) {
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
        if (!isEditMode) saveDraft()
        goTo(step + 1)
    }

    function handlePublish() {
        if (isEnded) {
            toast(isAr ? 'الفعالية منتهية ومؤرشفة ولا يمكن حفظ تعديلات عليها' : 'Ended events cannot be modified', 'error')
            return
        }

        setPublishing(true)

        if (isEditMode) {
            // تحديث الفعالية القائمة وحفظ التعديلات
            try {
                const known = KNOWN_OPPORTUNITIES[editId] || {}
                const currentPayload = getPreparedPayload()

                // نصوص اللغة الأخرى: ما عدّله المنظم قبل تبديل اللغة، وإلا القيم المحفوظة سابقاً
                const otherLangEdits = textEditsByLangRef.current[isAr ? 'en' : 'ar'] || {}
                const fromOther = (field, storedValue) => otherLangEdits[field] ?? storedValue

                const titleEn = !isAr ? formData.title : fromOther('title', activeEditEvent?.titleEn || known.titleEn || known.title || '')
                const titleAr = isAr ? formData.title : fromOther('title', activeEditEvent?.titleAr || known.titleAr || '')

                const locationEn = !isAr ? formData.location : fromOther('location', activeEditEvent?.locationEn || known.locationEn || known.location || '')
                const locationAr = isAr ? formData.location : fromOther('location', activeEditEvent?.locationAr || known.locationAr || '')

                const descriptionEn = !isAr ? formData.description : fromOther('description', activeEditEvent?.descriptionEn || known.descriptionEn || known.description || '')
                const descriptionAr = isAr ? formData.description : fromOther('description', activeEditEvent?.descriptionAr || known.descriptionAr || '')

                const requirementsEn = !isAr ? formData.requirements : fromOther('requirements', activeEditEvent?.requirementsEn || known.requirementsEn || known.requirements || '')
                const requirementsAr = isAr ? formData.requirements : fromOther('requirements', activeEditEvent?.requirementsAr || known.requirementsAr || '')

                const prizeEn = !isAr ? formData.prize : fromOther('prize', activeEditEvent?.prizeEn || known.prizeEn || known.prize || '')
                const prizeAr = isAr ? formData.prize : fromOther('prize', activeEditEvent?.prizeAr || known.prizeAr || '')

                const updatedItem = {
                    ...known,
                    ...(activeEditEvent || {}),
                    ...currentPayload,
                    id: editId,
                    title: isAr ? (titleAr || titleEn) : (titleEn || titleAr),
                    titleEn,
                    titleAr,
                    name: titleEn || formData.title,
                    nameAr: titleAr || formData.title,
                    location: isAr ? (locationAr || locationEn) : (locationEn || locationAr),
                    locationEn,
                    locationAr,
                    description: isAr ? (descriptionAr || descriptionEn) : (descriptionEn || descriptionAr),
                    descriptionEn,
                    descriptionAr,
                    requirements: isAr ? (requirementsAr || requirementsEn) : (requirementsEn || requirementsAr),
                    requirementsEn,
                    requirementsAr,
                    prize: isAr ? (prizeAr || prizeEn) : (prizeEn || prizeAr),
                    prizeEn,
                    prizeAr,
                    // الفرصة المرفوضة تعود للمراجعة بعد تصحيحها، وغيرها تحتفظ بحالتها
                    // (فرصة بلا حالة مخزنة لم تُعتمد بعد، فلا يجوز ترقيتها تلقائياً إلى "مباشر")
                    status: isRejected ? 'pending' : (activeEditEvent?.status || 'pending'),
                    ...(isRejected ? { rejectionReason: '', rejectionReasonAr: '' } : {}),
                    applicants: applicantsCount,
                    applicantsCount: applicantsCount,
                    updatedAt: new Date().toISOString(),
                }

                // حفظ في قائمة الفرص المخزنة محلياً
                const opps = JSON.parse(localStorage.getItem(OPP_STORAGE_KEY) || '[]')
                const oppIndex = opps.findIndex(o => o.id === editId)
                if (oppIndex >= 0) {
                    opps[oppIndex] = updatedItem
                } else {
                    opps.unshift(updatedItem)
                }
                localStorage.setItem(OPP_STORAGE_KEY, JSON.stringify(opps))

                // تحديث قائمة الفعاليات المنشورة
                const published = JSON.parse(localStorage.getItem(PUBLISHED_KEY) || '[]')
                const pubIndex = published.findIndex(p => p.id === editId)
                if (pubIndex >= 0) {
                    published[pubIndex] = updatedItem
                    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(published))
                }

                if (KNOWN_OPPORTUNITIES[editId]) {
                    Object.assign(KNOWN_OPPORTUNITIES[editId], updatedItem)
                }
            } catch (e) {
                console.error('Failed to update event:', e)
                toast(isAr ? 'تعذر حفظ التعديلات، حاول مرة أخرى' : 'Could not save your changes, please try again', 'error')
                setPublishing(false)
                return
            }

            if (isRejected) {
                toast(
                    isAr
                        ? 'تم حفظ التصحيحات وإعادة إرسال الفعالية للمراجعة، وحالتها الآن "معلق"'
                        : 'Fixes saved and the event was resubmitted for review. Its status is now "Pending"',
                    'success'
                )
                setTimeout(() => navigate('/org/opportunities', { state: { resubmittedId: editId } }), 1200)
                return
            }

            toast(
                isAr
                    ? 'تم حفظ وتحديث بيانات الفعالية بنجاح'
                    : 'Event details updated successfully',
                'success'
            )
            setTimeout(() => navigate('/org/opportunities'), 1200)
            return
        }

        // إنشاء فعالية جديدة لأول مرة
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
            toast(isAr ? 'تعذر إرسال الفعالية، حاول مرة أخرى' : 'Could not submit the event, please try again', 'error')
            setPublishing(false)
            return
        }

        // الفعالية انتشرت فعلياً، فما عاد فيه مسودة غير مكتملة تستاهل تتعرض.
        // لازم نلغي أي حفظ تلقائي مجدول كمان، وإلا ممكن يكتب المسودة من جديد بعد الحذف.
        clearTimeout(draftSaveTimerRef.current)
        try { localStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ }

        toast(isAr ? 'تم إرسال الفعالية للمراجعة والاعتماد بنجاح' : 'Event submitted for approval', 'success')
        setTimeout(() => navigate('/org/opportunities'), 1400)
    }

    const currentCatMeta = CATEGORIES.find(c => c.id === formData.category) || CATEGORIES[0]

    return (
        <>
            <AppPageHead
                title={
                    isEditMode
                        ? (isAr ? `تعديل الفعالية: ${formData.title || 'إيفنتيفاي'} | EVENTIFY` : `Edit Event: ${formData.title || 'EVENTIFY'} | EVENTIFY`)
                        : (isAr ? 'إنشاء فعالية جديدة | EVENTIFY' : 'Create Event | EVENTIFY')
                }
            />
            <OrgMobileHeader />

            <div className="flex min-h-screen bg-bg text-on-surface">
                <OrgSidebar />

                <main className="flex-1 w-full px-4 md:px-12 pt-6 pb-24 lg:pb-8">
                    {/* Topbar */}
                    <div className="org-topbar">
                        <h1 className="org-topbar__title font-headline-lg text-headline-lg">
                            {isEditMode
                                ? (isAr ? 'تعديل الفعالية' : 'Edit Event')
                                : (isAr ? 'إنشاء فعالية جديدة' : 'Create Event')}
                        </h1>

                        <div className="org-topbar__right">
                            <div className="org-dropdown">
                                <button className="icon-btn" id="org-notif-toggle" type="button" aria-label={isAr ? 'الإشعارات (3 غير مقروءة)' : 'Notifications (3 unread)'} aria-expanded="false">
                                    <span className="material-symbols-outlined">notifications</span>
                                    <span className="icon-btn__dot" />
                                </button>
                                <div className="org-dropdown__panel org-dropdown__panel--notif" id="org-notif-panel" hidden role="menu" aria-label={isAr ? 'الإشعارات' : 'Notifications'}>
                                    <div className="flex items-center justify-between px-3 py-2 border-b border-outline-variant/40 mb-1">
                                        <span className="font-semibold text-xs text-on-surface">{isAr ? 'الإشعارات' : 'Notifications'}</span>
                                        <span className="text-[11px] font-semibold text-[#FF4D2E] bg-[#FF4D2E]/10 px-2 py-0.5 rounded-full">{isAr ? '3 جديدة' : '3 unread'}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <Link className="org-dropdown__item" to="/org/applicants">
                                            <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--surface-2)", color: "#FF4D2E" }}>
                                                <span className="material-symbols-outlined text-[18px]">person_add</span>
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="block font-medium text-xs leading-snug">
                                                    {isAr ? 'أحمد علي قدّم على تحدي الابتكار العالمي للذكاء الاصطناعي' : 'Ahmed Ali applied to Global AI Innovation Challenge'}
                                                </span>
                                                <span className="org-dropdown__meta">{isAr ? 'منذ ساعتين' : '2 hours ago'}</span>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <LangToggleBtn />

                            <button className="theme-toggle icon-btn" type="button" title={isAr ? 'تبديل المظهر' : 'Switch theme'} aria-label={isAr ? 'تبديل المظهر' : 'Switch theme'}>
                                <span className="material-symbols-outlined icon-dark">dark_mode</span>
                                <span className="material-symbols-outlined icon-light">light_mode</span>
                            </button>

                            <div className="org-dropdown">
                                <button className="dash-profile" id="org-profile-toggle" type="button" aria-label={isAr ? 'قائمة المنظمة' : 'Organization menu'} aria-expanded="false">
                                    <span className="dash-profile__avatar bg-[#FF4D2E] text-white">TG</span>
                                    <span className="font-semibold text-xs">{isAr ? 'مختبرات تيك جينيوس' : 'TechGenius Labs'}</span>
                                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">expand_more</span>
                                </button>
                                <div className="org-dropdown__panel org-dropdown__panel--profile" id="org-profile-panel" hidden role="menu" aria-label={isAr ? 'قائمة المنظمة' : 'Organization menu'}>
                                    <div className="px-3 py-2 border-b border-outline-variant/40 mb-1">
                                        <p className="font-semibold text-xs text-on-surface">{isAr ? 'مختبرات تيك جينيوس' : 'TechGenius Labs'}</p>
                                        <p className="text-[11px] text-on-surface-variant truncate">{isAr ? 'منظمة موثقة منذ 2024' : 'Verified organizer since 2024'}</p>
                                    </div>
                                    <Link className="org-dropdown__item" to="/org/profile">
                                        <span className="material-symbols-outlined text-[18px]">apartment</span>
                                        <span>{isAr ? 'ملف المنظمة' : 'Organization Profile'}</span>
                                    </Link>
                                    <Link className="org-dropdown__item" to="/org/settings">
                                        <span className="material-symbols-outlined text-[18px]">settings</span>
                                        <span>{isAr ? 'الإعدادات' : 'Settings'}</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Page Header Breadcrumb */}
                    <div className="org-page-header">
                        <div className="flex items-center gap-2 text-sm mb-2 flex-wrap">
                            <Link className="text-on-surface-variant hover:text-[#FF4D2E] transition-colors" to="/org/dashboard">
                                {isAr ? 'لوحة التحكم' : 'Dashboard'}
                            </Link>
                            <span className="text-outline">/</span>
                            <Link className="text-on-surface-variant hover:text-[#FF4D2E] transition-colors" to="/org/opportunities">
                                {isAr ? 'فرصي وفعالياتي' : 'Opportunities'}
                            </Link>
                            <span className="text-outline">/</span>
                            <span className="font-semibold text-[#FF4D2E]">
                                {isEditMode
                                    ? (isAr ? 'تعديل الفعالية' : 'Edit Event')
                                    : (isAr ? 'إنشاء حدث' : 'Create Event')}
                            </span>

                            {/* Badge لحالة الفعالية في وضع التعديل */}
                            {isEditMode && eventStatus && (
                                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ms-2 ${
                                    isLive ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' :
                                    isUpcoming ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30' :
                                    isEnded ? 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/30' :
                                    isRejected ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30' :
                                    'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                                }`}>
                                    {isLive ? (isAr ? 'مباشر' : 'Live') :
                                     isUpcoming ? (isAr ? 'قادم' : 'Upcoming') :
                                     isEnded ? (isAr ? 'منتهي ومؤرشف' : 'Ended') :
                                     isRejected ? (isAr ? 'مرفوض' : 'Rejected') :
                                     (isAr ? 'معلق' : 'Pending')}
                                </span>
                            )}
                        </div>

                        <p className="profile-page-desc">
                            {isEnded ? (
                                isAr ? 'هذه الفعالية منتهية ومؤرشفة — الحقول للعرض فقط وغير قابلة للتعديل.' : 'This event has concluded and is archived. Fields are read-only.'
                            ) : isLiveWithApplicants ? (
                                isAr
                                    ? `فعالية مباشرة تضم (${applicantsCount}) متقدم — الحقول الجوهرية مقفلة، مع إمكانية تعديل الشروط والجوائز والوصف وتمديد تاريخ الانتهاء بحرية.`
                                    : `Active live event with (${applicantsCount}) applicants — Core fields locked; description, prize, deadline extension allowed.`
                            ) : hasApplicantLocks ? (
                                isAr
                                    ? `فعالية قادمة تضم (${applicantsCount}) متقدم — الحقول الجوهرية مقفلة، ويمكنك تعديل تاريخ البدء والوصف والشروط والجوائز وتمديد تاريخ الانتهاء.`
                                    : `Upcoming event with (${applicantsCount}) applicants — Core fields locked; start date, description, prize and deadline extension allowed.`
                            ) : isUpcoming ? (
                                isAr
                                    ? 'فعالية في مرحلة "قادم" — جميع الحقول متاحة للتعديل بحرية دون أي قيود قبل انطلاق الفعالية.'
                                    : 'Upcoming event — All fields are freely editable prior to the official launch.'
                            ) : isPending ? (
                                isAr
                                    ? 'فعالية في مرحلة "معلق" — يمكنك تعديل كافة التفاصيل بحرية قبل الاعتماد النهائي.'
                                    : 'Pending event — You can freely edit all details before final approval.'
                            ) : isRejected ? (
                                isAr
                                    ? 'فعالية مرفوضة — صحّح ما طلبته الإدارة ثم احفظ لإعادة إرسالها للمراجعة.'
                                    : 'Rejected event — fix what the review team asked for, then save to resubmit it for review.'
                            ) : (
                                isAr
                                    ? 'يتم مراجعة الفعاليات المنشأة من قبل فريق EVENTIFY قبل اعتمادها ونشرها للمتسابقين.'
                                    : 'Submitted events are reviewed by our team before they go live for participants.'
                            )}
                        </p>
                    </div>

                    <div className="mx-auto w-full max-w-4xl">
                        {/* Stepper Progress Indicator */}
                        <div className="wizard-stepper" id="wizard-steps" role="tablist">
                            {[1, 2, 3].map((n, i) => {
                                const labels = isAr
                                    ? ['تفاصيل الفعالية', 'المراجعة والتدقيق', isEnded ? 'عرض البيانات' : isEditMode ? 'تأكيد الحفظ' : 'النشر']
                                    : ['Event Details', 'Review', isEnded ? 'View Summary' : isEditMode ? 'Confirm Update' : 'Publish']
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
                                
                                {/* 1. كرت توضيحي للفعاليات المنتهية (Ended) */}
                                {isEnded && (
                                    <div className="rounded-2xl border-2 border-slate-500/30 bg-slate-500/10 dark:bg-slate-500/[0.08] p-4 md:p-5 flex items-start gap-3.5 shadow-sm animate-[fadeIn_0.25s_ease-out]">
                                        <div className="w-10 h-10 rounded-xl bg-slate-500/20 text-slate-600 dark:text-slate-400 flex items-center justify-center flex-shrink-0">
                                            <span className="material-symbols-outlined text-[22px]">archive</span>
                                        </div>
                                        <div className="space-y-1 flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-bold text-on-surface text-sm md:text-base">
                                                    {isAr ? 'فعالية منتهية ومؤرشفة — الحقول للعرض فقط' : 'Ended & Archived Event — Read Only'}
                                                </h3>
                                                <span className="px-2.5 py-0.5 rounded-full bg-slate-500/20 text-on-surface-variant font-bold text-xs">
                                                    {isAr ? `${applicantsCount} مشارك سابق` : `${applicantsCount} Past Participants`}
                                                </span>
                                            </div>
                                            <p className="text-xs text-on-surface-variant leading-relaxed">
                                                {isAr
                                                    ? 'هذه الفعالية انتهت رسمياً وتمت أرشفتها. جميع الحقول مقفلة ومخصصة للمراجعة والتقارير فقط ولا يمكن إجراء أي تعديل عليها.'
                                                    : 'This event has concluded. All fields are locked for reporting and viewing purposes.'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* 2. كرت الحماية للفعاليات المباشرة التي بها متقدمون (Live with Applicants) */}
                                {hasApplicantLocks && (
                                    <div className="rounded-2xl border-2 border-amber-500/40 bg-amber-500/10 dark:bg-amber-500/[0.08] p-4 md:p-5 flex items-start gap-3.5 shadow-sm animate-[fadeIn_0.25s_ease-out]">
                                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                                            <span className="material-symbols-outlined text-[22px]">lock</span>
                                        </div>
                                        <div className="space-y-1.5 flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-bold text-amber-800 dark:text-amber-300 text-sm md:text-base">
                                                    {isLive
                                                        ? (isAr ? 'فعالية مباشرة نشطة — نظام حماية وتأمين البيانات مفعل' : 'Active Live Event — Data Protection Active')
                                                        : (isAr ? 'فعالية قادمة عليها متقدمون — نظام حماية البيانات مفعل' : 'Upcoming Event with Applicants — Data Protection Active')}
                                                </h3>
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-xs">
                                                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                                    {isAr ? `${applicantsCount} متقدم مسجل حالياً` : `${applicantsCount} Registered Applicants`}
                                                </span>
                                            </div>
                                            <p className="text-xs text-on-surface-variant leading-relaxed">
                                                {isLive
                                                    ? (isAr
                                                        ? 'لحماية سجلات المتسابقين، تم قفل حقول (اسم الفرصة، التصنيف، نوع المشاركة، حجم الفريق، وتاريخ البدء). ويُسمح فقط بتمديد تاريخ الانتهاء (وليس تقصيره) وتعديل الوصف والشروط والجوائز بحرية لضمان حقوق المشاركين.'
                                                        : 'To safeguard applicant records, core fields (Title, Category, Participation Type, Team Boundaries, and Start Date) are locked. End date can only be extended (not shortened) to ensure participants rights.')
                                                    : (isAr
                                                        ? 'لحماية من سجّلوا مسبقاً، تم قفل حقول (اسم الفرصة، التصنيف، نوع المشاركة، وحجم الفريق). يمكنك تعديل تاريخ البدء لأن الفعالية لم تبدأ بعد، ويُسمح فقط بتمديد تاريخ الانتهاء.'
                                                        : 'To protect those who already registered, core fields (Title, Category, Participation Type, Team Boundaries) are locked. The start date stays editable since the event has not started; the end date can only be extended.')}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* 3. كرت توضيحي لحالة "قادم" أو "معلق" (Upcoming / Pending) */}
                                {(isUpcoming || isPending) && (
                                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/[0.06] p-3.5 flex items-center gap-3 animate-[fadeIn_0.25s_ease-out]">
                                        <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[20px] flex-shrink-0">
                                            edit_note
                                        </span>
                                        <div className="text-xs text-on-surface-variant flex-1 min-w-0">
                                            <span className="font-bold text-emerald-800 dark:text-emerald-300">
                                                {isUpcoming
                                                    ? (isAr ? 'فعالية في مرحلة "قادم" — التعديل متاح بحرية كاملة' : 'Upcoming Event — Fully Editable')
                                                    : (isAr ? 'فعالية في مرحلة "معلق" — التعديل متاح بحرية كاملة' : 'Pending Event — Fully Editable')}
                                            </span>
                                            <p className="text-[11px] mt-0.5">
                                                {isAr
                                                    ? 'يمكنك تعديل جميع بيانات الفعالية (العنوان، التواريخ، نوع المشاركة، وحجم الفريق) بحرية وبدون قيود قبل انطلاق الفعالية.'
                                                    : 'All fields (title, dates, participation type, and team boundaries) are fully editable before the event goes live.'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* 4. كرت تنبيه للفعاليات المرفوضة من الأدمن (Rejected with Reason) */}
                                {isRejected && (
                                    <div className="rounded-2xl border-2 border-red-500/40 bg-red-500/10 dark:bg-red-500/[0.08] p-4 md:p-5 flex items-start gap-3.5 shadow-sm animate-[fadeIn_0.25s_ease-out]">
                                        <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0">
                                            <span className="material-symbols-outlined text-[22px]">cancel</span>
                                        </div>
                                        <div className="space-y-1.5 flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-bold text-red-800 dark:text-red-300 text-sm md:text-base">
                                                    {isAr ? 'تم رفض اعتماد الفعالية من إدارة المنصة' : 'Event Submission Rejected by Admins'}
                                                </h3>
                                                <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-800 dark:text-red-300 font-bold text-xs">
                                                    {isAr ? 'مرفوض' : 'Rejected'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed font-semibold">
                                                <span className="font-bold">{isAr ? 'سبب الرفض: ' : 'Reason for rejection: '}</span>
                                                {isAr 
                                                    ? (activeEditEvent?.rejectionReasonAr || activeEditEvent?.rejectionReason || 'يرجى مراجعة وتعديل بيانات الفعالية وإرفاق التراخيص المطلوبة قبل إعادة الإرسال.')
                                                    : (activeEditEvent?.rejectionReason || activeEditEvent?.rejectionReasonAr || 'Please review the requirements and re-attach needed documents.')}
                                            </p>
                                            <p className="text-[11px] text-on-surface-variant">
                                                {isAr 
                                                    ? 'يمكنك تعديل أي بيانات ناقصة أو تصحيحها، ثم حفظ وتحديث الفعالية لإعادة إرسالها للاعتماد.'
                                                    : 'You can modify any missing fields or details, then save and update the event to resubmit.'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Event Title */}
                                <div className="form-group">
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="form-label mb-0 flex items-center gap-1.5" htmlFor="ev-title">
                                            <span>{isAr ? 'عنوان الفعالية / الفرصة' : 'Opportunity Title'}</span>
                                            <span className="text-[#FF4D2E]">*</span>
                                        </label>

                                        {isFieldLocked('title') && (
                                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                                                isEnded ? 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30' : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'
                                            }`}>
                                                <span className="material-symbols-outlined text-[14px]">lock</span>
                                                {isEnded ? (isAr ? 'للقراءة فقط' : 'Read Only') : (isAr ? 'مقفل لوجود متقدمين' : 'Locked (has applicants)')}
                                            </span>
                                        )}
                                    </div>

                                    <div className="relative">
                                        <input
                                            className={`form-input focus:!border-[#FF4D2E] focus:!ring-2 focus:!ring-[#FF4D2E]/20 transition-all ${
                                                isFieldLocked('title')
                                                    ? '!bg-surface-container/60 !border-dashed !border-outline-variant/80 cursor-not-allowed opacity-80 !text-on-surface-variant select-none !px-10'
                                                    : ''
                                            }`}
                                            id="ev-title"
                                            name="title"
                                            type="text"
                                            disabled={isFieldLocked('title')}
                                            readOnly={isFieldLocked('title')}
                                            value={formData.title}
                                            onChange={e => handleInputChange('title', e.target.value)}
                                            placeholder={isAr ? 'مثال: هاكاثون الابتكار العالمي للذكاء الاصطناعي' : 'e.g. Global AI Innovation Challenge'}
                                            required
                                        />
                                        {isFieldLocked('title') && (
                                            <span className="material-symbols-outlined absolute top-1/2 -translate-y-1/2 text-amber-600 dark:text-amber-400 text-[18px] pointer-events-none end-3">
                                                lock
                                            </span>
                                        )}
                                    </div>

                                    {hasApplicantLocks && (
                                        <p className="text-[11px] text-amber-700 dark:text-amber-400 flex items-center gap-1 mt-1 font-medium">
                                            <span className="material-symbols-outlined text-[14px]">info</span>
                                            {isAr
                                                ? `لا يمكن تعديل اسم الفرصة لوجود متقدمين مسجلين بالفعل (${applicantsCount} متقدم).`
                                                : `Opportunity title cannot be modified because applicants have already registered (${applicantsCount} applicants).`}
                                        </p>
                                    )}
                                </div>

                                {/* Category & Location & Capacity */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Category Selector */}
                                    <div className="form-group">
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="form-label mb-0" htmlFor="ev-type">
                                                {isAr ? 'تصنيف الفعالية' : 'Category'} <span className="text-[#FF4D2E]">*</span>
                                            </label>
                                            {isFieldLocked('category') && (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                                                    <span className="material-symbols-outlined text-[12px]">lock</span>
                                                    {isEnded ? (isAr ? 'للقراءة فقط' : 'Read Only') : (isAr ? 'مقيد' : 'Locked')}
                                                </span>
                                            )}
                                        </div>

                                        <div className="org-cat-dropdown">
                                            <button
                                                type="button"
                                                className={`org-cat-btn transition-all ${
                                                    isFieldLocked('category')
                                                        ? '!bg-surface-container/60 !border-dashed cursor-not-allowed opacity-80'
                                                        : 'hover:border-[#FF4D2E] focus:border-[#FF4D2E]'
                                                }`}
                                                id="org-category-toggle"
                                                disabled={isFieldLocked('category')}
                                                aria-haspopup="listbox"
                                                aria-expanded={catOpen}
                                                onClick={(e) => {
                                                    if (isFieldLocked('category')) return
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
                                                    {isFieldLocked('category') ? 'lock' : 'expand_more'}
                                                </span>
                                            </button>

                                            {!isFieldLocked('category') && (
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
                                            )}
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="ev-location">
                                            {isAr ? 'الموقع أو رابط المنصة' : 'Location / Virtual URL'}
                                        </label>
                                        <input
                                            className="form-input focus:!border-[#FF4D2E] focus:!ring-2 focus:!ring-[#FF4D2E]/20"
                                            id="ev-location"
                                            name="location"
                                            type="text"
                                            disabled={isEnded}
                                            readOnly={isEnded}
                                            value={formData.location}
                                            onChange={e => handleInputChange('location', e.target.value)}
                                            placeholder={isAr ? 'مثال: عن بعد / الرياض، المملكة العربية السعودية' : 'e.g. Remote, Riyadh, SA or Online'}
                                        />
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* تاريخ البدء */}
                                    <div className="form-group">
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="form-label mb-0 flex items-center gap-1.5" htmlFor="ev-start">
                                                <span>{isAr ? 'تاريخ البدء' : 'Start Date'}</span>
                                                <span className="text-[#FF4D2E]">*</span>
                                            </label>
                                            {isFieldLocked('startDate') && (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                                                    <span className="material-symbols-outlined text-[12px]">lock</span>
                                                    {isEnded ? (isAr ? 'للقراءة فقط' : 'Read Only') : (isAr ? 'مقفل (الحدث مباشر)' : 'Locked (Live)')}
                                                </span>
                                            )}
                                        </div>

                                        <div className="relative">
                                            <input
                                                className={`form-input focus:!border-[#FF4D2E] focus:!ring-2 focus:!ring-[#FF4D2E]/20 ${
                                                    isFieldLocked('startDate')
                                                        ? '!bg-surface-container/60 !border-dashed cursor-not-allowed opacity-80 select-none !px-10'
                                                        : ''
                                                }`}
                                                id="ev-start"
                                                name="startDate"
                                                type="date"
                                                disabled={isFieldLocked('startDate')}
                                                readOnly={isFieldLocked('startDate')}
                                                value={formData.startDate}
                                                onChange={e => handleInputChange('startDate', e.target.value)}
                                                required
                                            />
                                            {isFieldLocked('startDate') && (
                                                <span className="material-symbols-outlined absolute top-1/2 -translate-y-1/2 text-amber-600 dark:text-amber-400 text-[18px] pointer-events-none end-3">
                                                    lock
                                                </span>
                                            )}
                                        </div>

                                        {isLiveWithApplicants && (
                                            <p className="text-[11px] text-amber-700 dark:text-amber-400 flex items-center gap-1 mt-1 font-medium">
                                                <span className="material-symbols-outlined text-[14px]">lock</span>
                                                {isAr
                                                    ? 'لا يمكن تعديل تاريخ البدء لأن الفعالية انطلقت ومباشرة بالفعل ويوجد متقدمون مسجلون.'
                                                    : 'Start date is locked because the live event has already started.'}
                                            </p>
                                        )}
                                    </div>

                                    {/* تاريخ الانتهاء */}
                                    <div className="form-group">
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="form-label mb-0 flex items-center gap-1.5" htmlFor="ev-end">
                                                <span>{isAr ? 'تاريخ الانتهاء' : 'End Date'}</span>
                                                <span className="text-[#FF4D2E]">*</span>
                                            </label>
                                            {isEnded ? (
                                                <span className="text-xs text-slate-500 font-semibold bg-slate-500/10 px-2 py-0.5 rounded">
                                                    {isAr ? 'للقراءة فقط' : 'Read Only'}
                                                </span>
                                            ) : hasApplicantLocks ? (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                                    <span className="material-symbols-outlined text-[12px]">update</span>
                                                    {isAr ? 'مسموح بالتمديد فقط' : 'Extending only'}
                                                </span>
                                            ) : null}
                                        </div>

                                        <input
                                            className={`form-input focus:!border-[#FF4D2E] focus:!ring-2 focus:!ring-[#FF4D2E]/20 ${
                                                endDateError ? '!border-red-500 !ring-1 !ring-red-500' : ''
                                            } ${isEnded ? '!bg-surface-container/60 cursor-not-allowed opacity-80' : ''}`}
                                            id="ev-end"
                                            name="endDate"
                                            type="date"
                                            disabled={isEnded}
                                            readOnly={isEnded}
                                            min={hasApplicantLocks && originalEndDate ? originalEndDate : (formData.startDate || '')}
                                            value={formData.endDate}
                                            onChange={e => handleInputChange('endDate', e.target.value)}
                                            required
                                        />

                                        {endDateError ? (
                                            <p className="text-[11px] text-red-600 dark:text-red-400 font-bold flex items-center gap-1 mt-1">
                                                <span className="material-symbols-outlined text-[14px]">error</span>
                                                {endDateError}
                                            </p>
                                        ) : hasApplicantLocks && originalEndDate ? (
                                            <p className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-1">
                                                <span className="material-symbols-outlined text-[14px] text-emerald-600 dark:text-emerald-400">info</span>
                                                {isAr
                                                    ? `الموعد الأصلي: ${originalEndDate} — يمكنك تمديد الموعد النهائي لمنح المتسابقين وقتاً إضافياً، ويُمنع تقصيره.`
                                                    : `Original date: ${originalEndDate} — You can extend the deadline, shortening is not allowed.`}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="form-group">
                                    <label className="form-label" htmlFor="ev-desc">
                                        {isAr ? 'الوصف ومخرجات الفعالية' : 'Description & Outcomes'} <span className="text-[#FF4D2E]">*</span>
                                    </label>
                                    <textarea
                                        className={`form-textarea focus:!border-[#FF4D2E] focus:!ring-2 focus:!ring-[#FF4D2E]/20 ${
                                            isEnded ? '!bg-surface-container/60 cursor-not-allowed opacity-80' : ''
                                        }`}
                                        id="ev-desc"
                                        name="description"
                                        rows={4}
                                        disabled={isEnded}
                                        readOnly={isEnded}
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
                                        className={`form-textarea focus:!border-[#FF4D2E] focus:!ring-2 focus:!ring-[#FF4D2E]/20 ${
                                            isEnded ? '!bg-surface-container/60 cursor-not-allowed opacity-80' : ''
                                        }`}
                                        id="ev-cond"
                                        name="requirements"
                                        rows={3}
                                        disabled={isEnded}
                                        readOnly={isEnded}
                                        value={formData.requirements}
                                        onChange={e => handleInputChange('requirements', e.target.value)}
                                        placeholder={isAr ? 'المهارات المطلوبة، الأجهزة والبرمجيات، شروط التأهل...' : 'Eligibility, required skills, tools, hardware...'}
                                    />
                                </div>

                                {/* ========================================================
                                    قسم المسابقات الخاص (COMPETITION ONLY SECTION)
                                   ======================================================== */}
                                {isComp && (
                                    <div className="flex flex-col gap-6">
                                        {/* حقل الجائزة */}
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
                                                className={`form-input focus:!border-[#FF4D2E] focus:!ring-2 focus:!ring-[#FF4D2E]/20 ${
                                                    isEnded ? '!bg-surface-container/60 cursor-not-allowed opacity-80' : ''
                                                }`}
                                                id="ev-prize"
                                                name="prize"
                                                type="text"
                                                disabled={isEnded}
                                                readOnly={isEnded}
                                                value={formData.prize}
                                                onChange={e => handleInputChange('prize', e.target.value)}
                                                placeholder={isAr ? 'مثال: 50,000 ريال جوائز نقدية + فرص احتضان' : 'e.g. $10,000 Prize Pool + Mentorship'}
                                            />
                                        </div>

                                        {/* كرت إعدادات نوع المشاركة */}
                                        <div className="rounded-2xl border-2 border-[#FF4D2E]/30 bg-[#FF4D2E]/[0.03] dark:bg-[#FF4D2E]/[0.05] p-5 md:p-6 space-y-6 transition-all duration-300">
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

                                                <div className="flex items-center gap-2">
                                                    {isFieldLocked('participationType') && (
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                                                            <span className="material-symbols-outlined text-[13px]">lock</span>
                                                            {isEnded ? (isAr ? 'للقراءة فقط' : 'Read Only') : (isAr ? 'مقفل لوجود متقدمين' : 'Locked (has applicants)')}
                                                        </span>
                                                    )}
                                                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FF4D2E] text-white uppercase tracking-wider">
                                                        {isAr ? 'مسابقات فقط' : 'Competition'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* اختيار نوع المشاركة */}
                                            <div className="form-group space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <label className="form-label flex items-center gap-1.5 font-semibold text-sm">
                                                        <span className="material-symbols-outlined text-[#FF4D2E] text-[18px]">how_to_reg</span>
                                                        {isAr ? 'نوع المشاركة' : 'Participation Type'} <span className="text-[#FF4D2E]">*</span>
                                                    </label>
                                                    <span className="text-xs font-mono font-bold text-[#FF4D2E] bg-[#FF4D2E]/10 px-2 py-0.5 rounded">
                                                        {isAr 
                                                            ? (formData.participationType === 'Solo Only' ? 'مشاركة فردية' : formData.participationType === 'Team Only' ? 'مشاركة فرق' : 'فردي وفريق')
                                                            : formData.participationType}
                                                    </span>
                                                </div>

                                                <p className="text-xs text-on-surface-variant leading-relaxed">
                                                    {isAr
                                                        ? 'طريقة انضمام المتنافسين إلى المسابقة (فردياً فقط، كفريق فقط، أو السماح بكلا الخيارين).'
                                                        : 'Determine whether participants must compete individually, in teams, or if both options are welcome.'}
                                                </p>

                                                {/* بطاقات الخيارات الثلاثة */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                                                    {PARTICIPATION_OPTIONS.map((opt) => {
                                                        const isSelected = formData.participationType === opt.value
                                                        const locked = isFieldLocked('participationType')

                                                        return (
                                                            <button
                                                                key={opt.value}
                                                                type="button"
                                                                disabled={locked}
                                                                onClick={() => handleParticipationSelect(opt.value)}
                                                                className={`relative flex flex-col p-4 rounded-xl border text-start transition-all duration-200 ${
                                                                    locked
                                                                        ? isSelected
                                                                            ? 'border-amber-500/60 bg-amber-500/10 shadow-sm cursor-not-allowed opacity-90'
                                                                            : 'border-outline-variant/40 bg-surface-container/40 opacity-40 cursor-not-allowed'
                                                                        : isSelected
                                                                        ? 'border-[#FF4D2E] bg-[#FF4D2E]/10 dark:bg-[#FF4D2E]/15 shadow-sm ring-2 ring-[#FF4D2E]/30 cursor-pointer'
                                                                        : 'border-outline-variant/60 bg-surface dark:bg-[#16181c] hover:border-[#FF4D2E]/50 hover:bg-surface-container cursor-pointer'
                                                                }`}
                                                            >
                                                                <div className="flex items-center justify-between w-full mb-2">
                                                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                                                                        isSelected
                                                                            ? (locked ? 'bg-amber-500 text-white' : 'bg-[#FF4D2E] text-white shadow-sm shadow-[#FF4D2E]/30')
                                                                            : 'bg-surface-container-high text-on-surface-variant'
                                                                    }`}>
                                                                        <span className="material-symbols-outlined text-[20px]">{opt.icon}</span>
                                                                    </div>

                                                                    <span className={`material-symbols-outlined text-[22px] transition-colors ${
                                                                        isSelected
                                                                            ? (locked ? 'text-amber-600 dark:text-amber-400' : 'text-[#FF4D2E]')
                                                                            : 'text-outline/40'
                                                                    }`}>
                                                                        {locked && isSelected ? 'lock' : isSelected ? 'check_circle' : 'radio_button_unchecked'}
                                                                    </span>
                                                                </div>

                                                                <span className="font-bold text-sm text-on-surface">
                                                                    {isAr ? opt.titleAr : opt.titleEn}
                                                                </span>
                                                                <span className="text-[11px] font-semibold text-[#FF4D2E] mt-0.5">
                                                                    {isAr ? opt.badgeAr : opt.badgeEn}
                                                                </span>
                                                                <span className="text-[11px] text-on-surface-variant mt-1.5 leading-snug">
                                                                    {isAr ? opt.subAr : opt.subEn}
                                                                </span>
                                                            </button>
                                                        )
                                                    })}
                                                </div>

                                                {hasApplicantLocks && isComp && (
                                                    <p className="text-[11px] text-amber-700 dark:text-amber-400 flex items-center gap-1 mt-2 font-medium">
                                                        <span className="material-symbols-outlined text-[14px]">lock</span>
                                                        {isAr
                                                            ? `لا يمكن تغيير نوع المشاركة لوجود فرق ومتسابقين مسجلين بالفعل (${applicantsCount} متقدم).`
                                                            : `Participation type is locked because contenders have already registered (${applicantsCount} applicants).`}
                                                    </p>
                                                )}
                                            </div>

                                            {/* حقول حجم الفريق */}
                                            {(formData.participationType === 'Team Only' || formData.participationType === 'Both / Solo & Team') && (
                                                <div className="rounded-xl border border-outline-variant/50 bg-surface dark:bg-[#16181c] p-4 md:p-5 space-y-4 animate-[fadeIn_0.25s_ease-out]">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="material-symbols-outlined text-[#FF4D2E] text-[20px]">group</span>
                                                            <div>
                                                                <h4 className="font-bold text-xs uppercase tracking-wider text-on-surface">
                                                                    {isAr ? 'تحديد سعة وحجم الفريق' : 'Team Size Boundaries'}
                                                                </h4>
                                                                <p className="text-[11px] text-on-surface-variant">
                                                                    {isAr
                                                                        ? 'الحد الأدنى والأقصى المسموح به لأعضاء كل فريق مسجل'
                                                                        : 'Define the allowed participant count range per registered team'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {isFieldLocked('minTeamSize') && (
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                                                                <span className="material-symbols-outlined text-[12px]">lock</span>
                                                                {isEnded ? (isAr ? 'للقراءة فقط' : 'Read Only') : (isAr ? 'مقيد' : 'Locked')}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {/* الحد الأدنى لأعضاء الفريق */}
                                                        <div className="form-group">
                                                            <label className="form-label text-xs" htmlFor="ev-minTeamSize">
                                                                {isAr ? 'الحد الأدنى لأعضاء الفريق' : 'Minimum Team Members'} <span className="text-[#FF4D2E]">*</span>
                                                            </label>
                                                            <div className="relative">
                                                                <span className="material-symbols-outlined absolute top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none left-3 rtl:left-auto rtl:right-3">
                                                                    {isFieldLocked('minTeamSize') ? 'lock' : 'group'}
                                                                </span>
                                                                <input
                                                                    className={`form-input !pl-11 rtl:!pr-11 rtl:!pl-4 focus:!border-[#FF4D2E] focus:!ring-2 focus:!ring-[#FF4D2E]/20 ${
                                                                        isFieldLocked('minTeamSize')
                                                                            ? '!bg-surface-container/60 !border-dashed cursor-not-allowed opacity-80 select-none !px-10'
                                                                            : ''
                                                                    }`}
                                                                    id="ev-minTeamSize"
                                                                    name="minTeamSize"
                                                                    type="text"
                                                                    inputMode="numeric"
                                                                    disabled={isFieldLocked('minTeamSize')}
                                                                    readOnly={isFieldLocked('minTeamSize')}
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
                                                                    {isFieldLocked('maxTeamSize') ? 'lock' : 'person_add'}
                                                                </span>
                                                                <input
                                                                    className={`form-input !pl-11 rtl:!pr-11 rtl:!pl-4 focus:!border-[#FF4D2E] focus:!ring-2 focus:!ring-[#FF4D2E]/20 ${
                                                                        isFieldLocked('maxTeamSize')
                                                                            ? '!bg-surface-container/60 !border-dashed cursor-not-allowed opacity-80 select-none !px-10'
                                                                            : ''
                                                                    }`}
                                                                    id="ev-maxTeamSize"
                                                                    name="maxTeamSize"
                                                                    type="text"
                                                                    inputMode="numeric"
                                                                    disabled={isFieldLocked('maxTeamSize')}
                                                                    readOnly={isFieldLocked('maxTeamSize')}
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
                                                            {hasApplicantLocks && (
                                                                <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">
                                                                    {isAr
                                                                        ? '🔒 حدود حجم الفريق معطلة ومحمية لمنع حدوث أي تعارض مع الفرق التي سجلت مسبقاً.'
                                                                        : '🔒 Team boundaries are locked to prevent conflicts with teams already registered.'}
                                                                </p>
                                                            )}
                                                            {formData.participationType === 'Both / Solo & Team' && !hasApplicantLocks && (
                                                                <p className="text-[10px] text-on-surface-variant/80">
                                                                    {isAr
                                                                        ? '💡 التسجيل الفردي متاح تلقائياً، وهذا النطاق يحدد حجم الفرق المسجلة فقط.'
                                                                        : '💡 Solo participation is allowed automatically; this range applies to teams only.'}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* تنبيه عند اختيار Solo Only */}
                                            {formData.participationType === 'Solo Only' && (
                                                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/15 p-4 flex items-start gap-3 animate-[fadeIn_0.25s_ease-out]">
                                                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[20px] flex-shrink-0 mt-0.5">
                                                        person
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
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="form-label mb-0" htmlFor="ev-cover">
                                            {isAr ? 'صورة الغلاف' : 'Cover Image'}
                                        </label>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                            isEnded ? 'text-slate-500 bg-slate-500/10' : 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                                        }`}>
                                            {isEnded ? (isAr ? 'للعرض فقط' : 'Read Only') : (isAr ? 'مسموح بتعديله' : 'Freely editable')}
                                        </span>
                                    </div>
                                    <label className={`upload-dropzone ${isEnded ? 'cursor-not-allowed opacity-80' : 'hover:border-[#FF4D2E]'}`} htmlFor="ev-cover">
                                        <span className="upload-dropzone__icon !text-[#FF4D2E] !bg-[#FF4D2E]/10">
                                            <span className="material-symbols-outlined">{isEnded ? 'image' : 'upload'}</span>
                                        </span>
                                        <p className="upload-dropzone__label" id="ev-cover-label">
                                            {coverName ?? (isAr ? 'اسحب الصورة هنا أو اضغط للاختيار' : 'Drag and drop, or click to upload cover image')}
                                        </p>
                                        <span className="upload-dropzone__hint">{isAr ? 'PNG أو JPG أو JPEG (بحد أقصى 5 ميجابايت)' : 'PNG, JPG or JPEG (max. 5MB)'}</span>
                                    </label>
                                    <input
                                        accept="image/*"
                                        className="sr-only"
                                        id="ev-cover"
                                        name="cover"
                                        type="file"
                                        disabled={isEnded}
                                        onChange={e => {
                                            if (isEnded) return
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
                                        {isEnded
                                            ? (isAr ? 'ملخص ومراجعة بيانات الفعالية المؤرشفة' : 'Archived Event Summary')
                                            : isEditMode
                                            ? (isAr ? 'مراجعة التعديلات قبل الحفظ النهائي' : 'Review changes before saving')
                                            : (isAr ? 'مراجعة وتأكيد بيانات الفعالية' : 'Review your event details')}
                                    </h3>
                                    <p className="text-sm text-on-surface-variant">
                                        {isEnded
                                            ? (isAr ? 'عرض تفاصيل الفعالية المسجلة والمؤرشفة في النظام.' : 'Viewing event record details for reporting.')
                                            : (isAr ? 'تأكد من صحة التعديلات قبل اعتماد التحديثات رسمياً.' : 'Check the details below before saving.')}
                                    </p>
                                </div>

                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4" id="wizard-review">
                                    {/* Event Title */}
                                    <div className="review-card">
                                        <dt className="review-label flex items-center justify-between">
                                            <span>{isAr ? 'عنوان الفعالية' : 'Event Title'}</span>
                                            {isFieldLocked('title') && (
                                                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-0.5">
                                                    <span className="material-symbols-outlined text-[12px]">lock</span>
                                                    {isEnded ? (isAr ? 'مؤرشف' : 'Archived') : (isAr ? 'مقيد' : 'Locked')}
                                                </span>
                                            )}
                                        </dt>
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
                                    <div className="review-card col-span-1 md:col-span-2">
                                        <dt className="review-label">{isAr ? 'الفترة الزمنية' : 'Schedule'}</dt>
                                        <dd className="review-value font-mono text-xs">
                                            {reviewData.startDate} → {reviewData.endDate}
                                        </dd>
                                    </div>

                                    {/* Competition-specific details in Review */}
                                    {isComp && (
                                        <>
                                            <div className="review-card border-[#FF4D2E]/30 bg-[#FF4D2E]/[0.02]">
                                                <dt className="review-label text-[#FF4D2E] flex items-center justify-between">
                                                    <span>{isAr ? 'نوع المشاركة' : 'Participation Type'}</span>
                                                    {isFieldLocked('participationType') && (
                                                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-0.5">
                                                            <span className="material-symbols-outlined text-[12px]">lock</span>
                                                            {isEnded ? (isAr ? 'مؤرشف' : 'Archived') : (isAr ? 'مقيد' : 'Locked')}
                                                        </span>
                                                    )}
                                                </dt>
                                                <dd className="review-value">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FF4D2E] text-white">
                                                        <span className="material-symbols-outlined text-[15px]">
                                                            {reviewData.participationType === 'Solo Only' ? 'person' : reviewData.participationType === 'Team Only' ? 'groups' : 'join_inner'}
                                                        </span>
                                                        {isAr 
                                                            ? (reviewData.participationType === 'Solo Only' ? 'مشاركة فردية فقط' : reviewData.participationType === 'Team Only' ? 'مشاركة فرق فقط' : 'للأفراد والفرق معاً')
                                                            : (reviewData.participationType || 'Both / Solo & Team')}
                                                    </span>
                                                </dd>
                                            </div>

                                            {reviewData.participationType !== 'Solo Only' ? (
                                                <div className="review-card border-[#FF4D2E]/30 bg-[#FF4D2E]/[0.02]">
                                                    <dt className="review-label text-[#FF4D2E] flex items-center justify-between">
                                                        <span>{isAr ? 'سعة الفريق' : 'Team Size Boundaries'}</span>
                                                        {isFieldLocked('minTeamSize') && (
                                                            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-0.5">
                                                                <span className="material-symbols-outlined text-[12px]">lock</span>
                                                                {isEnded ? (isAr ? 'مؤرشف' : 'Archived') : (isAr ? 'مقيد' : 'Locked')}
                                                            </span>
                                                        )}
                                                    </dt>
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
                                        <dt className="review-label">{isAr ? 'الوصف ومخرجات الفعالية' : 'Description & Outcomes'}</dt>
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

                            {/* STEP 3: Publish / Save Confirmation */}
                            <section className={step === 3 ? 'flex flex-col items-center gap-3 py-6 text-center fade-in' : 'hidden'}>
                                <div className="publish-success-card">
                                    <div className="publish-icon animate-[bounce_0.6s_ease-out]">
                                        <span className="material-symbols-outlined text-[36px]">
                                            {isEnded ? 'archive' : isEditMode ? 'published_with_changes' : 'task_alt'}
                                        </span>
                                    </div>
                                    <h3 className="font-headline-lg text-title-lg text-on-surface">
                                        {isEnded
                                            ? (isAr ? 'الفعالية منتهية ومؤرشفة' : 'Event Concluded & Archived')
                                            : isRejected
                                            ? (isAr ? 'جاهز لإعادة الإرسال للمراجعة' : 'Ready to Resubmit for Review')
                                            : isEditMode
                                            ? (isAr ? 'جاهز لحفظ التعديلات' : 'Ready to Save Updates')
                                            : (isAr ? 'جاهز للإرسال والمراجعة' : 'Ready to Submit for Approval')}
                                    </h3>
                                    <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
                                        {isEnded
                                            ? (isAr
                                                ? 'هذه الفعالية مكتملة في سجلات النظام. يمكنك الرجوع لمركز التقارير للاطلاع على الإحصائيات الشاملة.'
                                                : 'This event has concluded. Head to Report Center for complete participant metrics.')
                                            : isRejected
                                            ? (isAr
                                                ? 'ستُحفظ التصحيحات وتعود الفعالية لفريق EVENTIFY لمراجعتها من جديد، وتصبح حالتها "معلق" حتى يصدر القرار.'
                                                : 'Your fixes will be saved and the event goes back to the EVENTIFY review team. Its status will be "Pending" until they decide.')
                                            : isPending
                                            ? (isAr
                                                ? 'ستُحفظ التعديلات وتبقى الفعالية بانتظار اعتماد فريق EVENTIFY، ولن تظهر للمشاركين قبل الاعتماد.'
                                                : 'Your changes will be saved. The event stays pending EVENTIFY approval and is not visible to participants yet.')
                                            : isEditMode
                                            ? (isAr
                                                ? 'سيتم تحديث تفاصيل الفعالية وتطبيق التغييرات مباشرة للمنظمة والمشاركين.'
                                                : 'Your changes will be saved and applied directly to the event.')
                                            : (isAr
                                                ? 'سيتم إرسال الفعالية وإعدادات المشاركة المحددة إلى مسؤولي منصة EVENTIFY لمراجعتها واعتماد ظهورها لجميع المشاركين.'
                                                : 'Publishing sends the event to the EVENTIFY review team. You will receive a notification once it is approved and live for participants.')}
                                    </p>
                                </div>
                            </section>

                            {/* Action Bar */}
                            <div className="wizard-actions flex items-center justify-between pt-6 border-t border-outline-variant/30 flex-wrap gap-3">
                                <Link className="wizard-cancel-link hover:text-[#FF4D2E]" to="/org/opportunities">
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

                                    {!isEditMode && !isEnded && (
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
                                    )}

                                    {step < 3 && (
                                        <button
                                            className="btn-primary !bg-[#FF4D2E] hover:!bg-[#e23b1c] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-[#FF4D2E]/25 transition-all min-w-[120px]"
                                            id="wizard-next"
                                            type="button"
                                            onClick={handleNext}
                                        >
                                            {step === 2
                                                ? (isEnded ? (isAr ? 'متابعة إلى الملخص' : 'Continue to summary') : isEditMode ? (isAr ? 'متابعة وتأكيد الحفظ' : 'Continue to save') : (isAr ? 'متابعة إلى النشر' : 'Continue to publish'))
                                                : (isAr ? 'التالي' : 'Next')}
                                        </button>
                                    )}

                                    {step === 3 && (
                                        isEnded ? (
                                            <button
                                                className="btn-secondary opacity-60 cursor-not-allowed px-6 py-2.5 rounded-xl font-bold text-sm"
                                                type="button"
                                                disabled
                                            >
                                                {isAr ? 'الفعالية منتهية (عرض فقط)' : 'Ended (View Only)'}
                                            </button>
                                        ) : (
                                            <button
                                                className="btn-primary !bg-[#FF4D2E] hover:!bg-[#e23b1c] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-[#FF4D2E]/25 transition-all min-w-[140px] disabled:opacity-50"
                                                id="wizard-publish"
                                                type="button"
                                                disabled={publishing}
                                                onClick={handlePublish}
                                            >
                                                {publishing
                                                    ? (isAr ? 'جارِ الحفظ...' : 'Saving...')
                                                    : (isRejected
                                                        ? (isAr ? 'حفظ وإعادة الإرسال للمراجعة' : 'Save & Resubmit for Review')
                                                        : isEditMode
                                                        ? (isAr ? 'حفظ وتحديث الفعالية' : 'Save & Update Event')
                                                        : (isAr ? 'إرسال للاعتماد' : 'Publish Event'))}
                                            </button>
                                        )
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
