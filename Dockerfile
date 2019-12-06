FROM node:carbon

WORKDIR /app

COPY src ./src/
COPY webpack.config.js ./
COPY tsconfig.json ./
COPY package*.json ./

RUN npm install && \
    rm ./node_modules/sandwich-stream/dist/sandwich-stream.mjs && \
    npm run buid

CMD [ "node", "./dist/bundle.js" ]
