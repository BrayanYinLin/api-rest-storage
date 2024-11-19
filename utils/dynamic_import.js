import 'dotenv/config'

export default async function loadStorage() {
  if (process.env.ENV === 'PRODUCTION') {
    return import('../models/database.js')
  } else {
    return import('../models/local.js')
  }
}
