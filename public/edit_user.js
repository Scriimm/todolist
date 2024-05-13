// Exécute le code une fois que le DOM est entièrement chargé
document.addEventListener('DOMContentLoaded', function() {
    // Récupère l'ID de l'utilisateur depuis l'URL
    const userId = new URLSearchParams(window.location.search).get('userId');
    // Appelle la fonction pour récupérer les données de l'utilisateur
    fetchUserData(userId);
    // Ajoute un écouteur d'événement pour gérer la soumission du formulaire de mise à jour
    document.getElementById('update-form').addEventListener('submit', function(event) {
        event.preventDefault();
        updateUser(userId); // Appelle la fonction de mise à jour de l'utilisateur
    });
});

// Fonction pour récupérer les données de l'utilisateur spécifique
function fetchUserData(userId) {
    const jwtToken = localStorage.getItem('jwt');
    fetch(`/api/users/${userId}`, { 
        headers: {
            'Authorization': `Bearer ${jwtToken}` // Utilise le jeton JWT pour l'authentification
        }
    })
    .then(response => response.json())
    .then(user => {
        // Remplit les champs du formulaire avec les données de l'utilisateur
        document.getElementById('username').value = user.username;
        document.getElementById('email').value = user.email;
    })
    .catch(error => console.error('Failed to fetch user data:', error));
}

// Fonction pour mettre à jour les données de l'utilisateur
function updateUser(userId) {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const jwtToken = localStorage.getItem('jwt');

    
    fetch(`/api/users/update/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}` // Utilise le jeton JWT pour l'authentification
        },
        body: JSON.stringify({ username, email }) // Envoie les nouvelles données de l'utilisateur au serveur
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        alert(data.message); // Affiche une alerte avec le message du serveur
        window.location.href = 'admin.html'; // Redirige vers la page admin après la mise à jour
    })
    .catch(error => {
        console.error('Failed to update user:', error);
        alert('Failed to update user: ' + error.message); // Affiche une alerte en cas d'erreur
    });
}
