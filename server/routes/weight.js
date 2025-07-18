const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/weight - Obtener todos los registros de peso
router.get('/', async (req, res) => {
    try {
        const entries = await db.all('SELECT * FROM weight_entries ORDER BY date DESC');
        res.json(entries);
    } catch (error) {
        console.error('Error fetching weight entries:', error);
        res.status(500).json({ error: 'Error al obtener registros de peso' });
    }
});

// POST /api/weight - Crear nuevo registro de peso
router.post('/', async (req, res) => {
    try {
        const { date, weight, notes } = req.body;
        
        if (!date || !weight) {
            return res.status(400).json({ error: 'Fecha y peso son requeridos' });
        }

        const result = await db.run(
            'INSERT INTO weight_entries (date, weight, notes) VALUES (?, ?, ?)',
            [date, weight, notes || null]
        );

        const newEntry = await db.get('SELECT * FROM weight_entries WHERE id = ?', [result.id]);
        res.status(201).json(newEntry);
    } catch (error) {
        console.error('Error creating weight entry:', error);
        res.status(500).json({ error: 'Error al crear registro de peso' });
    }
});

// PUT /api/weight/:id - Actualizar registro de peso
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { date, weight, notes } = req.body;

        if (!date || !weight) {
            return res.status(400).json({ error: 'Fecha y peso son requeridos' });
        }

        const result = await db.run(
            'UPDATE weight_entries SET date = ?, weight = ?, notes = ? WHERE id = ?',
            [date, weight, notes || null, id]
        );

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Registro no encontrado' });
        }

        const updatedEntry = await db.get('SELECT * FROM weight_entries WHERE id = ?', [id]);
        res.json(updatedEntry);
    } catch (error) {
        console.error('Error updating weight entry:', error);
        res.status(500).json({ error: 'Error al actualizar registro de peso' });
    }
});

// DELETE /api/weight/:id - Eliminar registro de peso
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.run('DELETE FROM weight_entries WHERE id = ?', [id]);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Registro no encontrado' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting weight entry:', error);
        res.status(500).json({ error: 'Error al eliminar registro de peso' });
    }
});

module.exports = router;