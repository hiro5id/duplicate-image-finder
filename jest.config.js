module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
      '**/*.test.ts'
  ],
  testPathIgnorePatterns: [],
  coverageReporters: ['lcov', 'text-summary'],
  coverageProvider: 'babel',
  coverageDirectory: 'coverage/',
  collectCoverage: true,
  testTimeout: 60000,
};
