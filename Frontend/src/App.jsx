// Every stylesheet is imported eagerly, in the original cascade order, so code-splitting the pages
// below can never change which rule wins.
import './styles/visitor/visitor.css'
import './styles/visitor/Landing.css'
import './styles/auth/auth-shell.css'
import './styles/auth/auth.css'
import './styles/app/nav.css'
import './styles/app/app-shell.css'
import './styles/app/app-pages.css'
import './styles/org/sidebar.css'
import './styles/admin/admin.css'
import './styles/org/org-dashboard.css'
import './styles/org/org-profile.css'
import './styles/org/org-opportunities.css'
import './styles/org/org-create-event.css'
import './styles/org/org-applicants.css'
import './styles/org/org-reports.css'
import './styles/admin/admin-reports.css'
import './styles/admin/admin-audit-log.css'
import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import VisitorLayout from './layouts/VisitorLayout'
import WorkspaceLocalization from './i18n/WorkspaceLocalization'
const Landing = lazy(() => import('./pages/visitor/Landing'))
const About = lazy(() => import('./pages/visitor/About'))
const Contact = lazy(() => import('./pages/visitor/Contact'))
const NotFound = lazy(() => import('./pages/visitor/NotFound'))
const ComingSoon = lazy(() => import('./pages/ComingSoon'))
const Login = lazy(() => import('./pages/auth/Login'))
const Signup = lazy(() => import('./pages/auth/Signup'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'))
const OrganizationVerification = lazy(() => import('./pages/auth/OrganizationVerification'))
const OrganizationPending = lazy(() => import('./pages/auth/OrganizationPending'))
const Privacy = lazy(() => import('./pages/auth/Privacy'))
const Terms = lazy(() => import('./pages/auth/Terms'))
const AppLayout = lazy(() => import('./pages/app/AppLayout'))
const AppHome = lazy(() => import('./pages/app/index'))
const UploadCV = lazy(() => import('./pages/app/UploadCV'))
const WizardForm = lazy(() => import('./pages/app/WizardForm'))
const Explore = lazy(() => import('./pages/app/explore'))
const Opportunity = lazy(() => import('./pages/app/opportunity'))
const ParticipationType = lazy(() => import('./pages/app/participation-type'))
const CreateTeam = lazy(() => import('./pages/app/create-team'))
const Teams = lazy(() => import('./pages/app/teams'))
const TeamDashboard = lazy(() => import('./pages/app/team-dashboard'))
const RegistrationSuccess = lazy(() => import('./pages/app/registration-success'))
const MyApplications = lazy(() => import('./pages/app/my-applications'))
const Saved = lazy(() => import('./pages/app/saved'))
const Posts = lazy(() => import('./pages/app/posts'))
const Notifications = lazy(() => import('./pages/app/notifications'))
const Profile = lazy(() => import('./pages/app/profile'))
const Rafeeq = lazy(() => import('./pages/app/rafeeq'))
const RafeeqVoice = lazy(() => import('./pages/app/rafeeq-voice'))
const OrgDashboard = lazy(() => import('./pages/org/org-dashboard.jsx'))
const OrgPosts = lazy(() => import('./pages/org/org-posts.jsx'))
const OrgProfile = lazy(() => import('./pages/org/org-profile.jsx'))
const OrgOpportunities = lazy(() => import('./pages/org/org-opportunities.jsx'))
const OrgCreateEvent = lazy(() => import('./pages/org/org-create-event.jsx'))
const OrgApplicants = lazy(() => import('./pages/org/org-applicants.jsx'))
const OrgReportCenter = lazy(() => import('./pages/org/org-report-center.jsx'))
const OrgSettings = lazy(() => import('./pages/org/org-settings.jsx'))
const AdminDashboard = lazy(() => import('./pages/admin/admin-dashboard.jsx'))
const AdminEvents = lazy(() => import('./pages/admin/admin-events.jsx'))
const AdminEventReviewDetails = lazy(() => import('./pages/admin/admin-event-review-details.jsx'))
const AdminUsers = lazy(() => import('./pages/admin/admin-users.jsx'))
const AdminVerifyOrganizations = lazy(() => import('./pages/admin/admin-verify-organizations.jsx'))
const AdminCategories = lazy(() => import('./pages/admin/admin-categories.jsx'))
const AdminReports = lazy(() => import('./pages/admin/admin-reports.jsx'))
const AdminAuditLog = lazy(() => import('./pages/admin/admin-audit-log.jsx'))

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

export default function App() {
    useNavigationMenus()
    const { t } = useTranslation()
    return (
        <>
            <WorkspaceLocalization />
            <Suspense fallback={null}>
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
                <Route path="/auth/reset-password" element={<ResetPassword />} />
                <Route path="/auth/organization-verification" element={<OrganizationVerification />} />
                <Route path="/auth/organization-pending" element={<OrganizationPending />} />
                <Route path="/upload-cv" element={<UploadCV />} />
                <Route path="/wizard-form" element={<WizardForm />} />

                <Route path="/app" element={<AppLayout />}>
                    <Route index element={<AppHome />} />
                    <Route path="upload-cv" element={<UploadCV />} />
                    <Route path="wizard-form" element={<WizardForm />} />
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
            </Suspense>
        </>
    )
}
