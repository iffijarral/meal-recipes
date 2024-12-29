import express, { Request, Response } from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import http from "http";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs'; // Middleware for file uploads
import { connectDatabase } from '../config/database.js'; // Your database connection
import { resolvers } from "../resolvers/index.js"; // Your GraphQL schema definitions
import { typeDefs } from "../schemas/index.js";
import bodyParser from "body-parser";
import path from 'path';
import authMiddleware from '../middleware/auth.js'
import { IUser, MyContext } from "../interfaces/interfaces.js";




const createServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);  

  // Database connection
  await connectDatabase();

  // Cookie middleware
  app.use(cookieParser());

  

  // Initialize Apollo Server
  const server = new ApolloServer<MyContext>({
    csrfPrevention: true,
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],    
  });

  // Start Apollo Server
  await server.start(); 

  // auth middleware
  app.use(authMiddleware);

  // Apply Apollo middleware
  app.use(
    "/api/graphql",
    cors<Request>({
      origin: 'http://medborgerskabsprove.dk',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    }), // Add generic typing to `cors` if needed      
    bodyParser.json(),
    // graphqlUploadExpress(), // Middleware for file uploads
    expressMiddleware(server, {      
      context: async ({ req, res }: { req: Request, res: Response }): Promise<MyContext> => {        
        return {        
          req,
          res,
          user: req.user as IUser,
        };
      },
    })
  );

  // Serve static files (e.g., uploaded images)
  const uploadsPath = path.join(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsPath));  

  return { app, httpServer };
};

export default createServer;
