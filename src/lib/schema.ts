import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { nanoid } from "nanoid";
import { TimeSpan, createDate } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";

export const userTable = sqliteTable("user", {
	id: text("id").primaryKey().$defaultFn(nanoid),
	email: text("email").unique(),
	emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
});

export const sessionTable = sqliteTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id),
	expiresAt: integer("expires_at").notNull(),
});

export const emailVerificationTable = sqliteTable("email_verification", {
	id: text("id").primaryKey().$defaultFn(nanoid),
	code: text("code").$defaultFn(() => generateRandomString(8, alphabet("0-9"))),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id),
	email: text("email"),
	expiresAt: integer("expires_at")
		.notNull()
		.$defaultFn(() => createDate(new TimeSpan(15, "m")).valueOf()),
});

export const schema = {
	user: userTable,
	session: sessionTable,
	emailVerification: emailVerificationTable,
};

export const UserSchema = createInsertSchema(userTable);
