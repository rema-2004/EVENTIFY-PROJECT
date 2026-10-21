import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AppPageHead from '../../components/app/AppPageHead'
import AdminSidebar, { AdminMobileHeader } from '../../components/admin/AdminSidebar'
import AdminTopbar from '../../components/admin/AdminTopbar'
import { useLanguage } from '../../hooks/useLanguage'
import { toast } from '../../utils/toast'
import '../../styles/admin/admin.css'

const DECISION_BADGES = {
    pending: { className: 'badge--pending', en: 'Pending approval', ar: 'بانتظار الموافقة' },
    approved: { className: 'badge--approved', icon: 'check_circle', en: 'Approved', ar: 'مقبول' },
    rejected: { className: 'badge--rejected', icon: 'cancel', en: 'Rejected', ar: 'مرفوض' },
}

// Sample event shown until this page is wired to GET /admin/events/{id}.
const EVENT = {
    title: 'DevOps Masterclass',
    organizer: 'TechGenius Labs',
    category: { en: 'Course', ar: 'دورة' },
    mode: { en: 'Online', ar: 'عن بُعد' },
    description: {
        en: 'A hands-on cloud lab covering CI/CD, Kubernetes, and infrastructure as code over 6 weeks.',
        ar: 'مختبر سحابي عملي يغطي CI/CD وKubernetes والبنية التحتية ككود على مدار 6 أسابيع.',
    },
    dates: { en: 'Nov 12 - Dec 24, 2026', ar: '12 نوفمبر - 24 ديسمبر 2026' },
    audience: { en: 'Students and junior developers', ar: 'الطلاب والمطورون المبتدئون' },
    capacity: { en: '120 participants', ar: '120 مشاركاً' },
    requirements: [
        { en: 'Basic Linux command-line knowledge.', ar: 'معرفة أساسية بسطر أوامر Linux.' },
        { en: 'GitHub account and laptop with stable internet.', ar: 'حساب GitHub وحاسوب محمول مع اتصال إنترنت مستقر.' },
        { en: 'Weekly attendance for live labs.', ar: 'حضور أسبوعي للمختبرات المباشرة.' },
    ],
}

const CHECKLIST = [
    { en: 'Verified organizer', ar: 'جهة منظمة موثّقة', result: { en: 'Pass', ar: 'ناجح' }, className: 'text-success' },
    { en: 'Clear description', ar: 'وصف واضح', result: { en: 'Pass', ar: 'ناجح' }, className: 'text-success' },
    { en: 'Valid dates', ar: 'تواريخ صحيحة', result: { en: 'Pass', ar: 'ناجح' }, className: 'text-success' },
    { en: 'Policy risk', ar: 'مخاطر السياسات', result: { en: 'Low', ar: 'منخفضة' }, className: 'text-tertiary' },
]

export default function AdminEventReviewDetails() {
    const { language } = useLanguage()
    const ar = language === 'ar'
    const t = (en, arText) => (ar ? arText : en)
    const tr = (text) => (ar ? text.ar : text.en)

    // 'pending' until the admin approves or rejects; a decision is final.
    const [decision, setDecision] = useState('pending')
    const [reason, setReason] = useState('')
    const reasonInput = useRef(null)
    const badge = DECISION_BADGES[decision]

    const approve = () => {
        setDecision('approved')
        toast(t(`${EVENT.title} approved`, `تمت الموافقة على ${EVENT.title}`), 'success')
    }

    // Both "Reject with reason" and "Send rejection" need a written reason first.
    const reject = () => {
        if (!reason.trim()) {
            reasonInput.current?.focus()
            toast(t('Write a rejection reason first', 'اكتب سبب الرفض أولاً'), 'error')
            return
        }
        setDecision('rejected')
        toast(t(`${EVENT.title} rejected`, `تم رفض ${EVENT.title}`), 'error')
    }

    const details = [
        { label: t('Organizer', 'الجهة المنظمة'), value: EVENT.organizer },
        { label: t('Dates', 'التواريخ'), value: tr(EVENT.dates) },
        { label: t('Target audience', 'الفئة المستهدفة'), value: tr(EVENT.audience) },
        { label: t('Capacity', 'السعة'), value: tr(EVENT.capacity) },
    ]

    return (
        <>
            <AppPageHead title="Event Review Details | EVENTIFY" />
            <AdminMobileHeader />
            <div className="flex min-h-screen">
                <AdminSidebar />
                <main className="w-full flex-1 px-4 pt-6 pb-24 md:px-10 lg:pb-8">
                    <AdminTopbar title={t('Event Review Details', 'تفاصيل مراجعة الفعالية')} />
                    <div className="mb-6 flex items-center gap-2 text-label-md">
                        <Link
                            className="text-on-surface-variant hover:text-primary"
                            to="/admin/events"
                        >
                            {t('Review Events', 'مراجعة الفعاليات')}
                        </Link>
                        <span className="text-outline">/</span>
                        <span>{EVENT.title}</span>
                    </div>
                    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <p className="mt-1 text-on-surface-variant">
                                {t(
                                    'Validate content quality, organizer trust, dates, and publishing readiness.',
                                    'تحقق من جودة المحتوى وموثوقية الجهة المنظمة والتواريخ وجاهزية النشر.',
                                )}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {decision === 'pending' ? (
                                <>
                                    <button type="button" className="btn-danger-outline" onClick={reject}>
                                        {t('Reject with reason', 'رفض مع ذكر السبب')}
                                    </button>
                                    <button type="button" className="btn-success" onClick={approve}>
                                        {t('Approve publish', 'الموافقة على النشر')}
                                    </button>
                                </>
                            ) : (
                                <span className={`badge ${badge.className}`}>
                                    <span
                                        className="material-symbols-outlined"
                                        style={{ fontSize: 14, verticalAlign: 'middle', marginInlineEnd: 4 }}
                                    >
                                        {badge.icon}
                                    </span>
                                    {tr(badge)}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <section className="section-card lg:col-span-2">
                            <div className="mb-6 flex flex-wrap items-center gap-2">
                                <span className={`badge ${badge.className}`}>{tr(badge)}</span>
                                <span className="rounded-full bg-primary/10 px-3 py-1 text-label-sm font-semibold text-primary">
                                    {tr(EVENT.category)}
                                </span>
                                <span className="rounded-full bg-surface-container px-3 py-1 text-label-sm font-semibold text-on-surface-variant">
                                    {tr(EVENT.mode)}
                                </span>
                            </div>
                            <h2 className="text-headline-md font-semibold">{EVENT.title}</h2>
                            <p className="mt-2 text-on-surface-variant">{tr(EVENT.description)}</p>
                            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                                {details.map((item) => (
                                    <div key={item.label} className="rounded-xl bg-surface-container-low p-4">
                                        <p className="text-label-sm font-semibold text-on-surface-variant">
                                            {item.label}
                                        </p>
                                        <p className="font-semibold">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8">
                                <h3 className="mb-4 text-title-lg font-semibold">{t('Requirements', 'المتطلبات')}</h3>
                                <ul className="space-y-2 text-on-surface-variant">
                                    {EVENT.requirements.map((item) => (
                                        <li key={item.en}>{tr(item)}</li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                        <aside className="space-y-6">
                            <section className="section-card">
                                <h3 className="mb-4 text-title-lg font-semibold">
                                    {t('Review Checklist', 'قائمة التحقق')}
                                </h3>
                                <div className="space-y-3 text-label-md">
                                    {CHECKLIST.map((item) => (
                                        <p key={item.en} className="flex justify-between">
                                            <span>{tr(item)}</span>
                                            <span className={item.className}>{tr(item.result)}</span>
                                        </p>
                                    ))}
                                </div>
                            </section>
                            <section className="section-card">
                                <h3 className="mb-4 text-title-lg font-semibold">
                                    {t('Rejection Reason', 'سبب الرفض')}
                                </h3>
                                <textarea
                                    ref={reasonInput}
                                    className="h-36 w-full resize-none rounded-xl border border-outline-variant bg-surface-container-lowest p-4"
                                    placeholder={t('Write a clear reason if rejecting...', 'اكتب سبباً واضحاً في حال الرفض...')}
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    disabled={decision !== 'pending'}
                                />
                                <button
                                    type="button"
                                    className="btn-danger-outline"
                                    style={{ width: "100%", marginTop: 12 }}
                                    onClick={reject}
                                    disabled={decision !== 'pending'}
                                >
                                    {t('Send rejection', 'إرسال الرفض')}
                                </button>
                            </section>
                        </aside>
                    </div>
                </main>
            </div>
        </>
    )
}
