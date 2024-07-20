// src/server/utils/emailService.ts

import nodemailer from 'nodemailer';

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_PASS, // Your Gmail password or App Password
  },
});

// Function to send email
export const sendVerificationEmail = (to: string, verificationCode: string) => {
  const mailOptions = {
    from: process.env.GMAIL_USER, // Sender address
    to, // List of recipients
    subject: 'Email Verification Code', // Subject line
    text: `Your verification code is: ${verificationCode}`, // Plain text body
    html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`, // HTML body
  };

  return transporter.sendMail(mailOptions);
};
