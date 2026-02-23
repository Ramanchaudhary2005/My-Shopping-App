const nodemailer = require("nodemailer");

const smtpUser = process.env.SMTP_USER || process.env.SMPT_USER;
const smtpPassword = process.env.SMTP_PASSWORD || process.env.SMPT_PASSWORD;
const hasSmtpCredentials = Boolean(smtpUser && smtpPassword);
const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpSecure = process.env.SMTP_SECURE
  ? process.env.SMTP_SECURE === "true"
  : false;

const transportConfig = {
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT || 30000),
  greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT || 30000),
  socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT || 30000),
};

if (hasSmtpCredentials) {
  transportConfig.auth = {
    user: smtpUser,
    pass: smtpPassword,
  };
}

const transporter = nodemailer.createTransport(transportConfig);

if (hasSmtpCredentials) {
  (async () => {
    try {
      await transporter.verify();
      console.log("Ready to send emails");
    } catch (err) {
      console.error("Error in email verification:", err.message);
    }
  })();
} else {
  console.warn("SMTP credentials are missing. Set SMTP_USER/SMTP_PASSWORD (or SMPT_USER/SMPT_PASSWORD).");
}

const sendEmail = async (toEmail, subject, htmlText) => {
  if (!hasSmtpCredentials) {
    throw new Error("Email sending failed: SMTP credentials are not configured");
  }

  try {
    const info = await transporter.sendMail({
      from: `"My-Shopping-App-Verification" <${smtpUser}>`,
      to: toEmail,
      subject,
      html: htmlText,
    });

    console.log("Message sent:", info.messageId);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error in sending email:", err.message);
    throw new Error(`Email sending failed: ${err.message}`);
  }
};

const sendOtpEmail = async (toEmail, otp) => {
  const subject = "OTP for My Shopping App";
  const htmlText = `<h1>Your OTP is ${otp}</h1>`;
  await sendEmail(toEmail, subject, htmlText);
};

const buildOrderSuccessEmailHtml = (order) => {
  const itemsHtml = (order.items || [])
    .map(
      (item) => `
    <tr>
      <td style="padding:6px 8px;border-bottom:1px solid #eee;">${item.name || item.title || "Item"}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #eee;">${item.quantity || 1}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #eee;">&#8377;${((item.price || 0) * 88).toFixed(0)}</td>
    </tr>
  `
    )
    .join("");

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;padding:16px;color:#111;">
      <h2>Order Placed Successfully</h2>
      <p>Thank you for your purchase! Your order has been placed successfully.</p>
      <p><strong>Order Number:</strong> ${order.orderNumber}</p>
      <table style="border-collapse:collapse;width:100%;margin-top:12px;">
        <thead>
          <tr>
            <th style="text-align:left;padding:6px 8px;border-bottom:2px solid #333;">Item</th>
            <th style="text-align:left;padding:6px 8px;border-bottom:2px solid #333;">Qty</th>
            <th style="text-align:left;padding:6px 8px;border-bottom:2px solid #333;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      <p style="margin-top:12px;"><strong>Total:</strong> &#8377;${(Number(order.totalAmount || 0) * 88).toFixed(0)}</p>
      <p>Status: ${order.status}</p>
    </div>
  `;
};

const sendOrderSuccessEmail = async (toEmail, order) => {
  const subject = `Your order ${order.orderNumber} is confirmed`;
  const html = buildOrderSuccessEmailHtml(order);
  await sendEmail(toEmail, subject, html);
};

module.exports = { sendOtpEmail, sendEmail, sendOrderSuccessEmail };
