// Team-size limits of the competition being registered for. Mock values until the
// backend sends them with the opportunity (the organizer sets "Team Size" per event).
export const TEAM_LIMITS = { min: 2, max: 5 }

export const teamSizeOptions = () =>
    Array.from({ length: TEAM_LIMITS.max - TEAM_LIMITS.min + 1 }, (_, i) => TEAM_LIMITS.min + i)
