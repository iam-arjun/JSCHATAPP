import express from "express";
import { sendmsg, getMsgs } from '../CONTROLLERS/msg.controller.js'
import { verifyUser } from "../MIDDLEWARE/verifyUser.js";


const router = express.Router();


router.post("/sendmsg", sendmsg);

router.get("/getmsgs", verifyUser, getMsgs);
export default router