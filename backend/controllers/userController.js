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
            `SELECT b.ISBN, b.bTitle, b.bAuthor, b.publisher, b.genre, b.edition, bc.ItemID, bb.dueDate
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
            `SELECT * FROM mediaborrowed
             WHERE mediaborrowed.userID = ?`,
            [userID]
        );

        // Extract the books from the result
        const borrowedMedia = borrowedMediaResult[0] || []; // Ensure an empty array if no results

        console.log(borrowedMedia);
        res.json({ borrowedMedia }); // Return the borrowed books as a JSON response
    } catch (error) {
        console.error("Error fetching user's borrowed medias:", error); // Detailed error logging
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getUserBorrowedDevice(req, res) {
    try {
        const { userID } = req.params;

        // SQL query to get all books borrowed by the user
        const borrowedDeviceResult = await pool.query(
            `SELECT d.dName, d.brand, db. dueDate
                FROM device d
                JOIN deviceborrowed db on db.serialNumber = d.serialNumber 
                WHERE db.userID = ?`,
            [userID]
        );

        // Extract the books from the result
        const borrowedDevice = borrowedDeviceResult[0] || []; // Ensure an empty array if no results

        console.log(borrowedDevice);
        res.json({ borrowedDevice }); // Return the borrowed books as a JSON response
    } catch (error) {
        console.error("Error fetching user's borrowed device:", error); // Detailed error logging
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export async function getUserRequestedBooks(req, res) {
    try {
        const { userID } = req.params;

        // SQL query to get all books borrowed by the user
        const bookrequestResult = await pool.query(
            `SELECT * FROM bookrequest
             WHERE bookrequest.userID = ?`,
            [userID]
        );

        // Extract the books from the result
        const bookrequest = bookrequestResult[0] || []; // Ensure an empty array if no results

        console.log(bookrequest);
        res.json({ userRequestedBooks: bookrequest }); // Return the borrowed books as a JSON response
    } catch (error) {
        console.error("Error fetching user's book request:", error); // Detailed error logging
        res.status(500).json({ message: "Internal Server Error" });
    }
}
//media request
export async function getUserRequestedMedia(req, res) {
    try {
        const { userID } = req.params;

        // SQL query to get all books borrowed by the user
        const mediarequestResult = await pool.query(
            `SELECT * FROM mediarequest
             WHERE mediarequest.userID = ?`,
            [userID]
        );

        // Extract the books from the result
        const mediarequest = mediarequestResult[0] || []; // Ensure an empty array if no results

        console.log(mediarequest);
        res.json({ userRequestedMedia: mediarequest }); // Return the borrowed books as a JSON response
    } catch (error) {
        console.error("Error fetching user's media request:", error); // Detailed error logging
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getUserRequestedDevice(req, res) {
    try {
        const { userID } = req.params;

        // SQL query to get all books borrowed by the user
        const deviceRequestResult = await pool.query(
            `SELECT * FROM devicerequest
             WHERE devicerequest.userID = ?`,
            [userID]
        );

        // Extract the books from the result
        const devicerequest = deviceRequestResult[0] || []; // Ensure an empty array if no results

        console.log(devicerequest);
        res.json({ userRequestedDevice: devicerequest }); // Return the borrowed books as a JSON response
    } catch (error) {
        console.error("Error fetching user's device request:", error); // Detailed error logging
        res.status(500).json({ message: "Internal Server Error" });
    }
}


//book hold
export async function getUserbookHold(req, res) {
    try {
        const { userID } = req.params;

        // SQL query to get all books borrowed by the user
        const bookHoldResult = await pool.query(
            `SELECT b.bTitle, b.bAuthor, bh.holdDate, bh.status
            FROM bookhold bh
            JOIN  book b  ON b.ISBN = bh. ISBN
            WHERE bh.userID = ?; `,
            [userID]
        );

        // Extract the books from the result
        const bookhold = bookHoldResult[0] || []; // Ensure an empty array if no results

        console.log(bookhold);
        res.json({ userbookHold: bookhold }); // Return the borrowed books as a JSON response
    } catch (error) {
        console.error("Error fetching user's book hold:", error); // Detailed error logging
        res.status(500).json({ message: "Internal Server Error" });
    }
}


//media hold
export async function getUsermediaHold(req, res) {
    try {
        const { userID } = req.params;

        // SQL query to get all books borrowed by the user
        const mediaHoldResult = await pool.query(
            `SELECT m.mTitle, m.mAuthor, mh.holdDate, mh.status
            FROM mediahold mh
            JOIN  media m ON m. MediaID = mh. MediaID
            WHERE mh.userID = ?`,
            [userID]
        );

        // Extract the books from the result
        const mediahold = mediaHoldResult[0] || []; // Ensure an empty array if no results

        console.log(mediahold);
        res.json({ usermediaHold: mediahold }); // Return the borrowed books as a JSON response
    } catch (error) {
        console.error("Error fetching user's media hold:", error); // Detailed error logging
        res.status(500).json({ message: "Internal Server Error" });
    }
}

//device hold
export async function getUserdeviceHold(req, res) {
    try {
        const { userID } = req.params;

        // SQL query to get all device hold by the user
        const deviceHoldResult = await pool.query(
            `SELECT d.dName, d.brand, dh.holddate, dh.status
            FROM devicehold dh
            JOIN  device d ON d.serialNumber = dh. serialNumber
            WHERE dh.userID = ?`,
            [userID]
        );

        // Extract the books from the result
        const devicehold = deviceHoldResult[0] || []; // Ensure an empty array if no results

        console.log(devicehold);
        res.json({ userdeviceHold: devicehold }); // Return the borrowed books as a JSON response
    } catch (error) {
        console.error("Error fetching user's device hold:", error); // Detailed error logging
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getMonthlyUserRegistrations(req, res) {
  try {
    const [results] = await pool.query(`
              SELECT 
                  YEAR(created_at) AS year,
                  MONTHNAME(created_at) AS month,
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

export async function getTotalFineAmount(req, res) {
  try {
      const [results] = await pool.query(
      `SELECT 
          (SELECT COALESCE(SUM(fineAmount), 0) FROM bookborrowed) +
          (SELECT COALESCE(SUM(fineAmount), 0) FROM mediaborrowed) +
          (SELECT COALESCE(SUM(fineAmount), 0) FROM deviceborrowed) AS totalFines`
      );

      res.json(results);
  } catch (error) {
      console.error("Error fetch fine amounts");
      res.status(500).json({ message: "Internal server error" });
  }
}