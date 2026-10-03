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

        // Pages with a status-filter tab bar (e.g. /admin/events) track each
        // row's status via data-status; keep it in sync and re-run the filter.
        if (row.dataset.status !== undefined) {
            row.dataset.status = outcome.status;
            if (typeof window.refreshEventsFilter === 'function') window.refreshEventsFilter();
        }

        // Show toast feedback: green for accept/approve, red for reject/suspend
        const feedback = TOAST_MESSAGES[actionName] || { text: 'Done', tone: 'success' };
        toast(feedback.text, feedback.tone);
    });
})();