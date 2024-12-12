import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import { User } from '../models/User.js';

export const sendVerificationEmail = async (userId: mongoose.Schema.Types.ObjectId, token: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true, // Enable debug output
  logger: true // Log information to console
});
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking the following link: ${process.env.VITE_BASE_URL}api/verify-email?token=${token}`,
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
};
