import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from './firebase';
import './users.css';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serviceFilter, setServiceFilter] = useState('All');

  useEffect(() => {
    import('firebase/firestore').then(({ collection, getDocs }) => {
      getDocs(collection(db, 'sign-up'))
        .then((querySnapshot) => {
          const usersList = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Only show users registered with email
            if (data.email) {
              usersList.push({ id: doc.id, ...data });
            }
          });
          setUsers(usersList);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    });
  }, []);

  const services = ['All', 'Translation', 'Migration', 'AI', 'Other'];

  const filteredUsers = serviceFilter === 'All'
    ? users
    : users.filter(user =>
        (user.service || '').trim().toLowerCase() === serviceFilter.toLowerCase()
      );

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const usersByService = services.filter(service => service !== 'All').map(service => ({
    service,
    count: users.filter(user => (user.service || '').trim().toLowerCase() === service.toLowerCase()).length
  }));

  return (
    <div className="users-page">
      <h2 className="header-text">Registered Users</h2>
      
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">{users.length}</span>
            <span className="stat-label">Total Users</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{filteredUsers.length}</span>
            <span className="stat-label">Filtered Users</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{usersByService.reduce((sum, item) => sum + item.count, 0)}</span>
            <span className="stat-label">Users with Services</span>
          </div>
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-controls">
          <label htmlFor="service-filter">Filter by Service:</label>
          <select
            id="service-filter"
            value={serviceFilter}
            onChange={e => setServiceFilter(e.target.value)}
            className="service-filter"
          >
            {services.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>
        
        <div className="service-breakdown">
          <h3>Service Breakdown</h3>
          <div className="service-stats">
            {usersByService.map(({ service, count }) => (
              <div key={service} className="service-stat-item">
                <span className="service-name">{service}</span>
                <span className="service-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="users-section">
        <h3>Users List</h3>
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Service</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">
                    There are no users for this service
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.email}</td>
                    <td>{user.name || '-'}</td>
                    <td>{user.phone || '-'}</td>
                    <td>{user.service || '-'}</td>
                    <td>
                      <span className={`status ${user.service ? 'has-service' : 'no-service'}`}>
                        {user.service ? 'Active' : 'No Service'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Users; 