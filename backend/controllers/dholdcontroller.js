import pool from '../config/db.js';

// Create a new device hold
export async function createDeviceHold(req, res) {
    try {
        const { userID, itemID, holdDate, status } = req.body;

        if (!userID || !itemID || !holdDate || !status) {
            return res.status(400).json({ message: "UserID, ItemID, HoldDate, and Status are required" });
        }

        // Insert the new device hold into the database
        const [result] = await pool.query(
            'INSERT INTO devicehold (userID, itemID, holdDate, status) VALUES (?, ?, ?, ?)',
            [userID, itemID, holdDate, status]
        );

        res.status(201).json({ message: "Device hold created successfully", holdID: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get all device holds
export async function getAllDeviceHolds(req, res) {
    try {
        const [holds] = await pool.query('SELECT * FROM devicehold');
        res.status(200).json(holds);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get a specific device hold by ID
export async function getDeviceHoldById(req, res) {
    try {
        const { holdID } = req.params;

        const [hold] = await pool.query('SELECT * FROM devicehold WHERE holdID = ?', [holdID]);

        if (hold.length === 0) {
            return res.status(404).json({ message: "Device hold not found" });
        }

        res.status(200).json(hold[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update a device hold
export async function updateDeviceHold(req, res) {
    try {
        const { holdID } = req.params;
        const { userID, itemID, holdDate, status } = req.body;

        const [result] = await pool.query(
            'UPDATE devicehold SET userID = ?, itemID = ?, holdDate = ?, status = ? WHERE holdID = ?',
            [userID, itemID, holdDate, status, holdID]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Device hold not found" });
        }

        res.status(200).json({ message: "Device hold updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Delete a device hold
export async function deleteDeviceHold(req, res) {
    try {
        const { holdID } = req.params;

        const [result] = await pool.query('DELETE FROM devicehold WHERE holdID = ?', [holdID]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Device hold not found" });
        }

        res.status(204).send(); // No content to send back for a successful deletion
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
