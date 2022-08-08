import express from "express";
//in node must include .js, in React, no need .js
import { signin, signup } from "../controllers/user.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);

export default router;