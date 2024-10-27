import express from 'express';
import { getBorrowedMedia, borrowMedia, returnMedia } from '../controllers/mediaBorrowedController.js';
import { authToken } from '../middleware/authMiddleware.js';

const route = express.Router();

// Route to get all media borrowed by a specific user
route.get('/users/:userID/media/borrowed', authToken, getBorrowedMedia);

// Route to borrow media
route.post('/media/borrow', authToken, borrowMedia);

// Route to return borrowed media
route.put('/media/return/:borrowID', authToken, returnMedia);

export default route;
