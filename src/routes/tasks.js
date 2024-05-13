const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const router = express.Router();

// Middleware pour vérifier le token
const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Autorisation: Bearer <token>
        const decoded = jwt.verify(token, 'secret_key');
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Authentification échouée' });
    }
};
// Ajouter une tâche pour l'utilisateur connecté
router.post('/', verifyToken, (req, res) => {
    const { description } = req.body;
    const userId = req.userId;
    db.query('INSERT INTO tasks (user_id, description) VALUES (?, ?)', [userId, description], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Tâche ajoutée', taskId: results.insertId });
    });
});

// Récupérer toutes les tâches de l'utilisateur connecté
router.get('/', verifyToken, (req, res) => {
    const userId = req.userId;
    db.query('SELECT * FROM tasks WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Mettre à jour une tâche spécifique
router.put('/:taskId', verifyToken, (req, res) => {
    const { completed } = req.body;
    const { taskId } = req.params;
    const userId = req.userId;  // S'assurer que la tâche appartient à l'utilisateur

    db.query('UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?', [completed, taskId, userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'No task found with the given ID for this user.' });
        }
        res.json({ message: 'Task updated successfully' });
    });
});

// Supprimer une tâche spécifique
router.delete('/:taskId', verifyToken, (req, res) => {
    const { taskId } = req.params;
    const userId = req.userId;

    db.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'No task found with the given ID for this user.' });
        }
        res.json({ message: 'Task deleted successfully' });
    });
});


module.exports = router;
