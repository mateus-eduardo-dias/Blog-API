import userSvc from "../services/userServices.js"
import configs from "../config/configs.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export default {
    async Signin (auth, req, res, next)  {
        if (auth.error) {
            next(auth)
        } else if (auth.authType == 'body') {
            const body = auth.values
            const user = await userSvc.findUser(body.username)
            if (user.rowCount == 1) {
                if (bcrypt.compareSync(body.password, user.rows[0].password)) {
                    const payload = {
                        'type': 'uAuth',
                        'username': body.username,
                        'password': user.rows[0].password,
                        'iss': 'blog-api',
                        'exp': (Date.now() / 1000) + (60 * 60 * 24)
                    }
                    const token = jwt.sign(payload, configs.jwt_secret)
                    res.send(JSON.stringify({'token': token}))
                } else {
                    next({'error':true, 'expected':true, 'statusCode': 401, 'info':'Password is incorrect', 'code':'A0'})
                }
            } else {
                next({'error':true, 'expected':true, 'statusCode': 404, 'info':'User not found', 'code':'NF0'})
            }
        } else if (auth.authType == 'token') {
            next({'error':true, 'expected':true, 'statusCode': 400, 'info':'Authorization not required', 'code':'A1'})
        } else {
            next({'error':true, 'expected':true, 'statusCode': 400, 'info':'Auth Type is wrong', 'code':'A2'})
        }
    },
    async Signup (auth, req, res, next) {
        if (auth.authType == 'body') {
            const body = auth.values
            const user = await userSvc.findUser(body.username)
            if (user.rowCount == 0) {
                const added = await userSvc.createUser(body.username, body.password)
                if (added.rowCount == 1) {
                    const payload = {
                        'type': 'uAuth',
                        'username': body.username,
                        'password': added.rows[0].password,
                        'iss': 'blog-api',
                        'exp': (Date.now() / 1000) + (60 * 60 * 24)
                    }
                    const token = jwt.sign(payload, configs.jwt_secret)
                    res.send(JSON.stringify({'token': token}))
                } else {
                    return {'status': 'error', 'expected':false, 'statusCode': 500, 'code':'U0'}
                }
            } else {
                next({'error':true, 'expected':true, 'statusCode': 409, 'info':'User exists', 'code':'I0'})
            }
        } else if (auth.authType == 'token') {
            next({'error':true, 'expected':true, 'statusCode': 400, 'info':'Authorization not required', 'code':'A1B'})
        } else {
            next({'error':true, 'expected':true, 'statusCode': 400, 'info':'Auth Type is wrong', 'code':'A3'})
        }
    }
}
