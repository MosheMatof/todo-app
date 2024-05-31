import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Switch } from 'antd';
import {Todo} from '../models';
import dayjs from 'dayjs';

interface TodoProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (todo: Todo) => void;
  todo?: Todo;
}

const TIME_FORMAT = "DD-MM-YYYY HH:mm:ss";

const TodoModal: React.FC<TodoProps> = ({ visible, onCancel, onOk, todo }) => {
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState<Todo | undefined>(undefined);

  useEffect(() => {
    if (visible) {
      const initialValues = {
        id: todo?.id || undefined,
        userName: todo?.userName || '',
        title: todo?.title || '',
        description: todo?.description || '',
        dueDate: todo?.dueDate ? dayjs(todo.dueDate) : dayjs(),
        completed: todo?.completed || false,
      };
      setFormValues(initialValues);
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [visible, todo, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const newTodo: Todo = {
        ...formValues!,
        ...values,
        dueDate: values.dueDate.format(),
      };
      onOk(newTodo);
      form.resetFields();
    });
  };


  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      title={todo ? 'Update Todo' : 'Create Todo'}
      width={300}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please enter a title' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: 'Please select a due date' }]}
            >
            <DatePicker showTime format= {TIME_FORMAT}/>
        </Form.Item>
        {todo && (
        <Form.Item name="completed" label="Completed" valuePropName="checked">
            <Switch />
        </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default TodoModal;