import { Router } from 'express'
import { Storage } from '../models/local.js'

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

recordRoute.post('/', async (req, res) => {})

export default recordRoute
