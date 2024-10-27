import express from 'express';
import { requestBook, getUserBookRequests, updateBookRequestStatus } from './controllers/bookRequestController.js';

const router = express.Router();

// Route to request a book
router.post('/', requestBook);

// Route to get all book requests for a specific user
router.get('/:userID', getUserBookRequests);

// Route to update the status of a book request
router.put('/:requestID', updateBookRequestStatus);

export default router;
