import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AuthLayout from '../../layouts/AuthLayout'

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const isPhone = (v) => /^[+]?([0-9][\s-()]*){7,15}$/.test(v)
const isUrl = (v) => { try { new URL(v); return true } catch { return false } }

function getPasswordStrength(value) {
    if (value.length < 8) return 'weak'
    const score = [/[a-zA-Z]/.test(value), /\d/.test(value), /[^a-zA-Z\d]/.test(value)].filter(Boolean).length
    return score <= 1 ? 'medium' : 'strong'
}

function Visual({ t }) {
    return (
        <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]"></div>
            <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-white/5 blur-3xl"></div>

            <div className="relative z-10 flex items-center gap-2">
                <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
                <span className="font-title-lg text-title-lg font-black text-white tracking-wider">EVENTIFY</span>
            </div>

            <div className="relative z-10 my-auto space-y-12 max-w-lg">
                <div className="space-y-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs font-semibold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        {t('auth.signup.visualLive')}
                    </span>
                    <h2 className="font-headline-lg text-headline-lg text-white leading-tight font-extrabold">{t('auth.signup.visualTitle')}</h2>
                    <p className="font-body-md text-body-md text-white/80 max-w-md">{t('auth.signup.visualDesc')}</p>
                </div>

                <div className="space-y-4 max-w-md">
                    <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-3">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">{t('auth.signup.mockHackathon')}</span>
                            <span className="text-white/60 text-xs flex items-center gap-1"><span className="material-symbols-outlined text-xs">schedule</span> {t('auth.signup.mockDaysLeft')}</span>
                        </div>
                        <h4 className="text-white font-semibold text-body-md mb-1">{t('auth.signup.mockEventTitle')}</h4>
                        <p className="text-white/70 text-body-sm mb-3">{t('auth.signup.mockEventDesc')}</p>
                        <div className="flex items-center justify-between">
                            <div className="flex -space-x-2">
                                <img className="w-7 h-7 rounded-full border-2 border-primary bg-white/20" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80" alt="Avatar" />
                                <img className="w-7 h-7 rounded-full border-2 border-primary bg-white/20" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64&q=80" alt="Avatar" />
                                <span className="w-7 h-7 rounded-full border-2 border-primary bg-secondary/80 flex items-center justify-center text-[10px] font-bold text-white">+14</span>
                            </div>
                            <button className="bg-white text-primary text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-1 shadow-sm">
                                {t('auth.signup.mockJoinTeam')} <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-amber-500/25 rounded-2xl p-4 flex items-center gap-3">
                        <span className="material-symbols-outlined text-amber-400 text-3xl">psychology</span>
                        <div>
                            <h5 className="text-white text-body-sm font-semibold">{t('auth.signup.mockAiTitle')}</h5>
                            <p className="text-white/75 text-body-sm">{t('auth.signup.mockAiDesc')}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 text-white/60 text-xs flex justify-between items-center">
                <span>{t('footer.rights')}</span>
                <div className="flex gap-4">
                    <a className="hover:text-white transition-colors" href="#">{t('auth.signup.visualSupport')}</a>
                    <Link className="hover:text-white transition-colors" to="/auth/terms">{t('footer.terms')}</Link>
                </div>
            </div>
        </>
    )
}

const emptyErrors = { fullName: '', phone: '', email: '', password: '', confirmPassword: '' }

export default function Signup() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const [accountType, setAccountType] = useState('personal')
    const [fullName, setFullName] = useState('')
    const [phone, setPhone] = useState('')
    const [website, setWebsite] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [terms, setTerms] = useState(false)
    const [termsError, setTermsError] = useState('')
    const [errors, setErrors] = useState(emptyErrors)
    const [submitting, setSubmitting] = useState(false)

    const isOrg = accountType === 'organization'
    const strength = getPasswordStrength(password)

    function validateField(field, value) {
        if (field === 'phone' && isOrg) return ''
        if (field === 'website') {
            if (!isOrg || !value.trim()) return ''
            return isUrl(value.trim()) ? '' : t('auth.common.invalidUrl')
        }
        const v = value.trim()
        if (!v) return t('auth.common.required')
        if (field === 'phone' && !isPhone(v)) return t('auth.common.invalidPhone')
        if (field === 'email' && !isEmail(v)) return t('auth.common.invalidEmail')
        if (field === 'password' && v.length < 8) return t('auth.signup.passwordTooShort')
        if (field === 'confirmPassword' && v !== password) return t('auth.signup.passwordMismatch')
        return ''
    }

    function handleBlur(field, value) {
        setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }))
    }

    function handleSubmit(e) {
        e.preventDefault()
        const next = {
            fullName: validateField('fullName', fullName),
            phone: validateField('phone', phone),
            email: validateField('email', email),
            password: validateField('password', password),
            confirmPassword: validateField('confirmPassword', confirmPassword),
        }
        setErrors(next)
        setTermsError(terms ? '' : t('auth.signup.termsRequired'))
        if (Object.values(next).some(Boolean) || !terms) return

        setSubmitting(true)
        window.setTimeout(() => {
            setSubmitting(false)
            navigate(isOrg ? '/auth/organization-verification' : '/app')
        }, 900)
    }

    return (
        <AuthLayout reverse shellClassName="page-shell--signup" visual={<Visual t={t} />}>
            <div className="auth-card border border-white/40 rounded-[20px] p-6 sm:p-8 shadow-xl">
                <Link className="inline-flex items-center gap-1 text-on-surface-variant hover:text-primary font-label-md text-label-md mb-5 transition-colors" to="/auth/login">
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span> {t('auth.forgotPassword.backToLogin')}
                </Link>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-5">
                    <span className="material-symbols-outlined text-[18px]">lock</span>
                    {t('auth.common.secureAccess')}
                </div>

                <h1 className="font-headline-lg text-headline-lg mb-2">{t('auth.signup.title')}</h1>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                    {isOrg ? t('auth.signup.subtitleOrg') : t('auth.signup.subtitlePersonal')}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6" role="radiogroup" aria-label="Account type">
                    <button
                        aria-checked={!isOrg}
                        className={`flex flex-col items-center gap-2 py-4 rounded-md border-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-sm active:translate-y-0 active:scale-95 ${!isOrg ? 'border-primary bg-primary/5' : 'border-outline-variant'}`}
                        role="radio"
                        type="button"
                        onClick={() => setAccountType('personal')}
                    >
                        <span className={`material-symbols-outlined ${!isOrg ? 'text-primary' : 'text-on-surface-variant'}`} style={!isOrg ? { fontVariationSettings: "'FILL' 1" } : undefined}>person</span>
                        <span className="font-label-md text-label-md text-on-surface font-semibold">{t('auth.signup.personalAccount')}</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">{t('auth.signup.personalAccountDesc')}</span>
                    </button>
                    <button
                        aria-checked={isOrg}
                        className={`flex flex-col items-center gap-2 py-4 rounded-md border-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-sm active:translate-y-0 active:scale-95 ${isOrg ? 'border-primary bg-primary/5' : 'border-outline-variant'}`}
                        role="radio"
                        type="button"
                        onClick={() => setAccountType('organization')}
                    >
                        <span className={`material-symbols-outlined ${isOrg ? 'text-primary' : 'text-on-surface-variant'}`}>apartment</span>
                        <span className="font-label-md text-label-md text-on-surface">{t('auth.signup.organizationAccount')}</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">{t('auth.signup.organizationAccountDesc')}</span>
                    </button>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                    <div className="flex flex-col gap-2">
                        <label className="font-label-md text-label-md" htmlFor="full-name">
                            {isOrg ? t('auth.signup.orgNameLabel') : t('auth.signup.fullNameLabel')}
                        </label>
                        <input
                            className="ev-input h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-md transition-all"
                            id="full-name"
                            placeholder={isOrg ? t('auth.signup.orgNamePlaceholder') : t('auth.signup.fullNamePlaceholder')}
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            onBlur={(e) => handleBlur('fullName', e.target.value)}
                        />
                        {errors.fullName && <p className="text-sm text-error" role="alert">{errors.fullName}</p>}
                    </div>

                    {!isOrg && (
                        <div className="flex flex-col gap-2">
                            <label className="font-label-md text-label-md" htmlFor="phone">{t('auth.signup.phoneLabel')}</label>
                            <input
                                className="ev-input h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-md transition-all"
                                id="phone"
                                placeholder="+962 7 9012 3456"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                onBlur={(e) => handleBlur('phone', e.target.value)}
                            />
                            {errors.phone && <p className="text-sm text-error" role="alert">{errors.phone}</p>}
                        </div>
                    )}

                    {isOrg && (
                        <div className="flex flex-col gap-2">
                            <label className="font-label-md text-label-md" htmlFor="org-website">
                                {t('auth.signup.websiteLabel')} <span className="text-on-surface-variant font-normal">({t('auth.signup.optional')})</span>
                            </label>
                            <input
                                className="ev-input h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-md transition-all"
                                id="org-website"
                                placeholder="https://yourorganization.com"
                                type="url"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                onBlur={(e) => handleBlur('website', e.target.value)}
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label className="font-label-md text-label-md" htmlFor="email">
                            {isOrg ? t('auth.signup.workEmailLabel') : t('auth.signup.emailLabel')}
                        </label>
                        <input
                            className="ev-input h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-md transition-all"
                            autoComplete="email"
                            id="email"
                            placeholder={isOrg ? 'contact@yourorganization.com' : 'you@example.com'}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={(e) => handleBlur('email', e.target.value)}
                        />
                        {errors.email && <p className="text-sm text-error" role="alert">{errors.email}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-label-md text-label-md" htmlFor="password">{t('auth.signup.passwordLabel')}</label>
                        <div className="relative">
                            <input
                                className="ev-input h-12 px-4 pr-12 w-full bg-surface-container-lowest border border-outline-variant rounded-md transition-all"
                                autoComplete="new-password"
                                id="password"
                                placeholder={t('auth.signup.passwordPlaceholder')}
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={(e) => handleBlur('password', e.target.value)}
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
                        {errors.password && <p className="text-sm text-error" role="alert">{errors.password}</p>}
                        {password && (
                            <p className="text-sm text-on-surface-variant">
                                {t('auth.signup.strengthLabel')}{' '}
                                <span className={`font-semibold ${strength === 'weak' ? 'text-error' : strength === 'medium' ? 'text-amber-600' : 'text-emerald-600'}`}>
                                    {t(`auth.signup.strength.${strength}`)}
                                </span>
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-label-md text-label-md" htmlFor="confirm-password">{t('auth.signup.confirmPasswordLabel')}</label>
                        <div className="relative">
                            <input
                                className="ev-input h-12 px-4 pr-12 w-full bg-surface-container-lowest border border-outline-variant rounded-md transition-all"
                                autoComplete="new-password"
                                id="confirm-password"
                                placeholder={t('auth.signup.confirmPasswordPlaceholder')}
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
                            />
                            <button
                                aria-label={t('auth.common.showPassword')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                                type="button"
                                onClick={() => setShowConfirmPassword((s) => !s)}
                            >
                                <span className="material-symbols-outlined text-[20px]">{showConfirmPassword ? 'visibility' : 'visibility_off'}</span>
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-sm text-error" role="alert">{errors.confirmPassword}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="flex items-start gap-2 font-body-sm text-body-sm text-on-surface-variant cursor-pointer">
                            <input
                                className="rounded border-outline-variant text-primary mt-0.5 focus:ring-primary"
                                type="checkbox"
                                checked={terms}
                                onChange={(e) => { setTerms(e.target.checked); if (e.target.checked) setTermsError('') }}
                            />
                            <span className="select-none">
                                {t('auth.signup.agreeTo')}{' '}
                                <Link className="text-primary hover:underline font-semibold" to="/auth/terms">{t('footer.terms')}</Link>
                                {' '}{t('auth.common.and')}{' '}
                                <Link className="text-primary hover:underline font-semibold" to="/auth/privacy">{t('footer.privacy')}</Link>
                            </span>
                        </label>
                        {termsError && <p className="text-sm text-error" role="alert">{termsError}</p>}
                    </div>

                    <button
                        className="w-full h-12 bg-primary text-on-primary rounded-full font-label-lg text-label-lg btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting ? (
                            <>
                                <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span> {t('auth.signup.submitting')}
                            </>
                        ) : (isOrg ? t('auth.signup.submitOrg') : t('auth.signup.submitPersonal'))}
                    </button>
                </form>

                {!isOrg && (
                    <>
                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-outline-variant"></div>
                            <span className="font-label-sm text-on-surface-variant">{t('auth.common.or')}</span>
                            <div className="flex-1 h-px bg-outline-variant"></div>
                        </div>

                        <button className="w-full h-12 border border-outline-variant rounded-full font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-surface-container-low transition-all duration-200 bg-white/80 hover:border-on-surface" type="button">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                            </svg>
                            <span>{t('auth.common.continueGoogle')}</span>
                        </button>
                    </>
                )}

                <p className="text-center font-body-sm text-body-sm text-on-surface-variant mt-6">
                    {t('auth.signup.haveAccount')} <Link className="text-primary font-semibold hover:underline" to="/auth/login">{t('auth.forgotPassword.logIn')}</Link>
                </p>
            </div>
        </AuthLayout>
    )
}
