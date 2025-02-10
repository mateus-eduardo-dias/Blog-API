import { DataBaseControl } from "./files/dbc.js";
const dbc = new DataBaseControl()

import { User } from "./endpoints/user.js";
const userCommands = new User()

import { Blog } from "./endpoints/blog.js";
const blogCommands = new Blog()

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
    const response = await userCommands.createUser(req.body, client, dbc, jwt)
    res.statusCode = response.code
    res.end(response.response)
})

app.post('/auth/login', async (req, res) => { // ACCOUNT - LOGIN
    /* Body expected
    {
        "username": "...",
        "password": "..."
    }
    */
    res.contentType('application/json')
    const response = await userCommands.enterUser(req.body, client, dbc, jwt)
    res.statusCode = response.code
    res.end(response.response)
})

app.post('/blogs', async (req, res) => { // POST - CREATE
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
    const response = await blogCommands.createPost(req.body, client, dbc, jwt, req.get('Authorization'))
    res.statusCode = response.code
    res.end(response.response)
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