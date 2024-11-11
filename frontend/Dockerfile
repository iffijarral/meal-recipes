# Step 1: Use official Node.js image as base image
FROM node:23-alpine

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (or yarn.lock) into the container
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application files into the container
COPY . .

# Step 6: Expose port 3000 (Vite default port)
EXPOSE 3000

# Step 7: Start the Vite dev server
CMD ["npm", "run", "dev"]
