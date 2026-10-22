import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

/**
 * OrgLayout: Shared wrapper for all Organization routes (/org/*)
 */
export default function OrgLayout() {
    const location = useLocation()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [location.pathname])

    return (
        <div className="org-layout min-h-screen bg-[var(--surface)] text-[var(--text-main)]">
            <Outlet />
        </div>
    )
}
