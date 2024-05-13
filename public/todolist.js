document.getElementById('add-task-btn').addEventListener('click', addNewTask); // Ajoute un écouteur d'événement pour le bouton d'ajout de tâche
document.getElementById('task-input').addEventListener('keypress', function(event) { // Ajoute un écouteur d'événement pour la touche 'Entrée' sur le champ de saisie
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
            tasks.forEach(task => addTaskToList(task.description, task.completed, task.id)); // Ajoute chaque tâche à la liste
        } else {
            console.log('No tasks found for this user.');
        }
    })
    .catch(error => console.error('Error fetching tasks:', error));
}

// Fonction pour ajouter une nouvelle tâche
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
                addTaskToList(taskText, false, task.taskId); 
                taskInput.value = '';
            } else {
                alert('Error adding task: ' + task.error);
            }
        })
        .catch(error => console.error('Error adding task:', error));
    } else {
        alert("Please enter a task before adding.");
    }
    taskInput.focus();
}


// Fonction pour ajouter une tâche à la liste
function addTaskToList(taskText, isCompleted, taskId) {
    let taskList = document.getElementById('task-list');
    let taskLi = document.createElement('li');
    taskLi.className = 'task' + (isCompleted ? ' completed' : ''); // Ajoute la classe 'completed' si la tâche est complétée
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

// Fonction pour basculer l'état de complétion de la tâche
function toggleTaskCompletion(taskItem, taskId) {
    const isCompleted = !taskItem.classList.contains('completed'); // Inverse l'état de complétion actuel
    fetch(`/api/tasks/${taskId}`, { //
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        },
        body: JSON.stringify({ completed: isCompleted })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            taskItem.classList.toggle('completed');
        } else {
            alert('Error updating task: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error updating task:', error);
        alert('Error updating task: ' + error);
    });
}

// Fonction pour supprimer une tâche
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
    .catch(error => console.error('Error deleting task:', error));
}

// Ajoute un écouteur d'événement pour le filtre de tâches
function filterTasks(filter) {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        switch(filter) {
            case 'all':
                task.style.display = ''; // Affiche toutes les tâches
                break;
            case 'completed':
                task.classList.contains('completed') ? task.style.display = '' : task.style.display = 'none'; // Affiche les tâches complétées et masque les autres
                break;
            case 'uncompleted':
                !task.classList.contains('completed') ? task.style.display = '' : task.style.display = 'none'; // Affiche les tâches non complétées et masque les autres
                break;
        }
    });
}



