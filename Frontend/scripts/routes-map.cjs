// Maps original static filenames (no extension) to the new SPA route paths.
// Shared by html-to-jsx.cjs across every page conversion pass.
module.exports = {
    // The Visitor
    landing: '/',
    about: '/about',
    contact: '/contact',
    '404': '/404',

    // auth
    login: '/auth/login',
    signup: '/auth/signup',
    'forgot-password': '/auth/forgot-password',
    'organization-verification': '/auth/organization-verification',
    'organization-pending': '/auth/organization-pending',
    privacy: '/auth/privacy',
    terms: '/auth/terms',

    // app (index.html -> /app)
    // handled specially: app/index -> /app
    explore: '/app/explore',
    opportunity: '/app/opportunity',
    'participation-type': '/app/participation-type',
    'create-team': '/app/create-team',
    teams: '/app/teams',
    'team-dashboard': '/app/team-dashboard',
    'registration-success': '/app/registration-success',
    'my-applications': '/app/my-applications',
    saved: '/app/saved',
    posts: '/app/posts',
    notifications: '/app/notifications',
    profile: '/app/profile',
    rafeeq: '/app/rafeeq',

    // org
    'org-dashboard': '/org/dashboard',
    'org-create-event': '/org/create-event',
    'org-opportunities': '/org/opportunities',
    'org-applicants': '/org/applicants',
    'org-posts': '/org/posts',
    'org-profile': '/org/profile',
    'org-report-center': '/org/report-center',
    'org-settings': '/org/settings',

    // admin
    'admin-dashboard': '/admin/dashboard',
    'admin-events': '/admin/events',
    'admin-event-review-details': '/admin/event-review-details',
    'admin-users': '/admin/users',
    'admin-verify-organizations': '/admin/verify-organizations',
    'admin-categories': '/admin/categories',
    'admin-reports': '/admin/reports',
    'admin-audit-log': '/admin/audit-log',
}
