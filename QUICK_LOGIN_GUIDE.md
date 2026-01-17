# 🚀 Quick Login Guide

## Start the System

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Wait for: `✓ Database seeding completed!`

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Open: `http://localhost:3000`

---

## Login Credentials

| Role | Email | Password |
|------|-------|----------|
| 👨‍🎓 Student | `student@test.com` | `password123` |
| 👨‍🏫 Faculty | `faculty@test.com` | `password123` |
| 👨‍💼 Admin | `admin@test.com` | `password123` |

---

## What You'll See

### Student Dashboard
- 4 colored stat cards (Teal, Orange, Green, Blue)
- Upcoming sessions table
- Attendance percentage

### Faculty Dashboard
- 4 colored stat cards (Blue, Green, Purple, Orange)
- Quick action cards (Create Session, Generate QR, View Reports)
- Recent sessions table

### Admin Dashboard
- 4 colored stat cards with subtitles
- Quick action cards (Manage Users, Analytics, Settings)
- System health panel
- Recent activity feed

---

## Troubleshooting

**401 Error?** → Restart backend (users created on startup)

**Blank Page?** → Clear cache (Ctrl+Shift+Delete)

**Redis Errors?** → Ignore them (memory cache used automatically)

---

**That's it! Login and enjoy!** ✨
