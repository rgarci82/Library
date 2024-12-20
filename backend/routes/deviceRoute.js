import express from "express";
import {
  getDevices,
  createDevice,
  returnDevice,
  holdDevice,
  cancelHold,
  requestDevice,
  getDeviceBySN,
  updateDevice,
  deleteDevice,
  getAllDeviceRequests,
  deviceRequestAccepted,
  deviceRequestDeny,
  borrowDevice,
  getDeviceAvailability,
  getMonthlyDeviceBorrow,
  getMonthlyDeviceRequests,
  mostRequestedDevices,
  listAvailableDevices,
  currentlyBorrowedDevices,
  mostAndLeastBorrowedDevices,
  fulfilledAndUnfulfilledDeviceRequests,
  devicesOnHoldWithUsers,
  requestToFulfillmentDurationForDevices,
} from "../controllers/deviceController.js";

const route = express.Router();

route.post("/devices/getDevices", getDevices);
route.post("/devices", createDevice);
route.post("/devices/return", returnDevice);
route.post("/devices/hold", holdDevice);
route.post("/devices/cancelHold", cancelHold);
route.post("/devices/request", requestDevice);
route.get("/devices/request", getAllDeviceRequests);
route.put("/devices/request/accept/:requestID", deviceRequestAccepted);
route.put("/devices/request/deny/:requestID", deviceRequestDeny);
route.get("/devices/:serialNumber", getDeviceBySN);
route.put("/devices/:serialNumber", updateDevice);
route.post("/devices/borrow", borrowDevice);
route.put("/devices/:serialNumber/softDelete", deleteDevice);
route.get("/devices/:serialNumber/getDeviceAvailability", getDeviceAvailability);
route.get("/devices/borrow/monthly", getMonthlyDeviceBorrow)
route.get("/devices/request/monthly", getMonthlyDeviceRequests)
route.post("/devices/report/getMostRequestedDevices", mostRequestedDevices);
route.post("/devices/report/listAvailableDevices", listAvailableDevices);
route.post("/devices/report/currentlyBorrowedDevices", currentlyBorrowedDevices);
route.post("/devices/report/mostAndLeastBorrowedDevices", mostAndLeastBorrowedDevices);
route.post("/devices/report/fulfilledAndUnfulfilledDeviceRequests", fulfilledAndUnfulfilledDeviceRequests);
route.post("/devices/report/devicesOnHoldWithUsers", devicesOnHoldWithUsers);
route.post("/devices/report/requestToFulfillmentDurationForDevices", requestToFulfillmentDurationForDevices);




export default route;
