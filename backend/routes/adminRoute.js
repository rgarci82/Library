import express from 'express'
import { createAdmin, getAdminProfile, getAdminReports} from '../controllers/adminController.js'
import { authToken } from '../middleware/authMiddleware.js'

const route = express.Router()

route.post('/admin/register', createAdmin)
route.get('/admin/:AdminID', authToken, getAdminProfile)
route.get('/admin-reports', authToken, getAdminReports);

export default route;