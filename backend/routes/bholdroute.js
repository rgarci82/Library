import express from 'express';
import {
    createBookHold,
    getAllBookHolds,
    getBookHoldById,
    updateBookHold,
    deleteBookHold
} from './controllers/bookHoldController.js';

const router = express.Router();

// Route to create a new book hold
router.post('/', createBookHold);

// Route to get all book holds
router.get('/', getAllBookHolds);

// Route to get a specific book hold by ID
router.get('/:holdID', getBookHoldById);

// Route to update a book hold
router.put('/:holdID', updateBookHold);

// Route to delete a book hold
router.delete('/:holdID', deleteBookHold);

export default router;

