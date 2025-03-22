import express from "express"
import userController from "../controllers/userController.js"
import auth from "../middlewares/auth.js"
const routes = express.Router()

routes.get('/signin', auth.verifyAuth, userController.Signin) // GET /api/v1/auth/signin
routes.get('/test', auth.verifyAuthBody)
routes.post('/signup', auth.verifyAuth, userController.Signup)

export default routes