import pool from "../config/db.js";

export async function getBooks(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM book");

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createBook(req, res) {
  const { ISBN, bTitle, bAuthor, publisher, genre, edition, quantity } =
    req.body;

  try {
    const [existingBook] = await pool.query(
      "SELECT * FROM book WHERE ISBN = ?",
      [ISBN]
    );

    if (existingBook.length > 0) {
      return res
        .status(400)
        .json({ message: "A book with this ISBN already exists." });
    }

    const [result] = await pool.query(
      "INSERT INTO book (ISBN, bTitle, bAuthor, publisher, genre, edition) VALUES (?, ?, ?, ?, ?, ?)",
      [ISBN, bTitle, bAuthor, publisher, genre, edition || null]
    );

    const bookCopyPromises = [];

    for (let i = 0; i < quantity; i++) {
      bookCopyPromises.push(
        pool.query("INSERT INTO bookcopy (isbn) VALUES (?)", [ISBN])
      );
    }

    await Promise.all(bookCopyPromises);

    res.status(201).json({ message: "Book created successfully", ISBN: ISBN });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function requestBook(req, res) {
  const {
    userID,
    bookISBN,
    bookTitle,
    bookAuthor,
    bookPublisher,
    bookGenre,
    bookEdition,
    status,
  } = req.body;

  try {
    // Check if the book already exists in the 'book' table
    const [existingBook] = await pool.query(
      "SELECT * FROM book WHERE ISBN = ?",
      [bookISBN]
    );

    // If a book with this ISBN exists, return a 400 status with a message
    if (existingBook.length > 0) {
      return res.status(400).json({
        message:
          "A book with this ISBN already exists, try borrowing it instead.",
      });
    }

    // Corrected syntax for checking existing requests
    const [existingRequest] = await pool.query(
      "SELECT * FROM bookrequest WHERE ISBN = ? AND userID = ?",
      [bookISBN, userID] // Combine the parameters into a single array
    );

    if (existingRequest.length > 0) {
      return res.status(400).json({
        message: "A book with this ISBN request already exists.",
      });
    }

    // Insert the book request into the 'bookrequest' table
    const [result] = await pool.query(
      "INSERT INTO bookrequest (userID, ISBN, bTitle, bAuthor, publisher, genre, edition, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        userID,
        bookISBN,
        bookTitle,
        bookAuthor,
        bookPublisher,
        bookGenre,
        bookEdition || null,
        status,
      ]
    );

    // Return a success response with a 201 status
    res.status(201).json({
      message: "Book request created successfully",
    });
  } catch (error) {
    console.error("Error occurred while requesting a book:", error); // Log the error for debugging
    res.status(500).json({ message: error.message });
  }
}

export async function getAllBookRequests(req, res) {
  try {
    // Query to fetch all book requests
    const [bookRequests] = await pool.query("SELECT * FROM bookrequest");

    // Return the list of book requests
    res.status(200).json(bookRequests);
  } catch (error) {
    console.error("Error occurred while fetching book requests:", error);
    res.status(500).json({ message: error.message });
  }
}

export async function bookRequestAccepted(req, res) {
  const { requestID } = req.params;
  try {
    // Get the request details
    const [requestDetails] = await pool.query(
      "SELECT * FROM bookrequest WHERE requestID = ?",
      [requestID]
    );

    if (requestDetails.length === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    const { ISBN, bTitle, bAuthor, publisher, genre, edition, userID } =
      requestDetails[0];

    // Insert the new book into the 'book' table
    await pool.query(
      "INSERT INTO book (ISBN, bTitle, bAuthor, publisher, genre, edition) VALUES (?, ?, ?, ?, ?, ?)",
      [ISBN, bTitle, bAuthor, publisher, genre, edition || null]
    );

    // Update the request status to 'accepted'
    await pool.query(
      "UPDATE bookrequest SET status = 'approved' WHERE requestID = ?",
      [requestID]
    );

    res
      .status(200)
      .json({ message: "Book request accepted and book created." });
  } catch (error) {
    console.error("Error while accepting book request:", error);
    res.status(500).json({ message: error.message });
  }
}

export async function bookRequestDeny(req, res) {
  const { requestID } = req.params;

  try {
    await pool.query(
      "UPDATE bookrequest SET status = 'denied' WHERE requestID = ?",
      [requestID]
    );

    res.status(200).json({ message: "Book denied" });
  } catch (error) {
    json.status(500).json({ message: error.message });
  }
}

export async function getBookByISBN(req, res) {
  try {
    const { ISBN } = req.params;
    const [result] = await pool.query("SELECT * FROM book WHERE ISBN = ?", [
      ISBN,
    ]);
    if (result.length == 0) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateBook(req, res) {
  try {
    const { ISBN } = req.params;
    const { bTitle, bAuthor, publisher, genre, edition } = req.body;

    if (!bTitle || !bAuthor || !publisher || !genre) {
      return res
        .status(400)
        .json({ message: "Title, Author, Publisher, and Genre are required." });
    }

    const [result] = await pool.query(
      "UPDATE book SET bTitle = ?, bAuthor = ?, publisher = ?, genre = ?, edition = ? WHERE ISBN = ?",
      [bTitle, bAuthor, publisher, genre, edition || null, ISBN]
    );

    if (result.affectedRows == 0) {
      res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteBook(req, res) {
  try {
    const { ISBN } = req.params;

    const [result] = await pool.query("DELETE FROM book WHERE ISBN = ?", [
      ISBN,
    ]);

    if (result.affectedRows == 0) {
      res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
