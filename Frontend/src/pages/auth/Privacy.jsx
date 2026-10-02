import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Privacy() {
    const { t } = useTranslation()
    return (
        <>
            <header className="page-hero">
                <div className="container">
                    <span className="section-tag"><i className="fa-solid fa-lock"></i> {t('legal.tag')}</span>
                    <h1>{t('legal.privacyTitle')}</h1>
                    <p>{t('legal.privacyIntro')}</p>
                </div>
            </header>

            <main id="main" className="section-pad">
                <div className="container">
                    <article className="legal">
                        <span className="updated">{t('legal.updated')}</span>

                        <h2>{t('legal.privacy.h1')}</h2>
                        <p>{t('legal.privacy.p1')}</p>

                        <h2>{t('legal.privacy.h2')}</h2>
                        <ul>
                            <li>{t('legal.privacy.p2li1')}</li>
                            <li>{t('legal.privacy.p2li2')}</li>
                            <li>{t('legal.privacy.p2li3')}</li>
                            <li>{t('legal.privacy.p2li4')}</li>
                        </ul>

                        <h2>{t('legal.privacy.h3')}</h2>
                        <p>{t('legal.privacy.p3')}</p>

                        <h2>{t('legal.privacy.h4')}</h2>
                        <p>{t('legal.privacy.p4')}</p>

                        <h2>{t('legal.privacy.h5')}</h2>
                        <p>{t('legal.privacy.p5')}</p>

                        <h2>{t('legal.privacy.h6')}</h2>
                        <ul>
                            <li>{t('legal.privacy.p6li1')}</li>
                            <li>{t('legal.privacy.p6li2')}</li>
                            <li>{t('legal.privacy.p6li3')}</li>
                        </ul>

                        <h2>{t('legal.privacy.h7')}</h2>
                        <p>{t('legal.privacy.p7')}</p>

                        <h2>{t('legal.privacy.h8')}</h2>
                        <p>
                            {t('legal.privacy.p8')}{' '}
                            <Link to="/contact" style={{ color: 'var(--primary)', fontWeight: 600 }}>{t('legal.contactForm')}</Link>. {t('legal.privacy.p8b')}
                        </p>
                    </article>
                </div>
            </main>
        </>
    )
}
