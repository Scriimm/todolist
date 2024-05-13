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
    fetch('/api/users', {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
    .then(response => response.json())
    .then(users => {
        const userList = document.getElementById('user-list');
        users.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.innerHTML = `Nom: ${user.username}, Email: ${user.email}
                <button onclick="deleteUser(${user.id})">Désinscrire</button>
                <button onclick="editUser(${user.id})">Modifier</button>`;
            userList.appendChild(userDiv);
        });
    })
    .catch(error => console.error('Erreur lors de la récupération des utilisateurs:', error));
}
