import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
                <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
                <h2 className="font-headline-md text-headline-md">{t('auth.login.visualTitle')}</h2>
                <p className="font-body-md text-body-md text-white/85">{t('auth.login.visualDesc')}</p>
                <div className="grid grid-cols-1 gap-3 pt-2">
                    <div className="flex items-center gap-3 rounded-2xl bg-white/12 backdrop-blur-sm px-4 py-3 border border-white/10">
                        <span className="material-symbols-outlined text-[20px]">verified</span>
                        <span className="text-sm font-medium">{t('auth.login.visualPoint1')}</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-white/12 backdrop-blur-sm px-4 py-3 border border-white/10">
                        <span className="material-symbols-outlined text-[20px]">schedule</span>
                        <span className="text-sm font-medium">{t('auth.login.visualPoint2')}</span>
                    </div>
                </div>
            </div>
        </>
    )
}

const ROLES = [
    { id: 'participant', icon: 'person', dest: '/app', field: { type: 'text', autoComplete: 'username', icon: 'contact_mail' } },
    { id: 'organization', icon: 'apartment', dest: '/org', field: { type: 'email', autoComplete: 'username', icon: 'business' } },
]

export default function Login() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const [role, setRole] = useState('participant')
    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [identifierError, setIdentifierError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [authError, setAuthError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const roleConfig = ROLES.find((r) => r.id === role)

    function validateIdentifier(value) {
        const v = value.trim()
        if (!v) return t('auth.common.required')
        if (role === 'participant') {
            if (!isEmail(v) && !isPhone(v)) return t('auth.common.invalidEmailOrPhone')
            return ''
        }
        if (!isEmail(v)) return t('auth.common.invalidEmail')
        return ''
    }

    function validatePassword(value) {
        return value.trim() ? '' : t('auth.common.required')
    }

    function handleRoleChange(nextRole) {
        setRole(nextRole)
        setIdentifier('')
        setIdentifierError('')
        setAuthError('')
    }

    function handleSubmit(e) {
        e.preventDefault()
        const idErr = validateIdentifier(identifier)
        const pwErr = validatePassword(password)
        setIdentifierError(idErr)
        setPasswordError(pwErr)
        setAuthError('')
        if (idErr || pwErr) return

        const idValue = identifier.trim().toLowerCase()
        const pwValue = password.trim().toLowerCase()
        if (idValue === 'error@example.com' || pwValue === 'invalidpass') {
            setAuthError(t('auth.login.invalidCredentials'))
            return
        }

        setSubmitting(true)
        window.setTimeout(() => {
            setSubmitting(false)
            navigate(roleConfig.dest)
        }, 800)
    }

    const canSubmit = identifier.trim() && password.trim()

    return (
        <AuthLayout visual={<Visual t={t} />}>
            <div className="relative z-10 max-w-md w-full mx-auto auth-card border border-white/40 rounded-[20px] p-6 sm:p-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-5">
                    <span className="material-symbols-outlined text-[18px]">lock</span>
                    {t('auth.common.secureAccess')}
                </div>
                <h1 className="font-headline-lg text-headline-lg mb-2">{t('auth.login.title')}</h1>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">{t('auth.login.subtitle')}</p>

                <div className="mb-6">
                    <span className="font-label-md text-label-md block mb-2">{t('auth.login.roleLabel')}</span>
                    <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={t('auth.login.roleLabel')}>
                        {ROLES.map((r) => (
                            <button
                                key={r.id}
                                aria-checked={role === r.id}
                                className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-md border-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-sm active:translate-y-0 active:scale-95 ${role === r.id ? 'border-primary bg-primary/5' : 'border-outline-variant'}`}
                                role="radio"
                                type="button"
                                onClick={() => handleRoleChange(r.id)}
                            >
                                <span className={`material-symbols-outlined text-[22px] ${role === r.id ? 'text-primary' : 'text-on-surface-variant'}`} style={role === r.id ? { fontVariationSettings: "'FILL' 1" } : undefined}>{r.icon}</span>
                                <span className="font-label-sm text-label-sm text-on-surface font-semibold text-center">{t(`auth.login.role${r.id.charAt(0).toUpperCase()}${r.id.slice(1)}`)}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                    <div className="flex flex-col gap-2">
                        <label className="font-label-md text-label-md" htmlFor="identifier">{t(`auth.login.identifierLabel${role.charAt(0).toUpperCase()}${role.slice(1)}`)}</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">{roleConfig.field.icon}</span>
                            <input
                                className="ev-input h-12 pl-11 pr-4 w-full bg-surface-container-lowest border border-outline-variant rounded-md transition-all"
                                autoComplete={roleConfig.field.autoComplete}
                                id="identifier"
                                placeholder={t(`auth.login.identifierPlaceholder${role.charAt(0).toUpperCase()}${role.slice(1)}`)}
                                type={roleConfig.field.type}
                                value={identifier}
                                onChange={(e) => { setIdentifier(e.target.value); setAuthError('') }}
                                onBlur={(e) => setIdentifierError(validateIdentifier(e.target.value))}
                            />
                        </div>
                        {identifierError && <p className="text-sm text-error" role="alert">{identifierError}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-label-md text-label-md" htmlFor="password">{t('auth.login.passwordLabel')}</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">key</span>
                            <input
                                className="ev-input h-12 pl-11 pr-12 w-full bg-surface-container-lowest border border-outline-variant rounded-md transition-all"
                                autoComplete="current-password"
                                id="password"
                                placeholder="••••••••"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setAuthError('') }}
                                onBlur={(e) => setPasswordError(validatePassword(e.target.value))}
                            />
                            <button
                                aria-label={t('auth.common.showPassword')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                            >
                                <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility' : 'visibility_off'}</span>
                            </button>
                        </div>
                        {passwordError && <p className="text-sm text-error" role="alert">{passwordError}</p>}
                        {authError && <p className="text-sm text-error" role="alert">{authError}</p>}
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <label className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
                            <input className="rounded border-outline-variant text-primary" type="checkbox" /> {t('auth.login.rememberMe')}
                        </label>
                        <Link className="font-label-md text-label-md text-primary hover:underline" to="/auth/forgot-password">{t('auth.login.forgotPassword')}</Link>
                    </div>

                    <button
                        className="w-full h-12 bg-primary text-on-primary rounded-full font-label-lg text-label-lg btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        type="submit"
                        disabled={!canSubmit || submitting}
                    >
                        {submitting ? (
                            <>
                                <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span> {t('auth.login.submitting')}
                            </>
                        ) : t('auth.login.submit')}
                    </button>
                </form>

                {role === 'participant' && (
                    <>
                        <div className="flex items-center gap-4 my-8">
                            <div className="flex-1 h-px bg-outline-variant"></div>
                            <span className="font-label-sm text-on-surface-variant">{t('auth.common.or')}</span>
                            <div className="flex-1 h-px bg-outline-variant"></div>
                        </div>

                        <button className="w-full h-12 border border-outline-variant rounded-full font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-surface-container-low transition-all bg-white/80 hover:-translate-y-[1px] hover:shadow-sm active:translate-y-0 active:scale-[0.985]" type="button">
                            <span className="material-symbols-outlined text-[20px]">mail</span> {t('auth.common.continueGoogle')}
                        </button>
                    </>
                )}

                <p className="text-center font-body-sm text-body-sm text-on-surface-variant mt-8">
                    {t('auth.login.noAccount')} <Link className="text-primary font-semibold hover:underline" to="/auth/signup">{t('auth.login.createAccount')}</Link>
                </p>
            </div>
        </AuthLayout>
    )
}
