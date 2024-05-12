document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');

    // Function to fetch tasks from the server and render them
    function fetchTasks() {
        fetch('/api/tasks')
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = '';
                tasks.forEach(task => renderTask(task));
            })
            .catch(error => console.error('Error fetching tasks:', error));
    }

    // Function to render a single task
    function renderTask(task) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}">${task.title}: ${task.description}</span>
            <button class="complete-btn" data-id="${task._id}">${task.completed ? 'Mark Incomplete' : 'Mark Complete'}</button>
            <button class="edit-btn" data-id="${task._id}">Edit</button>
            <button class="delete-btn" data-id="${task._id}">Delete</button>
        `;
        taskList.appendChild(li);
    }

    // Add task event listener
    taskForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;

        fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description }),
        })
        .then(response => response.json())
        .then(task => {
            renderTask(task);
            taskForm.reset();
        })
        .catch(error => console.error('Error adding task:', error));
    });

    // Mark task as complete or incomplete
    taskList.addEventListener('click', function (event) {
        if (event.target.classList.contains('complete-btn')) {
            const taskId = event.target.dataset.id;
            fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: !event.target.previousElementSibling.classList.contains('completed') }),
            })
            .then(response => response.json())
            .then(task => {
                taskList.innerHTML = '';
                fetchTasks();
            })
            .catch(error => console.error('Error updating task:', error));
        }
    });

    // Delete task
    taskList.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-btn')) {
            const taskId = event.target.dataset.id;
            fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (response.ok) {
                    event.target.parentElement.remove();
                } else {
                    throw new Error('Failed to delete task');
                }
            })
            .catch(error => console.error('Error deleting task:', error));
        }
    });

    // Fetch tasks on page load
    fetchTasks();
});
