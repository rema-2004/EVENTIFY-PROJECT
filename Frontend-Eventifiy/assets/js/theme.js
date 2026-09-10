// EVENTIFY Global Theme Controller

(function () {
    // Read theme from localStorage or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
    } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
    }

    installThemeOverrides();
})();

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
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
    installThemeOverrides();
    applyThemeBaseStyles();
    updateToggleButtons();
}

function applyThemeBaseStyles() {
    if (!document.body) return;

    const isDark = document.documentElement.classList.contains('dark');
    document.body.style.setProperty('background-color', isDark ? '#0d1c2e' : '#f8f9ff', 'important');
    document.body.style.setProperty('color', isDark ? '#f8f9ff' : '#0d1c2e', 'important');
}

function installThemeOverrides() {
    if (document.getElementById('eventify-theme-overrides')) return;

    const style = document.createElement('style');
    style.id = 'eventify-theme-overrides';
    style.textContent = `
        html.dark body { background-color: #0d1c2e !important; color: #f8f9ff !important; }
        html.dark .bg-background, html.dark .bg-surface { background-color: #0d1c2e !important; }
        html.dark .bg-surface-container-lowest { background-color: #172131 !important; }
        html.dark .bg-surface-container-low { background-color: #1d2a3a !important; }
        html.dark .bg-surface-container, html.dark .bg-surface-container-high { background-color: #253448 !important; }
        html.dark .text-on-background, html.dark .text-on-surface { color: #f8f9ff !important; }
        html.dark .text-on-surface-variant { color: #c3c6d7 !important; }
        html:not(.dark) body { background-color: #f8f9ff !important; color: #0d1c2e !important; }
        html:not(.dark) .bg-background, html:not(.dark) .bg-surface { background-color: #f8f9ff !important; }
        html:not(.dark) .bg-surface-container-lowest { background-color: #ffffff !important; }
        html:not(.dark) .bg-surface-container-low { background-color: #eff4ff !important; }
        html:not(.dark) .bg-surface-container, html:not(.dark) .bg-surface-container-high { background-color: #e6eeff !important; }
        html:not(.dark) .text-on-background, html:not(.dark) .text-on-surface { color: #0d1c2e !important; }
        html:not(.dark) .text-on-surface-variant { color: #424754 !important; }
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
