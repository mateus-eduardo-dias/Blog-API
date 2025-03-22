import express from "express"
import routes from "./routes/index.js"
import errHandling from "./middlewares/errorHanding.js"
const app = express()

app.use(express.json())

app.use('/api', routes)

app.use(errHandling)

export default app