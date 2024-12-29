import { config } from "dotenv";
import { Response } from "express";
import { transformUser, userService } from "../services/userService.js";
import { ILoginInput, IUser, IUserInput, IUserUpdateInput, MyContext } from "../interfaces/interfaces.js";
import { checkPermissionMutation, checkPermissionQuery } from "../utils/checkPermission.js";


config(); // To access env variables

export const userResolvers = {
  Query: {
    userInfo: async (_: any, __: any, context: { res: Response; user?: IUser }) => {
      
      const { user } = context;

      if (!user) {
        throw new Error('Not authenticated');
      }
             
      return user;
    },
    user: async (_: any, { id }: { id: string }, context: { user: IUser }): Promise<IUser | null> => {

      const { user } = context;

      if (!user) {
        throw new Error('Not authenticated');
      }

      checkPermissionQuery('user', user);

      try {
        return await userService.getUserById(id); // Use service to fetch user
      } catch (error) {
        console.error("Error fetching user in user resolver:", error);
        throw new Error("Failed to fetch user");
      }
    },
    users: async (_: any, { limit, offset }: { limit?: number; offset?: number }, context: { user: IUser }): Promise<IUser[] | []> => {

      const { user } = context;

      if (!user) {
        throw new Error('Not authenticated');
      }

      checkPermissionQuery('users', user);

      try {

        return await userService.getAllUsers({ limit, offset }); // Use service to fetch all users 

      } catch (error) {

        console.error("Error fetching users in user resolver:", error);

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
          console.error('Signup error in resolver:', error.message);
          throw new Error(error.message || "Signup failed");
        } else {
          throw new Error("Signup failed");
        }
      }
    },

    login: async (_: any, { input }: { input: ILoginInput }, { res }: { res: Response }) => {
      try {
        return await userService.authenticate(input, res);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Login error:', error.message);
          throw new Error(error.message || "Login failed");
        } else {
          throw new Error("Login failed");
        }
      }
    },
    logout: async (_: any, __: any, context: { res: Response; user?: IUser }) => {
      try {
        const { res, user } = context;

        if (!user) {
          throw new Error('Not authenticated');
        }

        checkPermissionMutation('logout', user);


        res.cookie('token', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          expires: new Date(0), // Set the cookie to expire immediately
        });
        return { success: true };
      } catch (error) {
        console.error('Logout error in resolver:', error);
        throw new Error("Logout failed");
      }
    },
    updateUser: async (_: any, { id, input }: { id: string, input: IUserUpdateInput }, context: { user: IUser }): Promise<IUser | {}> => {

      const { user } = context;

      try {
        
        if (!user) {
          throw new Error('Not authenticated');
        }

        checkPermissionMutation('updateUser', user);

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
    deleteUser: async (_: any, { id }: { id: string }, context: { user: IUser }): Promise<{ success: boolean, message: string, userId: string } | {}> => {

      const { user } = context;

      try {

        checkPermissionMutation('deleteUser', user);

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


