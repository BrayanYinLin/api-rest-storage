import { utils, write } from 'xlsx'

export default function createReportBase64({ data, month }) {
  const workbook = utils.book_new()
  const worksheet = utils.json_to_sheet(data)

  const headerCellStyle = {
    fill: { fgColor: { rgb: 'FFCCCC00' } },
    font: { bold: true }
  }
  const headerRange = utils.decode_range(worksheet['!ref'])

  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    const cellAddress = utils.encode_cell({ c: col, r: 0 })
    if (!worksheet[cellAddress]) continue
    worksheet[cellAddress].s = headerCellStyle
  }

  utils.book_append_sheet(workbook, worksheet, `Reporte Mes ${month}`)

  const buffer = write(workbook, { bookType: 'xlsx', type: 'buffer' })

  return buffer
}
