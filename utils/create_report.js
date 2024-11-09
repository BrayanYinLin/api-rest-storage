import Excel from 'exceljs'

export default async function createReportBase64({ data, month }) {
  const { Workbook } = Excel
  const workbook = new Workbook()
  workbook.creator = 'Brayan Yin Lin'
  const worksheet = workbook.addWorksheet(`Reporte Mes ${month}`)
  worksheet.columns = [
    { header: 'Producto', key: 'producto', width: 35 },
    { header: 'Unidad de Medida', key: 'unidad', width: 30 },
    { header: 'Cantidad', key: 'cantidad', width: 10 },
    { header: 'Fecha', key: 'fecha', width: 12 }
  ]

  const mappedData = data.map((record) => Object.values(record))

  worksheet.addTable({
    name: 'ReporteTable',
    ref: 'A1',
    headerRow: true,
    style: {
      theme: 'TableStyleMedium8',
      showRowStripes: true
    },
    columns: [
      { key: 'producto', name: 'Producto' },
      { key: 'unidad', name: 'Unidad de Medida' },
      { key: 'cantidad', name: 'Cantidad' },
      { key: 'fecha', name: 'Fecha' }
    ],
    rows: mappedData
  })

  const buffer = await workbook.xlsx.writeBuffer()

  return buffer
}
