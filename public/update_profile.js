document.addEventListener('DOMContentLoaded', function() { // Exécute le code une fois que le DOM est entièrement chargé
    const jwtToken = localStorage.getItem('jwt');
    if (!jwtToken) {
        window.location.href = 'login.html';
    }
});

// Récupère les données de l'utilisateur actuellement connecté
document.getElementById('update-profile-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const jwtToken = localStorage.getItem('jwt');

    fetch('/api/users/update-profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({ username, email, password })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.message.includes('succès')) {
            window.location.href = 'user_profile.html'; // Rediriger vers le profil après la mise à jour
        }
    })
    .catch(error => console.error('Erreur lors de la mise à jour du profil:', error));
});
