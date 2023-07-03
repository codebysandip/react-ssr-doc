FROM node:16.20.1-alpine3.17 AS build
# can use this arg to run build for multiple environment lik npm run build:staging
ARG env=prod
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:${env}
RUN rm -rf node_modules src
RUN npm ci --omit=dev
RUN npm install pm2 -g


FROM build as final
WORKDIR /app
COPY --from=build /app .
EXPOSE 5000
ENTRYPOINT [ "npm", "run", "pm2:start" ]
