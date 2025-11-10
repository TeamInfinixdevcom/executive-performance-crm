# Executive Performance CRM

**Enterprise CRM platform for client management & sales tracking**

Developed by **Infinix Dev** for ICE

## 🚀 Features

- **8 Comprehensive Tabs:**
  - 📊 **Dashboard**: Real-time dashboards with live metrics and charts
  - 👥 **Clients**: Complete client management system
  - 💰 **Sales**: Sales tracking with automatic registration
  - ✅ **Activities**: Task and activity tracking
  - 📈 **Reports**: Analytics and customizable reports
  - 👨‍💼 **Team**: Team member management
  - ⚙️ **Settings**: System configuration
  - 👤 **Profile**: User profile management

- **Real-time Dashboards**: Live data visualization with Chart.js
- **Firebase Backend**: Real-time database synchronization
- **Automatic Sales Registration**: Sales are automatically logged with activities
- **Role-based Access Control**: Admin, Manager, and User roles with different permissions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Authentication System**: Secure login and registration with Firebase Auth

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase Realtime Database
- **Authentication**: Firebase Authentication
- **Charts**: Chart.js
- **Icons**: Font Awesome 6

## 📋 Prerequisites

- A Firebase account and project
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic knowledge of Firebase Console

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/TeamInfinixdevcom/executive-performance-crm.git
cd executive-performance-crm
```

### 2. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Go to Project Settings > General
4. Under "Your apps", click on the Web icon (</>)
5. Register your app and copy the Firebase configuration
6. Open `js/firebase-config.js` and replace the placeholder values with your configuration:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 3. Enable Firebase Services

1. **Authentication**:
   - Go to Firebase Console > Authentication
   - Click "Get Started"
   - Enable "Email/Password" sign-in method

2. **Realtime Database**:
   - Go to Firebase Console > Realtime Database
   - Click "Create Database"
   - Start in test mode (or configure security rules)

### 4. Security Rules (Recommended)

Add these rules to your Firebase Realtime Database:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null",
        ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'"
      }
    },
    "clients": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "sales": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "activities": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "settings": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

### 5. Run the Application

Simply open `index.html` in your web browser, or use a local web server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Then open http://localhost:8000 in your browser
```

## 👤 User Roles

The system supports three user roles with different access levels:

- **Admin**: Full access to all features including team management and settings
- **Manager**: Access to all features except team management and system settings
- **User**: Access to dashboard, clients, sales, activities, and profile

## 📱 Responsive Design

The application is fully responsive and works on:
- 💻 Desktop (1024px and above)
- 📱 Tablet (768px - 1023px)
- 📱 Mobile (below 768px)

## 🎯 Key Features Explained

### Real-time Dashboard
- Live statistics for clients, sales, and activities
- Interactive charts showing sales trends
- Recent activity feed with automatic updates

### Automatic Sales Registration
- When a new sale is created, it automatically:
  - Logs an activity
  - Updates dashboard statistics
  - Sends notifications
  - Updates real-time charts

### Role-based Access Control
- Admin and Manager roles can access all tabs
- Regular users have restricted access
- Permissions are enforced at the UI level

## 🔐 First Time Setup

1. Open the application
2. Click "Registrarse" (Register) on the login page
3. Enter your email and password
4. The first user will be created with 'user' role
5. To upgrade to admin, go to Firebase Console > Realtime Database > users > your-user-id and set `"role": "admin"`

## 📊 Data Structure

The Firebase Realtime Database uses the following structure:

```
/
├── users/
│   └── {userId}/
│       ├── name
│       ├── email
│       ├── role
│       └── createdAt
├── clients/
│   └── {clientId}/
│       ├── name
│       ├── email
│       ├── phone
│       ├── company
│       └── status
├── sales/
│   └── {saleId}/
│       ├── clientId
│       ├── clientName
│       ├── amount
│       ├── date
│       └── status
├── activities/
│   └── {activityId}/
│       ├── title
│       ├── description
│       ├── type
│       └── timestamp
└── settings/
    └── {userId}/
        ├── companyName
        └── currency
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is developed by Infinix Dev for ICE.

## 📧 Support

For support or questions, please contact Infinix Dev.

## 🎨 Customization

You can customize the application by:
- Modifying CSS variables in `css/styles.css`
- Adding new tabs in `index.html`
- Extending functionality in the JavaScript modules
- Changing color schemes, fonts, and layouts

## 🔄 Updates

Check back regularly for updates and new features!

---

**Developed with ❤️ by Infinix Dev**
