import { useState } from 'react'
import { readJSON, writeJSON } from '../utils/storage'

// حالة React متزامنة مع localStorage: نفس الـ useState العادي، بس بيحمّل القيمة
// الأولية من localStorage وبيكتب كل تحديث رجوع فيه تلقائياً.
export function useLocalStorageState(key, initialValue) {
    const [value, setValue] = useState(() => readJSON(key, initialValue))

    const setAndPersist = (next) => {
        setValue((prev) => {
            const resolved = typeof next === 'function' ? next(prev) : next
            writeJSON(key, resolved)
            return resolved
        })
    }

    return [value, setAndPersist]
}
