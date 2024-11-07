import express from "express";
import {
  getMedia,
  createMedia,
  getMediaByID,
  returnMedia,
  updateMedia,
  deleteMedia,
  requestMedia,
  getAllMediaRequests,
  mediaRequestAccepted,
  mediaRequestDeny,
} from "../controllers/mediaController.js";
const route = express.Router();

route.get("/media", getMedia);
route.post("/media", createMedia);
route.get("/media/:MediaID", getMediaByID);
route.post("/media/return", returnMedia);
route.put("/media/:MediaID", updateMedia);
route.delete("/media/:MediaID", deleteMedia);
route.post("/media/request", requestMedia);
route.get("/media/request", getAllMediaRequests);
route.put("/media/request/accept/:requestID", mediaRequestAccepted);
route.put("/media/request/deny/:requestID", mediaRequestDeny);

export default route;
