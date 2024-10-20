import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false  // This bypasses the SSL validation
      }
})

export default pool