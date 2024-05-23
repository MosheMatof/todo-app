import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { Todo } from './todo.entity';
import { TodoService } from './todo.service';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getAllTodos(): Promise<Todo[]> {
    return this.todoService.getAllTodos();
  }

  @Post()
  createTodo(@Body() todo: Todo): Promise<Todo> {
    return this.todoService.createTodo(todo);
  }

  @Put(':id')
  updateTodo(
    @Param('id') id: string,
    @Body() todo: Todo,
  ): Promise<Todo> {
    return this.todoService.updateTodo(Number(id), todo);
  }

  @Delete(':id')
  deleteTodo(@Param('id') id: string): Promise<void> {
    return this.todoService.deleteTodo(Number(id));
  }
}