import { initClient } from "@ts-rest/core";
import { contract } from "./contract";

export const client = initClient(contract, {
	baseUrl: "http://localhost:5173",
});
