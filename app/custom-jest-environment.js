const JSDOMEnvironment = require("jest-environment-jsdom");

class CustomJSDOMEnvironment extends JSDOMEnvironment {
  constructor(config) {
    super(
      Object.assign({}, config, {
        testEnvironmentOptions: {
          url: "http://localhost",
        },
      })
    );
  }
}

module.exports = CustomJSDOMEnvironment;
