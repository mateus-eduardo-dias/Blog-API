export class DataBaseControl {
    async userExists(information, client) {
        const username = information.username
        const password = information.password
        let query = ''
        if (password) {
            query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`
        } else {
            query = `SELECT * FROM users WHERE username = '${username}'`
        }
        const result = await client.query(query)
        if (result.rows.length == 1) {
            return true
        } else {
            return false
        }
    }
    async createUser(information, client) {
        const username = information.username
        const password = information.password
        const query = `INSERT INTO users(username, password) VALUES ('${username}', '${password}')`
        await client.query(query)
    }
    async createPost(information, client) {
        const title = information.title
        const content = information.content
        const username = information.username
        const query = `INSERT INTO blogs(title, content, username) VALUES ('${title}', '${content}', '${username}')`
        await client.query(query)
    }
}