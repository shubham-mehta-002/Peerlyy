import { Router } from "express";
import { authenticate, validateRequest } from "../../middleware/index.js";
import { uploadMiddleware } from "../../middleware/upload.middleware.js";
import { createPost, getAllPosts, getPostById, deletePost, uploadMedia } from "./post.controller.js";
import { createPostSchema, getPostsSchema } from "./post.validators.js";

const router = Router();

router.get("/", validateRequest(getPostsSchema), getAllPosts);
router.get("/:id", getPostById);

router.post("/", authenticate, validateRequest(createPostSchema), createPost);
router.post("/upload", authenticate, uploadMiddleware, uploadMedia);
router.delete("/:id", authenticate, deletePost);

export default router;
