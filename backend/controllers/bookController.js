import pool from "../config/db.js";

export async function getBooks(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM book WHERE is_deleted = 0");
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

export async function getBookCopy(req, res) {
  try {
    const { ISBN } = req.params;

    if (!ISBN) {
      return res.status(400).json({ message: "ISBN is required" });
    }

    const [bookCopies] = await pool.query(
      `
      SELECT bookcopy.itemID, bookcopy.status
      FROM bookcopy
      WHERE bookcopy.ISBN = ? AND bookcopy.status = 'available'
      `,
      [ISBN]
    );

    res.json(bookCopies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function borrowBook(req, res) {
  const { userData, book } = req.body;

  console.log("BORROWING: ", book);

  try {
    // Check if the user has already borrowed a copy of this book
    const [existingBorrow] = await pool.query(
      `SELECT * FROM bookborrowed 
       JOIN bookcopy ON bookborrowed.itemID = bookcopy.itemID
       WHERE bookborrowed.userID = ? AND bookcopy.ISBN = ?`,
      [userData.userID, book.ISBN]
    );

    // If a matching record is found, return a 400 status with a message
    if (existingBorrow.length > 0) {
      if (existingBorrow.some((item) => item.returnDate === null)) {
        return res.status(400).json({
          message: "You have already borrowed this book.",
        });
      }
    }

    // Find the first available itemID for the book ISBN
    const [availableCopy] = await pool.query(
      `SELECT itemID FROM bookcopy 
       WHERE ISBN = ? AND status = 'available' 
       ORDER BY itemID ASC 
       LIMIT 1`,
      [book.ISBN]
    );

    // If no available copy is found, return a 404 status with a message
    if (availableCopy.length === 0) {
      return res.status(404).json({
        message: "No available copies of this book.",
      });
    }

    const userID = userData.userID;
    const itemID = availableCopy[0].itemID;

    //Insert the borrow record into the 'bookborrowed' table
    const [borrowResult] = await pool.query(
      `INSERT INTO bookborrowed (userID, itemID) VALUES (?, ?)`,
      [userID, itemID]
    );

    // Update the status of the borrowed book copy in the 'bookcopy' table
    const [updateResult] = await pool.query(
      `UPDATE bookcopy SET status = 'borrowed' WHERE itemID = ?`,
      [itemID]
    );

    // Return a success response with a 201 status
    res.status(201).json({
      message: "Book borrowed successfully",
      itemID: itemID,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    // Send an appropriate error response to the client
    return {
      success: false,
      message: "Internal Server Error",
      error: error.message,
    };
  }
}

export async function returnBook(req, res) {
  const { selectedItem } = req.body;

  try {
    const returnDateResult = await pool.query(
      `UPDATE bookborrowed 
      SET returnDate = NOW()
      WHERE itemID = ?`,
      [selectedItem.itemID]
    );

    const returnStatusResult = await pool.query(
      `UPDATE bookcopy
      SET status = 'available'
      WHERE itemID = ?`,
      [selectedItem.itemID]
    );

    // Return a success response with a 201 status
    if (returnDateResult && returnStatusResult) {
      res.status(201).json({
        message: "Book returned successfully",
      });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    // Send an appropriate error response to the client
    return {
      success: false,
      message: "Internal Server Error",
      error: error.message,
    };
  }
}

export async function holdBook(req, res) {
  const { userData, selectedHoldItem } = req.body;

  try {
    // Check if the user has already borrowed a copy of this book
    const [existingHold] = await pool.query(
      `SELECT * FROM bookhold 
       JOIN book ON bookhold.ISBN = book.ISBN
       WHERE bookhold.userID = ? AND book.ISBN = ?`,
      [userData.userID, selectedHoldItem.ISBN]
    );

    // If a matching record is found, return a 400 status with a message
    if (existingHold.length > 0) {
      if (existingHold.some((item) => item.status === "OnHold")) {
        return res.status(400).json({
          message: "You already have this book on hold.",
        });
      }
    }

    const [holdResult] = await pool.query(
      `INSERT INTO bookhold(userID, ISBN, status)
      VALUES (?, ?, 'OnHold')`,
      [userData.userID, selectedHoldItem.ISBN]
    );

    res.status(201).json({
      message: "Book on hold successfully",
    });
  } catch (error) {
    console.error("Error occured:", error);
    return {
      success: false,
      message: "Internal Server Error",
      error: error.message,
    };
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

    if (
      requestDetails[0].status === "approved" ||
      requestDetails[0].status === "denied"
    ) {
      return res
        .status(400)
        .json({ message: "This request has already been processed." });
    }

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
    const [requestDetails] = await pool.query(
      "SELECT * FROM bookrequest WHERE requestID = ?",
      [requestID]
    );

    if (
      requestDetails[0].status === "approved" ||
      requestDetails[0].status === "denied"
    ) {
      return res
        .status(400)
        .json({ message: "This request has already been processed." });
    }

    await pool.query(
      "UPDATE bookrequest SET status = 'denied' WHERE requestID = ?",
      [requestID]
    );

    res.status(200).json({ message: "Book denied" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    const [borrowedCopies] = await pool.query(
      "SELECT COUNT(*) as borrowedCount FROM bookcopy WHERE ISBN = ? AND status = 'borrowed'",
      [ISBN]
    );

    if (borrowedCopies[0].borrowedCount > 0) {
      return res
        .status(409)
        .json({ message: "Some copies are currently being borrowed." });
    }

    // Step 2: Update book and bookcopies if no copies are borrowed
    await pool.query("UPDATE book SET is_deleted = 1 WHERE ISBN = ?", [ISBN]);
    await pool.query("UPDATE bookcopy SET status = 'deleted' WHERE isbn = ?", [
      ISBN,
    ]);

    res.json({
      message: "Book and all associated copies deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getMonthlyBookBorrowed(req, res){
  try {
    const [results] = await pool.query(`SELECT 
      YEAR(borrowDate) AS year, MONTHNAME(borrowDate) AS month, COUNT(*) AS books_borrowed_count 
      FROM bookborrowed 
      GROUP BY YEAR(borrowDate), MONTHNAME(borrowDate)`);

    res.json(results)
  } catch (error){
    res.status(500).json({message: error.message})
  }
}

export async function getMonthlyBookRequests(req, res){
  try{
    const [results] = await pool.query(`SELECT 
  YEAR(requestDate) AS year, MONTHNAME(requestDate) AS month, COUNT(*) AS books_requested_count
  FROM bookrequest
  GROUP BY YEAR(requestDate), MONTHNAME(requestDate)`)

  res.json(results)
  } catch (error){
    res.status(500).json({message: error.message})
  }
}