import { Controller, Get, Post, Put, Delete, Body, Param, Headers, BadRequestException, NotFoundException } from '@nestjs/common';
import { Todo } from './todo.entity';
import { TodoService } from './todo.service';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async getAllTodos(@Headers('x-user-id') userNameBase64: string): Promise<Todo[]> {
    try {
      const userName = decodeURIComponent(Buffer.from(userNameBase64, 'base64').toString('utf-8'));
      return await this.todoService.getAllTodos(userName);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new BadRequestException(error.message);
      }
    }
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