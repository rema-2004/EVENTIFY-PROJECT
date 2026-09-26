import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/visitor/Navbar'
import Footer from '../components/visitor/Footer'
import '../styles/visitor.css'

export default function VisitorLayout() {
    const location = useLocation()

    useEffect(() => {
        const navbar = document.getElementById('navbar')
        const mobileMenu = document.getElementById('mobileMenu')
        const scrollTopBtn = document.getElementById('scrollTop')

        const onScroll = () => {
            navbar?.classList.toggle('scrolled', window.scrollY > 40)
            scrollTopBtn?.classList.toggle('show', window.scrollY > 600)
        }
        const onMobileMenuClick = () => {
            const open = navbar?.classList.toggle('mobile-open')
            mobileMenu?.setAttribute('aria-expanded', String(!!open))
        }
        const onScrollTopClick = () => window.scrollTo({ top: 0, behavior: 'smooth' })

        window.addEventListener('scroll', onScroll, { passive: true })
        mobileMenu?.addEventListener('click', onMobileMenuClick)
        scrollTopBtn?.addEventListener('click', onScrollTopClick)

        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return
                    entry.target.classList.add('in')
                    revealObserver.unobserve(entry.target)
                })
            },
            { threshold: 0.15, rootMargin: '0px 0px -60px' },
        )
        document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => revealObserver.observe(el))

        return () => {
            window.removeEventListener('scroll', onScroll)
            mobileMenu?.removeEventListener('click', onMobileMenuClick)
            scrollTopBtn?.removeEventListener('click', onScrollTopClick)
            revealObserver.disconnect()
        }
        // Re-run per page so newly-mounted .reveal elements get observed again.
    }, [location.pathname])

    return (
        <>
            <a className="skip-link" href="#main">Skip to content</a>
            <Navbar />
            <Outlet />
            <Footer />
            <button id="scrollTop" type="button" aria-label="Back to top">
                <i className="fa-solid fa-arrow-up"></i>
            </button>
        </>
    )
}
