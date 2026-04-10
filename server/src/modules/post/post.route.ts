import { Router } from "express";
import { authenticate, validateRequest } from "../../middleware/index.js";
import { uploadMiddleware } from "../../middleware/upload.middleware.js";
import { createPost, getAllPosts, getPostById, deletePost, uploadMedia } from "./post.controller.js";
import { createPostSchema, getPostsSchema, postParamsSchema } from "./post.validators.js";

const router = Router();

router.get("/", validateRequest(getPostsSchema), getAllPosts);
router.get("/:id", validateRequest(postParamsSchema), getPostById);

router.post("/", authenticate, validateRequest(createPostSchema), createPost);
router.post("/upload", authenticate, uploadMiddleware, uploadMedia);
router.delete("/:id", authenticate, validateRequest(postParamsSchema), deletePost);

export default router;
