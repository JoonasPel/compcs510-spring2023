FROM node:19-slim
WORKDIR /app-image
COPY package*.json .
COPY . /app-image
RUN npm ci
EXPOSE 3000
CMD ["node", "server_a.js"]