const path = require("path");
const prettierConfig = require("../prettier");

const rootDir = path.join(__dirname, "../..");

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: require.resolve("../../tsconfig.json"),
    tsconfigRootDir: path.join(__dirname, "../.."),
    warnOnUnsupportedTypeScriptVersion: false,
  },
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  plugins: ["@typescript-eslint", "import", "eslint-comments", "jest", "spellcheck", "prettier"],
  extends: [
    "plugin:eslint-comments/recommended",
    "plugin:import/typescript",
    "airbnb-base",
    "airbnb-typescript/base",
    "plugin:jest/recommended",
    "prettier",
  ],
  // TODO: lint eslintrc.js as well
  // https://typescript-eslint.io/docs/linting/type-linting#i-get-errors-telling-me-the-file-must-be-included-in-at-least-one-of-the-projects-provided
  ignorePatterns: [".eslintrc.js", "node_modules", "build", "data", "generated-aidbox-cli-types.ts", "new_gen", "coverage"],
  rules: {
    // What we choose to disable
    "@typescript-eslint/ban-ts-comment": "off", // we do not abuse it anyway
    "@typescript-eslint/explicit-module-boundary-types": "off", // no reason to use with no-explicit-any
    "no-alert": "off", // we use window.confirm()
    "arrow-body-style": "off", // it makes code harder to refactor
    "import/prefer-default-export": "off", // named exports are fine
    "@typescript-eslint/lines-between-class-members": "off", // It's ok to have no lines between class members
    "max-classes-per-file": "off", // We almost do not use classes anyway

    // Customization
    "import/no-cycle": "error",
    "import/extensions": ["error", "never", { mjs: "always", cjs: "always" }],
    "eslint-comments/no-unused-disable": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "eslint-comments/disable-enable-pair": ["error", { allowWholeFile: true }],
    "func-names": "error",
    "no-constant-condition": "error",
    "jest/no-standalone-expect": "off",
    "no-restricted-syntax": [
      "error",
      {
        selector: "ForInStatement",
        message:
          "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.",
      },
      {
        selector: "LabeledStatement",
        message: "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
      },
      {
        selector: "WithStatement",
        message: "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
      },
    ],

    // TODO: fix this errors and enable rules
    "@typescript-eslint/no-explicit-any": "warn",
    "prettier/prettier": ["warn", prettierConfig],
    "no-console": "warn",
    "@typescript-eslint/no-shadow": "warn",
    "prefer-template": "warn",
    "no-param-reassign": "warn",
    "no-unneeded-ternary": "warn",
    "import/no-extraneous-dependencies": [
      "warn",
      { devDependencies: ["**/*.test.*", "**/*.integration.ts", path.join(rootDir, "scripts/**/*")] },
    ],
    "no-await-in-loop": "warn",
    "object-shorthand": "warn",
    "@typescript-eslint/no-use-before-define": "warn",
    "@typescript-eslint/dot-notation": "warn",
    "no-nested-ternary": "warn",
    "import/no-duplicates": "warn",
    "import/order": "warn",
    "no-else-return": "warn",
    "no-restricted-globals": "warn",
    radix: "warn",
    "operator-assignment": "warn",
    "prefer-destructuring": "warn",
    "@typescript-eslint/naming-convention": "warn",
    "array-callback-return": "warn",
    "import/newline-after-import": "warn",
    "prefer-const": "warn",
    "spaced-comment": "warn",
    eqeqeq: "warn",
    "consistent-return": "warn",
    "jest/valid-describe-callback": "off",
    "jest/no-conditional-expect": "warn",
    "jest/valid-title": "warn",
    "no-plusplus": "warn",
    "no-promise-executor-return": "warn",
    "@typescript-eslint/return-await": "warn",
    "no-continue": "warn",
    "@typescript-eslint/no-throw-literal": "warn",
    "@typescript-eslint/default-param-last": "warn",
    "no-useless-computed-key": "warn",
    "function-paren-newline": "off",
  },
};
