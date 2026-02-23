const { OtpModel } = require("../../../models/otpSchema");
const { sendOtpEmail } = require("../../../utils/emailhelper");

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

        await Promise.race([
            sendOtpEmail(email, otp),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Email service timeout")), 20000)
            ),
        ]);

        // save in DB
        await OtpModel.create({ email, otp });

        console.log("Generated OTP:", otp); // now otp exists

        // send success response
        return res.status(201).json({
            isSuccess: true,
            message: "OTP sent successfully",
        });
    } catch (err) {
        console.error("Error in sendOtpController:", err);
        const failureReason = err?.message || "Failed to send OTP email";
        return res.status(500).json({
            isSuccess: false,
            message: failureReason,
            data: {},
        });
    }
};

module.exports = { sendOtpController };
