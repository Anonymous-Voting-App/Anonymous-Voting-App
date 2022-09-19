FROM node:lts
WORKDIR /app
COPY . .
RUN npm install --production
RUN npm run build
EXPOSE 8080
CMD [ "node", "./build/app.js" ]
