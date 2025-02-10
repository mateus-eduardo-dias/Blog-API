export class User{
    constructor() {
        this.schemaUserSimplifiedJson = JSON.stringify(['username', 'password'])
    }
    async createUser(body, client, dbc, jwt) {
        if (JSON.stringify(Object.keys(body)) != this.schemaUserSimplifiedJson) {
            return {
                code: 400,
                response: JSON.stringify({'error': 'REQUEST_FAILURE', 'message': 'Invalid information or pattern recieved', 'code':10})
            }
        } if (await dbc.userExists({username:body.username}, client))  {
            return {
                code: 409,
                response: JSON.stringify({'error': 'REQUEST_FAILURE', 'message': 'User exists', 'code':11})
            }
        } else {
            try {
                await dbc.createUser(body, client)
            } catch {
                return {
                    code: 500,
                    response: JSON.stringify({'error': 'SERVER_FAILURE', 'message': 'Unknown error when creating', 'code':4})
                }
            }
            const agora = Math.floor(Date.now() / 1000)
            const exp = agora + Number(process.env.JWT_EXP)
            const payload = JSON.stringify({
                "username": body.username,
                "password": body.password,
                "iat": agora,
                "nbf": agora,
                "exp": exp,
                "iss": process.env.JWT_ISSUER
            })
            const token = jwt.sign(payload, process.env.JWT_KEY)
            try {
                await dbc.saveToken(token, exp, client)
            } catch (err){
                return {
                    code: 500,
                    response: JSON.stringify({'error': 'SERVER_FAILURE', 'message': 'Unknown error when creating', 'code':4})
                }
            }
            return {
                code: 200,
                response: JSON.stringify({'status':true, 'token':token})
            }
        }
    }
    async enterUser(body, client, dbc, jwt) {
        if (JSON.stringify(Object.keys(body)) != this.schemaUserSimplifiedJson) {
            return {
                code: 400,
                response: JSON.stringify({'error': 'REQUEST_FAILURE', 'message': 'Invalid information or pattern recieved', 'code':10})
            }
        }
        if (!(await dbc.userExists({username: body.username}, client))) {
            return {
                code: 404,
                response: JSON.stringify({'error': 'AUTH_FAILURE', 'message': 'User not found', 'code':7})
            }
        } else if (!(await dbc.userExists(body, client))) {
            return {
                code: 401,
                response: JSON.stringify({'error': 'AUTH_FAILURE', 'message': 'Incorrect password', 'code':8})
            }
        } else {
            const agora = Math.floor(Date.now() / 1000)
            const exp = agora + Number(process.env.JWT_EXP)
            const payload = JSON.stringify({
                "username": body.username,
                "password": body.password,
                "iat": agora,
                "nbf": agora,
                "exp": exp,
                "iss": process.env.JWT_ISSUER
            })
            const token = jwt.sign(payload, process.env.JWT_KEY)
            try {
                await dbc.saveToken(token, exp, client)
            } catch {
                return {
                    code: 500,
                    response: JSON.stringify({'error': 'SERVER_FAILURE', 'message': 'Unknown error when creating', 'code':4})
                }
            }
            return {
                code: 200,
                response: JSON.stringify({'status':true, 'token':token})
            }
        }
    }
}