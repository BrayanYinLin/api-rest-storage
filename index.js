import express from 'express'
import userRoute from './routes/user.js'
import 'dotenv/config'

const port = process.env.PORT ?? 3000
const app = express()

app.use(express.json())
app.use('/api/user', userRoute)
app.disable('x-powered-by')

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
