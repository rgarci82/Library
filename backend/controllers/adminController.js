import pool from "../config/db.js";
import bcrypt from "bcrypt";

export async function createAdmin(req, res) {
  try {
    const { firstName, lastName, email, phoneNum, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({
        message: "First Name, Last Name, Email, and Password are required",
      });
    }

    const [existingAdmin] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingAdmin > 0) {
      res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (firstName, lastName, email, phoneNum, userType, password) VALUES (?, ?, ?, ?, ?, ?)",
      [firstName, lastName, email, phoneNum || null, 'Admin', hashedPassword]
    );

    res.status(201).json({
      message: "Admin created successfully",
      AdminID: result.insertId,
      email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getAdminProfile(req, res) {
  try {
    const { userID } = req.params;

    const [adminProfile] = await pool.query(
      "SELECT userID, firstName, lastName, email, phoneNum FROM admin WHERE userID = ?",
      [userID]
    );

    if (adminProfile.length == 0) {
      res.status(404).json({ message: "Admin not found" });
    }

    res.json(adminProfile[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
