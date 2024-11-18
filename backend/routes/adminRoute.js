import express from 'express'
import { createAdmin, getAdminProfile , getAdminReport,postAvailableBookCopies, postMostRequestedBooks} from '../controllers/adminController.js'
import { authToken } from '../middleware/authMiddleware.js'

const route = express.Router()

route.post('/admin/register', createAdmin)
route.get('/admin/:AdminID', authToken, getAdminProfile)
route.get('/admin/:Adminreport', authToken, getAdminReport)
route.post('/admin/available-books', postAvailableBookCopies);
route.post('/admin/mostrequestedbooks',  postMostRequestedBooks);
export default route;