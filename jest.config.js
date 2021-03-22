module.exports = {
    roots: ['<rootDir>/src'],
    clearMocks: true,
    collectCoverageFrom: [
      '<rootDir>/src/**/*.ts',
    ],
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    preset: '@shelf/jest-mongodb',
    testEnvironment: 'node',
    testMatch: ['**/*.spec.ts'],
    transform: {
      '.+\\.ts$': 'ts-jest',
    },
  };