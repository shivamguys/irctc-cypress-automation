const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: '7afdkj',

  defaultCommandTimeout: 120000,
  // video: true,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    chromeWebSecurity: false,
    experimentalModifyObstructiveThirdPartyCode: true
  },
});


