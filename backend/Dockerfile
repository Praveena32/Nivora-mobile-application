# Use Node.js 20 as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend files
COPY . .

# Expose the port (Back4app/Railway typically use PORT env)
ENV PORT=8080
EXPOSE 8080

# Start the application
CMD [ "node", "index.js" ]
