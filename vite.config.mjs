import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import polyfillNode from "rollup-plugin-polyfill-node";

export default defineConfig({
  server: {
    host: "::",
    port: 8081,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
    cors: true,
  },
  plugins: [
    react(),
    polyfillNode(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@mapbox/node-pre-gyp": path.resolve(__dirname, "src/stubs/empty.js"),
      "@tensorflow/tfjs-node": path.resolve(__dirname, "src/stubs/tfjs-node.js"),
      fs: path.resolve(__dirname, "src/stubs/empty.js"),
      util: path.resolve(__dirname, "src/stubs/util.js"),
      "node:events": "events",
      "node:buffer": "buffer",
      mssql: path.resolve(__dirname, "src/stubs/empty.js"),
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    "process.env.VITE_API_URL": JSON.stringify("http://localhost:8080"),
  },
  optimizeDeps: {
    exclude: [
      "aws-sdk",
      "nock",
      "mock-aws-s3",
      "@mapbox/node-pre-gyp",
      "@tensorflow/tfjs-node",
      "fs",
      "util",
      "mssql",
      "buffer",
      "events",
    ],
  },
  build: {
    rollupOptions: {
      external: [
        "aws-sdk",
        "nock",
        "mock-aws-s3",
        "@mapbox/node-pre-gyp",
        "@tensorflow/tfjs-node",
        "fs",
        "util",
        "mssql",
        "buffer",
        "events",
      ],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  esbuild: {
    loader: {
      ".html": "text",
    },
  },
  assetsInclude: ["**/*.html"],
});