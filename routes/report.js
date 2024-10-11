import { Router } from 'express'
import Report from '../controllers/report.js'

const reportRoute = Router()

reportRoute.get('/expenses', Report.getExpensesReport)
reportRoute.get('/incomes', Report.getIncomesReport)

export default reportRoute
