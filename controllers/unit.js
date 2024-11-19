import { UnauthorizedAction } from '../utils/error_factory.js'
import loadStorage from '../utils/dynamic_import.js'

export default class Unit {
  static getAllUnits = async (req, res) => {
    try {
      const { Storage } = await loadStorage()
      if (!req.session.user) {
        throw new UnauthorizedAction('Forbidden Action: Get products')
      }

      const units = await Storage.getAllUnits()

      return res.json(units)
    } catch (e) {
      if (e instanceof UnauthorizedAction) {
        return res.status(401).json({ msg: e.message })
      } else {
        console.error(e.message)
        return res.status(400).json({ msg: e.message })
      }
    }
  }
}
