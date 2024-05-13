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
        const userList = document.getElementById('user-list');
        users.forEach(user => {
            const userDiv = document.createElement('div');
            // Crée un élément HTML pour chaque utilisateur avec des boutons pour les actions
            userDiv.innerHTML = `Nom: ${user.username}, Email: ${user.email}, Role: ${user.role}
                <button onclick="deleteUser(${user.id})">Désinscrire</button>
                <button onclick="editUser(${user.id})">Modifier</button>`;
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
