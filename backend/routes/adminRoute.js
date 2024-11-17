import express from 'express'
import { createAdmin, postAdminProfile, postAdminReports} from '../controllers/adminController.js'
import { authToken } from '../middleware/authMiddleware.js'

const route = express.Router()

route.post('/admin/register', createAdmin)
route.post('/admin/:AdminID', authToken, postAdminProfile)
route.post('/admin/adminreports', postAdminReports);

export default route;