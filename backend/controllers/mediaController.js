import pool from "../config/db.js";

export async function getMedia(req, res) {
  const { userData } = req.body;

  if (!userData){
    try {
      const [rows] = await pool.query("SELECT * FROM media WHERE is_deleted = 0");
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }  
  }
  else{
    try {
      const [rows] = await pool.query(`SELECT m.*
      FROM media AS m
      WHERE m.is_deleted = 0
      EXCEPT
      SELECT m.*
      FROM media AS m, mediaborrowed AS mb, mediacopy AS mc
      WHERE mb.userID = ? AND mb.itemID = mc.itemID AND m.MediaID = mc.MediaID AND mb.returnDate IS NULL AND is_deleted = 0;
      `, [userData.userID]);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export async function createMedia(req, res) {
  const { mTitle, mAuthor, mPublisher, mGenre, mEdition, mQuantity } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO media (mTitle, mAuthor, publisher, genre, edition) VALUES (?, ?, ?, ?, ?)",
      [mTitle, mAuthor, mPublisher, mGenre, mEdition || null]
    );

    const newMediaID = result.insertId;

    const mediaCopyPromises = [];
    for (let i = 0; i < mQuantity; i++) {
      mediaCopyPromises.push(
        pool.query("INSERT INTO mediacopy (MediaID) VALUES (?)", [newMediaID])
      );
    }

    await Promise.all(mediaCopyPromises);

    res.status(201).json({
      message: "Media created successfully",
      MediaID: newMediaID,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function returnMedia(req, res) {
  const { selectedItem } = req.body;

  try {
    const returnDateResult = await pool.query(
      `UPDATE mediaborrowed 
      SET returnDate = NOW()
      WHERE itemID = ?`,
      [selectedItem.itemID]
    );

    const returnStatusResult = await pool.query(
      `UPDATE mediacopy
      SET status = 'available'
      WHERE itemID = ?`,
      [selectedItem.itemID]
    );

    // Return a success response with a 201 status
    if (returnDateResult && returnStatusResult) {
      res.status(201).json({
        message: "Media returned successfully",
      });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    // Send an appropriate error response to the client
    return {
      success: false,
      message: "Internal Server Error",
      error: error.message,
    };
  }
}

export async function holdMedia(req, res) {
  const { userData, selectedHoldItem } = req.body;

  try {
    // Check if the user has already borrowed a copy of this media
    const [existingHold] = await pool.query(
      `SELECT * FROM mediahold 
       JOIN media ON mediahold.MediaID = media.MediaID
       WHERE mediahold.userID = ? AND media.MediaID = ?`,
      [userData.userID, selectedHoldItem.MediaID]
    );

    // If a matching record is found, return a 400 status with a message
    if (existingHold.length > 0) {
      if (existingHold.some((item) => item.status === "OnHold")) {
        return res.status(400).json({
          message: "You already have this media on hold.",
        });
      }
    }

    const [holdResult] = await pool.query(
      `INSERT INTO mediahold(userID, MediaID, status)
      VALUES (?, ?, 'OnHold')`,
      [userData.userID, selectedHoldItem.MediaID]
    );

    res.status(201).json({
      message: "Media on hold successfully",
    });
  } catch (error) {
    console.error("Error occured:", error);
    return {
      success: false,
      message: "Internal Server Error",
      error: error.message,
    };
  }
}

export async function requestMedia(req, res) {
  const {
    userID,
    mediaID,
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
      [mediaID]
    );

    if (existingMedia.length > 0) {
      return res.status(400).json({
        message:
          "A media with this MediaID already exists, try borrowing it instead.",
      });
    }

    // Corrected syntax for checking existing requests
    const [existingRequest] = await pool.query(
      "SELECT * FROM mediarequest WHERE MediaID = ? AND userID = ?",
      [mediaID, userID] // Combine the parameters into a single array
    );

    if (existingRequest.length > 0) {
      return res.status(400).json({
        message: "A media with this MediaID request already exists.",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO mediarequest (userID, MediaID, mTitle, mAuthor, publisher, genre, edition, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        userID,
        mediaID,
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
    const [result] = await pool.query("SELECT * FROM media WHERE MediaID = ?", [
      MediaID,
    ]);
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

    const [borrowedCopies] = await pool.query(
      "SELECT COUNT(*) as borrowedCount FROM mediacopy WHERE MediaID = ? AND status = 'borrowed'",
      [MediaID]
    );

    if (borrowedCopies[0].borrowedCount > 0) {
      return res
        .status(409)
        .json({ message: "Some copies are currently being borrowed." });
    }

    await pool.query("UPDATE media SET is_deleted = 1 WHERE MediaID = ?", [
      MediaID,
    ]);
    await pool.query(
      "UPDATE mediacopy SET status = 'deleted' WHERE MediaID = ?",
      [MediaID]
    );

    res.json({
      message: "Media and all associated copies deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function borrowMedia(req, res) {
  const { userData, media } = req.body;
  
  try {
    // Check if the user has already borrowed a copy of this media
    const [existingBorrow] = await pool.query(
      `SELECT * FROM mediaborrowed 
       JOIN mediacopy ON mediaborrowed.itemID = mediacopy.itemID
       WHERE mediaborrowed.userID = ? AND mediacopy.MediaID = ?`,
      [userData.userID, media.MediaID]
    );

    // If a matching record is found, return a 400 status with a message
    if (existingBorrow.length > 0) {
      if (existingBorrow.some((item) => item.returnDate === null)) {
        return res.status(400).json({
          message: "You have already borrowed this media.",
        });
      }
    }

    // Find the first available itemID for the mediaID
    const [availableCopy] = await pool.query(
      `SELECT itemID FROM mediacopy 
       WHERE MediaID = ? AND status = 'available' 
       ORDER BY itemID ASC 
       LIMIT 1`,
      [media.MediaID]
    );

    // If no available copy is found, return a 404 status with a message
    if (availableCopy.length === 0) {
      return res.status(404).json({
        message: "No available copies of this media.",
      });
    }

    const userID = userData.userID;
    const itemID = availableCopy[0].itemID;

    //Insert the borrow record into the 'mediaborrowed' table
    const [borrowResult] = await pool.query(
      `INSERT INTO mediaborrowed (userID, itemID) VALUES (?, ?)`,
      [userID, itemID]
    );

    // Update the status of the borrowed media copy in the 'mediacopy' table
    const [updateResult] = await pool.query(
      `UPDATE mediacopy SET status = 'borrowed' WHERE itemID = ?`,
      [itemID]
    );

    // Return a success response with a 201 status
    res.status(201).json({
      message: "Media borrowed successfully",
      itemID: itemID,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    // Send an appropriate error response to the client
    return {
      success: false,
      message: "Internal Server Error",
      error: error.message,
    };
  }
}

export async function getMediaCopy(req, res) {
  try {
    const { MediaID } = req.params;

    if (!MediaID) {
      return res.status(400).json({ message: "MediaID is required" });
    }

    const [mediaCopies] = await pool.query(
      `
      SELECT mediacopy.itemID, mediacopy.status
      FROM mediacopy
      WHERE mediacopy.MediaID = ? AND mediacopy.status = 'available'
      `,
      [MediaID]
    );

    res.json(mediaCopies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getMonthlyMediaBorrowed(req, res){
  try{
    const [results] = await pool.query(
      `
      SELECT YEAR(borrowDate) AS year, MONTHNAME(borrowDate) AS month, COUNT(*) AS media_borrowed_count
      FROM mediaborrowed
      GROUP BY YEAR(borrowDate), MONTHNAME(borrowDate);`)

      res.json(results)
  } catch (error){
    res.status(500).json({ message: error.message });
  }
}

export async function getMonthlyMediaRequests(req, res){
  try{
    const [results] = await pool.query(
      `
      SELECT YEAR(requestDate) AS year, MONTHNAME(requestDate) AS month, COUNT(*) AS media_requested_count
      FROM mediarequest
      GROUP BY YEAR(requestDate), MONTHNAME(requestDate);`)

      res.json(results)
  } catch (error){
    res.status(500).json({ message: error.message });
  }
}