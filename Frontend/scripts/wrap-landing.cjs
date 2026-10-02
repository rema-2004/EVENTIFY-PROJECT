const fs = require('fs')

const body = fs.readFileSync('tmp-landing.jsx', 'utf8')
const indented = body.split('\n').map((l) => (l ? '      ' + l : l)).join('\n')

const header = `import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Landing.css'

export default function Landing() {
  const navigate = useNavigate()
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
      if (testiSlides) testiSlides.style.transform = \`translateX(-\${testiIndex * 100}%)\`
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
      'Sign in to search personalized opportunities...',
      'Sign in to find hackathons in Jordan...',
      'Sign in to find AI internships...',
      'Sign in to discover cybersecurity courses...',
      'Sign in to explore volunteering programs...',
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
  }, [navigate])

  return (
    <div ref={rootRef}>
`

const footer = `
    </div>
  )
}
`

fs.writeFileSync('src/pages/visitor/Landing.jsx', header + indented + footer)
console.log('wrote src/pages/visitor/Landing.jsx')
