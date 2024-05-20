Feature: User Segments Page Functionality

  The User Segments page allows users to manage user segments, including creating, editing, and deleting them.

  Scenario: List All User Segments
    Given the user is on the User Segments page
    Then all existing user segments are listed

  Scenario Outline: Search for a User Segment
    Given the user is on the User Segments page
    When the user searches for '<segment_name>'
    Then the user segments matching '<segment_name>' are displayed

    Examples:
      | segment_name  |
      | PremiumUsers  |
      | BetaTesters   |

  Scenario: Access to Create Segment Page
    Given the user is on the User Segments page
    When the user clicks on the 'Create Segment' button
    Then the Create Segment page is displayed

  Scenario Outline: Modify a User Segment
    Given the user is on the User Segments page
    And '<segment>' is an existing user segment
    When the user clicks on the modify button for '<segment>'
    Then the Modify Segment page for '<segment>' is displayed

    Examples:
      | segment      |
      | PremiumUsers |
      | BetaTesters  |

  Scenario Outline: Delete a User Segment
    Given the user is on the User Segments page
    And '<segment>' is an existing user segment
    When the user clicks on the delete button for '<segment>'
    And confirms the deletion
    Then '<segment>' is no longer listed

    Examples:
      | segment       |
      | PremiumUsers |
      | BetaTesters  |

  Scenario: Pagination Functionality
    Given the user is on the User Segments page
    When there are more user segments than the page limit
    Then pagination controls are displayed
