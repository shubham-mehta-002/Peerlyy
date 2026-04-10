import { Router } from "express";
import { authenticate, validateRequest } from "../../middleware/index.js";
import { addComment, getCommentsByPost } from "./comment.controller.js";
import { addCommentSchema, getCommentsByPostSchema } from "./comment.validators.js";

const router = Router();

router.get("/:postId", validateRequest(getCommentsByPostSchema), getCommentsByPost);
router.post("/:postId", authenticate, validateRequest(addCommentSchema), addComment);

export default router;
