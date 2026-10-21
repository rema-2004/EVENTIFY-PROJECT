import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { toast as showGlobalToast } from '../../utils/toast'

/**
 * AppSidebar - Primary Navigation (Single Source of Truth)
 * Cleanly lists: 'Home', 'My Event', 'Posts', 'Notifications', 'Saved', 'Profile'
 */
export default function AppSidebar() {
    const { pathname } = useLocation()
    const { language } = useLanguage()
    const ar = language === 'ar'

    const NAV_ITEMS = [
        { to: '/app', icon: 'home', labelEn: 'Home', labelAr: 'الرئيسية' },
        { to: '/app/my-applications', icon: 'assignment_turned_in', labelEn: 'My Event', labelAr: 'فعالياتي' },
        { to: '/app/posts', icon: 'campaign', labelEn: 'Posts', labelAr: 'المنشورات' },
        { to: '/app/notifications', icon: 'notifications', labelEn: 'Notifications', labelAr: 'الإشعارات' },
        { to: '/app/saved', icon: 'bookmark', labelEn: 'Saved', labelAr: 'المحفوظات' },
        { to: '/app/profile', icon: 'account_circle', labelEn: 'Profile', labelAr: 'الملف الشخصي' },
    ]

    const isCurrentActive = (to) => {
        if (to === '/app') return pathname === '/app'
        return pathname.startsWith(to)
    }

    return (
        <aside
            className="hidden lg:flex flex-col gap-4 sticky top-[calc(72px+24px)] h-[calc(100vh-120px)] w-56 shrink-0 glass-sidebar border border-outline-variant/30 dark:border-white/10 rounded-2xl p-4 shadow-sm"
            aria-label={ar ? 'القائمة الجانبية الرئيسية' : 'Primary Navigation'}
        >
            <nav className="flex flex-col gap-1.5" role="navigation">
                {NAV_ITEMS.map(({ to, icon, labelEn, labelAr }) => {
                    const active = isCurrentActive(to)
                    return (
                        <Link
                            key={to}
                            to={to}
                            className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all duration-200 group ${
                                active
                                    ? 'bg-[#FF4D2E]/10 text-[#FF4D2E] font-bold border-s-4 border-[#FF4D2E] shadow-sm'
                                    : 'text-slate-600 dark:text-gray-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            <span
                                className={`material-symbols-outlined text-[21px] transition-colors ${
                                    active ? 'text-[#FF4D2E]' : 'text-slate-400 dark:text-gray-400 group-hover:text-primary'
                                }`}
                                style={active ? { fontVariationSettings: '"FILL" 1' } : {}}
                            >
                                {icon}
                            </span>
                            <span className="font-label-md text-sm font-medium">
                                {ar ? labelAr : labelEn}
                            </span>
                        </Link>
                    )
                })}
            </nav>

            {/* PRO PLAN Banner Card */}
            <div className="mt-auto p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-white/10 space-y-2">
                <p className="font-label-sm text-xs font-bold text-[#FF4D2E] tracking-wider uppercase">
                    {ar ? 'الخطة الاحترافية' : 'PRO PLAN'}
                </p>
                <p className="font-body-md text-xs text-slate-500 dark:text-gray-400 leading-relaxed">
                    {ar
                        ? 'افتح التطابق المتقدم بالذكاء الاصطناعي ورؤى Rafeeq ذات الأولوية.'
                        : 'Unlock advanced AI matching and priority Rafeeq insights.'}
                </p>
                <button
                    type="button"
                    className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                    onClick={() =>
                        showGlobalToast(
                            ar ? 'ميزة الترقية قريباً!' : 'Upgrade feature coming soon!',
                            'info'
                        )
                    }
                >
                    {ar ? 'ترقية' : 'Upgrade'}
                </button>
            </div>
        </aside>
    )
}
