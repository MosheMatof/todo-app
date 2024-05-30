import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { Todo, User } from '../models';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';



interface AuthContextType {
  currentUser: User | null;
  signup: (name: string, password: string) => Promise<User | null>;
  login: (name: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  googleLogin: (credentialResponse: any) => Promise<User | null>;
  getCurrentUser: () => Promise<void>;
  setTodos: (updatedTodos: Todo[]) => void;
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

  const getCurrentUser = async () => {
    try {
      const response = await axios.get(API_BASE_URL + '/auth/profile', { withCredentials: true });
      const {user} = response.data;
      user.todos = user.todos || [];
      return user;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };

    fetchCurrentUser();
  }, []);
  
  const signup = async (name: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, { username: name, password }, { withCredentials: true });
      const { user } = response.data;
      user.todos = [];
      setCurrentUser(user);
      return response.data.user;
    } catch (error) {
      console.error(error);
      // Throw the error again after logging it
      throw error;
    }
  };

  const login = async (name: string, password: string) => {
    try {
      const response = await axios.post(API_BASE_URL + '/auth/login', { username: name, password }, { withCredentials: true });
      const { user } = response.data;
      user.todos = [];
      setCurrentUser(user);
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
      const response = await axios.post(API_BASE_URL + '/auth/google', { idToken: credentialResponse.credential }, { withCredentials: true });
      setCurrentUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const setTodos = (updatedTodos: Todo[]) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        todos: updatedTodos,
      });
    }
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    googleLogin,
    getCurrentUser,
    setTodos,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}