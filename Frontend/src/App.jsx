import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from './hooks/useLanguage'
import VisitorLayout from './layouts/VisitorLayout'
import Landing from './pages/visitor/Landing'
import About from './pages/visitor/About'
import Contact from './pages/visitor/Contact'
import NotFound from './pages/visitor/NotFound'
import ComingSoon from './pages/ComingSoon'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'
import OrganizationVerification from './pages/auth/OrganizationVerification'
import OrganizationPending from './pages/auth/OrganizationPending'
import Privacy from './pages/auth/Privacy'
import Terms from './pages/auth/Terms'
import AppLayout from './pages/app/AppLayout'
import AppHome from './pages/app/index'
import Explore from './pages/app/explore'
import Opportunity from './pages/app/opportunity'
import ParticipationType from './pages/app/participation-type'
import CreateTeam from './pages/app/create-team'
import Teams from './pages/app/teams'
import TeamDashboard from './pages/app/team-dashboard'
import RegistrationSuccess from './pages/app/registration-success'
import MyApplications from './pages/app/my-applications'
import Saved from './pages/app/saved'
import Posts from './pages/app/posts'
import Notifications from './pages/app/notifications'
import Profile from './pages/app/profile'
import Rafeeq from './pages/app/rafeeq'
import RafeeqVoice from './pages/app/rafeeq-voice'
import OrgDashboard from './pages/org/org-dashboard.jsx'
import OrgPosts from './pages/org/org-posts.jsx'
import OrgProfile from './pages/org/org-profile.jsx'
import OrgOpportunities from './pages/org/org-opportunities.jsx'
import OrgCreateEvent from './pages/org/org-create-event.jsx'
import OrgApplicants from './pages/org/org-applicants.jsx'
import OrgReportCenter from './pages/org/org-report-center.jsx'
import OrgSettings from './pages/org/org-settings.jsx'
import './pages/admin/admin.css'
import './pages/org/org-dashboard.css'
import './pages/org/org-opportunities.css'
import './pages/org/org-applicants.css'
import './pages/org/org-create-event.css'
import './pages/org/org-profile.css'
import './pages/org/org-reports.css'
import AdminDashboard from './pages/admin/admin-dashboard.jsx'
import AdminEvents from './pages/admin/admin-events.jsx'
import AdminEventReviewDetails from './pages/admin/admin-event-review-details.jsx'
import AdminUsers from './pages/admin/admin-users.jsx'
import AdminVerifyOrganizations from './pages/admin/admin-verify-organizations.jsx'
import AdminCategories from './pages/admin/admin-categories.jsx'
import AdminReports from './pages/admin/admin-reports.jsx'
import AdminAuditLog from './pages/admin/admin-audit-log.jsx'

function useNavigationMenus() {
    useEffect(() => {
        const menus = [
            { toggleId: 'org-notif-toggle', panelId: 'org-notif-panel' },
            { toggleId: 'org-profile-toggle', panelId: 'org-profile-panel' },
            { toggleId: 'admin-notif-toggle', panelId: 'admin-notif-panel' },
            { toggleId: 'admin-profile-toggle', panelId: 'admin-profile-panel' },
        ]
        const drawers = [
            { toggleId: 'org-hamburger', drawerId: 'org-mobile-drawer', overlayId: 'org-mobile-overlay', closeId: 'org-nav-close' },
            { toggleId: 'admin-hamburger', drawerId: 'admin-mobile-drawer', overlayId: 'admin-mobile-overlay', closeId: 'admin-nav-close' },
        ]

        function closeMenus() {
            menus.forEach(({ toggleId, panelId }) => {
                document.getElementById(panelId)?.classList.remove('is-open')
                document.getElementById(panelId)?.setAttribute('aria-hidden', 'true')
                document.getElementById(toggleId)?.setAttribute('aria-expanded', 'false')
            })
        }

        function closeDrawers() {
            drawers.forEach(({ toggleId, drawerId, overlayId }) => {
                document.getElementById(drawerId)?.classList.remove('open')
                document.getElementById(overlayId)?.classList.remove('open')
                document.getElementById(toggleId)?.setAttribute('aria-expanded', 'false')
            })
            document.body.style.overflow = ''
        }

        function handleClick(event) {
            const toggle = event.target.closest('#org-notif-toggle, #org-profile-toggle, #admin-notif-toggle, #admin-profile-toggle')
            if (toggle) {
                const panelId = toggle.id.replace('-toggle', '-panel')
                const panel = document.getElementById(panelId)
                if (!panel) return

                const shouldOpen = !panel.classList.contains('is-open')
                closeMenus()
                if (shouldOpen) {
                    panel.classList.add('is-open')
                    panel.setAttribute('aria-hidden', 'false')
                    toggle.setAttribute('aria-expanded', 'true')
                }
                return
            }

            const drawerConfig = drawers.find(({ toggleId, closeId, overlayId }) =>
                event.target.closest(`#${toggleId}, #${closeId}, #${overlayId}`),
            )
            if (drawerConfig) {
                const drawer = document.getElementById(drawerConfig.drawerId)
                const shouldOpen = drawerConfig.toggleId === event.target.closest('button')?.id && !drawer?.classList.contains('open')
                closeDrawers()
                if (shouldOpen && drawer) {
                    drawer.classList.add('open')
                    document.getElementById(drawerConfig.overlayId)?.classList.add('open')
                    document.getElementById(drawerConfig.toggleId)?.setAttribute('aria-expanded', 'true')
                    document.body.style.overflow = 'hidden'
                }
                return
            }

            if (event.target.closest('.mobile-nav-drawer a')) closeDrawers()
            if (!event.target.closest('.org-topbar .org-dropdown')) closeMenus()
        }

        function handleKeyDown(event) {
            if (event.key === 'Escape') {
                closeMenus()
                closeDrawers()
            }
        }

        closeMenus()
        document.addEventListener('click', handleClick)
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('click', handleClick)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])
}

function LanguageSwitcher({ aboveAppNavigation = false }) {
    const { language, setLanguage } = useLanguage()
    const { t } = useTranslation()
    const activeLanguage = language.startsWith('ar') ? 'ar' : 'en'

    return (
        <div
            className={`global-language-switcher${aboveAppNavigation ? ' global-language-switcher--above-app-nav' : ''}`}
            role="group"
            aria-label={t('nav.toggleLanguage')}
        >
            <button type="button" aria-pressed={activeLanguage === 'ar'} onClick={() => setLanguage('ar')}>
                AR
            </button>
            <button type="button" aria-pressed={activeLanguage === 'en'} onClick={() => setLanguage('en')}>
                EN
            </button>
        </div>
    )
}

export default function App() {
    useNavigationMenus()
    const { t } = useTranslation()
    const { pathname } = useLocation()
    const showLanguageSwitcher = /^\/(auth|app|org|admin)(\/|$)/.test(pathname)
    return (
        <>
            {showLanguageSwitcher && <LanguageSwitcher aboveAppNavigation={pathname.startsWith('/app')} />}
            <Routes>
                <Route path="/" element={<Landing />} />

                <Route element={<VisitorLayout />}>
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/404" element={<NotFound />} />
                    <Route path="/auth/privacy" element={<Privacy />} />
                    <Route path="/auth/terms" element={<Terms />} />
                </Route>

                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/signup" element={<Signup />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                <Route path="/auth/organization-verification" element={<OrganizationVerification />} />
                <Route path="/auth/organization-pending" element={<OrganizationPending />} />

                <Route path="/app" element={<AppLayout />}>
                    <Route index element={<AppHome />} />
                    <Route path="explore" element={<Explore />} />
                    <Route path="opportunity" element={<Opportunity />} />
                    <Route path="participation-type" element={<ParticipationType />} />
                    <Route path="create-team" element={<CreateTeam />} />
                    <Route path="teams" element={<Teams />} />
                    <Route path="team-dashboard" element={<TeamDashboard />} />
                    <Route path="registration-success" element={<RegistrationSuccess />} />
                    <Route path="my-applications" element={<MyApplications />} />
                    <Route path="saved" element={<Saved />} />
                    <Route path="posts" element={<Posts />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="rafeeq" element={<Rafeeq />} />
                    <Route path="rafeeq/voice" element={<RafeeqVoice />} />
                    <Route path="*" element={<ComingSoon title={t('comingSoon.app')} />} />
                </Route>

                <Route path="/org/dashboard" element={<OrgDashboard />} />
                <Route path="/org/posts" element={<OrgPosts />} />
                <Route path="/org/profile" element={<OrgProfile />} />
                <Route path="/org/opportunities" element={<OrgOpportunities />} />
                <Route path="/org/create-event" element={<OrgCreateEvent />} />
                <Route path="/org/applicants" element={<OrgApplicants />} />
                <Route path="/org/report-center" element={<OrgReportCenter />} />
                <Route path="/org/settings" element={<OrgSettings />} />
                <Route path="/org/*" element={<ComingSoon title={t('comingSoon.org')} />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/events" element={<AdminEvents />} />
                <Route path="/admin/event-review-details" element={<AdminEventReviewDetails />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/verify-organizations" element={<AdminVerifyOrganizations />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/reports" element={<AdminReports />} />
                <Route path="/admin/audit-log" element={<AdminAuditLog />} />
                <Route path="/admin/*" element={<ComingSoon title={t('comingSoon.admin')} />} />

                <Route element={<VisitorLayout />}>
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </>
    )
}
