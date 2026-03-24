import React, { useState } from 'react';
import api from './api';

function SmartAssistant() {
  const [food, setFood] = useState('');
  const [foodResult, setFoodResult] = useState(null);
  const [foodLoading, setFoodLoading] = useState(false);

  const [symptom, setSymptom] = useState('');
  const [symptomResult, setSymptomResult] = useState(null);
  const [symptomLoading, setSymptomLoading] = useState(false);

  const checkFood = async (e) => {
    e.preventDefault();
    setFoodLoading(true);
    try {
      const res = await api.post('check-food/', { food });
      setFoodResult(res.data);
    } catch (err) {
      alert('Error checking food compatibility');
    } finally {
      setFoodLoading(false);
    }
  };

  const checkSymptoms = async (e) => {
    e.preventDefault();
    setSymptomLoading(true);
    try {
      const res = await api.post('check-symptoms/', { symptom });
      setSymptomResult(res.data);
    } catch (err) {
      alert('Error checking symptoms');
    } finally {
      setSymptomLoading(false);
    }
  };

  return (
    <div>
      <div className="header" style={{ marginBottom: '1.5rem', border: 'none', paddingBottom: '0' }}>
        <h2>Smart AI Assistant</h2>
      </div>

      <div className="grid-2">
        {/* Food Check */}
        <div className="glass-panel">
          <h3 style={{ marginBottom: '1rem' }}>Food Compatibility Check</h3>
          <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Enter a food or drink to see if it interacts with any of your current medications.
          </p>
          <form onSubmit={checkFood} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input 
              type="text" className="form-control" 
              placeholder="e.g. Grapefruit" 
              value={food} onChange={e => setFood(e.target.value)} required 
            />
            <button type="submit" className="btn" disabled={foodLoading}>
              {foodLoading ? '...' : 'Check'}
            </button>
          </form>

          {foodResult && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ textTransform: 'capitalize' }}>{foodResult.food}</h4>
                <span className={`badge badge-${foodResult.status}`}>
                  {foodResult.status.toUpperCase()}
                </span>
              </div>
              <p style={{ fontSize: '0.9rem' }}>{foodResult.explanation}</p>
            </div>
          )}
        </div>

        {/* Symptom Support */}
        <div className="glass-panel">
          <h3 style={{ marginBottom: '1rem' }}>Symptom Support</h3>
          <p style={{ color: 'var(--text-light)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Enter a symptom you're experiencing for safe alternatives and warnings based on your meds.
          </p>
          <form onSubmit={checkSymptoms} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input 
              type="text" className="form-control" 
              placeholder="e.g. Headache, Nausea" 
              value={symptom} onChange={e => setSymptom(e.target.value)} required 
            />
            <button type="submit" className="btn" disabled={symptomLoading}>
              {symptomLoading ? '...' : 'Ask AI'}
            </button>
          </form>

          {symptomResult && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.5)' }}>
              <h4 style={{ textTransform: 'capitalize', marginBottom: '0.5rem' }}>{symptomResult.symptom}</h4>
              
              {symptomResult.warnings && symptomResult.warnings.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <strong style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>⚠️ Warnings:</strong>
                  <ul style={{ paddingLeft: '1.5rem', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    {symptomResult.warnings.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              )}

              {symptomResult.safe_options && symptomResult.safe_options.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <strong style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>✅ Safe Options:</strong>
                  <ul style={{ paddingLeft: '1.5rem', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    {symptomResult.safe_options.map((o, i) => <li key={i}>{o}</li>)}
                  </ul>
                </div>
              )}

              {symptomResult.alternative_suggestions && (
                <div>
                  <strong style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>🌿 Natural Alternatives:</strong>
                  <ul style={{ paddingLeft: '1.5rem', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    {symptomResult.alternative_suggestions.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SmartAssistant;
