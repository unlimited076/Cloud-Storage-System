import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(localStorage.getItem('token'));


  useEffect(() => {
    if (token) {
      
      localStorage.setItem('token', token);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      
      localStorage.removeItem('token');
      
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = (tokenData) => {
    setToken(tokenData);
  };
  
  const logout = () => {
    setToken(null); 
  };

  const value = { token, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
