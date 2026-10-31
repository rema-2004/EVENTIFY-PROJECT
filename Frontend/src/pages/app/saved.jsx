import AppFooter from '../../components/app/AppFooter'
import AppPageHead from '../../components/app/AppPageHead'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { loadSavedIds, persistSavedIds } from './savedItems.js'

const INITIAL_ITEMS = [
    {
        id: 1,
        slug: 'cyber-sentinel-ctf',
        categoryKey: 'competition',
        participationType: 'solo',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv-V-8GjFWlxuhqQq9nPPBCQKNIYRDy0-x7U8GZDqCxf3lpcSiGNgXTpm9Dp9vtBNtYRJM9-o_XfAV_yWpqjCDBHhA3Xin8gTKbYsCIpYqce02UMEzafn25IYfHI6hd-IasfwMRqIx3qADrfqnj7m-D_PHpWiW6GRyb70Zw9C6yT7Xu6xsRz80sxxnJdXORtOzWdcpjojOlvDh2cdJULC_KUcENGeijXkCPjAA02-axN9qR_MrffMvhq-xjwZhj4cy_sT0Lsf7llBS',
        catColor: 'bg-secondary',
        cat: { en: 'CTF CHALLENGE', ar: 'تحدي أمني فردي' },
        title: { en: 'Cyber Sentinel Solo CTF', ar: 'مسابقة Cyber Sentinel CTF الفردية' },
        sub: { en: 'Solo Participation Only · Cybersecurity CTF', ar: 'مشاركة فردية فقط · اختبار أمني فردي' },
        tags: [
            { label: { en: 'Competition', ar: 'مسابقة' }, cls: 'bg-surface-container text-on-surface' },
            { label: { en: 'Solo Only', ar: 'فردي فقط' }, cls: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold' },
            { label: { en: '88%', ar: '88%' }, cls: 'bg-secondary/10 text-secondary font-mono' },
        ],
    },
    {
        id: 2,
        slug: 'global-ai-innovation-challenge',
        categoryKey: 'competition',
        participationType: 'team',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9CEnFNI0sa64wtdt1xcbuCO2ctuePljYf3b0mGoAfsaVbTQZl6EUEKGeq_A-lCje6-84UGOy-xM_EX1fj34sF-YWMO-_0SG4_iedT1vjYrRw5UpEFxOlngZ_cDhCxJRFxyyChSuzfbQzaifbDrY-ySQm0SZNqdXFNpNdzVSiaboP2NAJ4pYTV-P32G1lYqug8kLksnCytiGNYKiUHGIacjDYyZIZ5HHucNTeyCLWQmzn3HRdmrm8n18EIgGN0AobDjfqjTG3DQkjK',
        catColor: 'bg-secondary',
        cat: { en: 'HACKATHON', ar: 'هاكاثون جماعي' },
        title: { en: 'Global AI Innovation Challenge', ar: 'تحدي الابتكار العالمي بالذكاء الاصطناعي' },
        sub: { en: 'By TechGenius Labs · Remote · Teams Only', ar: 'بواسطة TechGenius Labs · عن بُعد · فرق فقط' },
        tags: [
            { label: { en: 'Competition', ar: 'مسابقة' }, cls: 'bg-surface-container text-on-surface' },
            { label: { en: 'Team Only', ar: 'جماعي فقط' }, cls: 'bg-[#FF4D2E]/10 text-[#FF4D2E] font-bold' },
            { label: { en: '98%', ar: '98%' }, cls: 'bg-secondary/10 text-secondary font-mono' },
        ],
    },
    {
        id: 3,
        slug: 'deep-learning-mastery',
        categoryKey: 'workshop',
        participationType: 'both',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcUXLF60F3KbDnIVZepTTte_yzkhe3rkuMtXTXTMQzA1gyVuzXN1NQ0DXC7XHQBDIHEA2TXLK8EoSvioCS5PoWNoZKnVI7YeLCAxqcRtKE-cfSsrD6X3yBiiGI_J0DdnCu4vgHVOf7tn5UW93gDceqUiZ4hVu5ZCvSuDbEd3Dm8uTINHyELfvrJM4AvcW6lRAm2zAmGTlp9N7rNMUMizYToAN1_rTfY1KtEjsmeIx--zlkOzEz07DRgirbjC8bnSBfxNFTTtVBYuqf',
        catColor: '#FF4D2E',
        cat: { en: 'WORKSHOP', ar: 'ورشة عمل' },
        title: { en: 'Deep Learning Mastery', ar: 'إتقان التعلم العميق' },
        sub: { en: 'University of Technology · Hybrid', ar: 'جامعة التكنولوجيا · هجين' },
        tags: [
            { label: { en: 'Workshop', ar: 'ورشة عمل' }, cls: 'bg-surface-container text-on-surface' },
            { label: { en: 'Hands-on', ar: 'تطبيقي' }, cls: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 font-bold' },
        ],
    },
    {
        id: 4,
        slug: 'product-strategy-course',
        categoryKey: 'course',
        participationType: 'solo',
        img: null,
        catColor: 'bg-primary',
        cat: { en: 'COURSE', ar: 'دورة تدريبية' },
        title: { en: 'Product Strategy Course', ar: 'دورة استراتيجية المنتج' },
        sub: { en: '6-Week Certificate Program', ar: 'برنامج شهادة 6 أسابيع' },
        tags: [
            { label: { en: 'Course', ar: 'دورة' }, cls: 'bg-surface-container text-on-surface' },
            { label: { en: 'Certified', ar: 'معتمدة' }, cls: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 font-bold' },
        ],
    },
]

export default function Saved() {
    const navigate = useNavigate()
    const { language } = useLanguage()
    const ar = language === 'ar'

    const [items, setItems] = useState(() => {
        const savedIds = loadSavedIds()
        return INITIAL_ITEMS.filter((item) => savedIds.has(item.slug))
    })
    const [toast, setToast] = useState(null)

    const openItem = (item) => {
        const compData = {
            id: item.slug || `saved-${item.id}`,
            title: ar ? item.title.ar : item.title.en,
            type: ar ? item.cat.ar : item.cat.en,
            sub: ar ? item.sub.ar : item.sub.en,
            cat: item.categoryKey || 'competition',
            participationType: item.participationType || 'solo',
            img: item.img || null,
            match: 95,
        }
        try {
            sessionStorage.setItem('eventify_selected_competition', JSON.stringify(compData))
        } catch {}
        navigate('/app/opportunity', { state: { competition: compData } })
    }

    const showToast = (msg) => {
        setToast(msg)
        setTimeout(() => setToast(null), 2800)
    }

    const removeItem = (id) => {
        setItems((prev) => {
            const target = prev.find((item) => item.id === id)
            if (target) {
                const savedIds = loadSavedIds()
                savedIds.delete(target.slug)
                persistSavedIds(savedIds)
            }
            return prev.filter((item) => item.id !== id)
        })
        showToast(ar ? 'تمت إزالته من المحفوظات' : 'Removed from saved')
    }

    return (
        <>
            <AppPageHead title={ar ? 'المحفوظات | EVENTIFY' : 'Saved | EVENTIFY'} />

            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 px-5 py-3 rounded-full shadow-xl font-label-md text-white fade-in-up bg-[#1e7a4f]">
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                    {toast}
                </div>
            )}

            <div className="min-h-screen" dir={ar ? 'rtl' : 'ltr'}>
                <main className="mx-auto w-full max-w-7xl px-4 py-8 pb-24 md:px-12 lg:pb-8">

                    {/* Back */}
                    <div className={`mb-6 flex items-center gap-3 text-label-md ${ar ? 'flex-row-reverse' : ''}`}>
                        <Link
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-on-surface-variant hover:bg-surface-container-high transition-colors ${ar ? 'flex-row-reverse' : ''}`}
                            to="/app/profile"
                        >
                            <span className="material-symbols-outlined" style={{ transform: ar ? 'scaleX(-1)' : 'none' }}>arrow_back</span>
                            <span>{ar ? 'العودة للملف الشخصي' : 'Back to profile'}</span>
                        </Link>
                    </div>

                    {/* Breadcrumb */}
                    <div className={`mb-6 flex items-center gap-2 text-label-md ${ar ? 'flex-row-reverse' : ''}`}>
                        <Link className="text-on-surface-variant hover:text-primary transition-colors" to="/app/profile">
                            {ar ? 'الملف الشخصي' : 'Profile'}
                        </Link>
                        <span className="text-outline">/</span>
                        <span>{ar ? 'المحفوظات' : 'Saved'}</span>
                    </div>

                    {/* Header */}
                    <div className={`mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between ${ar ? 'md:flex-row-reverse' : ''}`}>
                        <div className={ar ? 'text-right' : ''}>
                            <h1 className="font-headline-lg text-headline-lg">
                                {ar ? 'الفرص المحفوظة' : 'Saved opportunities'}
                            </h1>
                            <p className="mt-1 text-on-surface-variant font-body-md text-body-md">
                                {ar
                                    ? 'مسابقاتك وفرصك المحفوظة مخزّنة هنا للوصول السريع.'
                                    : 'Your saved competitions and opportunities are stored here for quick access.'}
                            </p>
                        </div>
                        <button
                            className="rounded-full px-6 py-3 font-label-md text-label-md transition-opacity hover:opacity-85 shrink-0"
                            style={{ backgroundColor: '#FF4D2E', color: '#ffffff' }}
                        >
                            {ar ? 'إدارة العناصر المحفوظة' : 'Manage saved items'}
                        </button>
                    </div>

                    {/* Cards or Empty state */}
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center fade-in">
                            <span className="material-symbols-outlined text-6xl text-outline">bookmark</span>
                            <h3 className="font-title-lg text-title-lg">
                                {ar ? 'لا يوجد شيء محفوظ بعد' : 'Nothing saved yet'}
                            </h3>
                            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                                {ar
                                    ? 'احفظ فرصة أثناء التصفح وستنتظرك هنا حتى الموعد النهائي.'
                                    : 'Save an opportunity while you browse and it waits for you here until the deadline.'}
                            </p>
                            <Link
                                className="mt-2 inline-flex items-center justify-center rounded-full px-6 py-3 font-label-md text-label-md transition-opacity hover:opacity-85"
                                style={{ backgroundColor: '#FF4D2E', color: '#ffffff' }}
                                to="/app/explore"
                            >
                                {ar ? 'تصفح الفرص' : 'Browse opportunities'}
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
                            {items.map((item, idx) => (
                                <div 
                                    key={item.id} 
                                    className="ev-card spotlight row-animated bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                    style={{ '--stagger-idx': idx }}
                                >
                                    <div className="h-56 relative overflow-hidden">
                                        <img
                                            className="ev-card-img w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            src={item.img}
                                            alt={ar ? item.title.ar : item.title.en}
                                        />
                                        <div
                                            className={`absolute top-3 ${ar ? 'right-3' : 'left-3'} rounded-full text-white px-3 py-1 font-label-sm text-label-sm uppercase ${item.catColor.startsWith('#') ? '' : item.catColor}`}
                                            style={item.catColor.startsWith('#') ? { backgroundColor: item.catColor } : {}}
                                        >
                                            {ar ? item.cat.ar : item.cat.en}
                                        </div>
                                        <div className={`absolute top-3 ${ar ? 'left-3' : 'right-3'} rounded-full bg-primary/95 text-white px-3 py-1 font-label-sm text-label-sm uppercase`}>
                                            {ar ? 'محفوظ' : 'Saved'}
                                        </div>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        <h3 className={`font-title-md text-title-md line-clamp-2 ${ar ? 'text-right' : ''}`}>
                                            {ar ? item.title.ar : item.title.en}
                                        </h3>
                                        <p className={`font-body-sm text-body-sm text-on-surface-variant ${ar ? 'text-right' : ''}`}>
                                            {ar ? item.sub.ar : item.sub.en}
                                        </p>
                                        <div className={`flex flex-wrap gap-2 ${ar ? 'flex-row-reverse' : ''}`}>
                                            {item.tags.map((tag, i) => (
                                                <span key={i} className={`rounded-full px-3 py-1 font-label-sm text-label-sm uppercase ${tag.cls}`}>
                                                    {ar ? tag.label.ar : tag.label.en}
                                                </span>
                                            ))}
                                        </div>
                                        <div className={`flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center ${ar ? 'sm:flex-row-reverse' : ''}`}>
                                            <button
                                                type="button"
                                                className="inline-flex items-center justify-center rounded-full px-4 py-2 font-label-md text-label-md hover:shadow-lg transition-all text-white cursor-pointer"
                                                style={{ backgroundColor: '#FF4D2E' }}
                                                onClick={() => openItem(item)}
                                            >
                                                {ar ? 'اذهب للفرصة' : 'Go to opportunity'}
                                            </button>
                                            <button
                                                className="inline-flex items-center justify-center rounded-full border border-outline-variant px-4 py-2 text-on-surface font-label-md text-label-md hover:border-primary hover:text-primary hover:shadow-sm transition-all"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                {ar ? 'إزالة من المحفوظات' : 'Remove from saved'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
                <AppFooter />
            </div>
        </>
    )
}
