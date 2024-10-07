import { Storage } from '../models/local.js'
import createReportBuffer from '../utils/create_report.js'

export default class Report {
  static getReport = async (req, res) => {
    try {
      const { month, year } = req.query
      const resume = await Storage.getResumeByMonth({
        month,
        year
      })

      const reportExcelBuffer = createReportBuffer(resume)

      res.json(resume)
    } catch (e) {
      console.error(e)
    }
  }
}
