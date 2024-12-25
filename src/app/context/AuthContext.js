"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkExpiration = () => {
    const userId = localStorage.getItem('userId');
    const timestamp = localStorage.getItem('timestamp');
    if (userId && timestamp) {
      const timeElapsed = Date.now() - parseInt(timestamp, 10);
      const thirtyMinutes = 30 * 60 * 1000;
      if (timeElapsed < thirtyMinutes) {
        return userId;
      } else {
        localStorage.removeItem('userId');
        localStorage.removeItem('timestamp');
      }
    }
    return null;
  };

  useEffect(() => {
    const checkUser = async () => {
      const userId = checkExpiration();

      if (userId) {
        try {
          const userRef = doc(db, 'users', userId);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setUser({ id: userDoc.id, ...userDoc.data() });
          } else {
            setUser(null);
            localStorage.removeItem('userId');
            localStorage.removeItem('timestamp');
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
          localStorage.removeItem('userId');
          localStorage.removeItem('timestamp');
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const handleLogin = (userId) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('timestamp', Date.now().toString());
    setUser({ id: userId });
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('timestamp');
    setUser(null);
  };

  const value = {
    user,
    setUser,
    loading,
    handleLogin,
    handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
