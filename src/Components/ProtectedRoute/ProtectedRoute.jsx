import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { NavLink } from "react-router-dom";
import Logo from "../../assets/logo.svg"
import './ProtectedRoute.css';

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Check if user is admin
        if (user.email === 'admin@deutsolutions.com') {
          setIsAuthenticated(true);
        } else {
          // Logout non-admin users
          auth.signOut();
          navigate('/login');
        }
      } else {
        // No user logged in
        navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Verifying authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="protected-layout">
      <header className="admin-header">
        <div className="header-content">
          <div className="header-left">
          <div className="NavbarLogo">
              <a href="/admin">
              <img src={Logo} alt="DEUTSOLUTIONS logo" />
              </a>
          </div>
            <span className="admin-badge">🔒 Secure Admin Area</span>
          </div>
          <div className="navbarLinks">
        
        <NavLink
          to="/admin/users"
          end
          className={({ isActive }) => isActive ?  "active" : undefined}
        >
        Users
        </NavLink>

        <NavLink
          to="/admin/subscription-users"
          end
          className={({ isActive }) => isActive ? "active" : undefined}
        >
        Subscribers
        </NavLink>

        <NavLink
          to="/admin/email-sender"
          end
          className={({ isActive }) => isActive ?  "active" : undefined}
        >
        Email Sender
        </NavLink>

      </div>
          <div className="header-right">
            <span className="user-info">
              <span className="user-email">admin@deutsolutions.com</span>
              <span className="user-status">● Online</span>
            </span>
            <button onClick={handleLogout} className="logout-button">
              🚪 Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}

export default ProtectedRoute; 