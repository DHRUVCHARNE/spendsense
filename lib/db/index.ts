import "server-only"
// import { config } from "dotenv";
import * as schema from "./schema";
import postgres from "postgres";
import "./relations"
import { drizzle } from "drizzle-orm/postgres-js";
// config({ path: ".env.local" }); 
if(!process.env.DATABASE_URL) throw new Error("Missing DB env vars");

const dbClient = postgres(process.env.DATABASE_URL,{max:11});
export const db = drizzle(dbClient,{schema});
