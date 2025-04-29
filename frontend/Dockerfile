# frontend/Dockerfile
FROM node:20.17-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine

COPY ./dist /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY ./certs/frontend /etc/nginx/certs

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]