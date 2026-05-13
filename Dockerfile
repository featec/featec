# First stage: build
FROM node:16.16.0-alpine AS build
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the app's source code
COPY . .

# Run the SSR build
RUN npm run build:ssr

# Second stage: serve
FROM node:16.16.0-alpine
WORKDIR /usr/src/app

# Copy the SSR build from the previous stage
COPY --from=build /usr/src/app/dist/featec/browser /usr/src/app/browser
COPY --from=build /usr/src/app/dist/featec/server /usr/src/app/server

# Start the application using the correct file (main.js)
CMD ["node", "server/main.js"]

# Expose the port
EXPOSE 5200
