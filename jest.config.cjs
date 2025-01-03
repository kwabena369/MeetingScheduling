module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
  },
};