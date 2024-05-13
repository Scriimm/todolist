document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;

    fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Échec de la connexion');
        }
        return response.json();
    })
    .then(data => {
        console.log('Login successful:', data);
        if (data.token) {
            localStorage.setItem('jwt', data.token);
            if (data.role === 'admin') {
                window.location.href = '/admin.html';  // Redirigez vers la page admin si l'utilisateur est admin
            } else {
                window.location.href = '/index.html';  // Redirigez vers la page principale pour les autres utilisateurs
            }
        } else {
            alert('Connexion réussie, mais aucun token reçu.');
        }
    })
    .catch(error => {
        console.error('Erreur de connexion:', error);
        alert('Erreur de connexion : Veuillez vérifier vos identifiants.');
    });
});