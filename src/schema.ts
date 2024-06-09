import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";

export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
});

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const emailVerificationTable = pgTable("email_verification", {
  id: text("id").primaryKey().$defaultFn(nanoid),
  code: text("code").$defaultFn(() => generateRandomString(8, alphabet("0-9"))),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  email: text("email"),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .$defaultFn(() => createDate(new TimeSpan(15, "m"))),
});
