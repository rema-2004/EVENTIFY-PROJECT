import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
    const { t } = useTranslation()
    return (
        <>
            <header className="page-hero">
                <div className="container">
                    <span className="section-tag"><i className="fa-solid fa-compass"></i> {t('notFound.tag')}</span>
                    <h1>{t('notFound.title')}</h1>
                    <p>{t('notFound.desc')}</p>
                </div>
            </header>

            <main id="main" className="section-pad">
                <div className="container">
                    <div className="legal" style={{ textAlign: 'center' }}>
                        <h2 style={{ marginBottom: '20px' }}>{t('notFound.tryTitle')}</h2>
                        <div className="cta-buttons" style={{ justifyContent: 'center' }}>
                            <Link className="btn btn-primary btn-lg" to="/">
                                {t('notFound.backHome')} <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                            <Link className="btn btn-secondary btn-lg" to="/#opportunities">{t('notFound.browse')}</Link>
                            <Link className="btn btn-secondary btn-lg" to="/contact">{t('notFound.report')}</Link>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
