import { Router } from 'express'
import RecordController from '../controllers/record.js'

const recordRoute = Router()

recordRoute.get('/income', RecordController.getIncomeRecords)
recordRoute.get('/outcome', RecordController.getOutcomesRecords)

recordRoute.post('/outcome', RecordController.createOutcome)
recordRoute.post('/income', RecordController.createIncome)

recordRoute.get('/all', RecordController.getAllRecords)
recordRoute.put('/:id', RecordController.updateRecord)
recordRoute.delete('/:id', RecordController.deleteRecord)

export default recordRoute
