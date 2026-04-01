// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { 
  getDatabase, 
  ref, 
  set, 
  onValue, 
  push, 
  remove, 
  update, 
  serverTimestamp, 
  query, 
  orderByChild,
  DataSnapshot
} from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBuGZ-xJEz1npWm6ei9PGwCdZ4-56w2htM",
  authDomain: "linarapp-86ac5.firebaseapp.com",
  databaseURL: "https://linarapp-86ac5-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "linarapp-86ac5",
  storageBucket: "linarapp-86ac5.firebasestorage.app",
  messagingSenderId: "110619959074",
  appId: "1:110619959074:web:2f98f08f4fcf0dd02d4f7b"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);

// Типы для данных
interface User {
  username: string;
  lastSeen: any;
  avatar: string;
  createdAt: any;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  image: string;
  timestamp: any;
  read: boolean;
  readBy: string[];
}

// Вспомогательные функции
export const registerUser = async (username: string) => {
  try {
    // Проверка существования имени
    const usersRef = ref(db, 'users');
    
    // Используем Promise для получения данных
    const snapshot = await new Promise<DataSnapshot>((resolve, reject) => {
      onValue(usersRef, resolve, reject, { onlyOnce: true });
    });
    
    const users = snapshot.val() || {};
    const userExists = Object.values(users).some((user: any) => user.username === username);
    
    if (userExists) {
      throw new Error('Имя уже зарегистрировано');
    }
    
    // Анонимная аутентификация
    const userCredential = await signInAnonymously(auth);
    const userId = userCredential.user.uid;
    
    // Сохраняем пользователя
    await set(ref(db, `users/${userId}`), {
      username,
      lastSeen: serverTimestamp(),
      avatar: `https://avatars.dicebear.com/api/initials/${encodeURIComponent(username)}.svg`,
      createdAt: serverTimestamp()
    });
    
    // Сохраняем имя пользователя в localStorage
    localStorage.setItem('username', username);
    localStorage.setItem('userId', userId);
    
    return { userId, username };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const sendMessage = async (senderId: string, senderName: string, text: string, image?: string) => {
  try {
    const messagesRef = ref(db, 'messages');
    const newMessageRef = push(messagesRef);
    
    const messageData = {
      id: newMessageRef.key,
      senderId,
      senderName,
      text: text || '',
      image: image || '',
      timestamp: serverTimestamp(),
      read: false,
      readBy: [senderId]
    };
    
    await set(newMessageRef, messageData);
    return newMessageRef.key;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const deleteMessage = async (messageId: string) => {
  try {
    const messageRef = ref(db, `messages/${messageId}`);
    await remove(messageRef);
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};

export const markMessageAsRead = async (messageId: string, userId: string) => {
  try {
    const messageRef = ref(db, `messages/${messageId}`);
    await update(messageRef, {
      read: true
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
  }
};

export const updateLastSeen = async (userId: string) => {
  try {
    const userRef = ref(db, `users/${userId}`);
    await update(userRef, {
      lastSeen: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating last seen:', error);
  }
};

export const getUsers = (callback: (users: Record<string, User>) => void) => {
  const usersRef = ref(db, 'users');
  onValue(usersRef, (snapshot) => {
    const users = snapshot.val() || {};
    callback(users);
  });
};

export const getMessages = (callback: (messages: Message[]) => void) => {
  const messagesRef = query(ref(db, 'messages'), orderByChild('timestamp'));
  onValue(messagesRef, (snapshot) => {
    const messages = snapshot.val() || {};
    const messagesArray: Message[] = Object.values(messages);
    callback(messagesArray);
  });
};