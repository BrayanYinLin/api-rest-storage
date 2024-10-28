import { Router } from 'express'
import Unit from '../controllers/unit.js'

const unitsRoute = Router()

unitsRoute.get('/all', Unit.getAllUnits)

export default unitsRoute
