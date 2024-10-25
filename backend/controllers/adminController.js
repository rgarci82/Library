import pool from '../config/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function createAdmin(req, res){
    try{
        const { firstName, lastName, email, phoneNum, password } = req.body;

        if(!firstName || !lastName || !email || !password){
            res.status(400).json({message: "First Name, Last Name, Email, and Password are required"})
        }

        const [existingAdmin] = await pool.query('SELECT * FROM admin WHERE email = ?', [email])
        if(existingAdmin > 0){
            res.status(400).json({message: "Email already registered"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const [result] = await pool.query('INSERT INTO admin (firstName, lastName, email, phoneNum, password) VALUES (?, ?, ?, ?, ?)',
            [firstName, lastName, email, phoneNum || null, hashedPassword]
        );

        res.status(201).json({message: "Admin created successfully", AdminID: result.insertId, email})

    } catch (error){
        res.status(500).json({message: error.message})
    }
}

export async function loginAdmin(req, res){
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(401).json({message: "Email and password are required"})
        }

        const [row] = await pool.query('SELECT * FROM admin WHERE email = ?', [email])
        const admin = row[0]

        if(!admin){
            return res.status(404).json({message: "Invalid email or password"})
        }

        const validatePassword = await bcrypt.compare(password, admin.password)
        if(!validatePassword){
            return res.status(400).json({message: "Invalid email or password"})
        }

        const token = jwt.sign(
            {id: admin.AdminID, 
            email: admin.email, },
            process.env.JWT_KEY,
            {expiresIn: '1h'}
        )

        return res.status(200).json({
            message: "Login successful",
            token: token,
        });

    } catch (error){
        return res.status(500).json({message: error.message})
    }
}

export async function getAdminProfile(req, res){
    try{
        const { AdminID } = req.params

        const [adminProfile] = await pool.query('SELECT AdminID, firstName, lastName, email, phoneNum FROM admin WHERE AdminID = ?', [AdminID])

        if (adminProfile.length == 0){
        res.status(404).json({message: "Admin not found"})
        }

        res.json(adminProfile[0])
    }catch (error){
        res.status(500).json({message: error.message})
    }
}