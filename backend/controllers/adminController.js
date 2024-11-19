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

//All books borrowed 
export async function postAllBooksBorrowed(req, res) {
  try {
    // Extract startDate and endDate from the request body
    const { startDate, endDate } = req.body;

    // Check if the dates are provided
    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Start date and end date are required" });
    }

    // Run the query to get the most borrowed books
    const [allbooksborrowed] = await pool.query(`
      SELECT b.ISBN, b.bTitle, b.bAuthor, b.publisher, b.genre, b.edition, bc.itemID, bb.dueDate
             FROM bookborrowed bb
             JOIN bookcopy bc ON bb.itemID = bc.itemID
             JOIN book b ON bc.ISBN = b.ISBN
             WHERE bb.borrowDate BETWEEN ?AND ?
    `, [startDate, endDate]);

    // Send the response with the result
    res.json(allbooksborrowed);
  } catch (error) {
    console.error("Error fetching most borrowed books:", error);
    res.status(500).json({ error: "Failed to fetch most borrowed books" });
  }
}


//Most borrowed Books
export async function postMostBooksBorrowed(req, res) {
  try {
    // Extract startDate and endDate from the request body
    const { startDate, endDate } = req.body;

    // Check if the dates are provided
    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Start date and end date are required" });
    }

    // Run the query to get the most borrowed books
    const [mostbooksborrowed] = await pool.query(`
      SELECT b.ISBN, b.bTitle, b.bAuthor, b.publisher, b.genre, b.edition, COUNT(bb.borrowID) AS borrowCount
      FROM bookborrowed bb
      JOIN bookcopy bc ON bb.itemID = bc.itemID
      JOIN book b ON bc.ISBN = b.ISBN
      WHERE bb.borrowDate BETWEEN ? AND ?
      GROUP BY b.ISBN, b.bTitle, b.bAuthor, b.publisher, b.genre, b.edition
      ORDER BY borrowCount DESC
      LIMIT 10
    `, [startDate, endDate]);

    // Send the response with the result
    res.json(mostbooksborrowed);
  } catch (error) {
    console.error("Error fetching most borrowed books:", error);
    res.status(500).json({ error: "Failed to fetch most borrowed books" });
  }
}


//most requested book
export async function postMostRequestedBooks(req, res) {
  try {
    const { startDate, endDate } = req.body;
    console.log(startDate, endDate)
    const [mostrequestedbooks] = await pool.query(`
      SELECT bTitle, userID, bAuthor, publisher, genre, edition, COUNT(ISBN) AS requestCount
FROM bookrequest
WHERE requestDate BETWEEN ? AND ?
GROUP BY ISBN, bTitle, userID, bAuthor, publisher, genre, edition
ORDER BY requestCount DESC

LIMIT 10

    `,
    [startDate, endDate]

  );
    
    console.log(mostrequestedbooks)
    res.json(mostrequestedbooks);
  
  } catch (error) {
    console.error("Error fetching most requested books:", error);
    res.status(500).json({ error: "Failed to fetch most requested books" });
  }
}


//All media borrowed 
export async function postAllMediaBorrowed(req, res) {
  try {

    const { startDate, endDate } = req.body;


    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Start date and end date are required" });
    }


    const [allmediaborrowed] = await pool.query(`
      SELECT m.MediaID, m.mTitle, userID,  m.mAuthor, m. publisher, m.genre, m.edition, mc.itemID, mb.dueDate
             FROM mediaborrowed mb
             JOIN mediacopy mc ON mb.itemID = mc.itemID
             JOIN media m ON mc.MediaID = m.MediaID
             WHERE mb.borrowDate BETWEEN ? AND ?
    `, [startDate, endDate]);

    res.json(allmediaborrowed);
  } catch (error) {
    console.error("Error fetching all borrowed media:", error);
    res.status(500).json({ error: "Failed to fetch all borrowed media" });
  }
}

//most borrowed media
export async function postMostMediaBorrowed(req, res) {
  try {
    
    const { startDate, endDate } = req.body;

    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Start date and end date are required" });
    }

   
    const [mostmediaborrowed] = await pool.query(`
      SELECT m.MediaID, m.mTitle, m.mAuthor, m.publisher, m.genre, m.edition, COUNT(mb.borrowID) AS borrowCount
      FROM mediaborrowed mb
      JOIN mediacopy mc ON mb.itemID = mc.itemID
      JOIN media m ON mc.MediaID = mc.MediaID
      WHERE mb.borrowDate BETWEEN ? AND ?
      GROUP BY m.MediaID, m.mTitle, m.mAuthor, m.publisher, m.genre, m.edition
      ORDER BY borrowCount DESC
      LIMIT 10
    `, [startDate, endDate]);

    // Send the response with the result
    res.json(mostmediaborrowed);
  } catch (error) {
    console.error("Error fetching most borrowed media:", error);
    res.status(500).json({ error: "Failed to fetch most borrowed media" });
  }
}

//most requested media
export async function postMostRequestedMedia(req, res) {
  try {
    const { startDate, endDate } = req.body;
    console.log(startDate, endDate);

    // Run the query
    const [mostrequestedmedia] = await pool.query(`
      SELECT mTitle, userID, MediaID, mAuthor, publisher, genre, edition, COUNT(MediaID) AS requestCount
      FROM mediarequest
      WHERE requestDate BETWEEN ? AND ?
      GROUP BY MediaID, mTitle, userID, mAuthor, publisher, genre, edition
      ORDER BY requestCount DESC
      LIMIT 10
    `, [startDate, endDate]);

    // Log the result
    console.log(mostrequestedmedia);

    // Send the response with the result
    res.json(mostrequestedmedia);
  
  } catch (error) {
    console.error("Error fetching most requested media:", error);
    res.status(500).json({ error: "Failed to fetch most requested media" });
  }
}

