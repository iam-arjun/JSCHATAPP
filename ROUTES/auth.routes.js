import express from "express";
import { signup, login, logout, getAllUsers } from "../CONTROLLERS/auth.controller.js";


const router = express.Router();

router.post("/signup", signup);
router.post("/displayFrns", getAllUsers)
router.post("/login", login)
router.get('/logout', logout)




export default router;
