import { useEffect } from 'react';
import { Layout, Badge, Avatar, ConfigProvider, Button, Typography, Space, theme, Flex } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Header, Content, Footer } from 'antd/es/layout/layout';
import TodoList from './TodoList';

const { Title } = Typography;

function Home() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const numberOfUncompletedTodos = Array.isArray(currentUser?.todos) 
    ? currentUser.todos.filter((todo) => !todo.completed).length
    : 0;
    useEffect(() => {
        if (!currentUser) {
            navigate('/signin');
        }
    }, [currentUser, navigate]);

    const handleLogout = async () => {
        try {
        await logout();
        navigate('/signin');
        } catch (error) {
        console.error('Failed to log out', error);
        }
    };
    
    return (
        <ConfigProvider theme={
            {
                components: {
                    Layout: {
                        headerBg: '#30C8BDff',
                        headerPadding: '0 20px',
                    },
                },
            }
        }>    
        {currentUser ? (
            <Layout style={{height: '100vh', width: '100vw'}}>
            <Header>
              <Flex align='center' justify='space-between'>
                <Space align='end' size={'middle'}>
                <>
                <Badge count={numberOfUncompletedTodos}>

                    {currentUser.picture ? (
                    <Avatar
                        src={currentUser.picture}
                        style={{ cursor: 'pointer' }}
                        icon={<UserOutlined />}
                    >
                        <UserOutlined />
                    </Avatar>
                    ) : (
                    <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
                    )}
                </Badge>
                    <Title level={5} style={{ color: 'white' }}>
                     {currentUser.name}
                    </Title>
                </>
                </Space>
                <Button
                    type="text"
                    onClick={handleLogout}
                    icon={<LogoutOutlined />}
                    >
                    Logout
                </Button>
              </Flex>
            </Header>
            <Content style={{padding: '10px'}}>
              <TodoList />
            </Content>
            {/* <Footer style={{ textAlign: 'center' }}>Footer Content</Footer> */}
          </Layout>
        ) : (
            <div>
            <p>You are not logged in</p>
            <Link to="/signin">Sign In</Link>
            <Link to="/signup">Sign Up</Link>
            </div>
        )}
        </ConfigProvider>
    );
}

export default Home;