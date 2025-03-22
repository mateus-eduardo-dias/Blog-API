import express from "express"
import authUsers from "./authRoutes.js"
const routes = express.Router()

routes.use('/v1/auth', authUsers)

export default routes