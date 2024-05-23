import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
            save: jest.fn().mockImplementation((todo) => Promise.resolve(todo)),
            preload: jest.fn().mockImplementation((todo) => Promise.resolve(todo)),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all todos', async () => {
    const todos = [{ id: 1, title: 'Todo 1', description: 'Description 1', completed: false }];
    jest.spyOn(service, 'getAllTodos').mockResolvedValue(todos);
    expect(await controller.getAllTodos()).toEqual(todos);
  });

  it('should create a new todo', async () => {
    const todo = { id: 1, title: 'Todo 1', description: 'Description 1', completed: false };
    expect(await controller.createTodo(todo)).toEqual(todo);
  });

  it('should update an existing todo', async () => {
    const todo = { id: 1, title: 'Updated Todo', description: 'Updated Description', completed: true };
    const updatedTodo = { id: 1, title: 'Updated Todo', description: 'Updated Description', completed: true };
    expect(await controller.updateTodo('1', todo)).toEqual(updatedTodo);
  });

  
  it('should delete an existing todo', async () => {
    const id = '1';
    const deleteMock = jest.spyOn(service['todoRepository'], 'delete');

    await controller.deleteTodo(id);

    expect(deleteMock).toHaveBeenCalledWith(Number(id));
    deleteMock.mockRestore();
  });
});