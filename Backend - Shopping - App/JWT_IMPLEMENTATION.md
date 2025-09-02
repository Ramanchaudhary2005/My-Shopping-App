# JWT Authentication & Bcrypt Password Hashing Implementation

## Overview
This document describes the implementation of JWT (JSON Web Token) authentication and bcrypt password hashing in the Shopping App backend.

## Features Implemented

### 1. Password Hashing with Bcrypt
- **Automatic Hashing**: Passwords are automatically hashed using bcrypt before saving to MongoDB
- **Salt Rounds**: Uses 12 salt rounds for optimal security
- **Pre-save Middleware**: Password hashing happens automatically via Mongoose pre-save hook
- **Password Comparison**: Secure password comparison using bcrypt.compare()

### 2. JWT Token Management
- **Token Generation**: JWT tokens are generated on login and signup
- **Token Expiration**: Tokens expire after 24 hours
- **Secure Storage**: Tokens are stored in localStorage on the frontend
- **Token Refresh**: Endpoint available to refresh expired tokens

### 3. Authentication Middleware
- **Route Protection**: `authenticateToken` middleware protects routes requiring authentication
- **Optional Authentication**: `optionalAuth` middleware for routes that can work with or without authentication
- **User Context**: Authenticated user data is attached to `req.user`

## Backend Implementation

### Dependencies Added
```bash
npm install bcryptjs
```

### Files Modified/Created

#### 1. User Schema (`models/userSchema.js`)
- Added bcrypt import
- Pre-save middleware for password hashing
- Password comparison method
- Safe object method (excludes password)

#### 2. Auth Controllers (`api/v1/auth/controllers.js`)
- Updated signup to return JWT token
- Updated login to use bcrypt password comparison
- Added refresh token controller
- Proper error handling

#### 3. Auth Middleware (`api/v1/auth/middleware.js`)
- JWT token verification
- User authentication
- Optional authentication support

#### 4. Auth Routes (`api/v1/auth/routes.js`)
- Added refresh token route
- Protected routes with authentication middleware

#### 5. Environment Config (`config/env.js`)
- Centralized configuration management
- JWT secret configuration
- Environment variable defaults

## Frontend Implementation

### Files Modified

#### 1. Auth Utility (`src/utils/auth.js`)
- JWT token management
- Token expiration checking
- API request helper with automatic token inclusion
- Token refresh functionality

#### 2. Login Page (`src/pages/loginpage.jsx`)
- JWT token storage on successful login
- Proper error handling

#### 3. Signup Page (`src/pages/signupPage.jsx`)
- Auto-login after successful signup
- JWT token handling

## API Endpoints

### Authentication Endpoints
- `POST /api/v1/auth/signup` - User registration with OTP verification
- `POST /api/v1/auth/login` - User login with JWT token
- `POST /api/v1/auth/refresh` - Refresh JWT token (protected)

### Protected Routes
Routes that require authentication should use the `authenticateToken` middleware:

```javascript
const { authenticateToken } = require('./auth/middleware');

// Example protected route
router.get('/profile', authenticateToken, (req, res) => {
  // req.user contains authenticated user data
  res.json({ user: req.user });
});
```

## Security Features

### 1. Password Security
- **Hashing**: All passwords are hashed using bcrypt
- **Salt**: Unique salt for each password
- **Rounds**: 12 salt rounds for optimal security vs performance

### 2. Token Security
- **Expiration**: 24-hour token expiration
- **Secret**: Configurable JWT secret
- **Validation**: Token validation on every protected request

### 3. Data Protection
- **Password Exclusion**: Passwords are never returned in API responses
- **User Context**: User data is validated on each request
- **Error Handling**: Proper error responses without information leakage

## Usage Examples

### Frontend API Calls
```javascript
import { apiRequest } from '../utils/auth';

// Automatic token inclusion
const response = await apiRequest('/api/v1/profile', {
  method: 'GET'
});

// Manual token usage
import { getToken } from '../utils/auth';
const token = getToken();
const response = await fetch('/api/v1/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Backend Route Protection
```javascript
const { authenticateToken } = require('./auth/middleware');

// Single route protection
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected data', user: req.user });
});

// Multiple route protection
router.use('/api', authenticateToken);
router.get('/profile', (req, res) => {
  res.json({ user: req.user });
});
```

## Environment Variables

Create a `.env` file in the backend root directory:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/shopping-app

# Server Configuration
PORT=3900
NODE_ENV=development
```

## Testing the Implementation

### 1. Test Signup
```bash
curl -X POST http://localhost:3900/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","otp":"123456"}'
```

### 2. Test Login
```bash
curl -X POST http://localhost:3900/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Test Protected Route
```bash
curl -X GET http://localhost:3900/api/v1/auth/refresh \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Best Practices

### 1. Security
- Change the default JWT secret in production
- Use HTTPS in production
- Implement rate limiting for auth endpoints
- Consider implementing refresh token rotation

### 2. Performance
- JWT tokens are stateless (no database lookup needed)
- Password hashing is optimized with appropriate salt rounds
- Token expiration reduces security risks

### 3. Maintenance
- Monitor token expiration patterns
- Implement proper logging for authentication events
- Regular security audits of JWT implementation

## Troubleshooting

### Common Issues

1. **Token Expired**: Use refresh token endpoint or redirect to login
2. **Invalid Token**: Check token format and secret configuration
3. **Password Mismatch**: Ensure bcrypt is properly installed and configured
4. **CORS Issues**: Verify frontend URL configuration

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` in your environment variables.

## Future Enhancements

1. **Refresh Token Rotation**: Implement refresh token rotation for enhanced security
2. **Multi-factor Authentication**: Add 2FA support
3. **Session Management**: Implement user session tracking
4. **Rate Limiting**: Add rate limiting for authentication endpoints
5. **Audit Logging**: Implement comprehensive authentication audit logging
