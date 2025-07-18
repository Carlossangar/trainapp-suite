export interface WeightEntry {
  id: string;
  date: Date;
  weight: number;
  notes?: string;
}

export interface BodyMeasurement {
  id: string;
  date: Date;
  measurements: {
    arms: number;
    legs: number;
    abdomen: number;
    torso: number;
  };
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'other';
  duration?: number;
  sets?: number;
  reps?: number;
  weight?: number;
  distance?: number;
  calories?: number;
}

export interface WorkoutEntry {
  id: string;
  date: Date;
  exercises: Exercise[];
  notes?: string;
  duration: number;
}