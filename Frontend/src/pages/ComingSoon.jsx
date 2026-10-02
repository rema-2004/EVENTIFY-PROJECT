import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// Placeholder for sections not yet ported to React (auth/app/org/admin land in later
// passes — see PRODUCT.md / the conversion plan). Keeps in-app navigation from dead-ending.
export default function ComingSoon({ title }) {
    const { t } = useTranslation()
    return (
        <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 40, textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 700 }}>{title}</h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: 440 }}>{t('comingSoon.desc')}</p>
            <Link className="btn btn-primary" to="/">{t('comingSoon.backHome')}</Link>
        </div>
    )
}
