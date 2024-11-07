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

export async function loginUser(req, res){
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(401).json({message: "Email and password are required"})
        }

        const [row] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
        const user = row[0]

        if(!user){
            return res.status(404).json({message: "Invalid email or password"})
        }

        const validatePassword = await bcrypt.compare(password, user.password)
        if(!validatePassword){
            return res.status(400).json({message: "Invalid email or password"})
        }

        const token = jwt.sign(
            {id: user.userID, 
            email: user.email, 
            userType: user.userType},
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

export async function getUserProfile(req, res){
    try{
        const { userID } = req.params

        const [userProfile] = await pool.query('SELECT userID, firstName, lastName, email, phoneNum, userType FROM users WHERE userID = ?', [userID])

        if (userProfile.length == 0){
        res.status(404).json({message: "User not found"})
        }

        res.json(userProfile[0])
    }catch (error){
        res.status(500).json({message: error.message})
    }
}

export async function getUserFine(req, res) {
    try {
        const { userID } = req.params;

        // Calculate total fine for the specific userID across all borrowing tables
        const fineAmountResult = await pool.query(
            `SELECT COALESCE(SUM(TotalFine), 0) AS TotalFine
             FROM (
                 SELECT bb.userID, COALESCE(SUM(bb.fineAmount), 0) AS TotalFine
                 FROM bookborrowed bb
                 WHERE bb.userID = ?
                 GROUP BY bb.userID
        
                 UNION ALL
        
                 SELECT mb.userID, COALESCE(SUM(mb.fineAmount), 0) AS TotalFine
                 FROM mediaborrowed mb
                 WHERE mb.userID = ?
                 GROUP BY mb.userID
        
                 UNION ALL
        
                 SELECT db.userID, COALESCE(SUM(db.fineAmount), 0) AS TotalFine
                 FROM deviceborrowed db
                 WHERE db.userID = ?
                 GROUP BY db.userID
             ) AS fines`,
            [userID, userID, userID]
        );

        // Accessing the TotalFine value correctly
        const totalFine = parseFloat(fineAmountResult[0][0]?.TotalFine) || 0;

        res.json({ totalFine }); // Return the total fine as a JSON response
    } catch (error) {
        console.error("Error fetching user fine:", error); // Detailed error logging
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getUserBorrowedBooks(req, res) {
    try {
        const { userID } = req.params;

        // SQL query to get all books borrowed by the user
        const borrowedBooksResult = await pool.query(
            `SELECT b.ISBN, b.bTitle, b.bAuthor, b.publisher, b.genre, b.edition, bc.ItemID
             FROM bookborrowed bb
             JOIN bookcopy bc ON bb.itemID = bc.ItemID
             JOIN book b ON bc.ISBN = b.ISBN
             WHERE bb.userID = ?`,
            [userID]
        );

        // Extract the books from the result
        const borrowedBooks = borrowedBooksResult[0] || []; // Ensure an empty array if no results

        res.json({ borrowedBooks }); // Return the borrowed books as a JSON response
    } catch (error) {
        console.error("Error fetching user's borrowed books:", error); // Detailed error logging
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getUserBorrowedMedia(req, res) {
    try {
        const { userID } = req.params;

        // SQL query to get all books borrowed by the user
        const borrowedMediaResult = await pool.query(
            `SELECT m.MediaID, m.mTitle, m.mAuthor, m.publisher, m.genre, m.edition, mb.ItemID
             FROM mediaborrowed mb
             JOIN mediacopy mc ON mb.itemID = mc.itemID
             JOIN media m ON mc.MediaID = m.MediaID
             WHERE mb.userID = ?`,
            [userID]
        );

        // Extract the books from the result
        const borrowedMedia = borrowedMediaResult[0] || []; // Ensure an empty array if no results

        res.json({ borrowedMedia }); // Return the borrowed books as a JSON response
    } catch (error) {
        console.error("Error fetching user's borrowed books:", error); // Detailed error logging
        res.status(500).json({ message: "Internal Server Error" });
    }
}
//hanna device borrowed

export async function getUserBorrowedDevice(req, res) {
  try {
      const { userID } = req.params;

      
      const borrwedDeviceResult = await pool.query(
          `SELECT device.dName,deviceborrowed.borrowDate,deviceborrowed.dueDate
FROM 
    device
JOIN 
    deviceborrowed ON device.serialNumber = deviceborrowed.serialNumber;

           WHERE mb.userID = ?`,
          [userID]
      );

      // Extract the books from the result
      const borrowedDevice = borrwedDeviceResult[0] || []; // Ensure an empty array if no results

      res.json({ borrowedDevice }); // Return the borrowed books as a JSON response
  } catch (error) {
      console.error("Error fetching user's borrowed device:", error); // Detailed error logging
      res.status(500).json({ message: "Internal Server Error" });
  }
}

//requestedbooks
export async function getUserRequestedBooks(req, res) {
  try {
      const { userID } = req.params;

     
      const requestedBooksResult = await pool.query(
        'SELECT * FROM bookrequest WHERE userID = ? ',
    
          [userID]
      );

     
      const requestedBooks = requestedBooksResult[0] || []; // Ensure an empty array if no results

      res.json({ requestedBooks });
  } catch (error) {
      console.error("Error fetching user's requested books:", error); // Detailed error logging
      res.status(500).json({ message: "Internal Server Error" });
  }
}

//requested media

export async function getUserRequestedMedia(req, res) {
  try {
      const { userID } = req.params;

     
      const requestedMediaResult = await pool.query(
        'SELECT device.dName,devicerequest.requestDate,devicerequest.status FROM devicerequest JOIN device ON devicerequest.serialNumber = device.serialNumber;'
          [userID]
      );

     
      const requestedMedia = requestedMediaResult[0] || []; // Ensure an empty array if no results

      res.json({ requestedMedia }); se
  } catch (error) {
      console.error("Error fetching user's requested media:", error); // Detailed error logging
      res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMonthlyUserRegistrations(req, res) {
    try {
        const [results] = await pool.query(`
            SELECT 
                YEAR(created_at) AS year,
                MONTH(created_at) AS month,
                COUNT(*) AS user_count
            FROM users
            GROUP BY year, month
            ORDER BY year DESC, month DESC;
        `);

        res.json(results);
    } catch (error) {
        console.error("Error fetching monthly user registrations:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}







