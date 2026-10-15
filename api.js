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

function renderNote(note) {
    const item = document.createElement("li");
    item.className = "note-item";

    const title = document.createElement("h3");
    title.textContent = note.title || "Untitled note";

    const body = document.createElement("p");
    body.textContent = note.body || "No body provided.";

    item.appendChild(title);
    item.appendChild(body);
    notesList.appendChild(item);
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