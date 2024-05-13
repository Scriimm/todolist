document.addEventListener('DOMContentLoaded', function() {
    const jwtToken = localStorage.getItem('jwt');
    if (!jwtToken) {
        window.location.href = 'login.html';
    } else {
        fetchUsers();
    }
});

function fetchUsers() {
    const jwtToken = localStorage.getItem('jwt');
    fetch('/api/users/admin', {  // Assurez-vous que cette route est correctement définie dans votre backend
        headers: {
            'Authorization': `Bearer ${jwtToken}`
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

function editUser(userId) {
    // Rediriger vers la page de modification avec l'ID de l'utilisateur en paramètre
    window.location.href = `edit_user.html?userId=${userId}`;
}



function deleteUser(userId) {
    const jwtToken = localStorage.getItem('jwt');
    fetch(`/api/users/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete user');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        location.reload();  // Recharge la page pour mettre à jour la liste
    })
    .catch(error => {
        console.error('Erreur lors de la désinscription:', error);
        alert('Échec de la désinscription');
    });
}
