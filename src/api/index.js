const express = require('express');
const cors = require('cors');
const path = require('path');
const userRoutes = require('../routes/users');
const taskRoutes = require('../routes/tasks');

const app = express();

app.use(cors());
app.use(express.json()); // Pour parser les requêtes JSON

// Redirection à la page de connexion
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// Routes de l'API
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../../public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

module.exports = app;
