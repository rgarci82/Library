import express from "express";
import {
  getBooks,
  createBook,
  getBookCopy,
  borrowBook,
  returnBook,
  holdBook,
  cancelHold,
  requestBook,
  getBookByISBN,
  updateBook,
  deleteBook,
  getAllBookRequests,
  bookRequestAccepted,
  bookRequestDeny,
  getMonthlyBookBorrowed,
  getMonthlyBookRequests,
} from "../controllers/bookController.js";

const route = express.Router();

route.post("/books/getBooks", getBooks);
route.post("/books", createBook);
route.get("/books/:ISBN/bookcopy", getBookCopy);
route.post("/books/borrow", borrowBook);
route.post("/books/return", returnBook);
route.post("/books/hold", holdBook);
route.post("/books/cancelHold", cancelHold);
route.post("/books/request", requestBook);
route.get("/books/request", getAllBookRequests);
route.put("/books/request/accept/:requestID", bookRequestAccepted);
route.put("/books/request/deny/:requestID", bookRequestDeny);
route.get("/books/:ISBN", getBookByISBN);
route.put("/books/:ISBN", updateBook);
route.put("/books/:ISBN/softDelete", deleteBook);
route.get("/books/borrow/monthly", getMonthlyBookBorrowed)
route.get("/books/request/monthly", getMonthlyBookRequests)

export default route;
