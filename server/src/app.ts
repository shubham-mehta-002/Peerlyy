import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { notFoundHandler } from './middleware/index.js';
import authRoutes from "./modules/auth/auth.route.js";

const app: Application = express();

// CORS configuration
app.use(
    cors({
        origin: env.CORS_ORIGIN,
        credentials: true,
    })
);


// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());


app.use("/api/auth", authRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
// app.use(errorHandler);

export default app;

