const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/measurements - Obtener todas las medidas corporales
router.get('/', async (req, res) => {
    try {
        const measurements = await db.all('SELECT * FROM body_measurements ORDER BY date DESC');
        res.json(measurements);
    } catch (error) {
        console.error('Error fetching body measurements:', error);
        res.status(500).json({ error: 'Error al obtener medidas corporales' });
    }
});

// POST /api/measurements - Crear nueva medida corporal
router.post('/', async (req, res) => {
    try {
        const { date, arms, legs, abdomen, torso, notes } = req.body;
        
        if (!date || !arms || !legs || !abdomen || !torso) {
            return res.status(400).json({ error: 'Fecha y todas las medidas son requeridas' });
        }

        const result = await db.run(
            'INSERT INTO body_measurements (date, arms, legs, abdomen, torso, notes) VALUES (?, ?, ?, ?, ?, ?)',
            [date, arms, legs, abdomen, torso, notes || null]
        );

        const newMeasurement = await db.get('SELECT * FROM body_measurements WHERE id = ?', [result.id]);
        res.status(201).json(newMeasurement);
    } catch (error) {
        console.error('Error creating body measurement:', error);
        res.status(500).json({ error: 'Error al crear medida corporal' });
    }
});

// PUT /api/measurements/:id - Actualizar medida corporal
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { date, arms, legs, abdomen, torso, notes } = req.body;

        if (!date || !arms || !legs || !abdomen || !torso) {
            return res.status(400).json({ error: 'Fecha y todas las medidas son requeridas' });
        }

        const result = await db.run(
            'UPDATE body_measurements SET date = ?, arms = ?, legs = ?, abdomen = ?, torso = ?, notes = ? WHERE id = ?',
            [date, arms, legs, abdomen, torso, notes || null, id]
        );

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Medida no encontrada' });
        }

        const updatedMeasurement = await db.get('SELECT * FROM body_measurements WHERE id = ?', [id]);
        res.json(updatedMeasurement);
    } catch (error) {
        console.error('Error updating body measurement:', error);
        res.status(500).json({ error: 'Error al actualizar medida corporal' });
    }
});

// DELETE /api/measurements/:id - Eliminar medida corporal
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.run('DELETE FROM body_measurements WHERE id = ?', [id]);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Medida no encontrada' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting body measurement:', error);
        res.status(500).json({ error: 'Error al eliminar medida corporal' });
    }
});

module.exports = router;