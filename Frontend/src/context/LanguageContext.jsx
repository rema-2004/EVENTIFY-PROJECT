import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RTL_LANGUAGES } from '../i18n'
import { LanguageContext } from './language-context'

function applyDirection(lang) {
    const normalizedLanguage = lang?.toLowerCase()
    const isRtl = RTL_LANGUAGES.some(
        (rtlLanguage) => normalizedLanguage === rtlLanguage || normalizedLanguage?.startsWith(`${rtlLanguage}-`),
    )
    const dir = isRtl ? 'rtl' : 'ltr'
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
                isRtl: RTL_LANGUAGES.some((rtlLanguage) =>
                    i18n.language?.toLowerCase().startsWith(rtlLanguage),
                ),
                setLanguage,
                toggleLanguage,
            }}
        >
            {children}
        </LanguageContext.Provider>
    )
}
