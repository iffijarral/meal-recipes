import express, { Request, Response } from "express";
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import http from "http";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { buildSubgraphSchema } from '@apollo/subgraph'; // Use if part of federation
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs'; // Middleware for file uploads
import { connectDatabase } from '../config/database.js'; // Your database connection
import { resolvers } from "../resolvers/index.js"; // Your GraphQL schema definitions
import { typeDefs } from "../schemas/index.js";
// import { resolvers } from '../resolvers/index.js'; // Your resolvers
// import { typeDefs, resolvers } from "../schema.js";
import bodyParser from "body-parser";
import path from 'path';

// Optional logging utilities
// import { logger } from '../utils/logger.js';
// import expressWinston from 'express-winston';
console.log('Resolvers:', JSON.stringify(resolvers, null, 2));
const createServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);
  // Enable CORS
  // app.use(cors());

  // File Upload Middleware (this must come before Apollo middleware)
 

  // Parse incoming JSON
  // app.use(express.json());

  // Logging middleware (optional)
  // app.use(
  //   expressWinston.logger({
  //     winstonInstance: logger,
  //     meta: true,
  //     msg: "HTTP {{req.method}} {{req.url}}",
  //     expressFormat: true,
  //     colorize: false,
  //   })
  // );

  // Database connection
  await connectDatabase();

  // Initialize Apollo Server
  const server = new ApolloServer({
    csrfPrevention: false,
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  // Start Apollo Server
  await server.start();

  // Apply Apollo middleware
  app.use(
    "/",
    cors<Request>(), // Add generic typing to `cors` if needed
    bodyParser.json(),
    graphqlUploadExpress(), // Middleware for file uploads
    expressMiddleware(server, {
      context: async ({ req }: { req: Request }) => ({
        token: req.headers.token, // Access token from headers
      }),
    })
  );

  // Serve static files (e.g., uploaded images)
  const uploadsPath = path.join(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsPath));

  // Fallback route
  app.use((req, res) => {
    res.status(404).send({ error: "Endpoint not found." });
  });

  return app;
};

export default createServer;
