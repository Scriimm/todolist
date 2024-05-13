document.addEventListener('DOMContentLoaded', function() {
    fetchUserInfo();
});

document.getElementById('unsubscribe-btn').addEventListener('click', function() {
    unsubscribe();
});

function fetchUserInfo() {
    const jwtToken = localStorage.getItem('jwt');
    if (!jwtToken) {
        // alert("Vous n'êtes pas connecté. Redirection vers la page de connexion.");
        window.location.href = 'login.html';
        return;
    }

    // Simuler une API qui renvoie les informations de l'utilisateur
    // Vous devez remplacer cette partie par votre propre appel API
    fetch('/api/users/profile', {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
    .then(response => response.json())
    .then(userInfo => {
        if (userInfo) {
            displayUserInfo(userInfo);
        } else {
            console.log('Aucune information utilisateur trouvée.');
        }
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des informations de lutilisateur:', error);
    });
}

function displayUserInfo(userInfo) {
    const userInfoDiv = document.getElementById('user-info');
    userInfoDiv.innerHTML = `<p>Nom : ${userInfo.name}</p>
                             <p>Email : ${userInfo.email}</p>`;
}




document.getElementById('unsubscribe-btn').addEventListener('click', function() {
    unsubscribe();
});

function updateProfile() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const jwtToken = localStorage.getItem('jwt');

    fetch('/api/users/update-profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({ username, email })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => console.error('Erreur lors de la mise à jour du profil:', error));
}

function unsubscribe() {
    const jwtToken = localStorage.getItem('jwt');

    fetch('/api/users/unsubscribe', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        localStorage.removeItem('jwt');  // Clear JWT token
        console.log("Redirecting to login...");
        window.location.href = 'login.html';  // Redirect to login page
    })
    .catch(error => console.error('Erreur lors de la désinscription:', error));
}
