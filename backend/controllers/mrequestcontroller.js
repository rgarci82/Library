import pool from '../config/db.js';

// Function to request media
export async function requestMedia(req, res) {
    try {
        const { userID, ISBN, mTitle, mAuthor, publisher, genre, edition, status } = req.body;

        // Validate input
        if (!userID || !ISBN || !mTitle || !mAuthor || !publisher || !genre || !edition || !status) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Insert the media request into the media request table
        const [result] = await pool.query(
            `INSERT INTO mediarequest (userID, ISBN, mTitle, mAuthor, publisher, genre, edition, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [userID, ISBN, mTitle, mAuthor, publisher, genre, edition, status]
        );

        // Return success message with requestID
        res.status(201).json({ message: "Media requested successfully.", requestID: result.insertId });
    } catch (error) {
        console.error("Error requesting media:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Function to get all media requests for a specific user
export async function getUserMediaRequests(req, res) {
    try {
        const { userID } = req.params;

        // Query to get all media requests made by the user
        const [requests] = await pool.query(
            `SELECT requestID, ISBN, mTitle, mAuthor, publisher, genre, edition, status 
             FROM mediarequest 
             WHERE userID = ?`, 
            [userID]
        );

        // Check if any requests were found
        if (requests.length === 0) {
            return res.status(404).json({ message: "No media requests found for this user." });
        }

        // Return the requests
        res.json(requests);
    } catch (error) {
        console.error("Error fetching media requests:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Function to update the status of a media request
export async function updateMediaRequestStatus(req, res) {
    try {
        const { requestID } = req.params; // Expecting requestID in the URL parameters
        const { status } = req.body; // Expecting new status in the request body

        // Validate input
        if (!status) {
            return res.status(400).json({ message: "Status is required." });
        }

        // Query to update the status of the media request
        const [result] = await pool.query(
            `UPDATE mediarequest SET status = ? WHERE requestID = ?`,
            [status, requestID]
        );

        // Check if any rows were affected
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Request not found." });
        }

        // Return success message
        res.json({ message: "Media request status updated successfully." });
    } catch (error) {
        console.error("Error updating media request status:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
