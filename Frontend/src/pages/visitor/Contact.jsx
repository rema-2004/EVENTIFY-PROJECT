import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

export default function Contact() {
    const { t } = useTranslation()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [subject, setSubject] = useState('general')
    const [message, setMessage] = useState('')
    const [errors, setErrors] = useState({ name: false, email: false, message: false })
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    function handleSubmit(e) {
        e.preventDefault()
        const nameValid = name.trim().length > 0
        const emailValid = isEmail(email.trim())
        const messageValid = message.trim().length > 0
        setErrors({ name: !nameValid, email: !emailValid, message: !messageValid })
        if (!nameValid || !emailValid || !messageValid) return

        setSubmitting(true)
        window.setTimeout(() => {
            setSubmitting(false)
            setName('')
            setEmail('')
            setSubject('general')
            setMessage('')
            setSuccess(true)
        }, 800)
    }

    return (
        <>
            <header className="page-hero">
                <div className="container">
                    <span className="section-tag"><i className="fa-solid fa-envelope"></i> {t('contact.tag')}</span>
                    <h1>{t('contact.title')}</h1>
                    <p>{t('contact.intro')}</p>
                </div>
            </header>

            <main id="main" className="section-pad">
                <div className="container">
                    <div className="contact-grid">
                        <div className="reveal">
                            <div className="contact-info-card">
                                <span className="contact-icon"><i className="fa-solid fa-envelope"></i></span>
                                <div>
                                    <h4>{t('contact.emailTitle')}</h4>
                                    <p>hello@eventify.io<br />{t('contact.emailDesc')}</p>
                                </div>
                            </div>
                            <div className="contact-info-card">
                                <span className="contact-icon"><i className="fa-solid fa-phone"></i></span>
                                <div>
                                    <h4>{t('contact.callTitle')}</h4>
                                    <p>+962 6 500 1200<br />{t('contact.callDesc')}</p>
                                </div>
                            </div>
                            <div className="contact-info-card">
                                <span className="contact-icon"><i className="fa-solid fa-location-dot"></i></span>
                                <div>
                                    <h4>{t('contact.visitTitle')}</h4>
                                    <p>{t('contact.visitDesc1')}<br />{t('contact.visitDesc2')}</p>
                                </div>
                            </div>
                            <div className="contact-info-card">
                                <span className="contact-icon"><i className="fa-solid fa-building"></i></span>
                                <div>
                                    <h4>{t('contact.orgTitle')}</h4>
                                    <p>
                                        {t('contact.orgDesc')}{' '}
                                        <Link to="/auth/organization-verification" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                                            {t('contact.orgLink')}
                                        </Link>.
                                    </p>
                                </div>
                            </div>
                            <div className="contact-social">
                                <a href="#" aria-label="EVENTIFY on Facebook"><i className="fa-brands fa-facebook-f"></i></a>
                                <a href="#" aria-label="EVENTIFY on Instagram"><i className="fa-brands fa-instagram"></i></a>
                                <a href="#" aria-label="EVENTIFY on LinkedIn"><i className="fa-brands fa-linkedin-in"></i></a>
                                <a href="#" aria-label="EVENTIFY on X"><i className="fa-brands fa-x-twitter"></i></a>
                            </div>
                        </div>

                        <form className="contact-form reveal" onSubmit={handleSubmit} noValidate>
                            <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>{t('contact.formTitle')}</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
                                {t('contact.formSubtitle')}
                            </p>

                            <div className="form-row">
                                <div className={`form-field${errors.name ? ' has-error' : ''}`}>
                                    <label htmlFor="name">{t('contact.nameLabel')}</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        placeholder={t('contact.namePlaceholder')}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    <span className="form-error">{t('contact.nameError')}</span>
                                </div>
                                <div className={`form-field${errors.email ? ' has-error' : ''}`}>
                                    <label htmlFor="email">{t('contact.emailLabel')}</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <span className="form-error">{t('contact.emailError')}</span>
                                </div>
                            </div>

                            <div className="form-field">
                                <label htmlFor="subject">{t('contact.subjectLabel')}</label>
                                <select id="subject" name="subject" value={subject} onChange={(e) => setSubject(e.target.value)}>
                                    <option value="general">{t('contact.subjectGeneral')}</option>
                                    <option value="account">{t('contact.subjectAccount')}</option>
                                    <option value="publish">{t('contact.subjectPublish')}</option>
                                    <option value="verification">{t('contact.subjectVerification')}</option>
                                    <option value="report">{t('contact.subjectReport')}</option>
                                </select>
                            </div>

                            <div className={`form-field${errors.message ? ' has-error' : ''}`}>
                                <label htmlFor="message">{t('contact.messageLabel')}</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    placeholder={t('contact.messagePlaceholder')}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                ></textarea>
                                <span className="form-error">{t('contact.messageError')}</span>
                            </div>

                            <button className="btn btn-primary" type="submit" disabled={submitting}>
                                <span>{submitting ? t('contact.sending') : t('contact.send')}</span> <i className="fa-solid fa-paper-plane"></i>
                            </button>

                            <div className={`form-success${success ? ' show' : ''}`} role="status">
                                <i className="fa-solid fa-circle-check"></i>
                                <p>{t('contact.successMessage')}</p>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    )
}
