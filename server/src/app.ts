import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { notFoundHandler, errorHandler } from './middleware/index.js';
import authRoutes from "./modules/auth/auth.route.js";
import collegeRoutes from "./modules/admin/college/admin.college.route.js";
import collegeDomainRoutes from "./modules/admin/collegeDomain/admin.collegeDomain.route.js";

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
app.use("/api/admin/college", collegeRoutes)
app.use("/api/admin/college-domain", collegeDomainRoutes)


// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

export default app;

