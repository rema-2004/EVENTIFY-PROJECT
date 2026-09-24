import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../hooks/useLanguage'
import './Landing.css'

export default function Landing() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { language, toggleLanguage } = useLanguage()
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const $ = (sel) => root.querySelector(sel)
    const $$ = (sel) => [...root.querySelectorAll(sel)]

    const cleanups = []
    const on = (el, type, handler, opts) => {
      if (!el) return
      el.addEventListener(type, handler, opts)
      cleanups.push(() => el.removeEventListener(type, handler, opts))
    }

    /* ===== NAVBAR ===== */
    const navbar = $('#navbar')
    const mobileMenu = $('#mobileMenu')
    on(window, 'scroll', () => navbar?.classList.toggle('scrolled', window.scrollY > 40), { passive: true })
    on(mobileMenu, 'click', () => {
      const open = navbar?.classList.toggle('mobile-open')
      mobileMenu?.setAttribute('aria-expanded', String(!!open))
    })
    $$('#navLinks a').forEach((a) => on(a, 'click', () => navbar?.classList.remove('mobile-open')))

    /* ===== HERO SLIDER ===== */
    const slides = $$('.slide')
    const indicators = $('#sliderIndicators')
    let current = 0
    let sliderTimer

    const dotEls = []
    if (indicators) indicators.innerHTML = '' // guards against StrictMode's double-invoke re-running this effect
    slides.forEach((_, i) => {
      const dot = document.createElement('button')
      dot.type = 'button'
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1))
      dot.addEventListener('click', () => goTo(i))
      indicators?.appendChild(dot)
      dotEls.push(dot)
    })

    function goTo(index) {
      current = (index + slides.length) % slides.length
      slides.forEach((s, i) => s.classList.toggle('active', i === current))
      dotEls.forEach((d, i) => {
        d.classList.remove('active')
        if (i === current) {
          void d.offsetWidth
          d.classList.add('active')
        }
      })
      restart()
    }
    function restart() {
      clearInterval(sliderTimer)
      sliderTimer = setInterval(() => goTo(current + 1), 5000)
    }
    on($('#sliderPrev'), 'click', () => goTo(current - 1))
    on($('#sliderNext'), 'click', () => goTo(current + 1))
    on(document, 'keydown', (e) => {
      if (e.key === 'ArrowLeft') goTo(current - 1)
      if (e.key === 'ArrowRight') goTo(current + 1)
    })
    goTo(0)
    cleanups.push(() => clearInterval(sliderTimer))

    /* ===== SCROLL REVEAL ===== */
    const revealItems = $$('.reveal, .reveal-stagger, .section-fade')
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('in', 'visible')
          revealObserver.unobserve(entry.target)
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px' },
    )
    revealItems.forEach((el) => revealObserver.observe(el))
    cleanups.push(() => revealObserver.disconnect())

    /* ===== COUNTERS ===== */
    const counters = $$('[data-count]')
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target
          const target = Number(el.dataset.count)
          const suffix = el.dataset.suffix || ''
          const started = performance.now()
          const duration = 1400
          const step = (now) => {
            const progress = Math.min((now - started) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            el.textContent = Math.round(target * eased).toLocaleString('en-US') + suffix
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
          counterObserver.unobserve(el)
        })
      },
      { threshold: 0.4 },
    )
    counters.forEach((el) => counterObserver.observe(el))
    cleanups.push(() => counterObserver.disconnect())

    /* ===== OPPORTUNITY FILTERS ===== */
    const chips = $$('#oppFilters .filter-chip')
    const cards = $$('#oppGrid .opp-card')
    chips.forEach((chip) => {
      on(chip, 'click', () => {
        chips.forEach((c) => c.classList.remove('active'))
        chip.classList.add('active')
        const filter = chip.dataset.filter
        cards.forEach((card) => {
          card.classList.toggle('hidden', filter !== 'all' && card.dataset.type !== filter)
        })
      })
    })

    /* ===== TESTIMONIALS ===== */
    const testiSlides = $('#testiSlides')
    const testiDots = $('#testiDots')
    const testiCount = testiSlides?.children.length ?? 0
    let testiIndex = 0
    const testiDotEls = []

    if (testiDots) testiDots.innerHTML = ''
    for (let i = 0; i < testiCount; i++) {
      const dot = document.createElement('button')
      dot.type = 'button'
      dot.setAttribute('aria-label', 'Testimonial ' + (i + 1))
      dot.addEventListener('click', () => showTesti(i))
      testiDots?.appendChild(dot)
      testiDotEls.push(dot)
    }
    function showTesti(i) {
      if (!testiCount) return
      testiIndex = (i + testiCount) % testiCount
      if (testiSlides) testiSlides.style.transform = `translateX(-${testiIndex * 100}%)`
      testiDotEls.forEach((d, n) => d.classList.toggle('active', n === testiIndex))
    }
    showTesti(0)
    const testiTimer = setInterval(() => showTesti(testiIndex + 1), 7000)
    cleanups.push(() => clearInterval(testiTimer))

    /* ===== SCROLL TOP + PROGRESS ===== */
    const scrollTopBtn = $('#scrollTop')
    const progressBar = $('#scrollProgress')
    on(scrollTopBtn, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }))
    on(
      window,
      'scroll',
      () => {
        scrollTopBtn?.classList.toggle('show', window.scrollY > 600)
        const max = document.documentElement.scrollHeight - window.innerHeight
        if (progressBar) progressBar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%'
      },
      { passive: true },
    )

    /* ===== SMOOTH ANCHORS ===== */
    $$('a[href^="#"]').forEach((link) => {
      on(link, 'click', (e) => {
        const targetId = link.getAttribute('href') || ''
        if (targetId.length < 2) return
        const target = document.querySelector(targetId)
        if (!target) return
        e.preventDefault()
        const navOffset = navbar?.getBoundingClientRect().height ?? 0
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navOffset, behavior: 'smooth' })
      })
    })

    /* ===== ROTATING PLACEHOLDER ===== */
    const rpText = $('#rpText')
    const heroInput = $('#heroSearchInput')
    const heroSearchButton = $('#heroSearchButton')
    const phrases = [
      t('landing.s23'),
      t('landing.rp2'),
      t('landing.rp3'),
      t('landing.rp4'),
      t('landing.rp5'),
    ]
    let rpIndex = 0
    function rotatePlaceholder() {
      rpText?.classList.add('rp-hide')
      setTimeout(() => {
        rpIndex = (rpIndex + 1) % phrases.length
        if (rpText) rpText.textContent = phrases[rpIndex]
        rpText?.classList.remove('rp-hide')
      }, 300)
    }
    const rpTimer = setInterval(rotatePlaceholder, 3000)
    cleanups.push(() => clearInterval(rpTimer))
    on(heroSearchButton, 'click', () => navigate('/auth/login'))
    on(heroInput, 'focus', () => {
      if (rpText) rpText.style.display = 'none'
    })
    on(heroInput, 'blur', () => {
      if (rpText && !heroInput?.value) rpText.style.display = ''
    })

    /* ===== LIVE ACTIVITY - PAUSE ON HOVER ===== */
    const actTrack = $('.activity-track')
    on(actTrack, 'mouseenter', () => {
      if (actTrack) actTrack.style.animationPlayState = 'paused'
    })
    on(actTrack, 'mouseleave', () => {
      if (actTrack) actTrack.style.animationPlayState = 'running'
    })

    /* ===== TRENDING SCROLL ===== */
    const trendingTrack = $('.trending-track')
    on(trendingTrack, 'mouseenter', () => {
      if (trendingTrack) trendingTrack.style.scrollBehavior = 'auto'
    })
    on(trendingTrack, 'mouseleave', () => {
      if (trendingTrack) trendingTrack.style.scrollBehavior = 'smooth'
    })

    /* ===== FAQ ACCORDION ===== */
    $$('.faq-question').forEach((btn) => {
      on(btn, 'click', () => {
        const item = btn.closest('.faq-item')
        const isOpen = item?.classList.contains('open')
        $$('.faq-item.open').forEach((el) => el.classList.remove('open'))
        if (!isOpen) item?.classList.add('open')
      })
    })

    /* ===== QUICK PREVIEW MODAL ===== */
    const oppModalBackdrop = $('#oppModalBackdrop')
    const oppModalClose = $('#oppModalClose')
    const modalCloseBtn = $('#modalCloseBtn')
    const modalTag = $('#modalTag')
    const modalTitle = $('#modalTitle')
    const modalOrg = $('#modalOrg')
    const modalLoc = $('#modalLoc')
    const modalDeadline = $('#modalDeadline')
    const modalPerk = $('#modalPerk')
    const modalDesc = $('#modalDesc')
    const modalSkills = $('#modalSkills')

    function openOppModal(card) {
      if (!card) return
      if (modalTag) modalTag.textContent = card.dataset.tag || 'OPPORTUNITY'
      if (modalTitle) modalTitle.textContent = card.dataset.title || ''
      if (modalOrg) modalOrg.textContent = card.dataset.org || ''
      if (modalLoc) modalLoc.textContent = card.dataset.loc || ''
      if (modalDeadline) modalDeadline.textContent = card.dataset.deadline || ''
      if (modalPerk) modalPerk.innerHTML = '<i class="fa-solid fa-star"></i> ' + (card.dataset.perk || 'Verified Opportunity')
      if (modalDesc) modalDesc.textContent = card.dataset.desc || ''

      if (modalSkills) {
        modalSkills.innerHTML = ''
        const skills = (card.dataset.skills || '').split(',').map((s) => s.trim()).filter(Boolean)
        skills.forEach((s) => {
          const badge = document.createElement('span')
          badge.className = 'opp-modal-badge'
          badge.textContent = s
          modalSkills.appendChild(badge)
        })
      }

      if (oppModalBackdrop) {
        oppModalBackdrop.classList.add('active')
        oppModalBackdrop.setAttribute('aria-hidden', 'false')
        document.body.style.overflow = 'hidden'
      }
    }

    function closeOppModal() {
      if (!oppModalBackdrop) return
      oppModalBackdrop.classList.remove('active')
      oppModalBackdrop.setAttribute('aria-hidden', 'true')
      document.body.style.overflow = ''
    }

    $$('.btn-quick-preview').forEach((btn) => {
      on(btn, 'click', (e) => {
        e.stopPropagation()
        openOppModal(btn.closest('.opp-card'))
      })
    })
    on(oppModalClose, 'click', closeOppModal)
    on(modalCloseBtn, 'click', closeOppModal)
    on(oppModalBackdrop, 'click', (e) => {
      if (e.target === oppModalBackdrop) closeOppModal()
    })
    on(document, 'keydown', (e) => {
      if (e.key === 'Escape' && oppModalBackdrop?.classList.contains('active')) closeOppModal()
    })

    /* ===== RAFEEQ PROMPT PILLS INTERACTIVITY ===== */
    const promptPills = $$('.prompt-pill')
    const userBubble = $('#rafeeqUserBubble')
    const aiBubble = $('#rafeeqAiBubble')
    const typingMsg = $('#rafeeqTypingMsg')
    const aiMsg = $('#rafeeqAiMsg')

    promptPills.forEach((pill) => {
      on(pill, 'click', () => {
        promptPills.forEach((p) => p.classList.remove('active'))
        pill.classList.add('active')

        const question = pill.dataset.question || ''
        const answer = pill.dataset.answer || ''

        if (userBubble) userBubble.textContent = question
        if (aiMsg) aiMsg.style.display = 'none'
        if (typingMsg) typingMsg.style.display = 'flex'

        setTimeout(() => {
          if (typingMsg) typingMsg.style.display = 'none'
          if (aiMsg) aiMsg.style.display = 'flex'
          if (aiBubble) aiBubble.textContent = answer
        }, 450)
      })
    })

    /* ===== WEEKLY OPPORTUNITY DIGEST ===== */
    const digestForm = $('#digestForm')
    const digestEmail = $('#digestEmail')
    const digestSuccess = $('#digestSuccess')
    on(digestForm, 'submit', (e) => {
      e.preventDefault()
      const val = (digestEmail?.value || '').trim()
      if (!val) return
      if (digestForm) digestForm.style.display = 'none'
      if (digestSuccess) digestSuccess.style.display = 'flex'
    })

    return () => cleanups.forEach((fn) => fn())
  }, [navigate, t])

  return (
    <div ref={rootRef}>
      <a className="skip-link" href="#main-content">
        {t('landing.s1')}
      </a>
      <div className="scroll-progress" id="scrollProgress"></div>
      <div className="noise-overlay" aria-hidden="true"></div>
      {/* ===== NAVBAR ===== */}
      <nav className="navbar" id="navbar">
        <div className="container">
          <Link className="logo" to="/" aria-label="EVENTIFY home">
            <span className="material-symbols-outlined logo-icon" style={{"fontVariationSettings": "'FILL' 1"}}>
              hub
            </span>
            <span className="wordmark">
              {t('landing.s3')}
            </span>
          </Link>
          <div className="nav-links" id="navLinks">
            <Link to="/">
              {t('landing.s4')}
            </Link>
            <a href="#opportunities">
              {t('landing.s5')}
            </a>
            <a href="#categories">
              {t('landing.s6')}
            </a>
            <a href="#rafeeq">
              {t('landing.s7')}
            </a>
            <a href="#faq">
              {t('landing.s8')}
            </a>
            <Link to="/about">
              {t('landing.s9')}
            </Link>
            <Link to="/contact">
              {t('landing.s10')}
            </Link>
          </div>
          <div className="nav-buttons">
            <button className="lang-toggle" type="button" aria-label={t('nav.toggleLanguage')} onClick={toggleLanguage}>
              {language === 'ar' ? 'EN' : 'AR'}
            </button>
            <button className="theme-toggle btn btn-icon" id="themeToggle" aria-label="Toggle dark mode">
              <i className="fa-solid fa-moon"></i>
              <i className="fa-solid fa-sun"></i>
            </button>
            <Link className="btn btn-secondary btn-sm" to="/auth/login">
              {t('landing.s11')}
            </Link>
            <Link className="btn btn-primary btn-sm" to="/auth/signup">
              {t('landing.s12')}
            </Link>
          </div>
          <button className="mobile-menu" id="mobileMenu" aria-label="Open menu" aria-expanded="false">
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </nav>
      <main id="main-content">
        {/* ===== HERO ===== */}
        <section className="hero" id="home">
          <div className="slider" id="slider">
            <div className="slide slide-1 active">
              <div className="slide-bg">
                <img src="/assets/images/event1.jpeg" alt="Students collaborating at an EVENTIFY hackathon" />
              </div>
              <div className="overlay"></div>
              <div className="container hero-content">
                <div className="hero-left">
                  <span className="badge">
                    <i className="fa-solid fa-sparkles"></i>
                    {' '}
                    {t('landing.s13')}
                  </span>
                  <h1>
                    {t('landing.s14')}
                    {' '}
                    <span>
                      {t('landing.s15')}
                    </span>
                    {' '}
                    {t('landing.s16')}
                  </h1>
                  <p>
                    {t('landing.s17')}
                  </p>
                  <div className="hero-highlights">
                    <span className="hero-highlight">
                      <i className="fa-solid fa-bolt"></i>
                      {' '}
                      {t('landing.s18')}
                    </span>
                    <span className="hero-highlight">
                      <i className="fa-solid fa-shield-halved"></i>
                      {' '}
                      {t('landing.s19')}
                    </span>
                    <span className="hero-highlight">
                      <i className="fa-solid fa-clock"></i>
                      {' '}
                      {t('landing.s20')}
                    </span>
                  </div>
                  <div className="hero-buttons">
                    <Link className="btn btn-primary btn-lg" to="/auth/signup">
                      {t('landing.s21')}
                      {' '}
                      <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                    <a className="btn btn-light btn-lg" href="#opportunities">
                      {t('landing.s22')}
                    </a>
                  </div>
                  <div className="hero-search">
                    <span className="search-icon">
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </span>
                    <span className="input-wrap">
                      <span id="rpText">
                        {t('landing.s23')}
                      </span>
                      <input id="heroSearchInput" type="text" aria-label="Search opportunities" />
                    </span>
                    <button className="mic-btn" type="button" aria-label="Search by voice">
                      <i className="fa-solid fa-microphone"></i>
                    </button>
                    <span className="ai-badge">
                      <i className="fa-solid fa-wand-magic-sparkles"></i>
                      {' '}
                      {t('landing.s24')}
                    </span>
                    <button id="heroSearchButton" type="button">
                      {t('landing.s25')}
                    </button>
                  </div>
                </div>
                <div className="hero-right">
                  <div className="floating-card card-match">
                    <span className="match-label">
                      <i className="fa-solid fa-wand-magic-sparkles"></i>
                      {' '}
                      {t('landing.s26')}
                    </span>
                    <h2>
                      {t('landing.s27')}
                    </h2>
                    <div className="progress">
                      <div className="progress-bar"></div>
                    </div>
                    <strong>
                      {t('landing.s28')}
                    </strong>
                  </div>
                  <div className="floating-card card-event">
                    <span className="event-icon">
                      <i className="fa-solid fa-trophy"></i>
                    </span>
                    <div>
                      <h4>
                        {t('landing.s29')}
                      </h4>
                      <p>
                        {t('landing.s30')}
                      </p>
                    </div>
                  </div>
                  <div className="floating-card card-users">
                    <span className="users-icon">
                      <i className="fa-solid fa-users"></i>
                    </span>
                    <div>
                      <h4>
                        12,400+
                      </h4>
                      <p>
                        {t('landing.s31')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="slide slide-2">
              <div className="slide-bg">
                <img src="/assets/images/event2.jpeg" alt="Teams competing in a hackathon" />
              </div>
              <div className="overlay"></div>
              <div className="container hero-content">
                <div className="hero-left">
                  <span className="badge">
                    <i className="fa-solid fa-trophy"></i>
                    {' '}
                    {t('landing.s32')}
                  </span>
                  <h1>
                    {t('landing.s33')}
                    {' '}
                    <span>
                      {t('landing.s34')}
                    </span>
                  </h1>
                  <p>
                    {t('landing.s35')}
                  </p>
                  <div className="hero-buttons">
                    <Link className="btn btn-primary btn-lg" to="/auth/signup">
                      {t('landing.s36')}
                      {' '}
                      <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                    <a className="btn btn-light btn-lg" href="#opportunities">
                      {t('landing.s37')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="slide slide-3">
              <div className="slide-bg">
                <img src="/assets/images/event3.jpeg" alt="Workshop session in progress" />
              </div>
              <div className="overlay"></div>
              <div className="container hero-content">
                <div className="hero-left">
                  <span className="badge">
                    <i className="fa-solid fa-chalkboard-user"></i>
                    {' '}
                    {t('landing.s38')}
                  </span>
                  <h1>
                    {t('landing.s39')}
                    {' '}
                    <span>
                      {t('landing.s40')}
                    </span>
                  </h1>
                  <p>
                    {t('landing.s41')}
                  </p>
                  <div className="hero-buttons">
                    <Link className="btn btn-primary btn-lg" to="/auth/signup">
                      {t('landing.s42')}
                      {' '}
                      <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                    <a className="btn btn-light btn-lg" href="#categories">
                      {t('landing.s43')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="slide slide-4">
              <div className="slide-bg">
                <img src="/assets/images/event4.jpeg" alt="Students meeting hiring organizations" />
              </div>
              <div className="overlay"></div>
              <div className="container hero-content">
                <div className="hero-left">
                  <span className="badge">
                    <i className="fa-solid fa-briefcase"></i>
                    {' '}
                    {t('landing.s44')}
                  </span>
                  <h1>
                    {t('landing.s45')}
                    {' '}
                    <span>
                      {t('landing.s46')}
                    </span>
                    {' '}
                    {t('landing.s47')}
                  </h1>
                  <p>
                    {t('landing.s48')}
                  </p>
                  <div className="hero-buttons">
                    <Link className="btn btn-primary btn-lg" to="/auth/signup">
                      {t('landing.s49')}
                      {' '}
                      <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                    <a className="btn btn-light btn-lg" href="#opportunities">
                      {t('landing.s50')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <button className="slider-nav slider-prev" id="sliderPrev" aria-label="Previous slide">
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button className="slider-nav slider-next" id="sliderNext" aria-label="Next slide">
              <i className="fa-solid fa-chevron-right"></i>
            </button>
            <div className="slider-indicators" id="sliderIndicators" role="tablist" aria-label="Hero slides"></div>
          </div>
        </section>
        {/* ===== TRUSTED BY ===== */}
        <section className="trusted">
          <div className="container">
            <p>
              {t('landing.s51')}
            </p>
            <div className="trusted-logos reveal">
              <div className="logo-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3 1 9l11 6 9-4.9V17h2V9L12 3z"></path>
                  <path d="M5 13.2V17c0 1.7 3.1 3 7 3s7-1.3 7-3v-3.8l-7 3.8-7-3.8z"></path>
                </svg>
                <span>
                  {t('landing.s52')}
                </span>
              </div>
              <div className="logo-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2 3 7v10l9 5 9-5V7l-9-5zm0 2.3 6.5 3.6L12 11.5 5.5 7.9 12 4.3z"></path>
                </svg>
                <span>
                  {t('landing.s53')}
                </span>
              </div>
              <div className="logo-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z"></path>
                </svg>
                <span>
                  {t('landing.s54')}
                </span>
              </div>
              <div className="logo-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4 2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L4.8 11.3l5-.7L12 6z"></path>
                </svg>
                <span>
                  {t('landing.s55')}
                </span>
              </div>
              <div className="logo-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 5h18v4H3V5zm0 6h11v8H3v-8zm13 0h5v8h-5v-8z"></path>
                </svg>
                <span>
                  {t('landing.s56')}
                </span>
              </div>
              <div className="logo-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="m9 3 1.7 4.3L15 9l-4.3 1.7L9 15l-1.7-4.3L3 9l4.3-1.7L9 3zm8 8 1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1 1-2.6z"></path>
                </svg>
                <span>
                  {t('landing.s57')}
                </span>
              </div>
            </div>
          </div>
        </section>
        {/* ===== STATS ===== */}
        <section className="stats">
          <div className="container">
            <div className="stats-grid reveal-stagger">
              <div className="stat-item">
                <h2 data-count="12400" data-suffix="+">
                  0
                </h2>
                <p>
                  {t('landing.s58')}
                </p>
              </div>
              <div className="stat-item">
                <h2 data-count="1742">
                  0
                </h2>
                <p>
                  {t('landing.s59')}
                </p>
              </div>
              <div className="stat-item">
                <h2 data-count="312">
                  0
                </h2>
                <p>
                  {t('landing.s60')}
                </p>
              </div>
              <div className="stat-item">
                <h2 data-count="89" data-suffix="%">
                  0
                </h2>
                <p>
                  {t('landing.s61')}
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* ===== DUAL AUDIENCE GATEWAY ===== */}
        <section className="audience-section">
          <div className="container">
            <div className="audience-grid reveal-stagger">
              <div className="audience-card student-card">
                <div className="audience-badge">
                  <i className="fa-solid fa-graduation-cap"></i>
                  {' '}
                  {t('landing.s62')}
                </div>
                <h3>
                  {t('landing.s63')}
                </h3>
                <p>
                  {t('landing.s64')}
                </p>
                <ul className="audience-perks">
                  <li>
                    <i className="fa-solid fa-check"></i>
                    {' '}
                    {t('landing.s65')}
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i>
                    {' '}
                    {t('landing.s66')}
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i>
                    {' '}
                    {t('landing.s67')}
                  </li>
                </ul>
                <div className="audience-actions">
                  <Link className="btn btn-primary" to="/auth/signup">
                    {t('landing.s68')}
                    {' '}
                    <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                  <a className="btn btn-ghost" href="#opportunities">
                    {t('landing.s69')}
                  </a>
                </div>
              </div>
              <div className="audience-card org-card">
                <div className="audience-badge org">
                  <i className="fa-solid fa-building-columns"></i>
                  {' '}
                  {t('landing.s70')}
                </div>
                <h3>
                  {t('landing.s71')}
                </h3>
                <p>
                  {t('landing.s72')}
                </p>
                <ul className="audience-perks">
                  <li>
                    <i className="fa-solid fa-check"></i>
                    {' '}
                    {t('landing.s73')}
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i>
                    {' '}
                    {t('landing.s74')}
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i>
                    {' '}
                    {t('landing.s75')}
                  </li>
                </ul>
                <div className="audience-actions">
                  <Link className="btn btn-secondary" to="/auth/organization-verification">
                    {t('landing.s76')}
                    {' '}
                    <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                  <Link className="btn btn-ghost" to="/auth/login">
                    {t('landing.s77')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ===== WHY EVENTIFY ===== */}
        <section className="why-section section-pad">
          <div className="bg-glow bg-glow-1"></div>
          <div className="container">
            <div className="section-head center reveal">
              <span className="section-tag">
                <i className="fa-solid fa-star"></i>
                {' '}
                {t('landing.s78')}
              </span>
              <h2>
                {t('landing.s79')}
                {' '}
                <span>
                  {t('landing.s80')}
                </span>
              </h2>
              <p>
                {t('landing.s81')}
              </p>
            </div>
            <div className="why-grid reveal-stagger">
              <div className="why-card spotlight">
                <div className="why-icon">
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                </div>
                <h3>
                  {t('landing.s82')}
                </h3>
                <p>
                  {t('landing.s83')}
                </p>
              </div>
              <div className="why-card spotlight">
                <div className="why-icon">
                  <i className="fa-solid fa-id-badge"></i>
                </div>
                <h3>
                  {t('landing.s84')}
                </h3>
                <p>
                  {t('landing.s85')}
                </p>
              </div>
              <div className="why-card spotlight">
                <div className="why-icon">
                  <i className="fa-solid fa-certificate"></i>
                </div>
                <h3>
                  {t('landing.s86')}
                </h3>
                <p>
                  {t('landing.s87')}
                </p>
              </div>
              <div className="why-card spotlight">
                <div className="why-icon">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <h3>
                  {t('landing.s88')}
                </h3>
                <p>
                  {t('landing.s89')}
                </p>
              </div>
              <div className="why-card spotlight">
                <div className="why-icon">
                  <i className="fa-solid fa-bell"></i>
                </div>
                <h3>
                  {t('landing.s90')}
                </h3>
                <p>
                  {t('landing.s91')}
                </p>
              </div>
              <div className="why-card spotlight">
                <div className="why-icon">
                  <i className="fa-solid fa-robot"></i>
                </div>
                <h3>
                  {t('landing.s92')}
                </h3>
                <p>
                  {t('landing.s93')}
                </p>
              </div>
            </div>
            {/* ===== BEFORE VS AFTER COMPARISON ===== */}
            <div className="comparison-wrap reveal">
              <div className="section-head center" style={{"marginBottom": "28px"}}>
                <span className="section-tag">
                  <i className="fa-solid fa-code-compare"></i>
                  {' '}
                  {t('landing.s94')}
                </span>
                <h2>
                  {t('landing.s95')}
                  {' '}
                  <span>
                    {t('landing.s96')}
                  </span>
                </h2>
                <p>
                  {t('landing.s97')}
                </p>
              </div>
              <div className="comparison-grid">
                <div className="comparison-card before-card">
                  <div className="comp-head">
                    <div className="comp-status-icon bad">
                      <i className="fa-solid fa-xmark"></i>
                    </div>
                    <div>
                      <h3>
                        {t('landing.s98')}
                      </h3>
                      <span className="comp-sub">
                        {t('landing.s99')}
                      </span>
                    </div>
                  </div>
                  <ul className="comp-list">
                    <li>
                      <i className="fa-solid fa-circle-xmark"></i>
                      <span>
                        {t('landing.s100')}
                      </span>
                    </li>
                    <li>
                      <i className="fa-solid fa-circle-xmark"></i>
                      <span>
                        {t('landing.s101')}
                      </span>
                    </li>
                    <li>
                      <i className="fa-solid fa-circle-xmark"></i>
                      <span>
                        {t('landing.s102')}
                      </span>
                    </li>
                    <li>
                      <i className="fa-solid fa-circle-xmark"></i>
                      <span>
                        {t('landing.s103')}
                      </span>
                    </li>
                    <li>
                      <i className="fa-solid fa-circle-xmark"></i>
                      <span>
                        {t('landing.s104')}
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="comparison-card after-card">
                  <div className="comp-badge">
                    {t('landing.s105')}
                  </div>
                  <div className="comp-head">
                    <div className="comp-status-icon good">
                      <i className="fa-solid fa-check"></i>
                    </div>
                    <div>
                      <h3>
                        {t('landing.s106')}
                      </h3>
                      <span className="comp-sub">
                        {t('landing.s107')}
                      </span>
                    </div>
                  </div>
                  <ul className="comp-list">
                    <li>
                      <i className="fa-solid fa-circle-check"></i>
                      <span>
                        {t('landing.s108')}
                      </span>
                    </li>
                    <li>
                      <i className="fa-solid fa-circle-check"></i>
                      <span>
                        {t('landing.s109')}
                      </span>
                    </li>
                    <li>
                      <i className="fa-solid fa-circle-check"></i>
                      <span>
                        {t('landing.s110')}
                      </span>
                    </li>
                    <li>
                      <i className="fa-solid fa-circle-check"></i>
                      <span>
                        {t('landing.s111')}
                      </span>
                    </li>
                    <li>
                      <i className="fa-solid fa-circle-check"></i>
                      <span>
                        {t('landing.s112')}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ===== FEATURED OPPORTUNITIES ===== */}
        <section className="opp-section section-pad" id="opportunities">
          <div className="container">
            <div className="section-head-row reveal">
              <div className="section-head" style={{"marginBottom": 0}}>
                <span className="section-tag">
                  <i className="fa-solid fa-fire"></i>
                  {' '}
                  {t('landing.s113')}
                </span>
                <h2>
                  {t('landing.s114')}
                  {' '}
                  <span>
                    {t('landing.s115')}
                  </span>
                </h2>
                <p>
                  {t('landing.s116')}
                </p>
              </div>
              <Link className="btn btn-secondary btn-sm" to="/auth/signup">
                {t('landing.s117')}
                {' '}
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
            <div className="opp-filters" id="oppFilters">
              <button className="filter-chip active" data-filter="all" type="button">
                {t('landing.s118')}
              </button>
              <button className="filter-chip" data-filter="hackathon" type="button">
                {t('landing.s119')}
              </button>
              <button className="filter-chip" data-filter="competition" type="button">
                {t('landing.s120')}
              </button>
              <button className="filter-chip" data-filter="workshop" type="button">
                {t('landing.s121')}
              </button>
              <button className="filter-chip" data-filter="course" type="button">
                {t('landing.s122')}
              </button>
              <button className="filter-chip" data-filter="internship" type="button">
                {t('landing.s123')}
              </button>
            </div>
            <div className="opp-grid" id="oppGrid">
              <article className="opp-card spotlight" data-type="hackathon" data-id="1" data-title="Global AI Innovation Challenge" data-org="TechGenius Labs" data-tag="HACKATHON" data-loc="Remote" data-deadline="Closes in 3 days" data-perk="$5,000 Prize Pool" data-desc="Join over 90+ student teams to build generative AI and deep learning solutions tackling healthcare and climate challenges. Top 3 teams receive cash prizes, cloud credits, and direct investor pitches." data-skills="Python, PyTorch, Generative AI, Cloud">
                <div className="opp-thumb">
                  <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80" alt="" />
                  <i className="fa-solid fa-code"></i>
                  <span className="tag">
                    {t('landing.s124')}
                  </span>
                  <span className="match-badge">
                    <i className="fa-solid fa-bolt"></i>
                    {' '}
                    96%
                  </span>
                </div>
                <div className="opp-body">
                  <span className="opp-perk">
                    <i className="fa-solid fa-trophy"></i>
                    {' '}
                    {t('landing.s125')}
                  </span>
                  <h2>
                    {t('landing.s126')}
                  </h2>
                  <div className="opp-meta">
                    <span>
                      <i className="fa-solid fa-building"></i>
                      {' '}
                      {t('landing.s127')}
                    </span>
                    <span>
                      <i className="fa-solid fa-location-dot"></i>
                      {' '}
                      {t('landing.s128')}
                    </span>
                    <span>
                      <i className="fa-regular fa-calendar"></i>
                      {' '}
                      {t('landing.s129')}
                    </span>
                  </div>
                  <div className="opp-footer">
                    <span className="applicants">
                      <strong>
                        98
                      </strong>
                      {' '}
                      {t('landing.s130')}
                    </span>
                  </div>
                  <div className="opp-actions">
                    <button className="btn-quick-preview" type="button" data-id="1">
                      <i className="fa-regular fa-eye"></i>
                      {' '}
                      {t('landing.s131')}
                    </button>
                    <Link className="btn btn-primary btn-sm" to="/auth/login">
                      {t('landing.s132')}
                    </Link>
                  </div>
                </div>
              </article>
              <article className="opp-card spotlight" data-type="course" data-id="2" data-title="Deep Learning Mastery" data-org="University of Technology" data-tag="COURSE" data-loc="Hybrid" data-deadline="Starts Nov 12" data-perk="University Certificate" data-desc="An 8-week intensive bootcamp covering modern deep neural architectures, attention mechanisms, vision transformers, and production MLOps deployment." data-skills="Machine Learning, TensorFlow, Math for ML, Docker">
                <div className="opp-thumb">
                  <img src="https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=800&q=80" alt="" />
                  <i className="fa-solid fa-graduation-cap"></i>
                  <span className="tag">
                    {t('landing.s133')}
                  </span>
                  <span className="match-badge">
                    <i className="fa-solid fa-bolt"></i>
                    {' '}
                    91%
                  </span>
                </div>
                <div className="opp-body">
                  <span className="opp-perk">
                    <i className="fa-solid fa-award"></i>
                    {' '}
                    {t('landing.s134')}
                  </span>
                  <h3>
                    {t('landing.s135')}
                  </h3>
                  <div className="opp-meta">
                    <span>
                      <i className="fa-solid fa-building"></i>
                      {' '}
                      {t('landing.s136')}
                    </span>
                    <span>
                      <i className="fa-solid fa-location-dot"></i>
                      {' '}
                      {t('landing.s137')}
                    </span>
                    <span>
                      <i className="fa-regular fa-calendar"></i>
                      {' '}
                      {t('landing.s138')}
                    </span>
                  </div>
                  <div className="opp-footer">
                    <span className="applicants">
                      <strong>
                        240
                      </strong>
                      {' '}
                      {t('landing.s139')}
                    </span>
                  </div>
                  <div className="opp-actions">
                    <button className="btn-quick-preview" type="button" data-id="2">
                      <i className="fa-regular fa-eye"></i>
                      {' '}
                      {t('landing.s140')}
                    </button>
                    <Link className="btn btn-primary btn-sm" to="/auth/login">
                      {t('landing.s141')}
                    </Link>
                  </div>
                </div>
              </article>
              <article className="opp-card spotlight" data-type="competition" data-id="3" data-title="Frontend Wizards 2026" data-org="DevCommunity Hub" data-tag="COMPETITION" data-loc="London, UK & Remote" data-deadline="Closes Dec 05" data-perk="Mentorship & Tech Swag" data-desc="Showcase your UI engineering prowess by crafting lightning-fast, ultra-accessible modern web interfaces with micro-interactions and rich animations." data-skills="JavaScript, CSS3, React, Accessibility">
                <div className="opp-thumb">
                  <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80" alt="" />
                  <i className="fa-solid fa-trophy"></i>
                  <span className="tag">
                    {t('landing.s142')}
                  </span>
                  <span className="match-badge">
                    <i className="fa-solid fa-bolt"></i>
                    {' '}
                    88%
                  </span>
                </div>
                <div className="opp-body">
                  <span className="opp-perk">
                    <i className="fa-solid fa-laptop-code"></i>
                    {' '}
                    {t('landing.s143')}
                  </span>
                  <h3>
                    {t('landing.s144')}
                  </h3>
                  <div className="opp-meta">
                    <span>
                      <i className="fa-solid fa-building"></i>
                      {' '}
                      {t('landing.s145')}
                    </span>
                    <span>
                      <i className="fa-solid fa-location-dot"></i>
                      {' '}
                      {t('landing.s146')}
                    </span>
                    <span>
                      <i className="fa-regular fa-calendar"></i>
                      {' '}
                      {t('landing.s147')}
                    </span>
                  </div>
                  <div className="opp-footer">
                    <span className="applicants">
                      <strong>
                        312
                      </strong>
                      {' '}
                      {t('landing.s148')}
                    </span>
                  </div>
                  <div className="opp-actions">
                    <button className="btn-quick-preview" type="button" data-id="3">
                      <i className="fa-regular fa-eye"></i>
                      {' '}
                      {t('landing.s149')}
                    </button>
                    <Link className="btn btn-primary btn-sm" to="/auth/login">
                      {t('landing.s150')}
                    </Link>
                  </div>
                </div>
              </article>
              <article className="opp-card spotlight" data-type="internship" data-id="4" data-title="Machine Learning Intern — Summer 2026" data-org="Nabta Analytics" data-tag="INTERNSHIP" data-loc="Amman, Jordan" data-deadline="Closes Apr 20" data-perk="Paid · Fast-Track Full Time Hire" data-desc="Work alongside senior data scientists on real-world predictive models and telemetry processing. Guaranteed full-time employment interview upon successful completion." data-skills="Data Analysis, Pandas, Python, SQL">
                <div className="opp-thumb">
                  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" alt="" />
                  <i className="fa-solid fa-briefcase"></i>
                  <span className="tag">
                    {t('landing.s151')}
                  </span>
                  <span className="match-badge">
                    <i className="fa-solid fa-bolt"></i>
                    {' '}
                    84%
                  </span>
                </div>
                <div className="opp-body">
                  <span className="opp-perk">
                    <i className="fa-solid fa-briefcase"></i>
                    {' '}
                    {t('landing.s152')}
                  </span>
                  <h3>
                    {t('landing.s153')}
                  </h3>
                  <div className="opp-meta">
                    <span>
                      <i className="fa-solid fa-building"></i>
                      {' '}
                      {t('landing.s154')}
                    </span>
                    <span>
                      <i className="fa-solid fa-location-dot"></i>
                      {' '}
                      {t('landing.s155')}
                    </span>
                    <span>
                      <i className="fa-regular fa-calendar"></i>
                      {' '}
                      {t('landing.s156')}
                    </span>
                  </div>
                  <div className="opp-footer">
                    <span className="applicants">
                      <strong>
                        64
                      </strong>
                      {' '}
                      {t('landing.s157')}
                    </span>
                  </div>
                  <div className="opp-actions">
                    <button className="btn-quick-preview" type="button" data-id="4">
                      <i className="fa-regular fa-eye"></i>
                      {' '}
                      {t('landing.s158')}
                    </button>
                    <Link className="btn btn-primary btn-sm" to="/auth/login">
                      {t('landing.s159')}
                    </Link>
                  </div>
                </div>
              </article>
              <article className="opp-card spotlight" data-type="workshop" data-id="5" data-title="Product Design Sprint Weekend" data-org="DesignHub Amman" data-tag="WORKSHOP" data-loc="Amman, Jordan" data-deadline="Mar 28 — Mar 29" data-perk="Verified Portfolio Project" data-desc="An intensive 48-hour hands-on product design sprint from user research and wireframing to interactive prototyping and usability testing with industry mentors." data-skills="Figma, UI/UX Design, Wireframing, User Testing">
                <div className="opp-thumb">
                  <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" alt="" />
                  <i className="fa-solid fa-chalkboard-user"></i>
                  <span className="tag">
                    {t('landing.s160')}
                  </span>
                  <span className="match-badge">
                    <i className="fa-solid fa-bolt"></i>
                    {' '}
                    79%
                  </span>
                </div>
                <div className="opp-body">
                  <span className="opp-perk">
                    <i className="fa-solid fa-medal"></i>
                    {' '}
                    {t('landing.s161')}
                  </span>
                  <h3>
                    {t('landing.s162')}
                  </h3>
                  <div className="opp-meta">
                    <span>
                      <i className="fa-solid fa-building"></i>
                      {' '}
                      {t('landing.s163')}
                    </span>
                    <span>
                      <i className="fa-solid fa-location-dot"></i>
                      {' '}
                      {t('landing.s164')}
                    </span>
                    <span>
                      <i className="fa-regular fa-calendar"></i>
                      {' '}
                      {t('landing.s165')}
                    </span>
                  </div>
                  <div className="opp-footer">
                    <span className="applicants">
                      <strong>
                        45
                      </strong>
                      {' '}
                      {t('landing.s166')}
                    </span>
                  </div>
                  <div className="opp-actions">
                    <button className="btn-quick-preview" type="button" data-id="5">
                      <i className="fa-regular fa-eye"></i>
                      {' '}
                      {t('landing.s167')}
                    </button>
                    <Link className="btn btn-primary btn-sm" to="/auth/login">
                      {t('landing.s168')}
                    </Link>
                  </div>
                </div>
              </article>
              <article className="opp-card spotlight" data-type="hackathon" data-id="6" data-title="Cyber Sentinel CTF" data-org="SecureNet Foundation" data-tag="HACKATHON" data-loc="Remote" data-deadline="Closes in 9 days" data-perk="$3,000 + Security Interviews" data-desc="24-hour national capture-the-flag tournament featuring challenges in binary exploitation, reverse engineering, cryptography, and cloud network defense." data-skills="Network Security, Reverse Engineering, Cryptography, Linux">
                <div className="opp-thumb">
                  <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80" alt="" />
                  <i className="fa-solid fa-shield-halved"></i>
                  <span className="tag">
                    {t('landing.s169')}
                  </span>
                  <span className="match-badge">
                    <i className="fa-solid fa-bolt"></i>
                    {' '}
                    76%
                  </span>
                </div>
                <div className="opp-body">
                  <span className="opp-perk">
                    <i className="fa-solid fa-shield-virus"></i>
                    {' '}
                    {t('landing.s170')}
                  </span>
                  <h3>
                    {t('landing.s171')}
                  </h3>
                  <div className="opp-meta">
                    <span>
                      <i className="fa-solid fa-building"></i>
                      {' '}
                      {t('landing.s172')}
                    </span>
                    <span>
                      <i className="fa-solid fa-location-dot"></i>
                      {' '}
                      {t('landing.s173')}
                    </span>
                    <span>
                      <i className="fa-regular fa-calendar"></i>
                      {' '}
                      {t('landing.s174')}
                    </span>
                  </div>
                  <div className="opp-footer">
                    <span className="applicants">
                      <strong>
                        187
                      </strong>
                      {' '}
                      {t('landing.s175')}
                    </span>
                  </div>
                  <div className="opp-actions">
                    <button className="btn-quick-preview" type="button" data-id="6">
                      <i className="fa-regular fa-eye"></i>
                      {' '}
                      {t('landing.s176')}
                    </button>
                    <Link className="btn btn-primary btn-sm" to="/auth/login">
                      {t('landing.s177')}
                    </Link>
                  </div>
                </div>
              </article>
            </div>
            <div className="trending-row">
              <span>
                {t('landing.s178')}
              </span>
              <div className="trending-track">
                <Link className="trending-chip" to="/auth/login">
                  <i className="fa-solid fa-arrow-trend-up"></i>
                  {' '}
                  {t('landing.s179')}
                </Link>
                <Link className="trending-chip" to="/auth/login">
                  <i className="fa-solid fa-arrow-trend-up"></i>
                  {' '}
                  {t('landing.s180')}
                </Link>
                <Link className="trending-chip" to="/auth/login">
                  <i className="fa-solid fa-arrow-trend-up"></i>
                  {' '}
                  {t('landing.s181')}
                </Link>
                <Link className="trending-chip" to="/auth/login">
                  <i className="fa-solid fa-arrow-trend-up"></i>
                  {' '}
                  {t('landing.s182')}
                </Link>
                <Link className="trending-chip" to="/auth/login">
                  <i className="fa-solid fa-arrow-trend-up"></i>
                  {' '}
                  {t('landing.s183')}
                </Link>
                <Link className="trending-chip" to="/auth/login">
                  <i className="fa-solid fa-arrow-trend-up"></i>
                  {' '}
                  {t('landing.s184')}
                </Link>
                <Link className="trending-chip" to="/auth/login">
                  <i className="fa-solid fa-arrow-trend-up"></i>
                  {' '}
                  {t('landing.s185')}
                </Link>
              </div>
            </div>
            {/* ===== WEEKLY OPPORTUNITY DIGEST ===== */}
            <div className="digest-banner reveal" style={{"marginTop": "48px"}}>
              <div className="digest-inner">
                <div className="digest-icon">
                  <i className="fa-solid fa-envelope-open-text"></i>
                </div>
                <div className="digest-text">
                  <h4>
                    {t('landing.s186')}
                  </h4>
                  <p>
                    {t('landing.s187')}
                  </p>
                </div>
                <form className="digest-form" id="digestForm">
                  <input type="email" id="digestEmail" placeholder="Enter your email address..." required aria-label="Your email address" />
                  <button className="btn btn-primary" type="submit" id="digestSubmit">
                    {t('landing.s188')}
                  </button>
                </form>
              </div>
              <div className="digest-success" id="digestSuccess" style={{"display": "none"}}>
                <i className="fa-solid fa-circle-check"></i>
                {' '}
                {t('landing.s189')}
                {' '}
              </div>
            </div>
          </div>
        </section>
        {/* ===== CATEGORIES ===== */}
        <section className="cat-section section-pad" id="categories">
          <div className="bg-dots"></div>
          <div className="container">
            <div className="section-head center reveal">
              <span className="section-tag">
                <i className="fa-solid fa-layer-group"></i>
                {' '}
                {t('landing.s190')}
              </span>
              <h2>
                {t('landing.s191')}
                {' '}
                <span>
                  {t('landing.s192')}
                </span>
              </h2>
              <p>
                {t('landing.s193')}
              </p>
            </div>
            <div className="cat-grid reveal-stagger">
              <Link className="cat-card" to="/auth/login">
                <span className="cat-icon">
                  <i className="fa-solid fa-code"></i>
                </span>
                <h3>
                  {t('landing.s194')}
                </h3>
                <span className="cat-count">
                  {t('landing.s195')}
                </span>
              </Link>
              <Link className="cat-card" to="/auth/login">
                <span className="cat-icon">
                  <i className="fa-solid fa-trophy"></i>
                </span>
                <h4>
                  {t('landing.s196')}
                </h4>
                <span className="cat-count">
                  {t('landing.s197')}
                </span>
              </Link>
              <Link className="cat-card" to="/auth/login">
                <span className="cat-icon">
                  <i className="fa-solid fa-chalkboard-user"></i>
                </span>
                <h4>
                  {t('landing.s198')}
                </h4>
                <span className="cat-count">
                  {t('landing.s199')}
                </span>
              </Link>
              <Link className="cat-card" to="/auth/login">
                <span className="cat-icon">
                  <i className="fa-solid fa-graduation-cap"></i>
                </span>
                <h4>
                  {t('landing.s200')}
                </h4>
                <span className="cat-count">
                  {t('landing.s201')}
                </span>
              </Link>
              <Link className="cat-card" to="/auth/login">
                <span className="cat-icon">
                  <i className="fa-solid fa-briefcase"></i>
                </span>
                <h3>
                  {t('landing.s202')}
                </h3>
                <span className="cat-count">
                  {t('landing.s203')}
                </span>
              </Link>
              <Link className="cat-card" to="/auth/login">
                <span className="cat-icon">
                  <i className="fa-solid fa-hand-holding-heart"></i>
                </span>
                <h4>
                  {t('landing.s204')}
                </h4>
                <span className="cat-count">
                  {t('landing.s205')}
                </span>
              </Link>
              <Link className="cat-card" to="/auth/login">
                <span className="cat-icon">
                  <i className="fa-solid fa-microphone-lines"></i>
                </span>
                <h4>
                  {t('landing.s206')}
                </h4>
                <span className="cat-count">
                  {t('landing.s207')}
                </span>
              </Link>
              <Link className="cat-card" to="/auth/login">
                <span className="cat-icon">
                  <i className="fa-solid fa-award"></i>
                </span>
                <h4>
                  {t('landing.s208')}
                </h4>
                <span className="cat-count">
                  {t('landing.s209')}
                </span>
              </Link>
            </div>
          </div>
        </section>
        {/* ===== HOW IT WORKS ===== */}
        <section className="how-section section-pad" id="how">
          <div className="container">
            <div className="section-head center reveal">
              <span className="section-tag">
                <i className="fa-solid fa-route"></i>
                {' '}
                {t('landing.s210')}
              </span>
              <h2>
                {t('landing.s211')}
                {' '}
                <span>
                  {t('landing.s212')}
                </span>
                {' '}
                {t('landing.s213')}
              </h2>
              <p>
                {t('landing.s214')}
              </p>
            </div>
            <div className="how-steps reveal-stagger">
              <div className="how-step">
                <div className="how-connector"></div>
                <span className="how-step-num">
                  01
                </span>
                <div>
                  <span className="how-step-icon">
                    <i className="fa-solid fa-user-plus"></i>
                  </span>
                </div>
                <h3>
                  {t('landing.s215')}
                </h3>
                <p>
                  {t('landing.s216')}
                </p>
              </div>
              <div className="how-step">
                <div className="how-connector"></div>
                <span className="how-step-num">
                  02
                </span>
                <div>
                  <span className="how-step-icon">
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                  </span>
                </div>
                <h3>
                  {t('landing.s217')}
                </h3>
                <p>
                  {t('landing.s218')}
                </p>
              </div>
              <div className="how-step">
                <div className="how-connector"></div>
                <span className="how-step-num">
                  03
                </span>
                <div>
                  <span className="how-step-icon">
                    <i className="fa-solid fa-user-group"></i>
                  </span>
                </div>
                <h3>
                  {t('landing.s219')}
                </h3>
                <p>
                  {t('landing.s220')}
                </p>
              </div>
              <div className="how-step">
                <div className="how-connector"></div>
                <span className="how-step-num">
                  04
                </span>
                <div>
                  <span className="how-step-icon">
                    <i className="fa-solid fa-paper-plane"></i>
                  </span>
                </div>
                <h3>
                  {t('landing.s221')}
                </h3>
                <p>
                  {t('landing.s222')}
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* ===== RAFEEQ AI ===== */}
        <section className="rafeeq-section section-pad" id="rafeeq">
          <div className="container">
            <div className="rafeeq reveal">
              <div className="rafeeq-inner">
                <div className="rafeeq-visual">
                  <span className="rafeeq-ring"></span>
                  <span className="rafeeq-ring r2"></span>
                  <span className="rafeeq-ring r3"></span>
                  <span className="rafeeq-pulse"></span>
                  <div className="rafeeq-avatar">
                    <i className="fa-solid fa-robot"></i>
                  </div>
                  <button className="rafeeq-mic" type="button" aria-label="Talk to Rafeeq">
                    <i className="fa-solid fa-microphone"></i>
                  </button>
                </div>
                <div className="rafeeq-text">
                  <span className="section-tag">
                    <i className="fa-solid fa-sparkles"></i>
                    {' '}
                    {t('landing.s223')}
                  </span>
                  <h2>
                    {t('landing.s224')}
                  </h2>
                  <p>
                    {t('landing.s225')}
                  </p>
                  <div className="ai-chat">
                    <div className="ai-chat-msg">
                      <span className="ai-chat-avatar user">
                        {t('landing.s226')}
                      </span>
                      <div className="ai-chat-bubble" id="rafeeqUserBubble">
                        {t('landing.s227')}
                      </div>
                    </div>
                    <div className="ai-chat-msg ai-msg" id="rafeeqTypingMsg" style={{"display": "none"}}>
                      <span className="ai-chat-avatar ai">
                        <i className="fa-solid fa-robot"></i>
                      </span>
                      <div className="ai-chat-bubble">
                        <span className="ai-typing">
                          <span></span>
                          <span></span>
                          <span></span>
                        </span>
                      </div>
                    </div>
                    <div className="ai-chat-msg ai-msg" id="rafeeqAiMsg">
                      <span className="ai-chat-avatar ai">
                        <i className="fa-solid fa-robot"></i>
                      </span>
                      <div className="ai-chat-bubble" id="rafeeqAiBubble">
                        {t('landing.s228')}
                      </div>
                    </div>
                  </div>
                  <div className="rafeeq-prompt-pills">
                    <span>
                      {t('landing.s229')}
                    </span>
                    <button className="prompt-pill active" type="button" data-question="What matches my Python and machine learning skills?" data-answer="I found 3 strong matches. The top one is a 96% match — the Global AI Innovation Challenge. Want a summary or a compatibility check?">
                      {t('landing.s230')}
                    </button>
                    <button className="prompt-pill" type="button" data-question="Find me summer internships in Amman with no experience required." data-answer="Great match! Nabta Analytics and Orange Digital Village have 2 open internship slots designed for students. They provide 1-on-1 mentorship and lead to hiring. Want me to preview the application requirements?">
                      {t('landing.s231')}
                    </button>
                    <button className="prompt-pill" type="button" data-question="How does Rafeeq calculate my match percentage?" data-answer="I analyze 4 key factors: your verified tech stack (40%), completed courses (25%), previous challenge submissions (20%), and academic year (15%). I will always show you which specific skills can boost your score!">
                      {t('landing.s232')}
                    </button>
                  </div>
                  <div className="waveform" aria-hidden="true">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="hero-buttons" style={{"opacity": 1, "transform": "none"}}>
                    <Link className="btn btn-primary" to="/auth/signup">
                      {t('landing.s233')}
                      {' '}
                      <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                    <Link className="btn btn-light" to="/about">
                      {t('landing.s234')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ===== TESTIMONIALS ===== */}
        <section className="testi-section section-pad">
          <div className="container">
            <div className="section-head center reveal">
              <span className="section-tag">
                <i className="fa-solid fa-quote-left"></i>
                {' '}
                {t('landing.s235')}
              </span>
              <h2>
                {t('landing.s236')}
                {' '}
                <span>
                  {t('landing.s237')}
                </span>
                {' '}
                {t('landing.s238')}
              </h2>
            </div>
            <div className="testi-wrap reveal">
              <div className="testi-track">
                <div className="testi-slides" id="testiSlides">
                  <div className="testi-slide">
                    <div className="testi-card">
                      <i className="fa-solid fa-quote-left quote"></i>
                      <p>
                        {t('landing.s239')}
                      </p>
                      <div className="testi-avatar">
                        {t('landing.s240')}
                      </div>
                      <h3>
                        {t('landing.s241')}
                      </h3>
                      <div className="testi-role">
                        {t('landing.s242')}
                      </div>
                      <span className="testi-achievement">
                        <i className="fa-solid fa-trophy"></i>
                        {' '}
                        {t('landing.s243')}
                      </span>
                    </div>
                  </div>
                  <div className="testi-slide">
                    <div className="testi-card">
                      <i className="fa-solid fa-quote-left quote"></i>
                      <p>
                        {t('landing.s244')}
                      </p>
                      <div className="testi-avatar">
                        {t('landing.s245')}
                      </div>
                      <h4>
                        {t('landing.s246')}
                      </h4>
                      <div className="testi-role">
                        {t('landing.s247')}
                      </div>
                      <span className="testi-achievement">
                        <i className="fa-solid fa-briefcase"></i>
                        {' '}
                        {t('landing.s248')}
                      </span>
                    </div>
                  </div>
                  <div className="testi-slide">
                    <div className="testi-card">
                      <i className="fa-solid fa-quote-left quote"></i>
                      <p>
                        {t('landing.s249')}
                      </p>
                      <div className="testi-avatar">
                        {t('landing.s250')}
                      </div>
                      <h4>
                        {t('landing.s251')}
                      </h4>
                      <div className="testi-role">
                        {t('landing.s252')}
                      </div>
                      <span className="testi-achievement">
                        <i className="fa-solid fa-shield-halved"></i>
                        {' '}
                        {t('landing.s253')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="testi-dots" id="testiDots"></div>
            </div>
          </div>
        </section>
        {/* ===== PARTNERS ===== */}
        <section className="partners-section section-pad">
          <div className="container">
            <div className="section-head center reveal">
              <span className="section-tag">
                <i className="fa-solid fa-handshake"></i>
                {' '}
                {t('landing.s254')}
              </span>
              <h2>
                {t('landing.s255')}
                {' '}
                <span>
                  {t('landing.s256')}
                </span>
              </h2>
              <p>
                {t('landing.s257')}
              </p>
            </div>
            <div className="partners-grid reveal-stagger">
              <div className="partner-card">
                <span className="partner-logo">
                  <i className="fa-solid fa-building-columns"></i>
                </span>
                <h3>
                  {t('landing.s258')}
                </h3>
                <p>
                  {t('landing.s259')}
                </p>
              </div>
              <div className="partner-card">
                <span className="partner-logo">
                  <i className="fa-solid fa-briefcase"></i>
                </span>
                <h4>
                  {t('landing.s260')}
                </h4>
                <p>
                  {t('landing.s261')}
                </p>
              </div>
              <div className="partner-card">
                <span className="partner-logo">
                  <i className="fa-solid fa-users-rectangle"></i>
                </span>
                <h4>
                  {t('landing.s262')}
                </h4>
                <p>
                  {t('landing.s263')}
                </p>
              </div>
              <div className="partner-card">
                <span className="partner-logo">
                  <i className="fa-solid fa-hand-holding-heart"></i>
                </span>
                <h4>
                  {t('landing.s264')}
                </h4>
                <p>
                  {t('landing.s265')}
                </p>
              </div>
            </div>
            <div style={{"textAlign": "center", "marginTop": "40px"}}>
              <Link className="btn btn-primary btn-lg" to="/auth/organization-verification">
                {t('landing.s266')}
                {' '}
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </section>
        {/* ===== FAQ ===== */}
        <section className="faq-section section-pad" id="faq">
          <div className="container">
            <div className="section-head center reveal">
              <span className="section-tag">
                <i className="fa-solid fa-circle-question"></i>
                {' '}
                {t('landing.s267')}
              </span>
              <h2>
                {t('landing.s268')}
                {' '}
                <span>
                  {t('landing.s269')}
                </span>
              </h2>
            </div>
            <div className="faq-list reveal">
              <div className="faq-item">
                <button className="faq-question" type="button">
                  {t('landing.s270')}
                  {' '}
                  <i className="fa-solid fa-chevron-down"></i>
                </button>
                <div className="faq-answer">
                  {t('landing.s271')}
                </div>
              </div>
              <div className="faq-item">
                <button className="faq-question" type="button">
                  {t('landing.s272')}
                  {' '}
                  <i className="fa-solid fa-chevron-down"></i>
                </button>
                <div className="faq-answer">
                  {t('landing.s273')}
                </div>
              </div>
              <div className="faq-item">
                <button className="faq-question" type="button">
                  {t('landing.s274')}
                  {' '}
                  <i className="fa-solid fa-chevron-down"></i>
                </button>
                <div className="faq-answer">
                  {t('landing.s275')}
                </div>
              </div>
              <div className="faq-item">
                <button className="faq-question" type="button">
                  {t('landing.s276')}
                  {' '}
                  <i className="fa-solid fa-chevron-down"></i>
                </button>
                <div className="faq-answer">
                  {t('landing.s277')}
                </div>
              </div>
              <div className="faq-item">
                <button className="faq-question" type="button">
                  {t('landing.s278')}
                  {' '}
                  <i className="fa-solid fa-chevron-down"></i>
                </button>
                <div className="faq-answer">
                  {t('landing.s279')}
                </div>
              </div>
              <div className="faq-item">
                <button className="faq-question" type="button">
                  {t('landing.s280')}
                  {' '}
                  <i className="fa-solid fa-chevron-down"></i>
                </button>
                <div className="faq-answer">
                  {t('landing.s281')}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ===== CTA ===== */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-box reveal">
              <span className="section-tag">
                <i className="fa-solid fa-rocket"></i>
                {' '}
                {t('landing.s282')}
              </span>
              <h2>
                {t('landing.s283')}
              </h2>
              <p>
                {t('landing.s284')}
              </p>
              <div className="cta-buttons">
                <Link className="btn btn-light btn-lg" to="/auth/signup">
                  {t('landing.s285')}
                  {' '}
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>
                <Link className="btn btn-light btn-lg" to="/auth/organization-verification">
                  {t('landing.s286')}
                </Link>
              </div>
              <div className="cta-stats">
                <div className="cta-stat">
                  <h3>
                    {t('landing.s287')}
                  </h3>
                  <p>
                    {t('landing.s288')}
                  </p>
                </div>
                <div className="cta-stat">
                  <h4>
                    1,742
                  </h4>
                  <p>
                    {t('landing.s289')}
                  </p>
                </div>
                <div className="cta-stat">
                  <h4>
                    {t('landing.s290')}
                  </h4>
                  <p>
                    {t('landing.s291')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ===== FOOTER ===== */}
        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              <div>
                <Link className="footer-logo" to="/" aria-label="EVENTIFY home">
                  <span className="material-symbols-outlined logo-icon" style={{"fontVariationSettings": "'FILL' 1"}}>
                    hub
                  </span>
                  <span className="wordmark">
                    {t('landing.s293')}
                  </span>
                </Link>
                <p className="desc">
                  {t('landing.s294')}
                </p>
                <ul className="footer-contact" style={{"marginTop": "24px"}}>
                  <li>
                    <i className="fa-solid fa-envelope"></i>
                    {' '}
                    {t('landing.s295')}
                  </li>
                  <li>
                    <i className="fa-solid fa-location-dot"></i>
                    {' '}
                    {t('landing.s296')}
                  </li>
                </ul>
                <div className="social-links">
                  <a href="#" aria-label="EVENTIFY on Facebook">
                    <i className="fa-brands fa-facebook-f"></i>
                  </a>
                  <a href="#" aria-label="EVENTIFY on Instagram">
                    <i className="fa-brands fa-instagram"></i>
                  </a>
                  <a href="#" aria-label="EVENTIFY on LinkedIn">
                    <i className="fa-brands fa-linkedin-in"></i>
                  </a>
                  <a href="#" aria-label="EVENTIFY on X">
                    <i className="fa-brands fa-x-twitter"></i>
                  </a>
                </div>
              </div>
              <div>
                <h4>
                  {t('landing.s297')}
                </h4>
                <ul>
                  <li>
                    <a href="#opportunities">
                      {t('landing.s298')}
                    </a>
                  </li>
                  <li>
                    <a href="#categories">
                      {t('landing.s299')}
                    </a>
                  </li>
                  <li>
                    <a href="#rafeeq">
                      {t('landing.s300')}
                    </a>
                  </li>
                  <li>
                    <Link to="/auth/organization-verification">
                      {t('landing.s301')}
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4>
                  {t('landing.s302')}
                </h4>
                <ul>
                  <li>
                    <Link to="/about">
                      {t('landing.s303')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact">
                      {t('landing.s304')}
                    </Link>
                  </li>
                  <li>
                    <a href="#faq">
                      {t('landing.s305')}
                    </a>
                  </li>
                  <li>
                    <Link to="/auth/login">
                      {t('landing.s306')}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <p>
                {t('landing.s307')}
                {' '}
                <Link to="/auth/privacy" style={{"color": "inherit", "textDecoration": "underline"}}>
                  {t('landing.s308')}
                </Link>
                {' '}
                {t('landing.s309')}
                {' '}
                <Link to="/auth/terms" style={{"color": "inherit", "textDecoration": "underline"}}>
                  {t('landing.s310')}
                </Link>
              </p>
            </div>
          </div>
        </footer>
        <button id="scrollTop" type="button" aria-label="Back to top">
          <i className="fa-solid fa-arrow-up"></i>
        </button>
        {/* ===== QUICK PREVIEW MODAL ===== */}
        <div className="opp-modal-backdrop" id="oppModalBackdrop" aria-hidden="true">
          <div className="opp-modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
            <button className="opp-modal-close" id="oppModalClose" type="button" aria-label="Close modal">
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="opp-modal-header">
              <span className="opp-modal-tag" id="modalTag">
                {t('landing.s311')}
              </span>
              <h3 className="opp-modal-title" id="modalTitle">
                {t('landing.s312')}
              </h3>
              <div className="opp-modal-meta">
                <span>
                  <i className="fa-solid fa-building"></i>
                  <strong id="modalOrg">
                    {t('landing.s313')}
                  </strong>
                </span>
                <span>
                  <i className="fa-solid fa-location-dot"></i>
                  <span id="modalLoc">
                    {t('landing.s314')}
                  </span>
                </span>
                <span>
                  <i className="fa-regular fa-calendar"></i>
                  <span id="modalDeadline">
                    {t('landing.s315')}
                  </span>
                </span>
              </div>
              <div className="opp-perk" id="modalPerk">
                <i className="fa-solid fa-trophy"></i>
                {' '}
                {t('landing.s316')}
              </div>
            </div>
            <div className="opp-modal-desc" id="modalDesc">
              {' '}
              {t('landing.s317')}
              {' '}
            </div>
            <div className="opp-modal-section">
              <h4>
                {t('landing.s318')}
              </h4>
              <div className="opp-modal-badges" id="modalSkills">
                {/* populated dynamically */}
              </div>
            </div>
            <div className="opp-modal-footer">
              <div>
                <span style={{"fontSize": "12px", "color": "var(--text-muted)", "display": "block"}}>
                  {t('landing.s319')}
                </span>
                <span style={{"fontSize": "14px", "fontWeight": 700, "color": "#10B981"}}>
                  <i className="fa-solid fa-circle-check"></i>
                  {' '}
                  {t('landing.s320')}
                </span>
              </div>
              <div style={{"display": "flex", "gap": "10px"}}>
                <button className="btn btn-secondary btn-sm" id="modalCloseBtn" type="button">
                  {t('landing.s321')}
                </button>
                <Link className="btn btn-primary btn-sm" id="modalApplyBtn" to="/auth/signup">
                  {t('landing.s322')}
                  {' '}
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  )
}
