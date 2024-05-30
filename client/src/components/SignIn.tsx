import { useEffect } from 'react';
import { Form, Input, Button, Divider, Typography, Space, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate} from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GoogleLoginButton from './GoogleLoginButton'
import logo from '../assets/logo.png';


const { Title } = Typography;

function SignIn() {
  const {currentUser, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
      if (currentUser) {
          navigate('/');
      }
  }, [currentUser, navigate]);

  const onFinish = async (values: { username: string; password: string }) => {
    const user = await login(values.username, values.password);
    if (user) {
      message.success('Sign in successfully');
      navigate('/');
    } else {
      message.error('Sign in failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div style={{ padding: '40px', border: '1px solid #d9d9d9', borderRadius: '6px', width: '300px', textAlign: 'center',}}>
      <img src={logo} alt="logo" style={{ width: '90px', height: '90px', marginBottom: '20px' }} />
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Form name="signin" onFinish={onFinish} >
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
            Sign In
          </Button>
        </Form.Item>
      </Form>

      <Divider plain>Or</Divider>

      <GoogleLoginButton/>

      <Link to="/signup">Don't have an account? Sign up</Link>
      </Space>
    </div>
    </div>
  );
};

export default SignIn;