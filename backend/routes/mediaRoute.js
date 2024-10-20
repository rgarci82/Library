import express from "express"
import { getMedia, createMedia, getMediaByID, updateMedia, deleteMedia } from "../controllers/mediaController.js"

const route = express.Router();

route.get("/books", getMedia);
route.post('/books', createMedia)
route.get("/books/:ISBN", getMediaByID)
route.put("/books/:ISBN", updateMedia)
route.delete("/books/:ISBN", deleteMedia)

export default route;