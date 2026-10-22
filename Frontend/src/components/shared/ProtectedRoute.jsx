import { Navigate, useLocation } from 'react-router-dom'
import { getSession, getToken } from '../../services/api'

/**
 * ProtectedRoute: Enforces client-side role authorization for the 4 categories:
 * - 'participant': Student/App area (/app/*)
 * - 'organization': Organization area (/org/*)
 * - 'admin': Platform operations (/admin/*)
 */
export default function ProtectedRoute({ allowedRoles, children }) {
    const location = useLocation()
    const session = getSession()
    const token = getToken()

    // Determine current user role
    const participant = localStorage.getItem('eventify_current_participant')
    const currentRole = session?.role || (session?.accountType === 'organization' ? 'organization' : participant ? 'participant' : null)

    // If not authenticated at all
    if (!token && !currentRole) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />
    }

    // If roles are specified and user role doesn't match
    if (allowedRoles && allowedRoles.length > 0 && currentRole && !allowedRoles.includes(currentRole)) {
        if (currentRole === 'admin') return <Navigate to="/admin/dashboard" replace />
        if (currentRole === 'organization') return <Navigate to="/org/dashboard" replace />
        return <Navigate to="/app" replace />
    }

    return children
}
