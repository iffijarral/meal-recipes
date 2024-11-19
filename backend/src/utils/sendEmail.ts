import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import { User } from '../models/User.js';

export const sendVerificationEmail = async (userId: mongoose.Schema.Types.ObjectId, token: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking the following link: ${process.env.VITE_BASE_URL}verify-email?token=${token}`,
  };

  await transporter.sendMail(mailOptions);
};
