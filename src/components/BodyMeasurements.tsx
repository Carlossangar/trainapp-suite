import React, { useState } from 'react';
import { BodyMeasurement } from '../types';

interface BodyMeasurementsProps {
  measurements: BodyMeasurement[];
  onAddMeasurement: (measurement: Omit<BodyMeasurement, 'id'>) => void;
}

const BodyMeasurements: React.FC<BodyMeasurementsProps> = ({ measurements, onAddMeasurement }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [arms, setArms] = useState('');
  const [legs, setLegs] = useState('');
  const [abdomen, setAbdomen] = useState('');
  const [torso, setTorso] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!arms || !legs || !abdomen || !torso) return;

    onAddMeasurement({
      date: new Date(date),
      measurements: {
        arms: parseFloat(arms),
        legs: parseFloat(legs),
        abdomen: parseFloat(abdomen),
        torso: parseFloat(torso)
      },
      notes: notes || undefined
    });

    setArms('');
    setLegs('');
    setAbdomen('');
    setTorso('');
    setNotes('');
  };

  const sortedMeasurements = [...measurements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="body-measurements">
      <h2>Medidas Corporales</h2>
      
      <form onSubmit={handleSubmit} className="measurements-form">
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

        <div className="measurements-grid">
          <div className="form-group">
            <label htmlFor="arms">Brazos (cm):</label>
            <input
              type="number"
              id="arms"
              value={arms}
              onChange={(e) => setArms(e.target.value)}
              step="0.1"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="legs">Piernas (cm):</label>
            <input
              type="number"
              id="legs"
              value={legs}
              onChange={(e) => setLegs(e.target.value)}
              step="0.1"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="abdomen">Abdomen (cm):</label>
            <input
              type="number"
              id="abdomen"
              value={abdomen}
              onChange={(e) => setAbdomen(e.target.value)}
              step="0.1"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="torso">Torso (cm):</label>
            <input
              type="number"
              id="torso"
              value={torso}
              onChange={(e) => setTorso(e.target.value)}
              step="0.1"
              min="0"
              required
            />
          </div>
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

        <button type="submit">Agregar Medidas</button>
      </form>

      <div className="measurements-history">
        <h3>Historial de Medidas</h3>
        {sortedMeasurements.length === 0 ? (
          <p>No hay medidas registradas aún.</p>
        ) : (
          <div className="measurements-list">
            {sortedMeasurements.map((measurement) => (
              <div key={measurement.id} className="measurement-card">
                <div className="measurement-header">
                  <span className="measurement-date">{new Date(measurement.date).toLocaleDateString()}</span>
                </div>
                <div className="measurement-details">
                  <div className="measurement-item">
                    <span className="label">Brazos:</span>
                    <span className="value">{measurement.measurements.arms} cm</span>
                  </div>
                  <div className="measurement-item">
                    <span className="label">Piernas:</span>
                    <span className="value">{measurement.measurements.legs} cm</span>
                  </div>
                  <div className="measurement-item">
                    <span className="label">Abdomen:</span>
                    <span className="value">{measurement.measurements.abdomen} cm</span>
                  </div>
                  <div className="measurement-item">
                    <span className="label">Torso:</span>
                    <span className="value">{measurement.measurements.torso} cm</span>
                  </div>
                </div>
                {measurement.notes && (
                  <div className="measurement-notes">{measurement.notes}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BodyMeasurements;