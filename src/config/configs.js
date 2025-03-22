import dotenv from "dotenv"
dotenv.config()

export default {
    db_connectionString: process.env.PG_CONNSTR,
    jwt_secret: process.env.JWT_KEY
}