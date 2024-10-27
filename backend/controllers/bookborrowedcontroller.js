import pool from '../config/db.js';


export async function getBorrowedBooks(req, res) {
    try {
        const { userID } = req.params;

     
        const [borrowedBooks] = await pool.query(
            `SELECT bb.borrowID, bb.userID, bb.borrowDate, bb.dueDate, bb.returnDate, b.Title,b.bAuthor, b.publisher, b.genre, b.edition
             FROM bookborrowed AS bb
             INNER JOIN book AS b ON bb.itemID = b.ISBN
             WHERE bb.userID = ?`, 
            [userID]
        );

        
        if (borrowedBooks.length === 0) {
            return res.status(404).json({ message: "No borrowed books found for this user." });
        }

      
        res.json(borrowedBooks);
    } catch (error) {
        console.error("Error fetching borrowed books:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export async function borrowBook(req, res) {
    try {
        const { userID, itemID, dueDate } = req.body;
        if (!userID || !itemID || !dueDate) {
            return res.status(400).json({ message: "UserID, ItemID, and Due Date are required." });
        }
        const [bookExists] = await pool.query(`SELECT * FROM book WHERE ISBN = ?`, [itemID]);
        if (bookExists.length === 0) {
            return res.status(404).json({ message: "Book not found." });
        }
       
        const [result] = await pool.query(
            `INSERT INTO bookborrowed (userID, itemID, borrowDate, dueDate) VALUES (?, ?, NOW(), ?)`,
            [userID, itemID, dueDate]
        );

        res.status(201).json({ message: "Book borrowed successfully.", borrowID: result.insertId });
    } catch (error) {
        console.error("Error borrowing book:", error); 
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export async function returnBook(req, res) {
    try {
        const { borrowID } = req.params; 

        const [result] = await pool.query(
            `UPDATE bookborrowed SET returnDate = NOW() WHERE borrowID = ?`,
            [borrowID]
        );

      
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Borrow record not found." });
        }

   
        res.json({ message: "Book returned successfully." });
    } catch (error) {
        console.error("Error returning book:", error); 
        res.status(500).json({ message: "Internal Server Error" });
    }
}
