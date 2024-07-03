FROM node:18

WORKDIR /entitlements-backend

COPY package*.json ./
RUN npm install

COPY . .
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

RUN apt-get update && apt-get install -y netcat-openbsd

COPY sequelize-config.js /entitlements-backend/sequelize-config.js
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

COPY migrations /entitlements-backend/migrations

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["/docker-entrypoint.sh"]
