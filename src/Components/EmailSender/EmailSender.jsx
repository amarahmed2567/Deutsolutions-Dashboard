import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';
import './EmailSender.css';

function EmailSender() {
  const [subscriptionUsers, setSubscriptionUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailContent, setEmailContent] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [showTestEmail, setShowTestEmail] = useState(false);

  useEffect(() => {
    // جلب جميع المستخدمين المشتركين
    import('firebase/firestore').then(({ collection, getDocs }) => {
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
          setMessage('Error loading users: ' + err.message);
          setLoading(false);
        });
    });
  }, []);

  const handleSendEmails = async () => {
    if (subscriptionUsers.length === 0) {
      setMessage('No users found');
      return;
    }

    setSending(true);
    setMessage('');

    try {
      const functions = getFunctions();
      const sendEmailToAllUsers = httpsCallable(functions, 'sendEmailToAllUsers');

      const result = await sendEmailToAllUsers({});
      const data = result.data;

      if (data.success) {
        setMessage(`Email campaign completed! Sent to ${data.sentCount} users. Total users: ${data.totalUsers}, Users with emails: ${data.usersWithEmails}, Users without emails: ${data.usersWithoutEmails}`);
      } else {
        setMessage(`Campaign failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error sending emails:', error);
      setMessage('Error sending emails: ' + (error.message || 'Unknown error'));
    } finally {
      setSending(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmail.trim()) {
      setMessage('Please enter test email address');
      return;
    }

    setSending(true);
    setMessage('');

    try {
      const functions = getFunctions();
      const sendTestEmail = httpsCallable(functions, 'sendTestEmail');

      const result = await sendTestEmail({
        email: testEmail,
        subject: emailSubject || 'Test Email from DeutSolutions',
        content: emailContent || '<h1>Test Email</h1><p>This is a test email from DeutSolutions.</p>'
      });

      const data = result.data;
      if (data.success) {
        setMessage('Test email sent successfully!');
        setTestEmail('');
      } else {
        setMessage('Failed to send test email');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      setMessage('Error sending test email: ' + (error.message || 'Unknown error'));
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="loading">Loading subscription users...</div>;

  return (
    <div className="email-sender">
      <h2 className="header-text">Send Email to All Users</h2>
      
      <div className="stats">
        <p>Total Users: {subscriptionUsers.length}</p>
        <p>Users with Emails: {subscriptionUsers.filter(user => user.email && user.email.trim() !== '').length}</p>
        <p>Users without Emails: {subscriptionUsers.filter(user => !user.email || user.email.trim() === '').length}</p>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="email-form">
        <div className="form-group">
          <label htmlFor="email-subject">Email Subject (Optional):</label>
          <input
            type="text"
            id="email-subject"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            placeholder="Enter custom email subject..."
            className="email-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email-content">Custom Email Content (Optional):</label>
          <textarea
            id="email-content"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            placeholder="Enter custom HTML email content (leave empty to use default template)..."
            rows="10"
            className="email-textarea"
          />
        </div>

        <div className="form-actions">
          <button
            onClick={() => setShowTestEmail(!showTestEmail)}
            className="test-button"
          >
            {showTestEmail ? 'Hide Test Email' : 'Send Test Email'}
          </button>
          
          <button
            onClick={handleSendEmails}
            disabled={sending || subscriptionUsers.length === 0}
            className="send-button"
          >
            {sending ? 'Sending...' : `Send Email to All Users (${subscriptionUsers.filter(user => user.email && user.email.trim() !== '').length} with emails)`}
          </button>
        </div>

        {showTestEmail && (
          <div className="test-email-section">
            <div className="form-group">
              <label htmlFor="test-email">Test Email Address:</label>
              <input
                type="email"
                id="test-email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Enter test email address..."
                className="email-input"
              />
            </div>
            <button
              onClick={handleSendTestEmail}
              disabled={sending || !testEmail.trim()}
              className="test-send-button"
            >
              {sending ? 'Sending Test...' : 'Send Test Email'}
            </button>
          </div>
        )}
      </div>

      {subscriptionUsers.length > 0 && (
        <div className="recipients-list">
          <h3>Users List:</h3>
          <div className="recipients-grid">
            {subscriptionUsers.map((user, index) => (
              <div key={user.id} className="recipient-item">
                <span className="recipient-number">{index + 1}</span>
                <span className="recipient-email">
                  {user.email ? user.email : 'No email address'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EmailSender; 