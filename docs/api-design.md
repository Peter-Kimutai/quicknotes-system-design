# QuickNotes API Design

## 1. Overview

The QuickNotes API provides a RESTful interface for creating, retrieving, updating, and deleting notes. It also supports retrieving tags and managing the tags assigned to notes.

The proposed production API uses JSON for request and response bodies and follows standard HTTP methods and status codes.

Base URL: `https://api.quicknotes.example.com/api/v1`

Content type: `application/json`

## 2. API Endpoints

| Method | Endpoint | Description | Success Status |
|---|---|---|---|
| GET | `/notes` | Retrieve a user's notes | 200 OK |
| POST | `/notes` | Create a new note | 201 Created |
| GET | `/notes/{noteId}` | Retrieve one note | 200 OK |
| PATCH | `/notes/{noteId}` | Update an existing note | 200 OK |
| DELETE | `/notes/{noteId}` | Delete a note | 204 No Content |
| GET | `/tags` | Retrieve available tags | 200 OK |
| POST | `/notes/{noteId}/tags` | Assign a tag to a note | 201 Created |

Authenticated endpoints require a valid access token. Users can only access or modify notes they own.

## 3. List Notes

Request

`GET /api/v1/notes`

Optional query parameters include `limit` and `page` for pagination.

Example response — 200 OK

```json
{
  "data": [
    {
      "id": 101,
      "title": "Study JavaScript",
      "body": "Practise fetch and async functions.",
      "userId": 1,
      "createdAt": "2026-10-15T09:00:00Z",
      "updatedAt": "2026-10-15T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1
  }
}
```

## 4. Create a Note

Request

`POST /api/v1/notes`

Request body

```json
{
  "title": "Study JavaScript",
  "body": "Practise fetch and async functions."
}
```

Example response — 201 Created

```json
{
  "data": {
    "id": 101,
    "title": "Study JavaScript",
    "body": "Practise fetch and async functions.",
    "userId": 1,
    "createdAt": "2026-10-15T09:00:00Z",
    "updatedAt": "2026-10-15T09:00:00Z"
  }
}
```

The server generates the note ID and timestamps. The authenticated user determines ownership.

## 5. Retrieve, Update, and Delete a Note

### Retrieve one note

`GET /api/v1/notes/101`

Returns the requested note with status `200 OK`, or `404 Not Found` if it does not exist or the user cannot access it.

### Update a note

`PATCH /api/v1/notes/101`

Request body

```json
{
  "title": "Revise JavaScript",
  "body": "Review asynchronous JavaScript."
}
```

Returns the updated note with status `200 OK`.

### Delete a note

`DELETE /api/v1/notes/101`

Returns `204 No Content` when deletion succeeds. The response has no body.

## 6. Error Handling

The API returns an appropriate HTTP status code and a consistent JSON error body.

| Status Code | Meaning |
|---|---|
| 400 | Bad Request — invalid input |
| 401 | Unauthorized — authentication is missing or invalid |
| 403 | Forbidden — the user lacks permission |
| 404 | Not Found — the requested resource does not exist |
| 500 | Internal Server Error — an unexpected server failure occurred |

Example error response — 400 Bad Request

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The title is required.",
    "details": {
      "title": "This field must not be empty."
    }
  }
}
```

## 7. Validation and Security

- A note title is required and cannot exceed 100 characters.
- The server validates all incoming data; client-side validation alone is insufficient.
- Protected endpoints require authentication.
- Users may only access, update, or delete their own notes.
- SQL queries use parameterized statements to reduce SQL injection risk.
- HTTPS protects data in transit.
- Error responses avoid exposing passwords, tokens, or internal server details.

## 8. Implementation Note

The current QuickNotes frontend uses JSONPlaceholder at `https://jsonplaceholder.typicode.com/posts` to practise GET, POST, and DELETE requests. JSONPlaceholder simulates writes rather than permanently storing them.

The endpoints documented above represent the proposed production QuickNotes API, not a claim that these endpoints are already implemented on JSONPlaceholder.