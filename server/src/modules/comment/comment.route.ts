import { Router } from "express";
import { authenticate } from "../../middleware/index.js";
import { addComment, getCommentsByPost } from "./comment.controller.js";

const router = Router();

router.get("/:postId", getCommentsByPost);
router.post("/:postId", authenticate, addComment);

export default router;
