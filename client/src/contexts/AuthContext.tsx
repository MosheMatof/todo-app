import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Todo, User } from '../models';
import { 
  signup as signupService, 
  login as loginService, 
  logout as logoutService, 
  googleLogin as googleLoginService, 
  getCurrentUser as getCurrentUserService 
} from '../services/authService';

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
      const user = await getCurrentUserService();
      setCurrentUser(user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);
  
  const signup = async (name: string, password: string) => {
    try {
      const user = await signupService(name, password);
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const login = async (name: string, password: string) => {
    try {
      const user = await loginService(name, password);
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const logout = async () => {
    try {
      await logoutService();
      setCurrentUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  const googleLogin = async (credentialResponse: any) => {
    try {
      const user = await googleLoginService(credentialResponse);
      setCurrentUser(user);
      await getCurrentUser();
      return user;
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
