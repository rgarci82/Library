import pool from '../config/db.js';


export async function getBorrowedDevices(req, res) {
    try {
        const { userID } = req.params;

      
        const [borrowedDevices] = await pool.query(
            `SELECT bd.borrowID, bd.userID, bd.itemID, bd.borrowDate, bd.dueDate, bd.returnDate, d.dName, brand,model,status
             FROM deviceborrowed AS bd
             INNER JOIN devices AS d ON bd.itemID = d.serialNumber
             WHERE bd.userID = ?`, 
            [userID]
        );

      
        if (borrowedDevices.length === 0) {
            return res.status(404).json({ message: "No borrowed devices found for this user." });
        }


        res.json(borrowedDevices);
    } catch (error) {
        console.error("Error fetching borrowed devices:", error); // Log error for debugging
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export async function borrowDevice(req, res) {
    try {
        const { userID, itemID, dueDate } = req.body; 

      
        if (!userID || !itemID || !dueDate) {
            return res.status(400).json({ message: "UserID, ItemID, and Due Date are required." });
        }

  
        const [result] = await pool.query(
            `INSERT INTO deviceborrowed (userID, itemID, borrowDate, dueDate) VALUES (?, ?, NOW(), ?)`,
            [userID, itemID, dueDate]
        );


        res.status(201).json({ message: "Device borrowed successfully.", borrowID: result.insertId });
    } catch (error) {
        console.error("Error borrowing device:", error); 
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export async function returnDevice(req, res) {
    try {
        const { borrowID } = req.params; 

        const [result] = await pool.query(
            `UPDATE deviceborrowed SET returnDate = NOW() WHERE borrowID = ?`,
            [borrowID]
        );


        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Borrow record not found." });
        }

     
        res.json({ message: "Device returned successfully." });
    } catch (error) {
        console.error("Error returning device:", error); 
        res.status(500).json({ message: "Internal Server Error" });
    }
}
