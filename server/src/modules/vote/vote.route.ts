import { Router } from "express";
import { authenticate } from "../../middleware/index.js";
import { toggleVote } from "./vote.controller.js";

const router = Router();

router.post("/:postId", authenticate, toggleVote);

export default router;
