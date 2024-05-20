### All Users Page

---

**Page Title:** All Users - User Account Management

**Layout:** Utilizes the Shared Layout Component standards of the AdminLTE Bootstrap Admin Dashboard Template.

#### Key Elements:

1. **User List:**
   - Displayed in a table format showcasing all user accounts.
   - The table includes columns for Username, Email, Role, and Actions.
   - Actions column provides buttons or icons for editing and deleting user accounts.

2. **Action Buttons:**
   - A prominently placed "Create New User" button for easy access to the account creation interface.
   - Each user entry has associated action buttons for immediate account management (edit/delete).

3. **Footer:**
   - Consistent with the shared layout component's footer, ensuring design continuity across the platform.

#### Design & Interaction:

- **Streamlined and Efficient:** The page is designed for quick access to user management functions without unnecessary elements.
- **Responsive Design:** The layout adapts seamlessly to different screen sizes, maintaining functionality and aesthetic across devices.
- **User-Centric Interactions:** Direct and clear action paths for managing user accounts, enhancing the administrative experience.

#### Accessibility:

- **Readable Content:** Ensures high contrast and legible typography for user information and action controls.
- **Intuitive Navigation:** The layout and interactive elements are designed for ease of use, supporting various accessibility needs.

#### Scenarios

```gherkin
Feature: All Users Page Functionality

  The All Users page allows administrators to manage user accounts efficiently.

  Scenario: List All Users
    Given the administrator is on the All Users page
    Then all user accounts are displayed with Username, Email, Role, and Actions

  Scenario: Navigate to Create User Account
    Given the administrator is on the All Users page
    When the administrator clicks on the 'Create New User' button
    Then the Create User Account page is displayed

  Scenario Outline: Edit a User Account
    Given the administrator is on the All Users page
    And '<user>' is an existing user account
    When the administrator clicks on the edit button for '<user>'
    Then the Edit User Account page for '<user>' is displayed

    Examples:
      | user       |
      | John Doe   |
      | Jane Smith |

  Scenario Outline: Delete a User Account
    Given the administrator is on the All Users page
    And '<user>' is an existing user account
    When the administrator clicks on the delete button for '<user>'
    And confirms the deletion
    Then '<user>' is no longer listed in the User List

    Examples:
      | user       |
      | John Doe   |
      | Jane Smith |
```