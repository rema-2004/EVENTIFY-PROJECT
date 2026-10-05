import AppFooter from '../../components/app/AppFooter'
import AppPageHead from '../../components/app/AppPageHead'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'

const POSTS = [
    {
        id: 1,
        org: 'TechGenius Labs',
        iconColor: 'text-primary',
        bgColor: 'bg-primary/10',
        icon: 'apartment',
        time: { en: 'Verified Organizer · 2h ago', ar: 'منظّم موثّق · منذ ساعتين' },
        text: {
            en: 'Registration for the Global AI Innovation Challenge is now open. Teams of 2-4, $10k in prizes, and remote-friendly opportunities are available.',
            ar: 'بدأ التسجيل في تحدي الابتكار العالمي بالذكاء الاصطناعي. الفرق مكوّنة من 2-4 أشخاص، جوائز بقيمة 10,000 دولار، وإمكانية المشاركة عن بُعد.',
        },
        details: {
            en: 'More details will appear here for applicants who want to learn about the challenge timeline, eligibility, and how to submit the application before the deadline.',
            ar: 'ستظهر هنا تفاصيل إضافية للمتقدمين الراغبين في معرفة الجدول الزمني للتحدي وشروط الأهلية وكيفية تقديم الطلب قبل الموعد النهائي.',
        },
        link: null,
    },
    {
        id: 2,
        org: 'DevCommunity Hub',
        iconColor: 'text-secondary',
        bgColor: 'bg-secondary/10',
        icon: 'apartment',
        time: { en: 'Verified Organizer · 5h ago', ar: 'منظّم موثّق · منذ 5 ساعات' },
        text: {
            en: 'A new opportunity is now open for students and young founders to join Startup Sprint 2024 in Amman. Register before Friday to reserve your place and receive the event kit.',
            ar: 'فرصة جديدة مفتوحة للطلاب ورواد الأعمال الشباب للانضمام إلى Startup Sprint 2024 في عمّان. سجّل قبل الجمعة لحجز مكانك واستلام حقيبة الفعالية.',
        },
        details: {
            en: 'The registration form is open for early applicants. Participants will receive a confirmation email, event access details, and guidance on what to prepare before attending.',
            ar: 'نموذج التسجيل مفتوح للمتقدمين المبكرين. سيتلقى المشاركون رسالة تأكيد بالبريد الإلكتروني وتفاصيل الدخول وإرشادات التحضير.',
        },
        link: null,
    },
    {
        id: 3,
        org: 'University of Technology',
        iconColor: 'text-tertiary',
        bgColor: 'bg-tertiary/10',
        icon: 'apartment',
        time: { en: 'Verified Organizer · 1d ago', ar: 'منظّم موثّق · منذ يوم' },
        text: {
            en: 'We just wrapped the Quantum Computing Bootcamp and shared the highlights with all participants. Certificates are on their way.',
            ar: 'انتهينا للتو من معسكر الحوسبة الكمية وشاركنا أبرز اللحظات مع جميع المشاركين. الشهادات في الطريق إليكم.',
        },
        details: {
            en: 'This post can expand to include learning resources, event recap notes, and follow-up instructions for all participants who want more context.',
            ar: 'يمكن توسيع هذا المنشور ليشمل موارد التعلم وملاحظات الملخص وتعليمات المتابعة لجميع المشاركين.',
        },
        link: null,
    },
    {
        id: 4,
        org: 'EVENTIFY Team',
        iconColor: 'text-primary',
        bgColor: 'bg-primary/10',
        icon: 'emoji_events',
        time: { en: 'New competition · Just posted', ar: 'مسابقة جديدة · نُشر للتو' },
        text: {
            en: 'We just launched a new competition for creators and innovators. Join the challenge and share your idea with the community.',
            ar: 'أطلقنا للتو مسابقة جديدة للمبدعين والمبتكرين. انضم للتحدي وشارك فكرتك مع المجتمع.',
        },
        details: null,
        link: { en: 'Open opportunity', ar: 'افتح الفرصة' },
    },
]

function PostCard({ post, ar, idx = 0 }) {
    const [expanded, setExpanded] = useState(false)

    return (
        <div
            className="row-animated ev-card spotlight overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-sm hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300"
            style={{ '--stagger-idx': idx }}
        >
            <div className={`flex items-center gap-3 ${ar ? 'flex-row-reverse' : ''}`}>
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${post.bgColor}`}>
                    <span
                        className={`material-symbols-outlined ${post.iconColor}`}
                        style={{ fontVariationSettings: '"FILL" 1' }}
                    >{post.icon}</span>
                </div>
                <div className={ar ? 'text-right' : ''}>
                    <p className="font-label-md text-label-md font-bold">{post.org}</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                        {ar ? post.time.ar : post.time.en}
                    </p>
                </div>
            </div>

            <p className={`mt-4 font-body-md text-body-md leading-relaxed ${ar ? 'text-right' : ''}`}>
                {ar ? post.text.ar : post.text.en}
            </p>

            {post.details && (
                <>
                    {expanded && (
                        <p className={`mt-3 font-body-sm text-body-sm text-on-surface-variant animate-[fadeIn_0.3s_ease-out] ${ar ? 'text-right' : ''}`}>
                            {ar ? post.details.ar : post.details.en}
                        </p>
                    )}
                    <button
                        className="mt-4 rounded-full border px-4 py-2 font-label-md text-label-md active:scale-95 transition-all"
                        style={expanded
                            ? { backgroundColor: '#FF4D2E', color: '#fff', borderColor: '#FF4D2E' }
                            : { backgroundColor: 'rgba(255,77,46,0.05)', color: '#FF4D2E', borderColor: 'rgba(255,77,46,0.2)' }}
                        type="button"
                        onClick={() => setExpanded((p) => !p)}
                    >
                        {expanded
                            ? (ar ? 'عرض أقل' : 'Show less')
                            : (ar ? 'اقرأ المزيد' : 'Read more')}
                    </button>
                </>
            )}

            {post.link && (
                <Link
                    className={`mt-3 inline-flex items-center gap-2 font-label-md text-label-md text-primary hover:underline ${ar ? 'flex-row-reverse' : ''}`}
                    to="/app/opportunity"
                >
                    <span className="material-symbols-outlined text-[16px]">link</span>
                    {ar ? post.link.ar : post.link.en}
                </Link>
            )}
        </div>
    )
}

export default function Posts() {
    const { language } = useLanguage()
    const ar = language === 'ar'

    return (
        <>
            <AppPageHead title={ar ? 'المنشورات | EVENTIFY' : 'Posts | EVENTIFY'} />
            <main
                className="pt-24 pb-12 px-container-margin-mobile md:px-container-margin-desktop max-w-[1280px] mx-auto"
                dir={ar ? 'rtl' : 'ltr'}
            >
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="font-headline-lg text-headline-lg">
                            {ar ? 'المنشورات' : 'Posts'}
                        </h1>
                        <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
                            {ar ? 'تصفّح آخر التحديثات التي شاركها المنظّمون.' : 'Browse the latest updates shared by organizers.'}
                        </p>
                    </div>
                    <div className={`flex items-center gap-2 rounded-full border border-outline-variant/40 bg-white dark:bg-slate-900 px-3 py-2 shadow-sm ${ar ? 'flex-row-reverse' : ''}`}>
                        <span className="material-symbols-outlined text-on-surface-variant">search</span>
                        <input
                            className="w-40 border-0 bg-transparent font-body-sm text-body-sm outline-none dark:text-white"
                            placeholder={ar ? 'ابحث في المنشورات' : 'Search posts'}
                            type="text"
                            dir={ar ? 'rtl' : 'ltr'}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {POSTS.map((post, idx) => (
                        <PostCard key={post.id} post={post} ar={ar} idx={idx} />
                    ))}
                </div>
            </main>
            <AppFooter />
        </>
    )
}
