// const cucumber = require('@badeball/cypress-cucumber-preprocessor').default;
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";

export default async (on, config) => {
    // on('file:preprocessor', cucumber());
    await addCucumberPreprocessorPlugin(on, config);

    on(
      "file:preprocessor",
      createBundler({
        plugins: [createEsbuildPlugin(config)],
      })
    );

    return config;
};// This file is intentionally left blank as no Cypress plugins are being used currently.