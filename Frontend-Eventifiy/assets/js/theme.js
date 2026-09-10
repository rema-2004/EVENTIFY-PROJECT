// EVENTIFY Global Theme Controller

(function () {
    // 'eventify-theme' is the key the visitor pages have always used; both are kept
    // in sync so the toggle behaves the same everywhere on the site.
    const savedTheme = localStorage.getItem('theme') || localStorage.getItem('eventify-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    applyTheme(savedTheme === 'dark' || (!savedTheme && systemPrefersDark));
    installThemeOverrides();
})();

function applyTheme(isDark) {
    const root = document.documentElement;
    root.classList.toggle('dark', isDark);
    root.classList.toggle('light', !isDark);
    if (isDark) root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
}

window.addEventListener('DOMContentLoaded', () => {
    // Initial UI state setup for toggles
    applyThemeBaseStyles();
    updateToggleButtons();

    // Setup listener on any elements with .theme-toggle class
    document.body.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('.theme-toggle');
        if (toggleBtn) {
            toggleTheme();
        }
    });
});

function toggleTheme() {
    const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(next === 'dark');
    localStorage.setItem('theme', next);
    localStorage.setItem('eventify-theme', next);
    installThemeOverrides();
    applyThemeBaseStyles();
    updateToggleButtons();
}

function applyThemeBaseStyles() {
    if (!document.body) return;

    const isDark = document.documentElement.classList.contains('dark');
    document.body.style.setProperty('background-color', isDark ? '#0b0c0e' : '#fafaf8', 'important');
    document.body.style.setProperty('color', isDark ? '#fafaf8' : '#0b0c0e', 'important');
}

function installThemeOverrides() {
    if (document.getElementById('eventify-theme-overrides')) return;

    const style = document.createElement('style');
    style.id = 'eventify-theme-overrides';
    style.textContent = `
        html.dark body { background-color: #0b0c0e !important; color: #f5f4f1 !important; }
        html.dark .bg-background, html.dark .bg-surface { background-color: #0b0c0e !important; }
        html.dark .bg-surface-container-lowest { background-color: #16181c !important; }
        html.dark .bg-surface-container-low { background-color: #1c1f24 !important; }
        html.dark .bg-surface-container, html.dark .bg-surface-container-high { background-color: #23262c !important; }
        html.dark .text-on-background, html.dark .text-on-surface { color: #f5f4f1 !important; }
        html.dark .text-on-surface-variant { color: #a8a49c !important; }
        html:not(.dark) body { background-color: #fafaf8 !important; color: #0b0c0e !important; }
        html:not(.dark) .bg-background, html:not(.dark) .bg-surface { background-color: #fafaf8 !important; }
        html:not(.dark) .bg-surface-container-lowest { background-color: #ffffff !important; }
        html:not(.dark) .bg-surface-container-low { background-color: #f4f3ef !important; }
        html:not(.dark) .bg-surface-container, html:not(.dark) .bg-surface-container-high { background-color: #edebe5 !important; }
        html:not(.dark) .text-on-background, html:not(.dark) .text-on-surface { color: #0b0c0e !important; }
        html:not(.dark) .text-on-surface-variant { color: #4a5058 !important; }
    `;
    document.head.appendChild(style);
}

function updateToggleButtons() {
    const isDark = document.documentElement.classList.contains('dark');
    const toggleIcons = document.querySelectorAll('.theme-toggle span');
    
    toggleIcons.forEach(icon => {
        if (isDark) {
            icon.textContent = 'light_mode';
            icon.title = 'Switch to light mode';
        } else {
            icon.textContent = 'dark_mode';
            icon.title = 'Switch to dark mode';
        }
    });

    // Handle profile.html specific switch if present
    const profileLightBtn = document.getElementById('profile-light-btn');
    const profileDarkBtn = document.getElementById('profile-dark-btn');
    if (profileLightBtn && profileDarkBtn) {
        if (isDark) {
            profileLightBtn.className = 'w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-on-surface';
            profileDarkBtn.className = 'w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-primary';
        } else {
            profileLightBtn.className = 'w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-primary';
            profileDarkBtn.className = 'w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-on-surface';
        }
    }
}
