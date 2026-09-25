import { Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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

export default function App() {
    const { t } = useTranslation()
    return (
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

            {/* Not yet ported — app/org/admin land in later passes. */}
            <Route path="/app/*" element={<ComingSoon title={t('comingSoon.app')} />} />
            <Route path="/org/*" element={<ComingSoon title={t('comingSoon.org')} />} />
            <Route path="/admin/*" element={<ComingSoon title={t('comingSoon.admin')} />} />

            <Route element={<VisitorLayout />}>
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    )
}
