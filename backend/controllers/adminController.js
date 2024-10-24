import pool from '../config/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function createUser(req, res){
    try{
        const { firstName, lastName, email, phoneNum, userType, password } = req.body;

        if(!firstName || !lastName || !email || !userType || !password){
            res.status(400).json({message: "First Name, Last Name, Email, User Type, and Password are required"})
        }

        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
        if(existingUser > 0){
            res.status(400).json({message: "Email already registered"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const [result] = await pool.query('INSERT INTO users (firstName, lastName, email, phoneNum, userType, password) VALUES (?, ?, ?, ?, ?, ?)',
            [firstName, lastName, email, phoneNum || null, userType, hashedPassword]
        );

        res.status(201).json({message: "User created successfully", userID: result.insertId, email})

    } catch (error){
        res.status(500).json({message: error.message})
    }
}
