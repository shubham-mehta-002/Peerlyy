import { Router } from 'express';
import {
  verifyClerkWebhook,
  handleUserCreated,
} from "../../middleware/clerkWebhook.middleware.js"
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

// Clerk webhook endpoint
// This route should be added BEFORE body parsing middleware in app.ts
router.post(
  "/",
  verifyClerkWebhook,
  asyncHandler(async (req, res, next) => {

    const body = JSON.parse(req.body.toString())
    const { type } = body

    req.body = body // replace buffer with JSON

    switch (type) {
      case "user.created":
        await handleUserCreated(req, res, next)
        break
      default:
        res.status(200).json({ received: true })
    }
  })
)


export default router;

