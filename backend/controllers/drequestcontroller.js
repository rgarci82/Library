import pool from '../config/db.js';

// Function to request a device
export async function requestDevice(req, res) {
    try {
        const { userID, serialNumber, dName, brand, model, status } = req.body; // Expecting details in the request body

        // Validate input
        if (!userID || !serialNumber || !dName || !brand || !model || !status) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Insert the device request into the deviserequest table
        const [result] = await pool.query(
            `INSERT INTO deviserequest (userID, serialNumber, dName, brand, model, Status) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [userID, serialNumber, dName, brand, model, Status]
        );

        // Return success message with requestID
        res.status(201).json({ message: "Device requested successfully.", requestID: result.insertId });
    } catch (error) {
        console.error("Error requesting device:", error); // Log error for debugging
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Function to get all device requests for a specific user
export async function getUserDeviceRequests(req, res) {
    try {
        const { userID } = req.params;

        // Query to get all device requests made by the user
        const [requests] = await pool.query(
            `SELECT requestID, serialNumber, dName, brand, model, status 
             FROM deviserequest 
             WHERE userID = ?`, 
            [userID]
        );

        // Check if any requests were found
        if (requests.length === 0) {
            return res.status(404).json({ message: "No device requests found for this user." });
        }

        // Return the requests
        res.json(requests);
    } catch (error) {
        console.error("Error fetching device requests:", error); // Log error for debugging
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Function to update the status of a device request
export async function updateDeviceRequestStatus(req, res) {
    try {
        const { requestID } = req.params; // Expecting requestID in the URL parameters
        const { status } = req.body; // Expecting new status in the request body

        // Validate input
        if (!status) {
            return res.status(400).json({ message: "Status is required." });
        }

        // Query to update the status of the device request
        const [result] = await pool.query(
            `UPDATE deviserequest SET Status = ? WHERE requestID = ?`,
            [status, requestID]
        );

        // Check if any rows were affected
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Request not found." });
        }

        // Return success message
        res.json({ message: "Device request status updated successfully." });
    } catch (error) {
        console.error("Error updating device request status:", error); // Log error for debugging
        res.status(500).json({ message: "Internal Server Error" });
    }
}
