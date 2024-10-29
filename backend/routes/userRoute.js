import express from 'express'
import { createUser, loginUser, getUserProfile, getUserFine, getUserBorrowedBooks, getUserBorrowedMedia,getUserBorrowedDevice, getUserRequestedBooks, getUserRequestedMedia } from '../controllers/userController.js'
import { authToken } from '../middleware/authMiddleware.js'

const route = express.Router()

route.post('/users/register', createUser)
route.post('/users/login', loginUser)
route.get('/users/:userID', authToken, getUserProfile)
route.get('/users/:userID/fines', getUserFine)
route.get('/users/:userID/booksBorrowed', getUserBorrowedBooks)
route.get('/users/:userID/mediaBorrowed', getUserBorrowedMedia)

route.get('/users/:userID/deviceBorrowed', getUserBorrowedDevice)
route.get('/users/:userID/booksRequested', getUserRequestedBooks)
route.get('/users/:userID/mediaRequested', getUserRequestedMedia)
export default route 