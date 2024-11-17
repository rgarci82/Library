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



 //Fetch reports based on the selected date range.

export async function getAdminReports (req, res)  {
 

  const { startDate, endDate } = req.query;

  // Validate query parameters
  if (!startDate || !endDate) {
    console.log("Missing dates:", { startDate, endDate });
    return res.status(400).json({ error: "Start date and end date are required." });
  }

  try {
    // Query for Available Book Copies
    const [availableBookCopies] = await pool.query(
      `SELECT bTitle, bAuthor, publisher, genre, edition, ISBN
       FROM book b
       JOIN bookcopy bc ON bc.ISBN = b.ISBN
       WHERE bc.status = "available"`
    );
    console.log("Available Book Copies:", availableBookCopies);

    // Query for all Requested Books
    const [allRequestedBooks] = await pool.query(
      `SELECT bTitle, userID,ISBN ,bAuthor, publisher, genre, edition
       FROM bookrequest
       WHERE requestDate BETWEEN ? AND ?
       ORDER BY requestDate DESC
       `,
      [startDate, endDate]
    );
    console.log("All Requested Books:", allRequestedBooks);
//most requested books
    const [mostRequestedBooks] = await pool.query(
      `SELECT ISBN,bTitle,bAuthor,publisher,genre,edition,COUNT(ISBN) AS duplicate_count
FROM bookrequest
GROUP BY ISBN, bTitle, bAuthor, publisher, genre, edition
ORDER BY duplicate_count DESC
LIMIT 10;`,
      [startDate, endDate]
    );
    console.log("Most Requested Books:", mostRequestedBooks);

    //all book hold
    const [allbookholds] = await pool.query(
      `SELECT b.bTitle, b.ISBN, b.bAuthor, b.publisher, b.genre, b.edition, bh.holdID, bh.status
FROM book b
JOIN bookhold bh ON b.ISBN = bh.ISBN
WHERE bh.holddate BETWEEN ? AND ?
ORDER BY bh.holddate`,
      [startDate, endDate]
    );
    console.log("All Book Holds:", allbookholds);
     // Query for Available Media Copies
     const [availableMediaCopies] = await pool.query(
      `SELECT m.MediaID, m.mTitle, m.mAuthor, m.publisher, m.genre, m.edition
FROM media m
JOIN mediacopy mc 
ON mc.MediaID = m.MediaID
WHERE mc.status = "available"`
    );
    console.log("Available Media Copies:", availableMediaCopies);
// all requested media
    const [allRequestedMedia] = await pool.query(
      `SELECT mTitle, userID,MediaID, mAuthor, publisher, genre, edition
       FROM mediarequest
       WHERE requestDate BETWEEN ? AND ?
       ORDER BY requestDate DESC`,
      [startDate, endDate]
    );
    console.log("All Requested Media:", allRequestedMedia);
    // Query for Most Requested Media
    const [mostRequestedMedia] = await pool.query(
      `SELECT MediaID,mTitle,mAuthor,publisher,genre,edition,COUNT(MediaID) AS duplicate_count
FROM mediarequest
GROUP BY MediaID, mTitle, mAuthor, publisher, genre, edition
ORDER BY duplicate_count DESC
LIMIT 10;`,
      [startDate, endDate]
    );
    console.log("Most Requested Media:", mostRequestedMedia);

    const [allmediaholds] = await pool.query(
      `SELECT m.mTitle,m.MediaID, m.mAuthor, m.publisher, m.genre, m.edition, mh.holdID, mh.status
FROM media m
JOIN mediahold mh ON m.MediaID = mh.MediaID
WHERE mh.holddate BETWEEN ? AND ?
ORDER BY mh.holddate`,
      [startDate, endDate]
    );
    console.log("All medai Holds:", allmediaholds);
   

    // Return all results in a single response
    res.json({
      availableBookCopies:availableBookCopies || [],
      allRequestedBooks:allRequestedBooks || [],
      mostRequestedBooks: mostRequestedBooks || [],
      allbookholds: allbookholds || [],
      availableMediaCopies: availableMediaCopies || [],
      allRequestedMedia:allRequestedMedia || [],
      mostRequestedMedia: mostRequestedMedia || [],
      allmediaholds:allmediaholds || []

    });
  } catch (error) {
    console.error("Error fetching admin reports:", error);
    res.status(500).json({ error: "Failed to fetch reports." });
  }
};
