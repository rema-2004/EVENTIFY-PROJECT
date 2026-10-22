// Single place for talking to the Laravel API: the base URL and the auth
// header live here instead of being repeated in every page.
//
// Set VITE_API_URL in Frontend/.env to point at another server, e.g.
//   VITE_API_URL=https://api.eventify.example/api/v1
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api/v1'

export function getToken() {
    return localStorage.getItem('eventify_token') || localStorage.getItem('token')
}

// Saves the Sanctum token returned by /login or /org/login, plus who it
// belongs to ('user' covers students and admins, 'organization' is separate).
export function saveSession({ token, accountType, role }) {
    localStorage.setItem('eventify_token', token)
    localStorage.setItem('eventify_account', JSON.stringify({ accountType, role }))
}

export function clearSession() {
    localStorage.removeItem('eventify_token')
    localStorage.removeItem('token')
    localStorage.removeItem('eventify_account')
}

// fetch() wrapper: prefixes the base URL and adds the JSON Accept header and
// the Bearer token (when logged in). Returns the raw Response so each caller
// keeps handling status codes / JSON / blobs the way it needs.
export function apiFetch(path, { headers, ...options } = {}) {
    const token = getToken()
    return fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
    })
}
