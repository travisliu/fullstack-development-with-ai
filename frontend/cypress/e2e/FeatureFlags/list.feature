Feature: Feature Flags Page Functionality

  The Feature Flags page allows users to manage feature flags, including creating, editing, and deleting them.

  Scenario: List All Feature Flags
    Given the user is on the Feature Flags page
    Then all existing feature flags are listed

  Scenario Outline: Search for a Feature Flag
    Given the user is on the Feature Flags page
    When the user searches for '<feature_flag_name>'
    Then the feature flags matching '<feature_flag_name>' are displayed

    Examples:
      | feature_flag_name |
      | NewFeature        |
      | BetaLaunch        |

  Scenario: Access to Create Feature Flag Page
    Given the user is on the Feature Flags page
    When the user clicks on the 'New Feature Flag' button
    Then the New Feature Flag page is displayed

  Scenario Outline: Modify a Feature Flag
    Given the user is on the Feature Flags page
    And '<feature_flag>' is an existing feature flag
    When the user clicks on the modify button for '<feature_flag>'
    Then the Modify Feature Flag page for '<feature_flag>' is displayed

    Examples:
      | feature_flag |
      | NewFeature   |
      | BetaLaunch   |

  Scenario Outline: Delete a Feature Flag
    Given the user is on the Feature Flags page
    And '<feature_flag>' is an existing feature flag
    When the user clicks on the delete button for '<feature_flag>'
    And confirms the deletion
    Then '<feature_flag>' is no longer listed

    Examples:
      | feature_flag |
      | NewFeature   |
      | BetaLaunch   |

  Scenario: Pagination Functionality
    Given the user is on the Feature Flags page
    When there are more feature flags than the page limit
    Then pagination controls are displayed