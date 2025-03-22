import db from "../models/database.js"
import bcrypt from "bcrypt"

export default {
    async findUser (username) {
        const result = await db.query(`SELECT * FROM users WHERE username = '${username}'`)
        return {rowCount: result.rowCount, rows: result.rows}
    },
    async createUser (username, password) {
        const pass = await bcrypt.hash(password, 10)
        const result = await db.query(`INSERT INTO users (username, password) VALUES ('${username}', '${pass}') RETURNING *`)
        return result
    }
}

