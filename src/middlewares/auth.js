import verifiers from "./verifiers.js"

export default {
    verifyAuth(req, res, next) {
        const endpoint = req.originalUrl
        const body = req.body
        switch (endpoint) {
            case '/api/v1/auth/signin':
            case '/api/v1/auth/signup':
                if (verifiers.verifyAuthBody(body, 'uAuth')) {
                    next({'authType':'body', 'values': body})
                } else {
                    next({'error':true, 'expected':true, 'statusCode': 401, 'info':'Auth type invalid', 'code':'A4'})
                }
                break;
            default:
                next({'error':true, 'expected':true, 'statusCode': 500, 'info':'Server Error', 'code':'SE0'})
        }
    }
}