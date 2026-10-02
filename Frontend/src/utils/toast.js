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
    el.textContent = message
    stack.appendChild(el)

    requestAnimationFrame(() => el.classList.add('is-visible'))
    setTimeout(() => {
        el.classList.remove('is-visible')
        setTimeout(() => el.remove(), 300)
    }, 2600)
}
