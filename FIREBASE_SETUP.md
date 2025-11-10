# Firebase Configuration Example

This file shows how to configure your Firebase project for the Executive Performance CRM.

## Steps:

1. Go to https://console.firebase.google.com/
2. Create or select your project
3. Go to Project Settings > General
4. Scroll down to "Your apps" section
5. Click the web icon (</>)
6. Copy your configuration

## Your configuration will look like this:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project.firebaseio.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
};
```

## Replace the values in `js/firebase-config.js` with your actual configuration.

## Enable Firebase Services:

1. **Authentication** (Required):
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"

2. **Realtime Database** (Required):
   - Go to Realtime Database
   - Create database
   - Start in test mode (for development)
   - Add security rules (see README.md)

## Important Notes:

- Never commit your actual Firebase configuration to a public repository
- Use environment variables for production deployments
- Configure proper security rules before going to production
- Test authentication and database access after configuration
