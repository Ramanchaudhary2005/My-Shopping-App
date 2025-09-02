// Environment Configuration
// In production, these should be set via environment variables

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  PORT: process.env.PORT || 3900,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/shopping-app',
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Email Configuration (if using nodemailer)
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_USER: process.env.EMAIL_USER || 'your-email@gmail.com',
  EMAIL_PASS: process.env.EMAIL_PASS || 'your-app-password',
  
  // Frontend URL for CORS
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173'
};
