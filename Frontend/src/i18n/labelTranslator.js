// Lets non-React code (e.g. Chart.js plugins) reuse the workspace dictionary.
let translator = (value) => value

export function registerLabelTranslator(fn) {
    translator = fn
}

export function translateDisplayLabel(value) {
    return translator(value)
}
