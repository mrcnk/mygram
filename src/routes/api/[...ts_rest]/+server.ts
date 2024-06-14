import { contract } from "$lib/contract";
import { router } from "$lib/router";
import { lucia } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { fetchRequestHandler, tsr } from "@ts-rest/serverless/fetch";
import { eq } from "drizzle-orm";
import { alphabet, generateRandomString } from "oslo/crypto";
import type { RequestHandler } from "./$types";

// Actually initiate the collective endpoints
export const fallback: RequestHandler = ({ request }) =>
	fetchRequestHandler({ request, contract, router, options: {} });
