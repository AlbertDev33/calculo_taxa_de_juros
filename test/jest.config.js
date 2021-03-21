/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path');

const root = resolve(__dirname, '..');
const rootConfig = require(`${root}/jest.config.js`);

module.exports = {
  ...rootConfig,
  ...{
    rootDir: root,
    displayName: 'functiona-tests',
    setupFilesAfterEnv: ['<rootDir>/test/jest-setup.ts'],
    testMach: ['<rootDir>/test/**/*.test.ts'],
    transform: {
      '.+\\.ts$': 'ts-jest',
    },
  },
};
