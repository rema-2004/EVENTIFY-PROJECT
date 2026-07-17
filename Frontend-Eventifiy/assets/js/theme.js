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
})();

window.addEventListener('DOMContentLoaded', () => {
    // Initial UI state setup for toggles
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
    updateToggleButtons();
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
