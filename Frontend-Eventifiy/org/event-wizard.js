// Three-step create-event flow: details -> review -> publish.
// Draft values are kept in localStorage so a reload does not lose the form.

(function () {
    const DRAFT_KEY = 'eventify:event-draft';

    const form = document.getElementById('event-wizard');
    if (!form) return;

    const steps = [...form.querySelectorAll('[data-step]')];
    const chips = [...document.querySelectorAll('[data-step-chip]')];
    const review = document.getElementById('wizard-review');
    const backBtn = document.getElementById('wizard-back');
    const nextBtn = document.getElementById('wizard-next');
    const draftBtn = document.getElementById('wizard-draft');
    const publishBtn = document.getElementById('wizard-publish');
    const coverInput = document.getElementById('ev-cover');
    const coverLabel = document.getElementById('ev-cover-label');

    // Category Dropdown Elements
    const catToggle = document.getElementById('org-category-toggle');
    const catPanel = document.getElementById('org-category-panel');
    const catSelectedName = document.getElementById('org-category-selected-name');
    const nativeCatSelect = document.getElementById('ev-type');

    const LABELS = {
        title: 'Event title',
        category: 'Category',
        location: 'Location',
        startDate: 'Start date',
        endDate: 'End date',
        description: 'Description',
        requirements: 'Requirements',
        prize: 'Prize / scholarship',
        teamSize: 'Team size'
    };

    let step = 1;

    const toast = (message, tone) =>
        window.EventifyUI ? window.EventifyUI.toast(message, tone) : alert(message);

    function values() {
        const data = {};
        Object.keys(LABELS).forEach(name => {
            const field = form.elements[name];
            if (field) data[name] = field.value.trim();
        });
        return data;
    }

    function saveDraft() {
        try {
            localStorage.setItem(DRAFT_KEY, JSON.stringify(values()));
        } catch { /* storage unavailable — the form still works in-session */ }
    }

    function syncCategoryUI(catValue) {
        if (catSelectedName) catSelectedName.textContent = catValue;
        if (catPanel) {
            catPanel.querySelectorAll('.org-cat-item').forEach(item => {
                const isActive = item.dataset.value === catValue;
                item.classList.toggle('active', isActive);
            });
        }
    }

    function restoreDraft() {
        let data;
        try {
            data = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
        } catch {
            return;
        }
        Object.entries(data).forEach(([name, value]) => {
            const field = form.elements[name];
            if (field && value) {
                field.value = value;
                if (name === 'category') {
                    syncCategoryUI(value);
                }
            }
        });
    }

    function wireCategoryDropdown() {
        if (!catToggle || !catPanel || !nativeCatSelect) return;

        catToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = catPanel.hasAttribute('hidden');
            if (isHidden) {
                catPanel.removeAttribute('hidden');
                catToggle.setAttribute('aria-expanded', 'true');
            } else {
                catPanel.setAttribute('hidden', '');
                catToggle.setAttribute('aria-expanded', 'false');
            }
        });

        catPanel.querySelectorAll('.org-cat-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const val = item.dataset.value;
                if (val) {
                    nativeCatSelect.value = val;
                    syncCategoryUI(val);
                    saveDraft();
                }
                catPanel.setAttribute('hidden', '');
                catToggle.setAttribute('aria-expanded', 'false');
            });
        });

        nativeCatSelect.addEventListener('change', () => {
            syncCategoryUI(nativeCatSelect.value);
        });

        document.addEventListener('click', (e) => {
            if (!catPanel.contains(e.target) && e.target !== catToggle) {
                catPanel.setAttribute('hidden', '');
                catToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    function renderReview() {
        const data = values();
        review.innerHTML = Object.entries(LABELS).map(([name, label]) => `
            <div class="review-card">
                <dt class="review-label">${label}</dt>
                <dd class="review-value">${data[name] ? escapeHtml(data[name]) : '<span style="color:var(--text-muted)">Not provided</span>'}</dd>
            </div>`).join('');
    }

    function escapeHtml(value) {
        return value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    function show(target) {
        step = target;
        steps.forEach(section => {
            const active = Number(section.dataset.step) === step;
            section.classList.toggle('hidden', !active);
            section.classList.toggle('flex', active);
        });

        chips.forEach(chip => {
            const chipStep = Number(chip.dataset.stepChip);
            chip.classList.toggle('active', chipStep === step);
            chip.classList.toggle('completed', chipStep < step);
        });

        backBtn.classList.toggle('hidden', step === 1);
        nextBtn.classList.toggle('hidden', step === 3);
        publishBtn.classList.toggle('hidden', step !== 3);
        nextBtn.textContent = step === 2 ? 'Continue to publish' : 'Next';

        if (step === 2) renderReview();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function validateStepOne() {
        const { title, startDate, endDate } = values();
        if (!title) {
            toast('Add an event title first', 'error');
            if (form.elements.title) form.elements.title.focus();
            return false;
        }
        if (startDate && endDate && endDate < startDate) {
            toast('End date cannot be before the start date', 'error');
            return false;
        }
        return true;
    }

    nextBtn.addEventListener('click', () => {
        if (step === 1 && !validateStepOne()) return;
        saveDraft();
        show(step + 1);
    });

    backBtn.addEventListener('click', () => show(step - 1));

    draftBtn.addEventListener('click', () => {
        saveDraft();
        toast('Draft saved on this device', 'success');
    });

    publishBtn.addEventListener('click', () => {
        saveDraft();
        publishBtn.disabled = true;
        publishBtn.textContent = 'Published';
        toast('Event submitted for approval', 'success');
        setTimeout(() => { location.href = 'org-dashboard.html'; }, 1600);
    });

    form.addEventListener('input', saveDraft);
    form.addEventListener('submit', event => event.preventDefault());

    if (coverInput) {
        coverInput.addEventListener('change', () => {
            const file = coverInput.files && coverInput.files[0];
            if (file) coverLabel.textContent = file.name;
        });
    }

    function wireMobileNav() {
        const hamburger = document.getElementById('org-hamburger');
        const overlay = document.getElementById('org-mobile-overlay');
        const drawer = document.getElementById('org-mobile-drawer');
        const closeBtn = document.getElementById('org-nav-close');

        function openDrawer() {
            if (!drawer || !overlay) return;
            drawer.classList.add('open');
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
        }

        function closeDrawer() {
            if (!drawer || !overlay) return;
            drawer.classList.remove('open');
            overlay.classList.remove('open');
            document.body.style.overflow = '';
            if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
        }

        if (hamburger) hamburger.addEventListener('click', openDrawer);
        if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
        if (overlay) overlay.addEventListener('click', closeDrawer);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeDrawer();
                if (catPanel) {
                    catPanel.setAttribute('hidden', '');
                    if (catToggle) catToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }

    wireCategoryDropdown();
    wireMobileNav();
    restoreDraft();
    show(1);
})();
