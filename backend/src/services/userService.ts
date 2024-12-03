// src/services/user.service.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { handleEmailVerification } from "./verificationService.js";
import { userSchema } from "../validators/userSchema.js";
import { ILoginInput, IUserInput } from "../interfaces/interfaces.js";
import { loginSchema } from "../validators/loginSchema.js";

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
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },

  // Fetch all users
  getAllUsers: async () => {
    return await User.find({});
  },

  // Fetch user by email
  getUserByEmail: async (email: string) => {
    const user = await User.findOne({ email });
    return user || null;
  },
};
