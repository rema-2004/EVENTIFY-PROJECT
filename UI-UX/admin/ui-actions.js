// Admin-side feedback for moderation buttons: updates the row's status chip
// and retires the sibling actions. Button styling/toasts come from ui-state.js.

(function () {
    const OUTCOMES = {
        approve: { status: 'approved', badge: 'badge--approved' },
        accept: { status: 'approved', badge: 'badge--approved' },
        verify: { status: 'approved', badge: 'badge--approved' },
        reject: { status: 'rejected', badge: 'badge--rejected' },
        suspend: { status: 'suspended', badge: 'badge--rejected' },
        reinstate: { status: 'active', badge: 'badge--approved' }
    };

    document.addEventListener('click', event => {
        const button = event.target.closest('[data-ui-action]');
        if (!button) return;

        // Rows are grids on the list pages and cards on the review pages.
        const row = button.closest('[class*="grid-cols-12"], tr, li, article, [class*="rounded-2xl"], .section-card');

        // Delete removes the row outright instead of swapping a status chip.
        if (button.dataset.uiAction === 'delete') {
            if (!row) return;
            if (!window.confirm('Delete this record? This cannot be undone.')) return;
            row.remove();
            if (typeof window.refreshUsersFilter === 'function') window.refreshUsersFilter();
            if (typeof window.refreshEventsFilter === 'function') window.refreshEventsFilter();
            return;
        }

        const outcome = OUTCOMES[button.dataset.uiAction];
        if (!outcome) return;
        if (!row) return;

        let chip = row.querySelector('.badge');
        if (!chip) {
            // Review cards carry no status pill of their own — add one so the
            // decision stays visible after the buttons retire.
            chip = document.createElement('span');
            button.parentElement.insertBefore(chip, button);
        }
        chip.className = `badge ${outcome.badge}`;
        chip.textContent = outcome.status;

        row.querySelectorAll('[data-ui-action]').forEach(other => {
            if (other === button) return;
            other.disabled = true;
            other.style.opacity = '0.45';
            other.style.pointerEvents = 'none';
        });

        // Pages with a status-filter tab bar (e.g. admin-events.html) track each
        // row's status via data-status; keep it in sync and re-run the filter.
        if (row.dataset.status !== undefined) {
            row.dataset.status = outcome.status;
            if (typeof window.refreshEventsFilter === 'function') window.refreshEventsFilter();
        }
    });
})();
