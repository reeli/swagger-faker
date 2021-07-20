export default {
  testEnvironment: "node",
  coverageDirectory: "coverage",
  testRegex: ".*/__tests__/.+\\.(generator|test|spec)\\.(ts|tsx)$",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!__types__/**", "!src/__tests__/**"],
};
