const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadButton = document.getElementById("load-btn");
const statusMessage = document.getElementById("status");
const notesList = document.getElementById("notes-list");

function setStatus(message, type = "") {
    statusMessage.textContent = message;
    statusMessage.className = type;
}

function renderEmptyState() {
    const item = document.createElement("li");
    item.textContent = "No notes found. Create a note to get started.";
    notesList.appendChild(item);
}

// Reusable function for sending HTTP requests.
async function request(path = "", options = {}) {
    const response = await fetch(`${API_URL}${path}`, options);

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return {
        data: await response.json(),
        status: response.status
    };
}


function renderNote(note, prepend = false) {
    const item = document.createElement("li");
    item.className = "note-item";

    const title = document.createElement("h3");
    title.textContent = note.title || "Untitled note";

    const body = document.createElement("p");
    body.textContent = note.body || "No body provided.";

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";

    deleteButton.addEventListener("click", async () => {
        deleteButton.disabled = true;
        setStatus("Deleting note...");

        try {
            await request(`/${note.id}`, {
                method: "DELETE"
            });

            item.remove();

            setStatus(
                "Note deleted successfully.",
                "status-success"
            );
        } catch (error) {
            setStatus(
                "Unable to delete the note. Please try again.",
                "status-error"
            );
            console.error("Delete note error:", error);
        } finally {
            if (item.isConnected) {
                deleteButton.disabled = false;
            }
        }
    });

    item.appendChild(title);
    item.appendChild(body);
    item.appendChild(deleteButton);

    if (prepend) {
        notesList.prepend(item);
    } else {
        notesList.appendChild(item);
    }
}

async function loadNotes() {
    loadButton.disabled = true;
    setStatus("Loading notes...");
    notesList.replaceChildren();

    try {
        const result = await request("?_limit=10");
        const notes = result.data;

        if (notes.length === 0) {
            renderEmptyState();
            setStatus("No notes were found.", "status-success");
            return;
        }

        notes.forEach(renderNote);

        setStatus(
            `Loaded ${notes.length} notes from the server.`,
            "status-success"
        );
    } catch (error) {
        setStatus(
            "Unable to load notes. Please try again.",
            "status-error"
        );
        console.error("Load notes error:", error);
    } finally {
        loadButton.disabled = false;
    }
}

loadButton.addEventListener("click", loadNotes);
const noteForm = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");
const submitButton = document.getElementById("submit-btn");

noteForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    // Validate the title before making the request.
    if (!title) {
        setStatus("Please enter a note title.", "status-error");
        titleInput.focus();
        return;
    }

    if (title.length > 100) {
        setStatus(
            "The title must not exceed 100 characters.",
            "status-error"
        );
        titleInput.focus();
        return;
    }

    submitButton.disabled = true;
    setStatus("Creating note...");

    try {
        const result = await request("", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                body: body,
                userId: 1
            })
        });

        const note = result.data;
         renderNote(note, true);

        setStatus(
            `Note created (status ${result.status}, id ${note.id}).`,
            "status-success"
        );

        noteForm.reset();
    } catch (error) {
        setStatus(
            "Unable to create the note. Please try again.",
            "status-error"
        );
        console.error("Create note error:", error);
    } finally {
        submitButton.disabled = false;
    }
});
