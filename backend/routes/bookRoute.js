import express from "express";
import {
  getBooks,
  createBook,
  getBookCopy,
  borrowBook,
  holdBook,
  requestBook,
  getBookByISBN,
  updateBook,
  deleteBook,
  getAllBookRequests,
  bookRequestAccepted,
  bookRequestDeny,
} from "../controllers/bookController.js";

const route = express.Router();

route.get("/books", getBooks);
route.post("/books", createBook);
route.get("/books/:ISBN/bookcopy", getBookCopy);
route.post("/books/borrow", borrowBook);
route.post("/books/hold", holdBook);
route.post("/books/request", requestBook);
route.get("/books/request", getAllBookRequests);
route.put("/books/request/accept/:requestID", bookRequestAccepted);
route.put("/books/request/deny/:requestID", bookRequestDeny);
route.get("/books/:ISBN", getBookByISBN);
route.put("/books/:ISBN", updateBook);
route.put("/books/:ISBN/softDelete", deleteBook);

export default route;
