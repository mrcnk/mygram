import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  dbCredentials: {
    url: "sqlite.db",
  },
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
});
