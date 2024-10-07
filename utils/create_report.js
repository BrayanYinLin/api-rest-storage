import { utils, write } from 'xlsx'

export default function createReportBuffer({ data, month }) {
  const workbook = utils.book_new()
  const worksheet = utils.aoa_to_sheet(data)

  utils.book_append_sheet(workbook, worksheet, `Reporte Mes ${month}`)

  const buffer = write(workbook, { bookType: 'xlsx', type: 'buffer' })

  return buffer
}
