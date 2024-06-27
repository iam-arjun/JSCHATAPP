import express from "express";
import { signup, login, logout, getAllUsers, getOnlineUsers, UploadImg, getProfilePic } from "../CONTROLLERS/auth.controller.js";
import { verifyUser } from "../MIDDLEWARE/verifyUser.js";



const router = express.Router();

router.post("/signup", signup);
router.get("/displayFrns", verifyUser, getAllUsers)
router.post("/login", login)
router.delete('/logout/:id', logout)
router.get('/onlineUsers', getOnlineUsers)

router.post('/uploadimg', UploadImg)
router.get('/getProfile', verifyUser, getProfilePic)




export default router;
