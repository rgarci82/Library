import express from 'express';
import {
    createDeviceHold,
    getAllDeviceHolds,
    getDeviceHoldById,
    updateDeviceHold,
    deleteDeviceHold
} from './controllers/deviceHoldController.js';

const router = express.Router();

// Route to create a new device hold
router.post('/', createDeviceHold);

// Route to get all device holds
router.get('/', getAllDeviceHolds);

// Route to get a specific device hold by ID
router.get('/:holdID', getDeviceHoldById);

// Route to update a device hold
router.put('/:holdID', updateDeviceHold);

// Route to delete a device hold
router.delete('/:holdID', deleteDeviceHold);

export default router;
