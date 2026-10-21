// The bio written for a participant who skipped "About" in the quick questions.
// It is rebuilt in the current language on every render instead of being stored,
// so switching the site language also switches the bio.

export function autoAbout(headline, ar) {
    return ar
        ? `طالب ومطور مهتم بـ ${headline}. أبحث عن المشاركة في الهاكاثونات والفعاليات التقنية وتطوير المشاريع المبتكرة.`
        : `Passionate developer focused on ${headline}. Looking to participate in top hackathons, tech workshops, and innovative projects.`
}

// Profiles saved before this change hold the generated text itself; treat it as generated.
export function isAutoAbout(about, headline) {
    return !about || about === autoAbout(headline, true) || about === autoAbout(headline, false)
}
