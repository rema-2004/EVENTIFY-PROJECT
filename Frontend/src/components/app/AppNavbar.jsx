import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AppLangToggle from './AppLangToggle'
import { useOnboarding } from '../../context/OnboardingContext'
import { useTheme } from '../../hooks/useTheme'
import { toast } from '../../utils/toast'

const NAV_LINKS = [
    { to: '/app', label: 'Home', labelAr: 'الرئيسية' },
    { to: '/app/explore', label: 'Explore', labelAr: 'استكشاف' },
    { to: '/app/posts', label: 'Posts', labelAr: 'المنشورات' },
    { to: '/app/my-applications', label: 'My Event', labelAr: 'فعالياتي' },
    { to: '/app/notifications', label: 'Notifications', labelAr: 'الإشعارات' },
]

const PROFILE_IMAGE =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCaUW4ycO4zpbXU8-f7qQ8e67JQFR0kFopGobvmcyuwtb7RmtLjv8uPEEmSl-hbsk0Uo2ApZUUq0wRlZ_zn8PJ4ugNgbj5OOGiU0BEkvvm8agYRwod83fIHy3htoOWJsIvO4ldpAhRTz0oyAMispIOZSiEf-bq73m7QKJeH-ZAfVM4q8r4pOddVVra4gOVTwYxIXtrSAQ5_f0WzHxDTzUUNzi4IEbgzPPqIh4aHvXgk12witr7-3N8pVFOo07Rs0y08Ht-8bubrd2i-'

export default function AppNavbar() {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const { t, i18n } = useTranslation()
    const { isProfileComplete, userProfile } = useOnboarding()
    const { isDark, toggleTheme } = useTheme()
    const isAr = i18n.language === 'ar'
    const isProfilePage = pathname === '/app/profile'

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const isActive = (to) => {
        if (to === '/app') return pathname === '/app'
        return pathname.startsWith(to)
    }

    return (
        <nav className="fixed top-0 w-full z-50 glass-nav border-b border-slate-200/90 dark:border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-none h-16 flex items-center">
            <div className="flex justify-between items-center px-container-margin-mobile md:px-container-margin-desktop w-full max-w-[1280px] mx-auto">
                {/* Far Left: Eventify Logo */}
                <div className="flex items-center shrink-0">
                    <Link
                        className="flex items-center gap-2.5"
                        to="/app"
                        aria-label="EVENTIFY home"
                    >
                        <span
                            className="material-symbols-outlined text-[#FF4D2E] text-3xl"
                            style={{ fontVariationSettings: '"FILL" 1' }}
                        >
                            hub
                        </span>
                        <span className="font-headline-md text-xl md:text-2xl font-black text-[#FF4D2E] tracking-tight">
                            EVENTIFY
                        </span>
                    </Link>
                </div>

                {/* Center: Navigation Links (hidden on profile page where AppSidebar is present) */}
                {!isProfilePage && (
                    <div className="hidden md:flex gap-6 items-center">
                        {NAV_LINKS.map(({ to, label, labelAr }) => {
                            const active = isActive(to)
                            const isLocked = !isProfileComplete && to !== '/app'

                            if (isLocked) {
                                return (
                                    <button
                                        key={to}
                                        type="button"
                                        onClick={() => {
                                            toast(
                                                isAr
                                                    ? 'يرجى إكمال ملفك الشخصي أو رفع السيرة لفتح باقي الأقسام والتنقل'
                                                    : 'Please complete your profile to unlock navigation and opportunities',
                                                'warning'
                                            )
                                        }}
                                        className="flex items-center gap-1.5 text-sm font-medium text-slate-400 dark:text-gray-500 cursor-not-allowed opacity-60 hover:opacity-90 transition-opacity py-1 select-none"
                                        title={
                                            isAr
                                                ? 'مغلق حتى إكمال الملف الشخصي'
                                                : 'Locked until profile is completed'
                                        }
                                    >
                                        <span>{isAr ? labelAr : label}</span>
                                        <span className="material-symbols-outlined text-[14px] text-slate-400 dark:text-gray-500">
                                            lock
                                        </span>
                                    </button>
                                )
                            }

                            return (
                                <Link
                                    key={to}
                                    to={to}
                                    className={
                                        active
                                            ? 'text-sm font-bold text-[#FF4D2E] border-b-2 border-[#FF4D2E] pb-1 transition-all'
                                            : 'text-sm font-medium text-slate-600 hover:text-[#FF4D2E] dark:text-gray-300 dark:hover:text-[#FF4D2E] transition-colors'
                                    }
                                >
                                    {isAr ? labelAr : label}
                                </Link>
                            )
                        })}
                    </div>
                )}

                {/* Far Right: Utility Actions */}
                <div className="flex items-center gap-3 shrink-0">
                    {/* Rafeeq AI button - conditionally shown ONLY if isProfileComplete is true */}
                    {isProfileComplete && (
                        <Link
                            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-[#FF4D2E]/10 hover:bg-[#FF4D2E]/15 rounded-full text-[#FF4D2E] text-xs font-bold transition-all border border-[#FF4D2E]/20"
                            to="/app/rafeeq"
                        >
                            <span className="material-symbols-outlined text-[17px]">
                                smart_toy
                            </span>
                            <span>{t('appNav.rafeeqAI')}</span>
                        </Link>
                    )}

                    {/* Language toggle */}
                    <AppLangToggle />

                    {/* Theme toggle */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            toggleTheme()
                        }}
                        className="theme-toggle w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:text-primary hover:bg-slate-100 dark:text-gray-200 dark:hover:text-white dark:hover:bg-white/10 transition-colors border border-slate-200/80 dark:border-white/10 cursor-pointer shadow-sm"
                        title={t('nav.toggleTheme')}
                        aria-label={t('nav.toggleTheme')}
                    >
                        {isDark ? (
                            <i className="fa-solid fa-sun text-[15px] text-amber-400"></i>
                        ) : (
                            <i className="fa-solid fa-moon text-[15px] text-slate-700"></i>
                        )}
                    </button>

                    {/* User Avatar with Dropdown Menu */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setDropdownOpen((prev) => !prev)}
                            className="relative h-10 w-10 rounded-full overflow-visible block focus:outline-none cursor-pointer group"
                            aria-expanded={dropdownOpen}
                            aria-label={isAr ? 'قائمة الحساب' : 'User account menu'}
                        >
                            <div className={`h-10 w-10 rounded-full overflow-hidden border-2 transition-all ${!isProfileComplete
                                    ? 'border-[#FF4D2E]/80 ring-2 ring-[#FF4D2E]/20'
                                    : 'border-slate-200 dark:border-white/20'
                                }`}>
                                <img
                                    className="w-full h-full object-cover"
                                    alt="Profile"
                                    src={PROFILE_IMAGE}
                                />
                            </div>
                            {!isProfileComplete && (
                                <span
                                    className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#FF4D2E] text-white rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm"
                                    title={isAr ? 'الملف غير مكتمل' : 'Incomplete profile'}
                                >
                                    <i className="fa-solid fa-lock text-[8px]"></i>
                                </span>
                            )}
                        </button>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div
                                className={`absolute top-full mt-2.5 ${isAr ? 'left-0' : 'right-0'} w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/10 shadow-2xl p-3 z-50 transition-all`}
                                dir={isAr ? 'rtl' : 'ltr'}
                            >
                                {/* Current User Info */}
                                <div className="px-3 py-2 border-b border-slate-100 dark:border-white/10">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                        {userProfile?.fullName || (isAr ? 'مشارك جديد' : 'John Narina')}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-gray-400 truncate mt-0.5">
                                        {userProfile?.email || 'john@example.com'}
                                    </p>

                                    {/* Account Status Indicator */}
                                    <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-300 text-[11px] font-semibold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                        <span>
                                            {!isProfileComplete
                                                ? (isAr ? 'حالة الحساب: غير مكتمل' : 'Account Status: Incomplete')
                                                : (isAr ? 'حالة الحساب: نشط' : 'Account Status: Active')}
                                        </span>
                                    </div>
                                </div>

                                {/* Profile Link */}
                                {isProfileComplete && (
                                    <div className="py-1 border-b border-slate-100 dark:border-white/10">
                                        <Link
                                            to="/app/profile"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors"
                                        >
                                            <i className="fa-regular fa-user text-[13px] text-slate-500"></i>
                                            <span>{isAr ? 'الملف الشخصي' : 'My Profile'}</span>
                                        </Link>
                                    </div>
                                )}

                                {/* Sign Out Button */}
                                <div className="pt-1.5">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDropdownOpen(false)
                                            navigate('/auth/login')
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors text-left"
                                    >
                                        <i className="fa-solid fa-arrow-right-from-bracket text-[13px]"></i>
                                        <span>{isAr ? 'تسجيل الخروج' : 'Sign Out'}</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
