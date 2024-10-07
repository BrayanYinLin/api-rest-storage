import { Router } from 'express'
import Report from '../controllers/report.js'

const reportRoute = Router()

reportRoute.get('/', Report.getReport)
