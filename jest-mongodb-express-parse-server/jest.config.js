/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
  // use mongodb as preset instead of ts-jest
  preset: '@shelf/jest-mongodb',
  testEnvironment: 'node',
  // allow only files with .spec.ts or .test.ts extension
  testMatch: ['**/__tests__/?(*.)+(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['./__tests__/jest.setup.ts'],
  transformIgnorePatterns: ["/node_modules/(?!@parse)"],
  watchPathIgnorePatterns: ['globalConfig'],
  verbose: true,
  testPathIgnorePatterns: [
    "<rootDir>/dist/",
    '/node_modules/',
  ],
  /**
   * Map the @ alias to the src directory
   * Should be the same as the paths in tsconfig.json
   */
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
  // workaround for "Exceeded timeout of 5000 ms for a hook" issue
  testTimeout: 80000,
  // moduleDirectories: ["node_modules", "<rootdir>/__tests__/"],
  transform: {
    "(\\.ts$|@parse)":  ["ts-jest", {}],

    '^.+\\.(js|jsx)$': 'babel-jest',
    // "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/file.js",
  }
};
