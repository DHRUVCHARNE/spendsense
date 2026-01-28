import { relations } from "drizzle-orm";
import {
  users,
  txns,
  accounts,
  sessions,
  authenticators,
  categories,
} from "./schema";
export const usersRelations = relations(users, ({ many }) => ({
  txns: many(txns),
  accounts: many(accounts),
  sessions: many(sessions),
  authenticators: many(authenticators),
  categories:many(categories)
}));
export const txnsRelations = relations(txns, ({ one }) => ({
  user: one(users, {
    fields: [txns.userId],
    references: [users.id],
  }),
  category:one(categories,{
    fields:[txns.categoryId],
    references:[categories.id]
  })
}));
export const categoryRelations=relations(categories,({one,many})=>({
  txns:many(txns),
  user:one(users,{
    fields:[categories.userId],
    references:[users.id]
  })
   
}));
export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
export const authenticatorsRelations = relations(authenticators, ({ one }) => ({
  user: one(users, {
    fields: [authenticators.userId],
    references: [users.id],
  }),
}));
