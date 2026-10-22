import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

/**
 * AdminLayout: Shared wrapper for all Admin console routes (/admin/*)
 */
export default function AdminLayout() {
    const location = useLocation()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [location.pathname])

    return (
        <div className="admin-layout min-h-screen bg-[var(--surface)] text-[var(--text-main)]">
            <Outlet />
        </div>
    )
}
