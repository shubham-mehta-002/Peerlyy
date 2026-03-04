import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";
import { connectRedis, redis } from "./config/redis.js";
import { seedAdminUser } from "./utils/seedAdmin.js";

const PORT = env.PORT || 5000;

async function startServer() {
    try {
        // connect DB
        await prisma.$connect();
        console.log("Database connected");

        await connectRedis();
        console.log("Redis connected");

        // Seed admin user if database is empty
        await seedAdminUser();

        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        // graceful shutdown
        const shutdown = async () => {
            console.log("Gracefully shutting down...");
            await prisma.$disconnect();
            await redis.quit();
            server.close(() => {
                console.log("Server closed");
                process.exit(0);
            });
        };

        process.on("SIGINT", shutdown);
        process.on("SIGTERM", shutdown);

    } catch (error) {
        console.error("Server startup failed:", error);
        process.exit(1);
    }
}

startServer();
