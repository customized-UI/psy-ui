FROM node:18.17 as builder

WORKDIR /app

ADD . ./

RUN npm install

RUN npm run build

FROM caddy:2.7

COPY --from=builder /app/dist /srv
