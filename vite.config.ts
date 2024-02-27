import react from "@vitejs/plugin-react-swc";
import { join } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.bpmn", "**/*.xml"],
  resolve: {
    alias: [
      {
        find: /~(.+)/,
        replacement: join(process.cwd(), "node_modules/$1"),
      },
      {
        find: /@\//,
        replacement: join(process.cwd(), "./src") + "/",
      },
    ],
  },
});
