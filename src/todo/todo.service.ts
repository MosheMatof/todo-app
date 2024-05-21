import { Injectable } from '@nestjs/common';
import { Todo } from './todo.model';

@Injectable()
export class TodoService {
  private todos: Todo[] = [];

  getAllTodos(): Todo[] {
    return this.todos;
  }

  createTodo(todo: Todo): Todo {
    this.todos.push(todo);
    return todo;
  }

  updateTodo(id: number, todo: Todo): Todo {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.todos[index] = todo;
      return todo;
    }
  }

  deleteTodo(id: number): void {
    this.todos = this.todos.filter((t) => t.id !== id);
  }
}