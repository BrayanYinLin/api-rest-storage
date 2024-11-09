import { Storage } from '../models/local.js'
import createReportBase64 from '../utils/create_report.js'
import { UnauthorizedAction } from '../utils/error_factory.js'
import getMonth from '../utils/get_month.js'

export default class Report {
  static getExpensesReport = async (req, res) => {
    try {
      if (!req.session.user) {
        throw new UnauthorizedAction('Forbbiden for creating reports')
      }
      const { month, year } = req.query
      const resume = await Storage.getExpensesResumeByMonth({
        month,
        year
      })

      const requestMonth = getMonth({ index: Number(month), lang: 'es-ES' })
      const excelBuffer = await createReportBase64({
        data: resume,
        month: requestMonth
      })

      res.setHeader('Content-Disposition', 'attachment; filename=datos.xlsx')
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )

      res.send(excelBuffer)
    } catch (e) {
      res.status(400).json({ msg: e.message })
    }
  }

  static getIncomesReport = async (req, res) => {
    try {
      if (!req.session.user) {
        throw new UnauthorizedAction('Forbbiden for creating reports')
      }
      const { month, year } = req.query
      const resume = await Storage.getIncomesResumeByMonth({
        month,
        year
      })

      const requestMonth = getMonth({ index: Number(month), lang: 'es-ES' })
      const excelBuffer = await createReportBase64({
        data: resume,
        month: requestMonth
      })

      res
        .set({
          'Content-Disposition': `attachment; filename=Reporte_${requestMonth}.xlsx`,
          'Content-Type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        .send(excelBuffer)
    } catch (e) {
      console.error(e)
      res.status(400).json({ msg: e.message })
    }
  }
}
