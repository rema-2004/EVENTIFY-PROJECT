import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import AppNavbar from '../../components/app/AppNavbar'
import AppBottomNav from '../../components/app/AppBottomNav'
import '../../styles/app/nav.css'
import '../../styles/app/app-shell.css'
import '../../styles/app/app-pages.css'

/**
 * Pages that get the full AppNavbar + AppBottomNav chrome.
 * Other pages (profile, notifications, rafeeq, task-flow pages)
 * have their own custom headers and skip the shared navbar.
 */
const PAGES_WITH_SHARED_NAV = [
    '/app',
    '/app/explore',
    '/app/opportunity',
    '/app/posts',
    '/app/my-applications',
    '/app/saved',
]

/**
 * Pages that show the mobile bottom navigation.
 * Task-flow pages (participation-type, teams, create-team, etc.)
 * are excluded because they have a different UX flow.
 */
const PAGES_WITH_BOTTOM_NAV = [
    '/app',
    '/app/explore',
    '/app/opportunity',
    '/app/posts',
    '/app/my-applications',
    '/app/saved',
    '/app/profile',
]

function useShowNav() {
    const { pathname } = useLocation()
    const showNavbar = PAGES_WITH_SHARED_NAV.some(
        (p) => pathname === p || (p !== '/app' && pathname.startsWith(p + '/'))
    )
    const showBottomNav = PAGES_WITH_BOTTOM_NAV.some(
        (p) => pathname === p || (p !== '/app' && pathname.startsWith(p + '/'))
    )
    return { showNavbar, showBottomNav }
}

export default function AppLayout() {
    const location = useLocation()
    const navigate = useNavigate()
    const { showNavbar, showBottomNav } = useShowNav()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [location.pathname])

    function handleLegacyNavigation(event) {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

        const anchor = event.target.closest('a[href]')
        const legacyClick = event.target.closest('[onclick]')
        const inlineHref = legacyClick?.getAttribute('onclick')?.match(/location\.href\s*=\s*['"]([^'"]+)['"]/)?.[1]
        const destination = resolvePagePath(anchor?.getAttribute('href')) || resolvePagePath(inlineHref)
        if (!destination) return

        event.preventDefault()
        event.stopPropagation()
        navigate(destination)
    }

    return (
        <div onClickCapture={handleLegacyNavigation}>
            {showNavbar && <AppNavbar />}
            <Outlet />
            {showBottomNav && <AppBottomNav />}
        </div>
    )
}

/* ---- Legacy href resolver (kept for backward-compat with old .html links) ---- */

const PAGE_PATHS = {
    index: '/app',
    explore: '/app/explore',
    opportunity: '/app/opportunity',
    'participation-type': '/app/participation-type',
    'create-team': '/app/create-team',
    teams: '/app/teams',
    'team-dashboard': '/app/team-dashboard',
    'registration-success': '/app/registration-success',
    'my-applications': '/app/my-applications',
    saved: '/app/saved',
    posts: '/app/posts',
    notifications: '/app/notifications',
    profile: '/app/profile',
    rafeeq: '/app/rafeeq',
    about: '/about',
    contact: '/contact',
    privacy: '/auth/privacy',
    terms: '/auth/terms',
    landing: '/',
}

function resolvePagePath(href) {
    if (!href || href.startsWith('#') || /^(mailto:|tel:|https?:\/\/)/i.test(href)) return null

    const url = new URL(href, window.location.href)
    if (url.origin !== window.location.origin) return null

    const filename = decodeURIComponent(url.pathname.split('/').pop() || '')
    const pageName = filename.replace(/\.html?$/i, '')
    const target = PAGE_PATHS[pageName]
    return target ? `${target}${url.search}${url.hash}` : null
}