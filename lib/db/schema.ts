import { sql } from "drizzle-orm";
import {
  check,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  primaryKey,
  boolean,
  index,
  unique
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "@auth/core/adapters";

export const roleEnum = pgEnum("role", ["ADMIN", "USER"]);
export const txnTypeEnum = pgEnum("txn_type", ["EXPENSE", "INCOME"]);
export const paymentMethodEnum = pgEnum("payment_method", [
  "UPI",
  "CASH",
  "CARD",
  "NETBANKING",
  "WALLET",
  "BANK_TRANSFER",
  "CHEQUE",
  "EMI",
  "OTHER",
]);
export type PaymentMethodType =(typeof paymentMethodEnum.enumValues)[number];
export type TxnType=(typeof txnTypeEnum.enumValues)[number];
export const users = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("emailVerified", { withTimezone: true }),
  image: text("image"),
  role: roleEnum("role").notNull().default("USER"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
export const categories = pgTable("category",{
  id:uuid("id").defaultRandom().primaryKey(),
  userId:uuid("user_id").notNull().references(()=>users.id,{onDelete:"cascade"}),
  name:varchar("name",{length:50}).notNull(),
  color:varchar("color",{length:20}),
  createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
},(t)=>[
  index("category_user_idx").on(t.userId),
  unique("category_name_unique").on(t.userId,t.name)
]);
export const txns = pgTable(
  "txn",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    txnType: txnTypeEnum("txn_type").notNull(),
    categoryId:uuid("category_id").references(()=>categories.id,{ onDelete:"set null"}),
    amountPaise: integer("amount_paise").notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("INR"),
    description: varchar("description", { length: 400 }),
    paymentMethod: paymentMethodEnum("payment_method")
      .notNull()
      .default("OTHER"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    check("amount_positive", sql`${t.amountPaise} >0`),
    index("txn_user_created_at_idx").on(t.userId, t.createdAt,t.id),
    index("txn_user_type_idx").on(t.userId, t.txnType),
    index("txn_user_payment_idx").on(t.userId, t.paymentMethod),
    index("txn_user_category_idx").on(t.userId,t.categoryId)
  ]
);

//NextAuth Accounts
export const accounts = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    index("account_user_id_idx").on(account.userId),
  ]
);
export const sessions = pgTable(
  "session",
  {
    sessionToken: text("sessionToken").primaryKey(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (t) => [
    index("session_user_id_idx").on(t.userId),
    index("session_expires_idx").on(t.expires),
  ]
);

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (verificationToken) => [
    primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
    index("verification_token_expires_idx").on(verificationToken.expires),
  ]
);
export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
    index("authenticator_user_id_idx").on(authenticator.userId),
  ]
);
