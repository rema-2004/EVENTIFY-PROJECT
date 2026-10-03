// Admin-side feedback for moderation buttons: updates the row's status chip
// and retires the sibling actions, and shows green/red toast feedback matching HTML.

(function () {
    const TOAST_MESSAGES = {
        approve: { text: 'Approved', tone: 'success' },
        accept: { text: 'Application accepted', tone: 'success' },
        verify: { text: 'Organization verified', tone: 'success' },
        reject: { text: 'Rejected', tone: 'error' },
        suspend: { text: 'User suspended', tone: 'error' },
        reinstate: { text: 'User reinstated', tone: 'success' },
        delete: { text: 'Record deleted', tone: 'error' }
    };

    function toast(message, tone = 'success') {
        let stack = document.getElementById('toast-stack');
        if (!stack) {
            stack = document.createElement('div');
            stack.id = 'toast-stack';
            stack.setAttribute('role', 'status');
            stack.setAttribute('aria-live', 'polite');
            document.body.appendChild(stack);
        }

        const iconName = tone === 'error' ? 'cancel' : 'check_circle';
        const el = document.createElement('div');
        el.className = `toast toast-${tone}`;
        el.innerHTML = `<span class="material-symbols-outlined" style="font-size:18px;display:inline-flex;align-items:center;">${iconName}</span><span>${message}</span>`;
        stack.appendChild(el);

        requestAnimationFrame(() => el.classList.add('is-visible'));
        setTimeout(() => {
            el.classList.remove('is-visible');
            setTimeout(() => el.remove(), 300);
        }, 2600);
    }

    window.EventifyUI = window.EventifyUI || {};
    window.EventifyUI.toast = toast;

    const OUTCOMES = {
        approve: { status: 'approved', label: 'Approved', badge: 'badge--approved', icon: 'check_circle' },
        accept: { status: 'approved', label: 'Accepted', badge: 'badge--approved', icon: 'check_circle' },
        verify: { status: 'approved', label: 'Verified', badge: 'badge--approved', icon: 'verified' },
        reject: { status: 'rejected', label: 'Rejected', badge: 'badge--rejected', icon: 'cancel' },
        suspend: { status: 'suspended', label: 'Suspended', badge: 'badge--rejected', icon: 'block' },
        reinstate: { status: 'active', label: 'Reinstated', badge: 'badge--approved', icon: 'check_circle' }
    };

    // Verify-organizations summary cards: move one application out of "Pending review"
    // and into the matching total. No-op on pages without these cards.
    function adjustStat(label, delta) {
        const card = [...document.querySelectorAll('.stat-card')]
            .find(el => el.querySelector('.stat-card__label')?.textContent.trim() === label);
        const value = card?.querySelector('.stat-card__value');
        const current = Number(value?.textContent.replace(/,/g, ''));
        if (value && Number.isFinite(current)) value.textContent = String(Math.max(0, current + delta));
    }

    document.addEventListener('click', event => {
        const button = event.target.closest('[data-ui-action]');
        if (!button) return;

        const actionName = button.dataset.uiAction;

        // Rows are grids on the list pages and cards on the review pages.
        const row = button.closest('[data-review-container], [class*="grid-cols-12"], tr, li, article, [class*="rounded-2xl"], .section-card');

        // Delete removes the row outright instead of swapping a status chip.
        if (actionName === 'delete') {
            if (!row) return;
            if (!window.confirm('Delete this record? This cannot be undone.')) return;
            row.remove();
            toast('Record deleted', 'error');
            if (typeof window.refreshUsersFilter === 'function') window.refreshUsersFilter();
            if (typeof window.refreshEventsFilter === 'function') window.refreshEventsFilter();
            return;
        }

        const outcome = OUTCOMES[actionName];
        if (!outcome) return;
        if (!row) return;

        // A decision is final: ignore repeat clicks on a row that already has one.
        if (row.dataset.uiDecided) return;
        row.dataset.uiDecided = outcome.status;

        // 1. Visibly update the clicked button itself so the user knows their click registered!
        button.disabled = true;
        button.classList.add('is-confirmed');
        button.classList.add(outcome.status === 'approved' ? 'is-approved' : 'is-rejected');
        button.style.pointerEvents = 'none';
        button.innerHTML = `<span class="material-symbols-outlined" style="font-size:18px;display:inline-flex;align-items:center;">${outcome.icon}</span><span>${outcome.label}</span>`;

        // 2. Smoothly retire/hide the sibling actions in this row
        row.querySelectorAll('[data-ui-action]').forEach(other => {
            if (other === button) return;
            other.disabled = true;
            other.style.transition = 'all 0.25s ease';
            other.style.opacity = '0';
            other.style.transform = 'scale(0.85)';
            other.style.pointerEvents = 'none';
            setTimeout(() => {
                other.style.display = 'none';
            }, 250);
        });

        // 3. Update or create the status badge chip on the card
        let chip = row.querySelector('[data-status-badge]') || row.querySelector('.badge');
        if (!chip) {
            chip = document.createElement('span');
            chip.setAttribute('data-status-badge', '');
            const headerBadgeContainer = row.querySelector('.badge-container') || row.querySelector('.text-secondary')?.parentElement;
            if (headerBadgeContainer) {
                headerBadgeContainer.appendChild(chip);
            } else {
                button.parentElement.insertBefore(chip, button);
            }
        }
        chip.className = `badge ${outcome.badge}`;
        chip.innerHTML = `<span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle;margin-inline-end:4px;">${outcome.icon}</span>${outcome.label}`;

        // 4. Highlight the card with color-coded border & background
        row.classList.remove('section-card--approved', 'section-card--rejected');
        row.classList.add(`section-card--${outcome.status}`);

        // 5. Add inline confirmation banner inside the card
        let banner = row.querySelector('.event-action-banner');
        if (!banner) {
            banner = document.createElement('div');
            const targetContainer = row.querySelector('.event-content-body') || row.querySelector('p.font-body-md')?.parentElement || row.firstElementChild;
            if (targetContainer) {
                targetContainer.appendChild(banner);
            }
        }
        if (banner) {
            const dest = outcome.status === 'approved' ? 'Approved' : 'Rejected';
            banner.className = `event-action-banner event-action-banner--${outcome.status}`;
            banner.innerHTML = `<span class="material-symbols-outlined" style="font-size:16px;">${outcome.icon}</span><span>Event ${outcome.label.toLowerCase()} · Visible in ${dest} tab</span>`;
        }

        if (actionName === 'accept' || actionName === 'verify') {
            adjustStat('Pending review', -1);
            adjustStat('Verified organizations', 1);
        } else if (actionName === 'reject') {
            adjustStat('Pending review', -1);
            adjustStat('Rejected requests', 1);
        }

        // 6. Update data-status and tab counters without hiding the card from view immediately
        if (row.dataset.status !== undefined) {
            row.dataset.status = outcome.status;

            document.querySelectorAll('#events-tab-group [data-filter]').forEach(tabBtn => {
                const count = [...document.querySelectorAll('#events-list [data-status]')]
                    .filter(r => r.dataset.status === tabBtn.dataset.filter).length;
                const countEl = tabBtn.querySelector('[data-filter-count]');
                if (countEl) countEl.textContent = `(${count})`;
            });
        }

        // 7. Show toast feedback: green for accept/approve, red for reject/suspend
        const eventTitle = row.querySelector('h3, h2')?.textContent?.trim();
        const toastMsg = eventTitle 
            ? `${eventTitle} ${outcome.label.toLowerCase()}` 
            : (TOAST_MESSAGES[actionName]?.text || outcome.label);
        toast(toastMsg, outcome.status === 'approved' ? 'success' : 'error');
    });
})();