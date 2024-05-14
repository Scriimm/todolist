
// Fonction appelée lorsque la page HTML est chargée
document.addEventListener('DOMContentLoaded', function() {
    fetchUserInfo();
});


// Fonction pour mettre à jour le profil de l'utilisateur
document.getElementById('unsubscribe-btn').addEventListener('click', function() {
    unsubscribe();
});



// Fonction pour récupérer les informations de l'utilisateur
function fetchUserInfo() {
    const jwtToken = localStorage.getItem('jwt');
    if (!jwtToken) {
        window.location.href = 'login.html';
        return;
    }
    fetch('/api/users/profile', {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }
        return response.json();
    })
    .then(userInfo => {
        displayUserInfo(userInfo);
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des informations de lutilisateur:', error);
    });
}



// Fonction pour afficher les informations de l'utilisateur
function displayUserInfo(userInfo) {
    const userInfoDiv = document.getElementById('user-info');
    userInfoDiv.innerHTML = `<p>Nom : ${userInfo.username}</p>
                             <p>Email : ${userInfo.email}</p>`;
}



// Fonction pour se désinscrire de l'application
document.getElementById('unsubscribe-btn').addEventListener('click', function() {
    unsubscribe();
});


// fonction pour update le profil de l'utilisateur
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


// Fonction pour se désinscrire de l'application
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
