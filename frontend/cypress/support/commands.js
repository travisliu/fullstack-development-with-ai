// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (username, password) => {
  cy.request({
    method: 'POST',
    url: '/api/v1/auth/token',
    headers: {
      'Content-Type': 'application/json',
    },
    body: { username, password },
  })
  .then((response) => {
    expect(response.status).to.eq(200);
    window.localStorage.setItem('user', JSON.stringify(response.body));
  });
});

const FEATUREFLAG_BASE_URL = '/api/v1/feature-flags';
const SEGMENT_BASE_URL = '/api/v1/segments';

Cypress.Commands.add('createFeatureFlag', (flagData) => {
  const user = JSON.parse(window.localStorage.getItem('user'));
  cy.request({
    method: 'POST',
    url: `${FEATUREFLAG_BASE_URL}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`,
    },
    body: JSON.stringify(flagData),
  });
});

/**
 * Cypress command to delete a feature flag.
 * @param {string} id - The ID of the feature flag to delete.
 */
Cypress.Commands.add('deleteFeatureFlag', (id) => {
  const user = JSON.parse(window.localStorage.getItem('user'));
  cy.request({
    method: 'DELETE',
    url: `${FEATUREFLAG_BASE_URL}/${id}`,
    headers: {
      'Authorization': `Bearer ${user.token}`,
    },
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('createSegment', (segmentData) => {
  const user = JSON.parse(window.localStorage.getItem('user'));
  cy.request({
    method: 'POST',
    url: `${SEGMENT_BASE_URL}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`,
    },
    body: JSON.stringify(segmentData),
  });
});

Cypress.Commands.add('deleteSegment', (segmentId) => {
  const user = JSON.parse(window.localStorage.getItem('user'));
  cy.request({
    method: 'DELETE',
    url: `${SEGMENT_BASE_URL}/${segmentId}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`,
    },
    failOnStatusCode: false,
  });
});