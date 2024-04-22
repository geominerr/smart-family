FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

CMD  npx prisma generate && npx prisma migrate deploy && npm run start:dev
