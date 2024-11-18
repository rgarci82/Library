import express from 'express'
import { createAdmin, getAdminProfile , getAdminReport,postMostBooksBorrowed, postMostRequestedBooks,postMostRequestedMedia} from '../controllers/adminController.js'
import { authToken } from '../middleware/authMiddleware.js'

const route = express.Router()

route.post('/admin/register', createAdmin)
route.get('/admin/:AdminID', authToken, getAdminProfile)
route.get('/admin/:Adminreport', authToken, getAdminReport)
route.post('/admin/mostborrowedbooks', postMostBooksBorrowed);
route.post('/admin/mostrequestedbooks',  postMostRequestedBooks);
route.post('/admin/mostrequestedmedia',  postMostRequestedMedia);
export default route;