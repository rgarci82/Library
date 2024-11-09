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
  borrowMedia,
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
route.get("/media/:MediaID", getMediaByID);
route.put("/media/:MediaID", updateMedia);
route.put("/media/:MediaID/softDelete", deleteMedia);
route.post("/media/borrow", borrowMedia);

export default route;
