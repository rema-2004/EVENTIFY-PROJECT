import { useEffect } from 'react'
import AppPageHead from '../../components/app/AppPageHead'
import './admin-audit-log-data.js'
import { initAdminAuditLog } from './admin-audit-log.js'
import { useAdminPageControls } from './useAdminPageControls.js'
import AdminSidebar, { AdminMobileHeader } from '../../components/admin/AdminSidebar'
import AdminTopbar from '../../components/admin/AdminTopbar'
import '../../styles/admin/admin.css'
import '../../styles/admin/admin-audit-log.css'

export default function AdminAuditLog() {
    useAdminPageControls()
    useEffect(() => initAdminAuditLog(), [])

    return (
        <>
            <AppPageHead title="Audit Log | EVENTIFY" />
            <AdminMobileHeader />
            <div className="flex min-h-screen">
                <AdminSidebar />
                <main className="w-full flex-1 px-4 pt-6 pb-24 md:px-10 lg:pb-8">
                    <AdminTopbar title="Audit Log" />
                    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end relative z-50">
                        <div>
                            <p className="mt-1 text-on-surface-variant">
                                Monitor and audit every important activity and operation happening
                                on the platform.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button type="button" id="btn-refresh" className="btn-secondary">
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: 18 }}
                                >
                                    refresh
                                </span>{" "}
                                Refresh
                            </button>
                            <div className="row-menu">
                                <button type="button" id="btn-export" className="btn-primary">
                                    <span
                                        className="material-symbols-outlined"
                                        style={{ fontSize: 18 }}
                                    >
                                        download
                                    </span>{" "}
                                    Export Log
                                </button>
                                <div className="row-menu__panel" id="export-menu" hidden={true}>
                                    <button type="button" data-format="csv">
                                        <span
                                            className="material-symbols-outlined"
                                            style={{ fontSize: 16 }}
                                        >
                                            description
                                        </span>{" "}
                                        CSV
                                    </button>
                                    <button type="button" data-format="excel">
                                        <span
                                            className="material-symbols-outlined"
                                            style={{ fontSize: 16 }}
                                        >
                                            grid_on
                                        </span>{" "}
                                        Excel
                                    </button>
                                    <button type="button" data-format="pdf">
                                        <span
                                            className="material-symbols-outlined"
                                            style={{ fontSize: 16 }}
                                        >
                                            picture_as_pdf
                                        </span>{" "}
                                        PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="stat-grid mb-8">
                        <div className="stat-card">
                            <div className="stat-card__top">
                                <span className="stat-card__icon">
                                    <span className="material-symbols-outlined">list_alt</span>
                                </span>
                            </div>
                            <p className="stat-card__value" id="audit-stat-total">
                                0
                            </p>
                            <p className="stat-card__label">Total Activities</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card__top">
                                <span className="stat-card__icon">
                                    <span className="material-symbols-outlined">today</span>
                                </span>
                            </div>
                            <p className="stat-card__value" id="audit-stat-today">
                                0
                            </p>
                            <p className="stat-card__label">Today's Activities</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card__top">
                                <span className="stat-card__icon">
                                    <span className="material-symbols-outlined">gpp_maybe</span>
                                </span>
                            </div>
                            <p className="stat-card__value" id="audit-stat-sensitive">
                                0
                            </p>
                            <p className="stat-card__label">Sensitive Operations</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-card__top">
                                <span className="stat-card__icon">
                                    <span className="material-symbols-outlined">error</span>
                                </span>
                            </div>
                            <p className="stat-card__value" id="audit-stat-failed">
                                0
                            </p>
                            <p className="stat-card__label">Failed Activities</p>
                        </div>
                    </div>
                    <section className="mb-8" data-no-reveal="">
                        <div className="mb-4 flex flex-col gap-3">
                            <div className="audit-filter-grid">
                                <input
                                    type="text"
                                    id="audit-search"
                                    className="input-primary"
                                    placeholder="Search the audit log..."
                                />
                                <select
                                    id="audit-filter-user"
                                    className="input-primary"
                                    aria-label="User"
                                />
                                <select
                                    id="audit-filter-type"
                                    className="input-primary"
                                    aria-label="Activity type"
                                >
                                    <option value="all">All — Activity Type</option>
                                </select>
                                <select
                                    id="audit-filter-role"
                                    className="input-primary"
                                    aria-label="Role"
                                >
                                    <option value="all">All — Role</option>
                                </select>
                                <select
                                    id="audit-filter-status"
                                    className="input-primary"
                                    aria-label="Status"
                                >
                                    <option value="all">All — Status</option>
                                </select>
                                <select
                                    id="audit-filter-location"
                                    className="input-primary"
                                    aria-label="Location"
                                >
                                    <option value="all">All — Location</option>
                                </select>
                            </div>
                            <div className="audit-filter-row">
                                <select
                                    id="audit-filter-range"
                                    className="input-primary"
                                    style={{ maxWidth: 180 }}
                                    aria-label="Time period"
                                >
                                    <option value="all">All Time</option>
                                    <option value="today">Today</option>
                                    <option value="yesterday">Yesterday</option>
                                    <option value="7d">Last 7 Days</option>
                                    <option value="30d">Last 30 Days</option>
                                    <option value="custom">Custom Range</option>
                                </select>
                                <div
                                    className="audit-custom-range"
                                    id="audit-custom-range"
                                    hidden={true}
                                >
                                    <input
                                        type="date"
                                        id="audit-range-start"
                                        className="input-primary"
                                        aria-label="Start date"
                                    />
                                    <span className="text-on-surface-variant">–</span>
                                    <input
                                        type="date"
                                        id="audit-range-end"
                                        className="input-primary"
                                        aria-label="End date"
                                    />
                                </div>
                                <button
                                    type="button"
                                    id="btn-advanced-toggle"
                                    className="btn-secondary"
                                >
                                    <span
                                        className="material-symbols-outlined"
                                        style={{ fontSize: 18 }}
                                    >
                                        tune
                                    </span>{" "}
                                    Advanced Filters
                                </button>
                                <button
                                    type="button"
                                    id="btn-reset-filters"
                                    className="btn-secondary"
                                >
                                    <span
                                        className="material-symbols-outlined"
                                        style={{ fontSize: 18 }}
                                    >
                                        filter_alt_off
                                    </span>{" "}
                                    Clear Filters
                                </button>
                            </div>
                            <div className="advanced-filters-panel" id="audit-advanced-panel" hidden={true}>
                                <label>
                                    IP Address{" "}
                                    <input
                                        type="text"
                                        id="audit-adv-ip"
                                        className="input-primary"
                                        placeholder="e.g. 192.168.1.100"
                                    />
                                </label>
                                <label>
                                    Device{" "}
                                    <input
                                        type="text"
                                        id="audit-adv-device"
                                        className="input-primary"
                                        placeholder="e.g. Windows Desktop"
                                    />
                                </label>
                                <label>
                                    Browser{" "}
                                    <input
                                        type="text"
                                        id="audit-adv-browser"
                                        className="input-primary"
                                        placeholder="e.g. Chrome"
                                    />
                                </label>
                                <label>
                                    OS{" "}
                                    <input
                                        type="text"
                                        id="audit-adv-os"
                                        className="input-primary"
                                        placeholder="e.g. Windows 11"
                                    />
                                </label>
                                <label>
                                    Session ID{" "}
                                    <input
                                        type="text"
                                        id="audit-adv-session"
                                        className="input-primary"
                                        placeholder="e.g. SESS-000123"
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-title-lg font-semibold">Activity Log</h2>
                            <span className="live-dot-wrap">
                                <span className="live-dot" /> Live
                            </span>
                        </div>
                        <div id="audit-skeleton" className="panel" hidden={true} style={{ display: "none" }}>
                            <p className="mb-4 text-on-surface-variant">
                                Refreshing audit log...
                            </p>
                            <div className="skeleton skeleton-line" />
                            <div className="skeleton skeleton-line" />
                            <div className="skeleton skeleton-line" />
                        </div>
                        <div id="audit-empty" className="empty-state fade-in" hidden={true}>
                            <span className="empty-state__icon">
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    history_toggle_off
                                </span>
                            </span>
                            <h3>No activities found</h3>
                            <p>No activity matches the current filters.</p>
                            <button type="button" id="empty-reset-btn" className="btn-primary">
                                Clear Filters
                            </button>
                        </div>
                        <article className="panel panel--flush" id="audit-table-wrap">
                            <div className="table-scroll">
                                <table className="dash-table">
                                    <caption className="sr-only">Audit Log</caption>
                                    <thead>
                                        <tr>
                                            <th data-sort="timestamp" data-dir="desc">
                                                Date &amp; Time <span className="sort-arrow" />
                                            </th>
                                            <th data-sort="user">
                                                User <span className="sort-arrow" />
                                            </th>
                                            <th data-sort="action">
                                                Activity <span className="sort-arrow" />
                                            </th>
                                            <th data-sort="type">
                                                Type <span className="sort-arrow" />
                                            </th>
                                            <th>Target</th>
                                            <th>Location</th>
                                            <th data-sort="status">
                                                Status <span className="sort-arrow" />
                                            </th>
                                            <th style={{ textAlign: "right" }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="audit-tbody" />
                                </table>
                            </div>
                        </article>
                        <div className="mt-4 flex flex-col items-center gap-3 md:flex-row md:justify-between md:px-2">
                            <label
                                className="flex items-center gap-2 text-label-sm text-on-surface-variant"
                                style={{ whiteSpace: "nowrap" }}
                            >
                                Rows per page
                                <select
                                    id="audit-rows-per-page"
                                    className="input-primary"
                                    defaultValue={20}
                                    style={{ padding: "6px 10px", width: "auto" }}
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>
                                        20
                                    </option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </label>
                            <div className="pagination" id="audit-pagination" />
                        </div>
                    </section>
                    <section className="mt-10" data-no-reveal="">
                        <h2 className="mb-4 text-title-lg font-semibold">Security Activity</h2>
                        <article className="panel" id="audit-security-list" />
                    </section>
                </main>
            </div>
            {/* Activity Details */}
            <dialog
                className="confirm-dialog confirm-dialog--wide"
                id="audit-details-dialog"
            >
                <div
                    className="flex items-start justify-between gap-4"
                    style={{
                        position: "sticky",
                        top: 0,
                        background: "var(--surface)",
                        paddingBottom: 8,
                        zIndex: 1
                    }}
                >
                    <div>
                        <h3>Activity Details</h3>
                        <p
                            id="audit-detail-id"
                            style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 2 }}
                            className="mono"
                        />
                    </div>
                    <button
                        type="button"
                        id="btn-details-close"
                        className="rounded-full p-2"
                        aria-label="Close details"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div
                    className="stat-grid"
                    style={{
                        gridTemplateColumns: "1fr 1fr",
                        marginTop: 18,
                        marginBottom: 18
                    }}
                >
                    <div>
                        <p className="stat-card__label">Date &amp; Time</p>
                        <p
                            id="audit-detail-time"
                            className="mono"
                            style={{ fontSize: 14, marginTop: 2 }}
                        />
                    </div>
                    <div>
                        <p className="stat-card__label">User</p>
                        <div
                            id="audit-detail-user"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                marginTop: 4
                            }}
                        />
                    </div>
                    <div>
                        <p className="stat-card__label">Action</p>
                        <p id="audit-detail-action" style={{ marginTop: 2 }} />
                    </div>
                    <div>
                        <p className="stat-card__label">Target</p>
                        <p id="audit-detail-target" style={{ marginTop: 2 }} />
                    </div>
                    <div>
                        <p className="stat-card__label">Location</p>
                        <p id="audit-detail-location" style={{ marginTop: 2 }} />
                    </div>
                    <div>
                        <p className="stat-card__label">Status</p>
                        <div id="audit-detail-status" style={{ marginTop: 4 }} />
                    </div>
                    <div>
                        <p className="stat-card__label">IP Address</p>
                        <p id="audit-detail-ip" className="mono" style={{ marginTop: 2 }} />
                    </div>
                    <div>
                        <p className="stat-card__label">Device / Browser</p>
                        <p id="audit-detail-device" style={{ marginTop: 2 }} />
                    </div>
                </div>
                <p className="stat-card__label">Additional Details</p>
                <p id="audit-detail-notes" style={{ marginTop: 4, marginBottom: 18 }} />
                <p className="stat-card__label" style={{ marginBottom: 6 }}>
                    Activity Timeline
                </p>
                <div className="timeline" id="audit-detail-timeline" />
            </dialog>
            
        </>
    )
}
