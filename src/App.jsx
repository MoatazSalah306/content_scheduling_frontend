
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import AlertMessage from './components/AlertMessage';

// Services
import { getCurrentUser } from './services/authService';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    // Check if user is logged in on app start
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 3000);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        {alert.show && (
          <AlertMessage 
            type={alert.type} 
            message={alert.message} 
            onClose={() => setAlert({ show: false, type: '', message: '' })}
          />
        )}
        
        {user && <Navbar user={user} setUser={setUser} showAlert={showAlert} />}
        
        <main className="main-content">
          <Routes>
            <Route 
              path="/login" 
              element={!user ? <Login setUser={setUser} showAlert={showAlert} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/register" 
              element={!user ? <Register setUser={setUser} showAlert={showAlert} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard showAlert={showAlert} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile" 
              element={user ? <Profile user={user} setUser={setUser} showAlert={showAlert} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/settings" 
              element={user ? <Settings showAlert={showAlert} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/create-post" 
              element={user ? <CreatePost showAlert={showAlert} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/edit-post/:id" 
              element={user ? <EditPost showAlert={showAlert} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/" 
              element={<Navigate to={user ? "/dashboard" : "/login"} />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
