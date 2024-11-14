import pool from "../config/db.js";

export async function getDevices(req, res) {
  const { userData } = req.body;

  if (!userData){
    try {
      const [rows] = await pool.query("SELECT * FROM device WHERE is_deleted = 0");
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }  
  }
  else{
    try {
      const [rows] = await pool.query(`SELECT d.*
      FROM device AS d
      WHERE d.is_deleted = 0
      EXCEPT
      SELECT d.*
      FROM device AS d, deviceborrowed AS db
      WHERE db.userID = ? AND d.serialNumber = db.serialNumber AND db.returnDate IS NULL AND is_deleted = 0;
      `, [userData.userID]);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
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

export async function returnDevice(req, res) {
  const { selectedItem } = req.body;

  try {
    const returnDateResult = await pool.query(
      `UPDATE deviceborrowed 
      SET returnDate = NOW()
      WHERE serialNumber = ?`,
      [selectedItem.serialNumber]
    );

    const returnStatusResult = await pool.query(
      `UPDATE device
      SET status = 'available'
      WHERE serialNumber = ?`,
      [selectedItem.serialNumber]
    );

    // Return a success response with a 201 status
    if (returnDateResult && returnStatusResult){
      res.status(201).json({
        message: "Device returned successfully",
      });
    }
  } catch (error) {
    console.error('Error occurred:', error);
    // Send an appropriate error response to the client
    return { success: false, message: 'Internal Server Error', error: error.message };
  }
}

export async function holdDevice(req, res){
  const { userData, selectedHoldItem} = req.body;

  try{
    // Check if the user has already borrowed this device
    const [existingHold] = await pool.query(
      `SELECT * FROM devicehold 
       JOIN device ON devicehold.serialNumber = device.serialNumber
       WHERE devicehold.userID = ? AND device.serialNumber = ?`,
      [userData.userID, selectedHoldItem.serialNumber]
    );

    // If a matching record is found, return a 400 status with a message
    if (existingHold.length > 0) {
      if (existingHold.some(item => item.status === 'OnHold')){
        return res.status(400).json({
          message: "You already have this device on hold.",
        });
      }
    }

    const [holdResult] = await pool.query(
      `INSERT INTO devicehold(userID, serialNumber, status)
      VALUES (?, ?, 'OnHold')`,
      [userData.userID, selectedHoldItem.serialNumber]
    );

    res.status(201).json({
      message: "Device on hold successfully",
    });
  }
  catch (error){
    console.error('Error occured:', error);
    return { success: false, message: 'Internal Server Error', error: error.message };
  }
}

export async function requestDevice(req, res) {
  const { userID, serialNumber, deviceTitle, brand, model, status } = req.body;

  try {
    // Check if the device already exists in the 'device' table
    const [existingDevice] = await pool.query(
      "SELECT * FROM device WHERE serialNumber = ?",
      [serialNumber]
    );

    // If a device with this serialNumber exists, return a 400 status with a message
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

    // Insert the device request into the 'devicerequest' table
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
    // Query to fetch all device requests
    const [deviceRequests] = await pool.query("SELECT * FROM devicerequest");

    // Return the list of device requests
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

    const [device] = await pool.query(
      "SELECT status FROM device WHERE serialNumber = ?",
      [serialNumber]
    );

    if (device.length === 0) {
      res.status(404).json({ message: "Device not found" });
    }

    if (device[0].status === "borrowed") {
      return res.status(409).json({
        message:
          "Device cannot be deleted because it is currently being borrowed.",
      });
    }

    const [result] = await pool.query(
      "UPDATE device SET is_deleted = 1, status = 'deleted' WHERE serialNumber = ?",
      [serialNumber]
    );

    res.json({ message: "Device deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
//borrow device funtion 1, copy paste, change
export async function borrowDevice(req, res) {
  const { userData, device } = req.body;
  try {
    // Check if the user has already borrowed a copy of this device
    const [existingBorrow] = await pool.query(
      `SELECT * 
       FROM deviceborrowed 
       WHERE deviceborrowed.userID = ? AND serialNumber = ?`,
      [userData.userID, device.serialNumber]
    );

    // If a matching record is found, return a 400 status with a message
    if (existingBorrow.length > 0) {
      if (existingBorrow.some(item => item.returnDate === null)){
        return res.status(400).json({
          message: "You have already borrowed this device.",
        });
      }
    }

    // Find the first available serialNumber
    const [availableDevice] = await pool.query(
      `select * from device where serialNumber = ? and status ='available'`,
      [device.serialNumber]
    );

    // If no available device is found, return a 404 status with a message
    if (availableDevice.length === 0) {
      return res.status(404).json({
        message: "This device is currently not available",
      });
    }

    const userID = userData.userID;
   
    const serialNumber = availableDevice[0].serialNumber;

    //Insert the borrow record into the 'deviceborrowed' table
    const [borrowResult] = await pool.query(
      `INSERT INTO deviceborrowed (userID, serialNumber) VALUES (?, ?)`,
      [userID, serialNumber]
    );

    // Update the status of the borrowed device copy in the 'devicecopy' table
    const [updateResult] = await pool.query(
      `UPDATE device SET status = 'borrowed' WHERE serialNumber = ?`,
      [serialNumber]
    );

    // Return a success response with a 201 status
    res.status(201).json({
      message: "Device borrowed successfully",
      serialNumber: serialNumber
    });
  } catch (error) {
    console.error('Error occurred:', error);
    // Send an appropriate error response to the client
    return { success: false, message: 'Internal Server Error', error: error.message };
  }
}

export async function getMonthlyDeviceBorrow(req, res){
  try{
    const [results] = await pool.query(
      `
      SELECT YEAR(borrowDate) AS year, MONTHNAME(borrowDate) AS month, COUNT(*) AS devices_borrowed_count
      FROM deviceborrowed
      GROUP BY YEAR(borrowDate), MONTHNAME(borrowDate);`)

      res.json(results)
  } catch (error){
    res.status(500).json({ message: error.message });
  }
}

export async function getMonthlyDeviceRequests(req, res){
  try{
    const [results] = await pool.query(
      `
      SELECT YEAR(requestDate) AS year, MONTHNAME(requestDate) AS month, COUNT(*) AS devices_requested_count
      FROM devicerequest
      GROUP BY YEAR(requestDate), MONTHNAME(requestDate);`)
      
      res.json(results)
  } catch (error){
    res.status(500).json({ message: error.message });
  }
}