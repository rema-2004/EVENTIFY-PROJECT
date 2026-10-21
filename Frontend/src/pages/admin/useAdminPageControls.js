import { useEffect } from 'react'
import './ui-actions.js'

export function useAdminPageControls({ mobileNavigation = true } = {}) {
    useEffect(() => {
        const controller = new AbortController()
        const listen = (target, type, handler) =>
            target?.addEventListener(type, handler, { signal: controller.signal })
        const notificationToggle = document.getElementById('admin-notif-toggle')
        const notificationPanel = document.getElementById('admin-notif-panel')
        const profileToggle = document.getElementById('admin-profile-toggle')
        const profilePanel = document.getElementById('admin-profile-panel')
        const hamburger = document.getElementById('admin-hamburger')
        const drawer = document.getElementById('admin-mobile-drawer')
        const overlay = document.getElementById('admin-mobile-overlay')
        const closeButton = document.getElementById('admin-nav-close')

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
            if (!notificationPanel?.contains(event.target) && event.target !== notificationToggle) setPanelOpen(notificationToggle, notificationPanel, false)
            if (!profilePanel?.contains(event.target) && event.target !== profileToggle) setPanelOpen(profileToggle, profilePanel, false)
        })
        if (mobileNavigation) {
            listen(hamburger, 'click', openDrawer)
            listen(closeButton, 'click', closeDrawer)
            listen(overlay, 'click', closeDrawer)
        }
        listen(document, 'keydown', event => {
            if (event.key !== 'Escape') return
            if (mobileNavigation) closeDrawer()
            setPanelOpen(notificationToggle, notificationPanel, false)
            setPanelOpen(profileToggle, profilePanel, false)
        })

        return () => {
            controller.abort()
            closeDrawer()
        }
    }, [mobileNavigation])
}