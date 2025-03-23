import jwt from "jsonwebtoken"
import configs from "../config/configs.js"
import tokenSchemes from "../models/tokenSchemes.js"
import bodySchemes from "../models/bodySchemes.js"

export default {
    tokenValidation(token) {
        try {
            const message = jwt.verify(token, configs.jwt_secret, {'issuer':'blog-api'})
            if (message.type) {
                if (Object.keys(message).length == tokenSchemes[message.type].length) {
                    let equal = true
                    Object.keys(message).forEach((key, i) => {
                        if (key != tokenSchemes[message.type][i]) {
                            equal = false
                        }
                    })
                    if (equal) {
                        return {'status': 'success', 'values': message}
                    } else {
                        return {'status': 'error', 'expected':true, 'statusCode': 401, 'info':'Token invalid - Pattern is not expected', 'code':'A7'}
                    }
                } else {
                    return {'status': 'error', 'expected':true, 'statusCode': 401, 'info':'Token invalid - Pattern is not expected', 'code':'A7B'}
                }
            } else {
                return {'status': 'error', 'expected':true, 'statusCode': 401, 'info':'Token invalid - No type detected', 'code':'A8'}
            }
        } catch (error) {
            switch (error.name) {
                case "JsonExpiredError":
                    return {'status': 'error', 'expected':true, 'statusCode': 401, 'info':'Token expired', 'code':'A9'}
                case "JsonWebTokenError":
                    return {'status': 'error', 'expected':true, 'statusCode': 401, 'info':'Token invalid', 'code':'A10'}
                default:
                    return {'status': 'error', 'expected':false, 'statusCode': 400, 'info':error.name, 'code':'U1'}
            }
        }
    },
    bodyValidation(body, schema) {
        const activeScheme = bodySchemes[schema]
        if (activeScheme == undefined) return false
        let equal = true
        for (let i = 0; i < activeScheme.length; i++) {
            if (body[activeScheme[i]] == undefined) {
                equal = false
            }
        }
        return equal
    }
}