FROM node:lts as build

WORKDIR /app
COPY . /app

RUN npm ci
RUN npm run build

FROM nginx:stable

WORKDIR /etc/nginx
COPY --from=build /app/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]
