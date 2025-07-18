const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3001/api';

export interface ApiWeightEntry {
  id: string;
  date: string;
  weight: number;
  notes?: string;
}

export interface ApiBodyMeasurement {
  id: string;
  date: string;
  arms: number;
  legs: number;
  abdomen: number;
  torso: number;
  notes?: string;
}

export interface ApiExercise {
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

export interface ApiWorkout {
  id: string;
  date: string;
  duration: number;
  notes?: string;
  exercises: ApiExercise[];
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Weight API
  async getWeightEntries(): Promise<ApiWeightEntry[]> {
    return this.request<ApiWeightEntry[]>('/weight');
  }

  async createWeightEntry(entry: Omit<ApiWeightEntry, 'id'>): Promise<ApiWeightEntry> {
    return this.request<ApiWeightEntry>('/weight', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
  }

  async updateWeightEntry(id: string, entry: Omit<ApiWeightEntry, 'id'>): Promise<ApiWeightEntry> {
    return this.request<ApiWeightEntry>(`/weight/${id}`, {
      method: 'PUT',
      body: JSON.stringify(entry),
    });
  }

  async deleteWeightEntry(id: string): Promise<void> {
    return this.request<void>(`/weight/${id}`, {
      method: 'DELETE',
    });
  }

  // Body Measurements API
  async getBodyMeasurements(): Promise<ApiBodyMeasurement[]> {
    return this.request<ApiBodyMeasurement[]>('/measurements');
  }

  async createBodyMeasurement(measurement: Omit<ApiBodyMeasurement, 'id'>): Promise<ApiBodyMeasurement> {
    return this.request<ApiBodyMeasurement>('/measurements', {
      method: 'POST',
      body: JSON.stringify(measurement),
    });
  }

  async updateBodyMeasurement(id: string, measurement: Omit<ApiBodyMeasurement, 'id'>): Promise<ApiBodyMeasurement> {
    return this.request<ApiBodyMeasurement>(`/measurements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(measurement),
    });
  }

  async deleteBodyMeasurement(id: string): Promise<void> {
    return this.request<void>(`/measurements/${id}`, {
      method: 'DELETE',
    });
  }

  // Workouts API
  async getWorkouts(): Promise<ApiWorkout[]> {
    return this.request<ApiWorkout[]>('/workouts');
  }

  async createWorkout(workout: Omit<ApiWorkout, 'id'>): Promise<ApiWorkout> {
    return this.request<ApiWorkout>('/workouts', {
      method: 'POST',
      body: JSON.stringify(workout),
    });
  }

  async updateWorkout(id: string, workout: Omit<ApiWorkout, 'id'>): Promise<ApiWorkout> {
    return this.request<ApiWorkout>(`/workouts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(workout),
    });
  }

  async deleteWorkout(id: string): Promise<void> {
    return this.request<void>(`/workouts/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

export const apiService = new ApiService();