import axios, { AxiosError } from 'axios';
import { Todo } from '../models';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const fetchTodos = async (userName: string): Promise<Todo[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/todos`, {
      headers: {
        'X-User-Id': btoa(encodeURIComponent(userName)),
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error?.response?.status === 404) {
      return [];
    }
    console.error('Failed to fetch todos:', error);
    throw error;
  }
};

export const createTodo = async (newTodo: Todo): Promise<Todo> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/todos`, newTodo, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create todo:', error);
    throw error;
  }
};

export const updateTodo = async (updatedTodo: Todo): Promise<void> => {
  try {
    await axios.put(`${API_BASE_URL}/todos/${updatedTodo.id}`, updatedTodo, {
      withCredentials: true,
    });
  } catch (error) {
    console.error('Failed to update todo:', error);
    throw error;
  }
};

export const deleteTodo = async (todoId: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/todos/${todoId}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error('Failed to delete todo:', error);
    throw error;
  }
};
