import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function About() {
    const { t } = useTranslation()
    return (
        <>
            <header className="page-hero">
                <div className="container">
                    <span className="section-tag"><i className="fa-solid fa-compass"></i> {t('about.tag')}</span>
                    <h1>{t('about.title')}</h1>
                    <p>{t('about.intro')}</p>
                </div>
            </header>

            <main id="main">
                <section className="section-pad">
                    <div className="container">
                        <div className="section-head center reveal">
                            <span className="section-tag"><i className="fa-solid fa-heart"></i> {t('about.valuesTag')}</span>
                            <h2>{t('about.valuesTitle')}</h2>
                            <p>{t('about.valuesSubtitle')}</p>
                        </div>
                        <div className="why-grid reveal-stagger">
                            <div className="why-card">
                                <div className="why-icon"><i className="fa-solid fa-scale-balanced"></i></div>
                                <h3>{t('about.value1Title')}</h3>
                                <p>{t('about.value1Desc')}</p>
                            </div>
                            <div className="why-card">
                                <div className="why-icon"><i className="fa-solid fa-eye"></i></div>
                                <h3>{t('about.value2Title')}</h3>
                                <p>{t('about.value2Desc')}</p>
                            </div>
                            <div className="why-card">
                                <div className="why-icon"><i className="fa-solid fa-shield-halved"></i></div>
                                <h3>{t('about.value3Title')}</h3>
                                <p>{t('about.value3Desc')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section-pad">
                    <div className="container">
                        <div className="story-grid">
                            <div className="story-copy reveal">
                                <span className="section-tag"><i className="fa-solid fa-book-open"></i> {t('about.storyTag')}</span>
                                <h2 style={{ fontSize: 'clamp(26px,3vw,36px)', marginBottom: '18px' }}>
                                    {t('about.storyTitle')}
                                </h2>
                                <p>{t('about.storyP1')}</p>
                                <p>{t('about.storyP2')}</p>
                                <p>{t('about.storyP3')}</p>
                                <Link className="btn btn-primary" to="/auth/signup">
                                    {t('about.joinCta')} <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                            </div>
                            <div className="story-stats reveal-stagger">
                                <div className="story-stat"><h3>2024</h3><p>{t('about.stat1')}</p></div>
                                <div className="story-stat"><h3>12,400+</h3><p>{t('about.stat2')}</p></div>
                                <div className="story-stat"><h3>312</h3><p>{t('about.stat3')}</p></div>
                                <div className="story-stat"><h3>1,742</h3><p>{t('about.stat4')}</p></div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="cta-section">
                    <div className="container">
                        <div className="cta-box reveal">
                            <span className="section-tag"><i className="fa-solid fa-rocket"></i> {t('about.ctaTag')}</span>
                            <h2>{t('about.ctaTitle')}</h2>
                            <p>{t('about.ctaSubtitle')}</p>
                            <div className="cta-buttons">
                                <Link className="btn btn-light btn-lg" to="/auth/signup">
                                    {t('about.ctaCreate')} <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                                <Link className="btn btn-light btn-lg" to="/contact">{t('about.ctaTalk')}</Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
