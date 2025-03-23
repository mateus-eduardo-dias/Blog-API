import express from "express"
import userController from "../controllers/userController.js"
import auth from "../middlewares/auth.js"
const routes = express.Router()

routes.get('/signin', auth.verifyAuth, userController.Signin)  // GET  /api/v1/auth/signin
routes.post('/signup', auth.verifyAuth, userController.Signup) // POST /api/v1/auth/signup

export default routes