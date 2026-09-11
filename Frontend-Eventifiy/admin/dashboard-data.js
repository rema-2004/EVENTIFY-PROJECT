/* =========================================================
   Dashboard data layer.

   Every number the dashboard renders comes from here and nowhere else.
   To go live, set USE_MOCK = false and point ENDPOINTS at the real API:
   each method keeps its shape, so no rendering code has to change.

       GET /api/admin/overview?range=30d   -> getOverview(range)

   The mock builds a deterministic dataset per range (same seed = same
   numbers on every reload) so the UI can be reviewed like real data.
   ========================================================= */

(function () {
    const USE_MOCK = true;

    const ENDPOINTS = {
        overview: '/api/admin/overview',
        registrations: '/api/admin/registrations',
        activity: '/api/admin/activity'
    };

    const RANGES = {
        today: { label: 'Today', days: 1, buckets: 12, unit: 'hour' },
        week: { label: 'This Week', days: 7, buckets: 7, unit: 'day' },
        month: { label: 'This Month', days: 30, buckets: 30, unit: 'day' },
        quarter: { label: 'Last 3 Months', days: 90, buckets: 12, unit: 'week' },
        year: { label: 'This Year', days: 365, buckets: 12, unit: 'month' },
        custom: { label: 'Custom Range', days: 30, buckets: 30, unit: 'day' }
    };

    /* --- deterministic pseudo-random so the demo never jitters ---------- */
    function seeded(seed) {
        let value = seed;
        return () => {
            value = (value * 1664525 + 1013904223) % 4294967296;
            return value / 4294967296;
        };
    }

    function seriesFor(seed, buckets, base, drift, noise) {
        const rand = seeded(seed);
        const out = [];
        let current = base;
        for (let i = 0; i < buckets; i++) {
            current += drift + (rand() - 0.45) * noise;
            out.push(Math.max(0, Math.round(current)));
        }
        return out;
    }

    function labelsFor(range, customFrom, customTo) {
        const spec = RANGES[range] || RANGES.month;
        const now = new Date();

        if (spec.unit === 'hour') {
            return Array.from({ length: spec.buckets }, (_, i) => `${String(i * 2).padStart(2, '0')}:00`);
        }
        if (spec.unit === 'month') {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return months.slice(0, Math.min(now.getMonth() + 1, 12));
        }
        if (spec.unit === 'week') {
            return Array.from({ length: spec.buckets }, (_, i) => `W${i + 1}`);
        }

        const start = range === 'custom' && customFrom ? new Date(customFrom) : new Date(now - (spec.buckets - 1) * 86400000);
        const end = range === 'custom' && customTo ? new Date(customTo) : now;
        const days = Math.max(1, Math.min(60, Math.round((end - start) / 86400000) + 1));
        return Array.from({ length: days }, (_, i) => {
            const d = new Date(start.getTime() + i * 86400000);
            return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        });
    }

    /* --- scale: a wider range means bigger totals ----------------------- */
    const SCALE = { today: 0.02, week: 0.14, month: 0.5, quarter: 0.78, year: 1, custom: 0.5 };

    function kpis(range) {
        const s = SCALE[range] ?? 0.5;
        const round = n => Math.round(n);

        return {
            competitions: [
                { key: 'comp-total', label: 'Total Competitions', value: round(486 * s + 62), hint: 'Published on EVENTIFY', change: +12.4, icon: 'trophy' },
                { key: 'comp-active', label: 'Active Competitions', value: round(97 * s + 14), hint: 'Accepting submissions', change: +6.1, icon: 'bolt' },
                { key: 'comp-upcoming', label: 'Upcoming Competitions', value: round(58 * s + 9), hint: 'Scheduled to open', change: +3.8, icon: 'event_upcoming' },
                { key: 'comp-done', label: 'Completed Competitions', value: round(214 * s + 27), hint: 'Results published', change: -2.3, icon: 'task_alt' }
            ],
            events: [
                { key: 'ev-total', label: 'Total Events', value: round(612 * s + 74), hint: 'All time on the platform', change: +9.7, icon: 'calendar_month' },
                { key: 'ev-upcoming', label: 'Upcoming Events', value: round(83 * s + 11), hint: 'Next 30 days', change: +14.2, icon: 'schedule' },
                { key: 'ev-active', label: 'Active Events', value: round(41 * s + 6), hint: 'Running right now', change: +1.9, icon: 'play_circle' },
                { key: 'ev-done', label: 'Completed Events', value: round(447 * s + 51), hint: 'Closed and archived', change: -4.6, icon: 'inventory_2' }
            ],
            participants: [
                { key: 'pt-total', label: 'Total Participants', value: round(18740 * s + 2180), hint: 'Verified student accounts', change: +8.3, icon: 'group' },
                { key: 'pt-new', label: 'New Participants', value: round(1264 * s + 96), hint: 'Joined in this period', change: +21.5, icon: 'person_add' },
                { key: 'pt-active', label: 'Active Participants', value: round(9420 * s + 1130), hint: 'Applied or submitted', change: +5.4, icon: 'trending_up' }
            ],
            registrations: [
                { key: 'rg-total', label: 'Total Registrations', value: round(24310 * s + 2640), hint: 'Across competitions and events', change: +11.2, icon: 'how_to_reg' },
                { key: 'rg-pending', label: 'Pending Registrations', value: round(892 * s + 74), hint: 'Waiting on organizer review', change: -7.8, icon: 'hourglass_top' },
                { key: 'rg-approved', label: 'Approved Registrations', value: round(21460 * s + 2310), hint: 'Confirmed seats', change: +13.6, icon: 'verified' }
            ],
            organizations: [
                { key: 'org-total', label: 'Total Organizations', value: round(420 * s + 58), hint: 'Registered on the platform', change: +7.4, icon: 'apartment' },
                { key: 'org-active', label: 'Active Organizations', value: round(286 * s + 40), hint: 'Published something this period', change: +5.1, icon: 'domain_verification' },
                { key: 'org-pending', label: 'Pending Verification', value: round(24 * s + 4), hint: 'Awaiting document review', change: -3.2, icon: 'pending_actions' },
                { key: 'org-suspended', label: 'Suspended Organizations', value: round(6 * s + 1), hint: 'Access restricted', change: -1.0, icon: 'block' }
            ],
            users: [
                { key: 'usr-total', label: 'Total Users', value: round(19840 * s + 2260), hint: 'Participants, organizations and admins', change: +9.1, icon: 'groups' },
                { key: 'usr-new', label: 'New Users', value: round(1340 * s + 102), hint: 'Joined in this period', change: +18.7, icon: 'person_add' },
                { key: 'usr-active', label: 'Active Users', value: round(10120 * s + 1180), hint: 'Signed in this period', change: +4.6, icon: 'trending_up' }
            ],
            participationRate: {
                key: 'part-rate',
                label: 'Participation Rate',
                value: Math.round(((round(21460 * s + 2310) / round(24310 * s + 2640)) * 100) * 10) / 10,
                hint: 'Accepted vs. total registrations',
                change: +2.4,
                icon: 'percent'
            }
        };
    }

    const GROWTH_PERIODS = {
        '7d': { label: '7 Days', buckets: 7, unit: 'day' },
        '30d': { label: '30 Days', buckets: 30, unit: 'day' },
        '3m': { label: '3 Months', buckets: 12, unit: 'week' },
        '1y': { label: '1 Year', buckets: 12, unit: 'month' }
    };

    function platformGrowth(period) {
        const spec = GROWTH_PERIODS[period] || GROWTH_PERIODS['30d'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let labels;
        if (spec.unit === 'month') {
            labels = months.slice(0, spec.buckets);
        } else if (spec.unit === 'week') {
            labels = Array.from({ length: spec.buckets }, (_, i) => `W${i + 1}`);
        } else {
            // Use real calendar dates going back N days from today
            const now = new Date();
            labels = Array.from({ length: spec.buckets }, (_, i) => {
                const d = new Date(now.getTime() - (spec.buckets - 1 - i) * 86400000);
                return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
            });
        }
        const n = labels.length;
        return {
            labels,
            users: seriesFor(101, n, 180, 6, 40),
            organizations: seriesFor(111, n, 6, 0.3, 3),
            events: seriesFor(121, n, 9, 0.4, 4),
            registrations: seriesFor(131, n, 260, 9, 70)
        };
    }

    function pendingActions() {
        return [
            // Counts match what is actually visible on each management page
            { icon: 'apartment', count: 2, label: 'Organizations pending verification', description: 'New organizations waiting on document review.', href: 'admin-verify-organizations.html' },
            { icon: 'event_upcoming', count: 4, label: 'Events pending approval', description: 'Submitted events waiting for admin sign-off.', href: 'admin-events.html' },
            { icon: 'flag', count: 5, label: 'Reports requiring review', description: 'Generated reports flagged for a closer look.', href: 'admin-reports.html' },
            { icon: 'person_off', count: 3, label: 'Flagged users', description: 'Accounts reported by other users or organizations.', href: 'admin-users.html' }
        ];
    }

    function eventsOverview(range) {
        const s = SCALE[range] ?? 0.5;
        const active = Math.round(41 * s + 6);
        const completed = Math.round(447 * s + 51);
        const approved = Math.round(560 * s + 68);
        const pending = Math.round(38 * s + 6);
        const rejected = Math.round(14 * s + 2);
        return { total: approved + pending + rejected, approved, pending, rejected, active, completed };
    }

    function registrationOverview(range) {
        const s = SCALE[range] ?? 0.5;
        const accepted = Math.round(21460 * s + 2310);
        const pending = Math.round(892 * s + 74);
        const rejected = Math.round(612 * s + 58);
        const cancelled = Math.round(146 * s + 20);
        return { total: accepted + pending + rejected + cancelled, pending, accepted, rejected, cancelled };
    }

    function conversionFunnel(range) {
        const s = SCALE[range] ?? 0.5;
        return [
            { stage: 'Event Views', value: Math.round(15400 * s + 1800) },
            { stage: 'Registrations', value: Math.round(5800 * s + 640) },
            { stage: 'Applications', value: Math.round(4200 * s + 470) },
            { stage: 'Accepted', value: Math.round(3100 * s + 340) },
            { stage: 'Participated', value: Math.round(2450 * s + 260) }
        ];
    }

    function roleDistribution() {
        return [
            { label: 'Participants', value: 18740, tone: 'active' },
            { label: 'Organizations', value: 420, tone: 'upcoming' },
            { label: 'Platform Admins', value: 9, tone: 'completed' }
        ];
    }

    function topOrganizations() {
        // Names match those visible on admin-verify-organizations.html and admin-events.html
        return [
            { name: 'TechGenius Labs',          events: 12, registrations: 430, participants: 280, status: 'active'  },
            { name: 'DesignHub Amman',           events: 9,  registrations: 320, participants: 210, status: 'active'  },
            { name: 'University of Technology',  events: 7,  registrations: 190, participants: 130, status: 'active'  },
            { name: 'Cloud Native Academy',      events: 6,  registrations: 168, participants: 104, status: 'pending' },
            { name: 'Zain Innovation Campus',    events: 4,  registrations: 96,  participants: 61,  status: 'pending' }
        ];
    }

    function aiMatching(range) {
        const s = SCALE[range] ?? 0.5;
        const requests = Math.round(1240 * s + 140);
        const successfulMatches = Math.round(920 * s + 96);
        return {
            requests,
            successfulMatches,
            matchRate: Math.round((successfulMatches / requests) * 1000) / 10,
            topCategory: 'Hackathon'
        };
    }

    function buildInsights(overview) {
        const topCategory = overview.categories.reduce((a, b) => (b.value > a.value ? b : a), overview.categories[0]);
        const list = [];
        list.push(`Registrations increased by ${overview.kpis.registrations[0].change}% this period.`);
        list.push(`${topCategory.label} events have the highest participation, with ${topCategory.value} competitions.`);
        list.push(`${overview.pendingActions[1].count} events are waiting for approval.`);
        list.push(`Organization activity is up ${overview.kpis.organizations[1].change}% compared with the previous period.`);
        list.push(`AI matching success rate is ${overview.aiMatching.matchRate}%, matching most often in ${overview.aiMatching.topCategory}.`);
        return list;
    }

    function competitionSeries(range, from, to) {
        const labels = labelsFor(range, from, to);
        const n = labels.length;
        return {
            labels,
            created: seriesFor(7, n, 12, 0.6, 9),
            active: seriesFor(21, n, 28, 0.9, 11),
            completed: seriesFor(33, n, 8, 0.7, 6)
        };
    }

    function participantSeries(range, from, to) {
        const labels = labelsFor(range, from, to);
        const n = labels.length;
        const newP = seriesFor(41, n, 120, 4, 60);
        let running = 12480;
        const total = newP.map(v => (running += v));
        return {
            labels,
            newParticipants: newP,
            totalParticipants: total,
            registrations: newP.map((v, i) => Math.round(v * 1.6 + (i % 4) * 12))
        };
    }

    function categories() {
        // Must match the categories listed on admin-categories.html exactly
        return [
            { label: 'Hackathon',   value: 128 },
            { label: 'Workshop',    value: 96  },
            { label: 'Course',      value: 56  },
            { label: 'Conference',  value: 47  },
            { label: 'Competition', value: 84  }
        ];
    }

    function registrationStats(range, from, to) {
        const labels = labelsFor(range, from, to).slice(-8);
        const n = labels.length;
        return {
            labels,
            approved: seriesFor(53, n, 320, 6, 90),
            pending: seriesFor(61, n, 74, 1.2, 34),
            rejected: seriesFor(71, n, 26, 0.4, 14)
        };
    }

    function statusOverview(range) {
        const s = SCALE[range] ?? 0.5;
        return [
            { label: 'Active', value: Math.round(97 * s + 14), tone: 'active' },
            { label: 'Upcoming', value: Math.round(58 * s + 9), tone: 'upcoming' },
            { label: 'Completed', value: Math.round(214 * s + 27), tone: 'completed' },
            { label: 'Pending review', value: Math.round(34 * s + 5), tone: 'pending' },
            { label: 'Cancelled', value: Math.round(11 * s + 2), tone: 'cancelled' }
        ];
    }

    function topCompetitions() {
        // Categories aligned with admin-categories.html
        return [
            { name: 'AI Innovation Challenge',        category: 'Hackathon',   participants: 1240, capacity: 1400, status: 'active'    },
            { name: 'Regional Programming Challenge', category: 'Competition', participants: 980,  capacity: 1200, status: 'active'    },
            { name: 'Startup Founders Bootcamp',      category: 'Workshop',    participants: 760,  capacity: 900,  status: 'upcoming'  },
            { name: 'Cyber Sentinel CTF',             category: 'Hackathon',   participants: 612,  capacity: 800,  status: 'active'    },
            { name: 'Product Design Sprint',          category: 'Competition', participants: 438,  capacity: 500,  status: 'completed' }
        ];
    }

    function upcomingEvents() {
        return [
            { name: 'EVENTIFY Demo Day — Spring Cohort', date: '2026-09-11', time: '10:00', location: 'Zain Innovation Campus, Amman', registered: 318, capacity: 400, status: 'upcoming' },
            { name: 'AI Innovation Challenge — Kickoff', date: '2026-09-14', time: '18:30', location: 'Online', registered: 1240, capacity: 1400, status: 'upcoming' },
            { name: 'Design Systems Workshop', date: '2026-09-19', time: '13:00', location: 'DesignHub, Amman', registered: 86, capacity: 120, status: 'upcoming' },
            { name: 'Programming Challenge — Finals', date: '2026-09-26', time: '09:00', location: 'University of Jordan', registered: 214, capacity: 240, status: 'pending' }
        ];
    }

    function recentRegistrations() {
        return [
            { id: 'REG-40912', participant: 'Alex Rivera', email: 'alex.rivera@example.com', target: 'AI Innovation Challenge', type: 'Competition', date: '2026-09-04T09:12:00', status: 'pending' },
            { id: 'REG-40911', participant: 'Nadia Farouk', email: 'nadia.f@example.com', target: 'EVENTIFY Demo Day', type: 'Event', date: '2026-09-04T08:41:00', status: 'approved' },
            { id: 'REG-40908', participant: 'Marcus Lee', email: 'marcus.lee@example.com', target: 'Product Design Sprint', type: 'Competition', date: '2026-09-03T19:05:00', status: 'approved' },
            { id: 'REG-40903', participant: 'Elena Rodriguez', email: 'elena.r@example.com', target: 'Design Systems Workshop', type: 'Event', date: '2026-09-03T16:22:00', status: 'pending' },
            { id: 'REG-40897', participant: 'Kevin Park', email: 'kevin.park@example.com', target: 'Cyber Sentinel CTF', type: 'Competition', date: '2026-09-03T11:58:00', status: 'rejected' },
            { id: 'REG-40894', participant: 'Rana Hijazi', email: 'rana.h@example.com', target: 'Startup Founders Competition', type: 'Competition', date: '2026-09-02T20:14:00', status: 'approved' }
        ];
    }

    function recentActivity() {
        return [
            { actor: 'Platform Admin', action: 'created a new competition', target: 'Regional Programming Challenge', at: '2026-09-04T09:31:00', tone: 'create' },
            { actor: 'Admin Reviewer', action: 'published an event', target: 'EVENTIFY Demo Day — Spring Cohort', at: '2026-09-04T08:57:00', tone: 'publish' },
            { actor: 'Alex Rivera', action: 'registered for', target: 'AI Innovation Challenge', at: '2026-09-04T08:12:00', tone: 'register' },
            { actor: 'Platform Admin', action: 'updated competition details', target: 'Cyber Sentinel CTF', at: '2026-09-03T18:40:00', tone: 'update' },
            { actor: 'Admin Reviewer', action: 'published results for', target: 'Product Design Sprint', at: '2026-09-03T15:02:00', tone: 'results' },
            { actor: 'Platform Admin', action: 'cancelled an event', target: 'Hardware Hack Night', at: '2026-09-02T12:26:00', tone: 'cancel' }
        ];
    }

    /* --- public surface -------------------------------------------------- */
    async function request(path, params) {
        const url = new URL(path, location.origin);
        Object.entries(params || {}).forEach(([k, v]) => v && url.searchParams.set(k, v));
        const response = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        return response.json();
    }

    function mockOverview(range, from, to) {
        const overview = {
            range,
            kpis: kpis(range),
            competitions: competitionSeries(range, from, to),
            participants: participantSeries(range, from, to),
            categories: categories(),
            events: eventsOverview(range),
            registrationsChart: registrationStats(range, from, to),
            registrationOverview: registrationOverview(range),
            statusOverview: statusOverview(range),
            topCompetitions: topCompetitions(),
            upcomingEvents: upcomingEvents(),
            recentRegistrations: recentRegistrations(),
            recentActivity: recentActivity(),
            pendingActions: pendingActions(),
            funnel: conversionFunnel(range),
            roleDistribution: roleDistribution(),
            topOrganizations: topOrganizations(),
            aiMatching: aiMatching(range)
        };
        overview.insights = buildInsights(overview);
        return overview;
    }

    window.EventifyAdminAPI = {
        RANGES,
        // Flip to a real endpoint by setting USE_MOCK = false above.
        async getOverview(range = 'month', from, to) {
            if (!USE_MOCK) return request(ENDPOINTS.overview, { range, from, to });
            await new Promise(resolve => setTimeout(resolve, 320)); // stand in for network latency
            return mockOverview(range, from, to);
        },
        async updateRegistration(id, status) {
            if (!USE_MOCK) return request(`${ENDPOINTS.registrations}/${id}`, { status });
            await new Promise(resolve => setTimeout(resolve, 180));
            return { id, status };
        },
        async deleteRegistration(id) {
            if (!USE_MOCK) return request(`${ENDPOINTS.registrations}/${id}`, { _method: 'DELETE' });
            await new Promise(resolve => setTimeout(resolve, 180));
            return { id, deleted: true };
        },
        async getPlatformGrowth(period = '30d') {
            if (!USE_MOCK) return request('/api/admin/platform-growth', { period });
            await new Promise(resolve => setTimeout(resolve, 200));
            return platformGrowth(period);
        }
    };
})();
