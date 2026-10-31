// بيانات فرص المنظمة المشتركة بين صفحة الفرص وصفحة المتقدمين ومركز التقارير
import { resolveOpportunityStatus } from '../../utils/opportunityStatus'

const INITIAL_OPPORTUNITIES = [
    {
        id: 'evt-7',
        name: 'Smart Cities Hackathon',
        nameAr: 'هاكاثون المدن الذكية',
        meta: 'Hackathon · In-person · Amman',
        metaAr: 'هاكاثون · حضوري · عمّان',
        status: 'live',
        startDate: '2026-10-25',
        endDate: '2026-11-20',
        deadline: 'Nov 20, 2026',
        applicants: 36,
        primaryAction: 'applicants'
    },
    { 
        id: 'evt-1', 
        name: 'Global AI Innovation Challenge', 
        nameAr: 'تحدي الابتكار العالمي للذكاء الاصطناعي',
        meta: 'Hackathon · Remote · Teams of 2-4', 
        metaAr: 'هاكاثون · عن بعد · فرق من 2-4',
        status: 'live',     
        startDate: '2026-10-15',
        endDate: '2026-11-15',
        deadline: 'Nov 15, 2026',
        applicants: 98,
        primaryAction: 'applicants' 
    },
    { 
        id: 'evt-3', 
        name: 'Startup Challenge',              
        nameAr: 'تحدي الشركات الناشئة',
        meta: 'Competition · Entrepreneurship',         
        metaAr: 'مسابقة · ريادة أعمال',
        status: 'upcoming', 
        startDate: '2026-11-20',
        endDate: '2026-11-25',
        deadline: 'Nov 25, 2026',
        applicants: 84,  
        primaryAction: 'applicants' 
    },
    { 
        id: 'evt-4', 
        name: 'DevOps Masterclass',             
        nameAr: 'دورة ديف أوبس الاحترافية',
        meta: 'Workshop · Online · Cloud Engineering',  
        metaAr: 'ورشة عمل · عبر الإنترنت · هندسة السحابة',
        status: 'pending',  
        startDate: '2026-11-01',
        endDate: '2026-11-03',
        deadline: 'Nov 3, 2026',
        applicants: 0,  
        primaryAction: 'edit' 
    },
    { 
        id: 'evt-2', 
        name: 'Frontend Wizards',               
        nameAr: 'معالجو الواجهة الأمامية',
        meta: 'Hackathon · Web Development',            
        metaAr: 'هاكاثون · تطوير الويب',
        status: 'ended',    
        startDate: '2026-09-01',
        endDate: '2026-09-15',
        deadline: 'Closed',
        applicants: 150,
        primaryAction: 'report' 
    },
    { 
        id: 'evt-5', 
        name: 'Cloud Native Bootcamp',          
        nameAr: 'معسكر التقنيات السحابية',
        meta: 'Course · Infrastructure',                
        metaAr: 'دورة تدريبية · بنية تحتية',
        status: 'ended',    
        startDate: '2026-08-10',
        endDate: '2026-08-25',
        deadline: 'Closed',
        applicants: 42,
        primaryAction: 'report' 
    },
    { 
        id: 'evt-6', 
        name: 'Cybersecurity Defense Challenge',          
        nameAr: 'تحدي الدفاع السيبراني المتقدم',
        meta: 'Competition · In-person · Riyadh',                
        metaAr: 'مسابقة · حضورية · الرياض',
        status: 'rejected', 
        rejectionReason: 'Event agenda is missing the certified cybersecurity accreditation and detailed venue safety plan. Please attach the required approvals.',
        rejectionReasonAr: 'أجندة الفعالية تفتقر إلى الاعتماد الأكاديمي المطلوب وخطة السلامة للمقر الحضوري. يرجى إرفاق الموافقات اللازمة.',
        startDate: '2026-12-10',
        endDate: '2026-12-15',
        deadline: 'Dec 15, 2026',
        applicants: 0,  
        primaryAction: 'resubmit'
    },
    {
        id: 'evt-8',
        name: 'Mobile Apps Workshop',
        nameAr: 'ورشة تطوير تطبيقات الجوال',
        meta: 'Workshop · Online · Flutter',
        metaAr: 'ورشة عمل · عبر الإنترنت · فلاتر',
        status: 'rejected',
        rejectionReason: 'The workshop description is too brief and the requirements are too vague. Please add a detailed agenda and clear participant requirements.',
        rejectionReasonAr: 'وصف الورشة مختصر جداً والمتطلبات غير واضحة. يرجى إضافة جدول تفصيلي للورشة ومتطلبات واضحة للمشاركين.',
        startDate: '2026-12-01',
        endDate: '2026-12-03',
        deadline: 'Dec 3, 2026',
        applicants: 0,
        primaryAction: 'resubmit' 
    },
]

const KNOWN_EVENT_NAMES = {
    'evt-1': { en: 'Global AI Innovation Challenge', ar: 'تحدي الابتكار العالمي للذكاء الاصطناعي' },
    'evt-2': { en: 'Frontend Wizards', ar: 'معالجو الواجهة الأمامية' },
    'evt-3': { en: 'Startup Challenge', ar: 'تحدي الشركات الناشئة' },
    'evt-4': { en: 'DevOps Masterclass', ar: 'دورة ديف أوبس الاحترافية' },
    'evt-5': { en: 'Cloud Native Bootcamp', ar: 'معسكر التقنيات السحابية' },
    'evt-6': { en: 'Cybersecurity Defense Challenge', ar: 'تحدي الدفاع السيبراني المتقدم' },
    'evt-7': { en: 'Smart Cities Hackathon', ar: 'هاكاثون المدن الذكية' },
    'evt-8': { en: 'Mobile Apps Workshop', ar: 'ورشة تطوير تطبيقات الجوال' },
}

const KNOWN_EVENT_METAS = {
    'evt-1': { en: 'Hackathon · Remote · Teams of 2-4', ar: 'هاكاثون · عن بعد · فرق من 2-4' },
    'evt-2': { en: 'Hackathon · Web Development', ar: 'هاكاثون · تطوير الويب' },
    'evt-3': { en: 'Competition · Entrepreneurship', ar: 'مسابقة · ريادة أعمال' },
    'evt-4': { en: 'Workshop · Online · Cloud Engineering', ar: 'ورشة عمل · عبر الإنترنت · هندسة السحابة' },
    'evt-5': { en: 'Course · Infrastructure', ar: 'دورة تدريبية · بنية تحتية' },
    'evt-6': { en: 'Competition · In-person · Riyadh', ar: 'مسابقة · حضورية · الرياض' },
    'evt-7': { en: 'Hackathon · In-person · Amman', ar: 'هاكاثون · حضوري · عمّان' },
    'evt-8': { en: 'Workshop · Online · Flutter', ar: 'ورشة عمل · عبر الإنترنت · فلاتر' },
}

export const ARABIC_TO_ENGLISH_TERMS = {
    'مسابقة': 'Competition',
    'مسابقات': 'Competitions',
    'فعالية': 'Event',
    'فعاليات': 'Events',
    'ورشة عمل': 'Workshop',
    'ورش عمل': 'Workshops',
    'دورة': 'Course',
    'دورة تدريبية': 'Training Course',
    'دورات': 'Courses',
    'هاكاثون': 'Hackathon',
    'تحدي': 'Challenge',
    'عن بعد': 'Remote',
    'حضورية': 'In-person',
    'حضوري': 'In-person',
    'عبر الإنترنت': 'Online',
    'الرياض': 'Riyadh',
    'فرصة جديدة': 'New Opportunity',
    'مسابقة جديدة': 'New Competition',
    'تحدي الشركات الناشئة': 'Startup Challenge',
    'تحدي الدفاع السيبراني المتقدم': 'Cybersecurity Defense Challenge',
    'تحدي الابتكار العالمي للذكاء الاصطناعي': 'Global AI Innovation Challenge',
    'معالجو الواجهة الأمامية': 'Frontend Wizards',
    'دورة ديف أوبس الاحترافية': 'DevOps Masterclass',
    'معسكر التقنيات السحابية': 'Cloud Native Bootcamp',
    'ريادة أعمال': 'Entrepreneurship',
    'هندسة السحابة': 'Cloud Engineering',
    'تطوير الويب': 'Web Development',
    'بنية تحتية': 'Infrastructure',
}

const ENGLISH_TO_ARABIC_TERMS = Object.fromEntries(
    Object.entries(ARABIC_TO_ENGLISH_TERMS).map(([ar, en]) => [en.toLowerCase(), ar])
)

export function translateArabicStringToEnglish(str) {
    if (!str || typeof str !== 'string') return ''
    const trimmed = str.trim()
    if (ARABIC_TO_ENGLISH_TERMS[trimmed]) {
        return ARABIC_TO_ENGLISH_TERMS[trimmed]
    }
    // Handle separator patterns like "مسابقة · عن بعد" or "مسابقة · ريادة أعمال"
    if (trimmed.includes('·')) {
        return trimmed
            .split('·')
            .map(part => {
                const p = part.trim()
                return ARABIC_TO_ENGLISH_TERMS[p] || translateArabicStringToEnglish(p) || p
            })
            .join(' · ')
    }
    for (const [ar, en] of Object.entries(ARABIC_TO_ENGLISH_TERMS)) {
        if (trimmed === ar) return en
    }
    let converted = trimmed
    for (const [ar, en] of Object.entries(ARABIC_TO_ENGLISH_TERMS)) {
        converted = converted.replaceAll(ar, en)
    }
    if (/[\u0600-\u06FF]/.test(converted)) {
        return 'Opportunity'
    }
    return converted.trim()
}

export function translateEnglishStringToArabic(str) {
    if (!str || typeof str !== 'string') return ''
    const trimmed = str.trim()
    const lower = trimmed.toLowerCase()
    if (ENGLISH_TO_ARABIC_TERMS[lower]) {
        return ENGLISH_TO_ARABIC_TERMS[lower]
    }
    if (trimmed.includes('·')) {
        return trimmed
            .split('·')
            .map(part => {
                const p = part.trim()
                return ENGLISH_TO_ARABIC_TERMS[p.toLowerCase()] || p
            })
            .join(' · ')
    }
    if (lower === 'opportunity' || lower === 'new opportunity') return 'فرصة جديدة'
    if (lower === 'competition' || lower === 'new competition') return 'مسابقة جديدة'
    if (lower === 'event') return 'فعالية'
    if (lower === 'workshop') return 'ورشة عمل'
    if (lower === 'course') return 'دورة تدريبية'
    return trimmed
}

export function formatMetaCategory(category, isRtl) {
    if (!category) return isRtl ? 'فعالية' : 'Event'
    const cat = String(category).trim().toLowerCase()
    if (cat === 'competition' || cat === 'مسابقة' || cat === 'مسابقات') return isRtl ? 'مسابقة' : 'Competition'
    if (cat === 'event' || cat === 'فعالية' || cat === 'فعاليات') return isRtl ? 'فعالية' : 'Event'
    if (cat === 'workshop' || cat === 'ورشة عمل' || cat === 'ورش عمل') return isRtl ? 'ورشة عمل' : 'Workshop'
    if (cat === 'course' || cat === 'دورة' || cat === 'دورة تدريبية' || cat === 'دورات') return isRtl ? 'دورة' : 'Course'
    if (cat === 'hackathon' || cat === 'هاكاثون') return isRtl ? 'هاكاثون' : 'Hackathon'
    return category
}

export function formatDeadline(deadline, isRtl) {
    if (!deadline) return isRtl ? 'غير محدد' : 'TBD'
    const trimmed = String(deadline).trim()
    if (trimmed.toLowerCase() === 'closed') return isRtl ? 'مغلق' : 'Closed'
    if (trimmed.toLowerCase() === 'upcoming') return isRtl ? 'قادم' : 'Upcoming'
    if (trimmed.toLowerCase() === 'tbd') return isRtl ? 'يحدد لاحقاً' : 'TBD'

    if (isRtl) {
        return trimmed
            .replace(/Jan\w*/i, 'يناير')
            .replace(/Feb\w*/i, 'فبراير')
            .replace(/Mar\w*/i, 'مارس')
            .replace(/Apr\w*/i, 'أبريل')
            .replace(/May/i, 'مايو')
            .replace(/Jun\w*/i, 'يونيو')
            .replace(/Jul\w*/i, 'يوليو')
            .replace(/Aug\w*/i, 'أغسطس')
            .replace(/Sep\w*/i, 'سبتمبر')
            .replace(/Oct\w*/i, 'أكتوبر')
            .replace(/Nov\w*/i, 'نوفمبر')
            .replace(/Dec\w*/i, 'ديسمبر')
    } else {
        return trimmed
            .replace(/يناير/g, 'Jan')
            .replace(/فبراير/g, 'Feb')
            .replace(/مارس/g, 'Mar')
            .replace(/أبريل/g, 'Apr')
            .replace(/مايو/g, 'May')
            .replace(/يونيو/g, 'Jun')
            .replace(/يوليو/g, 'Jul')
            .replace(/أغسطس/g, 'Aug')
            .replace(/سبتمبر/g, 'Sep')
            .replace(/أكتوبر/g, 'Oct')
            .replace(/نوفمبر/g, 'Nov')
            .replace(/ديسمبر/g, 'Dec')
            .replace(/مغلق/g, 'Closed')
            .replace(/قادم/g, 'Upcoming')
    }
}

export function getDisplayName(opp, isRtl) {
    if (!opp) return ''
    const known = KNOWN_EVENT_NAMES[opp.id] || null

    if (isRtl) {
        // Arabic Mode: Return Arabic name
        if (opp.titleAr && /[\u0600-\u06FF]/.test(opp.titleAr)) return opp.titleAr
        if (opp.nameAr && /[\u0600-\u06FF]/.test(opp.nameAr)) return opp.nameAr
        if (opp.title && /[\u0600-\u06FF]/.test(opp.title)) return opp.title
        if (opp.name && /[\u0600-\u06FF]/.test(opp.name)) return opp.name
        if (known?.ar) return known.ar
        const raw = opp.title || opp.name || ''
        return translateEnglishStringToArabic(raw) || 'فرصة جديدة'
    } else {
        // English Mode: MUST NEVER return Arabic!
        if (opp.titleEn && !/[\u0600-\u06FF]/.test(opp.titleEn)) return opp.titleEn
        if (opp.nameEn && !/[\u0600-\u06FF]/.test(opp.nameEn)) return opp.nameEn
        if (opp.title && !/[\u0600-\u06FF]/.test(opp.title)) return opp.title
        if (opp.name && !/[\u0600-\u06FF]/.test(opp.name)) return opp.name
        if (known?.en) return known.en
        const raw = opp.title || opp.name || opp.titleAr || opp.nameAr || ''
        return translateArabicStringToEnglish(raw) || 'Opportunity'
    }
}

export function getDisplayMeta(opp, isRtl) {
    if (!opp) return ''
    const known = KNOWN_EVENT_METAS[opp.id] || null

    if (isRtl) {
        if (opp.metaAr && /[\u0600-\u06FF]/.test(opp.metaAr)) return opp.metaAr
        if (known?.ar) return known.ar
        if (opp.meta && /[\u0600-\u06FF]/.test(opp.meta)) return opp.meta
        const raw = opp.meta || ''
        return translateEnglishStringToArabic(raw) || `${formatMetaCategory(opp.category, true)} · عن بعد`
    } else {
        if (opp.meta && !/[\u0600-\u06FF]/.test(opp.meta)) return opp.meta
        if (known?.en) return known.en
        const raw = opp.meta || opp.metaAr || ''
        return translateArabicStringToEnglish(raw) || `${formatMetaCategory(opp.category, false)} · Remote`
    }
}

export const STATUS_BADGE = {
    live:     { cls: 'badge badge--active',    label: 'Live',             labelAr: 'مباشر' },
    pending:  { cls: 'badge badge--pending',   label: 'Pending Approval', labelAr: 'معلق' },
    upcoming: { cls: 'badge badge--upcoming',  label: 'Upcoming',         labelAr: 'قادم' },
    ended:    { cls: 'badge badge--completed', label: 'Ended',            labelAr: 'منتهي' },
    rejected: { cls: 'badge badge--rejected',  label: 'Rejected',         labelAr: 'مرفوض' },
}

export const OPP_STORAGE_KEY = 'eventify:org-opportunities'
export const PUBLISHED_KEY = 'eventify:published-events'
export const DRAFT_KEY = 'eventify:event-draft'
// فرص البذور الثابتة (INITIAL_OPPORTUNITIES) ما إلها سجل بـlocalStorage أصلاً لحذفه، فنحتفظ
// بقائمة IDs محذوفة صراحةً ونستبعدها عند القراءة، بدل ما نحاول نحذف شي مش مخزّن هناك
const DELETED_KEY = 'eventify:deleted-opportunities'

export function isGibberish(text) {
    if (!text || typeof text !== 'string') return true
    const trimmed = text.trim()
    if (!trimmed) return true
    if (/^(erfgtrht|asdf|qwerty|test|aaaa|zzzz)$/i.test(trimmed)) return true
    return false
}

function sanitizeOrEnrichOpportunity(item) {
    if (!item) return item

    const rawTitle = (item.title || item.name || '').trim()
    const isGenericOrArabicTitle = rawTitle === 'مسابقة' || rawTitle === 'مسابقة جديدة' || rawTitle === 'Competition' || !rawTitle || isGibberish(rawTitle)
    
    const titleEn = isGenericOrArabicTitle 
        ? 'Tech Innovation Challenge' 
        : (item.titleEn || (!(/[\u0600-\u06FF]/.test(rawTitle)) ? rawTitle : translateArabicStringToEnglish(rawTitle)))

    const titleAr = isGenericOrArabicTitle
        ? 'مسابقة الابتكار التقني'
        : (item.titleAr || (/[\u0600-\u06FF]/.test(rawTitle) ? rawTitle : translateEnglishStringToArabic(rawTitle)))

    const rawLoc = (item.location || item.locationEn || item.locationAr || '').trim()
    const isBadLoc = isGibberish(rawLoc)

    const locationEn = isBadLoc 
        ? ''
        : (item.locationEn || (!(/[\u0600-\u06FF]/.test(rawLoc)) ? rawLoc : translateArabicStringToEnglish(rawLoc)))

    const locationAr = isBadLoc
        ? ''
        : (item.locationAr || (/[\u0600-\u06FF]/.test(rawLoc) ? rawLoc : translateEnglishStringToArabic(rawLoc)))

    return {
        ...item,
        titleEn,
        titleAr,
        name: titleEn,
        nameAr: titleAr,
        locationEn,
        locationAr,
        location: locationEn,
    }
}

// السطر المختصر تحت اسم الفرصة: التصنيف ثم المكان الذي كتبه المنظم (إن وُجد)
function buildMeta(category, location) {
    return [category, location].filter(Boolean).join(' · ')
}

export function loadAllOpportunities() {
    let list = [...INITIAL_OPPORTUNITIES]
    let deletedIds = []
    try {
        deletedIds = JSON.parse(localStorage.getItem(DELETED_KEY) || '[]')
    } catch { /* ignore */ }
    try {
        // قراءة الفعاليات المحدثة
        const storedOpps = JSON.parse(localStorage.getItem(OPP_STORAGE_KEY) || '[]')
        storedOpps.forEach(rawUpdated => {
            const updated = sanitizeOrEnrichOpportunity(rawUpdated)
            const idx = list.findIndex(o => o.id === updated.id)
            const known = KNOWN_EVENT_NAMES[updated.id]
            const titleHasArabic = /[\u0600-\u06FF]/.test(updated.title || updated.name || '')
            const nameEn = updated.titleEn || (!titleHasArabic && updated.title ? updated.title : '') || (updated.name && !/[\u0600-\u06FF]/.test(updated.name) ? updated.name : '') || known?.en || translateArabicStringToEnglish(updated.title || updated.name) || 'Opportunity'
            const nameAr = updated.titleAr || (titleHasArabic && updated.title ? updated.title : '') || (updated.nameAr && /[\u0600-\u06FF]/.test(updated.nameAr) ? updated.nameAr : '') || known?.ar || (updated.name && /[\u0600-\u06FF]/.test(updated.name) ? updated.name : '') || 'فرصة جديدة'
            const catEn = formatMetaCategory(updated.category, false)
            const catAr = formatMetaCategory(updated.category, true)

            if (idx >= 0) {
                list[idx] = { 
                    ...list[idx], 
                    ...updated,
                    titleEn: nameEn,
                    titleAr: nameAr,
                    name: nameEn,
                    nameAr: nameAr,
                    meta: buildMeta(catEn, updated.locationEn || list[idx].locationEn) || `${catEn} · Remote`,
                    metaAr: buildMeta(catAr, updated.locationAr || list[idx].locationAr) || `${catAr} · عن بعد`,
                    applicants: updated.applicantsCount ?? updated.applicants ?? list[idx].applicants,
                }
            } else {
                list.unshift({
                    id: updated.id,
                    titleEn: nameEn,
                    titleAr: nameAr,
                    name: nameEn,
                    nameAr: nameAr,
                    meta: updated.meta || buildMeta(catEn, updated.locationEn),
                    metaAr: updated.metaAr || buildMeta(catAr, updated.locationAr),
                    status: updated.status || 'pending',
                    startDate: updated.startDate,
                    endDate: updated.endDate,
                    rejectionReason: updated.rejectionReason,
                    rejectionReasonAr: updated.rejectionReasonAr,
                    deadline: updated.endDate || 'Upcoming',
                    applicants: updated.applicantsCount || 0,
                    primaryAction: updated.status === 'ended' ? 'report' : 'edit'
                })
            }
        })

        // قراءة الفعاليات المنشورة حديثاً
        const published = JSON.parse(localStorage.getItem(PUBLISHED_KEY) || '[]')
        published.forEach(rawPub => {
            const pub = sanitizeOrEnrichOpportunity(rawPub)
            const exists = list.some(o => o.id === pub.id)
            if (!exists) {
                const known = KNOWN_EVENT_NAMES[pub.id]
                const pubTitleHasArabic = /[\u0600-\u06FF]/.test(pub.title || pub.name || '')
                const pubNameEn = pub.titleEn || (!pubTitleHasArabic && pub.title ? pub.title : '') || (pub.name && !/[\u0600-\u06FF]/.test(pub.name) ? pub.name : '') || known?.en || translateArabicStringToEnglish(pub.title || pub.name) || 'New Opportunity'
                const pubNameAr = pub.titleAr || (pubTitleHasArabic && pub.title ? pub.title : '') || (pub.nameAr && /[\u0600-\u06FF]/.test(pub.nameAr) ? pub.nameAr : '') || known?.ar || (pub.name && /[\u0600-\u06FF]/.test(pub.name) ? pub.name : '') || 'فرصة جديدة'
                const catEn = formatMetaCategory(pub.category, false)
                const catAr = formatMetaCategory(pub.category, true)

                list.unshift({
                    id: pub.id,
                    titleEn: pubNameEn,
                    titleAr: pubNameAr,
                    name: pubNameEn,
                    nameAr: pubNameAr,
                    meta: pub.meta || buildMeta(catEn, pub.locationEn),
                    metaAr: pub.metaAr || buildMeta(catAr, pub.locationAr),
                    status: pub.status || 'pending',
                    startDate: pub.startDate,
                    endDate: pub.endDate,
                    deadline: pub.endDate || 'TBD',
                    applicants: 0,
                    primaryAction: 'edit'
                })
            }
        })
    } catch (e) {
        console.error('Failed to load stored opportunities:', e)
    }
    // الحالة والموعد النهائي يُشتقان من التواريخ الحالية للفرصة (بعد أي تعديل)
    return list.filter(opp => !deletedIds.includes(opp.id)).map(opp => {
        const status = resolveOpportunityStatus(opp)
        return {
            ...opp,
            status,
            deadline: status === 'ended' ? 'Closed' : (opp.endDate ? formatIsoDate(opp.endDate) : opp.deadline),
        }
    })
}

// حذف فرصة معلّقة لم تُعتمد بعد (ما لها متقدمون فعلياً). الفرصة المعدَّلة ممكن تكون محفوظة
// بالمفتاحين معاً (OPP_STORAGE_KEY دايماً + PUBLISHED_KEY إذا كانت منشورة أصلاً)، فلازم نحذفها من الاثنين،
// وتُسجَّل بقائمة المحذوفة حتى لو كانت أصلاً من بذور INITIAL_OPPORTUNITIES الثابتة.
export function deleteOpportunity(id) {
    if (!id) return
    try {
        const stored = JSON.parse(localStorage.getItem(OPP_STORAGE_KEY) || '[]')
        localStorage.setItem(OPP_STORAGE_KEY, JSON.stringify(stored.filter(o => o.id !== id)))

        const published = JSON.parse(localStorage.getItem(PUBLISHED_KEY) || '[]')
        localStorage.setItem(PUBLISHED_KEY, JSON.stringify(published.filter(o => o.id !== id)))

        const deleted = JSON.parse(localStorage.getItem(DELETED_KEY) || '[]')
        if (!deleted.includes(id)) {
            deleted.push(id)
            localStorage.setItem(DELETED_KEY, JSON.stringify(deleted))
        }
    } catch (e) {
        console.error('Failed to delete opportunity:', e)
    }
}

// يستخدمها الأدمن عند قبول/رفض فرصة: تحدّث سجلها أينما كان مخزّناً (المعدّلة أو المنشورة حديثاً)
export function updateOpportunityStatus(id, patch) {
    if (!id) return
    try {
        const stored = JSON.parse(localStorage.getItem(OPP_STORAGE_KEY) || '[]')
        const storedIdx = stored.findIndex(o => o.id === id)
        if (storedIdx >= 0) {
            stored[storedIdx] = { ...stored[storedIdx], ...patch, updatedAt: new Date().toISOString() }
            localStorage.setItem(OPP_STORAGE_KEY, JSON.stringify(stored))
            return
        }

        const published = JSON.parse(localStorage.getItem(PUBLISHED_KEY) || '[]')
        const pubIdx = published.findIndex(o => o.id === id)
        if (pubIdx >= 0) {
            published[pubIdx] = { ...published[pubIdx], ...patch, updatedAt: new Date().toISOString() }
            localStorage.setItem(PUBLISHED_KEY, JSON.stringify(published))
            return
        }

        // الفرصة من بيانات البذور الثابتة (INITIAL_OPPORTUNITIES) ولسا ما انكتب إلها أي تعديل بـlocalStorage:
        // لازم نحمل بياناتها الحالية (العنوان والمكان...) قبل ما نضيف الـoverride، وإلا
        // sanitizeOrEnrichOpportunity بتعتبر العنوان فاضي وتستبدله بعنوان وهمي عند القراءة لاحقاً
        const current = loadAllOpportunities().find(o => o.id === id) || {}
        stored.push({ ...current, ...patch, id, updatedAt: new Date().toISOString() })
        localStorage.setItem(OPP_STORAGE_KEY, JSON.stringify(stored))
    } catch (e) {
        console.error('Failed to update opportunity status:', e)
    }
}

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatIsoDate(iso) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso).trim())
    if (!match) return iso
    const [, y, m, d] = match
    return `${MONTHS_SHORT[Number(m) - 1]} ${Number(d)}, ${y}`
}
