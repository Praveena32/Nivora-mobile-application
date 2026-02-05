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

# Expose the port (HF Space uses 7860)
ENV PORT=7860
EXPOSE 7860

# Start the application
CMD [ "node", "index.js" ]
