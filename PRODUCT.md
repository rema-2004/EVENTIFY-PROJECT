# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

[Inferred from repo structure and copy, not confirmed by the user.]

- **Students / participants** — the primary audience. Browse and apply to opportunities (`Frontend-Eventifiy/app/`, `The Visitor/`): events, competitions, hackathons, internships, and courses. Build a profile, form or join teams, save opportunities, and track applications.
- **Organizations** — universities, companies, student clubs, and NGOs (`Frontend-Eventifiy/org/`). Publish opportunities via a multi-step event wizard, review applicants, manage a public org profile, and view reports on their own activity. Must go through an organization verification flow before publishing (`auth/organization-verification.html`, `auth/organization-pending.html`).
- **Admins** — platform operators (`Frontend-Eventifiy/admin/`). Verify organizations, moderate/approve events, manage users, review platform-wide reports and an audit log.

## Product Purpose

[Inferred — landing-page copy and site structure, not confirmed by the user.]

EVENTIFY is a graduation project: a marketplace that connects students to opportunities (competitions, hackathons, internships, courses, workshops) and connects the organizations running them to applicants who fit. Success for a student looks like finding and being matched to a relevant opportunity faster than manually searching group chats/social media; success for an organization looks like publishing once and reaching applicants whose skills already fit, with verified profiles reducing screening effort.

## Positioning

[Inferred from the "Rafeeq AI" feature — not confirmed by the user.]

An AI assistant ("Rafeeq") that reads each opportunity, compares it against a student's profile (skills, courses, challenge history, academic year), and returns a transparent match percentage plus the specific skills driving it — by text or voice. The stated mechanism (per landing-page FAQ copy): tech stack 40%, completed courses 25%, challenge submissions 20%, academic year 15%. **Unconfirmed whether this scoring/matching logic is implemented server-side or is still demo/mock behavior** — see Evidence on Hand.

## Operating Context

[Inferred from folder/page structure.]

- Decoupled architecture: static HTML/CSS/JS frontend (`Frontend-Eventifiy/`, no framework/bundler — plain pages plus a shared `theme.css`/`theme.js` design-token system and a `tw-config.js` for Tailwind utility classes) talking to a Laravel 12 API backend (`eventify-backend/`, PHP 8.2, Sanctum for auth, Socialite for social login).
- Distinct page sets per role: `The Visitor/` (marketing/logged-out: landing, about, contact, privacy, terms, 404), `app/` (student/participant product surface), `org/` (organization dashboard/tools), `admin/` (platform operations), `auth/` (login, signup, forgot password, org verification).
- A companion/assistant feature ("Rafeeq") exists both as a landing-page teaser widget and as an in-app surface referenced by the earlier implementation plan (`implementation_plan.md`), which explicitly asked for a "Demo" badge on it — indicating it was not (at least at that point) backed by a real AI service.

## Capabilities and Constraints

[Inferred — confirm before relying on any of these as committed scope.]

- Confirmed by code: opportunity browsing/search (`app/explore.html`), team creation and management (`app/create-team.html`, `app/teams.html`, `app/team-dashboard.html`), applications tracking (`app/my-applications.html`), saved items, notifications, user + org public profiles, a 3-step event-creation wizard for organizers (`org/event-wizard.js`), applicant review (`org/org-applicants.html`, `org-applicant-details.html`), org and platform-level reporting/analytics, an admin audit log, and org verification/approval workflow.
- **Undecided / unconfirmed:** how much of the backend (Laravel) actually implements these flows versus the frontend still running on static/mock data and `localStorage` (the implementation plan explicitly used `localStorage` for wizard state and button-state persistence, and asked to avoid "adding a fake backend" — implying the backend integration boundary was still being drawn at that point). Treat any specific data shown in the HTML (match percentages, applicant counts, org names) as placeholder unless verified against the Laravel API/database.
- Primary language for UI copy is English; the internal implementation plan doc was written in Arabic, suggesting the team is Arabic-speaking — **unconfirmed whether Arabic-language UI/RTL support is a product requirement.**

## Evidence on Hand

[Inferred from landing-page content — flagged as almost certainly fabricated placeholder content, not real evidence, since this reads as a graduation project.]

- Landing page testimonials (Alex Rivera, Nadia Farouk, Tariq Ghanem), named partner organizations (TechGenius Labs, Nabta Analytics, Orange Digital Village), and specific stats (e.g., "98 real applicants," "96% match") all read as fictional/demo copy. **Future work must not treat these as real user evidence, testimonials, or partnerships — they should not be extended or treated as claims to keep true.**
- No real case studies, press, screenshots of production usage, or verified customer/partner logos are present in the repo.

## Product Principles

[Inferred from the consistency shown in `theme.css` and the implementation plan's stated goal of unifying identity/interaction across pages — not confirmed by the user.]

1. One shared visual/token system (`theme.css`) across all four role-based sections rather than per-section styling — consistency across Visitor, App, Org, and Admin surfaces is treated as a requirement, not a nice-to-have.
2. Transparency in AI matching — the product's stated FAQ commitment is to always show *why* a match score is what it is, never hide the reasoning.
3. Verification reduces noise — organization verification and applicant profile completeness are positioned as the mechanism that makes review manageable for organizers.
4. Free for students, monetized (unconfirmed how) on the organization side — per landing-page FAQ copy ("Organizations pay only for premium publishing features").

## Accessibility & Inclusion

[Inferred from code, not confirmed as a formal requirement.]

`theme.css` already implements `prefers-reduced-motion` handling, visible `:focus-visible` states on all interactive elements, and a dark mode (`html.dark`) token set. No explicit WCAG conformance target or assistive-technology requirement is stated anywhere in the repo.
