import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      boundaries,
    },
    settings: {
      "boundaries/elements": [
        { type: "platform", pattern: "src/platform/*" },
        { type: "core", pattern: "src/core/*" },
        { type: "modes", pattern: "src/modes/*" },
        { type: "compliance", pattern: "src/compliance/*" },
        { type: "packs", pattern: "src/packs/*" }
      ]
    },
    rules: {
      "boundaries/element-types": [
        "error",
        {
          default: "allow",
          rules: [
            {
              from: "core",
              disallow: ["packs", "compliance", "modes"]
            },
            {
              from: "platform",
              disallow: ["core", "packs", "compliance", "modes"]
            },
            {
              from: "packs",
              disallow: ["packs"]
            }
          ]
        }
      ]
    }
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
