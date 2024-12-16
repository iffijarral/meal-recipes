// src/services/user.service.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUserDocument, User } from "../models/User.js";
import { handleEmailVerification } from "./verificationService.js";
import { userSchema } from "../validators/userSchema.js";
import { ILoginInput, IUser, IUserInput, IUserUpdateInput } from "../interfaces/interfaces.js";
import { loginSchema } from "../validators/loginSchema.js";
import mongoose from "mongoose";
import { updateUserSchema } from "../validators/updateUserSchema.js";

export const userService = {
  // Creating a new user 
  createUser: async (input: IUserInput) => {
    const { error } = userSchema.validate(input);
    if (error) {
      throw new Error(`Validation failed: ${error.details.map(e => e.message).join(", ")}`);
    }

    const newUser = new User({ ...input });
    await newUser.save();

    await handleEmailVerification(newUser.id);
    return newUser;
  },
  authenticate: async (input: ILoginInput) => {

    const { error } = loginSchema.validate(input);

    if (error) {
      throw new Error(`Validation failed: ${error.details.map(e => e.message).join(", ")}`);
    }

    const user = await userService.getUserByEmail(input.email); // Fetch user by email through service

    if (!user) {
      throw new Error("User not found");
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }
    if (!user.isVerified) {
      throw new Error("User is not verified");
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    return { token, user };
  },
  // Fetch user by ID
  getUserById: async (id: string) => {

    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   throw new Error('Invalid user ID');
    // }

    const userDoc = await User.findById(id);
    if (!userDoc) {
      throw new Error("User not found");
    }

    // Transform Mongoose document to plain object
    const user: IUser = {
      id: userDoc._id.toString(), // Map `_id` to `id`
      name: userDoc.name,
      email: userDoc.email,
      isActive: userDoc.isActive,
      isVerified: userDoc.isVerified,
      role: userDoc.role
    };

    return user;
  },

  // Fetch all users 

  getAllUsers: async ({ limit, offset }: { limit?: number; offset?: number }) => {

    try {

      // Apply pagination using limit and offset 

      const users = await User.find({ role: 'user' })

        .skip(offset || 0) // Skip a number of results based on the offset (default is 0) 

        .limit(limit || 10); // Limit the number of results (default is 10) 

      return users.map((user) => {

        return transformUser(user as IUserDocument);

      }) || [];

    } catch (error) {

      console.error("Error fetching users:", error);

      throw new Error("Failed to fetch users");

    }

  },
  // Fetch all users
  // getAllUsers: async () => {
  //   return await User.find({});
  // },
  // Delete a meal
  deleteUser: async (id: string) => {
    try {
      const deleteUser = await User.findByIdAndDelete(id);

      if (!deleteUser) {
        return {
          success: false,
          message: "User deletion failed",
          userId: null,
        };
      } else {
        return {
          success: true,
          message: "User deleted successfully.",
          userId: deleteUser.id,
        };
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      return { success: false, message: "Error deleting user" };
    }
  },

  // Update a meal
  updateUser: async (id: string, userData: IUserUpdateInput) => {
    try {
      const { error } = updateUserSchema.validate(userData); 
      if (error) {
        throw new Error(`Validation failed: ${error.details.map(e => e.message).join(", ")}`);
      }

      const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });

      if (!updatedUser) {
        throw new Error("User not found");
      }
      
      // Check if meal.user is populated
      return transformUser(updatedUser as IUserDocument) || {};      

    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Failed to update the user");
    }

  },
  // Fetch user by email
  getUserByEmail: async (email: string) => {
    const user = await User.findOne({ email });
    return user || null;
  },
};


const transformUser = (user: IUserDocument): IUser => ({

  id: user._id.toString(),

  name: user.name,

  email: user.email,

  role: user.role,

  isActive: user.isActive,

  isVerified: user.isVerified,

  createdAt: user.createdAt,

  updatedAt: user.updatedAt,

}); 