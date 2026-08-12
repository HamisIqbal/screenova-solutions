import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "next-env.d.ts",
      // Vendored Claude Code tooling — not project source.
      ".agents/**",
      ".claude/**",
      ".impeccable/**",
    ],
  },
  ...coreWebVitals,
  ...typescript,
];

export default eslintConfig;
