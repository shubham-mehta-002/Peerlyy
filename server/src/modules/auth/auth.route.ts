import { Router } from "express";
import { getAllUsers } from "./auth.controller.js";

const router = Router();

router.get("/", getAllUsers);

export default router;