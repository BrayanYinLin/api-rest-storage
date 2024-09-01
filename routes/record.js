import { Router } from 'express'
import RecordController from '../controllers/record.js'

const recordRoute = Router()

recordRoute.get('/incomes', RecordController.getIncomeRecords)
recordRoute.get('/expenses', RecordController.getExpensesRecords)
recordRoute.get('/all', RecordController.getAllRecords)
recordRoute.put('/:id', RecordController.updateRecord)

recordRoute.post('/', RecordController.createRecord)

export default recordRoute
