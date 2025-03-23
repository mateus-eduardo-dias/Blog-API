import validations from "../utils/validation.js"

export default {
    verifyAuthToken(req, res, next) {
        const authHeader = req.headers.authorization
        if (authHeader) {
            const auth = authHeader.split(" ")
            const authType = auth[0]
            const token = auth[1]
            if (authType == "Bearer") {
                const valid = validations.tokenValidation(token)
                if (valid.status == 'success') {
                    return {'token': token, 'decoded': valid.values}
                } else {
                    return {
                        'error': true, 'expected':valid.expected, 'statusCode': valid.statusCode, 
                        'info':valid.info, 'code':valid.code
                    }
                }
            } else {
                return {'error':true, 'expected':true, 'statusCode': 401, 'info':'Auth type invalid', 'code':'A5'}
            }
        } else {
            return {'error':true, 'expected':true, 'statusCode': 401, 'info':'No authentication recieved', 'code':'A6'}
        }
    },
    verifyAuthBody(body, bodySchema) {
        return validations.bodyValidation(body, bodySchema)
    }
}