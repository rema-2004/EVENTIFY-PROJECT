import AppLangToggle from '../../components/app/AppLangToggle'
import AppFooter from '../../components/app/AppFooter'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'

const RAFEEQ_GRADIENT = 'linear-gradient(135deg, #FF4D2E 0%, #0E1116 100%)'

export default function RafeeqVoice() {
    const { language } = useLanguage()
    const ar = language === 'ar'
    const navigate = useNavigate()
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [status, setStatus] = useState('')
    const recognitionRef = useRef(null)

    useEffect(() => () => recognitionRef.current?.abort(), [])

    function returnToText() {
        recognitionRef.current?.stop()
        navigate('/app/rafeeq', { state: transcript ? { transcript } : null })
    }

    function toggleListening() {
        if (isListening) {
            recognitionRef.current?.stop()
            return
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SpeechRecognition) {
            setStatus(ar
                ? 'الإدخال الصوتي غير مدعوم في هذا المتصفح. جرّب Chrome أو Edge.'
                : 'Voice input is not supported in this browser. Try Chrome or Edge.')
            return
        }

        const recognition = new SpeechRecognition()
        recognition.lang = ar ? 'ar-SA' : (navigator.language || 'en-US')
        recognition.interimResults = false
        recognition.maxAlternatives = 1
        recognition.onstart  = () => { setIsListening(true);  setStatus(ar ? 'جارٍ الاستماع… اضغط مرة أخرى للإيقاف.' : 'Listening… Tap the mic again to stop.') }
        recognition.onresult = (e) => { setTranscript(e.results[0][0].transcript); setStatus(ar ? 'تم التعرف على الكلام. عُد إلى المحادثة لمراجعته.' : 'Speech recognized. Return to chat to review it.') }
        recognition.onerror  = (e) => {
            const msgs = {
                'not-allowed':        ar ? 'تم رفض الوصول إلى الميكروفون.' : 'Microphone access was denied.',
                'service-not-allowed': ar ? 'المتصفح منع التعرف على الكلام.' : 'The browser blocked speech recognition.',
                'no-speech':          ar ? 'لم يُكتشف أي كلام. حاول مرة أخرى.' : 'No speech detected. Try again.',
            }
            setStatus(msgs[e.error] || (ar ? 'فشل الإدخال الصوتي. حاول مرة أخرى.' : 'Voice input failed. Please try again.'))
        }
        recognition.onend = () => setIsListening(false)
        recognitionRef.current = recognition

        try { recognition.start() } catch { setIsListening(false); setStatus(ar ? 'تعذّر بدء الإدخال الصوتي.' : 'Could not start voice input.') }
    }

    return (
        <div className="flex min-h-screen flex-col bg-surface text-on-surface" dir={ar ? 'rtl' : 'ltr'}>
            {/* Header */}
            <header className="sticky top-0 z-50 flex h-16 w-full items-center border-b border-outline-variant/30 bg-surface/90 px-container-margin-mobile backdrop-blur-md md:px-container-margin-desktop">
                <div className="mx-auto flex w-full max-w-[900px] flex-wrap items-center justify-between gap-x-5 gap-y-2">
                    <button
                        className="flex items-center gap-2 text-on-surface-variant transition-colors hover:text-on-surface"
                        type="button"
                        onClick={returnToText}
                    >
                        <span className="material-symbols-outlined">{ar ? 'arrow_forward' : 'arrow_back'}</span>
                        <span className="font-label-md text-label-md">{ar ? 'رجوع' : 'Back'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full text-white" style={{ background: RAFEEQ_GRADIENT }}>
                            <span className="material-symbols-outlined text-xl">smart_toy</span>
                        </div>
                        <span className="font-title-md text-title-md">{ar ? 'رفيق' : 'Rafeeq'}</span>
                    </div>

                    <div className="flex items-center gap-3">
<AppLangToggle />
<div className="flex rounded-full bg-surface-container p-1">
                        <button
                            className="rounded-full px-4 py-1.5 font-label-sm text-label-sm text-on-surface-variant transition-all hover:text-on-surface"
                            type="button"
                            onClick={() => navigate('/app/rafeeq')}
                        >
                            {ar ? 'نص' : 'Text'}
                        </button>
                        <button
                            className="rounded-full px-4 py-1.5 font-label-sm text-label-sm shadow-sm transition-all"
                            style={{ backgroundColor: '#FF4D2E', color: '#fff' }}
                            type="button"
                            aria-current="page"
                        >
                            {ar ? 'صوت' : 'Voice'}
                        </button>
                    </div>
</div>
                </div>
            </header>

            {/* Voice UI */}
            <section className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
                <h1 className="sr-only">{ar ? 'واجهة رفيق الصوتية' : 'Rafeeq voice interface'}</h1>
                <div className="flex w-full max-w-sm flex-col items-center gap-6">
                    <div className="relative mb-8">
                        <span className="pointer-events-none absolute -inset-12 rounded-full bg-[#fff0eb]" aria-hidden="true" />
                        <button
                            className="relative flex h-44 w-44 items-center justify-center rounded-full text-white shadow-xl transition-transform hover:scale-105 active:scale-95"
                            type="button"
                            onClick={toggleListening}
                            aria-label={isListening ? (ar ? 'إيقاف الإدخال الصوتي' : 'Stop voice input') : (ar ? 'بدء الإدخال الصوتي' : 'Start voice input')}
                            aria-pressed={isListening}
                            style={{ background: RAFEEQ_GRADIENT }}
                        >
                            <span
                                className="material-symbols-outlined"
                                style={{ fontSize: 96, fontVariationSettings: '"FILL" 1, "wght" 500' }}
                                aria-hidden="true"
                            >
                                {isListening ? 'graphic_eq' : 'mic'}
                            </span>
                        </button>
                        {isListening && (
                            <span className="pointer-events-none absolute inset-0 animate-ping rounded-full" style={{ backgroundColor: 'rgba(255,77,46,0.2)' }} />
                        )}
                    </div>

                    <div className="w-full max-w-xs space-y-3">
                        <p className="font-body-lg text-body-lg text-on-surface-variant">
                            {ar
                                ? 'اضغط على الميكروفون وتحدث بشكل طبيعي. سيتم تحويل كلامك إلى نص في المحادثة.'
                                : 'Tap the mic and speak naturally. Your words will be transcribed into the chat.'}
                        </p>
                        {status && (
                            <p className="font-label-sm text-label-sm text-on-surface-variant" role="status" aria-live="polite">
                                {status}
                            </p>
                        )}
                        {transcript && (
                            <p className="rounded-lg border border-outline-variant bg-surface-container-lowest px-5 py-3 font-body-md text-body-md">
                                {transcript}
                            </p>
                        )}
                    </div>

                    <button
                        className="min-h-12 rounded-full border border-outline-variant px-7 py-3 font-label-md text-label-md transition-colors hover:bg-surface-container"
                        type="button"
                        onClick={returnToText}
                    >
                        {ar ? 'التبديل إلى النص' : 'Switch to text instead'}
                    </button>
                </div>
            </section>

            <AppFooter />
        </div>
    )
}
