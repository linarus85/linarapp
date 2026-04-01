// src/App.tsx
import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SplashScreen from './components/SplashScreen';
import Register from './components/Register';
import Chat from './components/Chat';
import './index.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  
  useEffect(() => {
    // Проверяем, есть ли сохраненный пользователь
    const savedUserId = localStorage.getItem('userId');
    const savedUsername = localStorage.getItem('username');
    
    if (savedUserId && savedUsername) {
      setUserId(savedUserId);
      setUsername(savedUsername);
      setIsAuthenticated(true);
    }
  }, []);
  
  const handleRegister = (id: string, name: string) => {
    setUserId(id);
    setUsername(name);
    setIsAuthenticated(true);
  };
  
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }
  
  if (!isAuthenticated) {
    return <Register onRegister={handleRegister} />;
  }
  
  return (
    <>
      <Chat userId={userId} username={username} />
      <ToastContainer 
        position="top-right"
        theme="dark"
        autoClose={3000}
      />
    </>
  );
}

export default App;
