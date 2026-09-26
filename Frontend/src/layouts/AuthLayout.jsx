import { Link } from 'react-router-dom'
import { useMotion } from '../hooks/useMotion'
import '../styles/app-shell.css'
import '../styles/auth.css'

// Two-column shell shared by login / signup / forgot-password.
// `visual` renders as-is inside the side-gradient panel (each page supplies its
// own overlay/decoration divs — the login-style and signup-style panels differ
// enough that a single shared wrapper markup would fight one or the other).
// `reverse` swaps which side that panel renders on (signup puts it on the left).
export default function AuthLayout({ visual, reverse = false, shellClassName = '', children }) {
    useMotion([])

    return (
        <div className={`page-shell text-on-surface min-h-screen ${shellClassName}`}>
            <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
                {reverse && (
                    <div className="hidden lg:flex side-gradient flex-col justify-between p-12 xl:p-16 relative overflow-hidden order-2 lg:order-1 lg:sticky lg:top-0 lg:h-screen self-start">
                        {visual}
                    </div>
                )}

                <div className={`flex flex-col justify-start lg:justify-center px-6 sm:px-12 xl:px-16 py-10 sm:py-16 relative min-h-screen ${reverse ? 'order-1 lg:order-2' : ''}`}>
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl"></div>
                    </div>

                    <div className="relative z-10 max-w-md w-full mx-auto my-auto">
                        <Link className="flex items-center gap-2 mb-8" to="/">
                            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
                            <span className="font-title-lg text-title-lg font-black text-primary">EVENTIFY</span>
                        </Link>

                        {children}
                    </div>
                </div>

                {!reverse && (
                    <div className="hidden lg:flex side-gradient items-center justify-center p-16 relative overflow-hidden lg:sticky lg:top-0 lg:h-screen">
                        {visual}
                    </div>
                )}
            </div>
        </div>
    )
}
