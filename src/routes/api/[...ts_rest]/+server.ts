import { fetchRequestHandler, tsr } from "@ts-rest/serverless/fetch";
import { contract } from "./contract";
import type { RequestHandler } from "./$types";

const router = tsr.router(contract, {
  signIn: async ({ body }) => {
    return {
      status: 200,
      body: { success: true },
    };
  },
});

// Actually initiate the collective endpoints
export const fallback: RequestHandler = ({ request }) =>
  fetchRequestHandler({ request, contract, router, options: {} });
