Feature: Login Page Functionality

  The Login Page is the entry point for internal users to access the Feature Flag Service.

  Scenario Outline: Valid Login
    Given the user is on the Login Page
    When the user enters '<username>' and '<password>'
    And clicks on the 'Sign In' button
    Then the user should be directed to the Feature Flags page 

    Examples:
      | username   | password      |
      | admin      | adminPassword |
      | user       | userPassword  |

  Scenario Outline: Invalid Login
    Given the user is on the Login Page
    When the user enters '<username>' and '<password>'
    And clicks on the 'Sign In' button
    Then a login error message should be displayed

    Examples:
      | username   | password   |
      | admin      | pass123    |
      | user       | wrongpass  |

  Scenario: Empty Fields
    Given the user is on the Login Page
    When the user clicks on the 'Sign In' button without entering credentials
    Then a validation message should be displayed for both fields

  Scenario: Keyboard Navigation
    Given the user is on the Login Page
    When the user navigates the form using the keyboard
    Then each form element should be accessible and functional
