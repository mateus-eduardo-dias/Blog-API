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
const client = new Client({connectionString:process.env.DB_STR})
await client.connect()
const schemaUserJson = JSON.stringify(['username', 'password'])

app.use(express.json())

app.get('/blogs', async (req, res) => { // READ POST
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

app.post('/user', async (req, res) => { // CREATE ACCOUNT
    res.contentType('application/json')
    const body = req.body
    if (JSON.stringify(Object.keys(body)) != schemaUserJson) {
        res.statusCode = 400
        res.end(JSON.stringify({'error': 'REQUEST_FAILURE', 'message': 'Invalid information or pattern recieved', 'code':10}))
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
            return;
        }
        
        const token = jwt.sign(JSON.stringify(body), process.env.JWT_KEY)
        res.statusCode = 200
        res.end(JSON.stringify({'status':true, 'token':token}))
        return;
    }
})

app.post('/blogs', (req, res) => { // CREATE POSTS
    res.contentType('application/json')
    const body = req.body
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
        if (err || JSON.stringify(Object.keys(decoded)) != schemaUserJson) {
            res.statusCode = 401
            res.end(JSON.stringify({'error': 'AUTH_FAILURE', 'message': 'Invalid Token - Fake Token', 'code':3}))
            return;
        }
        else if (await dbc.userExists(decoded, client)){
            try {
                dbc.createPost(body, client)
            } catch {
                res.statusCode = 500
                res.end(JSON.stringify({'error': 'SERVER_FAILURE', 'message': 'Unknown error when creating', 'code':4}))
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

app.listen(PORT, () => {
    console.log(`Server on -> Port: ${PORT}`)
})