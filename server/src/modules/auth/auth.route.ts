import { Router } from "express";
import * as authControllers from "./auth.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import * as validators from "./auth.validation.js";

const router = Router();

router.post("/register/init", validateRequest(validators.registerInitSchema), authControllers.registerInit);
router.post("/register/complete", validateRequest(validators.registerCompleteSchema), authControllers.registerComplete);
router.post("/login", validateRequest(validators.loginSchema), authControllers.login);
router.post("/forgot-password", validateRequest(validators.forgotPasswordSchema), authControllers.requestPasswordReset);
router.post("/reset-password", validateRequest(validators.resetPasswordSchema), authControllers.resetPassword);
router.post("/refresh-token", validateRequest(validators.refreshAccessTokenSchema), authControllers.refreshAccessToken)

// router.post("/google", validateRequest(validators.googleLoginSchema), authControllers.googleLogin);
// router.post("/logout", authenticate, authControllers.logout);

export default router;