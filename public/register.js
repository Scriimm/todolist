// Ajoute un écouteur d'événement 'submit' sur le formulaire d'inscription
document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche le comportement par défaut de rechargement de la page

    // Récupère les valeurs saisies par l'utilisateur dans les champs du formulaire
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Envoie une requête POST à l'API pour enregistrer le nouvel utilisateur
    fetch('/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Spécifie que le corps de la requête est au format JSON
        },
        body: JSON.stringify({ username, email, password }) // Convertit les données du formulaire en chaîne JSON
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json(); // Transforme la réponse en JSON
    })
    .then(data => {
        console.log('Inscription réussie:', data); 
        alert('Inscription réussie. Veuillez vous connecter.'); 
        window.location.href = 'login.html'; // Redirige vers la page de connexion
    })
    .catch(error => {
        console.error('Erreur lors de l’inscription:', error); 
        alert('Erreur lors de l’inscription: ' + error.message); 
    });
});
