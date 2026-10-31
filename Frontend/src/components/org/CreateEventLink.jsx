import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { DRAFT_KEY } from '../../pages/org/org-opportunities-data.js'

function loadDraftTitle() {
    try {
        const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null')
        return d && d.title ? d.title : null
    } catch {
        return null
    }
}

// غلاف لأي رابط "إنشاء فعالية" بالتطبيق (السايدبار، أو زر صفحة الفرص): لو فيه مسودة
// محفوظة فعلاً، يسأل قبل ما يكمّلها أو يبلش فورم فاضي، بدل ما يحمّل المسودة بصمت.
export default function CreateEventLink({ className, children }) {
    const { isRtl } = useLanguage()
    const navigate = useNavigate()
    const [modalOpen, setModalOpen] = useState(false)

    const handleClick = (e) => {
        if (!loadDraftTitle()) return // ما في مسودة: الرابط يشتغل عادي
        e.preventDefault()
        setModalOpen(true)
    }

    const startFresh = () => {
        try { localStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ }
        setModalOpen(false)
        navigate('/org/create-event')
    }

    return (
        <>
            <Link className={className} to="/org/create-event" onClick={handleClick}>
                {children}
            </Link>

            {modalOpen && createPortal(
                <div
                    className="flex items-center justify-center p-4 fade-in"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 60,
                        background: 'rgba(14, 17, 22, 0.45)',
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)',
                    }}
                    onClick={e => { if (e.target === e.currentTarget) setModalOpen(false) }}
                >
                    <div className="confirm-dialog fade-in-up" style={{ position: 'static', margin: 0 }}>
                        <h3>{isRtl ? 'عندك مسودة فعالية غير مكتملة' : 'You have an unfinished opportunity draft'}</h3>
                        <p>{loadDraftTitle()}</p>
                        <p style={{ marginTop: 4 }}>
                            {isRtl
                                ? 'تحب تكمل فيها، ولا تبلش فعالية جديدة فاضية؟'
                                : 'Continue it, or start a new blank opportunity?'}
                        </p>
                        <div className="confirm-dialog__actions">
                            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
                                {isRtl ? 'إلغاء' : 'Cancel'}
                            </button>
                            <button type="button" className="btn-secondary" onClick={startFresh}>
                                {isRtl ? 'ابدأ فعالية جديدة' : 'Start new opportunity'}
                            </button>
                            <Link className="btn-primary" to="/org/create-event" onClick={() => setModalOpen(false)}>
                                {isRtl ? 'متابعة المسودة' : 'Continue draft'}
                            </Link>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}
