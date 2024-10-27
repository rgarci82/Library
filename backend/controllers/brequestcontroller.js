import pool from '../config/db.js';

// Function to request a book
export async function requestBook(req, res) {
    try {
        const { userID, ISBN, btitle, bauthor, publisher, genre, edition, status } = req.body; // Expecting details in the request body

        // Validate input
        if (!userID || !ISBN || !btitle || !bauthor || !publisher || !genre || !edition || !status) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Insert the book request into the bookrequest table
        const [result] = await pool.query(
            `INSERT INTO bookrequest (userID, ISBN, bTitle, bAuthor, publisher, genre, edition, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [userID, ISBN, btitle, bauthor, publisher, genre, edition, status]
        );

        // Return success message with requestID
        res.status(201).json({ message: "Book requested successfully.", requestID: result.insertId });
    } catch (error) {
        console.error("Error requesting book:", error); // Log error for debugging
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Function to get all book requests for a specific user
export async function getUserBookRequests(req, res) {
    try {
        const { userID } = req.params;

        // Query to get all book requests made by the user
        const [requests] = await pool.query(
            `SELECT requestID, ISBN, bTitle, bAuthor, publisher, genre, edition, status 
             FROM bookrequest 
             WHERE userID = ?`, 
            [userID]
        );

        // Check if any requests were found
        if (requests.length === 0) {
            return res.status(404).json({ message: "No book requests found for this user." });
        }

        // Return the requests
        res.json(requests);
    } catch (error) {
        console.error("Error fetching book requests:", error); // Log error for debugging
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Function to update the status of a book request
export async function updateBookRequestStatus(req, res) {
    try {
        const { requestID } = req.params; // Expecting requestID in the URL parameters
        const { status } = req.body; // Expecting new status in the request body

        // Validate input
        if (!status) {
            return res.status(400).json({ message: "Status is required." });
        }

        // Query to update the status of the book request
        const [result] = await pool.query(
            `UPDATE bookrequest SET status = ? WHERE requestID = ?`,
            [status, requestID]
        );

        // Check if any rows were affected
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Request not found." });
        }

        // Return success message
        res.json({ message: "Book request status updated successfully." });
    } catch (error) {
        console.error("Error updating book request status:", error); // Log error for debugging
        res.status(500).json({ message: "Internal Server Error" });
    }
}
