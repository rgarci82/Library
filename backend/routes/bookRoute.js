import express from "express"
import { getBooks, createBook, requestBook, getBookByISBN, updateBook, deleteBook } from "../controllers/bookController.js"

const route = express.Router();

route.get('/books', getBooks);
route.post('/books', createBook)
route.post('/books/request', requestBook)
route.get('/books/:ISBN', getBookByISBN)
route.put('/books/:ISBN', updateBook)
route.delete('/books/:ISBN', deleteBook)

export default route;