# Use Node.js 20 as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json from the backend folder
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend files
COPY backend/ .

# Expose the port the app runs on (Render/HF typically use 7860 for Spaces)
ENV PORT=7860
EXPOSE 7860

# Start the application
CMD [ "node", "index.js" ]
