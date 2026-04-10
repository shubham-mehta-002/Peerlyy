import { Router } from "express";
import * as adminCollegeController from "./admin.college.controller.js";
import { authenticate, verifyAdmin } from "../../../middleware/auth.middleware.js";
import { validateRequest } from "../../../middleware/validateRequest.js";
import * as validatiors from "./admin.college.validators.js";

const router = Router();

// Apply admin protection to all routes
router.use(authenticate, verifyAdmin);

router.post("/", validateRequest(validatiors.createCollegeSchema), adminCollegeController.createCollege);
router.get("/", adminCollegeController.getAllColleges);
router.patch("/:id", validateRequest(validatiors.updateCollegeSchema), adminCollegeController.updateCollege);
router.patch("/:id/toggle", validateRequest(validatiors.toggleCollegeStatusSchema), adminCollegeController.toggleCollegeStatus);
router.delete("/:id", validateRequest(validatiors.deleteCollegeSchema), adminCollegeController.deleteCollege);

export default router;
