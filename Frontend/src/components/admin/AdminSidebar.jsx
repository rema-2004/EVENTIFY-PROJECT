import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import LangToggleBtn from '../org/LangToggleBtn'

export const ADMIN_NAV_ITEMS = [
    {
        to: '/admin/dashboard',
        icon: 'dashboard',
        label: 'Overview',
        labelAr: 'نظرة عامة',
    },
    {
        to: '/admin/events',
        icon: 'trophy',
        label: 'Competitions & Events',
        labelAr: 'الفعاليات والمسابقات',
        matchPaths: ['/admin/events', '/admin/event-review-details'],
    },
    {
        to: '/admin/users',
        icon: 'group',
        label: 'Participants',
        labelAr: 'المشاركون',
    },
    {
        to: '/admin/verify-organizations',
        icon: 'verified',
        label: 'Organizations',
        labelAr: 'المنظمات',
    },
    {
        to: '/admin/categories',
        icon: 'category',
        label: 'Categories',
        labelAr: 'التصنيفات',
    },
    {
        to: '/admin/reports',
        icon: 'flag',
        label: 'Reports',
        labelAr: 'البلاغات والتقارير',
    },
    {
        to: '/admin/audit-log',
        icon: 'history',
        label: 'Audit log',
        labelAr: 'سجل العمليات',
    },
]

/**
 * Mobile Top Header for Admin console
 */
export function AdminMobileHeader() {
    const { language } = useLanguage()
    const ar = language === 'ar'

    return (
        <header className="lg:hidden glass-header w-full sticky top-0 z-40 flex justify-between items-center px-4 h-16 shadow-sm">
            <Link className="flex items-center gap-2" to="/">
                <span
                    className="material-symbols-outlined text-primary"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                >
                    hub
                </span>
                <span
                    className="font-bold text-headline-lg-mobile text-primary"
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    EVENTIFY
                </span>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <LangToggleBtn small />
                <span className="admin-badge">{ar ? 'المشرف' : 'Admin'}</span>
                <button
                    className="mobile-hamburger"
                    id="admin-hamburger"
                    aria-label="Open navigation"
                    aria-expanded="false"
                >
                    <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
                        menu
                    </span>
                </button>
            </div>
        </header>
    )
}

/**
 * Unified Admin Sidebar & Mobile Navigation Drawer
 * Single Source of Truth for all /admin/* pages.
 */
export default function AdminSidebar() {
    const { pathname } = useLocation()
    const { language } = useLanguage()
    const ar = language === 'ar'

    const isCurrentActive = (item) => {
        if (item.matchPaths) {
            return item.matchPaths.some((p) => pathname === p || pathname.startsWith(p + '/'))
        }
        if (item.to === '/admin/dashboard') {
            return pathname === '/admin/dashboard'
        }
        return pathname === item.to || pathname.startsWith(item.to + '/')
    }

    return (
        <>
            {/* Desktop Sticky Sidebar */}
            <aside className="admin-accent-sidebar hidden lg:flex flex-col w-[280px] h-screen sticky top-0 glass-sidebar z-50 p-6">
                <Link className="flex items-center gap-3 mb-2" to="/">
                    <span
                        className="material-symbols-outlined text-primary text-3xl"
                        style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                        hub
                    </span>
                    <span
                        className="font-bold text-headline-md text-primary"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        EVENTIFY
                    </span>
                </Link>
                <span className="admin-badge mb-8 w-fit">
                    {ar ? 'لوحة تحكم المشرف' : 'Admin console'}
                </span>
                <nav className="flex flex-1 flex-col gap-1" aria-label="Admin sections">
                    <div className="nav-group">
                        {ADMIN_NAV_ITEMS.map((item) => {
                            const active = isCurrentActive(item)
                            return (
                                <Link
                                    key={item.to}
                                    className="nav-link"
                                    to={item.to}
                                    aria-current={active ? 'page' : undefined}
                                >
                                    <span
                                        className="material-symbols-outlined"
                                        aria-hidden="true"
                                        style={active ? { fontVariationSettings: '"FILL" 1' } : {}}
                                    >
                                        {item.icon}
                                    </span>
                                    {ar ? item.labelAr : item.label}
                                </Link>
                            )
                        })}
                    </div>
                </nav>
                <div className="mt-auto rounded-2xl bg-surface-container p-4">
                    <p className="mb-2 text-label-sm font-label-sm text-on-surface-variant">
                        {ar ? 'تسجيل الدخول كـ' : 'SIGNED IN AS'}
                    </p>
                    <p className="mb-1 font-label-md text-label-md text-on-surface font-semibold">
                        {ar ? 'مدير المنصة' : 'Platform Admin'}
                    </p>
                    <p
                        className="text-label-sm font-label-sm"
                        style={{ color: 'var(--accent)', fontWeight: 600 }}
                    >
                        {ar ? 'صلاحيات كاملة' : 'Full access'}
                    </p>
                </div>
            </aside>

            {/* Mobile Navigation Drawer */}
            <nav
                className="mobile-nav-drawer"
                id="admin-mobile-drawer"
                aria-label="Mobile admin navigation"
                aria-hidden="true"
            >
                <button
                    className="mobile-nav-close"
                    id="admin-nav-close"
                    aria-label="Close navigation"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
                <Link className="flex items-center gap-3 mb-2" to="/">
                    <span
                        className="material-symbols-outlined text-primary text-3xl"
                        style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                        hub
                    </span>
                    <span
                        className="font-bold text-headline-md text-primary"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        EVENTIFY
                    </span>
                </Link>
                <span className="admin-badge mb-4 w-fit">
                    {ar ? 'لوحة تحكم المشرف' : 'Admin console'}
                </span>
                <div className="nav-group flex flex-col gap-1">
                    {ADMIN_NAV_ITEMS.map((item) => {
                        const active = isCurrentActive(item)
                        return (
                            <Link
                                key={item.to}
                                className="nav-link"
                                to={item.to}
                                aria-current={active ? 'page' : undefined}
                            >
                                <span
                                    className="material-symbols-outlined"
                                    aria-hidden="true"
                                    style={active ? { fontVariationSettings: '"FILL" 1' } : {}}
                                >
                                    {item.icon}
                                </span>
                                {ar ? item.labelAr : item.label}
                            </Link>
                        )
                    })}
                </div>
            </nav>

            {/* Mobile Overlay */}
            <div
                className="mobile-nav-overlay"
                id="admin-mobile-overlay"
                aria-hidden="true"
            />
        </>
    )
}
