document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dateInput');
    const addBtn = document.getElementById('addBtn');
    const taskTable = document.getElementById('taskTable');
    const deleteAllBtn = document.getElementById('deleteAllBtn');
    const filterBtn = document.getElementById('filterBtn');

    // Muat tugas dari localStorage atau gunakan array kosong jika tidak ada
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let isEditing = false;
    let editIndex = null;
    let currentFilter = 'ALL'; // Pilihan filter: ALL, PENDING, COMPLETED

    // Fungsi untuk menyimpan tugas ke localStorage
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Fungsi untuk menampilkan semua tugas di tabel
    const renderTasks = () => {
        taskTable.innerHTML = '';

        if (tasks.length === 0) {
            taskTable.innerHTML = '<tr><td colspan="4" class="empty">No task found</td></tr>';
            return;
        }

        // Filter tugas berdasarkan status saat ini
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'PENDING') return !task.completed;
            if (currentFilter === 'COMPLETED') return task.completed;
            return true; // Untuk 'ALL'
        });

        if (filteredTasks.length === 0) {
            taskTable.innerHTML = `<tr><td colspan="4" class="empty">No task found for filter: ${currentFilter}</td></tr>`;
            return;
        }

        filteredTasks.forEach((task) => {
            // Cari index asli dari tugas sebelum difilter untuk memastikan edit/delete bekerja
            const originalIndex = tasks.findIndex(t => t.id === task.id);
            const row = document.createElement('tr');
            row.className = task.completed ? 'completed' : '';

            // Format tanggal agar lebih mudah dibaca
            const formattedDate = task.date ? new Date(task.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : 'No due date';

            row.innerHTML = `
                <td>${task.name}</td>
                <td>${formattedDate}</td>
                <td>
                    <select class="status-select" data-index="${originalIndex}">
                        <option value="pending" ${!task.completed ? 'selected' : ''}>Pending</option>
                        <option value="completed" ${task.completed ? 'selected' : ''}>Completed</option>
                    </select>
                </td>
                <td class="actions">
                    <button class="action-btn edit-btn" data-index="${originalIndex}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-index="${originalIndex}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            taskTable.appendChild(row);
        });
    };

    // Fungsi untuk menambah atau mengupdate tugas
    const addTask = () => {
        const taskName = taskInput.value.trim();
        const taskDate = dateInput.value;

        if (taskName === '') {
            alert('Nama tugas tidak boleh kosong!');
            return;
        }

        if (isEditing) {
            // Update tugas yang sudah ada
            tasks[editIndex].name = taskName;
            tasks[editIndex].date = taskDate;
            isEditing = false;
            editIndex = null;
            addBtn.innerHTML = '<i class="fas fa-plus"></i>';
            addBtn.classList.remove('edit-mode');
        } else {
            // Tambah tugas baru
            const newTask = {
                id: Date.now(), // ID unik untuk setiap tugas
                name: taskName,
                date: taskDate,
                completed: false
            };
            tasks.push(newTask);
        }

        taskInput.value = '';
        dateInput.value = '';
        saveTasks();
        renderTasks();
    };

    // Menangani semua klik di dalam tabel (untuk edit, delete, dan status)
    const handleTableClick = (e) => {
        const target = e.target;

        // Menangani perubahan status via dropdown
        if (target.classList.contains('status-select')) {
            const index = target.dataset.index;
            tasks[index].completed = target.value === 'completed';
            saveTasks();
            renderTasks();
        }

        // Menangani tombol hapus
        if (target.closest('.delete-btn')) {
            const index = target.closest('.delete-btn').dataset.index;
            if (confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            }
        }

        // Menangani tombol edit
        if (target.closest('.edit-btn')) {
            const index = target.closest('.edit-btn').dataset.index;
            const task = tasks[index];

            taskInput.value = task.name;
            dateInput.value = task.date;
            isEditing = true;
            editIndex = index;
            addBtn.innerHTML = '<i class="fas fa-save"></i>'; // Ganti ikon jadi simpan
            addBtn.classList.add('edit-mode');
            taskInput.focus();
        }
    };

    // Fungsi untuk menghapus semua tugas
    const deleteAllTasks = () => {
        if (tasks.length > 0 && confirm('Apakah Anda yakin ingin menghapus SEMUA tugas?')) {
            tasks = [];
            saveTasks();
            renderTasks();
        }
    };

    // Fungsi untuk mengganti mode filter
    const cycleFilter = () => {
        if (currentFilter === 'ALL') {
            currentFilter = 'PENDING';
        } else if (currentFilter === 'PENDING') {
            currentFilter = 'COMPLETED';
        } else {
            currentFilter = 'ALL';
        }
        filterBtn.textContent = `FILTER: ${currentFilter}`;
        renderTasks();
    };

    // --- Event Listeners ---

    // Tombol tambah tugas
    addBtn.addEventListener('click', addTask);

    // Menekan 'Enter' di input akan menambah tugas
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Listener untuk aksi di dalam tabel (delegasi event)
    taskTable.addEventListener('change', handleTableClick); // Untuk <select>
    taskTable.addEventListener('click', handleTableClick);  // Untuk <button>

    // Tombol hapus semua
    deleteAllBtn.addEventListener('click', deleteAllTasks);

    // Tombol filter
    filterBtn.addEventListener('click', cycleFilter);

    // --- Inisialisasi ---
    // Tampilkan teks filter awal dan render tugas saat halaman dimuat
    filterBtn.textContent = `FILTER: ${currentFilter}`;
    renderTasks();
});
