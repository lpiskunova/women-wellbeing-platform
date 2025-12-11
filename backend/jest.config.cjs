module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    collectCoverage: true,
    collectCoverageFrom: [
      'app.js',
      'routes/**/*.js',
      'controllers/**/*.js',
      'services/**/*.js',
    ],
    coverageDirectory: 'coverage',
    verbose: true,
  };