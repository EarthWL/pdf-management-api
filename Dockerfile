# Use an official Node.js runtime as a parent image
FROM node:21-bullseye-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of your application's source code to the container
COPY . .

# Expose the port your app will run on
EXPOSE 4000

# Define the command to run your Node.js app
CMD ["node", "index.mjs"]
