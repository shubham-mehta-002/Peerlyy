import express, { Application } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/index.js';
import authRoutes from "./modules/auth/auth.route.js";
import { clerkMiddleware } from '@clerk/express'
import webhookRoutes from "./modules/auth/webhook.route.js";
import adminRoutes from "./modules/admin/admin.route.js";

const app: Application = express();

// CORS configuration
app.use(
    cors({
        origin: env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(
    "/api/webhooks/clerk",
    express.raw({ type: "application/json" }),
    webhookRoutes
)


// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(clerkMiddleware())
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

export default app;

