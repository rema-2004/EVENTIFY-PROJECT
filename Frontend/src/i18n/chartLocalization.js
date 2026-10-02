import Chart from 'chart.js/auto'
import i18n from './index'
import { translateDisplayLabel } from './labelTranslator'

// Chart.js draws on <canvas>, so the DOM-based localizer can't reach its legends, axes or tooltips.
// This plugin translates dataset names and category labels right before each render and
// restores the originals in English, so charts follow the language toggle.
const isArabic = () => i18n.language?.toLowerCase().startsWith('ar')

function localizeArray(data, key, translate) {
    const current = data[key]
    if (!Array.isArray(current)) return
    const store = data[`$${key}`] || (data[`$${key}`] = { original: null, shown: null })
    if (store.shown !== current) store.original = current.slice()
    const next = translate ? store.original.map((value) => (typeof value === 'string' ? translateDisplayLabel(value) : value)) : store.original.slice()
    store.shown = next
    data[key] = next
}

const eventifyChartLocalization = {
    id: 'eventifyChartLocalization',
    beforeUpdate(chart) {
        const translate = isArabic()
        const data = chart.config.data
        localizeArray(data, 'labels', translate)
        data.datasets.forEach((dataset) => {
            if (typeof dataset.label !== 'string') return
            if (dataset.$shownLabel !== dataset.label) dataset.$originalLabel = dataset.label
            dataset.$shownLabel = translate ? translateDisplayLabel(dataset.$originalLabel) : dataset.$originalLabel
            dataset.label = dataset.$shownLabel
        })
    },
}

Chart.register(eventifyChartLocalization)

i18n.on('languageChanged', () => {
    Object.values(Chart.instances).forEach((chart) => chart.update())
})
