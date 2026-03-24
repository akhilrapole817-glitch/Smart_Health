import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

function AddMedicine() {
  const [formData, setFormData] = useState({
    name: '', dosage: '', schedule: 'morning', start_date: '', end_date: '', requires_food: false
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData };
      if (!payload.end_date) delete payload.end_date;
      await api.post('medicines/', payload);
      navigate('/');
    } catch (err) {
      alert('Error creating medicine. Please verify your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Add New Medicine</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid-2">
          <div className="form-group">
            <label>Medicine Name</label>
            <input type="text" className="form-control" required onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Lisinopril" />
          </div>
          <div className="form-group">
            <label>Dosage</label>
            <input type="text" className="form-control" placeholder="e.g. 10mg" required onChange={e => setFormData({...formData, dosage: e.target.value})} />
          </div>
        </div>
        
        <div className="form-group">
          <label>Schedule</label>
          <select className="form-control" onChange={e => setFormData({...formData, schedule: e.target.value})} value={formData.schedule}>
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>Start Date</label>
            <input type="date" className="form-control" required onChange={e => setFormData({...formData, start_date: e.target.value})} />
          </div>
          <div className="form-group">
            <label>End Date (Optional)</label>
            <input type="date" className="form-control" onChange={e => setFormData({...formData, end_date: e.target.value})} />
          </div>
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem', marginBottom: '2rem' }}>
          <input type="checkbox" id="req_food" style={{ width: '18px', height: '18px' }} onChange={e => setFormData({...formData, requires_food: e.target.checked})} />
          <label htmlFor="req_food" style={{ marginBottom: 0, cursor: 'pointer' }}>Take with food</label>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Processing...' : 'Save Medicine'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default AddMedicine;
