import React, { useState, useEffect } from 'react';
import { WeightEntry } from '../types';

interface WeightTrackerProps {
  entries: WeightEntry[];
  onAddEntry: (entry: Omit<WeightEntry, 'id'>) => void;
}

const WeightTracker: React.FC<WeightTrackerProps> = ({ entries, onAddEntry }) => {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return;

    onAddEntry({
      date: new Date(date),
      weight: parseFloat(weight),
      notes: notes || undefined
    });

    setWeight('');
    setNotes('');
  };

  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="weight-tracker">
      <h2>Seguimiento de Peso</h2>
      
      <form onSubmit={handleSubmit} className="weight-form">
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

        <div className="form-group">
          <label htmlFor="weight">Peso (kg):</label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            step="0.1"
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
            placeholder="Observaciones adicionales..."
          />
        </div>

        <button type="submit">Agregar Registro</button>
      </form>

      <div className="weight-history">
        <h3>Historial de Peso</h3>
        {sortedEntries.length === 0 ? (
          <p>No hay registros de peso aún.</p>
        ) : (
          <div className="entries-list">
            {sortedEntries.map((entry) => (
              <div key={entry.id} className="entry-card">
                <div className="entry-header">
                  <span className="entry-date">{new Date(entry.date).toLocaleDateString()}</span>
                  <span className="entry-weight">{entry.weight} kg</span>
                </div>
                {entry.notes && (
                  <div className="entry-notes">{entry.notes}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeightTracker;