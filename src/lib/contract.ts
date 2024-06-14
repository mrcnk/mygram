import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { userContract } from "./contract/user";

export const Result = z.object({
	success: z.boolean(),
});

const c = initContract();

export const contract = c.router({
	...userContract,
});
