import { UnauthorizedAction } from '../utils/error_factory.js'
import { checkRecord } from '../schemas/records.js'
import { Storage } from '../models/local.js'

export default class RecordController {
  static getIncomeRecords = async (req, res) => {
    try {
      if (!req.session.user) {
        throw new UnauthorizedAction('Unauthorized Action: Get Income records')
      }

      const records = await Storage.getIncomeRecords()
      res.json(records)
    } catch (e) {
      console.error(e.message)
      res.status(400).json({ msg: 'There was an error' })
    }
  }

  static getExpensesRecords = async (req, res) => {
    try {
      if (!req.session.user) {
        throw new UnauthorizedAction('Unauthorized Action: Get Income records')
      }

      const records = await Storage.getExpensesRecords()
      res.json(records)
    } catch (e) {
      console.error(e.message)
      res.status(400).json({ msg: 'There was an error' })
    }
  }

  static createRecord = async (req, res) => {
    try {
      if (!req.session.user) {
        throw new UnauthorizedAction('Forbbiden to access records')
      }
      const { productId, userId, recordTypeId, recordQuantity, recordDate } =
        req.body

      const { data, error } = checkRecord({
        productId: Number(productId),
        userId,
        recordTypeId,
        recordQuantity,
        recordDate
      })

      if (error) return res.status(422).json({ msg: error })
      const newRecord = await Storage.createRecord({
        productId: data.productId,
        userId: data.userId,
        recordTypeId: data.recordTypeId,
        recordQuantity: data.recordQuantity,
        recordDate: data.recordDate
      })

      res.json(newRecord)
    } catch (e) {
      if (e.message === 'Forbbiden to access records') {
        res.status(403).json({ msg: e.message })
      } else {
        res.status(403).json({ msg: e.message })
      }
    }
  }
}
