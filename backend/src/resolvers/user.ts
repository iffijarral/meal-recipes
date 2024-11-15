import  { User } from '../models/User.js'; 

export const userResolvers = {
    Query: {
      user: async (_: any, { id }: { id: string }) => {
        return await User.findById(id);
      },
      users: async () => {
        return await User.find({});
      }     
    },
    Mutation: {
      addUser: async (
        _: any,
        { name, email, password, role }: any
      ) => {
        const user = new User({
          name,
          email,
          password,
          role
        });
        return await user.save();
      },
    },
  };
  
  