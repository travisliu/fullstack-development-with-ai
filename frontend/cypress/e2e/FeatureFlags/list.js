import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const featureFlags = [
  {
    name: 'NewFeature',
    enabled: true,
    type: 'experimental',
    segments: []
  },
  {
    name: 'BetaLaunch',
    enabled: true,
    type: 'release',
    segments: []
  }
];

let featureFlagIds = []; 

beforeEach(() => {
  cy.login('admin', 'adminPassword');
  Cypress.Promise.all(featureFlags.map(flag => {
    return cy.createFeatureFlag(flag).its('body')
  }))
  .then(flags => {
    flags.forEach(flag => {
      featureFlagIds.push(flag.id);
    });
  });
});

afterEach(() => {
  Cypress.Promise.all(featureFlagIds.map(id => {
    cy.log('deleting feature flag with id: ', id);
    return cy.deleteFeatureFlag(id);
  }));
  // Clear the array for the next test
  featureFlagIds = [];
});

// Scenario: List All Feature Flags
Given('the user is on the Feature Flags page', () => {
  cy.visit('/featureflags'); // Adjust the URL to match your application's route
});

Then('all existing feature flags are listed', () => {
  cy.get('[data-testid="FeatureFlagsPage-content"]').should('be.visible');
  cy.get('[data-testid="FeatureFlagList-table"]').should('be.visible');
});

// Scenario Outline: Search for a Feature Flag
When('the user searches for {string}', (featureFlagName) => {
  cy.get('[data-testid="SearchBar-input"]').type(featureFlagName);
  cy.get('[data-testid="SearchBar-submit-button"]').click();
});

Then('the feature flags matching {string} are displayed', (featureFlagName) => {
  // Adjust the selector to search within the table for the flag name without using the row ID
  cy.get('[data-testid="FeatureFlagList-table"]')
    .contains(featureFlagName)
    .should('be.visible');
});

// Scenario: Access to Create Feature Flag Page
When('the user clicks on the \'New Feature Flag\' button', () => {
  cy.get('[data-testid="FeatureFlagsPage-createFeatureFlagButton"]').click();
});

Then('the New Feature Flag page is displayed', () => {
  cy.url().should('include', '/featureflags/new');
});

// Scenario Outline: Modify a Feature Flag
Given('{string} is an existing feature flag', (featureFlag) => {
  cy.get('[data-testid="FeatureFlagList-table"]').contains(featureFlag).should('be.visible');
});

When('the user clicks on the modify button for {string}', (featureFlag) => {
  // Assuming the modify button has a unique data-testid attribute within the table
  cy.contains('tr', featureFlag).find('a').contains('Edit').click();
});

Then('the Modify Feature Flag page for {string} is displayed', (featureFlag) => {
  // cy.url().should('include', `/feature-flags/${featureFlag}/edit`); // Adjust the URL to match your application's route for editing a feature flag
  cy.get('[data-testid="ModifyFeatureFlagForm-input-name"]').should('have.value', featureFlag);
});

// Scenario Outline: Delete a Feature Flag
When('the user clicks on the delete button for {string}', (featureFlag) => {
  // Assuming the delete button has a unique data-testid attribute within the table
  cy.contains('tr', featureFlag).find('button').contains('Delete').click();
});

When('confirms the deletion', () => {
  cy.on('window:confirm', () => true);
});

Then('{string} is no longer listed', (featureFlag) => {
  // Ensure the feature flag is no longer present in the table
  cy.get('[data-testid="FeatureFlagList-table"]').should('not.contain', featureFlag);
});

// Scenario: Pagination Functionality
When('there are more feature flags than the page limit', () => {
  // This step might require setting up your test environment to have more feature flags than the page limit
});

Then('pagination controls are displayed', () => {
  cy.get('[data-testid="Pagination-nav"]').should('be.visible');
});