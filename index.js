import { DataBaseControl } from "./files/dbc.js";
const dbc = new DataBaseControl()

import pg from "pg";
import express from "express"
import dotenv from "dotenv";
import JsonWebTokenError from "jsonwebtoken";
const jwt = JsonWebTokenError

dotenv.config()
const app = express()
const PORT = 8080

const { Client } = pg
let client = new Client({connectionString:process.env.DB_STR})
await client.connect()
const schemaUserJson = JSON.stringify(['username', 'password', 'iat', 'nbf', 'exp', 'iss'])
const schemaUserSimplifiedJson = JSON.stringify(['username', 'password'])
const schemaBlogJson = JSON.stringify(['title', 'content', 'username'])

async function connectionError(err) {
    if (err.message == 'Connection terminated unexpectedly') {
        console.log("connection lost")
        client = new Client({connectionString:process.env.DB_STR})
        await client.connect()
        client.on('error', (err) => connectionError(err))
        console.log("reconnected")
    }
}

client.on('error', (err) => connectionError(err))


app.use(express.json())

app.post('/auth/register', async (req, res) => { // ACCOUNT - CREATE
    /* Body expected
    {
        "username": "...",
        "password": "..."
    }
    */
    res.contentType('application/json')
    const body = req.body
    console.log(body)
    if (JSON.stringify(Object.keys(body)) != schemaUserSimplifiedJson) {
        res.statusCode = 400
        res.end(JSON.stringify({'error': 'REQUEST_FAILURE', 'message': 'Invalid information or pattern recieved', 'code':10}))
        console.log(body)
        return;
    }
    if (await dbc.userExists({username:body.username}, client))  {
        res.statusCode = 409
        res.end(JSON.stringify({'error': 'REQUEST_FAILURE', 'message': 'User exists', 'code':11}))
        return;
    } else {
        try {
            await dbc.createUser(body, client)
        } catch {
            res.statusCode = 500
            res.end(JSON.stringify({'error': 'SERVER_FAILURE', 'message': 'Unknown error when creating', 'code':4}))
            console.log(err)
            return;
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
            res.statusCode = 500
            res.end(JSON.stringify({'error': 'SERVER_FAILURE', 'message': 'Unknown error when creating', 'code':4}))
            console.log(err)
            return;
        }
        res.statusCode = 200
        res.end(JSON.stringify({'status':true, 'token':token}))
        return;
    }
})

app.post('/auth/login', async (req, res) => { // ACCOUNT - LOGIN
    /* Body expected
    {
        "username": "...",
        "password": "..."
    }
    */
    res.contentType('application/json')
    const body = req.body
    if (JSON.stringify(Object.keys(body)) != schemaUserSimplifiedJson) {
        res.statusCode = 400
        res.end(JSON.stringify({'error': 'REQUEST_FAILURE', 'message': 'Invalid information or pattern recieved', 'code':10}))
        return;
    }
    if (!(await dbc.userExists({username: body.username}, client))) {
        res.statusCode = 404
        res.end(JSON.stringify({'error': 'AUTH_FAILURE', 'message': 'User not found', 'code':7}))
        return;
    } else if (!(await dbc.userExists(body, client))) {
        res.statusCode = 401
        res.end(JSON.stringify({'error': 'AUTH_FAILURE', 'message': 'Incorrect password', 'code':8}))
        return;
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
            res.statusCode = 500
            res.end(JSON.stringify({'error': 'SERVER_FAILURE', 'message': 'Unknown error when creating', 'code':4}))
            throw err
        }
        res.statusCode = 200
        res.end(JSON.stringify({'status':true, 'token':token}))
        return;
    }
})

app.post('/blogs', (req, res) => { // POST - CREATE
    /* Body expected
    {
        "title": "...",
        "content": "...",
        "username": "..."
    }
    */

    /* Header expected
    {
        "Authorization": "Bearer <JWT Token>"
    }
    */
    res.contentType('application/json')
    const body = req.body
    if (JSON.stringify(Object.keys(body)) != schemaBlogJson) {
        res.statusCode = 400
        res.end(JSON.stringify({'error': 'REQUEST_FAILURE', 'message': 'Invalid information or pattern recieved', 'code':10}))
        return;
    }
    const authHeader = req.get('Authorization')
    if (authHeader == undefined) { /* Auth header don't exist */
        res.statusCode = 401
        res.end(JSON.stringify({'error': 'AUTH_FAILURE', 'message':'No authentication was recieved', 'code':1}))
        return;
    }
    const authInfo = authHeader.split(' ')
    const authType = authInfo[0]
    if (authType != 'Bearer') { /* Wrong Auth type */
        res.statusCode = 403
        res.end(JSON.stringify({'error': 'AUTH_FAILURE', 'message':'Wrong authentication method was recieved', 'code':2}))
        return;
    }
    const token = authInfo[1]
    jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
        if (err) {res.statusCode = 401
            res.end(JSON.stringify({'error': 'AUTH_FAILURE', 'message': 'Invalid Token - Fake Token', 'code':3}))
            return;
        }
        if (JSON.stringify(Object.keys(decoded)) != schemaUserJson) {
            res.end(JSON.stringify({'error': 'AUTH_FAILURE', 'message': 'Invalid Token - Fake Token', 'code':3}))
            return;
        } else if (!(await dbc.searchToken(token, client))) {
            res.statusCode = 401
            res.end(JSON.stringify({'error': 'AUTH_FAILURE', 'message': 'Invalid Token - Fake Token', 'code':3}))
            return;
        } else if (decoded.username != body.username) {
            res.statusCode = 400
            res.end(JSON.stringify({'error': 'AUTH_FAILURE', 'message': 'Invalid Token - Token has differente information', 'code':6}))
            return;
        }
        else if (await dbc.userExists(decoded, client)){
            try {
                await dbc.createPost(body, client)
            } catch {
                res.statusCode = 500
                res.end(JSON.stringify({'error': 'SERVER_FAILURE', 'message': 'Unknown error when creating', 'code':4}))
                console.log(err)
                return;
            }
            res.statusCode = 200
            res.end(JSON.stringify({'status':true}))
            return;
        } else {
            res.statusCode = 404
            res.end(JSON.stringify({'error': 'AUTH_FAILURE', 'message': 'Invalid Token - User not found', 'code':5}))
            return;
        }
    })
})

app.get('/blogs', async (req, res) => { // POST - READ
    let limit = 10
    let page = 1
    if (req.get('information_length')) {
        limit = Number(req.headers["information_length"])
    }
    if (req.get('page_number')) {
        page = Number(req.headers["page_number"])
    }
    const offsetVal = (page - 1) * limit
    const result = (await client.query(`SELECT * FROM blogs LIMIT ${limit} OFFSET ${offsetVal}`)).rows
    res.contentType('application/json')
    res.end(JSON.stringify(result))
})


app.listen(PORT, () => {
    console.log(`Server on -> Port: ${PORT}`)
})