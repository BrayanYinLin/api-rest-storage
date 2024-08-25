import { Router } from 'express'
import { Storage } from '../models/local.js'
import { UnauthorizedAction } from '../utils/error_factory.js'
import { checkRecord } from '../schemas/records.js'

const recordRoute = Router()

recordRoute.get('/', async (_, res) => {
  try {
    const records = await Storage.getAllRecords()
    res.json(records)
  } catch (e) {
    console.error(e.message)
    res.status(400).json({ msg: 'There was an error' })
  }
})

recordRoute.post('/', async (req, res) => {
  try {
    if (!req.session.user) {
      throw new UnauthorizedAction('Forbbiden to access records')
    }
    const { productId, userId, recordTypeId, recordQuantity, recordDate } =
      req.body

    const { data, error } = checkRecord({
      productId,
      userId,
      recordTypeId,
      recordQuantity,
      recordDate
    })
    if (error) return res.status(422).json({ msg: error })
    const newRecord = await Storage.createRecord({
      productId: data.producId,
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
      console.error(e.message)
    }
  }
})

export default recordRoute
