import { createClient } from "redis";
import { env } from "./env.js";

export const redis = createClient({
    url: env.REDIS_URL
});

redis.on("error", (err) => console.error("Redis Error", err));

export const connectRedis = async () => await redis.connect();
