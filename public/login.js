// Ajoute un écouteur d'événement pour gérer la soumission du formulaire de connexion
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche le comportement de soumission par défaut

    // Récupère les valeurs des champs email et mot de passe du formulaire
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;

    // Envoie une requête POST à l'API pour tenter de connecter l'utilisateur
    fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Spécifie le type de contenu attendu par l'API
        },
        body: JSON.stringify({ email, password }) // Convertit les données du formulaire en JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Échec de la connexion');
        }
        return response.json(); 
    })
    .then(data => {
        console.log('Login successful:', data); // Affiche les données de réponse pour le débogage
        if (data.token) {
            // Si un token est reçu, le stocke localement pour des requêtes futures
            localStorage.setItem('jwt', data.token);
            if (data.role === 'admin') {
                // Si l'utilisateur est un administrateur, redirige vers la page d'administration
                window.location.href = '/admin.html';
            } else {
                // Sinon, redirige vers la page principale de l'application
                window.location.href = '/index.html';
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
