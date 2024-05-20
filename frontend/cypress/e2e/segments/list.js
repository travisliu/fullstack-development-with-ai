// Import statements
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const segments = [
  {
    name: 'PremiumUsers',
    criteria: [
      {
        attribute: 'color',
        operator: 'equals',
        value: 'blue',
      },
      {
        attribute: 'size',
        operator: 'greater_than',
        value: 10,
      }
    ]
  },
  {
    name: 'BetaTesters',
    criteria: [
      {
        attribute: 'name',
        operator: 'contains',
        value: 'John',
      },
      {
        attribute: 'age',
        operator: 'less_than',
        value: 50,
      }
    ]
  },
];

let segmentIds = [];

beforeEach(() => {
  cy.login('admin', 'adminPassword');
  Cypress.Promise.all(segments.map(segment => {
    return cy.createSegment(segment).its('body')
  }))
  .then(segments => {
    segments.forEach(segment => {
      segmentIds.push(segment.id);
    });
  });
});

afterEach(() => {
  Cypress.Promise.all(segmentIds.map(id => {
    return cy.deleteSegment(id);
  }));
  // Clear the array for the next test
  segmentIds = [];
});

// Given the user is on the User Segments page
Given('the user is on the User Segments page', () => {
  cy.visit('/segments'); // Adjust the URL to match your application's route
  cy.get('[data-testid=SegmentsPage-content]').should('be.visible');
});

// Then all existing user segments are listed
Then('all existing user segments are listed', () => {
  cy.get('[data-testid=SegmentList]').should('be.visible');
});

// When the user searches for '<segment_name>'
When('the user searches for {string}', (segmentName) => {
  cy.get('[data-testid=SearchBar-input]').type(segmentName);
  cy.get('[data-testid=SearchBar-submit-button]').click();
});

// Then the user segments matching '<segment_name>' are displayed
Then('the user segments matching {string} are displayed', (segmentName) => {
  cy.get(`[data-testid=SegmentList-name-${segmentName}]`).should('be.visible');
});

// When the user clicks on the 'Create Segment' button
When("the user clicks on the 'Create Segment' button", () => {
  cy.get('[data-testid=SegmentsPage-createSegmentButton]').click();
});

// Then the Create Segment page is displayed
Then('the Create Segment page is displayed', () => {
  cy.url().should('include', '/segments/new');
});

Given('{string} is an existing user segment', (segment) => {
  // Option 1: Check if the segment exists in the list (UI-based verification)
  cy.get(`[data-testid=SegmentList-name-${segment}]`).should('be.visible');
});

// When the user clicks on the modify button for '<segment>'
When('the user clicks on the modify button for {string}', (segment) => {
  cy.get(`[data-testid=SegmentList-edit-${segment}]`).click();
});

// Then the Modify Segment page for '<segment>' is displayed
Then('the Modify Segment page for {string} is displayed', (segment) => {
  cy.get('[data-testid=EditSegmentForm-name-input]').should('have.value', segment);
});

// When the user clicks on the delete button for '<segment>'
When('the user clicks on the delete button for {string}', (segment) => {
  cy.get(`[data-testid=SegmentList-delete-${segment}]`).click();
});

// And confirms the deletion
When('confirms the deletion', () => {
  cy.on('window:confirm', () => true);
});

// Then '<segment>' is no longer listed
Then('{string} is no longer listed', (segment) => {
  cy.get(`[data-testid=SegmentList-row-${segment}]`).should('not.exist');
});

// When there are more user segments than the page limit
When('there are more user segments than the page limit', () => {
  // This step may need to be implemented based on your application's behavior
  // For example, you might need to mock the response or navigate through pages
});

// Then pagination controls are displayed
Then('pagination controls are displayed', () => {
  cy.get('[data-testid=Pagination-nav]').should('be.visible');
});
