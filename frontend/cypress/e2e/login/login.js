// cypress/integration/login/LoginPageSteps.js
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given('the user is on the Login Page', () => {
  cy.visit('/login'); // Adjust the URL to match your app's login route
});

When('the user enters {string} and {string}', (username, password) => {
  cy.get('[data-testid=LoginForm-usernameInput]').type(username);
  cy.get('[data-testid=LoginForm-passwordInput]').type(password);
});

When('clicks on the {string} button', (button) => {
  cy.get('[data-testid=LoginForm-submitButton]').click();
});

Then('the user should be directed to the Feature Flags page', () => {
  cy.location('pathname').should('eq', '/featureflags');
});

Then('a login error message should be displayed', () => {
  cy.get('[data-testid=LoginForm-error]').should('be.visible');
});

When("the user clicks on the 'Sign In' button without entering credentials", () => {
  cy.get('[data-testid=LoginForm-submitButton]').click();
});

Then('a validation message should be displayed for both fields', () => {
  cy.get('[data-testid=LoginForm-usernameInput]:invalid').should('exist');
  cy.get('[data-testid=LoginForm-passwordInput]:invalid').should('exist');
});

When('the user navigates the form using the keyboard', () => {
  cy.get('[data-testid=LoginForm-usernameInput]').focus().type('testuser{enter}');
  cy.get('[data-testid=LoginForm-passwordInput]').focus().type('testpassword{enter}');
});

Then('each form element should be accessible and functional', () => {
  cy.get('[data-testid=LoginForm-usernameInput]').should('have.value', 'testuser');
  cy.get('[data-testid=LoginForm-passwordInput]').should('have.value', 'testpassword');
});

// Define more steps as needed based on your Gherkin scenarios
