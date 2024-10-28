import express from 'express'
import { getDevices, createDevice, requestDevice, getDeviceBySN, updateDevice, deleteDevice } from '../controllers/deviceController.js'

const route = express.Router();

route.get('/devices', getDevices);
route.post('/devices', createDevice)
route.post('/devices/request', requestDevice)
route.get('/devices/:serialNumber', getDeviceBySN)
route.put('/devices/:serialNumber', updateDevice)
route.delete('/devices/:serialNumber', deleteDevice)

export default route;