import { Router } from "express";
import * as adminCollegeDomainController from "./admin.collegeDomain.controller.js";
import { verifyAdmin } from "../../../middleware/auth.middleware.js";
import { requireAuth } from "@clerk/express";
import { validateRequest } from "../../../middleware/validateRequest.js";
import * as validators from "./admin.collegeDomain.validators.js";

const router = Router();

// Apply admin protection to all routes
// router.use(requireAuth(), verifyAdmin);

router.post("/", validateRequest(validators.createCollegeDomainSchema), adminCollegeDomainController.createCollegeDomain);


export default router;
