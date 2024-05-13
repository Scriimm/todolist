document.getElementById('add-task-btn').addEventListener('click', addNewTask);
document.getElementById('task-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addNewTask();
    }
});

// Chargement initial des tâches
document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
});


// Déconnexion de l'utilisateur
document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('jwt');  // Supprimer le jeton JWT stocké
    window.location.href = 'login.html';  // Rediriger l'utilisateur vers la page de connexion
});



// Fonction pour récupérer les tâches depuis l'API
function fetchTasks() {
    const jwtToken = localStorage.getItem('jwt');
    if (!jwtToken) {
        console.log('No JWT token found, redirecting to login...');
        window.location.href = 'login.html'; // Rediriger l'utilisateur vers la page de connexion
        return;
    }

    fetch('/api/tasks', {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
    .then(response => response.json())
    .then(tasks => {
        if (tasks.length > 0) {
            tasks.forEach(task => addTaskToList(task.description, task.completed, task.id));
        } else {
            console.log('No tasks found for this user.');
        }
    })
    .catch(error => console.error('Erreur lors de la récupération des tâches:', error));
}

// Fonction pour ajouter une nouvelle tâche via l'API
function addNewTask() {
    let taskInput = document.getElementById('task-input');
    let taskText = taskInput.value.trim();
    const jwtToken = localStorage.getItem('jwt');
    if (!jwtToken) {
        alert('Not authenticated. Please log in again.');
        window.location.href = 'login.html';
        return;
    }

    if (taskText) {
        fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify({ description: taskText })
        })
        .then(response => response.json())
        .then(task => {
            if (task.message) {
                addTaskToList(taskText, false, task.taskId); // Assurez-vous que l'API retourne 'taskId' pour la nouvelle tâche
                taskInput.value = '';
            } else {
                alert('Error adding task: ' + task.error);
            }
        })
        .catch(error => console.error('Erreur lors de lajout de la tâche:', error));
    } else {
        alert("Veuillez rédiger une tâche avant d'en ajouter.");
    }
    taskInput.focus();
}

// Ajoute une tâche à la liste UI
function addTaskToList(taskText, isCompleted, taskId) {
    let taskList = document.getElementById('task-list');
    let taskLi = document.createElement('li');
    taskLi.className = 'task' + (isCompleted ? ' completed' : '');
    taskLi.setAttribute('data-task-id', taskId);

    let taskContentSpan = document.createElement('span');
    taskContentSpan.textContent = taskText;
    taskContentSpan.className = 'task-content';

    let completeButton = document.createElement('button');
    completeButton.textContent = '✓';
    completeButton.className = 'complete-btn';
    completeButton.onclick = function() {
        toggleTaskCompletion(taskLi, taskId);
    };

    let deleteButton = document.createElement('button');
    deleteButton.textContent = '✕';
    deleteButton.className = 'delete-btn';
    deleteButton.onclick = function() {
        deleteTask(taskId, taskLi);
    };

    taskLi.appendChild(taskContentSpan);
    taskLi.appendChild(completeButton);
    taskLi.appendChild(deleteButton);
    taskList.appendChild(taskLi);
}

// Fonction pour basculer l'état de complétion d'une tâche
function toggleTaskCompletion(taskItem, taskId) {
    const isCompleted = !taskItem.classList.contains('completed');
    fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        },
        body: JSON.stringify({ completed: isCompleted })
    })
    .then(response => response.json()  // Assurez-vous de convertir la réponse en JSON
    .then(data => {
        if (data.message) {  // Vérifiez si la réponse contient un message de succès
            taskItem.classList.toggle('completed');
        } else {
            alert('Error updating task: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Erreur lors de la mise à jour de la tâche:', error);
        alert('Erreur lors de la mise à jour de la tâche: ' + error);
    }));
}


function deleteTask(taskId, taskItem) {
    fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        }
    })
    .then(response => {
        if (response.ok) {
            taskItem.remove();
        } else {
            alert('Failed to delete the task.');
        }
    })
    .catch(error => console.error('Erreur lors de la suppression de la tâche:', error));
}


// Fonction pour filtrer les tâches
function filterTasks(filter) {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        switch(filter) {
            case 'all':
                task.style.display = '';
                break;
            case 'completed':
                task.classList.contains('completed') ? task.style.display = '' : task.style.display = 'none';
                break;
            case 'uncompleted':
                !task.classList.contains('completed') ? task.style.display = '' : task.style.display = 'none';
                break;
        }
    });
}



