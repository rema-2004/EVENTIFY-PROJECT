import { useEffect } from 'react'

// Ports Frontend-Eventifiy/assets/js/motion.js to a hook so layouts can opt in
// per-section (auth, app, org, admin all loaded it) without a global side effect.
// Everything here degrades silently if elements it looks for aren't present.
export function useMotion(deps = []) {
    useEffect(() => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const cleanups = []

        // ---- Scroll entry ----
        document.querySelectorAll('main section, main > div > section, .card, .empty-state').forEach((el) => {
            if (el.closest('[data-reveal], [data-reveal-children]')) return
            if (el.hasAttribute('data-no-reveal')) return
            if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', '')
        })
        const revealTargets = document.querySelectorAll('[data-reveal], [data-reveal-children]')
        if (revealTargets.length) {
            if (reduced) {
                revealTargets.forEach((el) => el.classList.add('in'))
            } else {
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (!entry.isIntersecting) return
                            entry.target.classList.add('in')
                            observer.unobserve(entry.target)
                        })
                    },
                    { threshold: 0.12, rootMargin: '0px 0px -40px' },
                )
                revealTargets.forEach((el) => observer.observe(el))
                cleanups.push(() => observer.disconnect())
            }
        }

        // ---- Cursor-lit spotlight borders ----
        if (!reduced && !window.matchMedia('(hover: none)').matches) {
            const onPointerMove = (event) => {
                const card = event.target.closest('.spotlight')
                if (!card) return
                const rect = card.getBoundingClientRect()
                card.style.setProperty('--mx', `${event.clientX - rect.left}px`)
                card.style.setProperty('--my', `${event.clientY - rect.top}px`)
            }
            document.addEventListener('pointermove', onPointerMove, { passive: true })
            cleanups.push(() => document.removeEventListener('pointermove', onPointerMove))
        }

        // ---- Magnetic primary buttons ----
        if (!reduced && !window.matchMedia('(hover: none)').matches) {
            document.querySelectorAll('.btn-primary').forEach((btn) => {
                const onMove = (e) => {
                    const rect = btn.getBoundingClientRect()
                    const x = e.clientX - rect.left - rect.width / 2
                    const y = e.clientY - rect.top - rect.height / 2
                    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`
                }
                const onLeave = () => { btn.style.transform = '' }
                btn.addEventListener('mousemove', onMove)
                btn.addEventListener('mouseleave', onLeave)
                cleanups.push(() => {
                    btn.removeEventListener('mousemove', onMove)
                    btn.removeEventListener('mouseleave', onLeave)
                    btn.style.transform = ''
                })
            })
        }

        // ---- [title] -> premium tooltip ----
        if (!window.matchMedia('(hover: none)').matches) {
            let tooltip = document.querySelector('.premium-tooltip')
            if (!tooltip) {
                tooltip = document.createElement('div')
                tooltip.className = 'premium-tooltip'
                document.body.appendChild(tooltip)
            }
            const position = (e) => {
                tooltip.style.left = e.pageX + 10 + 'px'
                tooltip.style.top = e.pageY + 15 + 'px'
            }
            document.querySelectorAll('[title]').forEach((el) => {
                const titleText = el.getAttribute('title')
                if (!titleText) return
                el.setAttribute('data-tooltip', titleText)
                el.removeAttribute('title')
                const onEnter = (e) => { tooltip.textContent = titleText; tooltip.classList.add('visible'); position(e) }
                const onMove = (e) => position(e)
                const onLeave = () => tooltip.classList.remove('visible')
                el.addEventListener('mouseenter', onEnter)
                el.addEventListener('mousemove', onMove)
                el.addEventListener('mouseleave', onLeave)
                cleanups.push(() => {
                    el.removeEventListener('mouseenter', onEnter)
                    el.removeEventListener('mousemove', onMove)
                    el.removeEventListener('mouseleave', onLeave)
                })
            })
        }

        // ---- Image skeletons ----
        document.querySelectorAll('img').forEach((img) => {
            if (img.complete) return
            img.classList.add('loading-skeleton')
            const onLoad = () => img.classList.remove('loading-skeleton')
            img.addEventListener('load', onLoad)
            img.addEventListener('error', onLoad)
            cleanups.push(() => {
                img.removeEventListener('load', onLoad)
                img.removeEventListener('error', onLoad)
            })
        })

        return () => cleanups.forEach((fn) => fn())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)
}
