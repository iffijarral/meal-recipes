import createServer from "./config/server.js";
import { verifyEmail } from "./controllers/verificationController.js";
import { limiter } from "./utils/limitAttempts.js";

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    const app = await createServer();

    // More routes
    app.get('/verify-email', limiter, verifyEmail);
    
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
