import { IUser } from '../interfaces/interfaces.ts';
import { User } from '../models/User.js'; // Adjust the import based on your project structure

declare global {
  namespace Express {
    interface Request {
      user?: IUser | null; // Replace `User` with your actual user type
    }
  }
}