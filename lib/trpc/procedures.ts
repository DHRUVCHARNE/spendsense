import {publicProcedure} from "./init";
import { authMiddleware } from "./middleware/auth-middleware";
import { ipRateLimit, userRateLimit } from "./middleware/rate-limit-middleware";

export const rateLimitedProcedure = publicProcedure.use(ipRateLimit);
export const protectedProcedure = rateLimitedProcedure.use(authMiddleware).use(userRateLimit);