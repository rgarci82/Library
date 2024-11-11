import express from "express";
import {
  getDevices,
  createDevice,
  returnDevice,
  holdDevice,
  requestDevice,
  getDeviceBySN,
  updateDevice,
  deleteDevice,
  getAllDeviceRequests,
  deviceRequestAccepted,
  deviceRequestDeny,
  borrowDevice,
  getMonthlyDeviceBorrow,
  getMonthlyDeviceRequests,
} from "../controllers/deviceController.js";

const route = express.Router();

route.get("/devices", getDevices);
route.post("/devices", createDevice);
route.post("/devices/return", returnDevice);
route.post("/devices/hold", holdDevice);
route.post("/devices/request", requestDevice);
route.get("/devices/request", getAllDeviceRequests);
route.put("/devices/request/accept/:requestID", deviceRequestAccepted);
route.put("/devices/request/deny/:requestID", deviceRequestDeny);
route.get("/devices/:serialNumber", getDeviceBySN);
route.put("/devices/:serialNumber", updateDevice);
route.post("/devices/borrow", borrowDevice);
route.put("/devices/:serialNumber/softDelete", deleteDevice);
route.get("/devices/borrow/monthly", getMonthlyDeviceBorrow)
route.get("/devices/request/monthly", getMonthlyDeviceRequests)

export default route;
