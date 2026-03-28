import nextConfig from "eslint-config-next";

export default [
  ...nextConfig,
  {
    rules: {
      // These rules are disabled to prevent common development warnings
      // from blocking your production build on Vercel.
      "react-hooks/set-state-in-effect": "off",
      "import/no-anonymous-default-export": "off",
    },
  },
  {
    // Ensure these directories are ignored by the linter
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];
