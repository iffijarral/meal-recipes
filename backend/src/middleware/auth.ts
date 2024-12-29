import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUserDocument, User } from '../models/User.js' // Adjust the import based on your project structure
import asyncHandler from '../utils/asyncHandler.js'; // Import the asyncHandler
import { IUser } from '../interfaces/interfaces.js';
import { transformUser } from '../services/userService.js';

interface AuthenticatedRequest extends Request {
  user?: IUser | null; // Replace `any` with your user type if available
}

const authMiddleware = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies.token;  
  if (!token) {
    req.user = null; // No token, no user
    return next();
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    if (!decoded) {
      req.user = null; // No token, no user
      return next();
    }
    const userDoc = await User.findById(decoded.userId); // Fetch user from database
    if (!userDoc) {
      res.status(401).json({ message: 'User not found.' });
      return;
    }
    const user: IUser = {
      id: userDoc._id.toString(), // Map `_id` to `id`
      name: userDoc.name,
      email: userDoc.email,
      isActive: userDoc.isActive,
      isVerified: userDoc.isVerified,
      role: userDoc.role
    };
    
    req.user = user; // Attach the user information as plain object to the request object        
    next();
  } catch (ex) {
    console.error('Authentication error:', ex);

    // Gracefully handle JWT errors and log them
    if (ex instanceof jwt.TokenExpiredError || ex instanceof jwt.JsonWebTokenError) {
      console.warn('Invalid or expired token:', ex.message);
    } else {
      console.error('Unexpected error during authentication:', ex);
    }

    req.user = null; // Clear user in case of any errors
    return next(); // Proceed to the next middleware/handler
  }
});

export default authMiddleware;