import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  async getAllTodos(userName: string): Promise<Todo[]> {
    const todos = await this.todoRepository.findBy({ userName });
    if (todos.length === 0) {
      throw new NotFoundException('No todos found');
    }
    return todos;
  }

  async createTodo(todo: Todo): Promise<Todo> {
    return this.todoRepository.save(todo);
  }

  async updateTodo(id: number, todo: Todo): Promise<Todo> {
    const updatedTodo = await this.todoRepository.preload({
      id,
      ...todo,
    });
    return this.todoRepository.save(updatedTodo);
  }

  async deleteTodo(id: number): Promise<void> {
    await this.todoRepository.delete(id);
  }
}
