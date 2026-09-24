import { createContext, useCallback, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RTL_LANGUAGES } from '../i18n'

const LanguageContext = createContext(undefined)

function applyDirection(lang) {
    const dir = RTL_LANGUAGES.includes(lang) ? 'rtl' : 'ltr'
    document.documentElement.dir = dir
    document.documentElement.lang = lang
}

export function LanguageProvider({ children }) {
    const { i18n } = useTranslation()

    useEffect(() => {
        applyDirection(i18n.language)
        const onChange = (lang) => applyDirection(lang)
        i18n.on('languageChanged', onChange)
        return () => i18n.off('languageChanged', onChange)
    }, [i18n])

    const setLanguage = useCallback((lang) => i18n.changeLanguage(lang), [i18n])
    const toggleLanguage = useCallback(() => {
        i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')
    }, [i18n])

    return (
        <LanguageContext.Provider
            value={{
                language: i18n.language,
                isRtl: RTL_LANGUAGES.includes(i18n.language),
                setLanguage,
                toggleLanguage,
            }}
        >
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const ctx = useContext(LanguageContext)
    if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
    return ctx
}
