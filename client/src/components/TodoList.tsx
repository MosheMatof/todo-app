import React, { useState, useEffect } from 'react';
import { List, Button, FloatButton, Checkbox, message, Flex, Table, Tooltip, Space, Divider } from 'antd';
import type { TableProps } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { Todo } from '../models';
import TodoModal from './TodoModal';
import dayjs from 'dayjs';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '../services/todoService';

const TIME_FORMAT = "DD-MM-YYYY HH:mm:ss";

function TodoList() {
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const { currentUser, setTodos } = useAuth();
  const todos = currentUser?.todos || [];
  const viewTodos = Array.isArray(todos) && showCompleted ? todos.filter((todo) => !todo.completed) : todos;

  const onUpdateClick = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalVisible(true);
  };

  const onAddClick = () => {
    setEditingTodo(null);
    setIsModalVisible(true);
  };

  const handleAddTodo = async (newTodo: Todo) => {
    try {
      newTodo.userName = currentUser?.name || '';
      const createdTodo = await createTodo(newTodo);
      message.success('Todo created successfully');
      setTodos(Array.isArray(todos) ? [...todos, createdTodo] : [createdTodo]);
    } catch (error) {
      message.error('Failed to create todo');
    } finally {
      setIsModalVisible(false);
    }
  };

  const handleUpdateTodo = async (updatedTodo: Todo) => {
    try {
      await updateTodo(updatedTodo);
      const updatedTodos = Array.isArray(todos) ? todos.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      ) : [updatedTodo];
      message.success('Todo updated successfully');
      setTodos(updatedTodos);
    } catch (error) {
      message.error('Failed to update todo');
    } finally {
      setIsModalVisible(false);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      const updatedTodos = Array.isArray(todos) ? todos.filter((todo) => todo.id !== todoId) : [];
      message.success('Todo deleted successfully');
      setTodos(updatedTodos);
    } catch (error) {
      message.error('Failed to delete todo');
    }
  };

  useEffect(() => {
    const fetchAndSetTodos = async () => {
      if (!currentUser) {
        message.error('No current user');
        return;
      }
      try {
        const fetchedTodos = await fetchTodos(currentUser.name);
        setTodos(fetchedTodos);
        if (fetchedTodos.length === 0) {
          message.info('No todos found');
        }
      } catch (error) {
        message.error('Failed to fetch todos');
      }
    };

    fetchAndSetTodos();
  }, []);

  const columns: TableProps<Todo>['columns'] = [
    {
      title: "",
      key: "actions",
      width: 120,
      align: "center" as const,
      render: (_text: any, record: Todo) => (
        <Space className='actions' style={{ display: 'flex' }}>
          <Tooltip title="Delete">
            <Button size='small' onClick={() => handleDeleteTodo(record.id!)} danger>
              <DeleteOutlined />
            </Button>
          </Tooltip>
          <Tooltip title="Edit">
            <Button size='small' onClick={() => onUpdateClick(record)}>
              <EditOutlined />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a: Todo, b: Todo) => a.title.localeCompare(b.title),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      responsive: ['md'],
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      sorter: (a: Todo, b: Todo) => dayjs(a.dueDate).diff(dayjs(b.dueDate)),
      render: (date: string) => dayjs(date).format(TIME_FORMAT),
    },
    {
      title: "Completed",
      dataIndex: "completed",
      key: "completed",
      align: "center" as const,
      render: (completed: boolean, todo: Todo) => (
        <Checkbox
          checked={completed}
          onChange={() => {
            todo.completed = !todo.completed;
            handleUpdateTodo(todo);
          }}
        />
      ),
    },
  ];

  return (
    <Flex vertical={true} justify='space-between'>
      <Button type='link' onClick={() => setShowCompleted(!showCompleted)} disabled={!Array.isArray(todos)}>
        {showCompleted ? 'Show Completed' : 'Hide Completed'}
      </Button>
      <Divider />
      <Table rowKey="id" columns={columns} loading={!Array.isArray(todos)}
        dataSource={Array.isArray(viewTodos) ? viewTodos : []} pagination={false} />
      <TodoModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={editingTodo ? handleUpdateTodo : handleAddTodo}
        todo={editingTodo || undefined}>
      </TodoModal>
      <FloatButton type="primary" icon={<PlusOutlined />} onClick={onAddClick}>
      </FloatButton>
    </Flex>
  );
}

export default TodoList;
