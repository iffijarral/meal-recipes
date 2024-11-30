import { Request, Response } from 'express';
import { Verification } from '../models/verification.js';
import { User } from '../models/User.js';
import { verifyToken } from '../services/verificationService.js';  // This can be your service layer logic

// Controller to handle the verification of the email token
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.query;
  
      if (!token) {
        res.status(400).json({ message: 'Token is required' });
      }
  
      // Call the verification service to verify the token
      await verifyToken(token as string);

      res.redirect(`${process.env.VITE_BASE_URL}verify-email-success`);
    } catch (error) {
      console.error('Email verification failed:', error);
      // res.status(400).json({ message: 'Invalid or expired token' });
      res.redirect(`${process.env.VITE_BASE_URL}verify-email-failed`);      

    }
  };
