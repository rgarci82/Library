import express from 'express';
import {
    createMediaHold,
    getAllMediaHolds,
    getMediaHoldById,
    updateMediaHold,
    deleteMediaHold
} from './controllers/mediaHoldController.js';

const router = express.Router();

// Route to create a new media hold
router.post('/', createMediaHold);

// Route to get all media holds
router.get('/', getAllMediaHolds);

// Route to get a specific media hold by ID
router.get('/:holdID', getMediaHoldById);

// Route to update a media hold
router.put('/:holdID', updateMediaHold);

// Route to delete a media hold
router.delete('/:holdID', deleteMediaHold);

export default router;
