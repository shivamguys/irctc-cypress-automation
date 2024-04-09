const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: '7afdkj',

  defaultCommandTimeout: 120000,
  // video: true,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        log(message) {
          // Then to see the log messages in the terminal
          //   cy.task("log", "my message");
          console.log(message + '\n\n');
          return null;
        },
      });
    },
    chromeWebSecurity: false,
    experimentalModifyObstructiveThirdPartyCode: true
  },
});


