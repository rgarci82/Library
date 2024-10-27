import express from 'express';
import { requestMedia, getUserMediaRequests, updateMediaRequestStatus } from '../controllers/mediaRequestController.js';

const router = express.Router();

// Route to request media
router.post('/request', requestMedia);

// Route to get all media requests for a specific user
router.get('/user/:userID', getUserMediaRequests);

// Route to update the status of a media request
router.put('/request/:requestID/status', updateMediaRequestStatus);

export default router;

