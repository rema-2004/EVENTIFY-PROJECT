// EVENTIFY app navigation — renders one canonical bottom bar on every /app page
// and a desktop navbar on pages that have no desktop chrome of their own.

(function () {
    const PRIMARY = [
        { href: 'index.html', label: 'Home', icon: 'home' },
        { href: 'explore.html', label: 'Explore', icon: 'emoji_events' },
        { href: 'posts.html', label: 'Posts', icon: 'campaign' },
        { href: 'rafeeq.html', label: 'Rafeeq', icon: 'smart_toy' },
        { href: 'profile.html', label: 'Profile', icon: 'person' }
    ];

    const DESKTOP_LINKS = [
        { href: 'index.html', label: 'Home' },
        { href: 'explore.html', label: 'Explore' },
        { href: 'posts.html', label: 'Posts' },
        { href: 'teams.html', label: 'Teams' },
        { href: 'my-applications.html', label: 'My Event' },
        { href: 'saved.html', label: 'Saved' },
        { href: 'notifications.html', label: 'Notifications' }
    ];

    const current = location.pathname.split('/').pop() || 'index.html';
    const isActive = href => (href === current ? ' aria-current="page"' : '');
    const icon = name => `<span class="material-symbols-outlined" aria-hidden="true">${name}</span>`;

    function hasDesktopChrome() {
        return [...document.querySelectorAll('body > header, body > nav, body > aside')].some(el => {
            const cls = el.className || '';
            if (/bottom-0/.test(cls)) return false;
            return !/(md|lg):hidden/.test(cls);
        });
    }

    function renderNavbar() {
        const nav = document.createElement('nav');
        nav.className = 'app-navbar';
        nav.setAttribute('aria-label', 'Main navigation');
        nav.innerHTML = `
            <div class="app-navbar__inner">
                <div style="display:flex;align-items:center;gap:32px;">
                    <a class="app-navbar__brand" href="index.html" aria-label="EVENTIFY home">
                        <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;" aria-hidden="true">hub</span>EVENTIFY
                    </a>
                    <div class="app-navbar__links">
                        ${DESKTOP_LINKS.map(l => `<a class="app-navbar__link" href="${l.href}"${isActive(l.href)}>${l.label}</a>`).join('')}
                    </div>
                </div>
                <div class="app-navbar__actions">
                    <button class="theme-toggle btn-ghost" title="Switch theme" aria-label="Switch theme">${icon('dark_mode')}</button>
                    <a class="btn-secondary" href="rafeeq.html">${icon('smart_toy')} Rafeeq AI</a>
                </div>
            </div>`;
        document.body.prepend(nav);
        document.body.classList.add('has-app-navbar');
    }

    function renderBottomNav() {
        document.querySelectorAll('body > nav').forEach(el => {
            if (/bottom-0/.test(el.className || '')) el.remove();
        });

        const nav = document.createElement('nav');
        nav.className = 'app-bottom-nav';
        nav.setAttribute('aria-label', 'Mobile navigation');
        nav.innerHTML = PRIMARY.map(item =>
            `<a class="app-bottom-nav__item" href="${item.href}"${isActive(item.href)}>${icon(item.icon)}<span>${item.label}</span></a>`
        ).join('');
        document.body.appendChild(nav);
        document.body.classList.add('has-app-bottom-nav');
    }

    function init() {
        if (!hasDesktopChrome()) renderNavbar();
        renderBottomNav();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
