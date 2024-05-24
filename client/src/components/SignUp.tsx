import React from 'react';
import { Form, Input, Button, Divider, Typography, Space, message } from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import GoogleLoginButton from './GoogleLoginButton';
import logo from '../assets/logo.png';

const { Title } = Typography;

function SignUp() {
  const { signup } = useAuth();
  const onFinish = async (values: { username: string; password: string }) => {
    const res = await signup(values.username, values.password);
    if (res) {
      message.success('Sign up successfully');
    } else {
      message.error('Sign up failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ padding: '40px', border: '1px solid #d9d9d9', borderRadius: '6px', width: '300px', textAlign: 'center'}}>
      <Title level={3}>
        Sign Up
      </Title>
      <img src={logo} alt="logo" style={{ width: '70px', height: '70px', marginBottom: '20px' }} />
      <Space direction="vertical" size="large" style={{ width: '100%' }}>

          <Form name="login" onFinish={onFinish}>
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Log in
              </Button>
            </Form.Item>
          </Form>

          <Divider plain>Or</Divider>

          <GoogleLoginButton />
          <Link to="/signin">Already have an account? Sign in</Link>
      </Space>
    </div>
    </div>
  );
};

export default SignUp;