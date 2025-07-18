import { useState, useEffect } from 'react';
import { apiService, ApiWeightEntry, ApiBodyMeasurement, ApiWorkout } from '../services/api';
import { WeightEntry, BodyMeasurement, WorkoutEntry } from '../types';

// Utility functions to convert between API and app types
const convertApiWeightEntry = (apiEntry: ApiWeightEntry): WeightEntry => ({
  id: apiEntry.id,
  date: new Date(apiEntry.date),
  weight: apiEntry.weight,
  notes: apiEntry.notes,
});

const convertApiBodyMeasurement = (apiMeasurement: ApiBodyMeasurement): BodyMeasurement => ({
  id: apiMeasurement.id,
  date: new Date(apiMeasurement.date),
  measurements: {
    arms: apiMeasurement.arms,
    legs: apiMeasurement.legs,
    abdomen: apiMeasurement.abdomen,
    torso: apiMeasurement.torso,
  },
  notes: apiMeasurement.notes,
});

const convertApiWorkout = (apiWorkout: ApiWorkout): WorkoutEntry => ({
  id: apiWorkout.id,
  date: new Date(apiWorkout.date),
  duration: apiWorkout.duration,
  notes: apiWorkout.notes,
  exercises: apiWorkout.exercises.map(exercise => ({
    id: exercise.id,
    name: exercise.name,
    type: exercise.type,
    duration: exercise.duration,
    sets: exercise.sets,
    reps: exercise.reps,
    weight: exercise.weight,
    distance: exercise.distance,
    calories: exercise.calories,
  })),
});

export const useWeightEntries = () => {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiEntries = await apiService.getWeightEntries();
      const convertedEntries = apiEntries.map(convertApiWeightEntry);
      setEntries(convertedEntries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar registros de peso');
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async (entry: Omit<WeightEntry, 'id'>) => {
    try {
      const apiEntry = await apiService.createWeightEntry({
        date: entry.date.toISOString().split('T')[0],
        weight: entry.weight,
        notes: entry.notes,
      });
      const convertedEntry = convertApiWeightEntry(apiEntry);
      setEntries(prev => [convertedEntry, ...prev]);
      return convertedEntry;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear registro de peso');
      throw err;
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return { entries, loading, error, addEntry, refetch: fetchEntries };
};

export const useBodyMeasurements = () => {
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeasurements = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiMeasurements = await apiService.getBodyMeasurements();
      const convertedMeasurements = apiMeasurements.map(convertApiBodyMeasurement);
      setMeasurements(convertedMeasurements);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar medidas corporales');
    } finally {
      setLoading(false);
    }
  };

  const addMeasurement = async (measurement: Omit<BodyMeasurement, 'id'>) => {
    try {
      const apiMeasurement = await apiService.createBodyMeasurement({
        date: measurement.date.toISOString().split('T')[0],
        arms: measurement.measurements.arms,
        legs: measurement.measurements.legs,
        abdomen: measurement.measurements.abdomen,
        torso: measurement.measurements.torso,
        notes: measurement.notes,
      });
      const convertedMeasurement = convertApiBodyMeasurement(apiMeasurement);
      setMeasurements(prev => [convertedMeasurement, ...prev]);
      return convertedMeasurement;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear medida corporal');
      throw err;
    }
  };

  useEffect(() => {
    fetchMeasurements();
  }, []);

  return { measurements, loading, error, addMeasurement, refetch: fetchMeasurements };
};

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiWorkouts = await apiService.getWorkouts();
      const convertedWorkouts = apiWorkouts.map(convertApiWorkout);
      setWorkouts(convertedWorkouts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar entrenamientos');
    } finally {
      setLoading(false);
    }
  };

  const addWorkout = async (workout: Omit<WorkoutEntry, 'id'>) => {
    try {
      const apiWorkout = await apiService.createWorkout({
        date: workout.date.toISOString().split('T')[0],
        duration: workout.duration,
        notes: workout.notes,
        exercises: workout.exercises.map(exercise => ({
          id: exercise.id,
          name: exercise.name,
          type: exercise.type,
          duration: exercise.duration,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
          distance: exercise.distance,
          calories: exercise.calories,
        })),
      });
      const convertedWorkout = convertApiWorkout(apiWorkout);
      setWorkouts(prev => [convertedWorkout, ...prev]);
      return convertedWorkout;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear entrenamiento');
      throw err;
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  return { workouts, loading, error, addWorkout, refetch: fetchWorkouts };
};