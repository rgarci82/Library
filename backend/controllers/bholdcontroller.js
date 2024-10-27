import pool from '../config/db.js';

// Create a new book hold
export async function createBookHold(req, res) {
    try {
        const { userID, itemID, holdDate, status } = req.body;

        if (!userID || !itemID || !holdDate || !status) {
            return res.status(400).json({ message: "UserID, ItemID, HoldDate, and Status are required" });
        }

        // Insert the new book hold into the database
        const [result] = await pool.query(
            'INSERT INTO bookhold (userID, itemID, holdDate, status) VALUES (?, ?, ?, ?)',
            [userID, itemID, holdDate, status]
        );

        res.status(201).json({ message: "Book hold created successfully", holdID: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get all book holds
export async function getAllBookHolds(req, res) {
    try {
        const [holds] = await pool.query('SELECT * FROM bookhold');
        res.status(200).json(holds);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get a specific book hold by ID
export async function getBookHoldById(req, res) {
    try {
        const { holdID } = req.params;

        const [hold] = await pool.query('SELECT * FROM bookhold WHERE holdID = ?', [holdID]);

        if (hold.length === 0) {
            return res.status(404).json({ message: "Book hold not found" });
        }

        res.status(200).json(hold[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update a book hold
export async function updateBookHold(req, res) {
    try {
        const { holdID } = req.params;
        const { userID, itemID, holdDate, status } = req.body;

        const [result] = await pool.query(
            'UPDATE bookhold SET userID = ?, itemID = ?, holdDate = ?, status = ? WHERE holdID = ?',
            [userID, itemID, holdDate, status, holdID]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Book hold not found" });
        }

        res.status(200).json({ message: "Book hold updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Delete a book hold
export async function deleteBookHold(req, res) {
    try {
        const { holdID } = req.params;

        const [result] = await pool.query('DELETE FROM bookhold WHERE holdID = ?', [holdID]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Book hold not found" });
        }

        res.status(204).send(); // No content to send back for a successful deletion
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
