import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from './api';

function Dashboard() {
  const [medicines, setMedicines] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [medRes, remRes] = await Promise.all([
        api.get('medicines/'),
        api.get('reminders/')
      ]);
      setMedicines(medRes.data);
      setReminders(remRes.data.reminders);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this medicine?')) {
      await api.delete(`medicines/${id}/`);
      fetchData();
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div>
      <div className="header" style={{ marginBottom: '1.5rem', border: 'none', paddingBottom: '0' }}>
        <h2>My Medications</h2>
        <Link to="/add-medicine" className="btn">+ Add Medicine</Link>
      </div>
      
      {reminders.length > 0 && (
        <div className="glass-panel" style={{ borderLeft: '4px solid var(--warning)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--warning)' }}>Today's Reminders</h3>
          {reminders.map((r, i) => (
            <div key={i} style={{ padding: '0.75rem', background: 'rgba(245,158,11,0.1)', borderRadius: '8px', marginBottom: '0.5rem' }}>
              <strong>{r.medicine}</strong> ({r.dosage}) - {r.schedule} {r.requires_food ? '🍽️ (With Food)' : ''}
              <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>{r.message}</p>
            </div>
          ))}
        </div>
      )}

      <div className="card-grid">
        {medicines.map(med => (
          <div className="glass-panel" key={med.id} style={{ marginBottom: 0 }}>
            <h3 style={{ marginBottom: '0.25rem' }}>{med.name}</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontWeight: '500' }}>{med.dosage}</p>
            <div style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
              <p><strong>Schedule:</strong> <span style={{ textTransform: 'capitalize' }}>{med.schedule}</span></p>
              <p><strong>Timeline:</strong> {med.start_date} to {med.end_date || 'Ongoing'}</p>
              <p><strong>Requires Food:</strong> {med.requires_food ? 'Yes 🍽️' : 'No'}</p>
            </div>
            <button onClick={() => handleDelete(med.id)} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>
              Delete
            </button>
          </div>
        ))}
        {medicines.length === 0 && (
          <div className="glass-panel" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>You haven't added any medicines yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
