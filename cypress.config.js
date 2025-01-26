const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: '7afdkj',
  defaultCommandTimeout: 120000, // Extended timeout for commands

  e2e: {
    setupNodeEvents(on) {
      on('task', {
        log(message) {
          console.log(message + '\n\n'); // Logs messages to the terminal
          return null;
        },
      });
    },
    chromeWebSecurity: false, // Disable CORS security for testing
    experimentalModifyObstructiveThirdPartyCode: true, // Allow Cypress to handle third-party scripts
    experimentalSessionAndOrigin: true, // Enable multi-origin testing
  },
});
