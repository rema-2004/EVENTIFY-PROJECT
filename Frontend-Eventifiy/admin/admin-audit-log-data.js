/* Admin Audit Log — mock data (frontend-only, no backend). */
(function () {
    function seeded(seed) {
        let v = seed;
        return function () {
            v = (v * 9301 + 49297) % 233280;
            return v / 233280;
        };
    }
    const rand = seeded(7331);
    function pick(arr) { return arr[Math.floor(rand() * arr.length)]; }
    function pad(n, len) { return String(n).padStart(len, '0'); }

    const ROLES = ['Platform Admin', 'Organization', 'Participant'];
    const TYPES = ['Login', 'Logout', 'Create', 'Update', 'Delete', 'Approve', 'Reject', 'Verification', 'Permission Change', 'Export'];
    const STATUSES = ['Success', 'Failed', 'Warning'];
    const LOCATIONS = ['Dashboard', 'Users Management', 'Organizations', 'Events', 'Reports', 'Settings', 'Security'];

    const USERS = [
        { name: 'Ahmed Admin', role: 'Platform Admin' },
        { name: 'Sara Al-Khatib', role: 'Platform Admin' },
        { name: 'Yara Haddad', role: 'Platform Admin' },
        { name: 'TechGenius Labs', role: 'Organization' },
        { name: 'DesignHub Amman', role: 'Organization' },
        { name: 'Cloud Native Academy', role: 'Organization' },
        { name: 'Startup Nation', role: 'Organization' },
        { name: 'Omar Yousef', role: 'Participant' },
        { name: 'Lina Barakat', role: 'Participant' },
        { name: 'Yousef Nasser', role: 'Participant' },
        { name: 'Rana Odeh', role: 'Participant' },
        { name: 'Khaled Fares', role: 'Participant' }
    ];

    /* Device paired with a plausible OS + typical browsers, so a row never claims e.g. a Samsung phone running Windows. */
    const DEVICE_PROFILES = [
        { device: 'Windows Desktop', os: 'Windows 11', browsers: ['Chrome', 'Edge', 'Firefox'] },
        { device: 'MacBook Pro', os: 'macOS Sonoma', browsers: ['Safari', 'Chrome'] },
        { device: 'iPhone 14', os: 'iOS 17', browsers: ['Safari', 'Chrome'] },
        { device: 'Samsung Galaxy S23', os: 'Android 14', browsers: ['Chrome'] },
        { device: 'iPad Air', os: 'iOS 17', browsers: ['Safari'] },
        { device: 'Linux Workstation', os: 'Ubuntu 22.04', browsers: ['Firefox', 'Chrome'] }
    ];

    const EVENTS = ['Global AI Innovation Challenge', 'Frontend Wizards', 'Startup Challenge', 'DevOps Masterclass', 'Cloud Native Bootcamp'];

    /* Each template: type, action, location, sensitive, roles allowed, target()/details() generators */
    const TEMPLATES = [
        { type: 'Login', action: 'Login', location: 'Dashboard', sensitive: false, roles: ROLES,
          target: () => 'Session', details: (s) => s === 'Success' ? 'User successfully logged into the platform.' : 'Login attempt failed due to invalid credentials.' },
        { type: 'Logout', action: 'Logout', location: 'Dashboard', sensitive: false, roles: ROLES,
          target: () => 'Session', details: () => 'User session was ended.' },
        { type: 'Create', action: 'Created Event', location: 'Events', sensitive: false, roles: ['Organization'],
          target: (r) => `Event · ${pick(EVENTS)}`, details: () => 'A new event was created and submitted for review.' },
        { type: 'Update', action: 'Updated Event', location: 'Events', sensitive: false, roles: ['Organization'],
          target: (r) => `Event · ${pick(EVENTS)}`, details: () => 'Event details were edited by the organization.' },
        { type: 'Approve', action: 'Approved Organization', location: 'Organizations', sensitive: false, roles: ['Platform Admin'],
          target: (r) => `Organization #ORG-${pad(300 + r, 3)}`, details: () => 'Organization application was reviewed and approved.' },
        { type: 'Reject', action: 'Rejected Application', location: 'Events', sensitive: false, roles: ['Platform Admin'],
          target: (r) => `Application #APP-${pad(500 + r, 3)}`, details: () => 'Application was rejected due to incomplete requirements.' },
        { type: 'Delete', action: 'Deleted User', location: 'Users Management', sensitive: true, roles: ['Platform Admin'],
          target: (r) => `User #U-${pad(1000 + r, 4)}`, details: (s) => s === 'Success' ? 'User account was successfully removed by the administrator.' : 'Attempt to delete the user account failed.' },
        { type: 'Delete', action: 'Deleted Event', location: 'Events', sensitive: true, roles: ['Platform Admin'],
          target: () => `Event · ${pick(EVENTS)}`, details: () => 'Event was permanently removed from the platform.' },
        { type: 'Permission Change', action: 'Changed Permissions', location: 'Settings', sensitive: true, roles: ['Platform Admin'],
          target: (r) => `User #U-${pad(1000 + r, 4)}`, details: () => 'User role and permission set was updated.' },
        { type: 'Update', action: 'Suspended Account', location: 'Users Management', sensitive: true, roles: ['Platform Admin'],
          target: (r) => `User #U-${pad(2000 + r, 4)}`, details: () => 'Account access was suspended pending review.' },
        { type: 'Update', action: 'Changed Security Settings', location: 'Security', sensitive: true, roles: ['Platform Admin'],
          target: () => 'Platform Security Policy', details: () => 'Security configuration was modified.' },
        { type: 'Verification', action: 'Verified Organization', location: 'Organizations', sensitive: true, roles: ['Platform Admin'],
          target: (r) => `Organization #ORG-${pad(340 + r, 3)}`, details: () => 'Organization documents were reviewed and verified.' },
        { type: 'Export', action: 'Exported Report', location: 'Reports', sensitive: false, roles: ['Platform Admin'],
          target: () => 'Report: Platform Analytics', details: () => 'A report file was generated for download.' },
        { type: 'Create', action: 'Submitted Application', location: 'Events', sensitive: false, roles: ['Participant'],
          target: (r) => `Application to ${pick(EVENTS)}`, details: () => 'Participant submitted an application to an event.' }
    ];

    function randomIp() { return `192.168.${Math.floor(rand() * 4) + 1}.${Math.floor(rand() * 254) + 1}`; }

    function usersForRoles(roles) { return USERS.filter(u => roles.indexOf(u.role) !== -1); }

    function makeAuditLogs() {
        const total = 74;
        const now = new Date('2026-09-06T10:42:31');
        const logs = [];

        for (let i = 0; i < total; i++) {
            const tpl = pick(TEMPLATES);
            const user = pick(usersForRoles(tpl.roles));
            const minutesAgo = i < 16 ? Math.floor(rand() * 480) : Math.floor(rand() * 30 * 24 * 60);
            const ts = new Date(now.getTime() - minutesAgo * 60000);

            let status = 'Success';
            const r = rand();
            if (tpl.type === 'Login') status = r < 0.72 ? 'Success' : (r < 0.9 ? 'Failed' : 'Warning');
            else status = r < 0.84 ? 'Success' : (r < 0.94 ? 'Warning' : 'Failed');

            const iso = ts.toISOString().slice(0, 19).replace('T', ' ');
            const profile = pick(DEVICE_PROFILES);
            logs.push({
                id: 'ACT-' + pad(12458 - i, 8),
                timestamp: iso,
                user: user.name,
                role: user.role,
                action: tpl.action,
                type: tpl.type,
                target: tpl.target(i),
                location: tpl.location,
                status: status,
                sensitive: tpl.sensitive,
                ip: randomIp(),
                device: profile.device,
                browser: pick(profile.browsers),
                os: profile.os,
                sessionId: 'SESS-' + pad(Math.floor(rand() * 999999), 6),
                details: tpl.details(status)
            });
        }

        logs.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1);
        return logs;
    }

    function buildTimeline(log) {
        const base = new Date(log.timestamp.replace(' ', 'T'));
        function stepTime(offsetSec) {
            const t = new Date(base.getTime() + offsetSec * 1000);
            return t.toTimeString().slice(0, 8);
        }

        const failed = log.status === 'Failed';
        const map = {
            'Login': [
                { offset: -6, text: 'User opened the login page.' },
                { offset: -2, text: 'Credentials submitted.' },
                { offset: 0, text: failed ? 'Login failed — invalid credentials.' : 'Login successful.' }
            ],
            'Logout': [
                { offset: -1, text: 'Sign-out requested.' },
                { offset: 0, text: 'Session ended.' }
            ],
            'Create': [
                { offset: -8, text: `${log.user} opened the creation form.` },
                { offset: -3, text: 'Details filled and submitted.' },
                { offset: 0, text: failed ? 'Creation failed.' : `${log.target} created successfully.` }
            ],
            'Update': [
                { offset: -6, text: `${log.user} opened ${log.target}.` },
                { offset: -2, text: 'Changes were made.' },
                { offset: 0, text: failed ? 'Update failed to save.' : 'Changes saved successfully.' }
            ],
            'Delete': [
                { offset: -5, text: `${log.user} opened ${log.target}.` },
                { offset: -2, text: 'Delete action initiated.' },
                { offset: 0, text: failed ? 'Delete action failed.' : `${log.target} deleted successfully.` }
            ],
            'Approve': [
                { offset: -6, text: `${log.user} opened the review queue.` },
                { offset: -2, text: `${log.target} reviewed.` },
                { offset: 0, text: 'Approved.' }
            ],
            'Reject': [
                { offset: -6, text: `${log.user} opened the review queue.` },
                { offset: -2, text: `${log.target} reviewed.` },
                { offset: 0, text: 'Rejected.' }
            ],
            'Verification': [
                { offset: -10, text: 'Verification documents requested.' },
                { offset: -4, text: 'Documents reviewed.' },
                { offset: 0, text: failed ? 'Verification could not be completed.' : 'Organization verified.' }
            ],
            'Permission Change': [
                { offset: -5, text: `${log.user} opened user settings.` },
                { offset: -2, text: 'Role and permissions modified.' },
                { offset: 0, text: 'Changes saved.' }
            ],
            'Export': [
                { offset: -3, text: 'Export options selected.' },
                { offset: -1, text: 'File generated.' },
                { offset: 0, text: 'File ready for download.' }
            ]
        };

        const steps = map[log.type] || [{ offset: 0, text: log.details }];
        return steps.map(s => ({ time: stepTime(s.offset), text: s.text }));
    }

    function buildSecurityActivity(logs) {
        const result = [];
        const failedLogin = logs.find(l => l.type === 'Login' && l.status === 'Failed');
        if (failedLogin) result.push({ icon: 'lock', label: 'Failed Login', user: failedLogin.user, time: failedLogin.timestamp, status: failedLogin.status });

        const permChange = logs.find(l => l.type === 'Permission Change');
        if (permChange) result.push({ icon: 'admin_panel_settings', label: 'Permission Changed', user: permChange.user, time: permChange.timestamp, status: permChange.status });

        const suspension = logs.find(l => l.action === 'Suspended Account');
        if (suspension) result.push({ icon: 'block', label: 'Account Suspended', user: suspension.target, time: suspension.timestamp, status: suspension.status });

        return result.slice(0, 3);
    }

    window.AdminAuditLogData = {
        logs: makeAuditLogs(),
        USERS: USERS,
        TYPES: TYPES,
        ROLES: ROLES,
        STATUSES: STATUSES,
        LOCATIONS: LOCATIONS,
        buildTimeline: buildTimeline,
        buildSecurityActivity: buildSecurityActivity
    };
})();
