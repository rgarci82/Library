import express from 'express';
import { getBorrowedBooks, borrowBook, returnBook } from '../controllers/bookBorrowedController.js';
import { authToken } from '../middleware/authMiddleware.js';

const route = express.Router();


route.get('/users/:userID/books/borrowed', authToken, getBorrowedBooks);


route.post('/books/borrow', authToken, borrowBook);


route.put('/books/return/:borrowID', authToken, returnBook);

export default route;

