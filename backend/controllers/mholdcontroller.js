import pool from '../config/db.js';

// Create a new media hold
export async function createMediaHold(req, res) {
    try {
        const { userID, itemID, holdDate, status } = req.body;

        if (!userID || !itemID || !holdDate || !status) {
            return res.status(400).json({ message: "UserID, ItemID, HoldDate, and Status are required" });
        }

        // Insert the new media hold into the database
        const [result] = await pool.query(
            'INSERT INTO mediahold (userID, itemID, holdDate, status) VALUES (?, ?, ?, ?)',
            [userID, itemID, holdDate, status]
        );

        res.status(201).json({ message: "Media hold created successfully", holdID: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get all media holds
export async function getAllMediaHolds(req, res) {
    try {
        const [holds] = await pool.query('SELECT * FROM mediahold');
        res.status(200).json(holds);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get a specific media hold by ID
export async function getMediaHoldById(req, res) {
    try {
        const { holdID } = req.params;

        const [hold] = await pool.query('SELECT * FROM mediahold WHERE holdID = ?', [holdID]);

        if (hold.length === 0) {
            return res.status(404).json({ message: "Media hold not found" });
        }

        res.status(200).json(hold[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update a media hold
export async function updateMediaHold(req, res) {
    try {
        const { holdID } = req.params;
        const { userID, itemID, holdDate, status } = req.body;

        const [result] = await pool.query(
            'UPDATE mediahold SET userID = ?, itemID = ?, holdDate = ?, status = ? WHERE holdID = ?',
            [userID, itemID, holdDate, status, holdID]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Media hold not found" });
        }

        res.status(200).json({ message: "Media hold updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Delete a media hold
export async function deleteMediaHold(req, res) {
    try {
        const { holdID } = req.params;

        const [result] = await pool.query('DELETE FROM mediahold WHERE holdID = ?', [holdID]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Media hold not found" });
        }

        res.status(204).send(); // No content to send back for a successful deletion
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
