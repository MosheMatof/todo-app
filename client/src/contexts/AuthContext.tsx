import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface User {
  id: string;
  name: string;
  // Add other user properties here
}

interface AuthContextType {
  currentUser: User | null;
  signup: (email: string, password: string) => Promise<User | null>;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    axios.get(API_BASE_URL + '/auth/profile', { withCredentials: true })
      .then(response => setCurrentUser(response.data))
      .catch(error => console.error(error));
  }, []);

  const signup = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, { username: email, password }, { withCredentials: true });
      setCurrentUser(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(API_BASE_URL + '/auth/login', { username: email, password }, { withCredentials: true });
      setCurrentUser(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const logout = async () => {
    try {
      await axios.get(API_BASE_URL + '/auth/logout', { withCredentials: true });
      setCurrentUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  const googleLogin = async (credentialResponse: any) => {
    try {
      const response = await axios.post(API_BASE_URL + '/auth/google', { idToken: credentialResponse.credential });
      setCurrentUser(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    googleLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}