import { Router } from "express";
import * as authControllers from "./user.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import * as validators from "./user.validation.js";

const router = Router();

router.post("/register/init", validateRequest(validators.registerInitSchema), authControllers.registerInit);
router.post("/register/complete", validateRequest(validators.registerCompleteSchema), authControllers.registerComplete);
router.post("/login", validateRequest(validators.loginSchema), authControllers.login);
router.post("/forgot-password", validateRequest(validators.forgotPasswordSchema), authControllers.requestPasswordReset);
router.post("/reset-password", validateRequest(validators.resetPasswordSchema), authControllers.resetPassword);
router.post("/refresh-token", validateRequest(validators.refreshAccessTokenSchema), authControllers.refreshAccessToken)
router.post("/logout", authenticate, authControllers.logout);

// router.post("/google", validateRequest(validators.googleLoginSchema), authControllers.googleLogin);
// router.post("/logout", authenticate, authControllers.logout);

export default router;