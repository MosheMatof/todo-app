import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Home from './components/Home';
import { AuthProvider } from './contexts/AuthContext';
import { ConfigProvider } from 'antd';

// --blue-munsell: #31899Aff;
// --seasalt: #F8F9FAff;
// --black: #000000ff;
// --robin-egg-blue: #30C8BDff;
// --blue-munsell-2: #3894A0ff;
const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: '#30C8BDff',
          borderRadius: 10,

          // Alias Token
          colorBgContainer: '#F8F9FAff',
        },
      }}
      >
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home key='home'/>} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </Router>    
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;