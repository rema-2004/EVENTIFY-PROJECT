import AppFooter from '../../components/app/AppFooter'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppPageHead from '../../components/app/AppPageHead'
import { useLanguage } from '../../hooks/useLanguage'
import AnimatedCounter from '../../components/shared/AnimatedCounter'

export default function Explore() {
    const navigate = useNavigate()
    const { language } = useLanguage()
    const ar = language === 'ar'

    const [category, setCategory] = useState('all')
    const [saved, setSaved] = useState(new Set())
    const [toast, setToast] = useState(null)

    const openOpportunity = () => navigate('/app/opportunity')

    const showToast = (msg, tone = 'success') => {
        setToast({ msg, tone })
        setTimeout(() => setToast(null), 2800)
    }

    const toggleSave = (id, e) => {
        e.stopPropagation()
        setSaved((prev) => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
                showToast(ar ? 'تمت إزالته من المحفوظات' : 'Removed from saved')
            } else {
                next.add(id)
                showToast(ar ? 'تم الحفظ لوقت لاحق' : 'Saved for later')
            }
            return next
        })
    }

    const SaveBtn = ({ id }) => (
        <button
            className={`save-btn absolute top-3 ${ar ? 'right-3' : 'left-3'} w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg transition-colors ${saved.has(id) ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
            aria-label={ar ? 'احفظ لاحقاً' : 'Save for later'}
            onClick={(e) => toggleSave(id, e)}
        >
            <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: saved.has(id) ? '"FILL" 1' : '"FILL" 0' }}
            >{saved.has(id) ? 'bookmark_added' : 'bookmark'}</span>
        </button>
    )

    const categoryButtonClass = (value) =>
        `px-5 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors ${category === value
            ? 'tab-active'
            : 'bg-surface-container text-on-surface-variant hover:bg-primary-container/20'}`

    const show = (value) =>
        category === 'all' || category === value ? undefined : 'none'

    const TABS = ar
        ? [
            { value: 'all', label: 'الكل' },
            { value: 'competition', label: 'مسابقات' },
            { value: 'event', label: 'فعاليات' },
            { value: 'workshop', label: 'ورش عمل' },
            { value: 'course', label: 'دورات' },
        ]
        : [
            { value: 'all', label: 'All' },
            { value: 'competition', label: 'Competitions' },
            { value: 'event', label: 'Events' },
            { value: 'workshop', label: 'Workshops' },
            { value: 'course', label: 'Courses' },
        ]

    const CARDS = [
        {
            id: 'global-ai-innovation-challenge',
            cat: 'competition',
            match: 98,
            badgeColor: 'bg-secondary',
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9CEnFNI0sa64wtdt1xcbuCO2ctuePljYf3b0mGoAfsaVbTQZl6EUEKGeq_A-lCje6-84UGOy-xM_EX1fj34sF-YWMO-_0SG4_iedT1vjYrRw5UpEFxOlngZ_cDhCxJRFxyyChSuzfbQzaifbDrY-ySQm0SZNqdXFNpNdzVSiaboP2NAJ4pYTV-P32G1lYqug8kLksnCytiGNYKiUHGIacjDYyZIZ5HHucNTeyCLWQmzn3HRdmrm8n18EIgGN0AobDjfqjTG3DQkjK',
            imgAlt: 'Digital art of a global coding hackathon',
            typeColor: 'text-secondary',
            type: ar ? 'هاكاثون' : 'HACKATHON',
            title: ar ? 'تحدي الابتكار العالمي بالذكاء الاصطناعي' : 'Global AI Innovation Challenge',
            sub: ar ? 'TechGenius Labs · عن بُعد' : 'By TechGenius Labs · Remote',
        },
        {
            id: 'deep-learning-mastery',
            cat: 'workshop',
            match: 95,
            badgeColor: 'bg-secondary',
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcUXLF60F3KbDnIVZepTTte_yzkhe3rkuMtXTXTMQzA1gyVuzXN1NQ0DXC7XHQBDIHEA2TXLK8EoSvioCS5PoWNoZKnVI7YeLCAxqcRtKE-cfSsrD6X3yBiiGI_J0DdnCu4vgHVOf7tn5UW93gDceqUiZ4hVu5ZCvSuDbEd3Dm8uTINHyELfvrJM4AvcW6lRAm2zAmGTlp9N7rNMUMizYToAN1_rTfY1KtEjsmeIx--zlkOzEz07DRgirbjC8bnSBfxNFTTtVBYuqf',
            imgAlt: 'A minimalist classroom with neural network diagrams',
            typeColor: 'text-primary',
            type: ar ? 'ورشة عمل' : 'WORKSHOP',
            title: ar ? 'إتقان التعلم العميق' : 'Deep Learning Mastery',
            sub: ar ? 'جامعة التكنولوجيا · هجين' : 'University of Technology · Hybrid',
        },
        {
            id: 'frontend-wizards-2024',
            cat: 'competition',
            match: 92,
            badgeColor: 'bg-secondary',
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoXFluzheWmZ490MELdToAMEYpR_txVKV30osgae_hCJtZOTitQ7q-hlRINJEb6yu8WczfucSzRFeg7_ASopSg4PYi40bcSgLBAzpyDWcgZltV0lVaadKj9Hxg_0-MIvEynOlpWfO6oad4LDePXnQqUogQYAUOomnsxNQRm0sYppi6tcEF-XVtGAmZwLlJ7Zzvf2ojEvEnU0EwWkAE_qpAYRfUYUWLDeKx1nnQtM-6DxX8uCm13GfTKpd5tCt-XHKS5s04qO3jTwFA',
            imgAlt: 'Abstract geometric 3D shapes representing code blocks',
            typeColor: 'text-secondary',
            type: ar ? 'مسابقة' : 'COMPETITION',
            title: ar ? 'معالجو الواجهة الأمامية 2024' : 'Frontend Wizards 2024',
            sub: ar ? 'DevCommunity Hub · لندن، المملكة المتحدة' : 'DevCommunity Hub · London, UK',
        },
        {
            id: 'cyber-sentinel-ctf',
            cat: 'competition',
            match: 88,
            badgeColor: 'bg-secondary',
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv-V-8GjFWlxuhqQq9nPPBCQKNIYRDy0-x7U8GZDqCxf3lpcSiGNgXTpm9Dp9vtBNtYRJM9-o_XfAV_yWpqjCDBHhA3Xin8gTKbYsCIpYqce02UMEzafn25IYfHI6hd-IasfwMRqIx3qADrfqnj7m-D_PHpWiW6GRyb70Zw9C6yT7Xu6xsRz80sxxnJdXORtOzWdcpjojOlvDh2cdJULC_KUcENGeijXkCPjAA02-axN9qR_MrffMvhq-xjwZhj4cy_sT0Lsf7llBS',
            imgAlt: 'Cybersecurity challenge with neon green grid lines',
            typeColor: 'text-secondary',
            type: ar ? 'مسابقة' : 'COMPETITION',
            title: ar ? 'مسابقة Cyber Sentinel CTF' : 'Cyber Sentinel CTF',
            sub: ar ? 'فرق من 2-4 · جائزة $10k' : 'Teams of 2-4 · $10k Prize',
        },
        {
            id: 'global-ai-summit-2024',
            cat: 'event',
            match: 85,
            badgeColor: 'bg-secondary',
            img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4XGVVgdXcQZS5VeH1XemHRZule_sQgpM4yB8dp3TMxmIjOTnb7x77AU3_AQqluVNnUoBk5iOwilGg_Cj8LHOtQPsJVDcaa2kfvpwYLdBwATyhzxwNtAS856W4G73Ol2mDobe-pFocsYIgmXPkxxqQyS3aZpjC91TuFLwh-po8QIPiLvPOm1yFqZmmNUYFn-URTuNl5djEq9B_ex_XDVvWZZOaO1ql7f1IdMFa91gP9zwnDLnSsn8-06q6CYeqKkjDxqTjq8-BsmeU',
            imgAlt: 'High-tech conference hall',
            typeColor: 'text-primary',
            type: ar ? 'فعالية · مباشر' : 'EVENT · LIVE',
            title: ar ? 'قمة الذكاء الاصطناعي العالمية 2024' : 'Global AI Summit 2024',
            sub: ar ? 'مستقبل الوكلاء الذكيين' : 'The Future of Agents',
        },
        {
            id: 'product-strategy-course',
            cat: 'course',
            match: 79,
            badgeColor: 'bg-secondary',
            img: null,
            icon: 'school',
            iconColor: 'text-primary',
            bgClass: 'bg-gradient-to-br from-primary/20 to-secondary/20',
            typeColor: 'text-tertiary',
            type: ar ? 'دورة' : 'COURSE',
            title: ar ? 'دورة استراتيجية المنتج' : 'Product Strategy Course',
            sub: ar ? 'برنامج شهادة 6 أسابيع' : '6-Week Certificate Program',
        },
        {
            id: 'rust-for-web-devs',
            cat: 'workshop',
            match: 91,
            badgeColor: 'bg-secondary',
            img: null,
            icon: 'terminal',
            iconColor: 'text-secondary',
            bgClass: 'bg-gradient-to-br from-secondary/20 to-primary/10',
            typeColor: 'text-primary',
            type: ar ? 'ورشة عمل' : 'WORKSHOP',
            title: ar ? 'Rust لمطوري الويب' : 'Rust for Web Devs',
            sub: ar ? 'ورشة تفاعلية' : 'Interactive Workshop',
        },
        {
            id: 'devops-masterclass',
            cat: 'course',
            match: 74,
            badgeColor: 'bg-secondary',
            img: null,
            icon: 'cloud',
            iconColor: 'text-tertiary',
            bgClass: 'bg-gradient-to-br from-tertiary/20 to-primary/10',
            typeColor: 'text-tertiary',
            type: ar ? 'دورة' : 'COURSE',
            title: ar ? 'دورة DevOps الاحترافية' : 'DevOps Masterclass',
            sub: ar ? 'مختبر سحابي عملي' : 'Hands-on Cloud Lab',
        },
    ]

    return (
        <>
            <AppPageHead title={ar ? 'استكشف | EVENTIFY' : 'Explore | EVENTIFY'} />

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 px-5 py-3 rounded-full shadow-xl font-label-md text-white animate-bounce bg-[#1e7a4f]">
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                    {toast.msg}
                </div>
            )}

            <main
                className="pt-24 pb-12 px-container-margin-mobile md:px-container-margin-desktop max-w-[1280px] mx-auto space-y-10"
                dir={ar ? 'rtl' : 'ltr'}
            >
                {/* Header & Search */}
                <div className="ev-fade-up ev-stagger-1 space-y-6">
                    <div>
                        <h1 className="font-headline-lg text-headline-lg">
                            {ar ? 'استكشف الفرص' : 'Explore Opportunities'}
                        </h1>
                        <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
                            {ar
                                ? 'تصفّح كل المسابقات والفعاليات وورش العمل والدورات — مصنّفة لك بالذكاء الاصطناعي.'
                                : 'Browse every competition, event, workshop, and course — matched to you by AI.'}
                        </p>
                    </div>
                    <div className="w-full relative">
                        <span className={`material-symbols-outlined absolute ${ar ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 text-outline`}>
                            search
                        </span>
                        <input
                            className={`w-full ${ar ? 'pr-14 pl-4' : 'pl-14 pr-4'} py-4 bg-surface border border-outline-variant shadow-sm rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body-md text-body-md`}
                            placeholder={ar ? 'ابحث عن فرص أو مهارات أو كلمات مفتاحية...' : 'Search opportunities, skills, or keywords...'}
                            type="text"
                            dir={ar ? 'rtl' : 'ltr'}
                        />
                    </div>
                    {/* Category Tabs */}
                    <div className={`flex gap-3 overflow-x-auto pb-1 ${ar ? 'flex-row-reverse' : ''}`}>
                        {TABS.map(({ value, label }) => (
                            <button
                                key={value}
                                className={categoryButtonClass(value)}
                                aria-pressed={category === value}
                                onClick={() => setCategory(value)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Grid */}
                <div key={category} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
                    {CARDS.filter(c => category === 'all' || c.cat === category).map((card, idx) => (
                        <div
                            key={card.id}
                            className="ev-card spotlight row-animated bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            style={{ '--stagger-idx': idx }}
                            onClick={openOpportunity}
                        >
                            <div className={`h-40 relative overflow-hidden ${!card.img ? `${card.bgClass} flex items-center justify-center` : ''}`}>
                                {card.img
                                    ? <img className="ev-card-img w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={card.imgAlt} src={card.img} />
                                    : <span className={`material-symbols-outlined ${card.iconColor} text-5xl transition-transform duration-300 group-hover:scale-110`}>{card.icon}</span>
                                }
                                <div className={`absolute top-3 ${ar ? 'left-3' : 'right-3'} px-3 py-1 ${card.badgeColor} text-white rounded-lg font-label-sm flex items-center gap-1 shadow-lg`} data-count>
                                    <span className="material-symbols-outlined text-[14px]">bolt</span>
                                    <AnimatedCounter value={card.match} suffix="%" duration={600} />
                                </div>
                                <SaveBtn id={card.id} />
                            </div>
                            <div className="p-5 space-y-2">
                                <span className={`font-label-sm text-label-sm uppercase ${card.typeColor}`}>
                                    {card.type}
                                </span>
                                <h3 className="font-title-md text-title-md line-clamp-1 group-hover:text-primary transition-colors">
                                    {card.title}
                                </h3>
                                <p className="font-body-sm text-body-sm text-on-surface-variant">
                                    {card.sub}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <AppFooter />
        </>
    )
}
