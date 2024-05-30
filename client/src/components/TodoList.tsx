import React, { useState, useEffect } from 'react';
import { List, Button, FloatButton, Checkbox, message, Flex, Table, Tooltip, Space, Divider } from 'antd';
import type { TableProps } from 'antd';
import { PlusOutlined,EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import {Todo} from '../models';
import TodoModal from './TodoModal';
import dayjs from 'dayjs';

const TIME_FORMAT = "DD-MM-YYYY HH:mm:ss";

function TodoList() {
  // const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const { currentUser, setTodos } = useAuth();
  const todos = currentUser?.todos ? currentUser?.todos : [];
  const viewTodos = Array.isArray(todos) && showCompleted ? todos.filter((todo) => !todo.completed) : todos;

  const handleAddTodo = (newTodo: Todo) => {
    try {
      newTodo.userName = currentUser?.name || '';
      fetch(API_BASE_URL + '/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newTodo),
      }).then((response) => {
        if (!response.ok) {
          message.error('Failed to create todo: ' + response.statusText);
        } else {
          setTodos(Array.isArray(todos) ? [...todos, newTodo] : [newTodo]);
        }
      });
    } catch (error) {
      console.error('Failed to create todo: ' + error);
    } finally {
      setIsModalVisible(false);
    }
  };

  const onUpdateClick = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalVisible(true);
  };

  const onAddClick = () => {
    setEditingTodo(null);
    setIsModalVisible(true);
  }

  const handleUpdateTodo = (updatedTodo: Todo) => {
    try {
      const updatedTodos = todos?.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      );
      setTodos(updatedTodos);
      setEditingTodo(null);
      setIsModalVisible(false);
      // Update the todo on the server
      fetch(API_BASE_URL + '/todos/' + updatedTodo.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedTodo),
      }).then((response) => {
        if (!response.ok) {
          message.error('Failed to update todo: ' + response.statusText);
        } else {
          message.success('Todo updated successfully');
          setTodos(Array.isArray(todos) ? updatedTodos : [updatedTodo]);
        }
      });
    } catch (error) {
      console.error('Failed to update todo: ' + error);
    } finally {
      setIsModalVisible(false);
    }
  };

  const handleDeleteTodo = (todoId: number) => {
    const updatedTodos = todos?.filter((todo) => todo.id !== todoId);
    setTodos(updatedTodos);
    // Delete the todo on the server
    fetch(API_BASE_URL + '/todos/' + todoId, {
      method: 'DELETE',
      credentials: 'include',
    }).then((response) => {
      if (!response.ok) {
        message.error('Failed to delete todo: ' + response.statusText);
      }
    });
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
  if (!currentUser) {
    message.error('No current user');
    return;
  }

  try {
    const response = await fetch(API_BASE_URL + '/todos', {
      credentials: 'include',
      headers: {
        'X-User-Id': btoa(encodeURIComponent(currentUser.name)),      
      },
    });
      if (!response.ok) {
        if(response.status === 404) {
          message.info('No todos found');
          return;
        } else{
          message.error('Failed to fetch todos');
          console.log('Failed to fetch todos: ' + response.statusText);          
        }

      }
      const todos = await response.json();
      setTodos(todos);
    } catch (error) {
      message.error('Failed to fetch todos');
      console.error('Failed to fetch todos: ' + error);
    }
  };

  const columns: TableProps<Todo>['columns'] = [
    {
      title: "",
      key: "actions",
      width: 120,
      align: "center" as const,
      render: (_text: any, record: Todo) => (
        <Space className='actions' style={{display: 'flex'}}>
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
        <Checkbox checked={completed} onChange={() => {
          todo.completed = !todo.completed;
          handleUpdateTodo(todo)
        }}/>
      ),
    },
  ];
  

  return (
    <Flex vertical={true} justify='space-between'>
      <Button type='link' onClick={()=>{setShowCompleted(!showCompleted)}} disabled={!Array.isArray(todos)}>
        {showCompleted ? 'Show Completed' : 'hide Completed'}
      </Button>
      <Divider/>
      <Table rowKey="id" columns={columns} loading={!todos}
       dataSource={Array.isArray(viewTodos) ? viewTodos : []} pagination={false}/>
      {/* <List        
        dataSource={Array.isArray(todos) ? todos : []}
        renderItem={(todo) => (
          <List.Item
            actions={[
              <Button onClick={() => onUpdateClick(todo)}>Edit</Button>,
              <Button onClick={() => handleDeleteTodo(todo.id!)}>Delete</Button>,
            ]}
          >
            <div>
              <h4>{todo.title}</h4>
              <p>{todo.description}</p>
              <p>Due: {todo.dueDate.toString()}</p>
              <Checkbox checked={todo.completed} />
            </div>
          </List.Item>
        )}
      /> */}
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