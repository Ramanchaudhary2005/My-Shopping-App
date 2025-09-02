const express = require("express");
const { userSignupController, userLoginController, refreshTokenController } = require("./controllers");
const { userSignupValidator, userLoginValidator } = require("./dto");
const { validateOtpMiddleware } = require("../otps/middleware");
const { authenticateToken } = require("./middleware");

const authRouter = express.Router();

authRouter.post("/signup", userSignupValidator, validateOtpMiddleware, userSignupController);
authRouter.post("/login", userLoginValidator, userLoginController);
authRouter.post("/refresh", authenticateToken, refreshTokenController);

module.exports = { authRouter };