import pool from "../config/db.js";

export async function getMedia(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM media");

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createMedia(req, res) {
  const { MediaID, mTitle, mAuthor, mPublisher, mGenre, mEdition, mQuantity } =
    req.body;

  try {
    const [existingMedia] = await pool.query(
      "SELECT * FROM media WHERE MediaID = ?",
      [MediaID]
    );

    if (existingMedia.length > 0) {
      return res
        .status(400)
        .json({ message: "A media with this MediaID already exists." });
    }

    const [result] = await pool.query(
      "INSERT INTO media (MediaID, mTitle, mAuthor, publisher, genre, edition) VALUES (?, ?, ?, ?, ?, ?)",
      [MediaID, mTitle, mAuthor, mPublisher, mGenre, mEdition || null]
    );

    const mediaCopyPromises = [];

    for (let i = 0; i < mQuantity; i++) {
      mediaCopyPromises.push(
        pool.query("INSERT INTO mediacopy (MediaID) VALUES (?)", [MediaID])
      );
    }

    await Promise.all(mediaCopyPromises);

    res
      .status(201)
      .json({ message: "Media created successfully", MediaID: MediaID });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function requestMedia(req, res) {
  const {
    userID,
    mediaISBN,
    mediaTitle,
    mediaAuthor,
    mediaPublisher,
    mediaGenre,
    mediaEdition,
    status,
  } = req.body;

  try {
    const [existingMedia] = await pool.query(
      "SELECT * FROM media WHERE MediaID = ?",
      [mediaISBN]
    );

    if (existingMedia.length > 0) {
      return res.status(400).json({
        message:
          "A media with this ISBN already exists, try borrowing it instead.",
      });
    }

    // Corrected syntax for checking existing requests
    const [existingRequest] = await pool.query(
      "SELECT * FROM mediarequest WHERE ISBN = ? AND userID = ?",
      [mediaISBN, userID] // Combine the parameters into a single array
    );

    if (existingRequest.length > 0) {
      return res.status(400).json({
        message: "A media with this ISBN request already exists.",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO mediarequest (userID, ISBN, mTitle, mAuthor, publisher, genre, edition, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        userID,
        mediaISBN,
        mediaTitle,
        mediaAuthor,
        mediaPublisher,
        mediaGenre,
        mediaEdition || null,
        status,
      ]
    );

    // Return a success response with a 201 status
    res.status(201).json({
      message: "Media request created successfully",
    });
  } catch (error) {
    console.error("Error occurred while requesting a media:", error); // Log the error for debugging
    res.status(500).json({ message: error.message });
  }
}

export async function getAllMediaRequests(req, res) {
  try {
    const [mediaRequests] = await pool.query("SELECT * FROM mediarequest");

    res.status(200).json(mediaRequests);
  } catch (error) {
    console.error("Error occurred while fetching media requests:", error);
    res.status(500).json({ message: error.message });
  }
}

export async function mediaRequestAccepted(req, res) {
  const { requestID } = req.params;
  try {
    const [requestDetails] = await pool.query(
      "SELECT * FROM mediarequest WHERE requestID = ?",
      [requestID]
    );

    if (requestDetails.length === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    const { ISBN, mTitle, mAuthor, publisher, genre, edition, userID } =
      requestDetails[0];

    if (
      requestDetails[0].status === "approved" ||
      requestDetails[0].status === "denied"
    ) {
      return res
        .status(400)
        .json({ message: "This request has already been processed." });
    }

    await pool.query(
      "INSERT INTO media (mTitle, mAuthor, publisher, genre, edition) VALUES (?, ?, ?, ?, ?)",
      [mTitle, mAuthor, publisher, genre, edition || null]
    );

    await pool.query(
      "UPDATE mediarequest SET status = 'approved' WHERE requestID = ?",
      [requestID]
    );

    res
      .status(200)
      .json({ message: "Media request accepted and media created." });
  } catch (error) {
    console.error("Error while accepting media request:", error);
    res.status(500).json({ message: error.message });
  }
}

export async function mediaRequestDeny(req, res) {
  const { requestID } = req.params;

  try {
    const [requestDetails] = await pool.query(
      "SELECT * FROM mediarequest WHERE requestID = ?",
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
      "UPDATE mediarequest SET status = 'denied' WHERE requestID = ?",
      [requestID]
    );

    res.status(200).json({ message: "Media denied" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getMediaByID(req, res) {
  try {
    const { MediaID } = req.params;
    const [result] = await pool.query(
      "SELECT * FROM device WHERE MediaID = ?",
      [MediaID]
    );
    if (result.length == 0) {
      return res.status(404).json({ message: "Media not found" });
    }
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateMedia(req, res) {
  try {
    const { MediaID } = req.params;
    const { mTitle, mAuthor, publisher, genre, edition } = req.body;

    if (!mTitle || !mAuthor || !publisher || !genre) {
      return res
        .status(400)
        .json({ message: "Title, Author, Publisher, and Genre are required." });
    }

    const [result] = await pool.query(
      "UPDATE media SET mTitle = ?, mAuthor = ?, publisher = ?, genre = ?, edition = ? WHERE MediaID = ?",
      [mTitle, mAuthor, publisher, genre, edition || null, MediaID]
    );

    if (result.affectedRows == 0) {
      res.status(404).json({ message: "Media not found" });
    }

    res.json({ message: "Media updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteMedia(req, res) {
  try {
    const { MediaID } = req.params;

    const [result] = await pool.query("DELETE FROM media WHERE MediaID = ?", [
      MediaID,
    ]);

    if (result.affectedRows == 0) {
      res.status(404).json({ message: "Media not found" });
    }

    res.json({ message: "Media deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
