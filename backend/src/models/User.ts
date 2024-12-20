import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the User interface
interface IUserDocument extends Document {  
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  isActive: boolean;
  isVerified: boolean;  
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(password: string): Promise<boolean>;
}

// Define the User schema
const userSchema: Schema<IUserDocument> = new mongoose.Schema({
  name: {
    type: String,
    required: true    
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isActive: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  
}, { timestamps: true });

// Hash the password before saving the user document
userSchema.pre<IUserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUserDocument>('User', userSchema);

export { User, IUserDocument }
