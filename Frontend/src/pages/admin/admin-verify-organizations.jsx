import { useState } from 'react'
import AppPageHead from '../../components/app/AppPageHead'
import { useLanguage } from '../../hooks/useLanguage'
import { toast } from '../../utils/toast'
import AnimatedCounter from '../../components/shared/AnimatedCounter'
import AdminSidebar, { AdminMobileHeader } from '../../components/admin/AdminSidebar'
import AdminTopbar from '../../components/admin/AdminTopbar'
import '../../styles/admin/admin.css'

const INITIAL_ORGANIZATIONS = [
    {
        id: 1,
        slug: 'uot-amman',
        name: 'University of Technology',
        type: 'University · Amman · official domain verified · 2 documents attached',
        licenseDoc: {
            title: 'University Accreditation & Ministry Decree',
            titleAr: 'شهادة الاعتماد والترخيص الجامعي الرسمي',
            number: 'MOHE-JO-2024-8812',
            fileName: 'University_Accreditation_License.pdf',
            size: '2.4 MB',
            issuedDate: '15/01/2024',
            issuingAuthority: 'Ministry of Higher Education & Scientific Research',
            issuingAuthorityAr: 'وزارة التعليم العالي والبحث العلمي',
            representative: 'Prof. Tariq Al-Husseini (Dean of IT)',
            representativeAr: 'أ.د. طارق الحسيني (عميد كلية تكنولوجيا المعلومات)',
            licenseStatus: 'Valid & Verified',
            hash: 'SHA256: 9e8a4f10c72b839ad8503bce4911d94fa91b',
        },
        details: [
            { label: 'Domain email', value: 'valid' },
            { label: 'License', value: 'readable' },
            { label: 'Contact', value: 'dean.office@uot.edu' },
        ],
        status: 'pending',
    },
    {
        id: 2,
        slug: 'designhub-amman',
        name: 'DesignHub Amman',
        type: 'Student club · portfolio site verified · official club letter attached',
        licenseDoc: {
            title: 'Student Activities Registration Certificate',
            titleAr: 'شهادة تسجيل واعتماد نادي الأنشطة الطلابية',
            number: 'SAC-JO-2025-1049',
            fileName: 'DesignHub_Club_Registration.pdf',
            size: '1.1 MB',
            issuedDate: '10/09/2025',
            issuingAuthority: 'Deanship of Student Affairs',
            issuingAuthorityAr: 'عمادة شؤون الطلبة والأنشطة الشبابية',
            representative: 'Lina Qasim (Club President)',
            representativeAr: 'لينا قاسم (رئيسة النادي)',
            licenseStatus: 'Valid & Verified',
            hash: 'SHA256: 3c82e6bb1a09d443e911c79802bebf0245a1',
        },
        details: [
            { label: 'Domain email', value: 'valid' },
            { label: 'Club letter', value: 'attached' },
            { label: 'Past events', value: '5' },
        ],
        status: 'pending',
    },
    {
        id: 3,
        slug: 'zain-innovation-campus',
        name: 'Zain Innovation Campus',
        type: 'Corporate innovation hub · Amman · 3 documents attached',
        licenseDoc: {
            title: 'Commercial Registration & Business License',
            titleAr: 'السجل التجاري ورخصة ممارسة النشاط',
            number: 'CR-JO-2022-77491',
            fileName: 'ZINC_Commercial_Registration_2026.pdf',
            size: '3.8 MB',
            issuedDate: '01/02/2022',
            issuingAuthority: 'Ministry of Industry, Trade and Supply',
            issuingAuthorityAr: 'وزارة الصناعة والتجارة والتموين',
            representative: 'Zain Jordan Enterprise Relations',
            representativeAr: 'إدارة علاقات الشركات - زين الأردن',
            licenseStatus: 'Active & Verified',
            hash: 'SHA256: fa489112bc5089204cdb7631980ee91ad432',
        },
        details: [
            { label: 'Domain email', value: 'valid' },
            { label: 'Commercial registration', value: 'attached' },
            { label: 'Contact', value: 'events@zain.jo' },
        ],
        status: 'pending',
    },
    {
        id: 4,
        slug: 'cloud-native-academy',
        name: 'Cloud Native Academy',
        type: 'Tech training institute · Amman · e-learning platform verified · 1 document attached',
        licenseDoc: {
            title: 'Vocational Training & Technical Institute License',
            titleAr: 'رخصة المعهد التقني والتدريب المهني المعتمد',
            number: 'VTC-JO-2023-3391',
            fileName: 'CloudNative_Training_License.pdf',
            size: '1.9 MB',
            issuedDate: '18/06/2023',
            issuingAuthority: 'Vocational Training Corporation',
            issuingAuthorityAr: 'مؤسسة التدريب المهني والاعتماد التقني',
            representative: 'Eng. Omar Mansour (Director)',
            representativeAr: 'م. عمر منصور (مدير الأكاديمية)',
            licenseStatus: 'Valid & Verified',
            hash: 'SHA256: 77a0bc45291da930bc28114f0e9d671239aa',
        },
        details: [
            { label: 'Domain email', value: 'valid' },
            { label: 'Ministry letter', value: 'attached' },
            { label: 'Contact', value: 'info@cloudnative.jo' },
        ],
        status: 'pending',
    },
]

export default function AdminVerifyOrganizations() {
    const { language } = useLanguage()
    const ar = language === 'ar'

    const [organizations, setOrganizations] = useState(INITIAL_ORGANIZATIONS)
    const [viewingOrg, setViewingOrg] = useState(null)
    const [downloadingLicense, setDownloadingLicense] = useState(false)

    const handleReject = (orgId) => {
        setOrganizations((prev) =>
            prev.map((org) => {
                if (org.id === orgId) {
                    return { ...org, status: 'rejected' }
                }
                return org
            }),
        )
        const org = organizations.find((o) => o.id === orgId)
        toast(ar ? `تم رفض طلب "${org?.name}"` : `Application for "${org?.name}" rejected`, 'error')
        if (viewingOrg?.id === orgId) setViewingOrg(null)
    }

    const handleAccept = (orgId) => {
        setOrganizations((prev) =>
            prev.map((org) => {
                if (org.id === orgId) {
                    return { ...org, status: 'accepted' }
                }
                return org
            }),
        )
        const org = organizations.find((o) => o.id === orgId)
        toast(ar ? `تم قبول وتوثيق "${org?.name}" بنجاح` : `Application for "${org?.name}" verified successfully`, 'success')
        if (viewingOrg?.id === orgId) setViewingOrg(null)
    }

    const handleDownloadLicense = (org) => {
        setDownloadingLicense(true)
        toast(ar ? `جاري تحميل رخصة ${org.name}...` : `Fetching license for ${org.name}...`, 'info')

        // Frontend-only: build the license copy locally instead of fetching it.
        const content = `EVENTIFY OFFICIAL VERIFICATION CERTIFICATE\n=============================================\nOrganization: ${org.name}\nDocument Title: ${org.licenseDoc?.title}\nLicense/Registration No: ${org.licenseDoc?.number}\nIssuing Authority: ${org.licenseDoc?.issuingAuthority}\nAuthorized Representative: ${org.licenseDoc?.representative}\nStatus: VERIFIED & AUTHENTICATED\nIssued: ${org.licenseDoc?.issuedDate}\nVerification Hash: ${org.licenseDoc?.hash || 'SHA256: 8F4B99A1'}`
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = org.licenseDoc?.fileName?.replace('.pdf', '.txt') || `license-${org.slug || org.id}.txt`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
        toast(ar ? 'تم تحميل نسخة الوثيقة الرسمية' : 'Official license copy downloaded', 'success')
        setDownloadingLicense(false)
    }

    const pendingCount = organizations.filter((o) => o.status === 'pending').length
    const acceptedCount = organizations.filter((o) => o.status === 'accepted').length
    const rejectedCount = organizations.filter((o) => o.status === 'rejected').length

    return (
        <>
            <AppPageHead title="Verify Organizations | EVENTIFY" />
            <AdminMobileHeader />
            <div className="flex min-h-screen">
                <AdminSidebar />
                <main className="w-full flex-1 px-4 pt-6 pb-8 md:px-10">
                    <AdminTopbar title={ar ? 'توثيق المنظمات' : 'Verify Organizations'} />

                    <div className="mb-8">
                        <p className="mt-1 text-on-surface-variant">
                            {ar
                                ? 'قدمت المنظمات تفاصيل التوثيق هذه عند إنشاء الحساب. راجع الرخص والوثائق الرسمية، ثم اتخذ قرار القبول أو الرفض.'
                                : 'Organizations submitted these verification details when they created their account. Review the documents, then accept or reject each application.'}
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="stat-grid stat-grid--3 mb-6">
                        <div className="stat-card">
                            <p className="stat-card__value"><AnimatedCounter value={pendingCount} /></p>
                            <p className="stat-card__label">{ar ? 'بانتظار المراجعة' : 'Pending review'}</p>
                            <p className="stat-card__hint">{ar ? 'في هذه الصفحة' : 'On this page'}</p>
                        </div>
                        <div className="stat-card">
                            <p className="stat-card__value"><AnimatedCounter value={312 + acceptedCount} /></p>
                            <p className="stat-card__label">{ar ? 'منظمات تم توثيقها' : 'Verified organizations'}</p>
                            <p className="stat-card__hint">{ar ? 'الإجمالي' : 'All time'}</p>
                        </div>
                        <div className="stat-card">
                            <p className="stat-card__value"><AnimatedCounter value={4 + rejectedCount} /></p>
                            <p className="stat-card__label">{ar ? 'طلبات مرفوضة' : 'Rejected requests'}</p>
                            <p className="stat-card__hint">{ar ? 'الإجمالي' : 'All time'}</p>
                        </div>
                    </div>

                    {/* Organizations List */}
                    <section className="space-y-4">
                        {organizations.map((org, idx) => (
                            <article 
                                key={org.id} 
                                className="section-card row-animated transition-all duration-200 hover:shadow-md"
                                style={{ '--stagger-idx': idx }}
                            >
                                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                                    <div className="flex-1">
                                        <div className="mb-2 flex flex-wrap items-center gap-2">
                                            <h3 className="text-title-lg font-semibold">{org.name}</h3>
                                            {org.status === 'pending' && <span className="badge badge--pending">{ar ? 'قيد المراجعة' : 'Pending'}</span>}
                                            {org.status === 'accepted' && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30shadow-sm">
                                                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                                    {ar ? 'تم التحقق' : 'Verified'}
                                                </span>
                                            )}
                                            {org.status === 'rejected' && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30 shadow-sm">
                                                    <span className="material-symbols-outlined text-[16px]">cancel</span>
                                                    {ar ? 'مرفوض' : 'Rejected'}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-on-surface-variant text-sm">{org.type}</p>
                                        
                                        <div className="mt-4 grid grid-cols-1 gap-3 text-label-md md:grid-cols-3">
                                            {org.details.map((detail, dIdx) => (
                                                <span key={dIdx} className="rounded-lg bg-surface-container-low p-3 flex items-center justify-between text-xs">
                                                    <span className="text-on-surface-variant font-medium">{detail.label}</span>
                                                    <span className="font-semibold text-primary">{detail.value}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Buttons: View License + Accept/Reject */}
                                    <div className="flex flex-wrap items-center gap-2.5 pt-1 lg:pt-0">
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/25 transition-all cursor-pointer shadow-sm active:scale-95 hover:shadow-primary/10 hover:shadow-md"
                                            onClick={() => setViewingOrg(org)}
                                            title={ar ? 'معاينة رخصة ووثيقة التوثيق الرسمية' : 'View official license / document'}
                                        >
                                            <span className="material-symbols-outlined text-[18px]">verified</span>
                                            <span>{ar ? 'عرض الرخصة' : 'View License'}</span>
                                        </button>

                                        {org.status === 'pending' ? (
                                            <>
                                                <button
                                                    type="button"
                                                    className="btn-danger-outline hover:bg-red-50 transition-colors cursor-pointer text-xs py-2 px-3.5"
                                                    onClick={() => handleReject(org.id)}
                                                >
                                                    {ar ? 'رفض' : 'Reject'}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-success hover:brightness-105 transition-all cursor-pointer text-xs py-2 px-4 shadow-sm"
                                                    onClick={() => handleAccept(org.id)}
                                                >
                                                    {ar ? 'قبول' : 'Accept'}
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-xs text-on-surface-variant self-center font-medium px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30">
                                                {ar ? 'تم تسجيل القرار' : 'Decision recorded'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </section>
                </main>
            </div>

            {/* License Viewer Modal — High Z-Index, Perfectly Centered on Viewport */}
            {viewingOrg && (
                <div
                    className="fixed inset-0 z-[99999] overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 min-h-screen"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="license-modal-title"
                    dir={ar ? 'rtl' : 'ltr'}
                    onClick={() => setViewingOrg(null)}
                >
                    <div
                        className="relative my-auto w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-200/90 dark:border-white/10 p-6 md:p-8 space-y-5 animate-in zoom-in-95 duration-200 flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-start justify-between gap-4 border-b border-gray-100 dark:border-white/10 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 border border-primary/20 shadow-inner">
                                    <span className="material-symbols-outlined text-2xl">verified_user</span>
                                </div>
                                <div>
                                    <h3 id="license-modal-title" className="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-snug">
                                        {ar ? 'وثيقة التوثيق والرخصة الرسمية' : 'Official License & Verification Document'}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {ar ? 'الجهة المنظمة: ' : 'Organization: '}
                                        <strong className="text-primary font-semibold">{viewingOrg.name}</strong>
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setViewingOrg(null)}
                                className="text-gray-400 hover:text-gray-700 dark:hover:text-white p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#23262c] transition-colors cursor-pointer"
                                aria-label="Close modal"
                            >
                                <span className="material-symbols-outlined text-xl">close</span>
                            </button>
                        </div>

                        {/* License Certificate Simulated Preview */}
                        <div className="relative rounded-2xl border-2 border-dashed border-primary/30 bg-gradient-to-br from-amber-50/40 via-white to-primary/5 dark:from-[#FF4D2E]/10 dark:via-[#16181c] dark:to-[#16181c] p-5 md:p-6 shadow-sm overflow-hidden">
                            {/* Watermark Emblem */}
                            <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none select-none">
                                <span className="material-symbols-outlined text-[160px]">verified</span>
                            </div>

                            <div className="flex justify-between items-start gap-4 mb-4">
                                <div>
                                    <span className="text-[10px] font-bold tracking-widest text-primary uppercase block">
                                        {ar ? 'شهادة اعتماد وتوثيق منصة EVENTIFY' : 'EVENTIFY OFFICIAL VERIFICATION CERTIFICATE'}
                                    </span>
                                    <h4 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mt-1">
                                        {ar ? viewingOrg.licenseDoc?.titleAr : viewingOrg.licenseDoc?.title}
                                    </h4>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30">
                                        <span className="material-symbols-outlined text-[14px]">check</span>
                                        {viewingOrg.licenseDoc?.licenseStatus || 'Verified'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                <div className="bg-white/85 backdrop-blur-sm p-3 rounded-xl border border-gray-100 dark:border-white/10 shadow-2xs">
                                    <p className="text-gray-500 dark:text-gray-400 font-medium">{ar ? 'رقم السجل / الترخيص' : 'License / Registration No.'}</p>
                                    <p className="font-mono font-bold text-sm text-gray-900 dark:text-white mt-0.5">{viewingOrg.licenseDoc?.number}</p>
                                </div>
                                <div className="bg-white/85 backdrop-blur-sm p-3 rounded-xl border border-gray-100 dark:border-white/10 shadow-2xs">
                                    <p className="text-gray-500 dark:text-gray-400 font-medium">{ar ? 'الجهة المصدرة' : 'Issuing Authority'}</p>
                                    <p className="font-semibold text-gray-900 dark:text-white mt-0.5">
                                        {ar ? viewingOrg.licenseDoc?.issuingAuthorityAr : viewingOrg.licenseDoc?.issuingAuthority}
                                    </p>
                                </div>
                                <div className="bg-white/85 backdrop-blur-sm p-3 rounded-xl border border-gray-100 dark:border-white/10 shadow-2xs">
                                    <p className="text-gray-500 dark:text-gray-400 font-medium">{ar ? 'الممثل المفوّض' : 'Authorized Representative'}</p>
                                    <p className="font-semibold text-gray-900 dark:text-white mt-0.5">
                                        {ar ? viewingOrg.licenseDoc?.representativeAr : viewingOrg.licenseDoc?.representative}
                                    </p>
                                </div>
                                <div className="bg-white/85 backdrop-blur-sm p-3 rounded-xl border border-gray-100 dark:border-white/10 shadow-2xs">
                                    <p className="text-gray-500 dark:text-gray-400 font-medium">{ar ? 'تاريخ التوثيق وتنسيق الملف' : 'Issue Date & Format'}</p>
                                    <p className="font-semibold text-gray-900 dark:text-white mt-0.5">
                                        {viewingOrg.licenseDoc?.issuedDate} • {viewingOrg.licenseDoc?.fileName} ({viewingOrg.licenseDoc?.size})
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-gray-200/60 dark:border-white/10 flex flex-wrap items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                                <span>{viewingOrg.licenseDoc?.hash}</span>
                                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{ar ? 'مطابق لبيانات التسجيل القانونية' : 'Verified by Platform Administrator'}</span>
                            </div>
                        </div>

                        {/* Modal Footer / Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-white/10">
                            <button
                                type="button"
                                onClick={() => handleDownloadLicense(viewingOrg)}
                                disabled={downloadingLicense}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 dark:text-white dark:bg-[#23262c] dark:hover:bg-[#2b2f36] transition-all cursor-pointer active:scale-95"
                            >
                                <span className="material-symbols-outlined text-[18px]">download</span>
                                <span>{downloadingLicense ? (ar ? 'جاري التحميل...' : 'Downloading...') : (ar ? 'تحميل الوثيقة الأصلية (PDF)' : 'Download Original File')}</span>
                            </button>

                            <div className="flex items-center gap-2">
                                {viewingOrg.status === 'pending' && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleReject(viewingOrg.id)}
                                            className="px-4 py-2.5 rounded-2xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 dark:text-red-300 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:border-red-500/30 transition-colors cursor-pointer"
                                        >
                                            {ar ? 'رفض الطلب' : 'Reject'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleAccept(viewingOrg.id)}
                                            className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all cursor-pointer active:scale-95"
                                        >
                                            {ar ? 'قبول وتوثيق المنظمة' : 'Accept & Verify'}
                                        </button>
                                    </>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setViewingOrg(null)}
                                    className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                    {ar ? 'إغلاق' : 'Close'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
