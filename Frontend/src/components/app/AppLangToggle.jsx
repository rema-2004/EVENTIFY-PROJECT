import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../hooks/useLanguage'

/** Language toggle for participant headers — same look and behavior as the visitor Navbar button. */
export default function AppLangToggle({ className = '' }) {
    const { t } = useTranslation()
    const { language, toggleLanguage } = useLanguage()

    return (
        <button
            className={`h-10 px-4 rounded-xl flex items-center justify-center font-bold text-sm text-on-surface-variant border border-outline-variant hover:text-primary hover:border-primary transition-colors ${className}`.trim()}
            type="button"
            aria-label={t('nav.toggleLanguage')}
            onClick={toggleLanguage}
        >
            {language?.startsWith('ar') ? 'AR' : 'EN'}
        </button>
    )
}
