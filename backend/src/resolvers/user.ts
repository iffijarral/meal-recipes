import { config } from "dotenv";
import { userService } from "../services/userService.js";
import { ILoginInput, IUserInput } from "../interfaces/interfaces.js";

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

    login: async (_: any, { input }: { input: ILoginInput }) => {
      try {
        return await userService.authenticate(input);
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
