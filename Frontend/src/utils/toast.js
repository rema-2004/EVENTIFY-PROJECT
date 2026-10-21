export function toast(message, tone = 'success') {
    let stack = document.getElementById('toast-stack')
    if (!stack) {
        stack = document.createElement('div')
        stack.id = 'toast-stack'
        stack.setAttribute('role', 'status')
        stack.setAttribute('aria-live', 'polite')
        document.body.appendChild(stack)
    }

    const el = document.createElement('div')
    el.className = `toast toast-${tone}`
    const icon = document.createElement('span')
    icon.className = 'material-symbols-outlined'
    icon.setAttribute('aria-hidden', 'true')
    icon.style.cssText = 'font-size:18px;display:inline-flex;align-items:center;'
    icon.textContent = tone === 'error' ? 'cancel' : 'check_circle'
    const text = document.createElement('span')
    text.textContent = message
    el.append(icon, text)
    stack.appendChild(el)

    requestAnimationFrame(() => el.classList.add('is-visible'))
    setTimeout(() => {
        el.classList.remove('is-visible')
        setTimeout(() => el.remove(), 300)
    }, 2600)
}

// Older plain-JS page scripts call window.EventifyUI.toast(...); point them here.
window.EventifyUI = window.EventifyUI || {}
window.EventifyUI.toast = toast
