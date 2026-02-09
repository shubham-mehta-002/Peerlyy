import { Router } from "express";
import * as adminCollegeController from "./admin.college.controller.js";
import { verifyAdmin } from "../../../middleware/auth.middleware.js";
import { requireAuth } from "@clerk/express";
import { validateRequest } from "../../../middleware/validateRequest.js";
import * as validatiors from "./admin.college.validators.js";

const router = Router();

// Apply admin protection to all routes
// router.use(requireAuth(), verifyAdmin);

router.post("/", validateRequest(validatiors.createCollegeSchema), adminCollegeController.createCollege);
router.patch("/:id", validateRequest(validatiors.updateCollegeSchema), adminCollegeController.updateCollege);
router.delete("/:id", validateRequest(validatiors.deleteCollegeSchema), adminCollegeController.deleteCollege);

export default router;
