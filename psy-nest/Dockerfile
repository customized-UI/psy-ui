FROM node:18.17 

WORKDIR /app

ADD . ./

RUN npm install

RUN npm run build

ENV NODE_ENV=production

CMD node dist/src/main