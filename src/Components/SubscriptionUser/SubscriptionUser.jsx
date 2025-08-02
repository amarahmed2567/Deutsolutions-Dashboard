import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import './SubscriptionUser.css';

function SubscriptionUser() {
  const [subscriptionUsers, setSubscriptionUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    import('firebase/firestore').then(({ collection, getDocs }) => {
      // جلب المستخدمين الذين لديهم subscription
      
      getDocs(collection(db, 'subscriptions'))
        .then((querySnapshot) => {
          const usersList = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.email) {
              usersList.push({ id: doc.id, ...data });
            }
          });
          setSubscriptionUsers(usersList);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching subscription users:', err);
          setError(err.message);
          setLoading(false);
        });
    });
  }, []);

  if (loading) return <div className="loading">Loading subscription users...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="subscription-users-page">
      <h2 className="header-text">Subscription Users</h2>
      
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">{subscriptionUsers.length}</span>
            <span className="stat-label">Total Subscribers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{subscriptionUsers.filter(user => user.timestamp).length}</span>
            <span className="stat-label">Active Subscriptions</span>
          </div>
        </div>
      </div>

      <div className="action-section">
        <h3>Email Campaign</h3>
        <p>Send an email to all subscription users who have email addresses.</p>
        
        <button
          onClick={() => navigate('/email-sender')}
          className="send-email-button"
        >
          Send Email to All Subscribers
        </button>
      </div>

      {subscriptionUsers.length === 0 ? (
        <div className="no-users-section">
          <h3>No Subscription Users</h3>
          <p>No subscription users found in the database.</p>
        </div>
      ) : (
        <div className="users-section">
          <h3>Subscription Users List</h3>
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Email</th>
                  <th>Subscription Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {subscriptionUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.email || 'No email'}</td>
                    <td>
                      {user.timestamp ? 
                        new Date(user.timestamp.toDate()).toLocaleDateString('en-US') : 
                        'No date'
                      }
                    </td>
                    <td>
                      <span className={`status ${user.email ? 'has-email' : 'no-email'}`}>
                        {user.email ? 'Active Subscriber' : 'No Email'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubscriptionUser; 