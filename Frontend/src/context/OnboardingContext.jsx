import { createContext, useContext, useState } from 'react'
import { readJSON, writeJSON, removeKeys } from '../utils/storage'

const OnboardingContext = createContext(null)
const PROFILE_KEY = 'eventify:participant-profile'
const USER_PROFILE_KEY = 'eventify_userProfile'
const CURRENT_PARTICIPANT_KEY = 'eventify_current_participant'
const COMPLETED_PARTICIPANTS_KEY = 'eventify_completed_participants'

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

function isParticipantCompleted() {
    const current = localStorage.getItem(CURRENT_PARTICIPANT_KEY)
    const completedUsers = readJSON(COMPLETED_PARTICIPANTS_KEY, [])
    return Boolean(current) && completedUsers.includes(current)
}

export function OnboardingProvider({ children }) {
    // Participant enters for the first time -> lock screen appears. If returning / has CV / completed, normal access.
    // Scoped to the current participant, not a single global flag, so one participant
    // unlocking their profile doesn't unlock it for everyone who logs in afterward.
    const [isProfileComplete, setIsProfileCompleteState] = useState(() => {
        if (isParticipantCompleted()) return true
        const savedProfile = readJSON(USER_PROFILE_KEY, {})
        return Boolean(savedProfile?.resumeFileName || savedProfile?.setupMethod)
    })

    const [userProfile, setUserProfile] = useState(() => {
        const saved = readJSON(USER_PROFILE_KEY, null)
        if (saved) return { ...INITIAL_PROFILE, ...saved }

        // Check if legacy profile exists
        const legacy = readJSON(PROFILE_KEY, null)
        if (legacy?.name) {
            return {
                ...INITIAL_PROFILE,
                fullName: legacy.name,
                education: legacy.headline || INITIAL_PROFILE.education,
                skills: legacy.skills || INITIAL_PROFILE.skills,
            }
        }
        return INITIAL_PROFILE
    })

    const markParticipantCompleted = () => {
        const current = localStorage.getItem(CURRENT_PARTICIPANT_KEY)
        if (!current) return
        const completedUsers = readJSON(COMPLETED_PARTICIPANTS_KEY, [])
        if (!completedUsers.includes(current)) {
            writeJSON(COMPLETED_PARTICIPANTS_KEY, [...completedUsers, current])
        }
    }

    const setIsProfileComplete = (status) => {
        const flag = Boolean(status)
        setIsProfileCompleteState(flag)
        if (flag) markParticipantCompleted()
    }

    const updateProfile = (data) => {
        setUserProfile((prev) => {
            const next = { ...prev, ...data }
            writeJSON(USER_PROFILE_KEY, next)
            syncToLegacyProfile(next)
            return next
        })
    }

    const syncToLegacyProfile = (data) => {
        const legacy = readJSON(PROFILE_KEY, {})
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
        writeJSON(PROFILE_KEY, merged)
    }

    const completeProfile = (data = {}) => {
        setUserProfile((prev) => {
            const next = { ...prev, ...data }
            writeJSON(USER_PROFILE_KEY, next)
            syncToLegacyProfile(next)
            return next
        })
        setIsProfileCompleteState(true)
        markParticipantCompleted()
    }

    const resetProfile = () => {
        setUserProfile(INITIAL_PROFILE)
        setIsProfileCompleteState(false)
        removeKeys(USER_PROFILE_KEY, PROFILE_KEY)
        const current = localStorage.getItem(CURRENT_PARTICIPANT_KEY)
        if (current) {
            const completedUsers = readJSON(COMPLETED_PARTICIPANTS_KEY, [])
            writeJSON(COMPLETED_PARTICIPANTS_KEY, completedUsers.filter((u) => u !== current))
        }
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
