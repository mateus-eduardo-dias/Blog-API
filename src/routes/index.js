import express from "express"
import authR from "./authRoutes.js"
const routes = express.Router()

routes.use('/v1/auth', authR)

export default routes