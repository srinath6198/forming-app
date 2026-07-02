# Frontend-Backend Connection Setup

## Overview
Successfully connected the FloraBill Admin frontend (React + Redux) with the backend (Express + MySQL + JWT).

## Architecture

### Backend (Port 3000)
- **Framework**: Express.js + TypeScript
- **Database**: MySQL (forming_billing)
- **Authentication**: JWT + bcrypt
- **CORS**: Enabled for localhost:3000 (frontend dev server)

### Frontend (Port 5174)
- **Framework**: React 19 + TypeScript + Vite
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Yup

## Files Created/Modified

### Frontend Files

#### 1. `FrontEnd/src/services/api.ts` (Created)
- Axios instance configured with base URL: `http://localhost:3000/api`
- Request interceptor: Adds JWT token to Authorization header
- Response interceptor: Handles 401 errors by clearing auth and redirecting to login

#### 2. `FrontEnd/src/services/auth.service.ts` (Created)
- `login(credentials)` - POST /api/auth/login
- `logout()` - POST /api/auth/logout
- `getProfile()` - GET /api/auth/me

#### 3. `FrontEnd/src/redux/authSlice.ts` (Modified)
- Replaced hardcoded user authentication with async thunk
- Uses `createAsyncThunk` for login action
- Handles pending/fulfilled/rejected states
- Stores JWT token in localStorage as `flora_token`
- Stores user data in localStorage as `flora_user`
- Maps backend roles (ADMIN/USER) to frontend roles (Super Admin/Billing User)

#### 4. `FrontEnd/src/pages/Login.tsx` (Modified)
- Updated form submission to use async dispatch
- Added loading state to button
- Button shows "Signing in..." when loading

### Backend Files

#### 5. `BackEnd/src/database/seed.ts` (Created)
- Seeds database with 3 test users
- Uses bcrypt to hash passwords (12 salt rounds)
- Handles existing users by updating passwords

#### 6. `BackEnd/package.json` (Modified)
- Added seed script: `npm run seed`

#### 7. `BackEnd/src/models/user.model.ts` (Modified)
- Fixed role enum to match database schema (lowercase 'admin', 'user')

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | super@flora.com | super123 |
| Admin | admin@flora.com | admin123 |
| Billing User | billing@flora.com | bill123 |

## How to Run

### 1. Start Backend
```bash
cd BackEnd
npm run dev
```
Server runs on: http://localhost:3000

### 2. Seed Database (First Time Only)
```bash
cd BackEnd
npm run seed
```

### 3. Start Frontend
```bash
cd FrontEnd
npm run dev
```
Frontend runs on: http://localhost:5174 (or next available port)

## API Flow

### Login Flow
1. User enters credentials in Login.tsx
2. Form submits to `handleSubmit(onSubmit)`
3. `onSubmit` dispatches `login(data)` async thunk
4. Thunk calls `authService.login(credentials)`
5. Service makes POST request to `http://localhost:3000/api/auth/login`
6. Backend validates credentials, generates JWT token
7. Response contains token and user data
8. Redux stores user in state and localStorage
9. JWT token is stored for future requests
10. User is redirected to dashboard

### Request Flow
1. Frontend makes API request via axios instance
2. Request interceptor adds `Authorization: Bearer <token>` header
3. Backend validates JWT token
4. Response returned to frontend
5. If 401 error, frontend clears auth and redirects to login

## Data Mapping

### Backend → Frontend
- `user.id` → `user.id` (number to string)
- `user.name` → `user.name`
- `user.email` → `user.email`
- `user.role` (ADMIN/USER) → `user.role` (Super Admin/Billing User)
- `token` → stored in localStorage as `flora_token`

## Security Features
- Passwords hashed with bcrypt (12 salt rounds)
- JWT tokens expire in 7 days
- HTTP-only cookies for sessions
- CORS configured for specific origins
- Automatic token refresh not implemented (requires re-login after expiry)

## Next Steps
1. Implement protected routes in frontend
2. Add token refresh mechanism
3. Implement logout functionality
4. Add "Remember me" feature
5. Implement password reset flow
6. Add role-based access control (RBAC) in frontend
7. Add loading skeletons and better error handling
8. Implement axios interceptors for error handling globally

## Troubleshooting

### Backend won't start
- Check if MySQL is running
- Verify database credentials in `BackEnd/.env`
- Ensure port 3000 is not in use

### Frontend can't connect to backend
- Verify backend is running on port 3000
- Check CORS configuration in `BackEnd/src/index.ts`
- Ensure `VITE_API_URL` is not set incorrectly

### Login fails
- Run `npm run seed` to create test users
- Check backend console for errors
- Verify email/password match test credentials