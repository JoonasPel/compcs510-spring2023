FROM node:19-slim
WORKDIR /app-image
COPY package*.json .
COPY . /app-image

RUN npm ci
EXPOSE 3000
CMD ["node", "server_b.js"]

FROM base as dev
RUN apk add --no-cache bash
RUN wget -O /bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /bin/wait-for-it.sh