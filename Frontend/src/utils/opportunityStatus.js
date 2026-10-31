// بعد اعتماد الفرصة تُحدد حالتها من تواريخها: قادم قبل البدء، مباشر أثناءها، منتهي بعد الانتهاء.
// الحالات غير المعتمدة (معلق / مرفوض / مسودة) تبقى كما هي.
const APPROVED_STATUSES = new Set(['live', 'Active', 'upcoming', 'ended'])

function todayIso() {
    const d = new Date()
    const pad = n => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function resolveOpportunityStatus(opp, today = todayIso()) {
    const status = opp?.status
    if (!APPROVED_STATUSES.has(status)) return status
    if (!opp.startDate || !opp.endDate) return status === 'Active' ? 'live' : status
    if (today < opp.startDate) return 'upcoming'
    if (today > opp.endDate) return 'ended'
    return 'live'
}
