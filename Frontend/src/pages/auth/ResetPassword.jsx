import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AuthLayout from '../../layouts/AuthLayout'

function getPasswordStrength(value) {
    if (value.length < 8) return 'weak'
    const score = [/[a-zA-Z]/.test(value), /\d/.test(value), /[^a-zA-Z\d]/.test(value)].filter(Boolean).length
    return score <= 1 ? 'medium' : 'strong'
}

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
                <h2 className="font-headline-md text-headline-md">{t('auth.resetPassword.visualTitle')}</h2>
                <p className="font-body-md text-body-md text-white/85">{t('auth.resetPassword.visualDesc')}</p>
            </div>
        </>
    )
}

function PasswordField({ id, label, value, onChange, onBlur, error, show, onToggle, t, autoComplete = 'new-password' }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="font-label-md text-label-md" htmlFor={id}>{label}</label>
            <div className="relative">
                <input
                    className="ev-input h-12 px-4 pr-12 w-full bg-surface-container-lowest border border-outline-variant rounded-md transition-all"
                    autoComplete={autoComplete}
                    id={id}
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? `${id}-error` : undefined}
                />
                <button
                    aria-label={t('auth.common.showPassword')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                    type="button"
                    onClick={onToggle}
                >
                    <span className="material-symbols-outlined text-[20px]">{show ? 'visibility' : 'visibility_off'}</span>
                </button>
            </div>
            {error && <p id={`${id}-error`} className="text-sm text-error" role="alert">{error}</p>}
        </div>
    )
}

export default function ResetPassword() {
    const { t } = useTranslation()
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [done, setDone] = useState(false)

    const strength = getPasswordStrength(password)

    function validatePassword(value) {
        if (!value) return t('auth.common.required')
        if (value.length < 8) return t('auth.signup.passwordTooShort')
        return ''
    }

    function validateConfirm(value, current = password) {
        if (!value) return t('auth.common.required')
        if (value !== current) return t('auth.signup.passwordMismatch')
        return ''
    }

    function handleSubmit(e) {
        e.preventDefault()
        const next = { password: validatePassword(password), confirm: validateConfirm(confirm) }
        setErrors(next)
        if (next.password || next.confirm) return

        setSubmitting(true)
        window.setTimeout(() => {
            setSubmitting(false)
            setDone(true)
        }, 800)
    }

    return (
        <AuthLayout visual={<Visual t={t} />}>
            {!done ? (
                <div className="relative z-10 max-w-md w-full mx-auto auth-card border border-white/40 rounded-[20px] p-6 sm:p-8">
                    <Link className="flex w-fit items-center gap-1 text-on-surface-variant hover:text-primary font-label-md text-label-md mb-5 transition-colors" to="/auth/login">
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span> {t('auth.forgotPassword.backToLogin')}
                    </Link>
                    <div className="flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-5">
                        <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                        {t('auth.resetPassword.badge')}
                    </div>
                    <h1 className="font-headline-lg text-headline-lg mb-2">{t('auth.resetPassword.title')}</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-8">{t('auth.resetPassword.subtitle')}</p>

                    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                        <div className="flex flex-col gap-2">
                            <PasswordField
                                id="new-password"
                                label={t('auth.resetPassword.newPasswordLabel')}
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((p) => ({ ...p, password: '' })) }}
                                onBlur={(e) => setErrors((p) => ({ ...p, password: validatePassword(e.target.value) }))}
                                error={errors.password}
                                show={showPassword}
                                onToggle={() => setShowPassword((s) => !s)}
                                t={t}
                            />
                            {password && (
                                <p className="text-sm text-on-surface-variant">
                                    {t('auth.signup.strengthLabel')}{' '}
                                    <span className={`font-semibold ${strength === 'weak' ? 'text-error' : strength === 'medium' ? 'text-amber-600' : 'text-emerald-600'}`}>
                                        {t(`auth.signup.strength.${strength}`)}
                                    </span>
                                </p>
                            )}
                        </div>
                        <PasswordField
                            id="confirm-new-password"
                            label={t('auth.resetPassword.confirmPasswordLabel')}
                            value={confirm}
                            onChange={(e) => { setConfirm(e.target.value); if (errors.confirm) setErrors((p) => ({ ...p, confirm: '' })) }}
                            onBlur={(e) => setErrors((p) => ({ ...p, confirm: validateConfirm(e.target.value) }))}
                            error={errors.confirm}
                            show={showConfirm}
                            onToggle={() => setShowConfirm((s) => !s)}
                            t={t}
                        />
                        <button
                            className="w-full h-12 bg-primary text-on-primary rounded-full font-label-lg text-label-lg btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span> {t('auth.resetPassword.submitting')}
                                </>
                            ) : t('auth.resetPassword.submit')}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="relative z-10 max-w-md w-full mx-auto auth-card border border-white/40 rounded-[20px] p-6 sm:p-8 text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
                        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <h1 className="font-headline-lg text-headline-lg mb-2">{t('auth.resetPassword.successTitle')}</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-8">{t('auth.resetPassword.successDesc')}</p>
                    <Link
                        className="w-full h-12 bg-primary text-on-primary rounded-full font-label-lg text-label-lg btn-primary flex items-center justify-center"
                        to="/auth/login"
                    >
                        {t('auth.resetPassword.goToLogin')}
                    </Link>
                </div>
            )}
        </AuthLayout>
    )
}
