document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Inscription réussie:', data);
        alert('Inscription réussie. Veuillez vous connecter.');
        window.location.href = 'login.html'; // Redirige vers la page de connexion
    })
    .catch(error => console.error('Erreur lors de l’inscription:', error));
});
