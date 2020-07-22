# node.js base image
FROM node:14-alpine

# server info
RUN node -v
RUN npm -v

# working directory
WORKDIR /app
COPY ./.npmrc /app/.npmrc
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
RUN npm install --production

# start server
CMD ["npm", "run", "start"]