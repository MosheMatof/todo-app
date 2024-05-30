import { Dayjs } from 'dayjs';

interface Todo {
    id?: number;
    userName: string;
    title: string;
    description: string;
    dueDate: Dayjs; 
    completed: boolean;
}

interface User {
    name: string;
    picture: string;
    todos: Todo[]
  }

export type { Todo, User };