import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * Shared footer for participant pages.
 * CSS is defined in app-shell.css (class .footer).
 */
export default function AppFooter() {
    const { t } = useTranslation()

    return (
        <footer className="footer">
            <div className="container max-w-[1280px] mx-auto px-container-margin-mobile md:px-container-margin-desktop">
                <div className="footer-grid">
                    <div>
                        <Link
                            to="/app"
                            className="footer-logo"
                            aria-label="EVENTIFY home"
                        >
                            <span
                                className="material-symbols-outlined text-4xl"
                                style={{ fontVariationSettings: '"FILL" 1' }}
                            >
                                hub
                            </span>
                            <span className="font-headline-md text-headline-md font-black">
                                EVENTIFY
                            </span>
                        </Link>
                        <p className="desc">
                            {t('appFooter.description')}
                        </p>
                        <div className="social-links">
                            <a href="#" aria-label="Facebook">
                                <span className="material-symbols-outlined text-[18px]">
                                    thumb_up
                                </span>
                            </a>
                            <a href="#" aria-label="Instagram">
                                <span className="material-symbols-outlined text-[18px]">
                                    photo_camera
                                </span>
                            </a>
                            <a href="#" aria-label="LinkedIn">
                                <span className="material-symbols-outlined text-[18px]">
                                    business_center
                                </span>
                            </a>
                            <a href="#" aria-label="Email">
                                <span className="material-symbols-outlined text-[18px]">
                                    mail
                                </span>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h4>{t('appFooter.explore')}</h4>
                        <ul>
                            <li>
                                <Link to="/app">{t('appNav.home')}</Link>
                            </li>
                            <li>
                                <Link to="/app/explore">{t('appNav.explore')}</Link>
                            </li>
                            <li>
                                <Link to="/app/posts">{t('appNav.posts')}</Link>
                            </li>
                            <li>
                                <Link to="/app/my-applications">{t('appNav.myEvent')}</Link>
                            </li>
                            <li>
                                <Link to="/app/notifications">{t('appNav.notifications')}</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4>{t('appFooter.support')}</h4>
                        <ul>
                            <li>
                                <Link to="/about">{t('appFooter.about')}</Link>
                            </li>
                            <li>
                                <Link to="/#faq">{t('appFooter.faq')}</Link>
                            </li>
                            <li>
                                <Link to="/contact">{t('appFooter.contact')}</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>© {new Date().getFullYear()} EVENTIFY. All rights reserved.</span>
                    <span>·</span>
                    <Link to="/auth/privacy">{t('appFooter.privacy')}</Link>
                    <span>·</span>
                    <Link to="/auth/terms">{t('appFooter.terms')}</Link>
                </div>
            </div>
        </footer>
    )
}
