import { initClient, initContract } from "@ts-rest/core";
import { z } from "zod";
import { UserSchema } from "./schema";

const SignInSchema = z.object({
  email: z.string().email(),
});

const VerifyCodeSchema = z.object({
  code: z.string().length(8),
});

const Result = z.object({
  success: z.boolean(),
});

const c = initContract();

export const contract = c.router({
  signIn: {
    method: "POST",
    path: "/api/signin",
    contentType: "multipart/form-data",
    responses: {
      200: Result,
    },
    body: SignInSchema,
  },
  verifyCode: {
    method: "POST",
    path: "/api/verify",
    contentType: "multipart/form-data",
    responses: {
      200: Result,
      401: Result,
    },
    body: VerifyCodeSchema,
  },
  me: {
    method: "GET",
    path: "/api/me",
    responses: {
      200: UserSchema,
      401: Result,
    },
  },
});
