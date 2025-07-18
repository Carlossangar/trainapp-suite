import React, { useState } from 'react';
import { useWeightEntries, useBodyMeasurements, useWorkouts } from './hooks/useApi';
import Dashboard from './components/Dashboard';
import WeightTracker from './components/WeightTracker';
import BodyMeasurements from './components/BodyMeasurements';
import WorkoutTracker from './components/WorkoutTracker';
import './App.css';

type Tab = 'dashboard' | 'weight' | 'measurements' | 'workouts';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  
  const { entries: weightEntries, loading: weightLoading, error: weightError, addEntry: addWeightEntry } = useWeightEntries();
  const { measurements: bodyMeasurements, loading: measurementsLoading, error: measurementsError, addMeasurement: addBodyMeasurement } = useBodyMeasurements();
  const { workouts, loading: workoutsLoading, error: workoutsError, addWorkout } = useWorkouts();

  const isLoading = weightLoading || measurementsLoading || workoutsLoading;
  const hasError = weightError || measurementsError || workoutsError;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="loading">
          <p>Cargando datos...</p>
        </div>
      );
    }

    if (hasError) {
      return (
        <div className="error">
          <p>Error al cargar datos: {weightError || measurementsError || workoutsError}</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            weightEntries={weightEntries}
            bodyMeasurements={bodyMeasurements}
            workouts={workouts}
          />
        );
      case 'weight':
        return (
          <WeightTracker
            entries={weightEntries}
            onAddEntry={addWeightEntry}
          />
        );
      case 'measurements':
        return (
          <BodyMeasurements
            measurements={bodyMeasurements}
            onAddMeasurement={addBodyMeasurement}
          />
        );
      case 'workouts':
        return (
          <WorkoutTracker
            workouts={workouts}
            onAddWorkout={addWorkout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>TrainApp</h1>
        <p>Tu compañero para el seguimiento de fitness</p>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`nav-button ${activeTab === 'weight' ? 'active' : ''}`}
          onClick={() => setActiveTab('weight')}
        >
          Peso
        </button>
        <button
          className={`nav-button ${activeTab === 'measurements' ? 'active' : ''}`}
          onClick={() => setActiveTab('measurements')}
        >
          Medidas
        </button>
        <button
          className={`nav-button ${activeTab === 'workouts' ? 'active' : ''}`}
          onClick={() => setActiveTab('workouts')}
        >
          Ejercicios
        </button>
      </nav>

      <main className="app-main">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;