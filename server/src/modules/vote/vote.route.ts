import { Router } from "express";
import { authenticate, validateRequest } from "../../middleware/index.js";
import { toggleVote } from "./vote.controller.js";
import { toggleVoteSchema } from "./vote.validators.js";

const router = Router();

router.post("/:postId", authenticate, validateRequest(toggleVoteSchema), toggleVote);

export default router;
