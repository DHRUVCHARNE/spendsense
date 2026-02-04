import "server-only";
import * as schema from "./schema";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import "./relations";

if (!process.env.DATABASE_URL) throw new Error("Missing DATABASE_URL");

const globalForDb = globalThis as unknown as {
  client: ReturnType<typeof postgres> | undefined;
};

const client =
  process.env.NODE_ENV === "production"
    ? postgres(process.env.DATABASE_URL, {
        max: 5,
        idle_timeout: 20,
        connect_timeout: 10,
      })
    : globalForDb.client ??
      postgres(process.env.DATABASE_URL, {
        max: 5,
        idle_timeout: 20,
        connect_timeout: 10,
      });

if (process.env.NODE_ENV !== "production") {
  globalForDb.client = client;
}

export const db = drizzle(client, { schema });