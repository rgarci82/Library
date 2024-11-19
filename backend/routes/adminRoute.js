import express from 'express'
import { createAdmin, getAdminProfile , getAdminReport, postAllBooksBorrowed, postMostBooksBorrowed, postMostRequestedBooks,postAllBookRequested ,
    postAllMediaBorrowed, postMostMediaBorrowed, postAllMediaRequested,postMostRequestedMedia} from '../controllers/adminController.js'
import { authToken } from '../middleware/authMiddleware.js'

const route = express.Router()

route.post('/admin/register', createAdmin)
route.get('/admin/:AdminID', authToken, getAdminProfile)
route.get('/admin/:Adminreport', authToken, getAdminReport)
route.post('/admin/allborrowedbooks', postAllBooksBorrowed);
route.post('/admin/mostborrowedbooks', postMostBooksBorrowed);
route.post('/admin/allrequestedbooks', postAllBookRequested );
route.post('/admin/mostrequestedbooks',  postMostRequestedBooks);
route.post('/admin/allborrowedmedia', postAllMediaBorrowed);
route.post('/admin/mostborrowedmedia', postMostMediaBorrowed);
route.post('/admin/allrequestedmedia', postAllMediaRequested );
route.post('/admin/mostrequestedmedia',  postMostRequestedMedia);

export default route;