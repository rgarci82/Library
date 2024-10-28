import pool from "../config/db.js";

export async function getDevices(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM device");

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createDevice(req, res) {
  const { serialNumber, dName, brand, model } = req.body;

  try {
    const [existingDevice] = await pool.query(
      "SELECT * FROM device WHERE serialNumber = ?",
      [serialNumber]
    );

    if (existingDevice.length > 0) {
      return res
        .status(400)
        .json({ message: "A device with this serial number already exists." });
    }

    const [result] = await pool.query(
      "INSERT INTO device (serialNumber, dName, brand, model) VALUES (?, ?, ?, ?)",
      [serialNumber, dName, brand || null, model || null]
    );

    res.status(201).json({
      message: "Device created successfully",
      serialNumber: serialNumber,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function requestDevice(req, res) {
  const { userID, serialNumber, deviceTitle, brand, model, status } = req.body;

  try {
    // Check if the book already exists in the 'book' table
    const [existingDevice] = await pool.query(
      "SELECT * FROM device WHERE serialNumber = ?",
      [serialNumber]
    );

    // If a book with this ISBN exists, return a 400 status with a message
    if (existingDevice.length > 0) {
      return res.status(400).json({
        message:
          "A device with this serial number already exists, try borrowing it instead.",
      });
    }

    // Corrected syntax for checking existing requests
    const [existingRequest] = await pool.query(
      "SELECT * FROM devicerequest WHERE serialNumber = ? AND userID = ?",
      [serialNumber, userID] // Combine the parameters into a single array
    );

    if (existingRequest.length > 0) {
      return res.status(400).json({
        message: "A device with this serial number request already exists.",
      });
    }

    // Insert the book request into the 'bookrequest' table
    const [result] = await pool.query(
      "INSERT INTO devicerequest (userID, serialNumber, dName, brand, model, Status) VALUES (?, ?, ?, ?, ?, ?)",
      [userID, serialNumber, deviceTitle, brand, model, status]
    );

    // Return a success response with a 201 status
    res.status(201).json({
      message: "Device request created successfully",
    });
  } catch (error) {
    console.error("Error occurred while requesting a device:", error); // Log the error for debugging
    res.status(500).json({ message: error.message });
  }
}

export async function getAllDeviceRequests(req, res) {
  try {
    // Query to fetch all book requests
    const [deviceRequests] = await pool.query("SELECT * FROM devicerequest");

    // Return the list of book requests
    res.status(200).json(deviceRequests);
  } catch (error) {
    console.error("Error occurred while fetching device requests:", error);
    res.status(500).json({ message: error.message });
  }
}

export async function deviceRequestAccepted(req, res) {
  const { requestID } = req.params;
  try {
    const [requestDetails] = await pool.query(
      "SELECT * FROM devicerequest WHERE requestID = ?",
      [requestID]
    );

    if (requestDetails.length === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    const { serialNumber, dName, brand, model, userID } = requestDetails[0];

    if (
      requestDetails[0].Status === "approved" ||
      requestDetails[0].Status === "denied"
    ) {
      return res
        .status(400)
        .json({ message: "This request has already been processed." });
    }

    await pool.query(
      "INSERT INTO device (serialNumber, dName, brand, model) VALUES (?, ?, ?, ?)",
      [serialNumber, dName, brand || null, model || null]
    );

    await pool.query(
      "UPDATE devicerequest SET Status = 'approved' WHERE requestID = ?",
      [requestID]
    );

    res
      .status(200)
      .json({ message: "Device request accepted and Device created." });
  } catch (error) {
    console.error("Error while accepting device request:", error);
    res.status(500).json({ message: error.message });
  }
}

export async function deviceRequestDeny(req, res) {
  const { requestID } = req.params;

  try {
    const [requestDetails] = await pool.query(
      "SELECT * FROM devicerequest WHERE requestID = ?",
      [requestID]
    );

    if (
      requestDetails[0].Status === "approved" ||
      requestDetails[0].Status === "denied"
    ) {
      return res
        .status(400)
        .json({ message: "This request has already been processed." });
    }

    await pool.query(
      "UPDATE devicerequest SET Status = 'denied' WHERE requestID = ?",
      [requestID]
    );

    res.status(200).json({ message: "Device denied" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getDeviceBySN(req, res) {
  try {
    const { serialNumber } = req.params;
    const [result] = await pool.query(
      "SELECT * FROM device WHERE serialNumber = ?",
      [serialNumber]
    );
    if (result.length == 0) {
      return res.status(404).json({ message: "Device not found" });
    }
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateDevice(req, res) {
  try {
    const { serialNumber } = req.params;
    const { dName, brand, model } = req.body;

    if (!dName) {
      return res.status(400).json({ message: "Device name is required." });
    }

    const [result] = await pool.query(
      "UPDATE device SET dName = ?, brand = ?, model = ? WHERE serialNumber = ?",
      [dName, brand || null, model || null, serialNumber]
    );

    if (result.affectedRows == 0) {
      res.status(404).json({ message: "Device not found" });
    }

    res.json({ message: "Device updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteDevice(req, res) {
  try {
    const { serialNumber } = req.params;

    const [result] = await pool.query(
      "DELETE FROM device WHERE serialNumber = ?",
      [serialNumber]
    );

    if (result.affectedRows == 0) {
      res.status(404).json({ message: "Device not found" });
    }

    res.json({ message: "Device deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
