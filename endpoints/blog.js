export class Blog{
    constructor() {
        this.schemaUserJson = JSON.stringify(['username', 'password', 'iat', 'nbf', 'exp', 'iss'])
        this.schemaBlogJson = JSON.stringify(['title', 'content', 'username'])
    }
    async createPost(body, client, dbc, jwt, authHeader) {
        if (JSON.stringify(Object.keys(body)) != this.schemaBlogJson) {
            return {
                code: 400,
                response: JSON.stringify({'error': 'REQUEST_FAILURE', 'message': 'Invalid information or pattern recieved', 'code':10})
            }
        }
        if (authHeader == undefined) { /* Auth header don't exist */
            return {
                code: 401,
                response: JSON.stringify({'error': 'AUTH_FAILURE', 'message':'No authentication was recieved', 'code':1})
            }
        }
        const authInfo = authHeader.split(' ')
        const authType = authInfo[0]
        if (authType != 'Bearer') { /* Wrong Auth type */
            return {
                code: 403,
                response: JSON.stringify({'error': 'AUTH_FAILURE', 'message':'Wrong authentication method was recieved', 'code':2})
            }
        }
        const token = authInfo[1]
        jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
            if (err) {
                return {
                    code: 401,
                    response: JSON.stringify({'error': 'AUTH_FAILURE', 'message': 'Invalid Token - Fake Token', 'code':3})
                }
            }
            if (JSON.stringify(Object.keys(decoded)) != this.schemaUserJson) {
                return {
                    code: 401,
                    response: JSON.stringify({'error': 'AUTH_FAILURE', 'message': 'Invalid Token - Fake Token', 'code':3})
                }
            } else if (!(await dbc.searchToken(token, client))) {
                return {
                    code: 401,
                    response: JSON.stringify({'error': 'AUTH_FAILURE', 'message': 'Invalid Token - Fake Token', 'code':3})
                }
            } else if (decoded.username != body.username) {
                return {
                    code: 400,
                    response: JSON.stringify({'error': 'AUTH_FAILURE', 'message': 'Invalid Token - Token has differente information', 'code':6})
                }
            }
            else if (await dbc.userExists(decoded, client)){
                try {
                    await dbc.createPost(body, client)
                } catch {
                    return {
                        code: 500,
                        response: JSON.stringify({'error': 'SERVER_FAILURE', 'message': 'Unknown error when creating', 'code':4})
                    }
                }
                return {
                    code: 200,
                    response: JSON.stringify({'status':true})
                }
            } else {
                return {
                    code: 404,
                    response: JSON.stringify({'error': 'AUTH_FAILURE', 'message': 'Invalid Token - User not found', 'code':5})
                }
            }
        })
    }
}