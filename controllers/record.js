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
      if (!res.session.user) {
        throw new UnauthorizedAction('Cannot GET most consumed products')
      }
      const lastRecords = await Storage.getMostConsumedProduct()

      res.json(lastRecords)
    } catch (e) {
      if (e instanceof UnauthorizedAction) {
        res.status(401).json({ msg: 'There was an error' })
      } else {
        res.status(400).json({ msg: 'Cannot access to this endpoint' })
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

  static getAllRecords = async (req, res) => {
    try {
      if (!req.session.user) {
        throw new UnauthorizedAction('Unauthorized Action: Get Income records')
      }

      const records = await Storage.getAllRecords()
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
      const {
        product_id,
        user_id,
        record_type_id,
        record_quantity,
        record_date
      } = req.body

      const { data, error } = checkRecord({
        product_id: Number(product_id),
        user_id: Number(user_id),
        record_type_id: Number(record_type_id),
        record_quantity: Number(record_quantity),
        record_date
      })

      if (error) return res.status(422).json({ msg: error })
      const newRecord = await Storage.createRecord({
        product_id: data.product_id,
        user_id: data.user_id,
        record_type_id: data.record_type_id,
        record_quantity: data.record_quantity,
        record_date: data.record_date
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
          record_id: req.params.id,
          ...req.body
        }
      })
      const updatedRecord = await Storage.updateRecord(checkRecord.data)

      return updatedRecord
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
