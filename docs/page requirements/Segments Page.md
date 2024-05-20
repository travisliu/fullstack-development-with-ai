### Segments Page

---

**Page Title:** User Segments - Feature Flag Service

**Layout:** Integrated within the Shared Layout Component using the AdminLTE Bootstrap Admin Dashboard Template.

#### Key Elements:

1. **Segment List:**
   - A well-organized table or list showing all created user segments.
   - Columns for segment name, description, and criteria used for segmentation.
   - Features for sorting and filtering to facilitate easy navigation and organization.

2. **Pagination Controls:**
   - Positioned at the bottom of the segment list.
   - Enable users to navigate through multiple pages of segments when the total count exceeds the set limit per page.
   - Include options to move to the first, last, previous, and next pages, along with the functionality to select a specific page number.

3. **Action Buttons:**
   - A clearly visible "Create Segment" button for straightforward access.
   - Edit and delete buttons for each segment entry in the list.

4. **Search Functionality:**
   - A search bar for quickly locating segments by name or other defining criteria.

5. **Footer:**
   - Aligns with the shared layout component, providing consistency across the platform.

#### Design & Interaction:

- **Clear and Efficient Layout:** The design is structured to offer clarity and ease of interaction with segment information.
- **Responsive Design:** Ensures a consistent experience on different devices and screen sizes.
- **User-Friendly Pagination:** Intuitive pagination controls for smooth navigation between segment pages.

#### Accessibility:

- **Accessible Pagination:** The pagination controls are easily navigable with a keyboard and clearly labeled for screen readers.
- **Readable Listing and Controls:** High contrast and legible text for both the segment list and pagination controls.

#### Scenarios

``` gherkin
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

```