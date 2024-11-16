
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


/**
 * Fetch reports based on the selected date range.
 */
export const getAdminReports = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: "Start date and end date are required." });
  }

  try {
    // Query for Most Requested Books
    const [mostRequestedBooks] = await db.query(
      `SELECT bTitle, userID, bAuthor, publisher, genre, edition
       FROM bookrequest
       WHERE requestDate BETWEEN ? AND ?
       ORDER BY requestDate DESC
       LIMIT 10`,
      [startDate, endDate]
    );

    // Query for Most Requested Media
    const [mostRequestedMedia] = await db.query(
      `SELECT mTitle, userID, mAuthor, publisher, genre, edition
       FROM media_requests 
       WHERE request_date BETWEEN ? AND ?
       ORDER BY request_date DESC 
       LIMIT 10`,
      [startDate, endDate]
    );

    // Query for Available Book Copies
    const [availableBookCopies] = await db.query(
      `SELECT bTitle, bAuthor, publisher, genre, edition
       FROM book b
       JOIN bookcopy bc on bc.ISBN = b.ISBN
       WHERE bc.status = "available"`
    );

    // Query for Available Media Copies
    const [availableMediaCopies] = await db.query(
      `SELECT *
       FROM mediacopy
       WHERE available = 1`
    );

    // Query for All Requested Books
    const [allRequestedBooks] = await db.query(
      `SELECT title, user, COUNT(*) AS requestedCount 
       FROM book_requests 
       WHERE request_date BETWEEN ? AND ? 
       GROUP BY title, user`,
      [startDate, endDate]
    );

    // Query for All Requested Media
    const [allRequestedMedia] = await db.query(
      `SELECT title, user, COUNT(*) AS requestedCount 
       FROM media_requests 
       WHERE request_date BETWEEN ? AND ? 
       GROUP BY title, user`,
      [startDate, endDate]
    );

    // Query for All Book Holds
    const [allBookHolds] = await db.query(
      `SELECT title, user 
       FROM book_holds 
       WHERE hold_date BETWEEN ? AND ?`,
      [startDate, endDate]
    );

    // Query for All Media Holds
    const [allMediaHolds] = await db.query(
      `SELECT title, user 
       FROM media_holds 
       WHERE hold_date BETWEEN ? AND ?`,
      [startDate, endDate]
    );

    // Query for Most Borrowed Book Genres
    const [mostBorrowedBookGenres] = await db.query(
      `SELECT genre, COUNT(*) AS requestedCount 
       FROM books 
       JOIN book_requests ON books.id = book_requests.book_id 
       WHERE request_date BETWEEN ? AND ? 
       GROUP BY genre 
       ORDER BY requestedCount DESC 
       LIMIT 10`,
      [startDate, endDate]
    );

    // Query for Most Borrowed Media
    const [mostBorrowedMedia] = await db.query(
      `SELECT title, COUNT(*) AS requestedCount 
       FROM media_requests 
       WHERE request_date BETWEEN ? AND ? 
       GROUP BY title 
       ORDER BY requestedCount DESC 
       LIMIT 10`,
      [startDate, endDate]
    );

    // Return results in a single JSON response
    res.json({
      mostRequestedBooks,
      mostRequestedMedia,
      availableBookCopies,
      availableMediaCopies,
      allRequestedBooks,
      allRequestedMedia,
      allBookHolds,
      allMediaHolds,
      mostBorrowedBookGenres,
      mostBorrowedMedia,
    });
  } catch (error) {
    console.error("Error fetching admin reports:", error);
    res.status(500).json({ error: "Failed to fetch reports." });
  }
};
