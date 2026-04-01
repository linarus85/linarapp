// src/components/Message.tsx
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import './Message.css';

interface MessageProps {
  message: any;
  isOwn: boolean;
  onLongPress: () => void;
  onReply: () => void;
}

const Message: React.FC<MessageProps> = ({ message, isOwn, onLongPress, onReply }) => {
  const [showImage, setShowImage] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  
  const handleTouchStart = () => {
    pressTimer.current = setTimeout(() => {
      onLongPress();
    }, 3000);
  };
  
  const handleTouchEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };
  
  // Исправлено: правильная типизация для useSwipeable
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      onReply();
    },
    onSwipedRight: () => {
      onReply();
    },
    trackMouse: true
  });
  
  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return '';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: isOwn ? 100 : -100 }}
      className={`message-wrapper ${isOwn ? 'own' : 'other'}`}
      {...swipeHandlers}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onContextMenu={(e) => e.preventDefault()} // Предотвращаем контекстное меню
    >
      <div className="message-bubble">
        {!isOwn && <div className="message-sender">{message.senderName}</div>}
        
        {message.image && message.image !== '' && (
          <img 
            src={message.image} 
            alt="Message" 
            className="message-image"
            onClick={() => setShowImage(true)}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        
        {message.text && message.text !== '' && (
          <div className="message-text">{message.text}</div>
        )}
        
        <div className="message-meta">
          <span className="message-time">{formatTime(message.timestamp)}</span>
          {isOwn && message.read && <span className="message-read">✓✓</span>}
        </div>
      </div>
      
      {showImage && message.image && (
        <div className="image-modal" onClick={() => setShowImage(false)}>
          <img src={message.image} alt="Full size" />
        </div>
      )}
    </motion.div>
  );
};

export default Message;