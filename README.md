# QuickNotes System Design

A lightweight note-taking web application built to practise JavaScript, REST API requests, error handling, and software system design.

The frontend uses HTML, CSS, and JavaScript to retrieve, create, and delete notes through the JSONPlaceholder API. The project also documents a proposed production API, relational database schema, and scalable system architecture.

## Features

- Retrieve notes using HTTP GET.
- Create notes using HTTP POST.
- Delete notes using HTTP DELETE.
- Validate note titles before submission.
- Display loading, success, and error messages.
- Handle failed requests with `try...catch...finally`.
- Render user-provided text safely using `textContent`.
- Document API endpoints, database relationships, and system architecture.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Fetch API
- JSONPlaceholder
- Markdown
- Git and GitHub
- MySQL 8 for the proposed database design

## How to Run the API Client

1. Clone or download this repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` using the VS Code Live Server extension, or open it directly in a modern browser.
4. Click Load Notes to retrieve sample notes.
5. Use the form to create a note.
6. Click Delete to remove a note from the current page.

An internet connection is required for API requests.

Important: JSONPlaceholder is a testing API. POST and DELETE requests simulate server operations; changes are not permanently stored. Reloading the page may restore the original sample notes.

## Documentation

- [API Design](docs/api-design.md) — REST endpoints, request and response examples, status codes, and error handling.
- [Data Model](docs/data-model.md) — Database entities, relationships, SQL table definitions, queries, and indexing.
- [System Architecture](docs/architecture.md) — Requirements, traffic and storage estimates, architecture diagram, request flows, and trade-offs.

## What I Learned

1. Working with REST APIs: How GET, POST, and DELETE requests interact with a server using the Fetch API.
2. Asynchronous JavaScript: How `async` and `await`, error handling, and `finally` help manage API requests.
3. DOM manipulation: How to create, update, and remove HTML elements dynamically.
4. Input validation and safe rendering: Why validating input and using `textContent` helps prevent unsafe HTML injection.
5. Database design: How primary keys, foreign keys, indexes, and SQL joins organize related data.
6. System architecture: How caching, load balancing, read replicas, and message queues can help a system scale.
7. Version control: How meaningful Git commits track development progress and preserve project history.

## Project Status

The frontend API client and the three system-design documents are complete for this learning project. The documented production API and architecture are design proposals, not deployed backend services.