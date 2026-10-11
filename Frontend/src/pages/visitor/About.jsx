import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../hooks/useLanguage'
import AnimatedCounter from '../../components/shared/AnimatedCounter'

export default function About() {
    const { t } = useTranslation()
    const { language } = useLanguage()
    const ar = language === 'ar'

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
                {/* Core Values */}
                <section className="section-pad">
                    <div className="container">
                        <div className="section-head center reveal">
                            <span className="section-tag"><i className="fa-solid fa-heart"></i> {t('about.valuesTag')}</span>
                            <h2>{t('about.valuesTitle')}</h2>
                            <p>{t('about.valuesSubtitle')}</p>
                        </div>
                        <div className="why-grid reveal-stagger">
                            <div className="why-card" style={{ '--stagger-idx': 0 }}>
                                <div className="why-icon"><i className="fa-solid fa-scale-balanced"></i></div>
                                <h3>{t('about.value1Title')}</h3>
                                <p>{t('about.value1Desc')}</p>
                            </div>
                            <div className="why-card" style={{ '--stagger-idx': 1 }}>
                                <div className="why-icon"><i className="fa-solid fa-eye"></i></div>
                                <h3>{t('about.value2Title')}</h3>
                                <p>{t('about.value2Desc')}</p>
                            </div>
                            <div className="why-card" style={{ '--stagger-idx': 2 }}>
                                <div className="why-icon"><i className="fa-solid fa-shield-halved"></i></div>
                                <h3>{t('about.value3Title')}</h3>
                                <p>{t('about.value3Desc')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How Eventify Works (3-Step Pipeline) */}
                <section className="section-pad" style={{ background: 'rgba(255, 77, 46, 0.02)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                    <div className="container">
                        <div className="section-head center reveal">
                            <span className="section-tag" style={{ background: 'rgba(255,77,46,0.1)', color: '#FF4D2E' }}>
                                <i className="fa-solid fa-wand-magic-sparkles"></i> {ar ? 'كيف تعمل المنصة' : 'How It Works'}
                            </span>
                            <h2>{ar ? 'خطوات بسيطة من التهيئة حتى الفوز' : 'Simple Steps From Setup to Winning'}</h2>
                            <p>{ar ? 'صممنا رحلة الطالب لتكون في غاية السلاسة والسرعة والذكاء' : 'We designed the student journey to be seamless, intelligent, and fast.'}</p>
                        </div>
                        <div className="why-grid reveal-stagger">
                            <div className="why-card" style={{ '--stagger-idx': 0, borderTop: '3px solid #FF4D2E' }}>
                                <div className="why-icon" style={{ background: 'rgba(255,77,46,0.12)', color: '#FF4D2E' }}>
                                    <i className="fa-solid fa-file-invoice"></i>
                                </div>
                                <h3>{ar ? '1. جهّز ملفك في 30 ثانية' : '1. Setup in 30 Seconds'}</h3>
                                <p>{ar ? 'ارفع سيرتك الذاتية لتقرأ تلقائياً بالذكاء الاصطناعي، أو أجب على استبيان سريع وسلس.' : 'Upload your resume for instant AI parsing, or complete our quick 3-step questionnaire.'}</p>
                            </div>
                            <div className="why-card" style={{ '--stagger-idx': 1, borderTop: '3px solid #3B82F6' }}>
                                <div className="why-icon" style={{ background: 'rgba(59,130,246,0.12)', color: '#3B82F6' }}>
                                    <i className="fa-solid fa-brain"></i>
                                </div>
                                <h3>{ar ? '2. مطابقة ذكية مع رفيق AI' : '2. Smart Match With Rafeeq'}</h3>
                                <p>{ar ? 'يحلل محرك الذكاء الاصطناعي مهاراتك ويطابقك مع أفضل الهاكاثونات والفرص بدقة تصل إلى 98%.' : 'Our AI engine calculates high-accuracy match percentages for competitions tailored to your skills.'}</p>
                            </div>
                            <div className="why-card" style={{ '--stagger-idx': 2, borderTop: '3px solid #10B981' }}>
                                <div className="why-icon" style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981' }}>
                                    <i className="fa-solid fa-trophy"></i>
                                </div>
                                <h3>{ar ? '3. كوّن فريقك وافز بالجوائز' : '3. Form Teams & Win'}</h3>
                                <p>{ar ? 'ابحث عن زملاء يكملون مهاراتك، نافس في الفعاليات، واحصل على شهاداتك الموثقة تلقائياً.' : 'Connect with complementary teammates, enter hackathons, and receive auto-verified digital certificates.'}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Story & Metrics */}
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
                                <div className="story-stat" style={{ '--stagger-idx': 0 }}>
                                    <h3><AnimatedCounter value={2024} /></h3>
                                    <p>{t('about.stat1')}</p>
                                </div>
                                <div className="story-stat" style={{ '--stagger-idx': 1 }}>
                                    <h3><AnimatedCounter value={12400} suffix="+" /></h3>
                                    <p>{t('about.stat2')}</p>
                                </div>
                                <div className="story-stat" style={{ '--stagger-idx': 2 }}>
                                    <h3><AnimatedCounter value={312} /></h3>
                                    <p>{t('about.stat3')}</p>
                                </div>
                                <div className="story-stat" style={{ '--stagger-idx': 3 }}>
                                    <h3><AnimatedCounter value={1742} /></h3>
                                    <p>{t('about.stat4')}</p>
                                </div>
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
