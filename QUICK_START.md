# Quick Start Guide - Smart Attendance System

## Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

## Installation

All dependencies are already installed. If you need to reinstall:

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

## Running the Application

### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option 2: Using the Scripts (if available)

```bash
# From root directory
npm run dev:backend
npm run dev:frontend
```

## Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

## Default Test Accounts

You'll need to register users first. Use these roles:

### Admin Account
```
Email: admin@attendance.com
Password: admin123
Role: admin
```

### Faculty Account
```
Email: faculty@attendance.com
Password: faculty123
Role: faculty
```

### Student Account
```
Email: student@attendance.com
Password: student123
Role: student
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get user profile

### Student Routes
- `POST /api/student/attendance/mark` - Mark attendance
- `GET /api/student/attendance/history` - Get attendance history
- `GET /api/student/dashboard` - Get dashboard stats

### Faculty Routes
- `POST /api/faculty/sessions` - Create session
- `POST /api/faculty/sessions/:id/start` - Start session
- `POST /api/faculty/sessions/:id/qr/generate` - Generate QR code
- `GET /api/faculty/sessions` - Get all sessions

### Admin Routes
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create user
- `GET /api/admin/analytics` - Get analytics

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
USE_MEMORY_DB=true
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_ENV=development
```

## Development Scripts

### Backend
```bash
npm run dev              # Development with in-memory DB
npm run dev:sqlite-file  # Development with file-based SQLite
npm run dev:postgres     # Development with PostgreSQL
npm start                # Production mode
```

### Frontend
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

## Testing the System

### 1. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "STU001",
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "department": "Computer Science",
    "role": "student"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Check Health
```bash
curl http://localhost:5000/health
```

## Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify .env file exists
- Run `npm install` in backend directory

### Frontend won't start
- Check if port 3000 is available
- Verify .env file exists
- Run `npm install` in frontend directory

### Database errors
- System uses in-memory SQLite by default
- No external database setup required
- Data resets on server restart (development mode)

### Redis errors (can be ignored)
- System uses memory cache fallback
- Redis is optional for development
- No impact on functionality

## Features Available

✅ User Authentication (JWT)
✅ Role-based Access Control
✅ Session Management
✅ QR Code Generation/Scanning
✅ Face Recognition (stub)
✅ Geofencing
✅ Attendance Marking
✅ Dashboard Analytics
✅ Audit Logging
✅ Real-time Updates (Socket.io ready)

## Next Steps

1. Register users with different roles
2. Create a session (as faculty)
3. Start the session and generate QR code
4. Mark attendance (as student)
5. View reports and analytics

## Support

For issues or questions, check:
- BUGS_FIXED_SUMMARY.md - List of all fixes
- backend/README.md - Backend documentation
- API documentation at /api/docs (if configured)

---

**System Status:** ✅ All systems operational
**Last Updated:** January 16, 2026
