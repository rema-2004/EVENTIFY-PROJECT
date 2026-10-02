const DRAFT_KEY = 'eventify:event-draft'
const EVENTS_KEY = 'eventify:org-events'
const LABELS = {
    title: 'Event title',
    category: 'Category',
    location: 'Location',
    startDate: 'Start date',
    endDate: 'End date',
    description: 'Description',
    requirements: 'Requirements',
    prize: 'Prize / scholarship',
    teamSize: 'Team size',
}

export function initOrgCreateEvent() {
    const form = document.getElementById('event-wizard')
    if (!form) return

    const controller = new AbortController()
    const listen = (target, type, handler) =>
        target?.addEventListener(type, handler, { signal: controller.signal })
    const steps = [...form.querySelectorAll('[data-step]')]
    const chips = [...document.querySelectorAll('[data-step-chip]')]
    const review = document.getElementById('wizard-review')
    const next = document.getElementById('wizard-next')
    const draft = document.getElementById('wizard-draft')
    const categoryToggle = document.getElementById('org-category-toggle')
    const categoryPanel = document.getElementById('org-category-panel')
    const categoryName = document.getElementById('org-category-selected-name')
    const categorySelect = document.getElementById('ev-type')
    const competitionFields = document.getElementById('ev-competition-fields')
    const cover = document.getElementById('ev-cover')
    const coverLabel = document.getElementById('ev-cover-label')
    let step = 1
    let publishTimer

    const toast = (message, tone = 'success') => {
        if (window.EventifyUI) window.EventifyUI.toast(message, tone)
    }

    const isCompetition = () => categorySelect?.value === 'Competition'
    const values = () => Object.fromEntries(
        Object.keys(LABELS)
            .filter(name => isCompetition() || !['prize', 'teamSize'].includes(name))
            .map(name => [name, form.elements[name]?.value.trim() || '']),
    )

    const saveDraft = () => {
        try {
            localStorage.setItem(DRAFT_KEY, JSON.stringify(values()))
        } catch {
            toast('Could not save the draft on this device', 'error')
        }
    }

    const syncCategory = () => {
        const value = categorySelect?.value || 'Competition'
        if (categoryName) categoryName.textContent = value
        categoryPanel?.querySelectorAll('.org-cat-item').forEach(item => {
            const active = item.dataset.value === value
            item.classList.toggle('active', active)
            item.setAttribute('aria-selected', String(active))
        })
        if (competitionFields) competitionFields.style.display = isCompetition() ? '' : 'none'
        if (!isCompetition()) {
            ;['prize', 'teamSize'].forEach(name => {
                if (form.elements[name]) form.elements[name].value = ''
            })
        }
    }

    try {
        const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}')
        Object.entries(saved).forEach(([name, value]) => {
            if (form.elements[name]) form.elements[name].value = value
        })
    } catch {
        localStorage.removeItem(DRAFT_KEY)
    }

    const escape = value => value.replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[character])

    const showStep = target => {
        step = Math.max(1, Math.min(3, target))
        steps.forEach(section => {
            const active = Number(section.dataset.step) === step
            section.classList.toggle('hidden', !active)
            section.classList.toggle('flex', active)
        })
        chips.forEach(chip => {
            const chipStep = Number(chip.dataset.stepChip)
            chip.classList.toggle('active', chipStep === step)
            chip.classList.toggle('completed', chipStep < step)
        })
        if (next) next.textContent = 'Next'
        if (step === 2 && review) {
            const data = values()
            review.innerHTML = Object.entries(LABELS)
                .filter(([name]) => isCompetition() || !['prize', 'teamSize'].includes(name))
                .map(([name, label]) => `<div class="review-card"><dt class="review-label">${label}</dt><dd class="review-value">${data[name] ? escape(data[name]) : '<span style="color:var(--text-muted)">Not provided</span>'}</dd></div>`)
                .join('')
        }
    }

    listen(categoryToggle, 'click', event => {
        event.stopPropagation()
        const open = categoryPanel.hidden
        categoryPanel.hidden = !open
        categoryToggle.setAttribute('aria-expanded', String(open))
    })
    listen(categoryPanel, 'click', event => {
        const item = event.target.closest('.org-cat-item')
        if (!item) return
        categorySelect.value = item.dataset.value
        syncCategory()
        saveDraft()
        categoryPanel.hidden = true
        categoryToggle.setAttribute('aria-expanded', 'false')
    })
    listen(categorySelect, 'change', syncCategory)
    chips.forEach(chip => listen(chip, 'click', () => {
        const target = Number(chip.dataset.stepChip)
        if (target < step) showStep(target)
    }))
    listen(document, 'click', event => {
        if (!categoryPanel?.contains(event.target) && event.target !== categoryToggle) {
            if (categoryPanel) categoryPanel.hidden = true
            categoryToggle?.setAttribute('aria-expanded', 'false')
        }
    })
    listen(form, 'input', saveDraft)
    listen(form, 'submit', event => event.preventDefault())
    listen(cover, 'change', () => {
        if (cover.files?.[0] && coverLabel) coverLabel.textContent = cover.files[0].name
    })
    listen(next, 'click', () => {
        const data = values()
        if (step === 1 && !data.title) {
            toast('Add an event title first', 'error')
            form.elements.title?.focus()
            return
        }
        if (data.startDate && data.endDate && data.endDate < data.startDate) {
            toast('End date cannot be before the start date', 'error')
            return
        }
        if (step < 3) {
            saveDraft()
            showStep(step + 1)
            return
        }
        const events = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]')
        events.unshift({ ...data, id: `event-${Date.now()}`, status: 'pending', createdAt: Date.now() })
        localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
        localStorage.removeItem(DRAFT_KEY)
        next.disabled = true
        next.textContent = 'Submitted'
        toast('Event submitted for approval')
        publishTimer = window.setTimeout(() => { window.location.href = '/org/dashboard' }, 1200)
    })
    listen(draft, 'click', () => {
        saveDraft()
        toast('Draft saved on this device')
    })
    syncCategory()
    showStep(1)
    return () => {
        controller.abort()
        if (publishTimer) window.clearTimeout(publishTimer)
    }
}