import AppFooter from '../../components/app/AppFooter'
import AppPageHead from '../../components/app/AppPageHead'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'

const APPLICATIONS = [
    {
        id: 1, status: 'pending',
        icon: 'emoji_events', iconBg: 'bg-primary/10', iconColor: 'text-primary',
        title: { en: 'Global AI Innovation Challenge', ar: 'تحدي الابتكار العالمي بالذكاء الاصطناعي' },
        sub:   { en: 'TechGenius Labs • Applied Jul 12, 2026', ar: 'TechGenius Labs • تقدّمت في 12 يوليو 2026' },
        badge: { en: 'Pending Review', ar: 'قيد المراجعة' },
        badgeCls: 'bg-tertiary/10 text-tertiary',
    },
    {
        id: 2, status: 'pending',
        icon: 'terminal', iconBg: 'bg-primary/10', iconColor: 'text-primary',
        title: { en: 'DevOps Masterclass', ar: 'ماستركلاس DevOps' },
        sub:   { en: 'TechGenius Labs • Applied Jul 9, 2026', ar: 'TechGenius Labs • تقدّمت في 9 يوليو 2026' },
        badge: { en: 'Pending Review', ar: 'قيد المراجعة' },
        badgeCls: 'bg-tertiary/10 text-tertiary',
    },
    {
        id: 3, status: 'pending',
        icon: 'groups', iconBg: 'bg-primary/10', iconColor: 'text-primary',
        title: { en: 'Cloud Career Bootcamp', ar: 'معسكر مسار الحوسبة السحابية' },
        sub:   { en: 'DevCommunity Hub • Applied Jul 4, 2026', ar: 'DevCommunity Hub • تقدّمت في 4 يوليو 2026' },
        badge: { en: 'Pending Review', ar: 'قيد المراجعة' },
        badgeCls: 'bg-tertiary/10 text-tertiary',
    },
    {
        id: 4, status: 'accepted',
        icon: 'check_circle', iconBg: 'bg-success/10', iconColor: 'text-success', iconFill: true,
        title: { en: 'Quantum Computing Workshop', ar: 'ورشة الحوسبة الكمية' },
        sub:   { en: 'University Research Lab • Applied Jun 28, 2026', ar: 'مختبر الجامعة البحثي • تقدّمت في 28 يونيو 2026' },
        badge: { en: 'Accepted', ar: 'مقبول' },
        badgeCls: 'bg-success/10 text-success',
    },
    {
        id: 5, status: 'accepted',
        icon: 'check_circle', iconBg: 'bg-success/10', iconColor: 'text-success', iconFill: true,
        title: { en: 'Frontend Wizards 2026', ar: 'Frontend Wizards 2026' },
        sub:   { en: 'DevCommunity Hub • Applied Jun 20, 2026', ar: 'DevCommunity Hub • تقدّمت في 20 يونيو 2026' },
        badge: { en: 'Accepted', ar: 'مقبول' },
        badgeCls: 'bg-success/10 text-success',
    },
    {
        id: 6, status: 'rejected',
        icon: 'cancel', iconBg: 'bg-error/10', iconColor: 'text-error',
        title: { en: 'Global Design Summit', ar: 'قمة التصميم العالمية' },
        sub:   { en: 'Global Design Guild • Applied Jun 2, 2026', ar: 'Global Design Guild • تقدّمت في 2 يونيو 2026' },
        badge: { en: 'Not Selected', ar: 'لم يتم الاختيار' },
        badgeCls: 'bg-error/10 text-error',
        dim: true,
    },
]

const TABS = [
    { key: 'all',      label: { en: 'All (6)',           ar: 'الكل (6)' } },
    { key: 'pending',  label: { en: 'Pending (3)',        ar: 'قيد المراجعة (3)' } },
    { key: 'accepted', label: { en: 'Accepted (2)',       ar: 'المقبولة (2)' } },
    { key: 'rejected', label: { en: 'Not Selected (1)',   ar: 'غير المختارة (1)' } },
]

export default function MyApplications() {
    const { language } = useLanguage()
    const ar = language === 'ar'

    const [activeFilter, setActiveFilter] = useState('all')

    const visible = APPLICATIONS.filter(
        (a) => activeFilter === 'all' || a.status === activeFilter
    )

    return (
        <>
            <AppPageHead title={ar ? 'طلباتي | EVENTIFY' : 'My Applications | EVENTIFY'} />

            <main
                className="pt-24 pb-12 px-container-margin-mobile md:px-container-margin-desktop max-w-[1280px] mx-auto flex flex-col gap-stack_gap_md"
                dir={ar ? 'rtl' : 'ltr'}
            >
                {/* Header */}
                <section className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 premium-shadow border border-outline-variant/50">
                    <h1 className="font-headline-lg text-headline-lg mb-1">
                        {ar ? 'طلباتي' : 'My Applications'}
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                        {ar
                            ? 'كل فرصة تقدّمت إليها في مكان واحد — تابع حالة كل طلب.'
                            : 'Every opportunity you\'ve applied to, in one place — track where each one stands.'}
                    </p>
                </section>

                {/* Filter Tabs */}
                <div className={`flex gap-stack_gap_md overflow-x-auto no-scrollbar ${ar ? 'flex-row-reverse' : ''}`}>
                    {TABS.map(({ key, label }) => (
                        <button
                            key={key}
                            type="button"
                            className="flex-shrink-0 px-6 py-2 rounded-full font-label-md text-label-md transition-all"
                            style={activeFilter === key
                                ? { backgroundColor: '#FF4D2E', color: '#fff', boxShadow: '0 2px 8px rgba(255,77,46,.25)' }
                                : { backgroundColor: 'var(--color-surface-container)', color: 'var(--color-on-surface-variant)' }}
                            aria-pressed={activeFilter === key}
                            onClick={() => setActiveFilter(key)}
                        >
                            {ar ? label.ar : label.en}
                        </button>
                    ))}
                </div>

                {/* Applications List */}
                <div className="flex flex-col gap-4">
                    {visible.map((app) => (
                        <div
                            key={app.id}
                            className={`bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/50 flex flex-col sm:flex-row sm:items-center gap-4 ${app.dim ? 'opacity-80' : ''} ${ar ? 'sm:flex-row-reverse' : ''}`}
                        >
                            <div className={`w-12 h-12 rounded-full ${app.iconBg} flex items-center justify-center flex-shrink-0`}>
                                <span
                                    className={`material-symbols-outlined ${app.iconColor}`}
                                    style={app.iconFill ? { fontVariationSettings: '"FILL" 1' } : undefined}
                                >
                                    {app.icon}
                                </span>
                            </div>

                            <div className={`flex-1 min-w-0 ${ar ? 'text-right' : ''}`}>
                                <p className="font-title-md text-title-md truncate">
                                    {ar ? app.title.ar : app.title.en}
                                </p>
                                <p className="font-label-sm text-label-sm text-outline">
                                    {ar ? app.sub.ar : app.sub.en}
                                </p>
                            </div>

                            <span className={`ev-badge whitespace-nowrap ${app.badgeCls}`}>
                                {ar ? app.badge.ar : app.badge.en}
                            </span>

                            <Link
                                className="px-4 py-2 rounded-full border border-outline-variant font-label-sm text-label-sm hover:bg-surface-container-low transition-colors whitespace-nowrap text-center"
                                to="/app/opportunity"
                            >
                                {ar ? 'عرض' : 'View'}
                            </Link>
                        </div>
                    ))}

                    {visible.length === 0 && (
                        <p className="text-center text-on-surface-variant py-10 font-body-md text-body-md">
                            {ar ? 'لا توجد طلبات في هذا الفلتر.' : 'No applications in this filter.'}
                        </p>
                    )}
                </div>
            </main>

            <AppFooter />
        </>
    )
}
