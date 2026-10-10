import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AppLangToggle from './AppLangToggle'

const NAV_LINKS = [
    { to: '/app', label: 'appNav.home' },
    { to: '/app/explore', label: 'appNav.explore' },
    { to: '/app/posts', label: 'appNav.posts' },
    { to: '/app/my-applications', label: 'appNav.myEvent' },
    { to: '/app/notifications', label: 'appNav.notifications' },
]

const PROFILE_IMAGE =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCaUW4ycO4zpbXU8-f7qQ8e67JQFR0kFopGobvmcyuwtb7RmtLjv8uPEEmSl-hbsk0Uo2ApZUUq0wRlZ_zn8PJ4ugNgbj5OOGiU0BEkvvm8agYRwod83fIHy3htoOWJsIvO4ldpAhRTz0oyAMispIOZSiEf-bq73m7QKJeH-ZAfVM4q8r4pOddVVra4gOVTwYxIXtrSAQ5_f0WzHxDTzUUNzi4IEbgzPPqIh4aHvXgk12witr7-3N8pVFOo07Rs0y08Ht-8bubrd2i-'

/**
 * Shared top navigation bar for main participant pages
 * (Home, Explore, Posts, My Event, Opportunity, etc.)
 *
 * The language toggle button design matches the visitor Navbar exactly.
 */
export default function AppNavbar() {
    const { pathname } = useLocation()
    const { t } = useTranslation()

    const isActive = (to) => {
        if (to === '/app') return pathname === '/app'
        return pathname.startsWith(to)
    }

    const linkClass = (to) =>
        isActive(to)
            ? 'font-label-md text-label-md text-primary font-bold border-b-2 border-primary pb-1 transition-all'
            : 'font-label-md text-label-md text-on-surface-variant hover:text-primary dark:text-[#c3c6d7] dark:hover:text-primary transition-colors'

    return (
        <nav className="fixed top-0 w-full z-50 glass-nav border-b border-outline-variant/30 dark:border-white/10 h-16 flex items-center">
            <div className="flex justify-between items-center px-container-margin-mobile md:px-container-margin-desktop w-full max-w-[1280px] mx-auto">
                <div className="flex items-center gap-8">
                    <Link
                        className="flex items-center gap-3"
                        to="/app"
                        aria-label="EVENTIFY home"
                    >
                        <span
                            className="material-symbols-outlined text-primary text-3xl"
                            style={{ fontVariationSettings: '"FILL" 1' }}
                        >
                            hub
                        </span>
                        <span className="font-headline-md text-headline-md font-black text-primary">
                            EVENTIFY
                        </span>
                    </Link>
                    <div className="hidden md:flex gap-6">
                        {NAV_LINKS.map(({ to, label }) => (
                            <Link key={to} className={linkClass(to)} to={to}>
                                {t(label)}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <AppLangToggle />
                    {/* Theme toggle */}
                    <button
                        className="theme-toggle w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-low dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
                        title={t('nav.toggleTheme')}
                        aria-label={t('nav.toggleTheme')}
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            dark_mode
                        </span>
                    </button>
                    {/* Rafeeq AI button */}
                    <Link
                        className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/5 hover:bg-primary/10 rounded-lg text-primary dark:text-primary dark:hover:bg-primary/10 font-label-md transition-all"
                        to="/app/rafeeq"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            smart_toy
                        </span>
                        {t('appNav.rafeeqAI')}
                    </Link>
                    {/* Profile avatar */}
                    <Link
                        className="h-10 w-10 rounded-full overflow-hidden border-2 border-primary-container block"
                        to="/app/profile"
                    >
                        <img
                            className="w-full h-full object-cover"
                            alt="Profile"
                            src={PROFILE_IMAGE}
                        />
                    </Link>
                </div>
            </div>
        </nav>
    )
}
