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

        const actionName = button.dataset.uiAction;
        const outcome = OUTCOMES[actionName];
        if (!outcome) return;
        if (!row) return;

        // A decision is final: ignore repeat clicks on a row that already has one.
        if (row.dataset.uiDecided) return;
        row.dataset.uiDecided = outcome.status;

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

        if (actionName === 'accept' || actionName === 'verify') {
            adjustStat('Pending review', -1);
            adjustStat('Verified organizations', 1);
        } else if (actionName === 'reject') {
            adjustStat('Pending review', -1);
            adjustStat('Rejected requests', 1);
        }

        // Pages with a status-filter tab bar (e.g. admin-events.html) track each
        // row's status via data-status; keep it in sync and re-run the filter.
        if (row.dataset.status !== undefined) {
            row.dataset.status = outcome.status;
            if (typeof window.refreshEventsFilter === 'function') window.refreshEventsFilter();
        }
    });
})();
