import React from 'react';
import { WeightEntry, BodyMeasurement, WorkoutEntry } from '../types';

interface DashboardProps {
  weightEntries: WeightEntry[];
  bodyMeasurements: BodyMeasurement[];
  workouts: WorkoutEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ weightEntries, bodyMeasurements, workouts }) => {
  const getLatestWeight = () => {
    if (weightEntries.length === 0) return null;
    const sorted = [...weightEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sorted[0];
  };

  const getWeightChange = () => {
    if (weightEntries.length < 2) return null;
    const sorted = [...weightEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sorted[0].weight - sorted[1].weight;
  };

  const getLatestMeasurements = () => {
    if (bodyMeasurements.length === 0) return null;
    const sorted = [...bodyMeasurements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sorted[0];
  };

  const getRecentWorkouts = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return workouts.filter(workout => new Date(workout.date) >= thirtyDaysAgo);
  };

  const getTotalWorkoutTime = () => {
    const recentWorkouts = getRecentWorkouts();
    return recentWorkouts.reduce((total, workout) => total + workout.duration, 0);
  };

  const latestWeight = getLatestWeight();
  const weightChange = getWeightChange();
  const latestMeasurements = getLatestMeasurements();
  const recentWorkouts = getRecentWorkouts();
  const totalWorkoutTime = getTotalWorkoutTime();

  return (
    <div className="dashboard">
      <h2>Panel de Control</h2>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Peso Actual</h3>
          {latestWeight ? (
            <div className="stat-content">
              <div className="stat-main">{latestWeight.weight} kg</div>
              <div className="stat-date">{new Date(latestWeight.date).toLocaleDateString()}</div>
              {weightChange !== null && (
                <div className={`stat-change ${weightChange < 0 ? 'negative' : 'positive'}`}>
                  {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                </div>
              )}
            </div>
          ) : (
            <p>No hay registros de peso</p>
          )}
        </div>

        <div className="dashboard-card">
          <h3>Medidas Recientes</h3>
          {latestMeasurements ? (
            <div className="stat-content">
              <div className="measurements-grid">
                <div className="measurement-item">
                  <span className="label">Brazos:</span>
                  <span className="value">{latestMeasurements.measurements.arms} cm</span>
                </div>
                <div className="measurement-item">
                  <span className="label">Piernas:</span>
                  <span className="value">{latestMeasurements.measurements.legs} cm</span>
                </div>
                <div className="measurement-item">
                  <span className="label">Abdomen:</span>
                  <span className="value">{latestMeasurements.measurements.abdomen} cm</span>
                </div>
                <div className="measurement-item">
                  <span className="label">Torso:</span>
                  <span className="value">{latestMeasurements.measurements.torso} cm</span>
                </div>
              </div>
              <div className="stat-date">{new Date(latestMeasurements.date).toLocaleDateString()}</div>
            </div>
          ) : (
            <p>No hay medidas registradas</p>
          )}
        </div>

        <div className="dashboard-card">
          <h3>Actividad (30 días)</h3>
          <div className="stat-content">
            <div className="stat-main">{recentWorkouts.length} entrenamientos</div>
            <div className="stat-secondary">{totalWorkoutTime} min totales</div>
            {recentWorkouts.length > 0 && (
              <div className="stat-average">
                Promedio: {Math.round(totalWorkoutTime / recentWorkouts.length)} min/sesión
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Progreso General</h3>
          <div className="stat-content">
            <div className="progress-item">
              <span className="progress-label">Registros de peso:</span>
              <span className="progress-value">{weightEntries.length}</span>
            </div>
            <div className="progress-item">
              <span className="progress-label">Medidas corporales:</span>
              <span className="progress-value">{bodyMeasurements.length}</span>
            </div>
            <div className="progress-item">
              <span className="progress-label">Entrenamientos totales:</span>
              <span className="progress-value">{workouts.length}</span>
            </div>
          </div>
        </div>
      </div>

      {recentWorkouts.length > 0 && (
        <div className="recent-workouts">
          <h3>Últimos Entrenamientos</h3>
          <div className="workout-list">
            {recentWorkouts.slice(0, 3).map((workout) => (
              <div key={workout.id} className="workout-summary">
                <div className="workout-date">{new Date(workout.date).toLocaleDateString()}</div>
                <div className="workout-info">
                  {workout.exercises.length} ejercicios - {workout.duration} min
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;