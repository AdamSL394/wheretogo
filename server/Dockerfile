FROM node:20

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .
COPY .env.production .env

RUN npm run build

EXPOSE 8080

ENV NODE_ENV production


CMD  ["node", "dist/index.js"]

USER node