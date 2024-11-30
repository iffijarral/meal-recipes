import mongoose from 'mongoose';
import { Verification, IVerification } from '../models/verification.js';
import { User, IUserDocument } from '../models/User.js';
import { generateToken } from '../utils/tokenGenerator.js';
import { sendVerificationEmail } from '../utils/sendEmail.js';

export const handleEmailVerification = async (userId: mongoose.Schema.Types.ObjectId) => {
  const token = generateToken();
  const verification: IVerification = new Verification({
    userId,
    verificationToken: token,
    verificationTokenExpires: new Date(Date.now() + 3600000), // 1 hour expiration
  });
  await verification.save();
  await sendVerificationEmail(userId, token);  
};

export const verifyToken = async (token: string) => {
  const verification = await Verification.findOne({ verificationToken: token });
  if (!verification || verification.verificationTokenExpires.getTime() < Date.now()) {
    throw new Error('Token is invalid or has expired');
  }
  const user: IUserDocument | null = await User.findById(verification.userId);
  if (user) {
    user.isVerified = true;
    user.isActive = true;
    await user.save();
  }

  console.log(`User ${verification._id} verified their email at ${new Date().toISOString()}`);
  await Verification.deleteOne({ _id: verification._id });  
};
