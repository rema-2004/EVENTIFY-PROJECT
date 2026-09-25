import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMotion } from '../../hooks/useMotion'
import '../../styles/app-shell.css'
import '../../styles/auth.css'

export default function OrganizationPending() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    useMotion([])

    const [seconds, setSeconds] = useState(10)

    useEffect(() => {
        if (seconds <= 0) {
            navigate('/')
            return
        }
        const timer = window.setTimeout(() => setSeconds((s) => s - 1), 1000)
        return () => window.clearTimeout(timer)
    }, [seconds, navigate])

    return (
        <div className="page-shell text-on-surface min-h-screen">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-secondary/10 blur-3xl"></div>
            </div>

            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="relative z-10 auth-card border border-white/40 rounded-[24px] max-w-xl w-full p-10 text-center mx-auto">
                    <div className="success-circle w-28 h-28 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="font-headline-lg text-headline-lg mt-8 mb-4">🎉 {t('auth.orgPending.title')}</h1>

                    <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
                        {t('auth.orgPending.thankYou')} <span className="font-bold text-primary">EVENTIFY</span>
                        <br /><br />
                        {t('auth.orgPending.created')}
                        <br /><br />
                        📧 {t('auth.orgPending.emailNotice')}
                    </p>

                    <div className="mt-10">
                        <p className="font-body-md text-body-md text-on-surface-variant">{t('auth.orgPending.redirecting')}</p>
                        <div className="font-display-lg text-display-lg text-primary mt-3">{seconds}</div>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-2">{t('auth.orgPending.secondsSuffix')}</p>
                    </div>

                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center justify-center h-14 px-10 rounded-full bg-primary text-on-primary font-label-lg text-label-lg btn-primary transition-all mt-10 w-full sm:w-auto"
                    >
                        {t('auth.orgPending.goHome')}
                    </button>
                </div>
            </div>
        </div>
    )
}
