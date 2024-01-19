module.exports = {
  testEnvironment: "<rootDir>/custom-jest-environment.js",

  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/test/fileMock.js",
  },
};
