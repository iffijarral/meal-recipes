import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { userService } from "../services/userService.js";
import { IUser } from "../models/User.js";
import { IUserInput } from "../interfaces/interfaces.js";

config(); // To access env variables

export const userResolvers = {
  Query: {
    user: async (_: any, { id }: { id: string }) => {
      try {
        return await userService.getUserById(id); // Use service to fetch user
      } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Failed to fetch user");
      }
    },
    users: async () => {
      try {
        return await userService.getAllUsers(); // Use service to fetch all users
      } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
      }
    },
  },

  Mutation: {
    signup: async (_: any, { input }: { input: IUserInput }) => {
      try {        
        const newUser = await userService.createUser(input); 
        return newUser;
      } catch (error) { 
        if (error instanceof Error) {
          console.error('Signup error:', error.message);
          throw new Error(error.message || "Signup failed");
        } else {
          throw new Error("Signup failed");
        }                
      }
    }, 

    login: async (_: any, { email, password }: any) => {
      try {
        const user = await userService.getUserByEmail(email); // Fetch user by email through service
        if (!user) {
          throw new Error("User not found");
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }
        if (!user.isVerified) {
          throw new Error("User is not verified");
        }

        // Generate JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

        return { token, user };
      } catch (error) {
        if (error instanceof Error) {
          console.error('Login error:', error.message);
          throw new Error(error.message || "Login failed");
        } else {
          throw new Error("Login failed");
        }   
      }
    },
  },
};
