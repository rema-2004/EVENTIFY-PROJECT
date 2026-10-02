/* EVENTIFY — Organizer Reports & Analytics Data Layer
   Mock data for TechGenius Labs.
   Supports multiple time ranges: 7d, 30d, 3m, 1y. */
(function () {
    const RANGE_METRICS = {
        'today': {
            views: '620',
            viewsTrend: 5.2,
            applications: '17',
            applicationsTrend: 9.1,
            acceptanceRate: '77%',
            acceptanceTrend: 1.0,
            avgRating: '4.9/5',
            ratingTrend: 0.0,
            growthTrend: {
                labels: ['00:00', '06:00', '12:00', '18:00'],
                views: [40, 120, 260, 200],
                applications: [1, 3, 8, 5],
                accepted: [1, 2, 6, 4]
            }
        },
        '7d': {
            views: '3.8k',
            viewsTrend: 8.5,
            applications: '86',
            applicationsTrend: 14.2,
            acceptanceRate: '76%',
            acceptanceTrend: 2.1,
            avgRating: '4.9/5',
            ratingTrend: 0.1,
            growthTrend: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                views: [420, 510, 480, 620, 590, 710, 470],
                applications: [10, 14, 11, 16, 13, 17, 5],
                accepted: [7, 10, 8, 12, 10, 13, 4]
            }
        },
        '30d': {
            views: '16.2k',
            viewsTrend: 18.4,
            applications: '346',
            applicationsTrend: 22.5,
            acceptanceRate: '73%',
            acceptanceTrend: 4.3,
            avgRating: '4.8/5',
            ratingTrend: 0.2,
            growthTrend: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                views: [3400, 4100, 4300, 4400],
                applications: [68, 89, 94, 95],
                accepted: [50, 64, 68, 70]
            }
        },
        '3m': {
            views: '48.5k',
            viewsTrend: 24.1,
            applications: '984',
            applicationsTrend: 28.0,
            acceptanceRate: '71%',
            acceptanceTrend: 3.5,
            avgRating: '4.8/5',
            ratingTrend: 0.2,
            growthTrend: {
                labels: ['Month 1', 'Month 2', 'Month 3'],
                views: [14200, 16100, 18200],
                applications: [290, 340, 354],
                accepted: [205, 240, 252]
            }
        },
        '1y': {
            views: '184k',
            viewsTrend: 35.8,
            applications: '3,840',
            applicationsTrend: 41.2,
            acceptanceRate: '72%',
            acceptanceTrend: 5.0,
            avgRating: '4.7/5',
            ratingTrend: 0.3,
            growthTrend: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                views: [38000, 44000, 49000, 53000],
                applications: [780, 920, 1040, 1100],
                accepted: [560, 660, 745, 790]
            }
        }
    };

    const conversionFunnel = [
        { stage: 'Views', count: 16200, percentage: '100%', color: '#FF4D2E' },
        { stage: 'Interested', count: 5200, percentage: '32.1%', color: '#7C3AED' },
        { stage: 'Registration Started', count: 580, percentage: '11.2% of interested', color: '#2A4FBE' },
        { stage: 'Registration Completed', count: 346, percentage: '60% of started', color: '#8A5A00' },
        { stage: 'Accepted', count: 253, percentage: '73% of completed', color: '#1E7A4F' },
        { stage: 'Participated', count: 238, percentage: '94% of accepted', color: '#10B981' }
    ];

    const detailedEvents = [
        {
            id: 'evt-1',
            name: 'Global AI Innovation Challenge',
            type: 'Hackathon',
            category: 'Artificial Intelligence',
            image: '../assets/images/event1.jpeg',
            status: 'live',
            date: 'Oct 24 – Oct 26, 2026',
            views: 6420,
            applicants: 98,
            approved: 82,
            pending: 16,
            acceptanceRate: '83.6%',
            conversionRate: '1.5%',
            rating: 4.9,
            nps: '+74'
        },
        {
            id: 'evt-2',
            name: 'Frontend Wizards',
            type: 'Hackathon',
            category: 'Web Development',
            image: '../assets/images/event4.jpeg',
            status: 'ended',
            date: 'Dec 12, 2025',
            views: 5890,
            applicants: 150,
            approved: 140,
            pending: 0,
            acceptanceRate: '93.3%',
            conversionRate: '2.5%',
            rating: 4.7,
            nps: '+68'
        },
        {
            id: 'evt-3',
            name: 'Startup Challenge',
            type: 'Competition',
            category: 'Entrepreneurship',
            image: '../assets/images/event3.jpeg',
            status: 'upcoming',
            date: 'Dec 2, 2026',
            views: 3100,
            applicants: 84,
            approved: 61,
            pending: 23,
            acceptanceRate: '72.6%',
            conversionRate: '2.7%',
            rating: 4.8,
            nps: '+62'
        },
        {
            id: 'evt-4',
            name: 'DevOps Masterclass',
            type: 'Workshop',
            category: 'Cloud Engineering',
            image: '../assets/images/event2.jpeg',
            status: 'pending',
            date: 'Nov 10, 2026',
            views: 2450,
            applicants: 72,
            approved: 55,
            pending: 17,
            acceptanceRate: '76.4%',
            conversionRate: '2.9%',
            rating: 4.6,
            nps: '+58'
        },
        {
            id: 'evt-5',
            name: 'Cloud Native Bootcamp',
            type: 'Course',
            category: 'Infrastructure',
            image: '../assets/images/event5.jpeg',
            status: 'ended',
            date: 'Sep 6, 2025',
            views: 1980,
            applicants: 42,
            approved: 38,
            pending: 0,
            acceptanceRate: '90.5%',
            conversionRate: '2.1%',
            rating: 4.8,
            nps: '+71'
        }
    ];

    const applicantsRoster = [
        { name: 'Ahmed Ali', email: 'ahmed.ali@gmail.com', event: 'Global AI Innovation Challenge', status: 'Pending', appliedAt: '2026-09-04' },
        { name: 'Alex Rivera', email: 'alex.rivera@gmail.com', event: 'Global AI Innovation Challenge', status: 'Pending', appliedAt: '2026-09-04' },
        { name: 'Nadia Farouk', email: 'nadia.farouk@gmail.com', event: 'Global AI Innovation Challenge', status: 'Pending', appliedAt: '2026-09-04' },
        { name: 'Marcus Lee', email: 'marcus.lee@gmail.com', event: 'Global AI Innovation Challenge', status: 'Accepted', appliedAt: '2026-09-03' },
        { name: 'Elena Rodriguez', email: 'elena.rodriguez@gmail.com', event: 'Global AI Innovation Challenge', status: 'Accepted', appliedAt: '2026-09-03' },
        { name: 'Kevin Park', email: 'kevin.park@gmail.com', event: 'Global AI Innovation Challenge', status: 'Rejected', appliedAt: '2026-09-02' },
        { name: 'Omar Nasser', email: 'omar.nasser@gmail.com', event: 'Global AI Innovation Challenge', status: 'Rejected', appliedAt: '2026-09-02' },
        { name: 'Sara Ahmad', email: 'sara.ahmad@gmail.com', event: 'DevOps Masterclass', status: 'Accepted', appliedAt: '2026-09-04' },
        { name: 'Layla Haddad', email: 'layla.haddad@gmail.com', event: 'Startup Challenge', status: 'Pending', appliedAt: '2026-09-03' },
        { name: 'Yousef Karam', email: 'yousef.karam@gmail.com', event: 'Frontend Wizards', status: 'Accepted', appliedAt: '2026-09-02' }
    ];

    const experienceLevels = [
        { label: 'University Students (3rd/4th yr)', share: 44, count: 152 },
        { label: 'Junior Developers (0-2 yrs)', share: 31, count: 107 },
        { label: 'Mid-Level Engineers (2-4 yrs)', share: 18, count: 62 },
        { label: 'Senior / Lead Specialists (5+ yrs)', share: 7, count: 25 }
    ];

    const downloadableReports = [
        {
            id: 'rep-1',
            title: 'Monthly Executive Performance Summary',
            description: 'Full KPI overview, applicant growth, conversion funnels, and benchmark analytics.',
            type: 'PDF',
            size: '2.4 MB',
            updated: 'Updated today · 14:00',
            icon: 'picture_as_pdf',
            iconColor: '#FF4D2E',
            filename: 'TechGenius_Labs_Executive_Report_Oct2026.pdf'
        },
        {
            id: 'rep-2',
            title: 'Complete Applicants Roster & Contact Information',
            description: 'Comprehensive tabular list of all applicants with contacts, event status, and resume links.',
            type: 'CSV',
            size: '480 KB',
            updated: 'Updated 2 hours ago',
            icon: 'table_view',
            iconColor: '#1E7A4F',
            filename: 'TechGenius_Labs_Applicants_Roster.csv'
        },
        {
            id: 'rep-3',
            title: 'Post-Event Feedback & Satisfaction Survey',
            description: 'Detailed attendee reviews, Net Promoter Score (NPS), and qualitative ratings analysis.',
            type: 'PDF',
            size: '1.8 MB',
            updated: 'Updated yesterday',
            icon: 'star',
            iconColor: '#8A5A00',
            filename: 'TechGenius_Labs_Feedback_Report.pdf'
        },
        {
            id: 'rep-4',
            title: 'Demographics & University Distribution Report',
            description: 'Statistical breakdown of applicants by university, academic major, and geographic region.',
            type: 'PDF',
            size: '1.2 MB',
            updated: 'Updated 3 days ago',
            icon: 'analytics',
            iconColor: '#2A4FBE',
            filename: 'TechGenius_Labs_Demographics_2026.pdf'
        }
    ];

    /* --- organization-scoped analytics aggregates (all derived from detailedEvents where possible) --- */
    const registrationBreakdown = { accepted: 376, pending: 56, rejected: 10, cancelled: 4 };

    const participantsByDomain = [
        { label: 'Technology', count: 152 },
        { label: 'Engineering', count: 98 },
        { label: 'Data Science', count: 88 },
        { label: 'Business', count: 61 },
        { label: 'Design', count: 47 }
    ];

    const participantsByLocation = [
        { label: 'Amman', count: 210 },
        { label: 'Irbid', count: 96 },
        { label: 'Zarqa', count: 68 },
        { label: 'Aqaba', count: 42 },
        { label: 'Karak', count: 30 }
    ];

    const engagementBreakdown = { views: 16200, saves: 2840, shares: 640, registrations: 446 };

    const STATUS_LABEL_ORG = { live: 'Live', upcoming: 'Upcoming', pending: 'Pending Approval', ended: 'Ended' };

    function eventStatusBreakdown() {
        const counts = {};
        detailedEvents.forEach(e => { counts[e.status] = (counts[e.status] || 0) + 1; });
        return Object.keys(counts).map(status => ({ label: STATUS_LABEL_ORG[status] || status, count: counts[status] }));
    }

    const organizationEvents = detailedEvents.map(e => ({ id: e.id, name: e.name }));

    const REPORT_TYPES = ['Event Performance', 'Registration Report', 'Participant Report', 'Engagement Report', 'Overall Organization Report'];

    const organizationReports = [
        { id: 'ORPT-001', name: 'Global AI Challenge — Performance', type: 'Event Performance', event: 'Global AI Innovation Challenge', period: 'Sep 2026', date: '2026-09-04', format: 'PDF', status: 'Completed' },
        { id: 'ORPT-002', name: 'Monthly Registration Summary', type: 'Registration Report', event: 'All Events', period: 'Sep 2026', date: '2026-09-04', format: 'CSV', status: 'Completed' },
        { id: 'ORPT-003', name: 'Applicant Demographics — Q3', type: 'Participant Report', event: 'All Events', period: '3 Months', date: '2026-09-03', format: 'PDF', status: 'Completed' },
        { id: 'ORPT-004', name: 'Frontend Wizards — Engagement', type: 'Engagement Report', event: 'Frontend Wizards', period: 'Aug 2026', date: '2026-09-02', format: 'Excel', status: 'Completed' },
        { id: 'ORPT-005', name: 'Overall Organization Report — August', type: 'Overall Organization Report', event: 'All Events', period: 'Aug 2026', date: '2026-09-01', format: 'PDF', status: 'Completed' },
        { id: 'ORPT-006', name: 'Startup Challenge — Performance', type: 'Event Performance', event: 'Startup Challenge', period: 'Sep 2026', date: '2026-08-30', format: 'PDF', status: 'Scheduled' },
        { id: 'ORPT-007', name: 'DevOps Masterclass — Registrations', type: 'Registration Report', event: 'DevOps Masterclass', period: 'Sep 2026', date: '2026-08-29', format: 'CSV', status: 'Processing' },
        { id: 'ORPT-008', name: 'Cloud Native Bootcamp — Performance', type: 'Event Performance', event: 'Cloud Native Bootcamp', period: 'Aug 2026', date: '2026-08-27', format: 'PDF', status: 'Completed' },
        { id: 'ORPT-009', name: 'Participant Skills Report', type: 'Participant Report', event: 'All Events', period: 'This Year', date: '2026-08-24', format: 'Excel', status: 'Completed' },
        { id: 'ORPT-010', name: 'Global AI Challenge — Engagement', type: 'Engagement Report', event: 'Global AI Innovation Challenge', period: 'Sep 2026', date: '2026-08-22', format: 'CSV', status: 'Completed' },
        { id: 'ORPT-011', name: 'Weekly Registration Pulse', type: 'Registration Report', event: 'All Events', period: 'This Week', date: '2026-08-20', format: 'CSV', status: 'Failed' },
        { id: 'ORPT-012', name: 'Frontend Wizards — Performance', type: 'Event Performance', event: 'Frontend Wizards', period: 'Aug 2026', date: '2026-08-18', format: 'PDF', status: 'Completed' },
        { id: 'ORPT-013', name: 'Overall Organization Report — July', type: 'Overall Organization Report', event: 'All Events', period: 'Jul 2026', date: '2026-08-01', format: 'PDF', status: 'Completed' },
        { id: 'ORPT-014', name: 'Startup Challenge — Engagement', type: 'Engagement Report', event: 'Startup Challenge', period: 'Aug 2026', date: '2026-07-28', format: 'Excel', status: 'Completed' },
        { id: 'ORPT-015', name: 'Applicant Location Breakdown', type: 'Participant Report', event: 'All Events', period: 'This Year', date: '2026-07-20', format: 'CSV', status: 'Completed' }
    ];

    function buildOrgReportPreview(type, eventName) {
        const scoped = eventName && eventName !== 'All Events' ? detailedEvents.filter(e => e.name === eventName) : detailedEvents;
        const totalViews = scoped.reduce((s, e) => s + e.views, 0);
        const totalApplicants = scoped.reduce((s, e) => s + e.applicants, 0);
        const totalApproved = scoped.reduce((s, e) => s + e.approved, 0);
        const avgAcceptance = scoped.length ? Math.round(scoped.reduce((s, e) => s + parseFloat(e.acceptanceRate), 0) / scoped.length) : 0;

        switch (type) {
            case 'Registration Report':
                return {
                    summary: [
                        { label: 'Total Registrations', value: totalApplicants.toLocaleString() },
                        { label: 'Accepted', value: registrationBreakdown.accepted.toLocaleString() },
                        { label: 'Pending', value: registrationBreakdown.pending.toLocaleString() },
                        { label: 'Rejected', value: registrationBreakdown.rejected.toLocaleString() }
                    ],
                    chart: { type: 'doughnut', labels: ['Accepted', 'Pending', 'Rejected', 'Cancelled'], datasets: [{ data: [registrationBreakdown.accepted, registrationBreakdown.pending, registrationBreakdown.rejected, registrationBreakdown.cancelled] }] },
                    table: { headers: ['Event', 'Registrations', 'Approved', 'Pending'], rows: scoped.map(e => [e.name, e.applicants, e.approved, e.pending]) }
                };
            case 'Participant Report':
                return {
                    summary: [
                        { label: 'Total Participants', value: totalApplicants.toLocaleString() },
                        { label: 'Top Domain', value: participantsByDomain[0].label },
                        { label: 'Top Location', value: participantsByLocation[0].label },
                        { label: 'University Students', value: experienceLevels[0].share + '%' }
                    ],
                    chart: { type: 'doughnut', labels: participantsByDomain.map(d => d.label), datasets: [{ data: participantsByDomain.map(d => d.count) }] },
                    table: { headers: ['Location', 'Participants'], rows: participantsByLocation.map(l => [l.label, l.count]) }
                };
            case 'Engagement Report':
                return {
                    summary: [
                        { label: 'Views', value: engagementBreakdown.views.toLocaleString() },
                        { label: 'Saves', value: engagementBreakdown.saves.toLocaleString() },
                        { label: 'Shares', value: engagementBreakdown.shares.toLocaleString() },
                        { label: 'Registrations', value: engagementBreakdown.registrations.toLocaleString() }
                    ],
                    chart: { type: 'bar', labels: ['Views', 'Saves', 'Shares', 'Registrations'], datasets: [{ label: 'Engagement', data: [engagementBreakdown.views, engagementBreakdown.saves, engagementBreakdown.shares, engagementBreakdown.registrations] }] },
                    table: { headers: ['Event', 'Views', 'Applicants'], rows: scoped.map(e => [e.name, e.views, e.applicants]) }
                };
            case 'Overall Organization Report':
                return {
                    summary: [
                        { label: 'Total Events', value: detailedEvents.length },
                        { label: 'Total Views', value: totalViews.toLocaleString() },
                        { label: 'Total Registrations', value: totalApplicants.toLocaleString() },
                        { label: 'Avg Acceptance Rate', value: avgAcceptance + '%' }
                    ],
                    chart: { type: 'line', labels: RANGE_METRICS['30d'].growthTrend.labels, datasets: [{ label: 'Applications', data: RANGE_METRICS['30d'].growthTrend.applications }] },
                    table: { headers: ['Event', 'Status', 'Views', 'Applicants', 'Acceptance'], rows: detailedEvents.map(e => [e.name, e.status, e.views, e.applicants, e.acceptanceRate]) }
                };
            default: // Event Performance
                return {
                    summary: [
                        { label: 'Views', value: totalViews.toLocaleString() },
                        { label: 'Registrations', value: totalApplicants.toLocaleString() },
                        { label: 'Accepted', value: totalApproved.toLocaleString() },
                        { label: 'Acceptance Rate', value: avgAcceptance + '%' }
                    ],
                    chart: { type: 'bar', labels: scoped.map(e => e.name), datasets: [{ label: 'Registrations', data: scoped.map(e => e.applicants) }] },
                    table: { headers: ['Event', 'Views', 'Registrations', 'Accepted', 'Rating'], rows: scoped.map(e => [e.name, e.views, e.applicants, e.approved, e.rating]) }
                };
        }
    }

    window.OrgReportsData = {
        RANGE_METRICS,
        conversionFunnel,
        detailedEvents,
        applicantsRoster,
        experienceLevels,
        downloadableReports,
        registrationBreakdown,
        participantsByDomain,
        participantsByLocation,
        engagementBreakdown,
        eventStatusBreakdown,
        organizationEvents,
        organizationReports,
        REPORT_TYPES,
        buildOrgReportPreview
    };
})();
