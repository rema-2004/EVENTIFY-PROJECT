import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { i18nReady } from './i18n'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import { OnboardingProvider } from './context/OnboardingContext'

// Render once the starting language file has loaded (see i18n/index.js).
// Render anyway if it fails, so a translation error never leaves a blank page.
const render = () => createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <OnboardingProvider>
            <App />
          </OnboardingProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)

i18nReady.then(render, render)
