import express from 'express';
import { requestDevice, getUserDeviceRequests, updateDeviceRequestStatus } from './controllers/deviceRequestController.js';

const router = express.Router();

// Route to request a device
router.post('/', requestDevice);

// Route to get all device requests for a specific user
router.get('/:userID', getUserDeviceRequests);

// Route to update the status of a device request
router.put('/:requestID', updateDeviceRequestStatus);

export default router;