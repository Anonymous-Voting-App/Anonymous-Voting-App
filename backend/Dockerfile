FROM node:lts

WORKDIR /app
COPY . .

RUN npm install --production
RUN npx prisma generate
RUN npm run build

EXPOSE 8080
EXPOSE 5432

ENTRYPOINT [ "node", "./build/app.js" ]
