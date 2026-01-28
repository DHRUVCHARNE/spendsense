import "server-only"
import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { accounts, sessions, users, verificationTokens } from "./lib/db/schema";
import { db } from "./lib/db";
import authConfig from "./auth.config";


export const { handlers,signIn,signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session:{strategy:"database"}
  ,
  ...authConfig
});
