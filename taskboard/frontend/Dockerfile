FROM node:22.22.2-alpine3.23 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY src ./src
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.30.5-alpine3.24
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
ENV FRONTEND_PORT=8080 \
    BACKEND_URL=http://backend:3000
EXPOSE 8080
