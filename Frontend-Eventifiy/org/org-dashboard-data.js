/* Organizer dashboard — mock data layer for TechGenius Labs.
   Swap USE_MOCK to false and point ENDPOINTS at the real API once it exists;
   every render function downstream only ever reads the shape returned here. */
(function () {
    const USE_MOCK = true;
    const ENDPOINTS = {
        overview: '/api/org/overview',
        applicants: '/api/org/applicants',
        activity: '/api/org/activity'
    };

    /* deterministic pseudo-random so the chart looks the same on every load */
    function seeded(seed) {
        let s = seed;
        return function () {
            s = (s * 9301 + 49297) % 233280;
            return s / 233280;
        };
    }

    const RANGE_DAYS = { '7d': 7, '30d': 30, '3m': 90, '6m': 180, '1y': 365 };
    const RANGE_LABEL = { '7d': '7 Days', '30d': '30 Days', '3m': '3 Months', '6m': '6 Months', '1y': '1 Year' };

    function labelFor(daysAgo, totalDays) {
        const d = new Date();
        d.setDate(d.getDate() - daysAgo);
        if (totalDays > 120) return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        if (totalDays > 20) return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return d.toLocaleDateString('en-US', { weekday: 'short' });
    }

    function applicantsSeries(range) {
        const days = RANGE_DAYS[range] || 30;
        const points = range === '1y' ? 12 : range === '6m' ? 12 : range === '3m' ? 12 : days;
        const step = days / points;
        const rnd = seeded(days * 17 + 3);
        const total = [], approved = [], pending = [];
        let base = 4;
        for (let i = points - 1; i >= 0; i--) {
            base = Math.max(2, base + (rnd() - 0.42) * 3);
            const t = Math.round(base * (1 + i * 0.02));
            const a = Math.round(t * (0.62 + rnd() * 0.15));
            total.push(t);
            approved.push(a);
            pending.push(Math.max(0, t - a - Math.round(rnd() * 2)));
        }
        const labels = [];
        for (let i = points - 1; i >= 0; i--) labels.push(labelFor(Math.round(i * step), days));
        return { labels, total, approved, pending };
    }

    function registrationTrend() {
        const rnd = seeded(552);
        const labels = [], daily = [], approved = [], pending = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            const t = Math.max(1, Math.round(6 + Math.sin(i / 4) * 3 + rnd() * 4));
            const a = Math.round(t * 0.68);
            daily.push(t);
            approved.push(a);
            pending.push(t - a);
        }
        return { labels, daily, approved, pending };
    }

    const eventPerformance = [
        { name: 'Global AI Innovation Challenge', applicants: 98, approved: 82, pending: 16 },
        { name: 'Frontend Wizards', applicants: 150, approved: 140, pending: 10 },
        { name: 'Startup Challenge', applicants: 84, approved: 61, pending: 23 },
        { name: 'DevOps Masterclass', applicants: 72, approved: 55, pending: 17 }
    ];

    const applicationStatus = { approved: 172, pending: 17, rejected: 59 };

    const categories = [
        { name: 'Hackathon', count: 4 },
        { name: 'Competition', count: 3 },
        { name: 'Workshop', count: 3 },
        { name: 'Course', count: 1 },
        { name: 'Conference', count: 1 }
    ];

    const myEvents = [
        { id: 'evt-1', name: 'Global AI Innovation Challenge', image: '../assets/images/event1.jpeg', status: 'live', date: 'Oct 24 – Oct 26, 2026', applicants: 98, approved: 82, pending: 16, rating: 4.9 },
        { id: 'evt-4', name: 'DevOps Masterclass', image: '../assets/images/event2.jpeg', status: 'pending', date: 'Nov 10, 2026', applicants: 72, approved: 55, pending: 17, rating: null },
        { id: 'evt-3', name: 'Startup Challenge', image: '../assets/images/event3.jpeg', status: 'upcoming', date: 'Dec 2, 2026', applicants: 84, approved: 61, pending: 23, rating: null },
        { id: 'evt-2', name: 'Frontend Wizards', image: '../assets/images/event4.jpeg', status: 'ended', date: 'Dec 12, 2025', applicants: 150, approved: 140, pending: 0, rating: 4.7 },
        { id: 'evt-5', name: 'Cloud Native Bootcamp', image: '../assets/images/event5.jpeg', status: 'ended', date: 'Sep 6, 2025', applicants: 42, approved: 38, pending: 0, rating: 4.8 }
    ];

    const upcomingEvents = [
        { name: 'Startup Challenge', image: '../assets/images/event3.jpeg', date: 'Dec 2, 2026', time: '09:00', location: 'Remote', applicants: 84, deadline: 'Nov 25, 2026', status: 'upcoming' },
        { name: 'DevOps Masterclass', image: '../assets/images/event2.jpeg', date: 'Nov 10, 2026', time: '14:00', location: 'Online · Zoom', applicants: 72, deadline: 'Nov 3, 2026', status: 'pending' },
        { name: 'Global AI Innovation Challenge — Finals', image: '../assets/images/event1.jpeg', date: 'Oct 26, 2026', time: '10:00', location: 'Amman, JO', applicants: 98, deadline: 'Oct 20, 2026', status: 'live' }
    ];

    const topEvents = [
        { rank: 1, name: 'Global AI Innovation Challenge', image: '../assets/images/event1.jpeg', applicants: 98, rating: 4.9, score: 96 },
        { rank: 2, name: 'Frontend Wizards', image: '../assets/images/event4.jpeg', applicants: 150, rating: 4.7, score: 91 },
        { rank: 3, name: 'DevOps Masterclass', image: '../assets/images/event2.jpeg', applicants: 72, rating: 4.5, score: 78 }
    ];

    const recentApplicants = [
        { name: 'Ahmed Ali', event: 'Global AI Innovation Challenge', applied: '2 hours ago', status: 'pending' },
        { name: 'Sara Ahmad', event: 'DevOps Masterclass', applied: '5 hours ago', status: 'approved' },
        { name: 'Layla Haddad', event: 'Startup Challenge', applied: 'Yesterday', status: 'pending' },
        { name: 'Omar Nasser', event: 'Global AI Innovation Challenge', applied: 'Yesterday', status: 'rejected' },
        { name: 'Yousef Karam', event: 'Frontend Wizards', applied: '2 days ago', status: 'approved' }
    ];

    const recentActivity = [
        { type: 'applicant', icon: 'person_add', text: 'Ahmed Ali applied to Global AI Innovation Challenge', time: '2 hours ago' },
        { type: 'growth', icon: 'trending_up', text: 'Global AI Innovation Challenge received 10 new applicants', time: '6 hours ago' },
        { type: 'review', icon: 'hourglass_top', text: 'DevOps Masterclass was submitted for approval', time: 'Yesterday' },
        { type: 'publish', icon: 'campaign', text: 'Your organization published Frontend Wizards', time: '2 days ago' },
        { type: 'approval', icon: 'check_circle', text: 'Application #1248 was approved', time: '3 days ago' }
    ];

    function kpis() {
        return [
            { icon: 'event_available', label: 'Active Events', value: '3', trend: 12.5, trendLabel: 'vs. last month' },
            { icon: 'group', label: 'Total Applicants', value: '248', trend: 18.2, trendLabel: 'vs. last month' },
            { icon: 'pending_actions', label: 'Pending Review', value: '17', trend: -5.4, trendLabel: 'vs. last week' },
            { icon: 'star', label: 'Average Rating', value: '4.8', trend: 0.3, trendLabel: 'vs. last month', suffix: true }
        ];
    }

    async function getOverview(range) {
        if (!USE_MOCK) {
            const res = await fetch(`${ENDPOINTS.overview}?range=${range}`);
            return res.json();
        }
        await new Promise((r) => setTimeout(r, 120));
        return {
            kpis: kpis(),
            applicantsSeries: applicantsSeries(range),
            registrationTrend: registrationTrend(),
            eventPerformance,
            applicationStatus,
            categories,
            myEvents,
            upcomingEvents,
            topEvents,
            recentApplicants,
            recentActivity
        };
    }

    window.OrgDashboardAPI = { RANGE_LABEL, getOverview };
})();
