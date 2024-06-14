<script lang="ts">
import { contract } from "$lib/contract";
import { generateOpenApi } from "@ts-rest/open-api";
import { onMount } from "svelte";
import { SwaggerUIBundle } from "swagger-ui-dist";
import "swagger-ui-dist/swagger-ui.css";

export const API_VERSION = "0.0.1";

onMount(async () => {
	const openApiDocument = generateOpenApi(contract, {
		info: {
			title: "Mygram",
			version: API_VERSION,
		},
	});
	SwaggerUIBundle({
		spec: openApiDocument,
		dom_id: "#swaggerContainer",
	});
});
</script>

<svelte:head><title>Mygram API ({API_VERSION})</title></svelte:head>

<div class="flex min-h-screen justify-center bg-white">
    <div id="swaggerContainer" class="w-full" />
</div>
