import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function createUser(req, res) {
  try {
    const { firstName, lastName, email, phoneNum, userType, password } =
      req.body;

    if (!firstName || !lastName || !email || !userType || !password) {
      res.status(400).json({
        message:
          "First Name, Last Name, Email, User Type, and Password are required",
      });
    }

    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser > 0) {
      res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (firstName, lastName, email, phoneNum, userType, password) VALUES (?, ?, ?, ?, ?, ?)",
      [firstName, lastName, email, phoneNum || null, userType, hashedPassword]
    );

    res.status(201).json({
      message: "User created successfully",
      userID: result.insertId,
      email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(401)
        .json({ message: "Email and password are required" });
    }

    const [row] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = row[0];

    if (!user) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.userID, email: user.email, userType: user.userType },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getUserProfile(req, res) {
  try {
    const { userID } = req.params;

    const [userProfile] = await pool.query(
      "SELECT userID, firstName, lastName, email, phoneNum, userType FROM users WHERE userID = ?",
      [userID]
    );

    if (userProfile.length == 0) {
      res.status(404).json({ message: "User not found" });
    }

    res.json(userProfile[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getUserFine(req, res) {
  try {
    const { userID } = req.params;

    console.log(`Fetching fine for userID: ${userID}`); // Log userID for debugging

    const fineAmountResult = await pool.query(
      `SELECT SUM(fineAmount) AS totalFine 
         FROM (
             SELECT fineAmount 
             FROM bookborrowed 
             WHERE userID = ?
             UNION ALL
             SELECT fineAmount 
             FROM mediaBorrowed 
             WHERE userID = ?
             UNION ALL
             SELECT fineAmount 
             FROM deviceBorrowed 
             WHERE userID = ?
         ) AS combinedFines`,
      [userID, userID, userID]
    );

    const totalFine = fineAmountResult[0]?.totalFine || 0;
    res.json(totalFine);
  } catch (error) {
    console.error("Error fetching user fine:", error); // Detailed error logging
    res.status(500).json({ message: "Internal Server Error" });
  }
}
