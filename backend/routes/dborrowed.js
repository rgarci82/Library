import express from 'express';
import { getBorrowedDevices, borrowDevice, returnDevice } from '../controllers/deviceBorrowedController.js';
import { authToken } from '../middleware/authMiddleware.js';

const route = express.Router();

// Route to get all devices borrowed by a specific user
route.get('/users/:userID/devices/borrowed', authToken, getBorrowedDevices);

// Route to borrow a device
route.post('/devices/borrow', authToken, borrowDevice);

// Route to return a borrowed device
route.put('/devices/return/:borrowID', authToken, returnDevice);

export default route;
