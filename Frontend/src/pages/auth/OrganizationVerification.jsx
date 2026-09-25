import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMotion } from '../../hooks/useMotion'
import '../../styles/app-shell.css'
import '../../styles/auth.css'

export default function OrganizationVerification() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    useMotion([])

    const [confirmAccurate, setConfirmAccurate] = useState(false)
    const [confirmReview, setConfirmReview] = useState(false)
    const [confirmError, setConfirmError] = useState('')

    function handleSubmit(e) {
        e.preventDefault()
        if (!confirmAccurate || !confirmReview) {
            setConfirmError(t('auth.orgVerification.confirmRequired'))
            return
        }
        navigate('/auth/organization-pending')
    }

    return (
        <div className="page-shell text-on-surface min-h-screen">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-secondary/10 blur-3xl"></div>
            </div>

            <div className="relative min-h-screen py-12 px-6 overflow-hidden">
                <div className="relative z-10 max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <Link to="/" className="inline-block">
                            <h1 className="font-title-lg text-title-lg font-black text-on-surface hover:opacity-80 transition-opacity">EVENTIFY</h1>
                        </Link>
                        <h2 className="font-headline-lg text-headline-lg mt-5">{t('auth.orgVerification.title')}</h2>
                        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">{t('auth.orgVerification.subtitle')}</p>
                    </div>

                    <div className="auth-card border border-white/40 rounded-[24px] p-6 sm:p-10">
                        <div className="mb-10">
                            <div className="flex justify-between font-label-md text-label-md mb-3">
                                <span className="text-success flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[18px]">check_circle</span> {t('auth.orgVerification.stepAccountCreated')}
                                </span>
                                <span className="text-primary">{t('auth.orgVerification.stepOf')}</span>
                            </div>
                            <div className="h-2 rounded-full bg-surface-variant">
                                <div className="h-2 rounded-full w-full bg-primary"></div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <h3 className="font-headline-md text-headline-md mb-6">🏢 {t('auth.orgVerification.orgInfoTitle')}</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="font-label-md text-label-md text-on-surface block mb-2">{t('auth.orgVerification.orgType')}</label>
                                    <select className="ev-input w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-md transition-all text-on-surface">
                                        <option>{t('auth.orgVerification.selectType')}</option>
                                        <option>{t('auth.orgVerification.typeUniversity')}</option>
                                        <option>{t('auth.orgVerification.typeCompany')}</option>
                                        <option>{t('auth.orgVerification.typeNgo')}</option>
                                        <option>{t('auth.orgVerification.typeGovernment')}</option>
                                        <option>{t('auth.orgVerification.typeStartup')}</option>
                                        <option>{t('auth.orgVerification.typeOther')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="font-label-md text-label-md text-on-surface block mb-2">{t('auth.orgVerification.website')}</label>
                                    <input type="url" placeholder="https://organization.com" className="ev-input w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-md transition-all text-on-surface" />
                                </div>
                                <div>
                                    <label className="font-label-md text-label-md text-on-surface block mb-2">{t('auth.orgVerification.orgEmail')}</label>
                                    <input type="email" placeholder="contact@organization.com" className="ev-input w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-md transition-all text-on-surface" />
                                </div>
                                <div>
                                    <label className="font-label-md text-label-md text-on-surface block mb-2">{t('auth.orgVerification.country')}</label>
                                    <input type="text" placeholder="Jordan" className="ev-input w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-md transition-all text-on-surface" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="font-label-md text-label-md text-on-surface block mb-2">{t('auth.orgVerification.city')}</label>
                                    <input type="text" placeholder="Amman" className="ev-input w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-md transition-all text-on-surface" />
                                </div>
                            </div>

                            <h3 className="font-headline-md text-headline-md mt-12 mb-6">👤 {t('auth.orgVerification.repTitle')}</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="font-label-md text-label-md text-on-surface block mb-2">{t('auth.orgVerification.repName')}</label>
                                    <input type="text" placeholder="John Smith" className="ev-input w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-md transition-all text-on-surface" />
                                </div>
                                <div>
                                    <label className="font-label-md text-label-md text-on-surface block mb-2">{t('auth.orgVerification.jobTitle')}</label>
                                    <input type="text" placeholder="CEO" className="ev-input w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-md transition-all text-on-surface" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="font-label-md text-label-md text-on-surface block mb-2">{t('auth.orgVerification.phone')}</label>
                                    <input type="tel" placeholder="+962 7XXXXXXXX" className="ev-input w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-md transition-all text-on-surface" />
                                </div>
                            </div>

                            <h3 className="font-headline-md text-headline-md mt-12 mb-6">📄 {t('auth.orgVerification.docsTitle')}</h3>
                            <div className="upload-box border-2 border-dashed border-outline-variant rounded-2xl p-10 text-center cursor-pointer bg-surface-container-lowest">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M16 8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                <h4 className="font-title-md text-title-md mt-5">{t('auth.orgVerification.uploadTitle')}</h4>
                                <p className="font-body-md text-body-md text-on-surface-variant mt-2">{t('auth.orgVerification.uploadDesc')}</p>
                                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 opacity-75">PDF • JPG • PNG (Max 10MB)</p>
                                <input type="file" className="mt-6 w-full max-w-full font-body-sm text-body-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer" accept=".pdf,.png,.jpg,.jpeg" />
                            </div>

                            <h3 className="font-headline-md text-headline-md mt-12 mb-6">📝 {t('auth.orgVerification.descTitle')}</h3>
                            <textarea rows="6" className="ev-input w-full rounded-xl bg-surface-container-lowest border border-outline-variant transition-all text-on-surface p-4" placeholder={t('auth.orgVerification.descPlaceholder')}></textarea>

                            <div className="mt-10 space-y-5">
                                <label className="flex items-start gap-3">
                                    <input type="checkbox" className="mt-1 rounded border-outline-variant text-primary focus:ring-primary/20" checked={confirmAccurate} onChange={(e) => { setConfirmAccurate(e.target.checked); setConfirmError('') }} />
                                    <span className="font-body-sm text-body-sm text-on-surface leading-relaxed">{t('auth.orgVerification.confirmAccurate')}</span>
                                </label>
                                <label className="flex items-start gap-3">
                                    <input type="checkbox" className="mt-1 rounded border-outline-variant text-primary focus:ring-primary/20" checked={confirmReview} onChange={(e) => { setConfirmReview(e.target.checked); setConfirmError('') }} />
                                    <span className="font-body-sm text-body-sm text-on-surface leading-relaxed">{t('auth.orgVerification.confirmReview')}</span>
                                </label>
                                {confirmError && <p className="text-sm text-error" role="alert">{confirmError}</p>}
                            </div>

                            <div className="mt-12 flex flex-wrap justify-between items-center gap-3">
                                <Link to="/auth/signup" className="inline-flex items-center justify-center h-14 px-8 rounded-full border border-outline-variant font-label-lg text-label-lg text-on-surface hover:bg-surface-container transition-all">
                                    ← {t('auth.orgVerification.back')}
                                </Link>
                                <button type="submit" className="inline-flex items-center justify-center h-14 px-10 rounded-full bg-primary text-on-primary font-label-lg text-label-lg btn-primary transition-all shadow-accent">
                                    {t('auth.orgVerification.submit')} →
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
