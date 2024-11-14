import express from "express";
import {
  getMedia,
  createMedia,
  getMediaByID,
  returnMedia,
  holdMedia,
  updateMedia,
  deleteMedia,
  requestMedia,
  getAllMediaRequests,
  mediaRequestAccepted,
  mediaRequestDeny,
  borrowMedia,
  getMediaCopy,
  getMonthlyMediaBorrowed,
  getMonthlyMediaRequests,
} from "../controllers/mediaController.js";
const route = express.Router();

route.get("/media", getMedia);
route.post("/media", createMedia);
route.get("/media/:MediaID", getMediaByID);
route.post("/media/return", returnMedia);
route.post("/media/hold", holdMedia);
route.put("/media/:MediaID", updateMedia);
route.post("/media/request", requestMedia);
route.get("/media/request/all", getAllMediaRequests);
route.put("/media/request/accept/:requestID", mediaRequestAccepted);
route.put("/media/request/deny/:requestID", mediaRequestDeny);
route.put("/media/:MediaID", updateMedia);
route.put("/media/:MediaID/softDelete", deleteMedia);
route.post("/media/borrow", borrowMedia);
route.get("/media/:MediaID/mediacopy", getMediaCopy);
route.get("/media/borrow/monthly", getMonthlyMediaBorrowed)
route.get("/media/request/monthly", getMonthlyMediaRequests)

export default route;
