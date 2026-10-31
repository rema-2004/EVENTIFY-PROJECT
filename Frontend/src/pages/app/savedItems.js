// Shared "saved" bookmark state between explore.jsx, opportunity.jsx and index.jsx, persisted
// across navigation and reloads. Pages key by the same opportunity id (e.g. 'global-ai-innovation-challenge').
import { readJSON, writeJSON } from '../../utils/storage'

const STORAGE_KEY = 'eventify_saved_ids'

export function loadSavedIds() {
    const raw = readJSON(STORAGE_KEY, [])
    return new Set(Array.isArray(raw) ? raw : [])
}

export function persistSavedIds(idSet) {
    writeJSON(STORAGE_KEY, [...idSet])
}
