import express from "express"
import { getMedia, createMedia, getMediaByID, updateMedia, deleteMedia } from "../controllers/mediaController.js"

const route = express.Router();

route.get('/media', getMedia);
route.post('/media', createMedia)
route.get('/media/:MediaID', getMediaByID)
route.put('/media/:MediaID', updateMedia)
route.delete('/media/:MediaID', deleteMedia)

export default route;