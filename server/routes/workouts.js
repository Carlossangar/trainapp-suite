const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/workouts - Obtener todos los entrenamientos con ejercicios
router.get('/', async (req, res) => {
    try {
        const workouts = await db.all('SELECT * FROM workouts ORDER BY date DESC');
        
        // Obtener ejercicios para cada entrenamiento
        for (let workout of workouts) {
            const exercises = await db.all('SELECT * FROM exercises WHERE workout_id = ?', [workout.id]);
            workout.exercises = exercises;
        }
        
        res.json(workouts);
    } catch (error) {
        console.error('Error fetching workouts:', error);
        res.status(500).json({ error: 'Error al obtener entrenamientos' });
    }
});

// GET /api/workouts/:id - Obtener un entrenamiento específico
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const workout = await db.get('SELECT * FROM workouts WHERE id = ?', [id]);
        
        if (!workout) {
            return res.status(404).json({ error: 'Entrenamiento no encontrado' });
        }
        
        const exercises = await db.all('SELECT * FROM exercises WHERE workout_id = ?', [id]);
        workout.exercises = exercises;
        
        res.json(workout);
    } catch (error) {
        console.error('Error fetching workout:', error);
        res.status(500).json({ error: 'Error al obtener entrenamiento' });
    }
});

// POST /api/workouts - Crear nuevo entrenamiento
router.post('/', async (req, res) => {
    try {
        const { date, duration, notes, exercises } = req.body;
        
        if (!date || !duration || !exercises || !Array.isArray(exercises)) {
            return res.status(400).json({ error: 'Fecha, duración y ejercicios son requeridos' });
        }

        // Crear el entrenamiento
        const workoutResult = await db.run(
            'INSERT INTO workouts (date, duration, notes) VALUES (?, ?, ?)',
            [date, duration, notes || null]
        );

        const workoutId = workoutResult.id;

        // Crear los ejercicios
        for (let exercise of exercises) {
            await db.run(
                'INSERT INTO exercises (workout_id, name, type, duration, sets, reps, weight, distance, calories) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    workoutId,
                    exercise.name,
                    exercise.type,
                    exercise.duration || null,
                    exercise.sets || null,
                    exercise.reps || null,
                    exercise.weight || null,
                    exercise.distance || null,
                    exercise.calories || null
                ]
            );
        }

        // Obtener el entrenamiento completo
        const newWorkout = await db.get('SELECT * FROM workouts WHERE id = ?', [workoutId]);
        const newExercises = await db.all('SELECT * FROM exercises WHERE workout_id = ?', [workoutId]);
        newWorkout.exercises = newExercises;

        res.status(201).json(newWorkout);
    } catch (error) {
        console.error('Error creating workout:', error);
        res.status(500).json({ error: 'Error al crear entrenamiento' });
    }
});

// PUT /api/workouts/:id - Actualizar entrenamiento
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { date, duration, notes, exercises } = req.body;

        if (!date || !duration || !exercises || !Array.isArray(exercises)) {
            return res.status(400).json({ error: 'Fecha, duración y ejercicios son requeridos' });
        }

        // Actualizar el entrenamiento
        const workoutResult = await db.run(
            'UPDATE workouts SET date = ?, duration = ?, notes = ? WHERE id = ?',
            [date, duration, notes || null, id]
        );

        if (workoutResult.changes === 0) {
            return res.status(404).json({ error: 'Entrenamiento no encontrado' });
        }

        // Eliminar ejercicios existentes
        await db.run('DELETE FROM exercises WHERE workout_id = ?', [id]);

        // Crear nuevos ejercicios
        for (let exercise of exercises) {
            await db.run(
                'INSERT INTO exercises (workout_id, name, type, duration, sets, reps, weight, distance, calories) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    id,
                    exercise.name,
                    exercise.type,
                    exercise.duration || null,
                    exercise.sets || null,
                    exercise.reps || null,
                    exercise.weight || null,
                    exercise.distance || null,
                    exercise.calories || null
                ]
            );
        }

        // Obtener el entrenamiento actualizado
        const updatedWorkout = await db.get('SELECT * FROM workouts WHERE id = ?', [id]);
        const updatedExercises = await db.all('SELECT * FROM exercises WHERE workout_id = ?', [id]);
        updatedWorkout.exercises = updatedExercises;

        res.json(updatedWorkout);
    } catch (error) {
        console.error('Error updating workout:', error);
        res.status(500).json({ error: 'Error al actualizar entrenamiento' });
    }
});

// DELETE /api/workouts/:id - Eliminar entrenamiento
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.run('DELETE FROM workouts WHERE id = ?', [id]);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Entrenamiento no encontrado' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting workout:', error);
        res.status(500).json({ error: 'Error al eliminar entrenamiento' });
    }
});

module.exports = router;