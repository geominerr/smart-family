import type { Config } from 'jest';
import { cpus } from 'node:os';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@root/(.*)$': '<rootDir>/src/$1',
    '^lodash-es$': 'lodash',
  },
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  maxWorkers: cpus().length - 1,
};

export default config;
