const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const router = express.Router();

// Middleware pour vérifier le token JWT
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, 'secret_key', (err, authData) => {
            if (err) {
                res.status(403).json({ error: 'Token invalide ou expiré' });
            } else {
                console.log(authData);  
                req.user = authData; // S'assurer que authData contient les données attendues
                next();
            }
        });
    } else {
        res.status(403).json({ error: 'Token non fourni' });
    }
}


// Route pour l'inscription
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hashage du mot de passe

    db.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, "user")', [username, email, hashedPassword], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Utilisateur créé' });
    });
});

// Route pour la connexion
// user.js - Route de connexion
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT id, email, role, password FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length > 0) {
            const user = results[0];
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (isValidPassword) {
                const token = jwt.sign(
                    { id: user.id, email: user.email, role: user.role },
                    'secret_key',
                    { expiresIn: '1h' }
                );
                res.json({ message: 'Connexion réussie', token, role: user.role });
            } else {
                res.status(401).json({ error: 'Mot de passe incorrect' });
            }
        } else {
            res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
    });
});


// Route pour obtenir le profil de l'utilisateur
router.get('/profile', verifyToken, (req, res) => {
    const userId = req.userId;
    db.query('SELECT username, email FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length > 0) {
            res.json({ name: results[0].username, email: results[0].email });
        } else {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
    });
});

// Mise à jour des informations de l'utilisateur
router.put('/update-profile', verifyToken, async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hashage du mot de passe
    const userId = req.userId;

    db.query('UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?', [username, email, hashedPassword, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Profil mis à jour avec succès." });
    });
});




// Désinscription de l'utilisateur et suppression de toutes ses tâches
router.delete('/unsubscribe', verifyToken, (req, res) => {
    const userId = req.userId;

    // Suppression des tâches de l'utilisateur
    db.query('DELETE FROM tasks WHERE user_id = ?', [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Suppression de l'utilisateur
        db.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Utilisateur non trouvé." });
            }
            res.json({ message: "Utilisateur désinscrit avec succès." });
        });
    });
});

// Désinscription de l'utilisateur et suppression de toutes ses tâches
router.delete('/admin/users/:id', verifyToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Accès refusé" });
    }

    const userId = req.params.id;

    // Suppression des tâches de l'utilisateur
    db.query('DELETE FROM tasks WHERE user_id = ?', [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Suppression de l'utilisateur
        db.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Utilisateur non trouvé." });
            }
            res.json({ message: "Utilisateur désinscrit avec succès." });
        });
    });
});


// route pour obtenir tous les utilisateurs pour les admins
router.get('/admin', verifyToken, (req, res) => {
    if (req.user && req.user.role === 'admin') {
        db.query('SELECT id, username, email, role FROM users', (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(results);
        });
    } else {
        return res.status(403).json({ message: 'Accès refusé' });
    }
});

// Mise à jour des informations de l'utilisateur par l'admin
router.put('/admin/users/:id', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Accès refusé" });
    }
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hashage du mot de passe
    const userId = req.params.id;

    db.query('UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?', [username, email, hashedPassword, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Profil mis à jour avec succès." });
    });
});

// Mise à jour des informations de l'utilisateur
router.put('/update/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { username, email } = req.body;

    // Supposons que vous voulez garder le même mot de passe ou ne pas le mettre à jour ici
    db.query('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
        res.json({ message: "Profil mis à jour avec succès." });
    });
});

module.exports = router;
