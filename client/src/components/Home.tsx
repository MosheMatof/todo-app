//home component

import React from 'react';
import { Button, Typography } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const { Title } = Typography;

function Home() {
    const { currentUser, logout } = useAuth();
    
    const handleLogout = async () => {
        try {
        await logout();
        } catch (error) {
        console.error('Failed to log out', error);
        }
    };
    
    return (
        <div style={{ padding: '40px', border: '1px solid #d9d9d9', borderRadius: '6px' }}>
        <Title level={3} style={{ textAlign: 'center' }}>
            Home
        </Title>
    
        {currentUser ? (
            <div>
            <p>Welcome, {currentUser.email}!</p>
            <Button type="primary" onClick={handleLogout}>
                Log out
            </Button>
            </div>
        ) : (
            <div>
            <p>You are not logged in</p>
            <Link to="/signin">Sign In</Link>
            <Link to="/signup">Sign Up</Link>
            </div>
        )}
        </div>
    );
}

export default Home;