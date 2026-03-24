import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import AddMedicine from './AddMedicine';
import SmartAssistant from './SmartAssistant';
import './index.css';

const PrivateRoute = ({ children }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return localStorage.getItem('token') ? (
    <div className="app-container">
      <header className="header">
        <h1>Smart Health</h1>
        <nav className="header-nav">
          <Link to="/" className="btn btn-secondary">Dashboard</Link>
          <Link to="/smart-assistant" className="btn btn-secondary">Smart Assistant</Link>
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </nav>
      </header>
      {children}
    </div>
  ) : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/add-medicine" element={<PrivateRoute><AddMedicine /></PrivateRoute>} />
        <Route path="/smart-assistant" element={<PrivateRoute><SmartAssistant /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
