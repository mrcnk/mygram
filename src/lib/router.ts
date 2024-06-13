import { tsr } from "@ts-rest/serverless/fetch";
import { contract } from "./contract";
import { userRouter } from "./routers/user";

export const router = tsr.router(contract, {
  ...userRouter,
});
