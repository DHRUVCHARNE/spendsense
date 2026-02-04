import {Ratelimit} from "@upstash/ratelimit";
import { redis } from "./redis";
import { appInfo } from "@/components/config";

export const createLimiter = new Ratelimit({
    redis,
    limiter:Ratelimit.slidingWindow(appInfo.limitsPerUser.createAttempts,"1m"),
});

export const updateLimiter = new Ratelimit({
    redis,
    limiter:Ratelimit.slidingWindow(appInfo.limitsPerUser.updateAttempts,"1m"),
});

export const deleteLimiter = new Ratelimit({
    redis,
    limiter:Ratelimit.slidingWindow(appInfo.limitsPerUser.deleteAttempts,"1m"),
});

export const fetchLimiter = new Ratelimit({
    redis,
    limiter:Ratelimit.slidingWindow(appInfo.limitsPerUser.fetchAttempts,"1m"),
});

export const authLimiter = new Ratelimit({
    redis,
    limiter:Ratelimit.slidingWindow(appInfo.limitsPerUser.loginAttempts,"1m"),
});