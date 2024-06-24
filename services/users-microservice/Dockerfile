FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
COPY wait-for-it.sh /usr/src/app/wait-for-it.sh
RUN chmod +x /usr/src/app/wait-for-it.sh
RUN npm run build
EXPOSE 3000
CMD ["./wait-for-it.sh", "rabbitmq", "5672", "--", "node", "-r", "dotenv/config", "dist/main"]

