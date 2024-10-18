import pool from '../config/db.js'

export async function getBooks(req, res){
    try {
        const [rows] = await pool.query('SELECT * FROM book')

        res.json(rows)
    }catch (error){
        res.status(500).json({message: error.message})
    }
}