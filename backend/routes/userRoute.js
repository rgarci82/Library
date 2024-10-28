import express from 'express'
import { createUser, loginUser, getUserProfile, getUserFine } from '../controllers/userController.js'
import { authToken } from '../middleware/authMiddleware.js'

const route = express.Router()

route.post('/users/register', createUser)
route.post('/users/login', loginUser)
route.get('/users/:userID', authToken, getUserProfile)
route.get('/users/:userID/fines', getUserFine)
route.get('/users/: userID/borrowedBooks',getUserBorrowedBook) 
route.get('/users/: userID/borrowedBooks',getUserBorrowedBook) 
route.get('/users/: userID/borrowedMedia',getUserBorrowedMedia) 
route.get('/users/: userID/borrowedDevice',getUserBorrowedDevice) 
route.get('/users/: userID/RequestedBook',getUserRequestedBook) 
route.get('/users/: userID/RequestedMedia',getUserRequestedMedia) 
route.get('/users/: userID/RequestedDevice',getUserRequestedDevice) 
route.get('/users/: userID/BookHolds',getUserBookHolds) 
route.get('/users/: userID/MediaHolds',getUserMediaHolds) 
route.get('/users/: userID/DeviceHolds',getUserDeviceHolds) 
export default route;