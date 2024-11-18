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

//report
export const getAdminReport = async (req, res) => {
  const { id } = req.params; 

  try {
    
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization token is missing' });
    }

    const token = authHeader.split(' ')[1]; 
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

    if (decoded.id !== parseInt(id, 10)) {
      return res.status(403).json({ error: 'Access denied' });
    }

   
    const [reportData] = await pool.query(
      'SELECT * FROM reports WHERE admin_id = ?',
      [id]
    );

    if (reportData.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.status(200).json(reportData);
  } catch (error) {
    console.error('Error fetching admin report:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//Books
export async function postAvailableBookCopies(req, res) {
  try {
    const [availableBookCopies] = await pool.query(`
      SELECT bTitle, bAuthor, b.publisher, b.genre, b.edition, b.ISBN
      FROM book b
      JOIN bookcopy bc ON bc.ISBN = b.ISBN
      WHERE bc.status = "available"
    `);

    res.json(availableBookCopies);
  } catch (error) {
    console.error("Error fetching available book copies:", error);
    res.status(500).json({ error: "Failed to fetch available book copies." });
  }
}

//most requested 
export async function postMostRequestedBooks(req, res) {
  try {
    const [mostrequestedbooks] = await pool.query(`
      SELECT bTitle, userID, bAuthor, publisher, genre, edition
FROM bookrequest
WHERE requestDate BETWEEN '2024-11-11' AND '2024-11-14'
ORDER BY requestDate DESC
LIMIT 10
    `);

    res.json(mostrequestedbooks);
  } catch (error) {
    console.error("Error fetching most requested books:", error);
    res.status(500).json({ error: "Failed to fetch most requested books" });
  }
}

