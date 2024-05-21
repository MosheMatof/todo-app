import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { Todo } from './todo.model';
import { TodoService } from './todo.service';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getAllTodos(): Todo[] {
    return this.todoService.getAllTodos();
  }

  @Post()
  createTodo(@Body() todo: Todo): Todo {
    return this.todoService.createTodo(todo);
  }

  @Put(':id')
  updateTodo(
    @Param('id') id: string,
    @Body() todo: Todo,
  ): Todo {
    return this.todoService.updateTodo(Number(id), todo);
  }

  @Delete(':id')
  deleteTodo(
    @Param('id') id: string,
  ): void {
    this.todoService.deleteTodo(Number(id));
  }
}