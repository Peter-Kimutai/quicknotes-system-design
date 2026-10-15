# QuickNotes Database Design

## 1. Overview

QuickNotes uses a relational database to store users, notes, tags, and the relationships between notes and tags. This design uses MySQL 8 and maintains data integrity through primary keys, foreign keys, and constraints.

## 2. Entities and Columns

### Users

| Column | Data Type | Key / Constraint | Description |
|---|---|---|---|
| id | BIGINT UNSIGNED | Primary Key | Unique user identifier |
| name | VARCHAR(100) | NOT NULL | User's display name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email address |
| password_hash | VARCHAR(255) | NOT NULL | Securely stored password hash |
| created_at | TIMESTAMP | NOT NULL | Account creation time |

### Notes

| Column | Data Type | Key / Constraint | Description |
|---|---|---|---|
| id | BIGINT UNSIGNED | Primary Key | Unique note identifier |
| user_id | BIGINT UNSIGNED | Foreign Key, NOT NULL | Owner of the note |
| title | VARCHAR(100) | NOT NULL | Note title |
| body | TEXT | Nullable | Note content |
| created_at | TIMESTAMP | NOT NULL | Creation time |
| updated_at | TIMESTAMP | NOT NULL | Last update time |

### Tags

| Column | Data Type | Key / Constraint | Description |
|---|---|---|---|
| id | BIGINT UNSIGNED | Primary Key | Unique tag identifier |
| name | VARCHAR(50) | UNIQUE, NOT NULL | Tag name |

### Note_Tags

| Column | Data Type | Key / Constraint | Description |
|---|---|---|---|
| note_id | BIGINT UNSIGNED | Composite Primary Key, Foreign Key | Linked note |
| tag_id | BIGINT UNSIGNED | Composite Primary Key, Foreign Key | Linked tag |

The composite primary key (`note_id`, `tag_id`) prevents the same tag from being assigned to the same note more than once.

## 3. Relationships

- Users to Notes — One-to-Many: One user can create many notes, while each note belongs to one user.
- Notes to Tags — Many-to-Many: A note can have multiple tags, and each tag can belong to multiple notes. The `note_tags` junction table implements this relationship.

## 4. SQL Table Definitions

The following statements create the four tables in MySQL 8.

```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(100) NOT NULL,
    body TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_notes_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE tags (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE note_tags (
    note_id BIGINT UNSIGNED NOT NULL,
    tag_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (note_id, tag_id),
    CONSTRAINT fk_note_tags_note
        FOREIGN KEY (note_id) REFERENCES notes(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_note_tags_tag
        FOREIGN KEY (tag_id) REFERENCES tags(id)
        ON DELETE CASCADE
);
```

## 5. SQL Queries

### Query 1: Retrieve all notes belonging to a user

```sql
SELECT id, title, body, created_at, updated_at
FROM notes
WHERE user_id = 1
ORDER BY updated_at DESC;
```

This retrieves a user's notes, displaying the most recently updated notes first.

### Query 2: Retrieve notes with their tags

```sql
SELECT
    n.id AS note_id,
    n.title,
    t.name AS tag_name
FROM notes AS n
LEFT JOIN note_tags AS nt ON n.id = nt.note_id
LEFT JOIN tags AS t ON nt.tag_id = t.id
WHERE n.user_id = 1
ORDER BY n.id;
```

This uses `JOIN` operations to display each note alongside its associated tags, including notes without tags.

### Query 3: Search notes by title

```sql
SELECT id, title, body
FROM notes
WHERE user_id = 1
  AND title LIKE '%JavaScript%'
ORDER BY updated_at DESC;
```

This searches a user's notes for titles containing the word `JavaScript`.

## 6. Indexing

```sql
CREATE INDEX idx_notes_user_updated
ON notes (user_id, updated_at);
```

Reason: The index helps queries that filter by `user_id` and sort by `updated_at`, making retrieval of a user's most recently updated notes more efficient as the dataset grows.

The index may require additional storage and slightly increase the cost of inserts and updates.

## 7. SQL vs. NoSQL

QuickNotes uses MySQL, a relational SQL database, because the application has structured entities and clear relationships between users, notes, and tags.

Advantages include:

- Foreign keys and constraints help maintain referential integrity.
- Transactions support reliable operations involving related records.
- SQL joins make it straightforward to retrieve notes and their tags.
- The schema is well suited to users, ownership, and many-to-many relationships.

A NoSQL database could offer more flexible document structures or suit certain large-scale distributed workloads. However, MySQL is the more suitable starting point because QuickNotes requires structured relationships and consistent data integrity.