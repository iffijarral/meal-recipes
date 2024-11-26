// src/services/user.service.ts
import { User, IUser } from "../models/User.js";
import { handleEmailVerification } from "./verificationService.js";
import { userSchema } from "../validators/userValidator.js";
import { IUserInput } from "../interfaces/interfaces.js";

export const userService = {
  // Creating a new user
  createUser: async (input: IUserInput) => {
    const { error } = userSchema.validate(input); 
    if (error) {
      throw new Error(`Validation failed: ${error.details.map(e => e.message).join(", ")}`);
    }

    const newUser = new User({...input});
    await newUser.save();

    await handleEmailVerification(newUser.id);
    return newUser;
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
