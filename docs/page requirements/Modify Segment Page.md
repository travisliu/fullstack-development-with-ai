### Modify Segment Page

---

**Page Title:** Modify Segment - Feature Flag Service

**Layout:** Integrates with the Shared Layout Component using the AdminLTE Bootstrap Admin Dashboard Template.

#### Key Elements:

1. **Segment Editing Form:**
   - Pre-filled fields with the current details of the selected segment, such as name and description.
   - An interface for adjusting the segmentation criteria, which might include adding or removing conditions.

2. **Save Changes and Cancel Buttons:**
   - A 'Save Changes' button for committing the modifications to the segment.
   - A 'Cancel' button to exit the form without saving, redirecting back to the User Segments list.

3. **Criteria Modification Interface:**
   - A user-friendly tool to dynamically adjust segment criteria like user attributes or behaviors.

4. **Form Validation and Feedback:**
   - Inline validation to ensure all modifications are correctly formatted and meet the necessary requirements.
   - Notification messages for successful updates or displaying errors.

5. **Back Navigation:**
   - A clear link or button to return to the main Segments page.

6. **Footer:**
   - Aligned with the shared layout component, ensuring consistency across the platform.

#### Design & Interaction:

- **Intuitive Layout:** The form layout is clear and logical, making it easy to make and review changes.
- **Responsive Design:** Adapts to different screen sizes for a seamless experience on various devices.
- **Interactive Elements:** Real-time feedback and clear interaction cues for a smooth user experience.

#### Accessibility:

- **Accessible Form Fields:** Ensures that all form elements are accessible with proper labeling and keyboard navigation.
- **Readable Interface:** High contrast and legible text for ease of use.

#### Scenarios

``` gherkin
Feature: Modify Segment Functionality

  The Modify Segment page allows users to edit existing user segments.

  Scenario Outline: Edit Segment Details
    Given the user is on the Modify Segment page for '<existing_segment>'
    When the user updates the name to '<new_name>'
    And updates the description to '<new_description>'
    And modifies the criteria to '<new_criteria>'
    Then the updated details for '<existing_segment>' should be '<new_name>', '<new_description>', and '<new_criteria>'

    Examples:
      | existing_segment | new_name    | new_description         | new_criteria             |
      | SegmentA         | SegmentA1   | Updated description A   | Criteria1, Criteria2     |
      | SegmentB         | SegmentB2   | Updated description B   | Criteria3, Criteria4     |
      | SegmentC         | SegmentC3   | [empty]                 | [empty]                  |
      | SegmentD         | [empty]     | Updated description D   | Criteria5                |
      | SegmentE         | SegmentE4   | [empty]                 | Criteria6                |

  Scenario: Save Edited Segment
    Given the user has edited an existing segment
    When the user clicks the 'Save' button
    Then the changes to the segment are saved
    And the user is redirected to the User Segments page

  Scenario: Cancel Segment Editing
    Given the user is editing a segment
    When the user clicks the 'Cancel' button
    Then the editing is cancelled
    And the user is redirected to the User Segments page

  Scenario: Validation Error for Empty Name
    Given the user is editing a segment
    When the user clears the name field
    And clicks the 'Save' button
    Then a validation error message is displayed for the name field

```