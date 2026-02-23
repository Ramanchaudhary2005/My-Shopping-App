const { OtpModel } = require("../../../models/otpSchema");
const { sendOtpEmail } = require("../../../utils/emailhelper");

const OTP_EMAIL_TIMEOUT_MS = Number(process.env.OTP_EMAIL_TIMEOUT_MS || 20000);

const sendOtpWithTimeout = (email, otp) =>
    Promise.race([
        sendOtpEmail(email, otp),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Email service timeout")), OTP_EMAIL_TIMEOUT_MS)
        ),
    ]);

const sendOtpController = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                isSuccess: false,
                message: "Email is required",
                data: {},
            });
        }

        // generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        await sendOtpWithTimeout(email, otp);

        // save in DB
        await OtpModel.create({ email, otp: String(otp) });

        console.log("Generated OTP:", otp); // now otp exists

        // send success response
        return res.status(201).json({
            isSuccess: true,
            message: "OTP sent successfully",
            data: {},
        });
    } catch (err) {
        console.error("Error in sendOtpController:", err);
        return res.status(500).json({
            isSuccess: false,
            message: "Failed to send OTP email",
            data: {},
        });
    }
};

module.exports = { sendOtpController };
