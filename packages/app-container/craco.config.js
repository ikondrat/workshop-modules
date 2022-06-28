module.exports = ({ env }) => {
  return {
    jest: {
      configure: jestConfig => {
        return {
          ...jestConfig,
          bail: 1,
          cacheDirectory: '.cache/jest',
          clearMocks: true,
          resetMocks: false,
          moduleDirectories: ['src', 'node_modules'],
          testResultsProcessor: 'jest-sonar-reporter',
          collectCoverage: false,
          coverageReporters: ['lcov'],
          collectCoverageFrom: [
            '**/*.js',
            '**/*.jsx',
            '**/*.ts',
            '**/*.tsx',
            '!**/*.d.ts',
            '!**/*.spec.js*',
            '!**/*.spec.ts*',
            '!**/*.test.ts*',
            '!**/*.test.js*',
            '!**/__mocks__/**',
            '!src/apollo/generated.ts',
            '!src/apollo/helpers.ts',
            '!**/*.graphql.d.ts',
          ],
        }
      },
    },
  }
}
