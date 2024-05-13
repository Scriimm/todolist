const mysql = require('mysql2');


const db = mysql.createConnection({
    host: 'localhost', // ou l'adresse IP du serveur MySQL
    user: 'root', //  utilisateur
    password: 'pierre', //mot de passe
    database: 'task_manager'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connecté à la base de données MySQL');
});

module.exports = db;
