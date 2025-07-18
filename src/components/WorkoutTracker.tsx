import React, { useState } from 'react';
import { WorkoutEntry, Exercise } from '../types';

interface WorkoutTrackerProps {
  workouts: WorkoutEntry[];
  onAddWorkout: (workout: Omit<WorkoutEntry, 'id'>) => void;
}

const WorkoutTracker: React.FC<WorkoutTrackerProps> = ({ workouts, onAddWorkout }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState('');

  const [exerciseName, setExerciseName] = useState('');
  const [exerciseType, setExerciseType] = useState<Exercise['type']>('cardio');
  const [exerciseDuration, setExerciseDuration] = useState('');
  const [exerciseSets, setExerciseSets] = useState('');
  const [exerciseReps, setExerciseReps] = useState('');
  const [exerciseWeight, setExerciseWeight] = useState('');
  const [exerciseDistance, setExerciseDistance] = useState('');
  const [exerciseCalories, setExerciseCalories] = useState('');

  const addExercise = () => {
    if (!exerciseName) return;

    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: exerciseName,
      type: exerciseType,
      duration: exerciseDuration ? parseInt(exerciseDuration) : undefined,
      sets: exerciseSets ? parseInt(exerciseSets) : undefined,
      reps: exerciseReps ? parseInt(exerciseReps) : undefined,
      weight: exerciseWeight ? parseFloat(exerciseWeight) : undefined,
      distance: exerciseDistance ? parseFloat(exerciseDistance) : undefined,
      calories: exerciseCalories ? parseInt(exerciseCalories) : undefined,
    };

    setExercises([...exercises, newExercise]);
    
    setExerciseName('');
    setExerciseDuration('');
    setExerciseSets('');
    setExerciseReps('');
    setExerciseWeight('');
    setExerciseDistance('');
    setExerciseCalories('');
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (exercises.length === 0 || !duration) return;

    onAddWorkout({
      date: new Date(date),
      exercises,
      notes: notes || undefined,
      duration: parseInt(duration)
    });

    setExercises([]);
    setNotes('');
    setDuration('');
  };

  const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="workout-tracker">
      <h2>Registro de Ejercicios</h2>
      
      <form onSubmit={handleSubmit} className="workout-form">
        <div className="form-group">
          <label htmlFor="date">Fecha:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="exercise-section">
          <h3>Agregar Ejercicio</h3>
          <div className="exercise-form">
            <div className="form-group">
              <label htmlFor="exerciseName">Nombre del ejercicio:</label>
              <input
                type="text"
                id="exerciseName"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                placeholder="Ej: Sentadillas, Correr, Yoga..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="exerciseType">Tipo:</label>
              <select
                id="exerciseType"
                value={exerciseType}
                onChange={(e) => setExerciseType(e.target.value as Exercise['type'])}
              >
                <option value="cardio">Cardio</option>
                <option value="strength">Fuerza</option>
                <option value="flexibility">Flexibilidad</option>
                <option value="other">Otro</option>
              </select>
            </div>

            <div className="exercise-details">
              <div className="form-group">
                <label htmlFor="exerciseDuration">Duración (min):</label>
                <input
                  type="number"
                  id="exerciseDuration"
                  value={exerciseDuration}
                  onChange={(e) => setExerciseDuration(e.target.value)}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="exerciseSets">Series:</label>
                <input
                  type="number"
                  id="exerciseSets"
                  value={exerciseSets}
                  onChange={(e) => setExerciseSets(e.target.value)}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="exerciseReps">Repeticiones:</label>
                <input
                  type="number"
                  id="exerciseReps"
                  value={exerciseReps}
                  onChange={(e) => setExerciseReps(e.target.value)}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="exerciseWeight">Peso (kg):</label>
                <input
                  type="number"
                  id="exerciseWeight"
                  value={exerciseWeight}
                  onChange={(e) => setExerciseWeight(e.target.value)}
                  step="0.1"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="exerciseDistance">Distancia (km):</label>
                <input
                  type="number"
                  id="exerciseDistance"
                  value={exerciseDistance}
                  onChange={(e) => setExerciseDistance(e.target.value)}
                  step="0.1"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="exerciseCalories">Calorías:</label>
                <input
                  type="number"
                  id="exerciseCalories"
                  value={exerciseCalories}
                  onChange={(e) => setExerciseCalories(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            <button type="button" onClick={addExercise}>
              Agregar Ejercicio
            </button>
          </div>

          {exercises.length > 0 && (
            <div className="exercises-list">
              <h4>Ejercicios del entrenamiento:</h4>
              {exercises.map((exercise) => (
                <div key={exercise.id} className="exercise-item">
                  <div className="exercise-info">
                    <strong>{exercise.name}</strong> - {exercise.type}
                    {exercise.duration && <span> | {exercise.duration} min</span>}
                    {exercise.sets && exercise.reps && <span> | {exercise.sets} x {exercise.reps}</span>}
                    {exercise.weight && <span> | {exercise.weight} kg</span>}
                    {exercise.distance && <span> | {exercise.distance} km</span>}
                    {exercise.calories && <span> | {exercise.calories} cal</span>}
                  </div>
                  <button type="button" onClick={() => removeExercise(exercise.id)}>
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="duration">Duración total (min):</label>
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notas (opcional):</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observaciones sobre el entrenamiento..."
          />
        </div>

        <button type="submit" disabled={exercises.length === 0}>
          Guardar Entrenamiento
        </button>
      </form>

      <div className="workout-history">
        <h3>Historial de Entrenamientos</h3>
        {sortedWorkouts.length === 0 ? (
          <p>No hay entrenamientos registrados aún.</p>
        ) : (
          <div className="workouts-list">
            {sortedWorkouts.map((workout) => (
              <div key={workout.id} className="workout-card">
                <div className="workout-header">
                  <span className="workout-date">{new Date(workout.date).toLocaleDateString()}</span>
                  <span className="workout-duration">{workout.duration} min</span>
                </div>
                <div className="workout-exercises">
                  {workout.exercises.map((exercise) => (
                    <div key={exercise.id} className="exercise-summary">
                      <strong>{exercise.name}</strong> ({exercise.type})
                      {exercise.duration && <span> - {exercise.duration} min</span>}
                      {exercise.sets && exercise.reps && <span> - {exercise.sets} x {exercise.reps}</span>}
                      {exercise.weight && <span> - {exercise.weight} kg</span>}
                      {exercise.distance && <span> - {exercise.distance} km</span>}
                      {exercise.calories && <span> - {exercise.calories} cal</span>}
                    </div>
                  ))}
                </div>
                {workout.notes && (
                  <div className="workout-notes">{workout.notes}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutTracker;