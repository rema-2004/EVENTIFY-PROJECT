import { Link, useLocation, useParams } from 'react-router-dom'
import AppPageHead from '../../components/app/AppPageHead'
import { useAdminPageControls } from './useAdminPageControls.js'
import AdminSidebar, { AdminMobileHeader } from '../../components/admin/AdminSidebar'
import AdminTopbar from '../../components/admin/AdminTopbar'
import EventRegistrationsSection from '../../components/admin/EventRegistrationsSection'
import { useLanguage } from '../../hooks/useLanguage'
import '../../styles/admin/admin.css'

// Registrations only exist once an event is approved and published, so this
// page is opened from approved events only (not from the review page).
export default function AdminEventRegistrations() {
    useAdminPageControls()
    const { eventId } = useParams()
    const { state } = useLocation()
    const { language } = useLanguage()
    const ar = language === 'ar'
    const eventTitle = state?.title ?? (ar ? 'الفعالية' : 'Event')

    return (
        <>
            <AppPageHead title="Event Registrations | EVENTIFY" />
            <AdminMobileHeader />
            <div className="flex min-h-screen">
                <AdminSidebar />
                <main className="w-full flex-1 px-4 pt-6 pb-24 md:px-10 lg:pb-8">
                    <AdminTopbar title={ar ? 'المسجّلون في الفعالية' : 'Event Registrations'} />
                    <div className="mb-6 flex items-center gap-2 text-label-md">
                        <Link className="text-on-surface-variant hover:text-primary" to="/admin/events">
                            {ar ? 'مراجعة الفعاليات' : 'Review Events'}
                        </Link>
                        <span className="text-outline">/</span>
                        <span>{eventTitle}</span>
                    </div>
                    <EventRegistrationsSection eventId={eventId} />
                </main>
            </div>
        </>
    )
}
