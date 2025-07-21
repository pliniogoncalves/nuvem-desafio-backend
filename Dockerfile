FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "npx prisma generate && node src/app.js"]