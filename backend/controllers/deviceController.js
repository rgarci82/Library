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
