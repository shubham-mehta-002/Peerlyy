import { Router } from "express";
import * as adminCollegeDomainController from "./admin.collegeDomain.controller.js";
import { authenticate, verifyAdmin } from "../../../middleware/auth.middleware.js";
import { validateRequest } from "../../../middleware/validateRequest.js";
import * as validators from "./admin.collegeDomain.validators.js";

const router = Router();

// Apply admin protection to all routes
router.use(authenticate, verifyAdmin);

router.get("/", validateRequest(validators.getCollegeDomainsSchema), adminCollegeDomainController.getCollegeDomains);
router.post("/", validateRequest(validators.createCollegeDomainSchema), adminCollegeDomainController.createCollegeDomain);
router.patch("/:id/toggle", validateRequest(validators.toggleCollegeDomainStatusSchema), adminCollegeDomainController.toggleCollegeDomainStatus);
router.delete("/:id", validateRequest(validators.deleteCollegeDomainSchema), adminCollegeDomainController.deleteCollegeDomain);

export default router;
