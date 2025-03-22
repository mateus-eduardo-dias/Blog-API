import configs from "../config/configs.js"

import pg from "pg"
const {Client} = pg
const client = new Client({connectionString:configs.db_connectionString})
await client.connect((err) => {
    if (err) {
        console.warn("Error when deploying database")
        throw err
    }
    console.log("Database on")
})

export default client