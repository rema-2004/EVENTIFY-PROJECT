import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const BOTTOM_LINKS = [
    { to: '/app', icon: 'home', label: 'appNav.home' },
    { to: '/app/explore', icon: 'emoji_events', label: 'appNav.explore' },
    { to: '/app/posts', icon: 'campaign', label: 'appNav.posts' },
    { to: '/app/rafeeq', icon: 'smart_toy', label: 'appNav.rafeeq' },
    { to: '/app/profile', icon: 'person', label: 'appNav.profile' },
]

/**
 * Mobile bottom navigation bar shared across participant pages.
 * Visible only on mobile (< md breakpoint).
 */
export default function AppBottomNav() {
    const { pathname } = useLocation()
    const { t } = useTranslation()

    const isActive = (to) => {
        if (to === '/app') return pathname === '/app'
        return pathname.startsWith(to)
    }

    return (
        <nav className="fixed bottom-0 w-full rounded-t-xl z-50 md:hidden flex justify-around items-center px-4 py-2 pb-safe bg-surface dark:bg-slate-900 border-t border-outline-variant/30 dark:border-white/10 shadow-[0_-4px_12px_rgba(59,130,246,0.08)]">
            {BOTTOM_LINKS.map(({ to, icon, label }) => (
                <Link
                    key={to}
                    className={`flex flex-col items-center justify-center transition-transform active:scale-90 ${
                        isActive(to)
                            ? 'text-secondary bg-secondary-container/20 rounded-xl px-3 py-1'
                            : 'text-on-surface-variant dark:text-gray-400'
                    }`}
                    to={to}
                >
                    <span className="material-symbols-outlined">{icon}</span>
                    <span className="font-label-sm text-label-sm">{t(label)}</span>
                </Link>
            ))}
        </nav>
    )
}
