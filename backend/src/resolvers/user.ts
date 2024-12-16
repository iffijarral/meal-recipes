import { config } from "dotenv";
import { userService } from "../services/userService.js";
import { ILoginInput, IUser, IUserInput, IUserUpdateInput } from "../interfaces/interfaces.js";

config(); // To access env variables

export const userResolvers = {
  Query: {
    user: async (_: any, { id }: { id: string }): Promise<IUser | null> => {
      try {
        return await userService.getUserById(id); // Use service to fetch user
      } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Failed to fetch user");
      }
    },
    users: async (_: any, { limit, offset }: { limit?: number; offset?: number }): Promise<IUser[] | []> => {

      try {

        return await userService.getAllUsers({ limit, offset }); // Use service to fetch all users 

      } catch (error) {

        console.error("Error fetching users:", error);

        throw new Error("Failed to fetch users");

      }

    },
    // users: async () => {
    //   try {
    //     return await userService.getAllUsers(); // Use service to fetch all users
    //   } catch (error) {
    //     console.error("Error fetching users:", error);
    //     throw new Error("Failed to fetch users");
    //   }
    // },
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
        console.log('in resolver before authentication');
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
    updateUser: async (_: any, { id, input }: { id: string, input: IUserUpdateInput }): Promise<IUser | {}> => {

      try {

        return await userService.updateUser(id, input);

      } catch (error) {

        if (error instanceof Error) {

          console.error('Error during user delete operation:', error.message);

          throw new Error(error.message);

        } else {

          console.error('Unexpected error:', error);

          throw new Error('Unexpected error during user deletion');

        }

      }

    },
    deleteUser: async (_: any, { id }: { id: string }): Promise<{ success: boolean, message: string, userId: string } | {}> => {

      try {

        return await userService.deleteUser(id);

      } catch (error) {

        if (error instanceof Error) {

          console.error('Error during user delete operation:', error.message);

          throw new Error(error.message);

        } else {

          console.error('Unexpected error:', error);

          throw new Error('Unexpected error during user deletion');

        }

      }

    },
  },
};
