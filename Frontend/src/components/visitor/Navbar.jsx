import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../context/LanguageContext'

// Theme toggling is wired globally in ThemeProvider (any ".theme-toggle" click), matching
// the delegated click-listener pattern the original theme.js used site-wide.
export default function Navbar() {
    const { t } = useTranslation()
    const { language, toggleLanguage } = useLanguage()

    return (
        <nav className="navbar" id="navbar">
            <div className="container">
                <Link className="logo" to="/" aria-label="EVENTIFY home">
                    <span className="material-symbols-outlined logo-icon" style={{ fontVariationSettings: "'FILL' 1" }}>
                        hub
                    </span>
                    <span className="wordmark">EVENTIFY</span>
                </Link>
                <div className="nav-links" id="navLinks">
                    <Link to="/">{t('nav.home')}</Link>
                    <Link to="/#opportunities">{t('nav.opportunities')}</Link>
                    <Link to="/#categories">{t('nav.categories')}</Link>
                    <Link to="/#rafeeq">{t('nav.rafeeq')}</Link>
                    <Link to="/#faq">{t('nav.faq')}</Link>
                    <Link to="/about">{t('nav.about')}</Link>
                    <Link to="/contact">{t('nav.contact')}</Link>
                </div>
                <div className="nav-buttons">
                    <button
                        className="lang-toggle"
                        type="button"
                        aria-label={t('nav.toggleLanguage')}
                        onClick={toggleLanguage}
                    >
                        {language === 'ar' ? 'EN' : 'AR'}
                    </button>
                    <button className="theme-toggle" id="themeToggle" type="button" aria-label={t('nav.toggleTheme')}>
                        <i className="fa-solid fa-moon"></i>
                        <i className="fa-solid fa-sun"></i>
                    </button>
                    <Link className="btn btn-secondary btn-sm" to="/auth/login">{t('nav.login')}</Link>
                    <Link className="btn btn-primary btn-sm" to="/auth/signup">{t('nav.getStarted')}</Link>
                </div>
                <button className="mobile-menu" id="mobileMenu" type="button" aria-label={t('nav.openMenu')} aria-expanded="false">
                    <i className="fa-solid fa-bars"></i>
                </button>
            </div>
        </nav>
    )
}
