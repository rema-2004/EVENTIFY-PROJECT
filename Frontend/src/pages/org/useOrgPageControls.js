import { useEffect } from 'react'

export function useOrgPageControls({ mobileNavigation = true } = {}) {
    useEffect(() => {
        const controller = new AbortController()
        const listen = (target, type, handler) =>
            target?.addEventListener(type, handler, { signal: controller.signal })
        const notificationToggle = document.getElementById('org-notif-toggle')
        const notificationPanel = document.getElementById('org-notif-panel')
        const profileToggle = document.getElementById('org-profile-toggle')
        const profilePanel = document.getElementById('org-profile-panel')
        const hamburger = document.getElementById('org-hamburger')
        const drawer = document.getElementById('org-mobile-drawer')
        const overlay = document.getElementById('org-mobile-overlay')
        const closeButton = document.getElementById('org-nav-close')
        const settingsForm = document.getElementById('org-name')?.closest('form')

        if (settingsForm) {
            try {
                const savedSettings = JSON.parse(localStorage.getItem('eventify:org-settings') || '{}')
                Object.entries(savedSettings).forEach(([name, value]) => {
                    const field = document.getElementById(name)
                    if (field) field.value = value
                })
            } catch {
                localStorage.removeItem('eventify:org-settings')
            }
        }

        const setPanelOpen = (toggle, panel, open) => {
            if (!toggle || !panel) return
            panel.hidden = !open
            panel.classList.toggle('is-open', open)
            toggle.setAttribute('aria-expanded', String(open))
        }

        const closeDrawer = () => {
            drawer?.classList.remove('open')
            overlay?.classList.remove('open')
            document.body.style.overflow = ''
            hamburger?.setAttribute('aria-expanded', 'false')
        }

        const openDrawer = () => {
            if (!drawer || !overlay) return
            drawer.classList.add('open')
            overlay.classList.add('open')
            document.body.style.overflow = 'hidden'
            hamburger?.setAttribute('aria-expanded', 'true')
        }

        listen(notificationToggle, 'click', event => {
            event.stopPropagation()
            setPanelOpen(notificationToggle, notificationPanel, notificationPanel?.hidden)
            setPanelOpen(profileToggle, profilePanel, false)
        })
        listen(profileToggle, 'click', event => {
            event.stopPropagation()
            setPanelOpen(profileToggle, profilePanel, profilePanel?.hidden)
            setPanelOpen(notificationToggle, notificationPanel, false)
        })
        listen(document, 'click', event => {
            if (!notificationPanel?.contains(event.target) && event.target !== notificationToggle) {
                setPanelOpen(notificationToggle, notificationPanel, false)
            }
            if (!profilePanel?.contains(event.target) && event.target !== profileToggle) {
                setPanelOpen(profileToggle, profilePanel, false)
            }
        })
        if (mobileNavigation) {
            listen(hamburger, 'click', openDrawer)
            listen(closeButton, 'click', closeDrawer)
            listen(overlay, 'click', closeDrawer)
            listen(settingsForm, 'submit', event => {
                event.preventDefault()
                const settings = Object.fromEntries(
                    [...settingsForm.querySelectorAll('[id]')].map(field => [field.id, field.value]),
                )
                localStorage.setItem('eventify:org-settings', JSON.stringify(settings))
                if (window.EventifyUI) window.EventifyUI.toast('Organization settings saved', 'success')
            })
        }
        listen(document, 'keydown', event => {
            if (event.key !== 'Escape') return
            if (mobileNavigation) closeDrawer()
            setPanelOpen(notificationToggle, notificationPanel, false)
            setPanelOpen(profileToggle, profilePanel, false)
        })

        return () => {
            controller.abort()
            document.body.style.overflow = ''
        }
    }, [mobileNavigation])
}