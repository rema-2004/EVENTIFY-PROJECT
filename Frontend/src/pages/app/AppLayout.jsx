import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import './nav.css'
import './app-shell.css'

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
    if (!href || href.startsWith('#') || /^(mailto:|tel:|https?:|\/\/)/i.test(href)) return null

    const url = new URL(href, window.location.href)
    if (url.origin !== window.location.origin) return null

    const filename = decodeURIComponent(url.pathname.split('/').pop() || '')
    const pageName = filename.replace(/\.html?$/i, '')
    const target = PAGE_PATHS[pageName]
    return target ? `${target}${url.search}${url.hash}` : null
}

export default function AppLayout() {
    const location = useLocation()
    const navigate = useNavigate()

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
            <Outlet />
        </div>
    )
}