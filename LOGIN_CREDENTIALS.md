# 🔐 Login Credentials - Smart Attendance System

## Default Test Accounts

The system automatically creates these test accounts when you start the backend in development mode.

### 👨‍🎓 Student Account
```
Email: student@test.com
Password: password123
Role: Student
```
**Access to:**
- Student Dashboard
- Mark Attendance
- View Attendance History
- QR Scanner
- Face Capture
- Profile Settings

---

### 👨‍🏫 Faculty Account
```
Email: faculty@test.com
Password: password123
Role: Faculty
```
**Access to:**
- Faculty Dashboard
- Create/Manage Sessions
- Generate QR Codes
- View Session Reports
- View Attendance Reports
- Student List Management

---

### 👨‍💼 Admin Account
```
Email: admin@test.com
Password: password123
Role: Admin
```
**Access to:**
- Admin Dashboard
- User Management (Add/Edit/Delete Users)
- System Analytics
- Anomaly Review
- System Settings
- Full System Access

---

## How to Use

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   The system will automatically create these accounts if they don't exist.

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Login:**
   - Go to `http://localhost:3000`
   - Use any of the credentials above
   - You'll be redirected to the appropriate dashboard based on your role

---

## Creating New Accounts

You can also register new accounts:
1. Click "Sign up →" on the login page
2. Fill in the registration form
3. Select your role (Student/Faculty/Admin)
4. Click "Sign Up"

---

## Troubleshooting

### "Invalid credentials" error?
- Make sure the backend is running (`npm run dev` in backend folder)
- Check that you're using the correct email and password
- The backend automatically creates these accounts on first startup

### Can't see the accounts?
- Restart the backend server
- Check the console logs - you should see:
  ```
  🌱 Seeding database with default users...
  ✓ Created student: student@test.com
  ✓ Created faculty: faculty@test.com
  ✓ Created admin: admin@test.com
  ```

### Backend shows "401 Unauthorized"?
- This was the previous issue - now fixed!
- The seed script creates default users automatically
- Just restart the backend and try logging in again

---

## Security Notes

⚠️ **Important:** These are TEST credentials for development only!

- Change these passwords in production
- Use strong passwords for real deployments
- Enable proper authentication mechanisms
- Consider adding 2FA for admin accounts

---

## Quick Test Flow

1. **Test Student Flow:**
   - Login as `student@test.com`
   - View dashboard with attendance stats
   - Check upcoming sessions

2. **Test Faculty Flow:**
   - Login as `faculty@test.com`
   - Create a new session
   - Generate QR code
   - View reports

3. **Test Admin Flow:**
   - Login as `admin@test.com`
   - View system dashboard
   - Manage users
   - Check system health

---

**All accounts are ready to use! Just restart the backend and login.** 🚀
