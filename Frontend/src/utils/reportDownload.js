// Downloads a report in its own format (PDF / Excel / CSV) from plain table data.
// No libraries: the PDF is a tiny hand-built single-font document, Excel is an HTML table
// that Excel opens natively, CSV is UTF-8 with a BOM so Excel reads Arabic correctly.

function saveBlob(filename, blob) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}

const escHtml = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Minimal PDF (Helvetica, WinAnsi). Characters outside Latin-1 become "?".
function buildPdf(title, lines) {
    const latin = (t) => String(t)
        .replace(/[‒-―]/g, '-')
        .replace(/[‘’]/g, "'")
        .replace(/[“”]/g, '"')
        .replace(/·/g, '-')
        .replace(/[^\x20-\x7E]/g, '?')
    const esc = (t) => latin(t).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
    const perPage = 46
    const pages = []
    for (let i = 0; i < Math.max(lines.length, 1); i += perPage) pages.push(lines.slice(i, i + perPage))
    const objs = []
    objs[1] = '<< /Type /Catalog /Pages 2 0 R >>'
    objs[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'
    objs[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'
    const kids = []
    pages.forEach((chunk, i) => {
        const pageNo = 5 + i * 2
        let y = 800
        let body = `BT /F2 16 Tf 50 ${y} Td (${esc(title)}) Tj ET\n`
        y -= 30
        chunk.forEach((line) => {
            body += `BT /F1 10 Tf 50 ${y} Td (${esc(line)}) Tj ET\n`
            y -= 15
        })
        objs[pageNo] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${pageNo + 1} 0 R >>`
        objs[pageNo + 1] = `<< /Length ${body.length} >>\nstream\n${body}endstream`
        kids.push(`${pageNo} 0 R`)
    })
    objs[2] = `<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${kids.length} >>`
    let out = '%PDF-1.4\n'
    const offsets = []
    for (let n = 1; n < objs.length; n++) {
        if (!objs[n]) continue
        offsets[n] = out.length
        out += `${n} 0 obj\n${objs[n]}\nendobj\n`
    }
    const xref = out.length
    out += `xref\n0 ${objs.length}\n0000000000 65535 f \n`
    for (let n = 1; n < objs.length; n++) {
        out += offsets[n] !== undefined ? `${String(offsets[n]).padStart(10, '0')} 00000 n \n` : '0000000000 65535 f \n'
    }
    out += `trailer\n<< /Size ${objs.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`
    return new Blob([out], { type: 'application/pdf' })
}

/**
 * @param {{name:string, format?:string, meta?:string, summary?:{label:string,value:any}[], headers:string[], rows:any[][]}} report
 * @param {string} [formatOverride] 'PDF' | 'Excel' | 'CSV'
 */
export function downloadReport(report, formatOverride) {
    const format = formatOverride || report.format
    const base = String(report.name).replace(/\s+/g, '_')
    const { headers, rows } = report
    if (format === 'PDF') {
        const lines = [
            ...(report.meta ? [report.meta, ''] : []),
            ...(report.summary || []).map((s) => `${s.label}: ${s.value}`),
            ...((report.summary || []).length ? [''] : []),
            headers.join('  |  '),
            ...rows.map((r) => r.join('  |  ')),
        ]
        saveBlob(base + '.pdf', buildPdf(report.name, lines))
    } else if (format === 'Excel') {
        const table = `<table><tr>${headers.map((h) => `<th>${escHtml(h)}</th>`).join('')}</tr>${rows
            .map((r) => `<tr>${r.map((c) => `<td>${escHtml(c)}</td>`).join('')}</tr>`)
            .join('')}</table>`
        const html = `<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"></head><body>${table}</body></html>`
        saveBlob(base + '.xls', new Blob(['﻿' + html], { type: 'application/vnd.ms-excel' }))
    } else {
        const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
        saveBlob(base + '.csv', new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }))
    }
}
