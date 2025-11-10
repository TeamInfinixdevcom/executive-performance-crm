# Quick Start Guide - Executive Performance CRM

## Get Started in 5 Minutes

### Step 1: Get the Code
```bash
git clone https://github.com/TeamInfinixdevcom/executive-performance-crm.git
cd executive-performance-crm
```

### Step 2: Setup Firebase

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
2. Enable **Email/Password** Authentication
3. Create a **Realtime Database**
4. Copy your Firebase config from Project Settings
5. Update `js/firebase-config.js` with your config

### Step 3: Run the Application

Open `index.html` in your browser, or use a local server:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# Then open http://localhost:8000
```

### Step 4: Create Your First Account

1. Click "Registrarse" (Register)
2. Enter your email and password
3. You're in! 🎉

### Step 5: Set Admin Role (Optional)

To become an admin:
1. Go to Firebase Console > Realtime Database
2. Find your user under `/users/your-user-id`
3. Change `role` to `"admin"`

## What You Can Do Now

### As a Regular User:
- ✅ View dashboard with real-time statistics
- ✅ Manage clients (add, edit, delete)
- ✅ Track sales and register new sales
- ✅ Create and manage activities
- ✅ View reports and analytics
- ✅ Update your profile

### As an Admin/Manager:
- ✅ All user capabilities
- ✅ Manage team members
- ✅ Configure system settings
- ✅ Access all administrative features

## Common Tasks

### Add a New Client
1. Go to **Clients** tab
2. Click "Agregar Cliente" button
3. Fill in client details
4. Click "Guardar"

### Register a Sale
1. Go to **Sales** tab
2. Click "Registrar Venta" button
3. Select client from dropdown
4. Enter amount and details
5. Click "Guardar"
6. Sale is automatically logged in activities! 🎯

### Generate a Report
1. Go to **Reports** tab
2. Select report type (Sales, Clients, Performance)
3. Choose date range
4. Click "Generar Reporte"
5. View interactive chart

### Add Team Member
1. Go to **Team** tab (admin only)
2. Click "Agregar Miembro"
3. Enter member details
4. Assign role
5. Click "Guardar"

## Tips & Tricks

💡 **Search**: Use the search bar at the top to filter data in any tab

💡 **Mobile**: Access the menu by clicking the hamburger icon (☰) on mobile devices

💡 **Real-time**: All data updates in real-time across all connected devices

💡 **Notifications**: Click the bell icon to see recent activities

💡 **Keyboard**: Press ESC to close any modal dialog

## Troubleshooting

**Q: I can't login?**
- Make sure Firebase Authentication is enabled
- Check your email and password
- Verify Firebase config in `js/firebase-config.js`

**Q: Data not loading?**
- Check Firebase Realtime Database is created
- Verify database rules allow read/write
- Check browser console for errors

**Q: Charts not showing?**
- External resources may be blocked
- Charts require Chart.js CDN to load
- Check internet connection

**Q: Can't see Team or Settings tab?**
- These tabs are only visible to Admin/Manager roles
- Update your role in Firebase Console

## Need Help?

- 📖 Read the full [README.md](README.md)
- 🔧 Check [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for Firebase configuration
- 🎨 View [VISUAL_GUIDE.md](VISUAL_GUIDE.md) for screenshots and features

## Next Steps

1. ✅ Add some test clients
2. ✅ Register a few sales
3. ✅ Create activities
4. ✅ Generate reports
5. ✅ Customize settings
6. ✅ Invite team members

---

**Ready to boost your business with Executive Performance CRM!**

*Developed by Infinix Dev*
