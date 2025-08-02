import React from 'react';
import Users from './users';
import Navbar from './Components/Navbar/Navbar';
import SubscriptionUser from './Components/SubscriptionUser/SubscriptionUser';
import EmailSender from './Components/EmailSender/EmailSender';
import Login from './Components/Login/Login';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Protected Routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute>
          <>
          {/* <Navbar /> */}
            <div className='container'>
              <Routes>
                <Route index element={<Navigate to="/admin/users" replace />} />
                <Route path="/users" element={<Users />} />
                <Route path="/subscription-users" element={<SubscriptionUser />} />
                <Route path="/email-sender" element={<EmailSender />} />
              </Routes>
            </div>
          </>
        </ProtectedRoute>
      } />
      
      {/* Redirect all other routes to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App; 