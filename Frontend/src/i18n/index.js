import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

export const RTL_LANGUAGES = ['ar']

// Loads a language's JSON only when it's needed (its own chunk), instead of
// bundling both en.json and ar.json into the main file.
const lazyLocales = {
    type: 'backend',
    read(language, _namespace, callback) {
        import(`./locales/${language}.json`)
            .then((module) => callback(null, module.default))
            .catch((error) => callback(error, null))
    },
}

// Resolves once the starting language is loaded; main.jsx waits for it
// before the first render so no untranslated keys flash on screen.
export const i18nReady = i18n
    .use(lazyLocales)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        supportedLngs: ['en', 'ar'],
        load: 'languageOnly',
        interpolation: { escapeValue: false },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'eventify-lang',
        },
    })

export default i18n
