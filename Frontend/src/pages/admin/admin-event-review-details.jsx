import { Link } from 'react-router-dom'
import AppPageHead from '../../components/app/AppPageHead'
import { useAdminPageControls } from './useAdminPageControls.js'
import AdminSidebar, { AdminMobileHeader } from '../../components/admin/AdminSidebar'
import AdminTopbar from '../../components/admin/AdminTopbar'
import '../../styles/admin/admin.css'

export default function AdminEventReviewDetails() {
    useAdminPageControls()
    return (
        <>
            <AppPageHead title="Event Review Details | EVENTIFY" />
            <AdminMobileHeader />
            <div className="flex min-h-screen">
                <AdminSidebar />
                <main className="w-full flex-1 px-4 pt-6 pb-24 md:px-10 lg:pb-8">
                    <AdminTopbar title="Event Review Details" />
                    <div className="mb-6 flex items-center gap-2 text-label-md">
                        <Link
                            className="text-on-surface-variant hover:text-primary"
                            to="/admin/events"
                        >
                            Review Events
                        </Link>
                        <span className="text-outline">/</span>
                        <span>DevOps Masterclass</span>
                    </div>
                    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <p className="mt-1 text-on-surface-variant">
                                Validate content quality, organizer trust, dates, and publishing
                                readiness.
                            </p>
                        </div>
                        <div className="flex gap-3" data-review-container="">
                            <button type="button" className="btn-danger-outline" data-ui-action="reject">
                                Reject with reason
                            </button>
                            <button type="button" className="btn-success" data-ui-action="approve">
                                Approve publish
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <section className="section-card lg:col-span-2">
                            <div className="mb-6 flex flex-wrap items-center gap-2">
                                <span className="badge badge--pending">Pending approval</span>
                                <span className="rounded-full bg-primary/10 px-3 py-1 text-label-sm font-semibold text-primary">
                                    Course
                                </span>
                                <span className="rounded-full bg-surface-container px-3 py-1 text-label-sm font-semibold text-on-surface-variant">
                                    Online
                                </span>
                            </div>
                            <h2 className="text-headline-md font-semibold">DevOps Masterclass</h2>
                            <p className="mt-2 text-on-surface-variant">
                                A hands-on cloud lab covering CI/CD, Kubernetes, and infrastructure
                                as code over 6 weeks.
                            </p>
                            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="rounded-xl bg-surface-container-low p-4">
                                    <p className="text-label-sm font-semibold text-on-surface-variant">
                                        Organizer
                                    </p>
                                    <p className="font-semibold">TechGenius Labs</p>
                                </div>
                                <div className="rounded-xl bg-surface-container-low p-4">
                                    <p className="text-label-sm font-semibold text-on-surface-variant">
                                        Dates
                                    </p>
                                    <p className="font-semibold">Nov 12 - Dec 24, 2026</p>
                                </div>
                                <div className="rounded-xl bg-surface-container-low p-4">
                                    <p className="text-label-sm font-semibold text-on-surface-variant">
                                        Target audience
                                    </p>
                                    <p className="font-semibold">Students and junior developers</p>
                                </div>
                                <div className="rounded-xl bg-surface-container-low p-4">
                                    <p className="text-label-sm font-semibold text-on-surface-variant">
                                        Capacity
                                    </p>
                                    <p className="font-semibold">120 participants</p>
                                </div>
                            </div>
                            <div className="mt-8">
                                <h3 className="mb-4 text-title-lg font-semibold">Requirements</h3>
                                <ul className="space-y-2 text-on-surface-variant">
                                    <li>Basic Linux command-line knowledge.</li>
                                    <li>GitHub account and laptop with stable internet.</li>
                                    <li>Weekly attendance for live labs.</li>
                                </ul>
                            </div>
                        </section>
                        <aside className="space-y-6">
                            <section className="section-card">
                                <h3 className="mb-4 text-title-lg font-semibold">
                                    Review Checklist
                                </h3>
                                <div className="space-y-3 text-label-md">
                                    <p className="flex justify-between">
                                        <span>Verified organizer</span>
                                        <span className="text-success">Pass</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>Clear description</span>
                                        <span className="text-success">Pass</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>Valid dates</span>
                                        <span className="text-success">Pass</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>Policy risk</span>
                                        <span className="text-tertiary">Low</span>
                                    </p>
                                </div>
                            </section>
                            <section className="section-card">
                                <h3 className="mb-4 text-title-lg font-semibold">
                                    Rejection Reason
                                </h3>
                                <textarea
                                    className="h-36 w-full resize-none rounded-xl border-outline-variant bg-white p-4"
                                    placeholder="Write a clear reason if rejecting..."
                                    defaultValue={""}
                                />
                                <button
                                    type="button"
                                    className="btn-danger-outline"
                                    style={{ width: "100%", marginTop: 12 }}
                                >
                                    Send rejection
                                </button>
                            </section>
                        </aside>
                    </div>
                </main>
            </div>
        </>
    )
}
