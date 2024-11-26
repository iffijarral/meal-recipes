import createServer from "./config/server.js";
import { verifyEmail } from "./controllers/verificationController.js";
import { limiter } from "./utils/limitAttempts.js";

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    const app = await createServer();

    // More routes
    app.get('/api/verify-email', limiter, verifyEmail);
    
    
    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

// Call the function to start the server
startServer();

// npm install @apollo/server express graphql cors body-parser graphql-upload
// Install necessary packages:
// npm install @apollo/server express graphql cors body-parser graphql-upload @types/express @types/cors @types/body-parser

// import { ApolloServer } from "@apollo/server";
// import { expressMiddleware } from "@apollo/server/express4";
// import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
// import express, { Request, Response } from "express";
// import http from "http";
// import cors from "cors";
// import bodyParser from "body-parser";
// import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";
// import { typeDefs, resolvers } from "./schema.js"; // Ensure schema.mjs is ESM-compliant

// // Initialize Express and HTTP Server
// const app = express();
// const httpServer = http.createServer(app);

// // Initialize Apollo Server with type definitions, resolvers, and plugins
// const server = new ApolloServer({
//   csrfPrevention: false,
//   typeDefs,
//   resolvers,
//   plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
// });

// // Start the Apollo Server
// await server.start();

// // Middleware configuration
// app.use(
//   "/",
//   cors<Request>(), // Add generic typing to `cors` if needed
//   bodyParser.json(),
//   graphqlUploadExpress(), // Middleware for file uploads
//   expressMiddleware(server, {
//     context: async ({ req }: { req: Request }) => ({
//       token: req.headers.token, // Access token from headers
//     }),
//   })
// );

// // Start HTTP Server
// await new Promise<void>((resolve) =>
//   httpServer.listen({ port: 4000 }, resolve)
// );

// console.log(`🚀 Server ready at http://localhost:4000/`);
