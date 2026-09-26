import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AuthLayout from '../../layouts/AuthLayout'

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const isPhone = (v) => /^[+]?([0-9][\s-()]*){7,15}$/.test(v)

function Visual({ t }) {
    return (
        <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_45%)]"></div>
            <div className="relative z-10 text-white max-w-md space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white/90 text-sm font-semibold">
                    <span className="material-symbols-outlined text-[18px]">shield</span>
                    {t('auth.login.visualBadge')}
                </div>
                <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock_reset</span>
                <h2 className="font-headline-md text-headline-md">{t('auth.forgotPassword.visualTitle')}</h2>
                <p className="font-body-md text-body-md text-white/85">{t('auth.forgotPassword.visualDesc')}</p>
                <div className="grid grid-cols-1 gap-3 pt-2">
                    <div className="flex items-center gap-3 rounded-2xl bg-white/12 backdrop-blur-sm px-4 py-3 border border-white/10">
                        <span className="material-symbols-outlined text-[20px]">timer</span>
                        <span className="text-sm font-medium">{t('auth.forgotPassword.visualPoint1')}</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-white/12 backdrop-blur-sm px-4 py-3 border border-white/10">
                        <span className="material-symbols-outlined text-[20px]">verified_user</span>
                        <span className="text-sm font-medium">{t('auth.forgotPassword.visualPoint2')}</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default function ForgotPassword() {
    const { t } = useTranslation()
    const [identifier, setIdentifier] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [resending, setResending] = useState(false)
    const [sent, setSent] = useState(false)

    function validate(value) {
        const v = value.trim()
        if (!v) return t('auth.common.required')
        const looksLikeEmail = v.includes('@')
        if (looksLikeEmail && !isEmail(v)) return t('auth.common.invalidEmail')
        if (!looksLikeEmail && !isPhone(v)) return t('auth.common.invalidPhone')
        return ''
    }

    function handleSubmit(e) {
        e.preventDefault()
        const err = validate(identifier)
        setError(err)
        if (err) return

        setSubmitting(true)
        window.setTimeout(() => {
            setSubmitting(false)
            setSent(true)
        }, 800)
    }

    function handleResend() {
        setResending(true)
        window.setTimeout(() => setResending(false), 800)
    }

    return (
        <AuthLayout visual={<Visual t={t} />}>
            {!sent ? (
                <div className="relative z-10 max-w-md w-full mx-auto auth-card border border-white/40 rounded-[20px] p-6 sm:p-8">
                    <Link className="inline-flex items-center gap-1 text-on-surface-variant hover:text-primary font-label-md text-label-md mb-5 transition-colors" to="/auth/login">
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span> {t('auth.forgotPassword.backToLogin')}
                    </Link>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-5">
                        <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                        {t('auth.forgotPassword.badge')}
                    </div>
                    <h1 className="font-headline-lg text-headline-lg mb-2">{t('auth.forgotPassword.title')}</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-8">{t('auth.forgotPassword.subtitle')}</p>

                    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                        <div className="flex flex-col gap-2">
                            <label className="font-label-md text-label-md" htmlFor="identifier">{t('auth.login.identifierLabel')}</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">alternate_email</span>
                                <input
                                    className="ev-input h-12 pl-11 pr-4 w-full bg-surface-container-lowest border border-outline-variant rounded-md transition-all"
                                    autoComplete="username"
                                    id="identifier"
                                    placeholder={t('auth.login.identifierPlaceholder')}
                                    type="text"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    onBlur={(e) => setError(validate(e.target.value))}
                                />
                            </div>
                            {error && <p className="text-sm text-error" role="alert">{error}</p>}
                        </div>
                        <button
                            className="w-full h-12 bg-primary text-on-primary rounded-full font-label-lg text-label-lg btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span> {t('auth.forgotPassword.submitting')}
                                </>
                            ) : t('auth.forgotPassword.submit')}
                        </button>
                    </form>
                    <p className="text-center font-body-sm text-body-sm text-on-surface-variant mt-8">
                        {t('auth.forgotPassword.remembered')} <Link className="text-primary font-semibold hover:underline" to="/auth/login">{t('auth.forgotPassword.logIn')}</Link>
                    </p>
                </div>
            ) : (
                <div className="relative z-10 max-w-md w-full mx-auto auth-card border border-white/40 rounded-[20px] p-6 sm:p-8 text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
                        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>mark_email_read</span>
                    </div>
                    <h1 className="font-headline-lg text-headline-lg mb-2">{t('auth.forgotPassword.checkInboxTitle')}</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-8">
                        {t('auth.forgotPassword.checkInboxDesc1')} <span className="font-semibold text-on-surface">{identifier.trim() || t('auth.forgotPassword.thatEmail')}</span>, {t('auth.forgotPassword.checkInboxDesc2')}
                    </p>
                    <button
                        className="w-full h-12 border border-outline-variant rounded-full font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-surface-container-low transition-all bg-white/80 hover:-translate-y-[1px] hover:shadow-sm active:translate-y-0 active:scale-[0.985] mb-3"
                        type="button"
                        disabled={resending}
                        onClick={handleResend}
                    >
                        <span className={`material-symbols-outlined text-[20px] ${resending ? 'animate-spin' : ''}`}>refresh</span>
                        {resending ? t('auth.forgotPassword.resending') : t('auth.forgotPassword.resend')}
                    </button>
                    <Link className="text-primary font-semibold hover:underline font-body-sm text-body-sm" to="/auth/login">{t('auth.forgotPassword.backToLogin')}</Link>
                </div>
            )}
        </AuthLayout>
    )
}
