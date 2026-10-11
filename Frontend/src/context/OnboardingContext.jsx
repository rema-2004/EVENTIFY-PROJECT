import { createContext, useContext, useState, useEffect } from 'react'

const OnboardingContext = createContext(null)
const PROFILE_KEY = 'eventify:participant-profile'

const INITIAL_PROFILE = {
    fullName: 'John Nanna',
    education: 'Computer Science & AI',
    skills: ['UI/UX', 'Backend', 'AI', 'Flutter', 'Python'],
    interests: ['UI/UX', 'Backend', 'AI'],
    experienceLevel: 'junior',
    participationPreference: 'Both',
    resumeFileName: '',
    setupMethod: 'resume', // 'resume' | 'wizard'
}

export function OnboardingProvider({ children }) {
    // Default to true for ready-to-explore demo; explicit 'false' when reset for onboarding test
    const [isProfileComplete, setIsProfileCompleteState] = useState(() => {
        const saved = localStorage.getItem('eventify_isProfileComplete')
        if (saved !== null) return saved === 'true'
        return true
    })

    const [userProfile, setUserProfile] = useState(() => {
        const saved = localStorage.getItem('eventify_userProfile')
        if (saved) {
            try {
                return { ...INITIAL_PROFILE, ...JSON.parse(saved) }
            } catch {
                return INITIAL_PROFILE
            }
        }
        // Check if legacy profile exists
        try {
            const legacy = JSON.parse(localStorage.getItem(PROFILE_KEY))
            if (legacy?.name) {
                return {
                    ...INITIAL_PROFILE,
                    fullName: legacy.name,
                    education: legacy.headline || INITIAL_PROFILE.education,
                    skills: legacy.skills || INITIAL_PROFILE.skills,
                }
            }
        } catch {}
        return INITIAL_PROFILE
    })

    // Keep localStorage in sync
    useEffect(() => {
        localStorage.setItem('eventify_isProfileComplete', String(isProfileComplete))
    }, [isProfileComplete])

    useEffect(() => {
        localStorage.setItem('eventify_userProfile', JSON.stringify(userProfile))
    }, [userProfile])

    const setIsProfileComplete = (status) => {
        setIsProfileCompleteState(Boolean(status))
    }

    const updateProfile = (data) => {
        setUserProfile((prev) => {
            const next = { ...prev, ...data }
            syncToLegacyProfile(next)
            return next
        })
    }

    const syncToLegacyProfile = (data) => {
        try {
            const legacy = JSON.parse(localStorage.getItem(PROFILE_KEY)) || {}
            const merged = {
                ...legacy,
                name: data.name || data.fullName || legacy.name || 'John Nanna',
                headline: data.headline || (data.education ? `${data.education} • Eventify Participant` : (legacy.headline || 'Software Engineering & AI')),
                location: data.location || legacy.location || 'Amman, Jordan',
                about: data.about || legacy.about || '',
                skills: (data.skills && data.skills.length > 0) ? data.skills : (legacy.skills || INITIAL_PROFILE.skills),
                experience: data.experience !== undefined ? data.experience : (legacy.experience || []),
                projects: data.projects !== undefined ? data.projects : (legacy.projects || []),
                interests: data.interests || legacy.interests || INITIAL_PROFILE.interests,
                experienceLevel: data.experienceLevel || legacy.experienceLevel || INITIAL_PROFILE.experienceLevel,
                participationPreference: data.participationPreference || legacy.participationPreference || INITIAL_PROFILE.participationPreference,
                setupMethod: data.setupMethod || legacy.setupMethod || 'resume',
                resumeFileName: data.resumeFileName || legacy.resumeFileName || '',
            }
            localStorage.setItem(PROFILE_KEY, JSON.stringify(merged))
        } catch {
            // storage unavailable
        }
    }

    const completeProfile = (data = {}) => {
        setUserProfile((prev) => {
            const next = { ...prev, ...data }
            localStorage.setItem('eventify_userProfile', JSON.stringify(next))
            syncToLegacyProfile(next)
            return next
        })
        setIsProfileCompleteState(true)
        localStorage.setItem('eventify_isProfileComplete', 'true')
    }

    const resetProfile = () => {
        setUserProfile(INITIAL_PROFILE)
        setIsProfileCompleteState(false)
        localStorage.setItem('eventify_isProfileComplete', 'false')
        localStorage.removeItem('eventify_userProfile')
        localStorage.removeItem(PROFILE_KEY)
    }

    return (
        <OnboardingContext.Provider
            value={{
                isProfileComplete,
                setIsProfileComplete,
                userProfile,
                updateProfile,
                completeProfile,
                resetProfile,
            }}
        >
            {children}
        </OnboardingContext.Provider>
    )
}

export function useOnboarding() {
    const context = useContext(OnboardingContext)
    if (!context) {
        throw new Error('useOnboarding must be used within an OnboardingProvider')
    }
    return context
}
