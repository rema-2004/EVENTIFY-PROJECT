// نقطة وحيدة للتعامل مع localStorage بدل تكرار نفس try/catch + JSON.parse/stringify
// بعشرات الملفات. لما يوصل الباك إند الحقيقي، هاي الدالة هي المكان الوحيد
// اللي لازم يتغيّر (أو يُستبدل) بدل تعديل كل صفحة لحالها.

export function readJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(key)
        if (raw === null) return fallback
        return JSON.parse(raw)
    } catch {
        return fallback
    }
}

export function writeJSON(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value))
        return true
    } catch {
        return false
    }
}

export function removeKeys(...keys) {
    keys.forEach((key) => {
        try {
            localStorage.removeItem(key)
        } catch {
            // ignore
        }
    })
}

// نفس الثلاثة فوق بس لـ sessionStorage (تُستخدم لتمرير الفعالية/المسابقة المختارة
// بين صفحات نفس جلسة التصفح، بدل تكرار نفس try/catch بكل صفحة).
export function readSessionJSON(key, fallback) {
    try {
        const raw = sessionStorage.getItem(key)
        if (raw === null) return fallback
        return JSON.parse(raw)
    } catch {
        return fallback
    }
}

export function writeSessionJSON(key, value) {
    try {
        sessionStorage.setItem(key, JSON.stringify(value))
        return true
    } catch {
        return false
    }
}
