import { IUser } from "../interfaces/interfaces.js";

const permissions: {
    Mutation: Record<string, IUser['role'][]>;
    Query: Record<string, IUser['role'][]>;
  } = {
    Mutation: {
      updateUser: ['admin'],
      deleteUser: ['admin'],
      logout: ['user', 'admin'],
      addMeal: ['user', 'admin'],
      updateMeal: ['user', 'admin'],
      deleteMeal: ['user', 'admin'],
      uploadImage: ['user', 'admin'],
    },
    Query: {
      user: ['admin'],
      users: ['admin'],

    }
  };
  
  type MutationKeys = keyof typeof permissions.Mutation;
  
  export function checkPermissionMutation(
    operation: keyof typeof permissions.Mutation,
    user?: IUser
  ): boolean {
    const roles = permissions.Mutation[operation];
    if (!roles || !user) {
      throw new Error('Not authorized'); // User not provided or operation not found
    }
    if (!roles.includes(user.role)) {
      throw new Error('Access denied'); // User role not allowed for the operation
    }
    return true;
  }
  
  export function checkPermissionQuery(
    operation: keyof typeof permissions.Query,
    user?: IUser
  ): boolean {
    const roles = permissions.Query[operation];
    if (!roles || !user) {
      throw new Error('Not authorized'); // User not provided or operation not found
    }
    if (!roles.includes(user.role)) {
      throw new Error('Access denied'); // User role not allowed for the operation
    }
    return true;
  }
  