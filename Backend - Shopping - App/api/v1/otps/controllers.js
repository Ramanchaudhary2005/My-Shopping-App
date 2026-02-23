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
        let emailError = null;

        try {
            await sendOtpWithTimeout(email, otp);
        } catch (err) {
            emailError = err;
            console.error("OTP email delivery failed, using fallback OTP:", err.message);
        }

        // save in DB
        await OtpModel.create({ email, otp: String(otp) });

        console.log("Generated OTP:", otp); // now otp exists

        if (emailError) {
            return res.status(201).json({
                isSuccess: true,
                message: "OTP generated. Email delivery failed, use fallback OTP.",
                data: {
                    otp: String(otp),
                    emailSent: false,
                    reason: emailError.message,
                },
            });
        }

        // send success response
        return res.status(201).json({
            isSuccess: true,
            message: "OTP sent successfully",
            data: { emailSent: true },
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
