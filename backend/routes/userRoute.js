import express from "express";
import {
  createUser,
  loginUser,
  getUserProfile,
  getUserFine,
  getUserBorrowedBooks,
  getUserBorrowedMedia,
  getUserBorrowedDevice,
  getUserRequestedBooks,
  getUserRequestedMedia,
  getUserRequestedDevice,
  getUserbookHold,
  getUsermediaHold,
  getUserdeviceHold,
  getMonthlyUserRegistrations,
  getTotalFineAmount,
  activeBorrowers,
} from "../controllers/userController.js";
import { authToken } from "../middleware/authMiddleware.js";

const route = express.Router();

route.post("/users/register", createUser);
route.post("/users/login", loginUser);
route.get("/users/:userID", authToken, getUserProfile);
route.get("/users/:userID/fines", getUserFine);
route.get("/users/:userID/booksBorrowed", getUserBorrowedBooks);
route.get("/users/:userID/mediaBorrowed", getUserBorrowedMedia);

route.get("/users/:userID/deviceBorrowed", getUserBorrowedDevice);
route.get("/users/:userID/booksRequested", getUserRequestedBooks);
route.get("/users/:userID/mediaRequested", getUserRequestedMedia);
route.get("/users/:userID/deviceRequested", getUserRequestedDevice);
route.get("/users/:userID/bookHold", getUserbookHold);
route.get("/users/:userID/mediaHold", getUsermediaHold);
route.get("/users/:userID/deviceHold", getUserdeviceHold);
route.get("/user-registrations", getMonthlyUserRegistrations);
route.get("/totalFineAmount", getTotalFineAmount);
route.get("/users/getActiveBorrowers", activeBorrowers);
export default route;
