import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(undefined)

// Both keys have historically been used across the static pages; keep them
// in sync so a preference saved by either code path still applies.
const LEGACY_KEY = 'eventify-theme'
const KEY = 'theme'

function readInitialTheme() {
    if (typeof window === 'undefined') return 'light'
    const saved = window.localStorage.getItem(KEY) || window.localStorage.getItem(LEGACY_KEY)
    if (saved === 'dark' || saved === 'light') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyThemeToDocument(theme) {
    const root = document.documentElement
    const isDark = theme === 'dark'
    root.classList.toggle('dark', isDark)
    root.classList.toggle('light', !isDark)
    if (isDark) root.setAttribute('data-theme', 'dark')
    else root.removeAttribute('data-theme')

    document.body.style.setProperty('background-color', isDark ? '#0b0c0e' : '#fafaf8', 'important')
    document.body.style.setProperty('color', isDark ? '#fafaf8' : '#0b0c0e', 'important')
}

export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState(readInitialTheme)

    useEffect(() => {
        applyThemeToDocument(theme)
        window.localStorage.setItem(KEY, theme)
        window.localStorage.setItem(LEGACY_KEY, theme)
    }, [theme])

    const setTheme = useCallback((next) => setThemeState(next), [])
    const toggleTheme = useCallback(() => {
        setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
    }, [])

    // Delegated listener so any element with the ".theme-toggle" class works without
    // per-instance wiring — mirrors the original theme.js click-delegation pattern.
    useEffect(() => {
        const handler = (e) => {
            if (e.target?.closest('.theme-toggle')) toggleTheme()
        }
        document.body.addEventListener('click', handler)
        return () => document.body.removeEventListener('click', handler)
    }, [toggleTheme])

    return (
        <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const ctx = useContext(ThemeContext)
    if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
    return ctx
}
