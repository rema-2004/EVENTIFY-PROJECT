import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'

// Read-only list of the students registered in one event, for admin
// oversight (complaints, abuse checks, reports). Approve/reject stays
// with the organization, so this section has no action buttons.

// Sample registrations shown in the table (the frontend runs without a backend).
const MOCK_REGISTRATIONS = [
    { id: 1, status: 'confirmed', registered_at: '2026-10-02T10:15:00Z', user: { name: 'Ahmad Khalil', email: 'ahmad.k@example.com' } },
    { id: 2, status: 'pending', registered_at: '2026-10-05T14:40:00Z', user: { name: 'Sara Haddad', email: 'sara.h@example.com' } },
    { id: 3, status: 'rejected', registered_at: '2026-10-06T09:05:00Z', user: { name: 'Khaled Nasser', email: 'khaled.n@example.com' } },
    { id: 4, status: 'confirmed', registered_at: '2026-10-08T17:20:00Z', user: { name: 'Lina Omar', email: 'lina.o@example.com' } },
    { id: 5, status: 'pending', registered_at: '2026-10-10T11:30:00Z', user: { name: 'Yousef Saleh', email: 'yousef.s@example.com' } },
]

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

export default function EventRegistrationsSection() {
    const { language } = useLanguage()
    const ar = language === 'ar'
    const t = (en, arText) => (ar ? arText : en)
    const statusLabel = (status) => STATUS_LABELS[status]?.[ar ? 'ar' : 'en'] ?? status

    // Frontend-only: the table shows the sample registrations (no backend call).
    const registrations = MOCK_REGISTRATIONS
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
