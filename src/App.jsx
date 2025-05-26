
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import { AppSidebar } from './components/AppSidebar';
import { ThemeProvider } from './components/ThemeProvider';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import AlertMessage from './components/AlertMessage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


// Services
import { getCurrentUser } from './services/authService';
import PostView from './pages/PostView';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
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
    return (
      <ThemeProvider defaultTheme="light" storageKey="content-scheduler-theme">
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="flex items-center gap-2 text-foreground">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Loading...</span>
          </div>
        </div>
      </ThemeProvider>
    );
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
              path="/post/:id" 
              element={user ? <PostView showAlert={showAlert} /> : <Navigate to="/login" />} 
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
