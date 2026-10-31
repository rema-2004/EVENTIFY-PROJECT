import { useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { loadAllOpportunities } from '../../pages/org/org-opportunities-data.js'

// Read-only list of the students registered in one event, for admin
// oversight (complaints, abuse checks, reports). Approve/reject stays
// with the organization, so this section has no action buttons.

// Sample registrant pool (the frontend runs without a backend) — cycled to match
// the event's real applicant count from the shared org data layer.
const NAME_POOL = [
    { name: 'Ahmad Khalil', email: 'ahmad.k@example.com' },
    { name: 'Sara Haddad', email: 'sara.h@example.com' },
    { name: 'Khaled Nasser', email: 'khaled.n@example.com' },
    { name: 'Lina Omar', email: 'lina.o@example.com' },
    { name: 'Yousef Saleh', email: 'yousef.s@example.com' },
    { name: 'Mariam Al-Fayed', email: 'mariam.f@example.com' },
    { name: 'Omar Rashid', email: 'omar.r@example.com' },
    { name: 'Dina Haydar', email: 'dina.h@example.com' },
    { name: 'Tariq Younes', email: 'tariq.y@example.com' },
    { name: 'Rania Zein', email: 'rania.z@example.com' },
]
const STATUS_CYCLE = ['confirmed', 'confirmed', 'pending', 'confirmed', 'rejected']
const FIRST_REGISTERED_AT = Date.parse('2026-10-02T10:15:00Z')
const DAY_MS = 86400000

// Builds this event's registrant list from its real applicant count (org-opportunities-data.js),
// instead of showing the exact same fixed 5 rows for every event regardless of which one was opened.
function buildRegistrationsForEvent(eventId) {
    const opp = eventId ? loadAllOpportunities().find((o) => o.id === eventId) : null
    // opp found -> trust its real count even when it's 0; opp not found -> fall back to the mock pool size
    const count = opp ? Math.max(0, Number(opp.applicants ?? opp.applicantsCount ?? 0)) : NAME_POOL.length
    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        status: STATUS_CYCLE[i % STATUS_CYCLE.length],
        registered_at: new Date(FIRST_REGISTERED_AT + i * DAY_MS).toISOString(),
        user: NAME_POOL[i % NAME_POOL.length],
    }))
}

const STATUS_LABELS = {
    all: { en: 'All', ar: 'الكل' },
    confirmed: { en: 'Approved', ar: 'مقبول' },
    pending: { en: 'Pending', ar: 'قيد المراجعة' },
    rejected: { en: 'Rejected', ar: 'مرفوض' },
    cancelled: { en: 'Cancelled', ar: 'ملغى' },
}

const STATUS_FILTERS = ['all', 'confirmed', 'pending', 'rejected', 'cancelled']

// Matches the opacity transition on the list wrapper below.
const FADE_OUT_MS = 200

// Backend status -> existing badge class in admin.css.
const STATUS_BADGE = {
    confirmed: 'badge--approved',
    pending: 'badge--pending',
    rejected: 'badge--rejected',
    cancelled: 'badge--cancelled',
}

export default function EventRegistrationsSection({ eventId }) {
    const { language } = useLanguage()
    const ar = language === 'ar'
    const t = (en, arText) => (ar ? arText : en)
    const statusLabel = (status) => STATUS_LABELS[status]?.[ar ? 'ar' : 'en'] ?? status

    // Frontend-only: sized to this event's real applicant count (no backend call).
    const registrations = useMemo(() => buildRegistrationsForEvent(eventId), [eventId])
    const total = registrations.length
    // selectedFilter updates the <select> right away; filter (what the table
    // shows) switches only after the old rows have faded out.
    const [selectedFilter, setSelectedFilter] = useState('all')
    const [filter, setFilter] = useState('all')
    const [fadingOut, setFadingOut] = useState(false)
    const fadeTimer = useRef(null)
    const loading = false
    const error = null

    useEffect(() => () => clearTimeout(fadeTimer.current), [])

    const changeFilter = (value) => {
        setSelectedFilter(value)
        clearTimeout(fadeTimer.current)
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setFilter(value)
            return
        }
        setFadingOut(true)
        fadeTimer.current = setTimeout(() => {
            setFilter(value)
            setFadingOut(false)
        }, FADE_OUT_MS)
    }

    const countBy = (status) => registrations.filter((r) => r.status === status).length
    const visible = filter === 'all' ? registrations : registrations.filter((r) => r.status === filter)
    const thClass = `py-2 pe-4 font-semibold ${ar ? 'text-right' : 'text-left'}`

    return (
        <section className="section-card mt-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3 className="text-title-lg font-semibold">{t('Registered Students', 'الطلاب المسجّلون')}</h3>
                    <p className="text-label-md text-on-surface-variant">
                        {t(
                            'View only. Approving or rejecting applicants is handled by the organization.',
                            'للعرض فقط. قبول المتقدّمين أو رفضهم من صلاحية المنظمة.',
                        )}
                    </p>
                </div>
                <select
                    className="rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface px-3 py-2 text-label-md"
                    value={selectedFilter}
                    onChange={(e) => changeFilter(e.target.value)}
                    aria-label={t('Filter by status', 'تصفية حسب الحالة')}
                    disabled={loading || !!error}
                >
                    {STATUS_FILTERS.map((status) => (
                        <option key={status} value={status}>
                            {statusLabel(status)}
                        </option>
                    ))}
                </select>
            </div>

            {error ? (
                <div className="rounded-xl bg-surface-container-low p-4 text-label-md">
                    <p className="flex items-center gap-2 font-semibold text-error">
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                            {error === 'forbidden' ? 'lock' : 'error'}
                        </span>
                        {error === 'forbidden'
                            ? t('You are not authorized to view these registrations.', 'ليس لديك صلاحية لعرض هؤلاء المسجّلين.')
                            : t('Could not load registrations. Please try again later.', 'تعذّر تحميل المسجّلين. حاول مرة أخرى لاحقاً.')}
                    </p>
                    {error === 'forbidden' && (
                        <p className="mt-1 text-on-surface-variant">
                            {t('Please sign in again with an admin account.', 'يرجى تسجيل الدخول مجدداً بحساب أدمن.')}
                        </p>
                    )}
                </div>
            ) : (
                <>
                    <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                        <div className="rounded-xl bg-surface-container-low p-4">
                            <p className="text-label-sm font-semibold text-on-surface-variant">{t('Total', 'المجموع')}</p>
                            <p className="text-title-lg font-semibold">{total}</p>
                        </div>
                        <div className="rounded-xl bg-surface-container-low p-4">
                            <p className="text-label-sm font-semibold text-on-surface-variant">{statusLabel('confirmed')}</p>
                            <p className="text-title-lg font-semibold text-success">{countBy('confirmed')}</p>
                        </div>
                        <div className="rounded-xl bg-surface-container-low p-4">
                            <p className="text-label-sm font-semibold text-on-surface-variant">{statusLabel('pending')}</p>
                            <p className="text-title-lg font-semibold">{countBy('pending')}</p>
                        </div>
                        <div className="rounded-xl bg-surface-container-low p-4">
                            <p className="text-label-sm font-semibold text-on-surface-variant">{statusLabel('rejected')}</p>
                            <p className="text-title-lg font-semibold text-error">{countBy('rejected')}</p>
                        </div>
                    </div>

                    <div className={`adm-fade-swap ${fadingOut ? 'is-fading-out' : ''}`}>
                    {loading ? (
                        <p className="text-on-surface-variant">{t('Loading registrations...', 'جاري تحميل المسجّلين...')}</p>
                    ) : visible.length === 0 ? (
                        <p key={filter} className="adm-row-in text-on-surface-variant">
                            {t('No registrations to show.', 'لا يوجد مسجّلون لعرضهم.')}
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-label-md">
                                <thead>
                                    <tr className="border-b border-outline-variant/40 text-on-surface-variant">
                                        <th className={thClass}>{t('Name', 'الاسم')}</th>
                                        <th className={thClass}>{t('Email', 'البريد الإلكتروني')}</th>
                                        <th className={thClass}>{t('Status', 'الحالة')}</th>
                                        <th className={thClass}>{t('Registered', 'تاريخ التسجيل')}</th>
                                    </tr>
                                </thead>
                                {/* key={filter} remounts the rows so each filter change fades them in again */}
                                <tbody key={filter}>
                                    {visible.map((r, index) => (
                                        <tr
                                            key={r.id}
                                            className="adm-row-in border-b border-outline-variant/20"
                                            style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
                                        >
                                            <td className="py-3 pe-4 font-semibold">{r.user?.name ?? '—'}</td>
                                            <td className="py-3 pe-4 text-on-surface-variant">{r.user?.email ?? '—'}</td>
                                            <td className="py-3 pe-4">
                                                <span className={`badge ${STATUS_BADGE[r.status] ?? ''}`}>{statusLabel(r.status)}</span>
                                            </td>
                                            <td className="py-3 pe-4 text-on-surface-variant">
                                                {r.registered_at
                                                    ? new Date(r.registered_at).toLocaleDateString(ar ? 'ar' : 'en')
                                                    : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    </div>
                </>
            )}
        </section>
    )
}
