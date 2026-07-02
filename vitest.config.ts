import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    exclude: ["node_modules", "e2e", "cornerstone-agent"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Next's `server-only` marker is not resolvable under vitest — stub it so
      // server-side modules (the AI gateway, meters, services) can be unit-tested.
      "server-only": path.resolve(__dirname, "./src/test/server-only.stub.ts"),
    },
  },
});
