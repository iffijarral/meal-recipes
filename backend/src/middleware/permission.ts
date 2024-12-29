import { IUser } from '../interfaces/interfaces.js';

const permissions = {
  Mutation: {
    updateUser: ['admin'],
    deleteUser: ['admin'],
    logout: ['user', 'admin'],
  },
  Query: {
    user: ['admin'],
    users: ['admin'],
  },
} as const;

type PermissionType = keyof typeof permissions;
type OperationType<T extends PermissionType> = keyof typeof permissions[T];

const checkPermission = <T extends PermissionType>(type: T, operation: OperationType<T>, user: IUser) => {
  const roles = permissions[type][operation] as readonly string[];
  if (!roles || !user) {
    throw new Error('Not authorized');
  }
  if (!roles.includes(user.role)) {
    throw new Error('Access denied');
  }
  return true;
};

export const withPermissions = <T extends PermissionType>(
  type: T,
  operation: OperationType<T>,
  resolver: any
) => {
  return async (parent: any, args: any, context: { user: IUser }, info: any) => {
    const { user } = context;
    checkPermission(type, operation, user);
    return resolver(parent, args, context, info);
  };
};