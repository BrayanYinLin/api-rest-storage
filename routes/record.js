import { Router } from 'express'
import RecordController from '../controllers/record.js'

const recordRoute = Router()

recordRoute.get('/incomes', RecordController.getIncomeRecords)
recordRoute.get('/expenses', RecordController.getExpensesRecords)

recordRoute.post('/', RecordController.createRecord)

export default recordRoute
