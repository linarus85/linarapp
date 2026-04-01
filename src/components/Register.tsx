// src/components/Register.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { registerUser } from '../firebase';
import { toast } from 'react-toastify';
import './Register.css';

interface RegisterProps {
  onRegister: (userId: string, username: string) => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast.error('Введите имя пользователя');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await registerUser(username.trim());
      onRegister(result.userId, result.username);
      toast.success('Регистрация успешна!');
    } catch (error: any) {
      toast.error(error.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="register-container">
      <video autoPlay loop muted playsInline className="background-video">
        <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-dark-wave-2721-large.mp4" type="video/mp4" />
      </video>
      
      <div className="register-overlay">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="register-card"
        >
          <h1 className="register-title">LinarApp</h1>
          <p className="register-subtitle">Добро пожаловать!</p>
          
          <form onSubmit={handleSubmit} className="register-form">
            <input
              type="text"
              placeholder="Ваше имя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="register-input"
              maxLength={30}
              disabled={loading}
            />
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? 'Регистрация...' : 'Начать общение'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
