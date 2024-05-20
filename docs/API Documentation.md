# Feature Flag Service API Documentation

## 1. API Overview

The Feature Flag Service API is designed to enable developers, product managers, QA engineers, business analysts, and marketing professionals to interact programmatically with the Feature Flag Service platform. This API allows for the creation, management, and deletion of feature flags and user segments, as well as the deployment and rollback of features in real-time. The API supports a range of actions including but not limited to, accessing and manipulating feature flags, managing user segments, and reviewing feature performance.

## 2. Authentication Method

### JWT-Based Authentication

This API uses JSON Web Tokens (JWT) for secure authentication. To access the API, clients must first authenticate using their user credentials to receive a token. This token must be included in the header of all API requests.

#### Using the JWT Token

Include the obtained JWT token in the Authorization header of your API requests:

```
Authorization: Bearer <Your JWT Token>
```

## 3. Error Handling

### Common Errors

- **401 Unauthorized:** The request lacks valid authentication credentials. This usually occurs when the JWT token is missing, invalid, or expired.
- **403 Forbidden:** The authenticated user does not have permission to access the requested resource.
- **404 Not Found:** The requested resource does not exist.
- **500 Internal Server Error:** A generic error indicating an unexpected condition on the server.

### Error Codes and Messages

- `401`: "Authentication failed. Invalid username or password."
- `401`: "Invalid token. Please log in again."
- `403`: "Access denied. You do not have permission to access this resource."
- `404`: "Resource not found."
- `500`: "Internal server error. Please contact support."

### Authentication API Endpoint for Fetching Token

#### Endpoint for Token Retrieval

- **Endpoint URL:** `/api/v1/auth/token`
- **Method:** `POST`
- **Request Parameters:**
  - Body: JSON object with credentials such as `username` (string, required) and `password` (string, required).
- **Response Format:**
  - Field Types: Object containing `token` (string), `expiresIn` (number, indicating the token's expiry time in seconds).
  - Status Codes: `200 OK` for successful authentication, `401 Unauthorized` for invalid credentials.
  - Headers: `Content-Type: application/json`

### Resource: Feature Flags

#### 1. List All Feature Flags
- **Endpoint URL:** `/api/v1/feature-flags`
- **Method:** `GET`
- **Request Parameters:**
    - `page` (optional): The page number to retrieve.
    - `limit` (optional): The number of items per page.
- **Response Format:**
    - Field Types:
        - `items`: Array of objects, each representing a feature flag. Each object includes:
            - `id` (string): The unique identifier of the feature flag.
            - `name` (string): The name of the feature flag.
            - `enabled` (boolean): Indicates whether the feature flag is enabled or disabled.
            - `segments` (array of strings): A list of segments or groups associated with the feature flag.
            - `type` (string): The type of the feature flag (e.g., "release", "experimental", "operational").
            - Additional fields can be included based on specific requirements.
        - `total` (integer): The total number of feature flags available.
        - `page` (integer): The current page number.
        - `limit` (integer): The number of items per page.
    - Status Codes: `200 OK`
    - Headers: `Content-Type: application/json`
#### 2. Get a Specific Feature Flag
- **Endpoint URL:** `/api/v1/feature-flags/{id}`
- **Method:** `GET`
- **Request Parameters:**
  - `id` (required): The unique identifier of the feature flag.
- **Response Format:**
  - Field Types: Object containing `id` (string), `name` (string), `enabled` (boolean), `segments` (array of strings)
  - Status Codes: `200 OK` if found, `404 Not Found` if not found
  - Headers: `Content-Type: application/json`

#### 3. Create a New Feature Flag
- **Endpoint URL:** `/api/v1/feature-flags`
- **Method:** `POST`
- **Request Parameters:** 
  - Body: JSON object with `name` (string, required), `enabled` (boolean, required), `segments` (array of segment IDs, optional)
- **Response Format:**
  - Field Types: Object containing `id` (string), `name` (string), `enabled` (boolean), `segments` (array of segment IDs.)
  - Status Codes: `201 Created`
  - Headers: `Content-Type: application/json`

#### 4. Update an Existing Feature Flag
- **Endpoint URL:** `/api/v1/feature-flags/{id}`
- **Method:** `PUT`
- **Request Parameters:**
  - `id` (required): The unique identifier of the feature flag.
  - Body: JSON object with `name` (string, optional), `enabled` (boolean, optional), `segments` (array of strings, optional)
- **Response Format:**
  - Field Types: Object containing `id` (string), `name` (string), `enabled` (boolean), `segments` (array of strings)
  - Status Codes: `200 OK` if updated, `404 Not Found` if not found
  - Headers: `Content-Type: application/json`

#### 5. Delete a Feature Flag
- **Endpoint URL:** `/api/v1/feature-flags/{id}`
- **Method:** `DELETE`
- **Request Parameters:**
  - `id` (required): The unique identifier of the feature flag.
- **Response Format:**
  - Field Types: None (Empty response body)
  - Status Codes: `204 No Content` if deleted, `404 Not Found` if not found
  - Headers: `Content-Type: application/json`

#### 6. Search Feature Flags

- **Endpoint URL:** `/api/v1/feature-flags/search`
- **Method:** `GET`
- **Request Parameters:**
    - `query` (required): The search query string to find specific feature flags.
    - `page` (optional): The page number for pagination.
    - `limit` (optional): The number of items per page.
- **Response Format:**
    - Field Types:
        - `items`: Array of objects, each representing a matching feature flag.
        - `total`: The total number of matching feature flags.
        - `page`: The current page number.
        - `limit`: The number of items per page.
    - Status Codes: `200 OK`
    - Headers: `Content-Type: application/json`
### Resource: Segments

#### 1. List All Segments
- **Endpoint URL:** `/api/v1/segments`
- **Method:** `GET`
- **Request Parameters:**
    - `page` (optional): An integer indicating the page number in the paginated list.
    - `limit` (optional): An integer indicating the number of segments to display per page.
- **Response Format:**
    - Field Types: Object containing:
        - `segments`: Array of segment objects (`id`, `name`, `description`, `criteria`)
        - `total`: Integer representing the total number of segments.
        - `page`: Integer representing the current page.
        - `limit`: Integer representing the number of items per page.
    - Status Codes: `200 OK`
    - Headers: `Content-Type: application/json`
#### 2. Get a Specific Segment
- **Endpoint URL:** `/api/v1/segments/{id}`
- **Method:** `GET`
- **Request Parameters:**
  - `id` (required): The unique identifier of the segment.
- **Response Format:**
  - Field Types: Object containing `id` (string), `name` (string), `description` (string), `criteria` (object)
  - Status Codes: `200 OK` if found, `404 Not Found` if not found
  - Headers: `Content-Type: application/json`

#### 3. Create a New Segment
- **Endpoint URL:** `/api/v1/segments`
- **Method:** `POST`
- **Request Parameters:** 
  - Body: JSON object with `name` (string, required), `description` (string, required), `criteria` (object, required)
- **Response Format:**
  - Field Types: Object containing `id` (string), `name` (string), `description` (string), `criteria` (object)
  - Status Codes: `201 Created`
  - Headers: `Content-Type: application/json`

#### 4. Update an Existing Segment
- **Endpoint URL:** `/api/v1/segments/{id}`
- **Method:** `PUT`
- **Request Parameters:**
  - `id` (required): The unique identifier of the segment.
  - Body: JSON object with `name` (string, optional), `description` (string, optional), `criteria` (object, optional)
- **Response Format:**
  - Field Types: Object containing `id` (string), `name` (string), `description` (string), `criteria` (object)
  - Status Codes: `200 OK` if updated, `404 Not Found` if not found
  - Headers: `Content-Type: application/json`

#### 5. Delete a Segment
- **Endpoint URL:** `/api/v1/segments/{id}`
- **Method:** `DELETE`
- **Request Parameters:**
  - `id` (required): The unique identifier of the segment.
- **Response Format:**
  - Field Types: None (Empty response body)
  - Status Codes: `204 No Content` if deleted, `404 Not Found` if not found
  - Headers: `Content-Type: application/json`

#### 6. Search for a User Segment

- **Endpoint URL:** `/api/v1/segments/search`
- **Method:** `GET`
- **Request Parameters:**
    - `query` (optional): A string used to search for segments by name.
- **Response Format:**
    - Field Types: Array of objects, each containing `id` (string), `name` (string), `description` (string), `criteria` (object) that match the search query.
    - Status Codes: `200 OK`
    - Headers: `Content-Type: application/json`

#### Structure of the `Criteria` Object

- **Field:** `criteria`
- **Type:** Array of Objects
- **Description:** An array where each object defines a condition based on user attributes, simplifying the segmentation process.

#### Fields within Each Object in the `criteria` Array:

1. **Attribute**
   - **Type:** String
   - **Description:** The name of the user attribute (e.g., "location", "age", "membership_level").

2. **Operator**
   - **Type:** String
   - **Description:** The operator used for comparison. Common operators include "equals", "greater_than", "less_than", "contains", etc.

3. **Value**
   - **Type:** Varies (String, Number, Boolean, etc.)
   - **Description:** The value to compare the attribute against. The type of this field depends on the nature of the attribute.

#### Example `criteria` Array:

```json
{
  "criteria": [
    {
      "attribute": "location",
      "operator": "equals",
      "value": "USA"
    },
    {
      "attribute": "age",
      "operator": "greater_than",
      "value": 18
    },
    {
      "attribute": "membership_level",
      "operator": "equals",
      "value": "premium"
    }
  ]
}
```


### Resource: Users

#### 1. List All Users
- **Endpoint URL:** `/api/v1/users`
- **Method:** `GET`
- **Request Parameters:** None
- **Response Format:**
  - Field Types: Array of objects, each containing `userId` (string), `username` (string), `email` (string), `role` (string)
  - Status Codes: `200 OK`
  - Headers: `Content-Type: application/json`

#### 2. Get a Specific User
- **Endpoint URL:** `/api/v1/users/{userId}`
- **Method:** `GET`
- **Request Parameters:**
  - `userId` (required): The unique identifier of the user.
- **Response Format:**
  - Field Types: Object containing `userId` (string), `username` (string), `email` (string), `role` (string)
  - Status Codes: `200 OK` if found, `404 Not Found` if not found
  - Headers: `Content-Type: application/json`

#### 3. Create a New User
- **Endpoint URL:** `/api/v1/users`
- **Method:** `POST`
- **Request Parameters:** 
  - Body: JSON object with `username` (string, required), `email` (string, required), `password` (string, required), `role` (string, required)
- **Response Format:**
  - Field Types: Object containing `userId` (string), `username` (string), `email` (string), `role` (string)
  - Status Codes: `201 Created`
  - Headers: `Content-Type: application/json`

#### 4. Update an Existing User
- **Endpoint URL:** `/api/v1/users/{userId}`
- **Method:** `PUT`
- **Request Parameters:**
  - `userId` (required): The unique identifier of the user.
  - Body: JSON object with `username` (string, optional), `email` (string, optional), `role` (string, optional)
- **Response Format:**
  - Field Types: Object containing `userId` (string), `username` (string), `email` (string), `role` (string)
  - Status Codes: `200 OK` if updated, `404 Not Found` if not found
  - Headers: `Content-Type: application/json`

#### 5. Delete a User
- **Endpoint URL:** `/api/v1/users/{userId}`
- **Method:** `DELETE`
- **Request Parameters:**
  - `userId` (required): The unique identifier of the user.
- **Response Format:**
  - Field Types: None (Empty response body)
  - Status Codes: `204 No Content` if deleted, `404 Not Found` if not found
  - Headers: `Content-Type: application/json`


