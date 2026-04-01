// src/components/Chat.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { getUsers, getMessages, sendMessage, deleteMessage, updateLastSeen } from '../firebase';
import Message from './Message';
import UserList from './UserList';
import './Chat.css';

interface ChatProps {
  userId: string;
  username: string;
}

const Chat: React.FC<ChatProps> = ({ userId, username }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showUserList, setShowUserList] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Получаем пользователей
    getUsers((usersData) => {
      const usersList = Object.entries(usersData).map(([id, data]: [string, any]) => ({
        id,
        ...data
      }));
      setUsers(usersList);
    });
    
    // Получаем сообщения
    getMessages((messagesData) => {
      setMessages(messagesData);
    });
    
    // Обновляем время последнего посещения каждые 30 секунд
    const interval = setInterval(() => {
      updateLastSeen(userId);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [userId]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if (!inputText.trim() && !selectedImage) return;
    
    // Вибрация
    if (Haptics) {
      try {
        await Haptics.impact({ style: ImpactStyle.Light });
      } catch (error) {
        console.log('Haptics not supported');
      }
    }
    
    const image = selectedImage || '';
    await sendMessage(userId, username, inputText, image);
    setInputText('');
    setSelectedImage('');
  };
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleDeleteMessage = async (messageId: string) => {
    // Вибрация при долгом нажатии
    if (Haptics) {
      try {
        await Haptics.vibrate();
      } catch (error) {
        console.log('Haptics not supported');
      }
    }
    await deleteMessage(messageId);
  };
  
  const handleReply = (message: any) => {
    setInputText(`Ответ @${message.senderName}: ${message.text}\n---\n`);
  };
  
  const filteredMessages = messages.filter(msg => {
    if (selectedUser) {
      return msg.senderId === selectedUser || msg.senderId === userId;
    }
    return true;
  }).sort((a, b) => {
    const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    return timeA - timeB;
  });
  
  return (
    <div className="chat-container">
      {showUserList && (
        <UserList 
          users={users} 
          currentUserId={userId}
          onSelectUser={setSelectedUser}
          onClose={() => setShowUserList(false)}
        />
      )}
      
      <div className="chat-main">
        <div className="chat-header">
          <button 
            className="menu-button"
            onClick={() => setShowUserList(!showUserList)}
          >
            ☰
          </button>
          <h2>{selectedUser ? users.find(u => u.id === selectedUser)?.username || 'Пользователь' : 'Все сообщения'}</h2>
        </div>
        
        <div className="messages-container">
          <AnimatePresence>
            {filteredMessages.map((message) => (
              <Message
                key={message.id}
                message={message}
                isOwn={message.senderId === userId}
                onLongPress={() => handleDeleteMessage(message.id)}
                onReply={() => handleReply(message)}
              />
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
        
        <div className="input-container">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />
          
          <button 
            className="image-button"
            onClick={() => fileInputRef.current?.click()}
          >
            📷
          </button>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Введите сообщение..."
            className="message-input"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          
          <button 
            className="send-button"
            onClick={handleSendMessage}
          >
            ✈️
          </button>
        </div>
        
        {selectedImage && (
          <div className="image-preview">
            <img src={selectedImage} alt="Preview" />
            <button onClick={() => setSelectedImage('')}>✖</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;