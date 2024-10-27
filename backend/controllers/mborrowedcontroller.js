import pool from '../config/db.js';


export async function getBorrowedMedia(req, res) {
    try {
        const { userID } = req.params;

        const [borrowedMedia] = await pool.query(
            `SELECT bm.borrowID, bm.userID, bm.itemID, bm.borrowDate, bm.dueDate, bm.returnDate, m.mTitle, m.mAuthor,publisher,genre, edition
             FROM mediaborrowed AS bm
             INNER JOIN media AS m ON bm.itemID = m.mediaID
             WHERE bm.userID = ?`, 
            [userID]
        );

      
        if (borrowedMedia.length === 0) {
            return res.status(404).json({ message: "No borrowed media found for this user." });
        }

        res.json(borrowedMedia);
    } catch (error) {
        console.error("Error fetching borrowed media:", error); 
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function borrowMedia(req, res) {
    try {
        const { userID, itemID, dueDate } = req.body; 

        if (!userID || !itemID || !dueDate) {
            return res.status(400).json({ message: "UserID, ItemID, and Due Date are required." });
        }


        const [result] = await pool.query(
            `INSERT INTO mediaborrowed (userID, itemID, borrowDate, dueDate) VALUES (?, ?, NOW(), ?)`,
            [userID, itemID, dueDate]
        );

        res.status(201).json({ message: "Media borrowed successfully.", borrowID: result.insertId });
    } catch (error) {
        console.error("Error borrowing media:", error); 
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export async function returnMedia(req, res) {
    try {
        const { borrowID } = req.params; 

       
        const [result] = await pool.query(
            `UPDATE mediaborrowed SET returnDate = NOW() WHERE borrowID = ?`,
            [borrowID]
        );

      
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Borrow record not found." });
        }

 
        res.json({ message: "Media returned successfully." });
    } catch (error) {
        console.error("Error returning media:", error); 
        res.status(500).json({ message: "Internal Server Error" });
    }
}
