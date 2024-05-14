// Exécute le code une fois que le DOM est entièrement chargé
document.addEventListener('DOMContentLoaded', function() {
    // Récupère le jeton JWT stocké localement
    const jwtToken = localStorage.getItem('jwt');
    if (!jwtToken) {
        // Si aucun jeton n'est trouvé, redirige vers la page de connexion
        window.location.href = 'login.html';
    } else {
        // Si un jeton est trouvé, appelle la fonction pour récupérer les utilisateurs
        fetchUsers();
    }
});

// Fonction pour récupérer les utilisateurs de l'API
function fetchUsers() {
    const jwtToken = localStorage.getItem('jwt');
    fetch('/api/users/admin', {
        headers: {
            'Authorization': `Bearer ${jwtToken}`  // Ajoute le jeton JWT dans les en-têtes pour l'authentification
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return response.json();
        })
        .then(users => {
            const userList = document.getElementById('users');
            users.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.className = 'user';

                // Div pour les informations de l'utilisateur
                const userInfoDiv = document.createElement('div');
                userInfoDiv.className = 'user-info';

                // Crée des éléments HTML distincts pour chaque information de l'utilisateur
                const usernameElement = document.createElement('div');
                usernameElement.textContent = `Nom: ${user.username}`;
                const emailElement = document.createElement('div');
                emailElement.textContent = `Email: ${user.email}`;
                const roleElement = document.createElement('div');
                roleElement.textContent = `Role: ${user.role}`;

                // Ajoute les éléments d'information à la div pour les informations de l'utilisateur
                userInfoDiv.appendChild(usernameElement);
                userInfoDiv.appendChild(emailElement);
                userInfoDiv.appendChild(roleElement);

                // Div pour les boutons d'action
                const actionButtonsDiv = document.createElement('div');
                actionButtonsDiv.className = 'action-buttons';

                // Boutons pour les actions
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Désinscrire';
                deleteButton.id = 'delete-btn';
                deleteButton.addEventListener('click', () => deleteUser(user.id));

                const editButton = document.createElement('button');
                editButton.textContent = 'Modifier';
                editButton.id = 'edit-btn';
                editButton.addEventListener('click', () => editUser(user.id));

                // Ajoute les boutons d'action à la div pour les boutons
                actionButtonsDiv.appendChild(deleteButton);
                actionButtonsDiv.appendChild(editButton);

                // Ajoute les divs d'informations et de boutons à la div de l'utilisateur
                userDiv.appendChild(userInfoDiv);
                userDiv.appendChild(actionButtonsDiv);

                // Ajoute la div de l'utilisateur à la liste des utilisateurs
                userList.appendChild(userDiv);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
        });
}


// Fonction pour rediriger vers la page de modification d'utilisateur
function editUser(userId) {
    window.location.href = `edit_user.html?userId=${userId}`;
}

// Fonction pour supprimer un utilisateur
function deleteUser(userId) {
    const jwtToken = localStorage.getItem('jwt');
    fetch(`/api/users/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${jwtToken}`  // Utilise le jeton JWT pour l'authentification
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete user');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);  // Affiche un message de succès ou d'échec
        location.reload();  // Recharge la page pour mettre à jour la liste des utilisateurs
    })
    .catch(error => {
        console.error('Erreur lors de la désinscription:', error);
        alert('Échec de la désinscription');
    });
}
