module.exports = [
  {
    ignores: ["node_modules/**"],
  },
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
    },
    rules: {
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^(_|next|error)$",
          caughtErrorsIgnorePattern: "^(_|error)$",
        },
      ],
      "no-console": "off",
    },
  },
];
