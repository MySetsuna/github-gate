
# A Dockerfile that works and fixes the error

# Use the official Node.js 16.20.2-alpine base image
FROM node:16.20.2-alpine

# Set the NODE_ENV environment variable to "production"
ENV NODE_ENV=production

# Set the working directory to /server
WORKDIR /server

# Copy the package.json file to /server
COPY package.json /server

# Copy the package-lock.json file to /server
COPY package-lock.json /server

# Install production
RUN dependencies npm install --production

# Copy the current directory to /server
COPY . /server

# Set the command to run the app when the container starts
CMD ["npm", "start"]
