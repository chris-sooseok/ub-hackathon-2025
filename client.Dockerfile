FROM node:20-bookworm-slim AS build
WORKDIR /app
COPY client/package*.json ./
RUN npm ci
COPY client/ .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build


FROM nginx:1.27-alpine
# copy the built frontend files into Nginx's web root directory
COPY --from=build /app/dist /usr/share/nginx/html
# replace the default Nginx side config with custom config
COPY client/nginx.conf /etc/nginx/conf.d/default.conf