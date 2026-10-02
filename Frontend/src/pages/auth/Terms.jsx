import { useTranslation } from 'react-i18next'

export default function Terms() {
    const { t } = useTranslation()
    return (
        <>
            <header className="page-hero">
                <div className="container">
                    <span className="section-tag"><i className="fa-solid fa-scale-balanced"></i> {t('legal.tag')}</span>
                    <h1>{t('legal.termsTitle')}</h1>
                    <p>{t('legal.termsIntro')}</p>
                </div>
            </header>

            <main id="main" className="section-pad">
                <div className="container">
                    <article className="legal">
                        <span className="updated">{t('legal.updated')}</span>

                        <h2>{t('legal.terms.h1')}</h2>
                        <p>{t('legal.terms.p1')}</p>

                        <h2>{t('legal.terms.h2')}</h2>
                        <p>{t('legal.terms.p2')}</p>

                        <h2>{t('legal.terms.h3')}</h2>
                        <ul>
                            <li>{t('legal.terms.p3li1')}</li>
                            <li>{t('legal.terms.p3li2')}</li>
                            <li>{t('legal.terms.p3li3')}</li>
                        </ul>

                        <h2>{t('legal.terms.h4')}</h2>
                        <ul>
                            <li>{t('legal.terms.p4li1')}</li>
                            <li>{t('legal.terms.p4li2')}</li>
                            <li>{t('legal.terms.p4li3')}</li>
                        </ul>

                        <h2>{t('legal.terms.h5')}</h2>
                        <p>{t('legal.terms.p5')}</p>

                        <h2>{t('legal.terms.h6')}</h2>
                        <p>{t('legal.terms.p6')}</p>

                        <h2>{t('legal.terms.h7')}</h2>
                        <p>{t('legal.terms.p7')}</p>

                        <h2>{t('legal.terms.h8')}</h2>
                        <p>{t('legal.terms.p8')}</p>

                        <h2>{t('legal.terms.h9')}</h2>
                        <p>{t('legal.terms.p9')}</p>
                    </article>
                </div>
            </main>
        </>
    )
}
