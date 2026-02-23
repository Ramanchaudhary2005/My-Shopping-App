const nodemailer = require("nodemailer");

const smtpUser = process.env.SMPT_USER;
const smtpPassword = process.env.SMPT_PASSWORD;
const hasSmtpCredentials = Boolean(smtpUser && smtpPassword);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: smtpUser,
    pass: smtpPassword,
  },
});

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
  console.warn("SMTP credentials are missing. Email sending is disabled.");
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
    throw new Error("Email sending failed");
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
