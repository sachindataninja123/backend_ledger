require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcomw to Backend Ledger!";
  const text = `Hello ${name} , \n\nThank you for registering at Backend Ledger. We're excited to have you on board!\n\nBest regards,\nThe Backend Ledger Team`;
  const html = `<p>Hello ${name}, </p><p>Thank you for registering at Backend Ledger. We're excited to have you on board!</p><p>Best regards,<br>The Backend Ledger Team </p>`;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, account, toAccount) {
  const subject = "Transaction Successful";

  const text = `Hello ${name},

Your transaction has been successfully completed.

From Account: ${account}
To Account: ${toAccount}

If you did not perform this transaction, please contact support immediately.

Best regards,  
Backend Ledger Team`;

  const html = `
    <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
      
      <div style="max-width:600px; margin:auto; background:#ffffff; padding:20px; border-radius:10px;">
        
        <h2 style="color:#2c3e50;">💳 Transaction Successful</h2>
        
        <p>Hello <strong>${name}</strong>,</p>
        
        <p>Your transaction has been successfully completed.</p>

        <div style="background:#f1f1f1; padding:15px; border-radius:8px; margin:15px 0;">
          <p><strong>From Account:</strong> ${account}</p>
          <p><strong>To Account:</strong> ${toAccount}</p>
        </div>

        <p style="color:#777;">
          If you did not perform this transaction, please contact support immediately.
        </p>

        <br/>
        <p>Best regards,<br/>Backend Ledger Team</p>

      </div>

    </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}

async function sendFailedTransactionEmail(userEmail, name, account, toAccount) {
  const subject = "⚠️ Transaction Failed";

  const text = `Hello ${name},

We regret to inform you that your recent transaction could not be completed.

From Account: ${account}
To Account: ${toAccount}

No amount has been deducted from your account.

If the issue persists, please try again later or contact support.

Best regards,  
Backend Ledger Team`;

  const html = `
    <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
      
      <div style="max-width:600px; margin:auto; background:#ffffff; padding:20px; border-radius:10px;">
        
        <h2 style="color:#e74c3c;">⚠️ Transaction Failed</h2>
        
        <p>Hello <strong>${name}</strong>,</p>
        
        <p style="color:#555;">
          We regret to inform you that your transaction could not be completed.
        </p>

        <div style="background:#fff3f3; padding:15px; border-radius:8px; margin:15px 0;">
          <p><strong>From Account:</strong> ${account}</p>
          <p><strong>To Account:</strong> ${toAccount}</p>
        </div>

        <p style="color:#777;">
          <strong>No amount has been deducted.</strong>
        </p>

        <p style="color:#777;">
          Please try again after some time. If the issue continues, contact support.
        </p>

        <hr style="margin:20px 0;" />

        <p style="font-size:13px; color:#999;">
          This is an automated alert from Backend Ledger.
        </p>

        <br/>
        <p>Best regards,<br/>Backend Ledger Team</p>

      </div>

    </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendRegistrationEmail,
  sendTransactionEmail,
  sendFailedTransactionEmail,
};
