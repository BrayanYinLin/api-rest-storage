import { UnauthorizedAction } from '../utils/error_factory.js'
import {
  checkDeleteId,
  checkRecord,
  checkUpdateRecord
} from '../schemas/records.js'
import { Storage } from '../models/local.js'

export default class RecordController {
  static getMostConsumedProducts = async (req, res) => {
    try {
      if (!req.session.user) {
        throw new UnauthorizedAction('Cannot GET most consumed products')
      }
      const lastRecords = await Storage.getMostConsumedProduct()

      res.json(lastRecords)
    } catch (e) {
      if (e instanceof UnauthorizedAction) {
        res.status(401).json({ msg: 'There was an error' })
      } else {
        res.status(400).json({ msg: e.message })
      }
    }
  }

  static getMostEnteredProducts = async (req, res) => {
    try {
      if (!req.session.user) {
        throw new UnauthorizedAction('Cannot GET most consumed products')
      }

      const lastRecords = await Storage.getMostEnteredProduct()

      res.json(lastRecords)
    } catch (e) {
      if (e instanceof UnauthorizedAction) {
        res.status(401).json({ msg: 'Cannot access to this endpoint' })
      } else {
        res.status(400).json({ msg: e.message })
      }
    }
  }

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

  static getOutcomesRecords = async (req, res) => {
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

  static getAllRecords = async (req, res) => {
    try {
      if (!req.session.user) {
        throw new UnauthorizedAction('Unauthorized Action: Get Income records')
      }

      const records = await Storage.getAllRecords()
      res.json(records)
    } catch (e) {
      res.status(400).json({ msg: e.message })
    }
  }

  static createOutcome = async (req, res) => {
    try {
      if (!req.session.user) {
        throw new UnauthorizedAction('Forbbiden to access records')
      }
      const { productId, userId, quantity, date } = req.body

      const { data, error } = checkRecord({
        productId: Number(productId),
        userId: Number(userId),
        recordQuantity: Number(quantity),
        recordDate: date
      })

      if (error) return res.status(422).json({ msg: error })
      const newRecord = await Storage.createOutcomeRecord({
        productId: data.productId,
        userId: data.userId,
        recordQuantity: data.recordQuantity,
        recordDate: data.recordDate
      })

      res.json(newRecord)
    } catch (e) {
      if (e instanceof UnauthorizedAction) {
        res.status(403).json({ msg: e.message })
      } else {
        res.status(400).json({ msg: e.message, name: e.name })
      }
    }
  }

  static createIncome = async (req, res) => {
    try {
      if (!req.session.user) {
        throw new UnauthorizedAction('Forbbiden to access records')
      }
      const { productId, userId, quantity, date } = req.body

      const { data, error } = checkRecord({
        productId: Number(productId),
        userId: Number(userId),
        recordQuantity: Number(quantity),
        recordDate: date
      })

      if (error) return res.status(422).json({ msg: error })
      const newRecord = await Storage.createIncomeRecord({
        productId: data.productId,
        userId: data.userId,
        recordQuantity: data.recordQuantity,
        recordDate: data.recordDate
      })
      res.json(newRecord)
    } catch (e) {
      if (e instanceof UnauthorizedAction) {
        res.status(403).json({ msg: e.message })
      } else {
        res.status(400).json({ msg: e.message, name: e.name })
      }
    }
  }

  static updateRecord = async (req, res) => {
    try {
      if (!req.session.user) {
        throw new UnauthorizedAction('Unauthorized Action: Update Record')
      }
      const checkRecord = checkUpdateRecord({
        record: {
          recordId: Number(req.params.id),
          userId: Number(req.body.userId),
          productId: Number(req.body.productId),
          recordQuantity: Number(req.body.quantity),
          recordDate: req.body.date
        }
      })
      const updatedRecord = await Storage.updateRecord(checkRecord.data)

      return res.json(updatedRecord)
    } catch (e) {
      if (e instanceof UnauthorizedAction) {
        return res.status(401).json({ msg: e.message })
      } else {
        return res.status(400).json({ msg: e.message })
      }
    }
  }

  static deleteRecord = async (req, res) => {
    try {
      if (!req.session.user) {
        throw new UnauthorizedAction('Unauthorized Action: Delete Record')
      }
      const checkRecord = checkDeleteId({ id: Number(req.params.id) })
      const deletedRecord = await Storage.deleteRecord({
        id: checkRecord.data
      })

      return res.json(deletedRecord)
    } catch (e) {
      if (e instanceof UnauthorizedAction) {
        return res.status(401).json({ msg: e.message })
      } else {
        return res.status(400).json({ msg: e.message })
      }
    }
  }
}
