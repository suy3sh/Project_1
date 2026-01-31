/** @type {import('jest').Config} */
export default {
  testEnvironment: "jsdom",

  setupFiles: ["<rootDir>/src/jest.polyfills.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  testMatch: ["<rootDir>/src/**/*.(test|spec).(ts|tsx)"],

  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }],
  },

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
};