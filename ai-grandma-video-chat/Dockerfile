# Use Node.js 18 as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy client and server package.json
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install client and server dependencies
RUN cd client && npm install
RUN cd server && npm install

# Copy the rest of the code
COPY . .

# Build client and server
RUN npm run build

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["npm", "start"] 