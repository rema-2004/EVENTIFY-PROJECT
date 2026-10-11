import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import LangToggleBtn from './LangToggleBtn'

export { LangToggleBtn }

export const ORG_NAV_ITEMS = [
    {
        to: '/org/dashboard',
        icon: 'dashboard',
        label: 'Dashboard',
        labelAr: 'لوحة التحكم',
    },
    {
        to: '/org/posts',
        icon: 'campaign',
        label: 'Posts',
        labelAr: 'المنشورات',
    },
    {
        to: '/org/profile',
        icon: 'apartment',
        label: 'Organization Profile',
        labelAr: 'الملف التعريفي',
    },
    {
        to: '/org/opportunities',
        icon: 'event_note',
        label: 'My Opportunities',
        labelAr: 'فعالياتي',
    },
    {
        to: '/org/create-event',
        icon: 'add_circle',
        label: 'Create Event',
        labelAr: 'إنشاء فعالية',
    },
    {
        to: '/org/applicants',
        icon: 'group',
        label: 'Applicants',
        labelAr: 'المتقدمون',
    },
    {
        to: '/org/report-center',
        icon: 'bar_chart',
        label: 'Reports',
        labelAr: 'التقارير',
    },
    {
        to: '/org/settings',
        icon: 'settings',
        label: 'Settings',
        labelAr: 'الإعدادات',
    },
]

/**
 * Mobile Top Header for Organization console
 */
export function OrgMobileHeader() {
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
            <div className="flex items-center gap-2">
                <LangToggleBtn small />
                <button
                    className="theme-toggle icon-btn"
                    type="button"
                    title={ar ? 'تبديل المظهر' : 'Switch theme'}
                    aria-label={ar ? 'تبديل المظهر' : 'Switch theme'}
                    style={{ width: 36, height: 36 }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                        dark_mode
                    </span>
                </button>
                <span className="admin-badge">{ar ? 'المنظم' : 'Organizer'}</span>
                <button
                    className="mobile-hamburger"
                    id="org-hamburger"
                    aria-label={ar ? 'فتح القائمة' : 'Open navigation'}
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
 * Unified Organizer Sidebar & Mobile Navigation Drawer
 * Single Source of Truth for all /org/* pages.
 */
export default function OrgSidebar() {
    const { pathname } = useLocation()
    const { language } = useLanguage()
    const ar = language === 'ar'

    const isCurrentActive = (item) => {
        if (item.matchPaths) {
            return item.matchPaths.some((p) => pathname === p || pathname.startsWith(p + '/'))
        }
        if (item.to === '/org/dashboard') {
            return pathname === '/org/dashboard'
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
                    {ar ? 'لوحة تحكم المنظم' : 'Organizer console'}
                </span>
                <nav className="flex flex-1 flex-col gap-1" aria-label="Organizer sections">
                    <div className="nav-group">
                        {ORG_NAV_ITEMS.map((item) => {
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
                        {ar ? 'المنظمة' : 'ORGANIZATION'}
                    </p>
                    <p className="mb-1 font-label-md text-label-md text-on-surface font-semibold">
                        TechGenius Labs
                    </p>
                    <p className="text-label-sm font-label-sm text-success">
                        {ar ? 'منظم موثّق منذ 2024' : 'Verified organizer since 2024'}
                    </p>
                </div>
            </aside>

            {/* Mobile Navigation Drawer */}
            <nav
                className="mobile-nav-drawer"
                id="org-mobile-drawer"
                aria-label="Mobile organizer navigation"
                aria-hidden="true"
            >
                <button
                    className="mobile-nav-close"
                    id="org-nav-close"
                    aria-label="Close navigation"
                >
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
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
                <span className="admin-badge mb-6 w-fit">
                    {ar ? 'لوحة تحكم المنظم' : 'Organizer console'}
                </span>
                <div className="nav-group flex flex-1 flex-col gap-1">
                    {ORG_NAV_ITEMS.map((item) => {
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
                <div className="mt-auto rounded-2xl bg-surface-container p-4">
                    <p className="mb-2 text-label-sm font-label-sm text-on-surface-variant">
                        {ar ? 'المنظمة' : 'ORGANIZATION'}
                    </p>
                    <p className="mb-1 font-label-md text-label-md text-on-surface font-semibold">
                        TechGenius Labs
                    </p>
                    <p className="text-label-sm font-label-sm text-success">
                        {ar ? 'منظم موثّق منذ 2024' : 'Verified organizer since 2024'}
                    </p>
                </div>
            </nav>

            {/* Mobile Overlay */}
            <div
                className="mobile-nav-overlay"
                id="org-mobile-overlay"
                aria-hidden="true"
            />
        </>
    )
}
