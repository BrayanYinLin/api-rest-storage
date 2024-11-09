import { utils, write } from 'xlsx'

export default function createReportBase64({ data, month }) {
  const workbook = utils.book_new()
  const worksheet = utils.json_to_sheet(data)

  const headerCellStyle = {
    fill: { fgColor: { rgb: 'FFCCCC00' } },
    font: { bold: true, sz: 12 },
    alignment: { vertical: 'center', horizontal: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } }
    }
  }
  const headerRange = utils.decode_range(worksheet['!ref'])

  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    const cellAddress = utils.encode_cell({ c: col, r: 0 })
    if (!worksheet[cellAddress]) continue
    worksheet[cellAddress].s = headerCellStyle
  }

  const columnWidths = data.reduce((widths, row) => {
    Object.keys(row).forEach((key, index) => {
      const valueLength = row[key] ? row[key].toString().length * 1.5 : 10
      widths[index] = Math.max(widths[index] || 10, valueLength + 5)
    })
    return widths
  }, [])

  worksheet['!cols'] = columnWidths.map((width) => ({ wch: width }))

  utils.book_append_sheet(workbook, worksheet, `Reporte Mes ${month}`)

  const buffer = write(workbook, { bookType: 'xlsx', type: 'buffer' })

  return buffer
}
