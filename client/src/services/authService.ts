import axios from 'axios';
import { User } from '../models';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await axios.get(API_BASE_URL + '/auth/profile', { withCredentials: true });
    const { user } = response.data;
    user.todos = user.todos || [];
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const signup = async (name: string, password: string): Promise<User | null> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, { username: name, password }, { withCredentials: true });
    const { user } = response.data;
    user.todos = [];
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const login = async (name: string, password: string): Promise<User | null> => {
  try {
    const response = await axios.post(API_BASE_URL + '/auth/login', { username: name, password }, { withCredentials: true });
    const { user } = response.data;
    user.todos = [];
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await axios.get(API_BASE_URL + '/auth/logout', { withCredentials: true });
  } catch (error) {
    console.error(error);
  }
};

export const googleLogin = async (credentialResponse: any): Promise<User | null> => {
  try {
    const response = await axios.post(API_BASE_URL + '/auth/google', { idToken: credentialResponse.credential }, { withCredentials: true });
    const { user } = response.data;
    user.todos = user.todos || [];
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};
