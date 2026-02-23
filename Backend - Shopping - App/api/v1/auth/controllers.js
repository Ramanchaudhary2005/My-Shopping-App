const { UserModel } = require("../../../models/userSchema");
const { OtpModel } = require("../../../models/otpSchema");
const jwt = require("jsonwebtoken");
const config = require("../../../config/env");

const userSignupController = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    // 1. Check OTP in DB
    const existingOtp = await OtpModel.findOne({ email }).sort({ createdAt: -1 });

    if (!existingOtp) {
      return res.status(400).json({
        isSuccess: false,
        message: "No OTP found. Please request a new one.",
        data: {},
      });
    }

    // 2. Check OTP match
    if (String(existingOtp.otp) !== String(otp)) {
      return res.status(400).json({
        isSuccess: false,
        message: "Invalid OTP",
        data: {},
      });
    }

    // 3. Check OTP expiry
    const otpExpiresAt = new Date(new Date(existingOtp.createdAt).getTime() + 5 * 60 * 1000);
    if (otpExpiresAt < new Date()) {
      return res.status(400).json({
        isSuccess: false,
        message: "OTP expired. Please request a new one.",
        data: {},
      });
    }

    // 4. Create user with hashed password (handled by pre-save middleware)
    const newUser = await UserModel.create({
      email,
      password, // Will be automatically hashed by pre-save middleware
    });

    // 5. Delete OTP after success
    await OtpModel.deleteMany({ email });

    // 6. Generate JWT token
    const token = jwt.sign(
      { 
        id: newUser._id, 
        email: newUser.email 
      }, 
      config.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // 7. Return user data without password
    const userData = newUser.toSafeObject();

    res.status(201).json({
      isSuccess: true,
      message: "User signed up successfully ✅",
      data: { 
        user: userData,
        token: token
      },
    });
  } catch (err) {
    console.log("---error in user signup---", err.message);

    // user account already exists
    if (err.code === 11000) {
      return res.status(409).json({
        isSuccess: false,
        message: "User already exists with this email",
        data: {},
      });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({
        isSuccess: false,
        message: "Validation Error",
        data: { errors: err.errors },
      });
    }

    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
      data: {},
    });
  }
};

const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        isSuccess: false,
        message: "User not found",
        data: {},
      });
    }

    // 2. Check password match using bcrypt
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        isSuccess: false,
        message: "Invalid password",
        data: {},
      });
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email 
      }, 
      config.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // 4. Return user data without password
    const userData = user.toSafeObject();

    res.status(200).json({
      isSuccess: true,
      message: "User logged in successfully ✅",
      data: { 
        user: userData,
        token: token
      },
    });
  } catch (err) {
    console.log("---error in user login---", err.message);
    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
      data: {},
    });
  }
};

const refreshTokenController = async (req, res) => {
  try {
    const { id, email } = req.user;
    
    // Generate new token
    const newToken = jwt.sign(
      { 
        id, 
        email 
      }, 
      config.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.status(200).json({
      isSuccess: true,
      message: "Token refreshed successfully",
      data: { 
        token: newToken,
        user: req.user
      },
    });
  } catch (err) {
    console.log("---error in token refresh---", err.message);
    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
      data: {},
    });
  }
};

module.exports = { userSignupController, userLoginController, refreshTokenController };
