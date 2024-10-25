import express from 'express'
import { createAdmin, loginAdmin, getAdminProfile } from '../controllers/adminController.js'
import { authToken } from '../middleware/authMiddleware.js'

const route = express.Router()

route.post('/admin/register', createAdmin)
route.post('/admin/login', loginAdmin)
route.get('/admin/:AdminID', authToken, getAdminProfile)

export default route;