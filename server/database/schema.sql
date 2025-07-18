-- Tabla para registros de peso
CREATE TABLE IF NOT EXISTS weight_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    weight REAL NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para medidas corporales
CREATE TABLE IF NOT EXISTS body_measurements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    arms REAL NOT NULL,
    legs REAL NOT NULL,
    abdomen REAL NOT NULL,
    torso REAL NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para entrenamientos
CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    duration INTEGER NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para ejercicios dentro de entrenamientos
CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workout_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('cardio', 'strength', 'flexibility', 'other')),
    duration INTEGER,
    sets INTEGER,
    reps INTEGER,
    weight REAL,
    distance REAL,
    calories INTEGER,
    FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_weight_entries_date ON weight_entries(date);
CREATE INDEX IF NOT EXISTS idx_body_measurements_date ON body_measurements(date);
CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(date);
CREATE INDEX IF NOT EXISTS idx_exercises_workout_id ON exercises(workout_id);