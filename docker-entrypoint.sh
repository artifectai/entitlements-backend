#!/bin/sh

echo "Waiting for db to be ready..."
./wait-for-it.sh db 5432 -- echo "db:5432 is available - executing command"

echo "Dropping all tables..."
npx sequelize-cli db:migrate:undo:all --config sequelize-config.js

echo "Running migrations..."
npx sequelize-cli db:migrate --config sequelize-config.js

echo "Running seeders..."
npx sequelize-cli db:seed:all --config sequelize-config.js

echo "Starting application..."
npm run start
