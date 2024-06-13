import { fetchRequestHandler, tsr } from "@ts-rest/serverless/fetch";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { alphabet, generateRandomString } from "oslo/crypto";
import { lucia } from "$lib/server/auth";
import { contract } from "$lib/contract";
import { router } from "$lib/router";

// Actually initiate the collective endpoints
export const fallback: RequestHandler = ({ request }) =>
  fetchRequestHandler({ request, contract, router, options: {} });
