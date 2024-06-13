import { tsr } from "@ts-rest/serverless/fetch";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { alphabet, generateRandomString } from "oslo/crypto";
import { lucia } from "$lib/server/auth";
import { resend, sendSignInCode } from "$lib/server/mail";
import { contract } from "$lib/contract";
import { emailVerificationTable, userTable } from "$lib/schema";
import type { User } from "lucia";
import { isWithinExpirationDate } from "oslo";
import dayjs from "dayjs";

const ensureUser = async (email: string) => {
  const user = await db.query.user.findFirst({
    where: eq(userTable.email, email),
  });
  if (user) return user;
  return (
    await db
      .insert(userTable)
      .values({
        email,
      })
      .returning()
  )[0];
};

const validateVerificationCode = async ({
  user,
  code,
}: {
  user: User;
  code: string;
}) => {
  const dbCode = await db.query.emailVerification.findFirst({
    where: eq(emailVerificationTable.userId, user.id),
  });
  if (!dbCode || dbCode.code !== code) {
    return false;
  }
  await db
    .delete(emailVerificationTable)
    .where(eq(emailVerificationTable.id, dbCode.id));
  if (!isWithinExpirationDate(dayjs(dbCode.expiresAt).toDate())) return false;
  if (dbCode.email !== user.email) return false;
  return true;
};

export const userRouter = tsr.router(contract, {
  signIn: async ({ body }, { responseHeaders }) => {
    const user = await ensureUser(body.email);
    await db
      .delete(emailVerificationTable)
      .where(eq(emailVerificationTable.userId, user.id));
    const codeValue = generateRandomString(8, alphabet("0-9"));
    const [verificationCode] = await db
      .insert(emailVerificationTable)
      .values({
        code: codeValue,
        email: user.email,
        userId: user.id,
      })
      .returning();
    if (!verificationCode.code)
      throw new Error("Verification code creation error.");
    await sendSignInCode({ code: verificationCode.code, email: body.email });
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    responseHeaders.set("Set-Cookie", sessionCookie.serialize());
    return {
      status: 200,
      body: { success: true },
    };
  },
  verifyCode: async ({ body }, { responseHeaders, request }) => {
    const cookieHeader = request.headers.get("Cookie");
    const sessionId = lucia.readSessionCookie(cookieHeader ?? "");
    if (!sessionId) {
      return {
        status: 401,
        body: { success: false },
      };
    }
    const { user } = await lucia.validateSession(sessionId);
    if (!user) {
      return {
        status: 401,
        body: { success: false },
      };
    }
    const codeValid = validateVerificationCode({ user, code: body.code });
    if (!codeValid) {
      return {
        status: 401,
        body: { success: false },
      };
    }
    await lucia.invalidateUserSessions(user.id);
    await db
      .update(userTable)
      .set({ emailVerified: "true" })
      .where(eq(userTable.id, user.id));
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    return {
      status: 200,
      body: { success: true },
    };
  },
});
