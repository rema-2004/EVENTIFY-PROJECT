/* Admin Reports page — mock data layer.
   `reports` backs the table (search/filter/sort/paginate/CRUD).
   buildPreview(type, period) backs the preview modal (summary + chart + table)
   for both freshly-created reports and re-opened ones.
   Swap this file for a real API later — every function keeps its return shape. */
(function () {
    const TYPES = ['Users', 'Events', 'Registration', 'Organizations', 'AI Matching', 'Platform Performance'];
    const STATUSES = ['Completed', 'In Progress', 'Failed', 'Scheduled'];
    const FORMATS = ['PDF', 'Excel', 'CSV'];
    const CREATORS = ['Platform Admin', 'Admin Reviewer'];

    function seeded(seed) {
        let v = seed;
        return () => { v = (v * 9301 + 49297) % 233280; return v / 233280; };
    }

    function pad(n) { return String(n).padStart(2, '0'); }

    function makeReports() {
        const rand = seeded(42);
        const titles = {
            Users: ['Monthly Users Report', 'New Signups Overview', 'User Verification Report', 'Active Users Snapshot'],
            Events: ['Events Performance Report', 'Competitions Summary', 'Upcoming Events Report', 'Events by Category'],
            Registration: ['Registrations Overview', 'Weekly Registration Report', 'Registration Funnel Report'],
            Organizations: ['Organizations Activity Report', 'Verified Organizations Report', 'Top Organizations Report'],
            'AI Matching': ['AI Matching Usage Report', 'Match Quality Report'],
            'Platform Performance': ['Platform Performance Report', 'System Health Report']
        };

        const rows = [];
        let id = 1;
        TYPES.forEach((type) => {
            titles[type].forEach((title, i) => {
                const day = 1 + Math.floor(rand() * 27);
                const status = STATUSES[Math.floor(rand() * STATUSES.length)];
                const format = FORMATS[Math.floor(rand() * FORMATS.length)];
                const creator = CREATORS[Math.floor(rand() * CREATORS.length)];
                const month = i % 2 === 0 ? 'Sep' : 'Aug';
                rows.push({
                    id: 'RPT-' + String(id++).padStart(3, '0'),
                    name: title,
                    type,
                    period: month === 'Sep' ? 'Sep 2026' : 'Aug 2026',
                    createdBy: creator,
                    date: `2026-${month === 'Sep' ? '09' : '08'}-${pad(day)}`,
                    format,
                    status
                });
            });
        });
        // a few more to comfortably exercise pagination
        for (let i = 0; i < 6; i++) {
            const type = TYPES[Math.floor(rand() * TYPES.length)];
            rows.push({
                id: 'RPT-' + String(id++).padStart(3, '0'),
                name: type + ' Report — ' + (i + 1),
                type,
                period: 'Jul 2026',
                createdBy: CREATORS[Math.floor(rand() * CREATORS.length)],
                date: '2026-07-' + pad(2 + i * 3),
                format: FORMATS[Math.floor(rand() * FORMATS.length)],
                status: STATUSES[Math.floor(rand() * STATUSES.length)]
            });
        }
        return rows;
    }

    const reports = makeReports();

    /* --- per-type preview content ---------------------------------------- */
    function buildPreview(type, period) {
        const label = period || 'Sep 2026';
        switch (type) {
            case 'Users':
                return {
                    summary: [
                        { label: 'Total Users', value: '8,420' },
                        { label: 'New This Period', value: '412' },
                        { label: 'Active Users', value: '5,180' },
                        { label: 'Verified', value: '3,960' }
                    ],
                    chart: {
                        type: 'line',
                        labels: ['W1', 'W2', 'W3', 'W4'],
                        datasets: [{ label: 'New users', data: [86, 104, 98, 124] }]
                    },
                    table: {
                        headers: ['University', 'Signups', 'Verified'],
                        rows: [
                            ['University of Jordan', 152, 121],
                            ['Princess Sumaya Univ.', 96, 80],
                            ['German Jordanian Univ.', 74, 58],
                            ['Al-Hussein Tech Univ.', 61, 47]
                        ]
                    }
                };
            case 'Events':
                return {
                    summary: [
                        { label: 'Total Events', value: '248' },
                        { label: 'Active Events', value: '182' },
                        { label: 'Registrations', value: '3,420' },
                        { label: 'Acceptance Rate', value: '61%' }
                    ],
                    chart: {
                        type: 'doughnut',
                        labels: ['Competitions', 'Workshops', 'Courses', 'Conferences'],
                        datasets: [{ data: [38, 29, 22, 11] }]
                    },
                    table: {
                        headers: ['Event', 'Category', 'Applicants', 'Rating'],
                        rows: [
                            ['AI Innovation Challenge', 'Artificial Intelligence', 1240, 4.9],
                            ['Regional Programming Challenge', 'Programming', 980, 4.7],
                            ['Product Design Sprint', 'Design', 438, 4.8]
                        ]
                    }
                };
            case 'Registration':
                return {
                    summary: [
                        { label: 'Total Registrations', value: '24,310' },
                        { label: 'Approved', value: '21,460' },
                        { label: 'Pending', value: '892' },
                        { label: 'Rejected', value: '1,958' }
                    ],
                    chart: {
                        type: 'bar',
                        labels: ['Approved', 'Pending', 'Rejected'],
                        datasets: [{ label: 'Registrations', data: [21460, 892, 1958] }]
                    },
                    table: {
                        headers: ['Target', 'Type', 'Status', 'Date'],
                        rows: [
                            ['AI Innovation Challenge', 'Competition', 'Pending', '2026-09-04'],
                            ['EVENTIFY Demo Day', 'Event', 'Approved', '2026-09-04'],
                            ['Cyber Sentinel CTF', 'Competition', 'Rejected', '2026-09-03']
                        ]
                    }
                };
            case 'Organizations':
                return {
                    summary: [
                        { label: 'Total Organizations', value: '312' },
                        { label: 'Verified', value: '259' },
                        { label: 'Opportunities Published', value: '1,742' },
                        { label: 'Avg Rating', value: '4.7' }
                    ],
                    chart: {
                        type: 'bar',
                        labels: ['TechGenius Labs', 'DevCommunity Hub', 'Creative Minds Studio'],
                        datasets: [{ label: 'Opportunities published', data: [5, 3, 1] }]
                    },
                    table: {
                        headers: ['Organization', 'Type', 'Verified', 'Applicants Reached'],
                        rows: [
                            ['TechGenius Labs', 'Technology Training Center', 'Yes', 1900],
                            ['DevCommunity Hub', 'Company', 'Yes', 1210],
                            ['DesignHub Amman', 'Student club', 'No', 438]
                        ]
                    }
                };
            case 'AI Matching':
                return {
                    summary: [
                        { label: 'Match Usage', value: '91%' },
                        { label: 'Avg Match Score', value: '84%' },
                        { label: 'Applications Matched', value: '1,168' },
                        { label: 'Top Skill', value: 'Python' }
                    ],
                    chart: {
                        type: 'doughnut',
                        labels: ['High match (80%+)', 'Medium match', 'Low match'],
                        datasets: [{ data: [58, 31, 11] }]
                    },
                    table: {
                        headers: ['Skill', 'Applications', 'Match Rate'],
                        rows: [
                            ['Python', 412, '89%'],
                            ['React', 298, '82%'],
                            ['Machine Learning', 264, '86%']
                        ]
                    }
                };
            default: // Platform Performance
                return {
                    summary: [
                        { label: 'Uptime', value: '99.95%' },
                        { label: 'Avg Response', value: '212ms' },
                        { label: 'Active Sessions', value: '1,340' },
                        { label: 'Error Rate', value: '0.08%' }
                    ],
                    chart: {
                        type: 'line',
                        labels: ['00:00', '06:00', '12:00', '18:00'],
                        datasets: [{ label: 'Avg response (ms)', data: [198, 205, 232, 212] }]
                    },
                    table: {
                        headers: ['Service', 'Status', 'Uptime'],
                        rows: [
                            ['API Gateway', 'Healthy', '99.98%'],
                            ['Search Index', 'Healthy', '99.91%'],
                            ['Notifications', 'Degraded', '98.60%']
                        ]
                    }
                };
        }
    }

    window.AdminReportsPage = { reports, buildPreview, TYPES, STATUSES, FORMATS, period: 'Sep 2026' };
})();
