import { initClient, initContract } from "@ts-rest/core";
import { z } from "zod";

const SignInSchema = z.object({
  email: z.string().email(),
});

const Result = z.object({
  success: z.boolean(),
});

const c = initContract();

export const contract = c.router({
  signIn: {
    method: "POST",
    path: "/api/signin",
    responses: {
      200: Result,
    },
    body: SignInSchema,
  },
});
