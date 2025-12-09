const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const taskList = document.getElementById("taskList");
const filter = document.getElementById("filter");

let tasks = [];

// Tambah Tugas
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (taskInput.value.trim() === "" || dateInput.value === "") {
        alert("Harap isi tugas dan tanggal!");
        return;
    }

    const task = {
        id: Date.now(),
        text: taskInput.value,
        date: dateInput.value,
        done: false
    };

    tasks.push(task);
    displayTasks();

    taskForm.reset();
});

// Tampilkan Tugas
function displayTasks() {
    taskList.innerHTML = "";

    let filtered = tasks;

    if (filter.value === "done") {
        filtered = tasks.filter(t => t.done);
    } else if (filter.value === "pending") {
        filtered = tasks.filter(t => !t.done);
    }

    filtered.forEach(t => {
        const li = document.createElement("li");

        li.innerHTML = `
            <span class="${t.done ? "done" : ""}">
                ${t.text} — <small>${t.date}</small>
            </span>
            <div class="task-buttons">
                <button onclick="toggleDone(${t.id})" class="toggle-btn" title="Mark as ${t.done ? 'pending' : 'done'}">${t.done ? '↺' : '✓'}</button>
                <button onclick="deleteTask(${t.id})" class="delete-btn" title="Delete task">✕</button>
            </div>
        `;

        li.classList.add('fade-in');

        taskList.appendChild(li);
    });
}

// Tandai selesai / belum
function toggleDone(id) {
    tasks = tasks.map(t => t.id === id ? {...t, done: !t.done} : t);
    displayTasks();
}

// Hapus tugas
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    displayTasks();
}

// Filter
filter.addEventListener("change", displayTasks);
