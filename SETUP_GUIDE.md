# Email Sending Feature Setup Guide

## Overview

This feature allows you to send emails to all users who have email addresses stored in your Firestore database. The implementation includes:

- ✅ Firebase Cloud Functions for email sending
- ✅ SendGrid integration for reliable email delivery
- ✅ Admin dashboard with statistics
- ✅ Test email functionality
- ✅ Error handling and logging
- ✅ Campaign tracking

## Prerequisites

1. **Firebase Project**: You need a Firebase project with Firestore enabled
2. **SendGrid Account**: Create a free account at [SendGrid](https://sendgrid.com/)
3. **Node.js**: Version 18 or higher
4. **Firebase CLI**: Install globally

## Step-by-Step Setup

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Initialize Firebase Functions
```bash
firebase init functions
```
- Select your project
- Choose JavaScript
- Say "No" to ESLint
- Say "Yes" to installing dependencies

### 4. Install SendGrid
```bash
cd functions
npm install @sendgrid/mail
```

### 5. Set SendGrid API Key
```bash
firebase functions:config:set sendgrid.key="YOUR_SENDGRID_API_KEY"
```

### 6. Update Email Sender
In `functions/index.js`, change the `from` email address:
```javascript
from: 'your-verified-email@yourdomain.com'
```

### 7. Deploy Functions
```bash
firebase deploy --only functions
```

## SendGrid Setup

### 1. Create SendGrid Account
- Go to [SendGrid](https://sendgrid.com/)
- Sign up for a free account
- Verify your email address

### 2. Get API Key
- Go to Settings → API Keys
- Create a new API Key
- Copy the key (you'll only see it once)

### 3. Verify Sender Domain (Recommended)
- Go to Settings → Sender Authentication
- Verify your domain or at least verify a single sender
- This improves email deliverability

## Features

### 1. Admin Dashboard (`/admin`)
- View all users and their email status
- Send emails to all users with email addresses
- View campaign statistics
- Real-time feedback on email sending

### 2. Email Sender (`/email-sender`)
- Advanced email composition
- Test email functionality
- Custom HTML content support
- Recipient list display

### 3. Cloud Functions
- `sendEmailToAllUsers`: Sends emails to all users with email addresses
- `sendTestEmail`: Sends a test email to a specific address
- `getEmailCampaignStats`: Retrieves campaign statistics

## Usage

### Sending Emails to All Users

1. **Via Admin Dashboard:**
   - Navigate to `/admin`
   - Click "Send Email to X Users"
   - View results and statistics

2. **Via Email Sender:**
   - Navigate to `/email-sender`
   - Optionally customize subject and content
   - Click "Send Email to All Users"

### Test Email Functionality

1. **In Email Sender:**
   - Click "Send Test Email"
   - Enter test email address
   - Send test email

2. **Direct Function Call:**
   ```javascript
   const functions = getFunctions();
   const sendTestEmail = httpsCallable(functions, 'sendTestEmail');
   
   const result = await sendTestEmail({
     email: 'test@example.com',
     subject: 'Test Email',
     content: '<h1>Test</h1>'
   });
   ```

## Error Handling

The system handles various error scenarios:

- ✅ Users without email addresses
- ✅ Invalid email addresses
- ✅ SendGrid API errors
- ✅ Network connectivity issues
- ✅ Firebase permission errors

## Monitoring

### Campaign Statistics
- Total users processed
- Users with/without emails
- Successful/failed sends
- Detailed error logs

### Firebase Console
- View function logs in Firebase Console
- Monitor function execution times
- Check error rates

### SendGrid Dashboard
- Monitor email delivery rates
- View bounce and spam reports
- Track email engagement

## Customization

### Email Template
Edit the hardcoded email content in `functions/index.js`:
```javascript
const emailContent = {
  subject: 'Your Custom Subject',
  html: `
    <div style="font-family: Arial, sans-serif;">
      <h2>Your Custom Content</h2>
      <p>Your message here...</p>
    </div>
  `
};
```

### Styling
- Modify CSS files in component directories
- Update colors, fonts, and layout
- Add responsive design improvements

## Troubleshooting

### Common Issues

1. **Emails not sending:**
   - Check SendGrid API key
   - Verify sender email address
   - Check Firebase function logs

2. **Function deployment fails:**
   - Ensure Node.js version 18+
   - Check Firebase CLI version
   - Verify project permissions

3. **No users found:**
   - Check Firestore collection name
   - Verify user documents have email field
   - Check Firebase security rules

### Debug Commands

```bash
# View function logs
firebase functions:log

# Test function locally
firebase emulators:start --only functions

# Check function configuration
firebase functions:config:get
```

## Security Considerations

1. **API Key Security:**
   - Never commit API keys to version control
   - Use Firebase environment variables
   - Rotate keys regularly

2. **Rate Limiting:**
   - SendGrid has rate limits
   - Monitor usage in SendGrid dashboard
   - Implement delays for large campaigns

3. **Email Compliance:**
   - Include unsubscribe links
   - Respect user preferences
   - Follow CAN-SPAM regulations

## Performance Optimization

1. **Batch Processing:**
   - Current implementation sends emails in parallel
   - Consider batching for very large user lists
   - Monitor function timeout limits

2. **Caching:**
   - Cache user lists for repeated sends
   - Store campaign results for analytics
   - Implement retry logic for failed sends

## Next Steps

1. **Advanced Features:**
   - Email templates with variables
   - Scheduled email campaigns
   - User segmentation
   - Email analytics

2. **Integration:**
   - Connect with CRM systems
   - Add email marketing tools
   - Implement webhook notifications

3. **Monitoring:**
   - Set up alerts for failed sends
   - Create email delivery dashboards
   - Track user engagement metrics 