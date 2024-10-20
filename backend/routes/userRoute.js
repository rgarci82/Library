import express from 'express'
import { createUser, loginUser, getUserProfile } from '../controllers/userController.js'
import { authToken } from '../middleware/authMiddleware.js'

const route = express.Router()

route.post('/users/register', createUser)
route.post('/users/login', loginUser)
route.get('/users/:userID', authToken, getUserProfile)

export default route;