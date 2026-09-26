import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RafeeqVoice() {
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
            setStatus('Voice input is not supported in this browser. Try Chrome or Edge.')
            return
        }

        const recognition = new SpeechRecognition()
        recognition.lang = navigator.language || 'en-US'
        recognition.interimResults = false
        recognition.maxAlternatives = 1
        recognition.onstart = () => {
            setIsListening(true)
            setStatus('Listening… Tap the microphone again to stop.')
        }
        recognition.onresult = (event) => {
            const spokenText = event.results[0][0].transcript
            setTranscript(spokenText)
            setStatus('Speech recognized. Return to the chat to review it.')
        }
        recognition.onerror = (event) => {
            const errors = {
                'not-allowed': 'Microphone access was denied. Allow it in your browser settings.',
                'service-not-allowed': 'The browser blocked speech recognition.',
                'no-speech': 'No speech was detected. Try again.',
            }
            setStatus(errors[event.error] || 'Voice input failed. Please try again.')
        }
        recognition.onend = () => setIsListening(false)
        recognitionRef.current = recognition

        try {
            recognition.start()
        } catch {
            setIsListening(false)
            setStatus('Could not start voice input. Please try again.')
        }
    }

    return (
        <main className="flex min-h-[calc(100vh-4rem)] flex-col bg-surface text-on-surface">
            <header className="sticky top-0 z-50 flex h-16 w-full items-center border-b border-outline-variant/30 bg-surface/90 px-container-margin-mobile backdrop-blur-md md:px-container-margin-desktop">
                <div className="mx-auto flex w-full max-w-[900px] flex-wrap items-center justify-between gap-x-5 gap-y-2">
                    <button
                        className="flex items-center gap-2 text-on-surface-variant transition-colors hover:text-primary"
                        type="button"
                        onClick={returnToText}
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span className="font-label-md text-label-md">Back</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <div
                            className="flex h-9 w-9 items-center justify-center rounded-full text-white"
                            style={{ background: 'linear-gradient(135deg, #ff4d2e, #0e1116)' }}
                        >
                            <span className="material-symbols-outlined text-xl">smart_toy</span>
                        </div>
                        <span className="font-title-md text-title-md">Rafeeq</span>
                    </div>
                    <div className="flex rounded-full bg-surface-container p-1">
                        <button
                            className="rounded-full px-4 py-1.5 font-label-sm text-label-sm text-on-surface-variant transition-all"
                            type="button"
                            onClick={() => navigate('/app/rafeeq')}
                        >
                            Text
                        </button>
                        <button
                            className="rounded-full bg-surface-container-lowest px-4 py-1.5 font-label-sm text-label-sm text-primary shadow-sm transition-all"
                            type="button"
                            aria-current="page"
                        >
                            Voice
                        </button>
                    </div>
                </div>
            </header>
            <section className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
                <h1 className="sr-only">Rafeeq voice interface</h1>
                <div className="flex w-full max-w-sm flex-col items-center gap-6">
                    <div className="relative mb-8">
                        <span
                            className="pointer-events-none absolute -inset-12 rounded-full bg-[#fff0eb]"
                            aria-hidden="true"
                        />
                        <button
                            className="relative flex h-44 w-44 items-center justify-center rounded-full text-white shadow-xl transition-transform hover:scale-105 active:scale-95"
                            type="button"
                            onClick={toggleListening}
                            aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                            aria-pressed={isListening}
                            style={{ background: 'linear-gradient(135deg, #ff4d2e, #0e1116)' }}
                        >
                            <span
                                className="material-symbols-outlined text-8xl"
                                style={{ fontVariationSettings: '"FILL" 1, "wght" 500' }}
                                aria-hidden="true"
                            >
                                {isListening ? 'graphic_eq' : 'mic'}
                            </span>
                        </button>
                        {isListening && (
                            <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-primary/20" />
                        )}
                    </div>
                    <div className="w-full max-w-xs space-y-3">
                        <p className="font-body-lg text-body-lg text-on-surface-variant">
                            Tap the mic and speak naturally. Your words will be transcribed into the chat.
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
                        Switch to text instead
                    </button>
                </div>
            </section>
            <footer className="mt-auto bg-[#0b1220] px-6 py-5 text-center text-xs text-white/50">
                © 2026 EVENTIFY. All rights reserved.
            </footer>
        </main>
    )
}
