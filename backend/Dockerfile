FROM node:lts as build

WORKDIR /app
COPY . .

RUN npm ci
RUN npm run build

FROM node:lts-slim

# Required because of slim image
RUN apt-get update && apt-get install -y openssl libssl-dev curl

WORKDIR /app

COPY ./prisma /app/prisma
COPY ./package*.json /app/

RUN npm ci --omit=dev

COPY --from=build /app/build /app/build

EXPOSE 8080

ENTRYPOINT [ "node", "./build/app.js" ]
