// src/components/UserList.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './UserList.css';

interface User {
  id: string;
  username: string;
  lastSeen?: any;
  avatar?: string;
}

interface UserListProps {
  users: User[];
  currentUserId: string;
  onSelectUser: (userId: string) => void;
  onClose: () => void;
}

const UserList: React.FC<UserListProps> = ({ users, currentUserId, onSelectUser, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredUsers = users.filter(user => 
    user.id !== currentUserId && 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatLastSeen = (timestamp: any) => {
    if (!timestamp) return 'только что';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays < 7) return `${diffDays} дн назад`;
    
    return date.toLocaleDateString();
  };
  
  return (
    <>
      <motion.div 
        className="userlist-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      <motion.div 
        className="userlist-container"
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        exit={{ x: -300 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <div className="userlist-header">
          <h3>Пользователи</h3>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        
        <div className="userlist-search">
          <input
            type="text"
            placeholder="Поиск пользователей..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="userlist-content">
          <AnimatePresence>
            {filteredUsers.length === 0 ? (
              <div className="no-users">
                <span>👥</span>
                <p>Нет пользователей</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  className="user-item"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onSelectUser(user.id);
                    onClose();
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="user-avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.username} />
                    ) : (
                      <div className="avatar-placeholder">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="user-status online"></div>
                  </div>
                  
                  <div className="user-info">
                    <div className="user-name">{user.username}</div>
                    <div className="user-lastseen">
                      Был(а) {formatLastSeen(user.lastSeen)}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

export default UserList;