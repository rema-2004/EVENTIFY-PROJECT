import { useContext } from 'react'
import { LanguageContext } from '../../context/language-context'

export default function LangToggleBtn({ small = false }) {
    const ctx = useContext(LanguageContext)
    const label = ctx?.language?.startsWith('ar') ? 'AR' : 'EN'
    return (
        <button
            className="lang-toggle icon-btn"
            type="button"
            title={`Switch to ${label}`}
            aria-label={`Switch to ${label}`}
            style={small ? { width: 36, height: 36 } : undefined}
        >
            <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
                {label}
            </span>
        </button>
    )
}
