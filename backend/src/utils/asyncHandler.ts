import { Request, Response, NextFunction } from 'express';
import { IUser } from '../interfaces/interfaces.js';

interface AuthenticatedRequest extends Request {
  user?: IUser | null; // Replace `any` with your user type if available
}

const asyncHandler = (fn: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;