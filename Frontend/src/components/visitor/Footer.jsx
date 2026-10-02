import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Footer() {
    const { t } = useTranslation()
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div>
                        <Link className="footer-logo" to="/" aria-label="EVENTIFY home">
                            <span className="material-symbols-outlined logo-icon" style={{ fontVariationSettings: "'FILL' 1" }}>
                                hub
                            </span>
                            <span className="wordmark">EVENTIFY</span>
                        </Link>
                        <p className="desc">{t('footer.desc')}</p>
                        <div className="social-links">
                            <a href="#" aria-label="EVENTIFY on Facebook"><i className="fa-brands fa-facebook-f"></i></a>
                            <a href="#" aria-label="EVENTIFY on Instagram"><i className="fa-brands fa-instagram"></i></a>
                            <a href="#" aria-label="EVENTIFY on LinkedIn"><i className="fa-brands fa-linkedin-in"></i></a>
                            <a href="#" aria-label="EVENTIFY on X"><i className="fa-brands fa-x-twitter"></i></a>
                        </div>
                    </div>
                    <div>
                        <h4>{t('footer.product')}</h4>
                        <ul>
                            <li><Link to="/#opportunities">{t('nav.opportunities')}</Link></li>
                            <li><Link to="/#categories">{t('nav.categories')}</Link></li>
                            <li><Link to="/#rafeeq">{t('nav.rafeeq')}</Link></li>
                            <li><Link to="/auth/organization-verification">{t('footer.forOrganizations')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4>{t('footer.company')}</h4>
                        <ul>
                            <li><Link to="/about">{t('nav.about')}</Link></li>
                            <li><Link to="/contact">{t('nav.contact')}</Link></li>
                            <li><Link to="/#faq">{t('nav.faq')}</Link></li>
                            <li><Link to="/auth/login">{t('nav.login')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4>{t('footer.getInTouch')}</h4>
                        <ul>
                            <li><a href="mailto:hello@eventify.io">hello@eventify.io</a></li>
                            <li><a href="tel:+96265001200">+962 6 500 1200</a></li>
                            <li><Link to="/contact">{t('footer.location')}</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>
                        {t('footer.rights')} &middot;{' '}
                        <Link to="/auth/privacy" style={{ color: 'inherit', textDecoration: 'underline' }}>{t('footer.privacy')}</Link> &middot;{' '}
                        <Link to="/auth/terms" style={{ color: 'inherit', textDecoration: 'underline' }}>{t('footer.terms')}</Link>
                    </p>
                </div>
            </div>
        </footer>
    )
}
